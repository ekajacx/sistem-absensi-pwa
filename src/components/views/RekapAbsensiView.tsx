"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { FileText, Search, Filter, Download, Pencil, Check } from "lucide-react";

export default function RekapAbsensiView() {
  const {
    attendances,
    filteredAttendances,
    handleExportCSV,
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
  } = useApp();

  return (
    <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-6 border border-emerald-900/60 space-y-5">
              {/* Header Box & Tombol Ekspor */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-emerald-900/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h3 className="font-black text-white text-lg">Rekapitulasi Kehadiran Karyawan</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Panel HRD & Manajemen
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-1 max-w-2xl">
                    Audit log kehadiran terverifikasi otomatis. HRD dan atasan memantau rekap absensi tim, memfilter per departemen, dan mengekspor laporan ke file CSV/Excel.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-black hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
                    title="Unduh data terfilter ke format CSV / Microsoft Excel"
                  >
                    <Download className="w-4 h-4" />
                    <span>Ekspor CSV / Excel ({filteredAttendances.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#020d07] text-white border border-emerald-900/60 text-xs font-bold hover:bg-emerald-950 transition-all"
                    title="Cetak atau simpan sebagai PDF"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Cetak / PDF</span>
                  </button>
                </div>
              </div>

              {/* Filter Controls Bar (Filter Lengkap 7 Departemen & Status) */}
              <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-3">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                  FILTER DATA REKAP ABSENSI
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Filter 1: Departemen Lengkap (7 Dept) */}
                  <div>
                    <label className="block text-[11px] text-white/70 font-bold mb-1">
                      Departemen ({standardDepartments.length})
                    </label>
                    <select
                      value={rekapDeptFilter}
                      onChange={(e) => setRekapDeptFilter(e.target.value)}
                      className="w-full bg-[#021008] border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="ALL">Semua Departemen ({standardDepartments.length})</option>
                      {standardDepartments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.icon} {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 2: Status Kehadiran */}
                  <div>
                    <label className="block text-[11px] text-white/70 font-bold mb-1">
                      Status Kehadiran
                    </label>
                    <select
                      value={rekapStatusFilter}
                      onChange={(e) => setRekapStatusFilter(e.target.value)}
                      className="w-full bg-[#021008] border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none"
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
                        onChange={(e) => setRekapSearchQuery(e.target.value)}
                        placeholder="Ketik nama, No. KTP, atau shift..."
                        className="w-full bg-[#021008] border border-emerald-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Bar Filter Aktif & Reset */}
                {(rekapDeptFilter !== "ALL" || rekapStatusFilter !== "ALL" || rekapSearchQuery !== "") && (
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40 text-xs">
                    <span className="text-white/60 text-[11px]">
                      Menampilkan <strong>{filteredAttendances.length}</strong> dari {attendances.length} data log
                      {rekapDeptFilter !== "ALL" && ` • Dept: ${rekapDeptFilter}`}
                      {rekapStatusFilter !== "ALL" && ` • Status: ${rekapStatusFilter}`}
                    </span>
                    <button
                      onClick={() => {
                        setRekapDeptFilter("ALL");
                        setRekapStatusFilter("ALL");
                        setRekapSearchQuery("");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-500/40 text-xs font-semibold hover:bg-red-900 transition-all"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>

              {/* Ringkasan Metrik Singkat */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
                  <span className="text-[10px] text-white/60 block font-bold uppercase">Total Kehadiran</span>
                  <span className="text-lg font-black text-white">{filteredAttendances.length} Log</span>
                </div>
                <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
                  <span className="text-[10px] text-emerald-400 block font-bold uppercase">Hadir Tepat Waktu</span>
                  <span className="text-lg font-black text-emerald-400">
                    {filteredAttendances.filter((a) => a.status === "APPROVED").length}
                  </span>
                </div>
                <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
                  <span className="text-[10px] text-amber-400 block font-bold uppercase">Terlambat</span>
                  <span className="text-lg font-black text-amber-400">
                    {filteredAttendances.filter((a) => a.status === "TERLAMBAT").length}
                  </span>
                </div>
                <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
                  <span className="text-[10px] text-sky-400 block font-bold uppercase">Rata-rata AI Face</span>
                  <span className="text-lg font-black text-sky-300">
                    {filteredAttendances.length > 0
                      ? (filteredAttendances.reduce((acc, c) => acc + c.score, 0) / filteredAttendances.length).toFixed(1) + "%"
                      : "0%"}
                  </span>
                </div>
              </div>

              {/* Tabel Data Rekap Absensi */}
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
                    {filteredAttendances.length > 0 ? (
                      filteredAttendances.map((r, idx) => (
                        <tr key={r.id} className="hover:bg-emerald-950/20 transition-colors">
                          <td className="py-3 pl-3 text-white/40 font-mono text-[11px]">{idx + 1}</td>
                          <td className="py-3">
                            <span className="font-bold text-white block leading-tight">{r.name}</span>
                            <span className="text-[10px] text-white/50 font-mono">No. KTP: {r.nik}</span>
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
                                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition-all flex items-center gap-1 mx-auto"
                                title="Koreksi jam check-in/out jika karyawan lupa absen"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={11} className="py-8 text-center text-white/50 text-xs">
                          Tidak ada catatan absensi yang sesuai dengan filter yang dipilih.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>Buka Audit Log Lengkap →</span>
                  </button>
                </div>
              )}
            </div>
  );
}
