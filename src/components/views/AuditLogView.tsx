"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

export default function AuditLogView() {
  const {
    activityLogs,
    filteredActivityLogs,
    handleExportAuditLogsExcel,
    logDeptFilter,
    logSearchQuery,
    logTypeFilter,
    setLogDeptFilter,
    setLogSearchQuery,
    setLogTypeFilter,
  } = useApp();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const totalPages = Math.max(1, Math.ceil(filteredActivityLogs.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedLogs = filteredActivityLogs.slice(startIdx, startIdx + pageSize);

  return (
    <div className="space-y-5">
      {/* Box Utama Audit Log */}
      <div className="bg-[#010804] border border-emerald-900/60 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header Information Box Sesuai Foto User */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-900/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <h4 className="font-black text-white text-base tracking-wide">
                Audit Log Aktivitas Kehadiran & Sistem
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Hak Akses log_view Terverifikasi
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              Rekam jejak otomatis (check-in/out, cuti) & modifikasi manual.{" "}
              <strong className="text-red-400 font-bold">Log berwarna merah</strong> menandakan data hasil koreksi/edit manual dengan informasi user pengedit.
            </p>
          </div>

          {/* Toolbar Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Departemen */}
            <select
              value={logDeptFilter}
              onChange={(e) => setLogDeptFilter(e.target.value)}
              className="bg-[#021008] border border-emerald-900/70 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">🏢 Semua Dept</option>
              <option value="Direksi">Direksi</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
              <option value="IT">IT</option>
            </select>

            {/* Filter Jenis Log */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/60 font-bold whitespace-nowrap">Filter Log:</span>
              <select
                value={logTypeFilter}
                onChange={(e) => setLogTypeFilter(e.target.value)}
                className="bg-[#021008] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Aktivitas ({activityLogs.length})</option>
                <option value="MANUAL_EDIT">⚠️ Modifikasi Manual (Warna Merah)</option>
                <option value="AUTO">✓ Aktivitas Otomatis</option>
              </select>
            </div>

            {/* Input Pencarian */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Cari aktor, log, alasan..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                className="bg-[#021008] border border-emerald-900/70 text-white text-xs rounded-xl pl-8 pr-3 py-2 w-48 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-white/30"
              />
            </div>

            {/* Tombol Ekspor Audit Log (.xlsx) */}
            <button
              onClick={handleExportAuditLogsExcel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#021008] border border-emerald-500/50 text-emerald-300 font-extrabold text-xs hover:bg-emerald-950 transition-all shadow-md cursor-pointer"
              title="Unduh rekam jejak audit log ke format Microsoft Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ekspor Excel ({filteredActivityLogs.length})</span>
            </button>
          </div>
        </div>

        {/* Counter & Ukuran Halaman */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/50 px-1">
          <span>
            Menampilkan{" "}
            <strong className="text-white">
              {filteredActivityLogs.length > 0 ? startIdx + 1 : 0}–
              {Math.min(startIdx + pageSize, filteredActivityLogs.length)}
            </strong>{" "}
            dari <strong className="text-emerald-400">{filteredActivityLogs.length}</strong> aktivitas
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-white/60">
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
            <span className="text-[10px] font-mono hidden sm:inline">Real-Time Audit Trail Auto-Logged</span>
          </div>
        </div>

        {/* Daftar Card Log Sesuai Desain Gambar User */}
        <div className="space-y-3">
          {paginatedLogs.length > 0 ? (
            paginatedLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-2xl border transition-all ${
                  log.isEdited
                    ? "bg-gradient-to-r from-red-950/70 via-red-950/40 to-[#010804] border-red-500/70 ring-1 ring-red-500/40 shadow-lg shadow-red-950/40"
                    : "bg-[#021008] border-emerald-900/50 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        log.isEdited
                          ? "bg-red-500 text-white shadow-sm"
                          : log.type === "CHECK_IN"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      }`}
                    >
                      {log.isEdited ? "⚠️ MODIFIKASI MANUAL" : log.type === "CHECK_IN" ? "CHECK-IN" : "CUTI"}
                    </span>
                    <h5 className={`font-black text-xs ${log.isEdited ? "text-red-300" : "text-white"}`}>
                      {log.title}
                    </h5>
                    <span className="text-[10px] text-white/40">
                      • Dept: <span className="text-white/80 font-bold">{log.dept}</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 font-mono">
                    {log.timestamp}
                  </span>
                </div>

                <p className={`text-xs ${log.isEdited ? "text-red-200/90 font-medium" : "text-white/70"}`}>
                  {log.description}
                </p>

                {/* Info Aktor & Alasan Edit (Khusus Merah) */}
                {log.isEdited ? (
                  <div className="mt-3 pt-2.5 border-t border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-red-950/50 -mx-4 -mb-4 p-3 rounded-b-2xl text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                        Diedit Manual Oleh User:
                      </span>
                      <span className="font-extrabold text-white">
                        {log.actorName} <span className="text-red-300 font-semibold">({log.actorRole})</span>
                      </span>
                    </div>
                    {log.editReason && (
                      <div className="sm:max-w-md sm:text-right">
                        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                          Alasan / Keterangan Edit:
                        </span>
                        <span className="italic text-red-200 font-medium">
                          &quot;{log.editReason}&quot;
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 text-[10px] text-white/40">
                    Aktor: <span className="text-white/70 font-semibold">{log.actorName}</span> ({log.actorRole})
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-white/40 text-xs">
              Tidak ada riwayat log yang sesuai dengan filter.
            </div>
          )}
        </div>

        {/* Bar Navigasi Pagination Audit Log */}
        {filteredActivityLogs.length > 0 && (
          <div className="bg-[#021008] rounded-2xl p-3.5 border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-white/60 text-[11px]">
              Halaman <strong className="text-white">{safePage}</strong> dari{" "}
              <strong className="text-emerald-400">{totalPages}</strong> ({filteredActivityLogs.length} log)
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
    </div>
  );
}
