import ExcelJS from "exceljs";

export type CellAlignment = "left" | "center" | "right";

export interface ExcelColumn<T> {
  header: string;
  key: string;
  width?: number;
  align?: CellAlignment;
  format?: string;
  wrapText?: boolean;
  /** "date" / "datetime": string tanggal sumber dikonversi menjadi nilai tanggal Excel asli */
  type?: "date" | "datetime";
  getter: (item: T, index: number) => string | number | boolean | Date | null | undefined;
}

export interface SummaryMetric {
  label: string;
  value: string | number;
}

export interface KopSuratConfig {
  companyName: string;
  companyAddress?: string;
  companyContact?: string;
  reportTitle: string;
  periodText?: string;
  exportedAt?: string;
  exportedBy?: string;
  logoUrl?: string | null;
}

export interface ExportToExcelOptions<T> {
  fileName: string;
  sheetName: string;
  kopSurat: KopSuratConfig;
  summaryMetrics?: SummaryMetric[];
  columns: ExcelColumn<T>[];
  data: T[];
  orientation?: "portrait" | "landscape";
}

const MONTH_INDEX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, may: 4, jun: 5, jul: 6, agu: 7, aug: 7, agt: 7,
  sep: 8, okt: 9, oct: 9, nov: 10, des: 11, dec: 11,
};

/**
 * Mengonversi string tanggal sumber ("17 Nov 2026", "2026-11-18", "17 Nov 2026, 07:15 WITA",
 * "08 Nov 2026 (Disetujui)") menjadi Date (UTC, tanpa pergeseran zona waktu) agar menjadi tanggal Excel asli.
 * Mengembalikan null bila format tidak dikenali (nilai asli dipertahankan sebagai teks).
 */
function parseSourceDate(raw: string, withTime: boolean): Date | null {
  const text = raw.trim();
  let y: number;
  let m: number;
  let d: number;
  let rest = "";
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})(.*)$/);
  const indo = text.match(/^(\d{1,2})\s+([A-Za-z]{3,})\.?\s+(\d{4})(.*)$/);
  if (iso) {
    y = Number(iso[1]);
    m = Number(iso[2]) - 1;
    d = Number(iso[3]);
    rest = iso[4];
  } else if (indo) {
    const mi = MONTH_INDEX[indo[2].slice(0, 3).toLowerCase()];
    if (mi === undefined) return null;
    y = Number(indo[3]);
    m = mi;
    d = Number(indo[1]);
    rest = indo[4];
  } else {
    return null;
  }
  let hh = 0;
  let mm = 0;
  if (withTime) {
    const t = rest.match(/(\d{1,2}):(\d{2})/);
    if (t) {
      hh = Number(t[1]);
      mm = Number(t[2]);
    }
  }
  const date = new Date(Date.UTC(y, m, d, hh, mm));
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Memuat logo (blob/data/http URL) dan menormalkannya ke PNG base64 agar kompatibel dengan Excel.
 * Mengembalikan null bila logo tidak tersedia atau gagal dimuat (export tetap berjalan tanpa logo).
 */
async function loadLogoAsPng(
  url: string | null | undefined
): Promise<{ base64: string; width: number; height: number } | null> {
  if (!url || typeof document === "undefined") return null;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Logo gagal dimuat"));
      el.src = url;
    });
    const natW = img.naturalWidth || 1;
    const natH = img.naturalHeight || 1;
    const scale = Math.min(110 / natW, 72 / natH);
    const width = Math.max(1, Math.round(natW * scale));
    const height = Math.max(1, Math.round(natH * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { base64: canvas.toDataURL("image/png"), width, height };
  } catch (err) {
    console.warn("Logo kop surat dilewati:", err);
    return null;
  }
}

/**
 * Reusable utility to generate a corporate-standard .xlsx file with Dark Forest Emerald identity,
 * Kop Surat, Summary KPIs, zebra striping, proper types, and print-ready A4 settings.
 */
export async function exportToExcel<T>(options: ExportToExcelOptions<T>): Promise<boolean> {
  const {
    fileName,
    sheetName,
    kopSurat,
    summaryMetrics,
    columns,
    data,
    orientation = "landscape",
  } = options;

  if (!data || data.length === 0) {
    throw new Error("Data laporan kosong. Tidak ada data untuk diekspor ke Excel.");
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistem Absensi PWA";
  workbook.lastModifiedBy = kopSurat.exportedBy || "Admin / HRD";
  workbook.created = new Date();
  workbook.modified = new Date();

  // Excel sheet name max 31 chars and no illegal characters
  const cleanSheetName = (sheetName || "Laporan")
    .replace(/[\\/?*[\]:]/g, "")
    .trim()
    .substring(0, 31);

  const worksheet = workbook.addWorksheet(cleanSheetName, {
    views: [{ showGridLines: true }],
  });

  const totalCols = Math.max(columns.length, 6);

  // ─────────────────────────────────────────────────────────────
  // 1. KOP SURAT (Rows 1 - 4) + LOGO
  // ─────────────────────────────────────────────────────────────
  const logo = await loadLogoAsPng(kopSurat.logoUrl);
  const textCol = logo ? 3 : 1;
  if (logo) {
    const imageId = workbook.addImage({ base64: logo.base64, extension: "png" });
    worksheet.addImage(imageId, {
      tl: { col: 0.15, row: 0.1 },
      ext: { width: logo.width, height: logo.height },
    });
  }

  // Row 1: Nama Perusahaan
  const row1 = worksheet.getRow(1);
  row1.height = 24;
  row1.getCell(textCol).value = (kopSurat.companyName || "ABSENKU").toUpperCase();
  row1.getCell(textCol).font = {
    name: "Calibri",
    size: 15,
    bold: true,
    color: { argb: "FF022C19" }, // Dark Forest Emerald
  };
  row1.getCell(textCol).alignment = { vertical: "middle", horizontal: "left" };
  worksheet.mergeCells(1, textCol, 1, totalCols);

  // Row 2: Alamat & Kontak Perusahaan (Zona Waktu WITA)
  const row2 = worksheet.getRow(2);
  row2.height = 18;
  const addressInfo = [
    kopSurat.companyAddress || "Kantor Pusat - Sudirman Tower Lt. 12",
    kopSurat.companyContact || "admin@perusahaan.id",
    "Zona Waktu: WITA (Bali, UTC+8)",
  ].filter(Boolean).join("  |  ");
  row2.getCell(textCol).value = addressInfo;
  row2.getCell(textCol).font = {
    name: "Calibri",
    size: 9.5,
    color: { argb: "FF4B5563" },
  };
  row2.getCell(textCol).alignment = { vertical: "middle", horizontal: "left" };
  worksheet.mergeCells(2, textCol, 2, totalCols);

  // Row 3: Judul Laporan
  const row3 = worksheet.getRow(3);
  row3.height = 22;
  row3.getCell(textCol).value = kopSurat.reportTitle.toUpperCase();
  row3.getCell(textCol).font = {
    name: "Calibri",
    size: 12.5,
    bold: true,
    color: { argb: "FF064E3B" },
  };
  row3.getCell(textCol).alignment = { vertical: "middle", horizontal: "left" };
  worksheet.mergeCells(3, textCol, 3, totalCols);

  // Row 4: Periode & Metadata Ekspor
  const row4 = worksheet.getRow(4);
  row4.height = 18;
  const metaParts: string[] = [];
  if (kopSurat.periodText) metaParts.push(`Periode: ${kopSurat.periodText}`);
  metaParts.push(`Diekspor: ${kopSurat.exportedAt || new Date().toLocaleString("id-ID", { timeZone: "Asia/Makassar" })} WITA`);
  if (kopSurat.exportedBy) metaParts.push(`Oleh: ${kopSurat.exportedBy}`);
  metaParts.push(`Total Data: ${data.length} Baris`);

  row4.getCell(textCol).value = metaParts.join("   •   ");
  row4.getCell(textCol).font = {
    name: "Calibri",
    size: 9,
    italic: true,
    color: { argb: "FF6B7280" },
  };
  row4.getCell(textCol).alignment = { vertical: "middle", horizontal: "left" };
  worksheet.mergeCells(4, textCol, 4, totalCols);

  // Bottom border untuk Kop Surat (pemisah garis ganda)
  for (let c = 1; c <= totalCols; c++) {
    const cCell = row4.getCell(c);
    cCell.border = {
      bottom: { style: "double", color: { argb: "FF047857" } },
    };
  }

  // Row 5: Spacing kosong
  worksheet.getRow(5).height = 10;
  let currentRowIdx = 6;

  // ─────────────────────────────────────────────────────────────
  // 2. RINGKASAN DATA / SUMMARY METRICS (JIKA TERSEDIA)
  // ─────────────────────────────────────────────────────────────
  if (summaryMetrics && summaryMetrics.length > 0) {
    const summaryRow = worksheet.getRow(currentRowIdx);
    summaryRow.height = 24;

    let colStart = 1;
    summaryMetrics.forEach((metric) => {
      if (colStart <= totalCols) {
        const cell = summaryRow.getCell(colStart);
        cell.value = `${metric.label}: ${metric.value}`;
        cell.font = {
          name: "Calibri",
          size: 9.5,
          bold: true,
          color: { argb: "FF064E3B" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE8F5E9" }, // Emerald 50 tint
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "FF10B981" } },
          bottom: { style: "thin", color: { argb: "FF10B981" } },
          left: { style: "thin", color: { argb: "FF10B981" } },
          right: { style: "thin", color: { argb: "FF10B981" } },
        };
        colStart += 1;
      }
    });

    currentRowIdx += 1;
    worksheet.getRow(currentRowIdx).height = 10; // Spacing kosong
    currentRowIdx += 1;
  }

  // ─────────────────────────────────────────────────────────────
  // 3. TABLE HEADER (DARK FOREST EMERALD)
  // ─────────────────────────────────────────────────────────────
  const headerRowIdx = currentRowIdx;
  const headerRow = worksheet.getRow(headerRowIdx);
  headerRow.height = 28;

  columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header.toUpperCase();
    cell.font = {
      name: "Calibri",
      size: 10,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF022C19" }, // Dark Forest Emerald
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: col.align === "left" ? "left" : "center",
      wrapText: true,
    };
    cell.border = {
      top: { style: "medium", color: { argb: "FF064E3B" } },
      bottom: { style: "medium", color: { argb: "FF064E3B" } },
      left: { style: "thin", color: { argb: "FF065F46" } },
      right: { style: "thin", color: { argb: "FF065F46" } },
    };
  });

  currentRowIdx += 1;

  // ─────────────────────────────────────────────────────────────
  // 4. DATA ROWS (ZEBRA STRIPING & PRECISE DATA FORMATTING)
  // ─────────────────────────────────────────────────────────────
  data.forEach((item, itemIdx) => {
    const dataRow = worksheet.getRow(currentRowIdx);
    dataRow.height = 20;
    const isEven = itemIdx % 2 === 1;

    columns.forEach((col, colIdx) => {
      const cell = dataRow.getCell(colIdx + 1);
      const rawVal = col.getter(item, itemIdx);

      // Null/undefined defense
      let parsedDate: Date | null = null;
      if (rawVal === null || rawVal === undefined || rawVal === "") {
        cell.value = "-";
      } else if (col.type && typeof rawVal === "string" && (parsedDate = parseSourceDate(rawVal, col.type === "datetime"))) {
        cell.value = parsedDate;
      } else {
        cell.value = rawVal;
      }

      // Base font
      cell.font = {
        name: "Calibri",
        size: 9.5,
        color: { argb: "FF1F2937" },
      };

      // Zebra striping: Genap = Soft Mint Tint (#F4FBF7), Ganjil = Putih
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEven ? "FFF4FBF7" : "FFFFFFFF" },
      };

      // Alignment
      cell.alignment = {
        vertical: "middle",
        horizontal: col.align || "left",
        wrapText: col.wrapText || false,
      };

      // Borders
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };

      // Number / Text formatting
      if (col.format) {
        cell.numFmt = col.format;
      }

      if (parsedDate) {
        cell.numFmt = col.type === "datetime" ? "dd mmm yyyy hh:mm" : "dd mmm yyyy";
      }

      // Khusus NIK / ID: pastikan selalu teks terformat agar leading zeros (0...) tidak hilang
      if (col.key === "nik" || col.key === "id" || col.key === "phone") {
        cell.numFmt = "@";
      }

      // Soft Status Badges dalam Cell Excel
      if (col.key === "status" && typeof rawVal === "string") {
        const valUpper = rawVal.toUpperCase();
        // "NON-AKTIF" / "TIDAK AKTIF" mengandung kata AKTIF, jadi harus dikecualikan dari warna hijau
        const isInactive = valUpper.includes("NON-AKTIF") || valUpper.includes("NONAKTIF") || valUpper.includes("TIDAK AKTIF");
        if (
          !isInactive &&
          (valUpper.includes("APPROVED") ||
          valUpper.includes("TEPAT WAKTU") ||
          valUpper.includes("DISETUJUI") ||
          valUpper.includes("AKTIF"))
        ) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFDCFCE7" }, // Green 100
          };
          cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: "FF166534" } };
        } else if (
          valUpper.includes("TERLAMBAT") ||
          valUpper.includes("MENUNGGU") ||
          valUpper.includes("PENDING")
        ) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEF3C7" }, // Amber 100
          };
          cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: "FF92400E" } };
        } else if (
          valUpper.includes("DITOLAK") ||
          isInactive ||
          valUpper.includes("ABSEN")
        ) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEE2E2" }, // Red 100
          };
          cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: "FF991B1B" } };
        }
      }
    });

    currentRowIdx += 1;
  });

  // ─────────────────────────────────────────────────────────────
  // 5. SIGN-OFF / LEMBAR PENGESAHAN DOKUMEN PERUSAHAAN (FOOTER)
  // ─────────────────────────────────────────────────────────────
  currentRowIdx += 1; // baris kosong
  const signDateRow = worksheet.getRow(currentRowIdx);
  signDateRow.height = 18;
  const colSignRight = Math.max(columns.length - 1, 4);

  signDateRow.getCell(colSignRight).value = `${new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Makassar",
  })}`;
  signDateRow.getCell(colSignRight).font = { name: "Calibri", size: 9.5, italic: true };
  signDateRow.getCell(colSignRight).alignment = { horizontal: "center" };

  currentRowIdx += 1;
  const signTitleRow = worksheet.getRow(currentRowIdx);
  signTitleRow.height = 18;
  signTitleRow.getCell(2).value = "Diverifikasi Oleh,";
  signTitleRow.getCell(2).font = { name: "Calibri", size: 9.5, bold: true };
  signTitleRow.getCell(2).alignment = { horizontal: "center" };

  signTitleRow.getCell(colSignRight).value = "Mengetahui / Menyetujui,";
  signTitleRow.getCell(colSignRight).font = { name: "Calibri", size: 9.5, bold: true };
  signTitleRow.getCell(colSignRight).alignment = { horizontal: "center" };

  currentRowIdx += 4; // ruang tanda tangan

  const signNameRow = worksheet.getRow(currentRowIdx);
  signNameRow.height = 18;
  signNameRow.getCell(2).value = `( ${kopSurat.exportedBy || "HRD Department"} )`;
  signNameRow.getCell(2).font = { name: "Calibri", size: 9.5, bold: true };
  signNameRow.getCell(2).alignment = { horizontal: "center" };

  signNameRow.getCell(colSignRight).value = "( Pimpinan / Direksi )";
  signNameRow.getCell(colSignRight).font = { name: "Calibri", size: 9.5, bold: true };
  signNameRow.getCell(colSignRight).alignment = { horizontal: "center" };

  // ─────────────────────────────────────────────────────────────
  // 6. AUTO-ADJUST COLUMN WIDTHS (PROPORSIONAL & TIDAK TERPOTONG)
  // ─────────────────────────────────────────────────────────────
  columns.forEach((col, idx) => {
    const colNumber = idx + 1;
    let maxLen = col.header.length;

    // Check data lengths (sampling up to first 50 rows for performance)
    const sampleSize = Math.min(data.length, 50);
    for (let i = 0; i < sampleSize; i++) {
      const val = col.getter(data[i], i);
      if (val !== null && val !== undefined) {
        const strVal = String(val);
        if (strVal.length > maxLen) {
          maxLen = Math.min(strVal.length, 45); // cap at 45 chars
        }
      }
    }

    const calculatedWidth = col.width || Math.max(maxLen + 4, 11);
    worksheet.getColumn(colNumber).width = calculatedWidth;
  });

  // ─────────────────────────────────────────────────────────────
  // 7. PENGATURAN CETAK A4 PROFESIONAL (PRINT SETUP)
  // ─────────────────────────────────────────────────────────────
  const lastColLetter = worksheet.getColumn(Math.max(columns.length, 1)).letter;
  const lastRowIdx = currentRowIdx;

  worksheet.pageSetup = {
    paperSize: 9, // A4
    printArea: `A1:${lastColLetter}${lastRowIdx}`, // Area cetak = seluruh laporan (kop surat s.d. pengesahan)
    orientation: orientation,
    fitToPage: true,
    fitToWidth: 1, // Fit 1 page wide (tidak terpotong secara horizontal)
    fitToHeight: 0, // Tinggi mengalir bebas (tidak membuat font mengecil)
    showGridLines: true,
    margins: {
      left: 0.4,
      right: 0.4,
      top: 0.6,
      bottom: 0.6,
      header: 0.3,
      footer: 0.3,
    },
    printTitlesRow: `${headerRowIdx}:${headerRowIdx}`, // Repeat table header on every page
  };

  worksheet.headerFooter = {
    oddHeader: `&L&B${kopSurat.companyName}&R${kopSurat.reportTitle}`,
    oddFooter: `&LSistem Absensi PWA (WITA)&RHal &P dari &N`,
  };

  // ─────────────────────────────────────────────────────────────
  // 8. BROWSER DOWNLOAD TRIGGER
  // ─────────────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const finalFileName = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;

  link.href = url;
  link.setAttribute("download", finalFileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);

  return true;
}
