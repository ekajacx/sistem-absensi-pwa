"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import {
  Search,
  Download,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarDays,
  BarChart3,
  ListChecks,
} from "lucide-react";

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  mei: 4,
  may: 4,
  jun: 5,
  jul: 6,
  agu: 7,
  aug: 7,
  agt: 7,
  sep: 8,
  okt: 9,
  oct: 9,
  nov: 10,
  des: 11,
  dec: 11,
};

const MONTH_NAMES_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function parseAttendanceDate(raw: string): Date | null {
  const text = raw.trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }
  const indo = text.match(/^(\d{1,2})\s+([A-Za-z]{3,})\.?\s+(\d{4})/);
  if (indo) {
    const mi = MONTH_INDEX[indo[2].slice(0, 3).toLowerCase()];
    if (mi !== undefined) {
      return new Date(Number(indo[3]), mi, Number(indo[1]));
    }
  }
  return null;
}

export default function RekapAbsensiView() {
  const {
    canViewAllAttendances,
    currentActiveEmployee,
    employees,
    filteredAttendances,
    formatDateISO,
    formatDateShort,
    getMondayOfWeek,
    handleExportExcel,
    handleOpenEditAttendance,
    hasPermission,
    rekapDeptFilter,
    rekapSearchQuery,
    rekapStatusFilter,
    setActiveMenu,
    setRekapDeptFilter,
    setRekapSearchQuery,
    setRekapStatusFilter,
    standardDepartments,
    visibleAttendances,
    visibleEmployees,
  } = useApp();

  // 1. State Mode Periode Rekap: "weekly" (Mingguan) atau "monthly" (Bulanan)
  const [periodMode, setPeriodMode] = useState<"weekly" | "monthly">("weekly");
  const [selectedWeekMonday, setSelectedWeekMonday] = useState<string>("2026-11-16");
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-11");

  // 2. Sub-tab Tampilan: "logs" (Rincian Log Harian) vs "summary" (Rekap Akumulasi per Karyawan)
  const [viewMode, setViewMode] = useState<"logs" | "summary">("logs");

  // 3. State Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Hitung batas awal & akhir minggu terpilih
  const weekRangeInfo = useMemo(() => {
    const mon = new Date(selectedWeekMonday + "T00:00:00");
    mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    sun.setHours(23, 59, 59, 999);
    const label = `${formatDateShort(mon)} – ${formatDateShort(sun)} ${sun.getFullYear()}`;
    return { mon, sun, label };
  }, [selectedWeekMonday, formatDateShort]);

  // Hitung label bulan terpilih
  const monthLabel = useMemo(() => {
    const [yStr, mStr] = selectedMonth.split("-");
    const y = Number(yStr);
    const mIdx = Number(mStr) - 1;
    if (!Number.isNaN(y) && mIdx >= 0 && mIdx < 12) {
      return `${MONTH_NAMES_ID[mIdx]} ${y}`;
    }
    return selectedMonth;
  }, [selectedMonth]);

  // Filter data absensi berdasarkan periode Mingguan / Bulanan
  const periodFilteredAttendances = useMemo(() => {
    return filteredAttendances.filter((att) => {
      const d = parseAttendanceDate(att.date);
      if (!d) return true;
      if (periodMode === "weekly") {
        const t = d.getTime();
        return t >= weekRangeInfo.mon.getTime() && t <= weekRangeInfo.sun.getTime();
      } else {
        const [yStr, mStr] = selectedMonth.split("-");
        const targetY = Number(yStr);
        const targetM = Number(mStr) - 1;
        return d.getFullYear() === targetY && d.getMonth() === targetM;
      }
    });
  }, [filteredAttendances, periodMode, weekRangeInfo, selectedMonth]);

  // Akumulasi Rekap per Karyawan pada periode terpilih
  const employeeSummaryRows = useMemo(() => {
    const targetEmps = visibleEmployees.filter((emp) => {
      const matchDept = !canViewAllAttendances
        ? emp.dept === currentActiveEmployee.dept
        : rekapDeptFilter === "ALL" || emp.dept === rekapDeptFilter;
      const q = rekapSearchQuery.trim().toLowerCase();
      const matchSearch =
        q === "" ||
        emp.name.toLowerCase().includes(q) ||
        emp.nik.includes(q) ||
        emp.dept.toLowerCase().includes(q);
      return matchDept && matchSearch;
    });

    return targetEmps.map((emp) => {
      const empLogs = periodFilteredAttendances.filter((a) => a.employeeId === emp.id);
      const onTime = empLogs.filter((a) => a.status === "APPROVED").length;
      const late = empLogs.filter((a) => a.status === "TERLAMBAT").length;
      const avgAi =
        empLogs.length > 0
          ? (empLogs.reduce((acc, a) => acc + a.score, 0) / empLogs.length).toFixed(1) + "%"
          : "-";
      return {
        emp,
        totalPresent: empLogs.length,
        onTime,
        late,
        avgAi,
      };
    });
  }, [
    visibleEmployees,
    canViewAllAttendances,
    currentActiveEmployee.dept,
    rekapDeptFilter,
    rekapSearchQuery,
    periodFilteredAttendances,
  ]);

  // Pagination untuk Log Harian
  const totalPages = Math.max(1, Math.ceil(periodFilteredAttendances.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedAttendances = periodFilteredAttendances.slice(startIdx, startIdx + pageSize);

  const periodTextForExport =
    periodMode === "weekly"
      ? `Rekap Mingguan (${weekRangeInfo.label})`
      : `Rekap Bulanan (${monthLabel})`;

  return (
    <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-6 border border-emerald-900/60 space-y-5">
      {/* Header Box & Tombol Ekspor */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-emerald-900/60 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl">📊</span>
            <h3 className="font-black text-white text-lg">
              Rekapitulasi Kehadiran ({periodMode === "weekly" ? "Mingguan" : "Bulanan"})
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {canViewAllAttendances
                ? "Panel HRD & Manajemen (Semua Dept)"
                : `Panel Supervisor: Dept. ${currentActiveEmployee.dept}`}
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1 max-w-2xl">
            {canViewAllAttendances
              ? "Pantau rekapitulasi kehadiran karyawan per minggu atau per bulan, lihat akumulasi kehadiran tiap staf, dan ekspor laporan ke Microsoft Excel (.xlsx)."
              : `Pemantauan rekap absensi mingguan & bulanan khusus staf tim di Departemen ${currentActiveEmployee.dept}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExportExcel(periodFilteredAttendances, periodTextForExport)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-black hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            title="Unduh rekap kehadiran sesuai periode (Mingguan/Bulanan) & filter aktif ke format Excel (.xlsx)"
          >
            <Download className="w-4 h-4" />
            <span>
              Ekspor Rekap {periodMode === "weekly" ? "Mingguan" : "Bulanan"} ({periodFilteredAttendances.length})
            </span>
          </button>
        </div>
      </div>

      {/* Bar Pemilih Mode Periode (Mingguan vs Bulanan) + Sub-Tab Tampilan */}
      <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Kiri: Switch Mingguan vs Bulanan + Pemilih Tanggal Minggu / Bulan */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#021008] p-1 rounded-xl border border-emerald-900/70 gap-1">
            <button
              type="button"
              onClick={() => {
                setPeriodMode("weekly");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                periodMode === "weekly"
                  ? "bg-emerald-500 text-black shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Rekap Mingguan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPeriodMode("monthly");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                periodMode === "monthly"
                  ? "bg-emerald-500 text-black shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Rekap Bulanan</span>
            </button>
          </div>

          {/* Kontrol Pemilih Minggu atau Bulan */}
          {periodMode === "weekly" ? (
            <div className="flex flex-wrap items-center gap-2 bg-[#021008] px-3 py-1.5 rounded-xl border border-emerald-800/60">
              <button
                type="button"
                onClick={() => {
                  const d = new Date(selectedWeekMonday + "T00:00:00");
                  d.setDate(d.getDate() - 7);
                  setSelectedWeekMonday(formatDateISO(d));
                  setCurrentPage(1);
                }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
                title="Minggu Sebelumnya"
              >
                ◀
              </button>
              <input
                type="date"
                value={selectedWeekMonday}
                onChange={(e) => {
                  if (e.target.value) {
                    const mon = getMondayOfWeek(new Date(e.target.value + "T00:00:00"));
                    setSelectedWeekMonday(formatDateISO(mon));
                    setCurrentPage(1);
                  }
                }}
                className="bg-[#010804] border border-emerald-900/60 rounded-lg px-2.5 py-1 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => {
                  const d = new Date(selectedWeekMonday + "T00:00:00");
                  d.setDate(d.getDate() + 7);
                  setSelectedWeekMonday(formatDateISO(d));
                  setCurrentPage(1);
                }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
                title="Minggu Selanjutnya"
              >
                ▶
              </button>
              <span className="text-[11px] font-bold text-emerald-300 font-mono pl-1">
                ({weekRangeInfo.label})
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 bg-[#021008] px-3 py-1.5 rounded-xl border border-emerald-800/60">
              <button
                type="button"
                onClick={() => {
                  const [y, m] = selectedMonth.split("-").map(Number);
                  const d = new Date(y, m - 2, 1);
                  setSelectedMonth(
                    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
                  );
                  setCurrentPage(1);
                }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
                title="Bulan Sebelumnya"
              >
                ◀
              </button>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedMonth(e.target.value);
                    setCurrentPage(1);
                  }
                }}
                className="bg-[#010804] border border-emerald-900/60 rounded-lg px-2.5 py-1 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => {
                  const [y, m] = selectedMonth.split("-").map(Number);
                  const d = new Date(y, m, 1);
                  setSelectedMonth(
                    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
                  );
                  setCurrentPage(1);
                }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
                title="Bulan Selanjutnya"
              >
                ▶
              </button>
              <span className="text-[11px] font-bold text-emerald-300 pl-1">
                ({monthLabel})
              </span>
            </div>
          )}
        </div>

        {/* Kanan: Sub-Tab Rincian Log Harian vs Akumulasi per Karyawan */}
        <div className="flex items-center bg-[#021008] p-1 rounded-xl border border-emerald-900/70 gap-1 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("logs")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "logs"
                ? "bg-emerald-500 text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>Rincian Log ({periodFilteredAttendances.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("summary")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "summary"
                ? "bg-emerald-500 text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Akumulasi Karyawan ({employeeSummaryRows.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar (Departemen, Status, & Pencarian) */}
      <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-3">
        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
          FILTER DATA REKAP ABSENSI ({periodMode === "weekly" ? `MINGGU: ${weekRangeInfo.label}` : `BULAN: ${monthLabel}`})
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter 1: Departemen */}
          <div>
            <label className="block text-[11px] text-white/70 font-bold mb-1">
              Departemen {canViewAllAttendances ? `(${standardDepartments.length})` : "(Terkunci: Tim Bawahan)"}
            </label>
            {canViewAllAttendances ? (
              <select
                value={rekapDeptFilter}
                onChange={(e) => {
                  setRekapDeptFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#021008] border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Departemen ({standardDepartments.length})</option>
                {standardDepartments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.icon} {d.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full bg-[#021008] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-white font-bold flex items-center justify-between shadow-sm">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <span>{standardDepartments.find((d) => d.id === currentActiveEmployee.dept)?.icon || "🏢"}</span>
                  <span>{standardDepartments.find((d) => d.id === currentActiveEmployee.dept)?.name || currentActiveEmployee.dept}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30">
                  🔒 Otoritas Tim
                </span>
              </div>
            )}
          </div>

          {/* Filter 2: Status Kehadiran */}
          <div>
            <label className="block text-[11px] text-white/70 font-bold mb-1">
              Status Kehadiran
            </label>
            <select
              value={rekapStatusFilter}
              onChange={(e) => {
                setRekapStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#021008] border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="APPROVED">✓ APPROVED (Tepat Waktu)</option>
              <option value="TERLAMBAT">⚠️ TERLAMBAT</option>
            </select>
          </div>

          {/* Filter 3: Pencarian Nama / NIK */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] text-white/70 font-bold mb-1">
              Cari Karyawan / No. KTP
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                value={rekapSearchQuery}
                onChange={(e) => {
                  setRekapSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Ketik nama, No. KTP, atau shift..."
                className="w-full bg-[#021008] border border-emerald-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Status Bar Filter Aktif & Reset */}
        {((canViewAllAttendances && rekapDeptFilter !== "ALL") || rekapStatusFilter !== "ALL" || rekapSearchQuery !== "") && (
          <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40 text-xs">
            <span className="text-white/60 text-[11px]">
              Menampilkan <strong>{periodFilteredAttendances.length}</strong> dari {visibleAttendances.length} data log
              {canViewAllAttendances && rekapDeptFilter !== "ALL" && ` • Dept: ${rekapDeptFilter}`}
              {!canViewAllAttendances && ` • Tim Dept: ${currentActiveEmployee.dept}`}
              {rekapStatusFilter !== "ALL" && ` • Status: ${rekapStatusFilter}`}
            </span>
            <button
              onClick={() => {
                setRekapDeptFilter(canViewAllAttendances ? "ALL" : currentActiveEmployee.dept);
                setRekapStatusFilter("ALL");
                setRekapSearchQuery("");
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-500/40 text-xs font-semibold hover:bg-red-900 transition-all cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Ringkasan Metrik Singkat Periode Terpilih */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
          <span className="text-[10px] text-white/60 block font-bold uppercase">
            Total Kehadiran ({periodMode === "weekly" ? "Minggu Ini" : "Bulan Ini"})
          </span>
          <span className="text-lg font-black text-white">{periodFilteredAttendances.length} Log</span>
        </div>
        <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
          <span className="text-[10px] text-emerald-400 block font-bold uppercase">Hadir Tepat Waktu</span>
          <span className="text-lg font-black text-emerald-400">
            {periodFilteredAttendances.filter((a) => a.status === "APPROVED").length}
          </span>
        </div>
        <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
          <span className="text-[10px] text-amber-400 block font-bold uppercase">Terlambat</span>
          <span className="text-lg font-black text-amber-400">
            {periodFilteredAttendances.filter((a) => a.status === "TERLAMBAT").length}
          </span>
        </div>
        <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
          <span className="text-[10px] text-sky-400 block font-bold uppercase">Rata-rata AI Face</span>
          <span className="text-lg font-black text-sky-300">
            {periodFilteredAttendances.length > 0
              ? (
                  periodFilteredAttendances.reduce((acc, c) => acc + c.score, 0) /
                  periodFilteredAttendances.length
                ).toFixed(1) + "%"
              : "0%"}
          </span>
        </div>
      </div>

      {/* SUB-TAB 1: TABEL AKUMULASI REKAP PER KARYAWAN (MINGGUAN / BULANAN) */}
      {viewMode === "summary" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-900/60 text-white text-[10px] uppercase font-bold">
                <th className="py-3 pl-3">No</th>
                <th className="py-3">Karyawan</th>
                <th className="py-3">Departemen</th>
                <th className="py-3 text-center">Total Hadir</th>
                <th className="py-3 text-center">Tepat Waktu</th>
                <th className="py-3 text-center">Terlambat</th>
                <th className="py-3 text-center">Rata-rata Skor AI</th>
                <th className="py-3 pr-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30">
              {employeeSummaryRows.map((row, idx) => (
                <tr key={row.emp.id} className="hover:bg-emerald-950/20 transition-colors">
                  <td className="py-3 pl-3 text-white/40 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center font-bold text-white text-[11px] ring-1 ring-emerald-500/40 shrink-0 overflow-hidden">
                        {row.emp.photoUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={row.emp.photoUrl}
                            alt={row.emp.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          row.emp.avatar
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white block leading-tight">{row.emp.name}</span>
                        <span className="text-[10px] text-white/50 font-mono">{row.emp.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                      {row.emp.dept}
                    </span>
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-white">
                    {row.totalPresent} Hari
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-emerald-400">
                    {row.onTime} Hari
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-amber-400">
                    {row.late} Hari
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-sky-300">
                    {row.avgAi}
                  </td>
                  <td className="py-3 pr-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setRekapSearchQuery(row.emp.name);
                        setViewMode("logs");
                        setCurrentPage(1);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Lihat Log →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* SUB-TAB 2: TABEL RINCIAN LOG KEHADIRAN HARIAN */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-900/60 text-white text-[10px] uppercase font-bold">
                  <th className="py-3 pl-3">No</th>
                  <th className="py-3">Karyawan</th>
                  <th className="py-3">Departemen</th>
                  <th className="py-3">Shift</th>
                  <th className="py-3">Tanggal</th>
                  <th className="py-3">Check-In</th>
                  <th className="py-3">Check-Out</th>
                  <th className="py-3">Jarak</th>
                  <th className="py-3">Skor AI</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 pr-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30">
                {paginatedAttendances.length > 0 ? (
                  paginatedAttendances.map((r, idx) => {
                    const empObj = employees.find((e) => e.id === r.employeeId);
                    return (
                      <tr key={r.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3 pl-3 text-white/40 font-mono text-[11px]">{startIdx + idx + 1}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center font-bold text-white text-[11px] ring-1 ring-emerald-500/40 shrink-0 overflow-hidden">
                              {empObj?.photoUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={empObj.photoUrl}
                                  alt={r.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                empObj?.avatar || r.name.slice(0, 2).toUpperCase()
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-white block leading-tight">{r.name}</span>
                              <span className="text-[10px] text-white/50 font-mono">No. KTP: {r.nik}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                            {r.dept}
                          </span>
                        </td>
                        <td className="py-3 text-white/70">{r.shift}</td>
                        <td className="py-3 font-mono text-white/80">{r.date}</td>
                        <td className="py-3 font-mono text-white font-bold">{r.in}</td>
                        <td className="py-3 font-mono text-white/60">{r.out}</td>
                        <td className="py-3 font-mono text-white">{r.dist.toFixed(1)}m</td>
                        <td className="py-3 font-mono text-sky-300 font-bold">{r.score}%</td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                              r.status === "APPROVED"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                            }`}
                          >
                            {r.status === "APPROVED" ? "✓ APPROVED" : "⚠️ TERLAMBAT"}
                          </span>
                          {r.isEdited && (
                            <span className="block text-[9px] text-red-400 font-bold mt-1">
                              ✏️ Diedit Manual
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-3 text-center">
                          {hasPermission("att_edit_rekap") && (
                            <button
                              onClick={() => handleOpenEditAttendance(r)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition-all flex items-center gap-1 mx-auto cursor-pointer"
                              title="Koreksi jam check-in/out jika karyawan lupa absen"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-white/50 text-xs">
                      Tidak ada catatan absensi pada periode{" "}
                      <strong>
                        {periodMode === "weekly" ? weekRangeInfo.label : monthLabel}
                      </strong>{" "}
                      yang sesuai dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bar Navigasi Pagination Rekap Absensi */}
          {periodFilteredAttendances.length > 0 && (
            <div className="bg-[#010804] rounded-2xl p-3.5 border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/60">
                <span>
                  Menampilkan{" "}
                  <strong className="text-white">
                    {startIdx + 1}–{Math.min(startIdx + pageSize, periodFilteredAttendances.length)}
                  </strong>{" "}
                  dari <strong className="text-emerald-400">{periodFilteredAttendances.length}</strong> log kehadiran
                </span>
                <div className="flex items-center gap-1.5">
                  <span>Per halaman:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-[#021008] border border-emerald-900/60 rounded-lg px-2 py-1 text-white font-bold text-[11px] focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-[#021008] border border-emerald-900/60 text-white/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                      pageNum === safePage
                        ? "bg-emerald-500 text-black shadow"
                        : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-[#021008] border border-emerald-900/60 text-white/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Shortcut ke Menu Audit Log (SISTEM) */}
      {hasPermission("log_view") && (
        <div className="bg-[#021008] border border-emerald-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md mt-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">📜</span>
            <div>
              <h5 className="font-extrabold text-white text-xs">Audit Log Aktivitas Kehadiran & Sistem</h5>
              <p className="text-[11px] text-white/60">
                Rekam jejak otomatis & modifikasi manual dapat dilihat di menu SISTEM ➔ Audit Log.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveMenu("log-aktivitas")}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <span>Buka Audit Log Lengkap →</span>
          </button>
        </div>
      )}
    </div>
  );
}
