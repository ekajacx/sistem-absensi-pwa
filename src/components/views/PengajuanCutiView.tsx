"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import {
  Plus,
  Check,
  X,
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

export default function PengajuanCutiView() {
  const {
    activePerspective,
    canApproveLeaves,
    currentActiveEmployee,
    currentRoleName,
    directSubordinates,
    directSuperior,
    employees,
    handleApproveLeave,
    handleExportLeavesExcel,
    handleRejectLeave,
    isStaff,
    leaveActiveTab,
    myLeaves,
    myPendingLeavesCount,
    myRemainingQuota,
    myUsedLeaveDays,
    pendingSubordinateCount,
    setLeaveActiveTab,
    setLeaves,
    setShowApplyLeaveModal,
    showToast,
    standardDepartments,
    subordinateLeaves,
  } = useApp();

  // 1. State Siklus Arsip (Daftar Aktif vs Arsip Cuti)
  const [archiveTab, setArchiveTab] = useState<"active" | "archived">("active");

  // 2. State Filter (Status, Jenis Cuti, Departemen, Pencarian)
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 3. State Mode Ringkas / Accordion (ID cuti yang sedang dibuka rinciannya)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // 4. State Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // State konfirmasi hapus arsip
  const [confirmClearArchive, setConfirmClearArchive] = useState<boolean>(false);

  // Cek apakah role berhak memfilter semua departemen pada tab bawahan
  const canFilterAllDepts =
    activePerspective === "admin" ||
    currentRoleName === "Super Admin" ||
    currentRoleName === "General Manager" ||
    currentRoleName === "HR Supervisor";

  // Sumber data sesuai tab utama (Cuti Saya vs Persetujuan Cuti Bawahan)
  const sourceLeaves = leaveActiveTab === "subordinate-leaves" ? subordinateLeaves : myLeaves;

  // Pisahkan cuti aktif vs arsip
  const activeLeavesList = useMemo(
    () => sourceLeaves.filter((l) => !l.isArchived),
    [sourceLeaves]
  );
  const archivedLeavesList = useMemo(
    () => sourceLeaves.filter((l) => Boolean(l.isArchived)),
    [sourceLeaves]
  );

  const tabBaseLeaves = archiveTab === "active" ? activeLeavesList : archivedLeavesList;

  // Terapkan filter Status, Jenis Cuti, Departemen, dan Pencarian
  const filteredLeaves = useMemo(() => {
    return tabBaseLeaves.filter((l) => {
      const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
      const matchType = typeFilter === "ALL" || l.type === typeFilter;
      const matchDept =
        leaveActiveTab !== "subordinate-leaves" || !canFilterAllDepts
          ? true
          : deptFilter === "ALL" || l.dept === deptFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === "" ||
        l.name.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.dept.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q) ||
        l.start.toLowerCase().includes(q) ||
        l.end.toLowerCase().includes(q);
      return matchStatus && matchType && matchDept && matchSearch;
    });
  }, [tabBaseLeaves, statusFilter, typeFilter, deptFilter, searchQuery, leaveActiveTab, canFilterAllDepts]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLeaves.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedLeaves = filteredLeaves.slice(startIdx, startIdx + pageSize);

  // Metrik Ringkas
  const approvedCount = filteredLeaves.filter((l) => l.status === "DISETUJUI").length;
  const pendingCount = filteredLeaves.filter((l) => l.status === "MENUNGGU").length;
  const rejectedCount = filteredLeaves.filter((l) => l.status === "DITOLAK").length;
  const archivableInFilter = filteredLeaves.filter((l) => !l.isArchived && l.status !== "MENUNGGU");

  // Helpers Buka/Tutup Rincian (Accordion)
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allOnPageExpanded =
    paginatedLeaves.length > 0 && paginatedLeaves.every((l) => Boolean(expandedIds[l.id]));

  const toggleExpandAllOnPage = () => {
    if (allOnPageExpanded) {
      const next = { ...expandedIds };
      paginatedLeaves.forEach((l) => {
        delete next[l.id];
      });
      setExpandedIds(next);
    } else {
      const next = { ...expandedIds };
      paginatedLeaves.forEach((l) => {
        next[l.id] = true;
      });
      setExpandedIds(next);
    }
  };

  // Helpers Siklus Arsip
  const handleToggleArchiveSingle = (leaveId: string, archive: boolean) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, isArchived: archive } : l))
    );
    showToast(
      archive
        ? "📦 Permohonan cuti dipindahkan ke Arsip."
        : "♻️ Permohonan cuti dipulihkan ke Daftar Aktif.",
      "info"
    );
  };

  const handleArchiveCompletedInFilter = () => {
    if (archivableInFilter.length === 0) {
      showToast("Hanya permohonan yang sudah selesai (Disetujui/Ditolak) yang dapat diarsipkan!", "error");
      return;
    }
    const targetIds = new Set(archivableInFilter.map((l) => l.id));
    setLeaves((prev) =>
      prev.map((l) => (targetIds.has(l.id) ? { ...l, isArchived: true } : l))
    );
    showToast(`📦 ${archivableInFilter.length} berkas cuti selesai berhasil diarsipkan!`, "success");
    setCurrentPage(1);
  };

  const handleRestoreAllFiltered = () => {
    if (filteredLeaves.length === 0) return;
    const targetIds = new Set(filteredLeaves.map((l) => l.id));
    setLeaves((prev) =>
      prev.map((l) => (targetIds.has(l.id) ? { ...l, isArchived: false } : l))
    );
    showToast(`♻️ ${filteredLeaves.length} berkas cuti berhasil dipulihkan!`, "success");
    setCurrentPage(1);
  };

  const handleClearArchivedFiltered = () => {
    if (filteredLeaves.length === 0) return;
    const targetIds = new Set(filteredLeaves.map((l) => l.id));
    setLeaves((prev) => prev.filter((l) => !targetIds.has(l.id)));
    setConfirmClearArchive(false);
    showToast(`🗑️ ${filteredLeaves.length} arsip cuti telah dihapus permanen.`, "info");
    setCurrentPage(1);
  };

  const hasActiveFilter =
    statusFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    (leaveActiveTab === "subordinate-leaves" && canFilterAllDepts && deptFilter !== "ALL") ||
    searchQuery.trim() !== "";

  const resetFilters = () => {
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setDeptFilter("ALL");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filterSummaryText = [
    archiveTab === "active" ? "Daftar Aktif" : "Arsip Cuti",
    statusFilter !== "ALL" ? `Status: ${statusFilter}` : "Semua Status",
    typeFilter !== "ALL" ? `Jenis: ${typeFilter}` : null,
    leaveActiveTab === "subordinate-leaves" && canFilterAllDepts && deptFilter !== "ALL"
      ? `Dept: ${deptFilter}`
      : null,
    searchQuery.trim() ? `Cari: "${searchQuery.trim()}"` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="space-y-5">
      {/* Header Bar dengan Profil, Atasan Penyetuju & Quota */}
      <div className="bg-gradient-to-r from-[#062417] via-[#041910] to-[#021008] rounded-3xl p-6 border border-emerald-900/60 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏖️</span>
              <h3 className="font-black text-white text-lg tracking-wide">
                Sistem Pengajuan & Persetujuan Cuti Mandiri
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                N+1 Hierarchy Auto-Linked
              </span>
            </div>
            <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
              Karyawan dapat mengajukan permohonan cuti secara mandiri. Sistem otomatis menghubungkan permohonan ke atasan langsung Anda (
              {directSuperior
                ? `${directSuperior.name} — ${directSuperior.role}`
                : "Direktur Utama / Direksi"}
              ). Dilengkapi filter status, tampilan ringkas (buka-tutup), pagination, dan pengarsipan berkas.
            </p>

            {/* Ringkasan Profil & Atasan */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="bg-[#010804] px-3 py-1.5 rounded-xl border border-emerald-900/60 flex items-center gap-2">
                <span className="text-white/60">Pemohon Aktif:</span>
                <span className="font-bold text-white">{currentActiveEmployee.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-bold">
                  {currentActiveEmployee.role}
                </span>
              </div>
              <div className="bg-[#010804] px-3 py-1.5 rounded-xl border border-amber-900/40 flex items-center gap-2">
                <span className="text-amber-400 font-bold">🔒 Atasan Penyetuju (N+1):</span>
                <span className="font-bold text-white">
                  {directSuperior
                    ? `${directSuperior.name} (${directSuperior.role})`
                    : "Direktur Utama (CEO)"}
                </span>
              </div>
            </div>
          </div>

          {/* Tombol Ajukan Cuti Baru & Ekspor */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowApplyLeaveModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajukan Cuti Baru
            </button>
            <button
              onClick={() => handleExportLeavesExcel(filteredLeaves, filterSummaryText)}
              className="px-4 py-3 rounded-2xl bg-[#021008] border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-black hover:bg-emerald-950 transition-all cursor-pointer"
              title="Unduh laporan cuti sesuai tab & filter aktif ke format Excel (.xlsx)"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Ekspor Data Cuti ({filteredLeaves.length})</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-900/50">
          <div className="bg-[#010804]/80 p-3.5 rounded-2xl border border-emerald-900/50">
            <span className="text-[10px] text-white/60 font-bold uppercase block">Hak Cuti Tahunan</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-white font-mono">12</span>
              <span className="text-xs text-white/50">Hari/Tahun</span>
            </div>
          </div>
          <div className="bg-[#010804]/80 p-3.5 rounded-2xl border border-emerald-900/50">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Cuti Terpakai</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-emerald-400 font-mono">{myUsedLeaveDays}</span>
              <span className="text-xs text-white/50">Hari Disetujui</span>
            </div>
          </div>
          <div className="bg-[#010804]/80 p-3.5 rounded-2xl border border-emerald-900/50">
            <span className="text-[10px] text-teal-400 font-bold uppercase block">Sisa Kuota Cuti</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-teal-300 font-mono">{myRemainingQuota}</span>
              <span className="text-xs text-white/50">Hari Tersedia</span>
            </div>
          </div>
          <div className="bg-[#010804]/80 p-3.5 rounded-2xl border border-amber-900/40">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Menunggu Konfirmasi</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-amber-300 font-mono">{myPendingLeavesCount}</span>
              <span className="text-xs text-white/50">Pengajuan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Utama + Sub-Tab Siklus Arsip & Aksi Massal */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLeaveActiveTab("my-leaves");
              setCurrentPage(1);
              setConfirmClearArchive(false);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              leaveActiveTab === "my-leaves"
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
            }`}
          >
            <span>🏖️</span>
            <span>Cuti Saya ({myLeaves.filter((l) => !l.isArchived).length})</span>
          </button>

          {!isStaff && (
            <button
              type="button"
              onClick={() => {
                setLeaveActiveTab("subordinate-leaves");
                setCurrentPage(1);
                setConfirmClearArchive(false);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all relative cursor-pointer ${
                leaveActiveTab === "subordinate-leaves"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
              }`}
            >
              <span>✍️</span>
              <span>Persetujuan Cuti Bawahan ({subordinateLeaves.filter((l) => !l.isArchived).length})</span>
              {pendingSubordinateCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black animate-pulse">
                  {pendingSubordinateCount} Pending
                </span>
              )}
            </button>
          )}
        </div>

        {/* Sub-Tab Daftar Aktif vs Arsip Cuti + Aksi Massal */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#010804] p-1 rounded-xl border border-emerald-900/60 gap-1">
            <button
              type="button"
              onClick={() => {
                setArchiveTab("active");
                setCurrentPage(1);
                setConfirmClearArchive(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                archiveTab === "active"
                  ? "bg-emerald-500 text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span>📋 Aktif ({activeLeavesList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setArchiveTab("archived");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                archiveTab === "archived"
                  ? "bg-amber-400 text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Archive className="w-3 h-3" />
              <span>Arsip ({archivedLeavesList.length})</span>
            </button>
          </div>

          {archiveTab === "active" && archivableInFilter.length > 0 && (
            <button
              type="button"
              onClick={handleArchiveCompletedInFilter}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Arsipkan permohonan cuti yang sudah selesai ditinjau (Disetujui / Ditolak)"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Arsipkan Selesai ({archivableInFilter.length})</span>
            </button>
          )}

          {archiveTab === "archived" && filteredLeaves.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleRestoreAllFiltered}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pulihkan Semua ({filteredLeaves.length})</span>
              </button>

              {!isStaff && (
                confirmClearArchive ? (
                  <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/50 rounded-xl px-2.5 py-1">
                    <span className="text-[11px] text-red-200 font-bold">
                      Hapus permanen {filteredLeaves.length} arsip?
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

      {/* Bar Filter: Status, Jenis Cuti, Departemen, & Pencarian */}
      <div className="bg-[#02120a] rounded-2xl p-4 border border-emerald-900/60 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Filter Status */}
          <div className="lg:col-span-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Status Permohonan
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-400"
            >
              <option value="ALL">Semua Status</option>
              <option value="MENUNGGU">⏳ MENUNGGU (Pending)</option>
              <option value="DISETUJUI">✓ DISETUJUI</option>
              <option value="DITOLAK">✕ DITOLAK</option>
            </select>
          </div>

          {/* Filter Jenis Cuti */}
          <div className="lg:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Jenis Cuti
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-400"
            >
              <option value="ALL">Semua Jenis</option>
              <option value="Tahunan">🏖️ Tahunan</option>
              <option value="Sakit">🏥 Sakit</option>
              <option value="Melahirkan">👶 Melahirkan</option>
              <option value="Khusus">⭐ Khusus</option>
            </select>
          </div>

          {/* Filter Departemen (Khusus Tab Bawahan) */}
          <div className="lg:col-span-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Departemen
            </label>
            {leaveActiveTab === "subordinate-leaves" && canFilterAllDepts ? (
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
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
                <span className="text-[10px] text-white/50">
                  🔒 {leaveActiveTab === "my-leaves" ? "Pribadi" : "Tim"}
                </span>
              </div>
            )}
          </div>

          {/* Pencarian Kata Kunci */}
          <div className="lg:col-span-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Cari Nama / ID Cuti / Alasan / Tanggal
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
                  placeholder="Ketik nama, alasan, atau tanggal..."
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
              <strong className="text-white font-extrabold">{filteredLeaves.length} Berkas</strong>
            </span>
            <span>•</span>
            <span>
              Pending:{" "}
              <strong className="text-amber-300 font-bold">{pendingCount}</strong>
            </span>
            <span>•</span>
            <span>
              Disetujui:{" "}
              <strong className="text-emerald-400 font-bold">{approvedCount}</strong>
            </span>
            <span>•</span>
            <span>
              Ditolak:{" "}
              <strong className="text-red-400 font-bold">{rejectedCount}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {paginatedLeaves.length > 0 && (
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

      {/* Daftar Kartu Cuti (Mode Ringkas Accordion) */}
      {leaveActiveTab === "subordinate-leaves" && !canApproveLeaves && directSubordinates.length === 0 ? (
        <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-2">
          <div className="text-3xl">ℹ️</div>
          <h5 className="font-bold text-white text-sm">Akses Khusus Atasan Langsung</h5>
          <p className="text-xs text-white/60 max-w-md mx-auto">
            Akun aktif Anda ({currentActiveEmployee.name} - {currentActiveEmployee.role}) berstatus Staff dan tidak memiliki bawahan langsung.
          </p>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
            {archiveTab === "active" ? "🏖️" : "🗄️"}
          </div>
          <h5 className="font-bold text-white text-sm">
            {archiveTab === "active"
              ? "Tidak Ada Permohonan Cuti pada Filter Ini"
              : "Belum Ada Berkas Cuti di Dalam Arsip"}
          </h5>
          <p className="text-xs text-white/60 max-w-md mx-auto">
            {hasActiveFilter
              ? "Coba ubah filter status, jenis cuti, departemen, atau kata kunci pencarian Anda."
              : archiveTab === "active"
              ? "Semua permohonan cuti telah diproses atau belum ada pengajuan baru."
              : "Permohonan cuti yang sudah selesai (Disetujui / Ditolak) dapat diarsipkan agar daftar aktif tidak menumpuk."}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 font-extrabold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {paginatedLeaves.map((c) => {
            const isExpanded = Boolean(expandedIds[c.id]);
            const empData = employees.find((e) => e.id === c.employeeId);
            const typeIcon =
              c.type === "Sakit"
                ? "🏥"
                : c.type === "Melahirkan"
                ? "👶"
                : c.type === "Khusus"
                ? "⭐"
                : "🏖️";

            return (
              <div
                key={c.id}
                className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl border border-emerald-900/60 shadow-md transition-all hover:border-emerald-500/40 overflow-hidden"
              >
                {/* Baris Ringkas (Header Kartu) */}
                <div
                  onClick={() => toggleExpand(c.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center font-black text-white text-xs ring-1 ring-emerald-500/40 shrink-0 overflow-hidden">
                      {empData?.photoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={empData.photoUrl}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        empData?.avatar || c.name.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-white text-sm truncate">
                          {c.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                          {c.dept}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/90 border border-emerald-900/60 font-bold">
                          {typeIcon} Cuti {c.type}
                        </span>
                        {c.isArchived && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            Diarsipkan
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/60 mt-0.5">
                        <span className="inline-flex items-center gap-1 font-mono text-white/85 font-semibold">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          {c.start} s/d {c.end}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-300 font-extrabold">
                          {c.days} Hari
                        </span>
                        {!isExpanded && (
                          <>
                            <span className="hidden md:inline">•</span>
                            <span className="hidden md:inline text-white/50 truncate max-w-xs">
                              {c.reason}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status + Tombol Setujui/Tolak/Arsip + Tombol Rincian */}
                  <div
                    className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black inline-flex items-center gap-1 ${
                        c.status === "DISETUJUI"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                          : c.status === "MENUNGGU"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse"
                          : "bg-red-500/20 text-red-300 border border-red-400/40"
                      }`}
                    >
                      {c.status === "DISETUJUI" && "✓ "}
                      {c.status === "MENUNGGU" && "⏳ "}
                      {c.status === "DITOLAK" && "✕ "}
                      {c.status}
                    </span>

                    {/* Aksi Persetujuan Atasan pada Tab Bawahan jika masih MENUNGGU */}
                    {leaveActiveTab === "subordinate-leaves" && c.status === "MENUNGGU" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveLeave(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] flex items-center gap-1 shadow transition-all cursor-pointer"
                          title="Setujui permohonan cuti"
                        >
                          <Check className="w-3 h-3" />
                          <span>Setujui</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectLeave(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                          title="Tolak permohonan cuti"
                        >
                          <X className="w-3 h-3" />
                          <span>Tolak</span>
                        </button>
                      </>
                    )}

                    {/* Tombol Arsipkan / Pulihkan (untuk berkas yang sudah tidak MENUNGGU) */}
                    {c.status !== "MENUNGGU" && (
                      c.isArchived ? (
                        <button
                          type="button"
                          onClick={() => handleToggleArchiveSingle(c.id, false)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Pulihkan ke Daftar Aktif"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Pulihkan</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleArchiveSingle(c.id, true)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Simpan ke Arsip Cuti"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Arsipkan</span>
                        </button>
                      )
                    )}

                    {/* Tombol Buka/Tutup Rincian */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(c.id)}
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

                {/* Isi Rincian Pengajuan Cuti (Muncul Saat Dibuka) */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-emerald-900/40 bg-[#010b06]/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 space-y-1">
                      <span className="text-[10px] text-white/50 font-bold uppercase block">
                        Informasi Berkas & Pemohon
                      </span>
                      <div className="flex justify-between">
                        <span className="text-white/60">ID Permohonan:</span>
                        <span className="font-mono font-bold text-white">{c.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Jabatan:</span>
                        <span className="font-semibold text-white">
                          {empData?.role || c.dept}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Nomor KTP:</span>
                        <span className="font-mono text-white/80">
                          {empData?.nik || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                        Alasan Pengajuan Cuti
                      </span>
                      <p className="text-white/90 leading-relaxed">{c.reason}</p>
                    </div>

                    <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">
                        Status & Atasan Penyetuju (N+1)
                      </span>
                      <div className="flex justify-between">
                        <span className="text-white/60">Atasan Penyetuju:</span>
                        <span className="font-bold text-white">
                          {c.approverName ||
                            (directSuperior
                              ? `${directSuperior.name} (${directSuperior.role})`
                              : "Direktur Utama")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Waktu Ditinjau:</span>
                        <span className="font-mono text-emerald-300">
                          {c.approvedAt || "Menunggu Konfirmasi"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bar Navigasi Pagination */}
      {filteredLeaves.length > 0 && (
        <div className="bg-[#021008] rounded-2xl p-3.5 border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-white/60 text-[11px]">
            Menampilkan{" "}
            <strong className="text-white">
              {startIdx + 1}–{Math.min(startIdx + pageSize, filteredLeaves.length)}
            </strong>{" "}
            dari <strong className="text-emerald-400">{filteredLeaves.length}</strong> berkas cuti
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
