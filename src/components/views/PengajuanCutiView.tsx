"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Plus, Check, X, Download } from "lucide-react";

export default function PengajuanCutiView() {
  const {
    canApproveLeaves,
    currentActiveEmployee,
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
    setShowApplyLeaveModal,
    subordinateLeaves,
  } = useApp();

  return (
    <div className="space-y-6">
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
                      Karyawan dapat mengajukan permohonan cuti secara mandiri. Sistem otomatis menghubungkan permohonan ke atasan langsung Anda ({directSuperior ? `${directSuperior.name} — ${directSuperior.role}` : "Direktur Utama / Direksi"}). Atasan dapat menyetujui atau menolak permohonan bawahan secara real-time.
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
                          {directSuperior ? `${directSuperior.name} (${directSuperior.role})` : "Direktur Utama (CEO)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Ajukan Cuti Baru */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowApplyLeaveModal(true)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Ajukan Cuti Baru
                    </button>
                    <button
                      onClick={handleExportLeavesExcel}
                      className="px-4 py-3 rounded-2xl bg-[#021008] border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-black hover:bg-emerald-950 transition-all cursor-pointer"
                      title="Unduh laporan riwayat cuti ke format Excel (.xlsx)"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Ekspor Excel (.xlsx)</span>
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

              {/* Tab Selector: [🏖️ Cuti Saya] vs [✍️ Persetujuan Cuti Bawahan] */}
              <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-3">
                <button
                  onClick={() => setLeaveActiveTab("my-leaves")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    leaveActiveTab === "my-leaves"
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                      : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
                  }`}
                >
                  <span>🏖️</span>
                  <span>Cuti Saya ({myLeaves.length})</span>
                </button>

                {!isStaff && (
                  <button
                    onClick={() => setLeaveActiveTab("subordinate-leaves")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all relative ${
                      leaveActiveTab === "subordinate-leaves"
                        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                        : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
                    }`}
                  >
                    <span>✍️</span>
                    <span>Persetujuan Cuti Bawahan</span>
                    {pendingSubordinateCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black animate-pulse">
                        {pendingSubordinateCount} Pending
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* CONTENT TAB 1: CUTI SAYA */}
              {leaveActiveTab === "my-leaves" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-white text-sm">Riwayat Pengajuan Cuti Mandiri</h4>
                    <p className="text-xs text-white/60">
                      Daftar seluruh cuti yang diajukan oleh akun aktif Anda ({currentActiveEmployee.name}) beserta status persetujuan dari atasan.
                    </p>
                  </div>

                  {myLeaves.length === 0 ? (
                    <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-950 flex items-center justify-center mx-auto text-2xl">
                        🏖️
                      </div>
                      <h5 className="font-bold text-white text-sm">Belum Ada Pengajuan Cuti</h5>
                      <p className="text-xs text-white/60 max-w-sm mx-auto">
                        Anda belum pernah mengajukan cuti. Gunakan tombol <strong className="text-emerald-400">+ Ajukan Cuti Baru</strong> di atas untuk mengajukan cuti tahunan, sakit, atau izin khusus.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto shadow-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                            <th className="pb-3">ID & Jenis Cuti</th>
                            <th className="pb-3">Periode Tanggal</th>
                            <th className="pb-3">Durasi</th>
                            <th className="pb-3">Atasan Penyetuju (N+1)</th>
                            <th className="pb-3">Alasan Pengajuan</th>
                            <th className="pb-3">Status Permohonan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-900/30">
                          {myLeaves.map((c) => (
                            <tr key={c.id} className="hover:bg-emerald-950/20 transition-colors">
                              <td className="py-3">
                                <div className="font-bold text-white flex items-center gap-2">
                                  <span>{c.type === "Sakit" ? "🏥" : c.type === "Melahirkan" ? "👶" : c.type === "Khusus" ? "⭐" : "🏖️"}</span>
                                  <span>Cuti {c.type}</span>
                                </div>
                                <span className="text-[10px] text-white/50 font-mono">{c.id}</span>
                              </td>
                              <td className="py-3 font-mono text-white text-[11px]">
                                {c.start} s/d {c.end}
                              </td>
                              <td className="py-3">
                                <span className="font-extrabold text-white text-[11px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900/60">
                                  {c.days} Hari
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="text-white font-medium text-[11px]">
                                  {c.approverName || (directSuperior ? `${directSuperior.name} (${directSuperior.role})` : "Direktur Utama")}
                                </div>
                                {c.approvedAt && (
                                  <span className="text-[10px] text-emerald-400 block font-mono">
                                    {c.approvedAt}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-white/70 text-[11px] max-w-[220px]">
                                {c.reason}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black inline-flex items-center gap-1.5 ${
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
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* CONTENT TAB 2: PERSETUJUAN CUTI BAWAHAN */}
              {!isStaff && leaveActiveTab === "subordinate-leaves" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">Persetujuan Cuti Bawahan Langsung</h4>
                      <p className="text-xs text-white/60">
                        {currentActiveEmployee.level === "GeneralManager"
                          ? "Sebagai General Manager, Anda bertanggung jawab meninjau cuti dari 6 Supervisor Departemen."
                          : currentActiveEmployee.level === "Supervisor"
                          ? `Sebagai Supervisor ${currentActiveEmployee.dept}, Anda bertanggung jawab menyetujui atau menolak cuti staff di departemen Anda.`
                          : currentActiveEmployee.level === "Director"
                          ? "Sebagai Direktur Utama, Anda meninjau cuti dari General Manager dan memiliki hak supervisi global."
                          : "Hanya atasan langsung (Supervisor, GM, Direksi) yang memiliki wewenang menyetujui cuti bawahan."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/70 font-medium">Bawahan Langsung:</span>
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-900/60">
                        {directSubordinates.length} Orang
                      </span>
                    </div>
                  </div>

                  {!canApproveLeaves && directSubordinates.length === 0 ? (
                    <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-2">
                      <div className="text-3xl">ℹ️</div>
                      <h5 className="font-bold text-white text-sm">Akses Khusus Atasan Langsung</h5>
                      <p className="text-xs text-white/60 max-w-md mx-auto">
                        Akun aktif Anda ({currentActiveEmployee.name} - {currentActiveEmployee.role}) berstatus Staff dan tidak memiliki bawahan langsung. Pengajuan cuti Anda diproses oleh atasan langsung Anda di tab sebelah.
                      </p>
                    </div>
                  ) : subordinateLeaves.length === 0 ? (
                    <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-2">
                      <div className="text-3xl">🎉</div>
                      <h5 className="font-bold text-white text-sm">Tidak Ada Permohonan Cuti Pending</h5>
                      <p className="text-xs text-white/60 max-w-md mx-auto">
                        Semua permohonan cuti dari staf bawahan langsung Anda telah selesai diproses.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto shadow-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                            <th className="pb-3">Karyawan Pemohon</th>
                            <th className="pb-3">Departemen</th>
                            <th className="pb-3">Jenis Cuti</th>
                            <th className="pb-3">Tanggal Pelaksanaan</th>
                            <th className="pb-3">Durasi</th>
                            <th className="pb-3">Alasan Pengajuan</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Aksi Persetujuan Atasan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-900/30">
                          {subordinateLeaves.map((c) => {
                            const empData = employees.find((e) => e.id === c.employeeId);
                            return (
                              <tr key={c.id} className="hover:bg-emerald-950/20 transition-colors">
                                <td className="py-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center font-bold text-white text-[11px]">
                                      {empData?.avatar || c.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-bold text-white">{c.name}</div>
                                      <div className="text-[10px] text-white/50 font-mono">
                                        {empData?.role || c.dept} • {empData?.nik || c.employeeId}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 font-black text-white">{c.dept}</td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-emerald-300 border border-emerald-900/60">
                                    {c.type}
                                  </span>
                                </td>
                                <td className="py-3 font-mono text-white text-[11px]">
                                  {c.start} s/d {c.end}
                                </td>
                                <td className="py-3 font-extrabold text-white text-[11px]">{c.days} Hari</td>
                                <td className="py-3 text-white/70 text-[11px] max-w-[200px]">
                                  {c.reason}
                                </td>
                                <td className="py-3">
                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 ${
                                      c.status === "DISETUJUI"
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                                        : c.status === "MENUNGGU"
                                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse"
                                        : "bg-red-500/20 text-red-300 border border-red-400/40"
                                    }`}
                                  >
                                    {c.status}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  {c.status === "MENUNGGU" ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => handleApproveLeave(c.id)}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                                        title="Setujui permohonan cuti"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        Setujui
                                      </button>
                                      <button
                                        onClick={() => handleRejectLeave(c.id)}
                                        className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 font-bold text-[11px] flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                                        title="Tolak permohonan cuti"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                        Tolak
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-right">
                                      <span className="text-[10px] text-white/50 font-mono block">
                                        {c.approvedAt || "Selesai ditinjau"}
                                      </span>
                                      <span className="text-[9px] text-white/40 block">
                                        Oleh: {c.approverName || "Atasan"}
                                      </span>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
  );
}
