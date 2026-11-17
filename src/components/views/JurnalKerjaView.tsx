"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, Plus } from "lucide-react";

export default function JurnalKerjaView() {
  const {
    currentActiveEmployee,
    isStaff,
    journals,
    setShowAddJournalModal,
  } = useApp();

  const displayJournals = isStaff
              ? journals.filter((j) => j.employeeId === currentActiveEmployee.id)
              : journals;

            return (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021008] p-5 rounded-2xl border border-emerald-900/60 shadow-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📝</span>
                      <h3 className="font-extrabold text-white text-base">Jurnal Kerja Harian</h3>
                      {isStaff && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          POV Karyawan Mandiri
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/70 mt-1 max-w-2xl">
                      {isStaff
                        ? `Catat dan laporkan seluruh aktivitas pekerjaan harian Anda (${currentActiveEmployee.name}). Apa saja yang dikerjakan wajib dilaporkan secara berkala kepada Supervisor ${currentActiveEmployee.dept}.`
                        : "Catatan laporan aktivitas pekerjaan harian tim dan penilaian kualitas oleh Supervisor / Manajemen."}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddJournalModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Jurnal Kerja Harian</span>
                  </button>
                </div>

                {displayJournals.length === 0 ? (
                  <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                      📝
                    </div>
                    <h4 className="font-bold text-white text-sm">Belum Ada Jurnal Kerja Tercatat</h4>
                    <p className="text-xs text-white/60 max-w-md mx-auto">
                      {isStaff
                        ? "Anda belum membuat laporan pekerjaan harian. Klik tombol di bawah untuk melaporkan apa saja yang Anda kerjakan hari ini."
                        : "Tidak ada data jurnal kerja yang ditemukan untuk kriteria filter ini."}
                    </p>
                    <button
                      onClick={() => setShowAddJournalModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs inline-flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tulis Jurnal Kerja Hari Ini
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayJournals.map((j) => (
                      <div
                        key={j.id}
                        className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 shadow-md space-y-3 transition-all hover:border-emerald-500/40"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/40 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center font-black text-white text-xs ring-1 ring-emerald-500/40">
                              {j.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-white text-sm">{j.name}</span>
                                {j.employeeId === currentActiveEmployee.id && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                    Jurnal Saya
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-white/60">
                                Departemen: {j.dept} • Tanggal: {j.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {j.score && (
                              <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                                Skor Evaluasi: {j.score}/100
                              </span>
                            )}
                            <span className="font-mono font-bold text-white text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-900/60">
                              ⏱️ {j.hours}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block mb-2">
                            Aktivitas & Tugas yang Dilaporkan ({j.tasks.length} Butir):
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
                            <span className="font-bold text-amber-300 block mb-0.5">Catatan / Kendala:</span>
                            <p>{j.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
}
