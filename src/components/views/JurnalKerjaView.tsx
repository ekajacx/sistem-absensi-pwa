"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import {
  CheckCircle2,
  Plus,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  Archive,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

export default function JurnalKerjaView() {
  const {
    activePerspective,
    currentActiveEmployee,
    currentRoleName,
    employees,
    handleExportJournalsExcel,
    isStaff,
    setJournals,
    setShowAddJournalModal,
    showToast,
    standardDepartments,
    visibleJournals,
  } = useApp();

  // 1. State Tab Aktif vs Arsip (Siklus Arsip)
  const [journalTab, setJournalTab] = useState<"active" | "archived">("active");

  // 2. State Filter (Tanggal, Departemen, Pencarian)
  const [selectedDate, setSelectedDate] = useState<string>("ALL");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 3. State Mode Ringkas / Accordion (ID jurnal yang sedang dibuka rinciannya)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // 4. State Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // State konfirmasi hapus arsip
  const [confirmClearArchive, setConfirmClearArchive] = useState<boolean>(false);

  // Cek apakah role berhak memfilter semua departemen (Admin, GM, HR Supervisor)
  const canFilterAllDepts =
    activePerspective === "admin" ||
    currentRoleName === "Super Admin" ||
    currentRoleName === "General Manager" ||
    currentRoleName === "HR Supervisor";

  // Pisahkan jurnal aktif vs arsip dari visibleJournals (sudah terikat RBAC)
  const activeJournals = useMemo(
    () => visibleJournals.filter((j) => !j.isArchived),
    [visibleJournals]
  );
  const archivedJournals = useMemo(
    () => visibleJournals.filter((j) => Boolean(j.isArchived)),
    [visibleJournals]
  );

  const tabBaseJournals = journalTab === "active" ? activeJournals : archivedJournals;

  // Daftar tanggal unik untuk filter periode
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(visibleJournals.map((j) => j.date)));
    return dates;
  }, [visibleJournals]);

  // Terapkan filter Tanggal, Departemen, dan Pencarian Kata Kunci
  const filteredJournals = useMemo(() => {
    return tabBaseJournals.filter((j) => {
      const matchDate = selectedDate === "ALL" || j.date === selectedDate;
      const matchDept = !canFilterAllDepts
        ? true
        : selectedDept === "ALL" || j.dept === selectedDept;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === "" ||
        j.name.toLowerCase().includes(q) ||
        j.dept.toLowerCase().includes(q) ||
        j.date.toLowerCase().includes(q) ||
        j.tasks.some((t) => t.toLowerCase().includes(q)) ||
        Boolean(j.notes && j.notes.toLowerCase().includes(q));
      return matchDate && matchDept && matchSearch;
    });
  }, [tabBaseJournals, selectedDate, selectedDept, searchQuery, canFilterAllDepts]);

  // Hitung Pagination
  const totalPages = Math.max(1, Math.ceil(filteredJournals.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedJournals = filteredJournals.slice(startIdx, startIdx + pageSize);

  // Statistik Ringkas dari jurnal terfilter
  const avgScore =
    filteredJournals.length > 0
      ? (
          filteredJournals.reduce((acc, j) => acc + j.score, 0) / filteredJournals.length
        ).toFixed(1)
      : "0.0";
  const totalTasksCount = filteredJournals.reduce((acc, j) => acc + j.tasks.length, 0);

  // Helpers Buka/Tutup Rincian Kartu (Accordion)
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allOnPageExpanded =
    paginatedJournals.length > 0 && paginatedJournals.every((j) => Boolean(expandedIds[j.id]));

  const toggleExpandAllOnPage = () => {
    if (allOnPageExpanded) {
      const next = { ...expandedIds };
      paginatedJournals.forEach((j) => {
        delete next[j.id];
      });
      setExpandedIds(next);
    } else {
      const next = { ...expandedIds };
      paginatedJournals.forEach((j) => {
        next[j.id] = true;
      });
      setExpandedIds(next);
    }
  };

  // Helpers Siklus Arsip
  const handleToggleArchiveSingle = (journalId: string, archive: boolean) => {
    setJournals((prev) =>
      prev.map((j) => (j.id === journalId ? { ...j, isArchived: archive } : j))
    );
    showToast(
      archive
        ? "📦 Jurnal dipindahkan ke Arsip."
        : "♻️ Jurnal dipulihkan ke daftar Jurnal Aktif.",
      "info"
    );
  };

  const handleArchiveFiltered = () => {
    if (filteredJournals.length === 0) return;
    const targetIds = new Set(filteredJournals.map((j) => j.id));
    setJournals((prev) =>
      prev.map((j) => (targetIds.has(j.id) ? { ...j, isArchived: true } : j))
    );
    showToast(`📦 ${filteredJournals.length} jurnal berhasil dipindahkan ke Arsip!`, "success");
    setCurrentPage(1);
  };

  const handleRestoreAllFiltered = () => {
    if (filteredJournals.length === 0) return;
    const targetIds = new Set(filteredJournals.map((j) => j.id));
    setJournals((prev) =>
      prev.map((j) => (targetIds.has(j.id) ? { ...j, isArchived: false } : j))
    );
    showToast(`♻️ ${filteredJournals.length} jurnal arsip berhasil dipulihkan!`, "success");
    setCurrentPage(1);
  };

  const handleClearArchivedFiltered = () => {
    if (filteredJournals.length === 0) return;
    const targetIds = new Set(filteredJournals.map((j) => j.id));
    setJournals((prev) => prev.filter((j) => !targetIds.has(j.id)));
    setConfirmClearArchive(false);
    showToast(`🗑️ ${filteredJournals.length} jurnal di arsip telah dihapus permanen.`, "info");
    setCurrentPage(1);
  };

  const hasActiveFilter =
    selectedDate !== "ALL" ||
    (canFilterAllDepts && selectedDept !== "ALL") ||
    searchQuery.trim() !== "";

  const resetFilters = () => {
    setSelectedDate("ALL");
    setSelectedDept("ALL");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filterSummaryText = [
    journalTab === "active" ? "Status: Jurnal Aktif" : "Status: Arsip Jurnal",
    selectedDate !== "ALL" ? `Tanggal: ${selectedDate}` : "Semua Tanggal",
    canFilterAllDepts && selectedDept !== "ALL" ? `Dept: ${selectedDept}` : null,
    searchQuery.trim() ? `Cari: "${searchQuery.trim()}"` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="space-y-5">
      {/* Header Utama & Aksi Cepat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021008] p-5 rounded-2xl border border-emerald-900/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h3 className="font-extrabold text-white text-base">Jurnal Kerja Harian & Arsip</h3>
            {isStaff && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                POV Karyawan Mandiri
              </span>
            )}
          </div>
          <p className="text-xs text-white/70 mt-1 max-w-2xl">
            {isStaff
              ? `Catat dan kelola laporan aktivitas pekerjaan harian Anda (${currentActiveEmployee.name}). Gunakan filter tanggal, tampilan ringkas, atau arsip agar riwayat tetap rapi.`
              : "Kelola laporan aktivitas harian tim dengan filter periode, tampilan ringkas (buka-tutup), pembagian halaman, dan pengarsipan berkala."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowAddJournalModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Jurnal</span>
          </button>
          <button
            onClick={() => handleExportJournalsExcel(filteredJournals, filterSummaryText)}
            className="px-3.5 py-2.5 rounded-xl bg-[#021008] border border-emerald-500/50 text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-950 transition-all cursor-pointer"
            title="Unduh rekap jurnal kerja sesuai filter & tab aktif ke format Microsoft Excel (.xlsx)"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Jurnal ({filteredJournals.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Siklus Arsip (Jurnal Aktif vs Arsip Jurnal) + Aksi Massal */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setJournalTab("active");
              setCurrentPage(1);
              setConfirmClearArchive(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              journalTab === "active"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
            }`}
          >
            <span>📋</span>
            <span>Jurnal Aktif</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                journalTab === "active"
                  ? "bg-black/20 text-black"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {activeJournals.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setJournalTab("archived");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              journalTab === "archived"
                ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Arsip Jurnal</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                journalTab === "archived"
                  ? "bg-black/20 text-black"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {archivedJournals.length}
            </span>
          </button>
        </div>

        {/* Tombol Siklus Arsip Massal */}
        <div className="flex flex-wrap items-center gap-2">
          {journalTab === "active" && filteredJournals.length > 0 && (
            <button
              type="button"
              onClick={handleArchiveFiltered}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Pindahkan seluruh jurnal yang tampil pada hasil filter ini ke tab Arsip"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Arsipkan Hasil Filter ({filteredJournals.length})</span>
            </button>
          )}

          {journalTab === "archived" && filteredJournals.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleRestoreAllFiltered}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pulihkan Semua ({filteredJournals.length})</span>
              </button>

              {!isStaff && (
                confirmClearArchive ? (
                  <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/50 rounded-xl px-2.5 py-1">
                    <span className="text-[11px] text-red-200 font-bold">
                      Hapus permanen {filteredJournals.length} arsip?
                    </span>
                    <button
                      type="button"
                      onClick={handleClearArchivedFiltered}
                      className="px-2 py-0.5 rounded-md bg-red-500 hover:bg-red-400 text-black font-black text-[10px] cursor-pointer"
                    >
                      Ya, Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearArchive(false)}
                      className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClearArchive(true)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Bersihkan arsip jurnal yang sudah diekspor ke Excel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Bersihkan Arsip</span>
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* Bar Filter: Tanggal, Departemen, dan Pencarian */}
      <div className="bg-[#02120a] rounded-2xl p-4 border border-emerald-900/60 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Filter Tanggal / Periode */}
          <div className="lg:col-span-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Periode Tanggal
            </label>
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-400"
              >
                <option value="ALL">📅 Semua Tanggal ({availableDates.length} Hari)</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    📅 {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Departemen (Sesuai RBAC) */}
          <div className="lg:col-span-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Departemen
            </label>
            {canFilterAllDepts ? (
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-400"
              >
                <option value="ALL">Semua Departemen ({standardDepartments.length})</option>
                {standardDepartments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full bg-[#010804] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-emerald-300 font-bold flex items-center justify-between">
                <span>{currentActiveEmployee.dept}</span>
                <span className="text-[10px] text-white/50">🔒 {isStaff ? "Pribadi" : "Tim"}</span>
              </div>
            )}
          </div>

          {/* Pencarian Kata Kunci */}
          <div className="lg:col-span-6">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Cari Karyawan / Isi Tugas / Catatan
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Ketik nama karyawan, rincian tugas, atau kendala..."
                  className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-bold shrink-0 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ringkasan Mini KPI + Kontrol Mode Ringkas & Ukuran Halaman */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-900/40 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/70">
            <span>
              Total Ditampilkan:{" "}
              <strong className="text-emerald-400 font-extrabold">
                {filteredJournals.length} Jurnal
              </strong>
            </span>
            <span>•</span>
            <span>
              Total Butir Tugas:{" "}
              <strong className="text-white font-bold">{totalTasksCount} Aktivitas</strong>
            </span>
            <span>•</span>
            <span>
              Rata-rata Skor:{" "}
              <strong className="text-teal-300 font-bold">{avgScore}/100</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {paginatedJournals.length > 0 && (
              <button
                type="button"
                onClick={toggleExpandAllOnPage}
                className="px-2.5 py-1 rounded-lg bg-[#010804] hover:bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                {allOnPageExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Ringkas Semua</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Buka Semua Rincian</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-white/60">
              <span>Per halaman:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#010804] border border-emerald-900/60 rounded-lg px-2 py-1 text-white font-bold text-[11px] focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Kartu Jurnal (Mode Ringkas Accordion) */}
      {filteredJournals.length === 0 ? (
        <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
            {journalTab === "active" ? "📝" : "🗄️"}
          </div>
          <h4 className="font-bold text-white text-sm">
            {journalTab === "active"
              ? "Tidak Ada Jurnal Aktif pada Filter Ini"
              : "Belum Ada Jurnal di Dalam Arsip"}
          </h4>
          <p className="text-xs text-white/60 max-w-md mx-auto">
            {hasActiveFilter
              ? "Coba ubah filter tanggal, departemen, atau kata kunci pencarian Anda."
              : journalTab === "active"
              ? "Klik tombol di bawah untuk melaporkan aktivitas pekerjaan harian."
              : "Jurnal yang sudah direkap ke Excel dapat diarsipkan agar daftar jurnal aktif tetap ringkas."}
          </p>
          {hasActiveFilter ? (
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 font-extrabold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              Reset Filter
            </button>
          ) : (
            journalTab === "active" && (
              <button
                onClick={() => setShowAddJournalModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs inline-flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tulis Jurnal Kerja Hari Ini
              </button>
            )
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {paginatedJournals.map((j) => {
            const isExpanded = Boolean(expandedIds[j.id]);
            const empObj = employees.find((e) => e.id === j.employeeId);
            const firstTaskPreview = j.tasks[0] || "-";

            return (
              <div
                key={j.id}
                className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl border border-emerald-900/60 shadow-md transition-all hover:border-emerald-500/40 overflow-hidden"
              >
                {/* Baris Ringkas (Header Kartu) */}
                <div
                  onClick={() => toggleExpand(j.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center font-black text-white text-xs ring-1 ring-emerald-500/40 shrink-0 overflow-hidden">
                      {empObj?.photoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={empObj.photoUrl}
                          alt={j.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        j.avatar
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-white text-sm truncate">
                          {j.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                          {j.dept}
                        </span>
                        {j.employeeId === currentActiveEmployee.id && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                            Jurnal Saya
                          </span>
                        )}
                        {j.isArchived && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            Diarsipkan
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/60 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-white/80 font-medium">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          {j.date}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-300 font-semibold">
                          {j.tasks.length} Butir Tugas
                        </span>
                        {!isExpanded && (
                          <>
                            <span className="hidden md:inline">•</span>
                            <span className="hidden md:inline text-white/50 truncate max-w-md">
                              {firstTaskPreview}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metrik Kanan & Tombol Aksi Kartu */}
                  <div
                    className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {j.score && (
                      <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                        Skor: {j.score}/100
                      </span>
                    )}
                    <span className="font-mono font-bold text-white text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-900/60">
                      ⏱️ {j.hours}
                    </span>

                    {/* Tombol Arsipkan / Pulihkan */}
                    {j.isArchived ? (
                      <button
                        type="button"
                        onClick={() => handleToggleArchiveSingle(j.id, false)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Pulihkan ke Jurnal Aktif"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Pulihkan</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleArchiveSingle(j.id, true)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Simpan ke Arsip Jurnal"
                      >
                        <Archive className="w-3 h-3" />
                        <span>Arsipkan</span>
                      </button>
                    )}

                    {/* Tombol Buka/Tutup Rincian */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(j.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#010804] hover:bg-emerald-950 text-white/80 hover:text-white border border-emerald-900/60 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{isExpanded ? "Tutup" : "Rincian"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Isi Rincian Tugas (Muncul Saat Dibuka) */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-emerald-900/40 bg-[#010b06]/60 space-y-3">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block mb-2">
                        Rincian Aktivitas & Tugas ({j.tasks.length} Butir):
                      </span>
                      <ul className="space-y-1.5 text-xs text-white/90 pl-1">
                        {j.tasks.map((t, ti) => (
                          <li key={ti} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {j.notes && (
                      <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 text-[11px] text-white/70">
                        <span className="font-bold text-amber-300 block mb-0.5">
                          Catatan / Kendala:
                        </span>
                        <p>{j.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bar Navigasi Pagination */}
      {filteredJournals.length > 0 && (
        <div className="bg-[#021008] rounded-2xl p-3.5 border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-white/60 text-[11px]">
            Menampilkan{" "}
            <strong className="text-white">
              {startIdx + 1}–{Math.min(startIdx + pageSize, filteredJournals.length)}
            </strong>{" "}
            dari <strong className="text-emerald-400">{filteredJournals.length}</strong> jurnal
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1.5 rounded-lg bg-[#010804] border border-emerald-900/60 text-white/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold text-[11px] cursor-pointer"
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
                    : "bg-[#010804] text-white/70 hover:text-white border border-emerald-900/60"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1.5 rounded-lg bg-[#010804] border border-emerald-900/60 text-white/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold text-[11px] cursor-pointer"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
