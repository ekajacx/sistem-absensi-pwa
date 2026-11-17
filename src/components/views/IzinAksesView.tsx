"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Check } from "lucide-react";

export default function IzinAksesView() {
  const {
    allPermissions,
    rolePermissions,
    togglePermission,
  } = useApp();

  const roles = [
              { key: "Super Admin",      label: "Super Admin",    color: "text-amber-300",  bg: "bg-amber-900/20",   border: "border-amber-700/40"  },
              { key: "General Manager",  label: "GM",             color: "text-purple-300", bg: "bg-purple-900/20",  border: "border-purple-700/40" },
              { key: "HR Supervisor",    label: "HR Spv",         color: "text-pink-300",   bg: "bg-pink-900/20",    border: "border-pink-700/40"   },
              { key: "HR Staff",         label: "HR Staff",       color: "text-pink-200",   bg: "bg-pink-900/10",    border: "border-pink-700/30"   },
              { key: "IT Supervisor",    label: "IT Spv",         color: "text-blue-300",   bg: "bg-blue-900/20",    border: "border-blue-700/40"   },
              { key: "IT Staff",         label: "IT Staff",       color: "text-blue-200",   bg: "bg-blue-900/10",    border: "border-blue-700/30"   },
              { key: "Supervisor",       label: "Supervisor",     color: "text-teal-300",   bg: "bg-teal-900/20",    border: "border-teal-700/40"   },
              { key: "Staff",            label: "Staff",          color: "text-emerald-300",bg: "bg-emerald-900/20", border: "border-emerald-700/40"},
            ];

            const categoryConfig: Record<string, { icon: string; color: string; bg: string; border: string; desc: string }> = {
              "Hak Akses Menu Sistem":    { icon: "🗂️",  color: "text-cyan-300",    bg: "bg-cyan-950/40",    border: "border-cyan-700/50",    desc: "Menu utama yang bisa dibuka di sidebar" },
              "Dashboard":                { icon: "📊",  color: "text-indigo-300",  bg: "bg-indigo-950/40",  border: "border-indigo-700/50",  desc: "Tampilan ringkasan & analitik data" },
              "Wewenang Khusus HR":       { icon: "👔",  color: "text-pink-300",    bg: "bg-pink-950/40",    border: "border-pink-700/50",    desc: "Fungsi eksklusif tim Human Resources" },
              "Wewenang Khusus IT":       { icon: "🛡️",  color: "text-blue-300",    bg: "bg-blue-950/40",    border: "border-blue-700/50",    desc: "Fungsi eksklusif tim Information Technology" },
              "Absensi":                  { icon: "📍",  color: "text-emerald-300", bg: "bg-emerald-950/40", border: "border-emerald-700/50", desc: "Fitur kehadiran, rekap & koreksi absensi" },
              "Audit Log & Jejak Digital":{ icon: "🔍",  color: "text-orange-300",  bg: "bg-orange-950/40",  border: "border-orange-700/50",  desc: "Riwayat aktivitas sistem & modifikasi data" },
              "Cuti":                     { icon: "⛱️",  color: "text-sky-300",     bg: "bg-sky-950/40",     border: "border-sky-700/50",     desc: "Pengajuan & persetujuan cuti karyawan" },
              "Jurnal":                   { icon: "📝",  color: "text-lime-300",    bg: "bg-lime-950/40",    border: "border-lime-700/50",    desc: "Catatan kerja harian & penilaian supervisor" },
              "Manajemen Karyawan":       { icon: "👥",  color: "text-amber-200",   bg: "bg-amber-950/40",   border: "border-amber-700/50",   desc: "Edit, nonaktifkan, atau hapus data karyawan" },
            };

            // Kelompokkan permissions per kategori, urutkan sesuai categoryConfig
            const categoryOrder = Object.keys(categoryConfig);
            const grouped: Record<string, typeof allPermissions> = {};
            allPermissions.forEach((p) => {
              if (!grouped[p.category]) grouped[p.category] = [];
              grouped[p.category].push(p);
            });
            const sortedCategories = categoryOrder.filter((c) => grouped[c]);

            return (
              <div className="space-y-5">
                {/* Legend Role di atas */}
                <div className="bg-[#021008] rounded-2xl p-4 border border-emerald-900/50">
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-3">Legenda Peran (Role)</p>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((r) => (
                      <span key={r.key} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${r.color} ${r.bg} ${r.border}`}>
                        {r.label}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/35 mt-3">✅ = Izin aktif &nbsp;|&nbsp; ○ = Tidak ada izin &nbsp;|&nbsp; Klik tombol untuk toggle on/off</p>
                </div>

                {/* Per-Kategori Group */}
                {sortedCategories.map((cat) => {
                  const cfg = categoryConfig[cat] ?? { icon: "📋", color: "text-white/60", bg: "bg-white/5", border: "border-white/10", desc: "" };
                  const perms = grouped[cat];
                  return (
                    <div key={cat} className={`rounded-2xl border overflow-hidden ${cfg.border}`}>
                      {/* Category Header */}
                      <div className={`${cfg.bg} px-5 py-3 flex items-center gap-3 border-b ${cfg.border}`}>
                        <span className="text-xl">{cfg.icon}</span>
                        <div>
                          <span className={`text-sm font-extrabold uppercase tracking-wide ${cfg.color}`}>{cat}</span>
                          {cfg.desc && <p className="text-[11px] text-white/50 mt-0.5">{cfg.desc}</p>}
                        </div>
                        <span className="ml-auto text-[10px] font-bold text-white/30 border border-white/10 rounded-full px-2 py-0.5">{perms.length} izin</span>
                      </div>

                      {/* Tabel per kategori */}
                      <div className="overflow-x-auto bg-[#010c06]">
                        <table className="w-full text-left text-xs min-w-[860px]">
                          <thead>
                            <tr className="border-b border-emerald-900/40 text-[10px] uppercase font-bold text-white/40">
                              <th className="py-2 px-5 w-72">Nama Izin & Keterangan</th>
                              {roles.map((r) => (
                                <th key={r.key} className={`py-2 px-3 text-center ${r.color}`}>
                                  {r.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {perms.map((perm, idx) => (
                              <tr
                                key={perm.id}
                                className={`border-b border-emerald-900/20 transition-colors hover:bg-emerald-950/25 ${idx % 2 === 0 ? "bg-[#010804]" : "bg-[#010c07]"}`}
                              >
                                <td className="py-3 px-5">
                                  <span className="font-bold text-white text-xs block leading-snug">{perm.name}</span>
                                  <span className="text-[10px] text-white/40 leading-relaxed">{perm.description}</span>
                                </td>
                                {roles.map((r) => {
                                  const isChecked = (rolePermissions[r.key] || []).includes(perm.id);
                                  return (
                                    <td key={r.key} className="py-3 px-3 text-center">
                                      <button
                                        onClick={() => togglePermission(r.key, perm.id)}
                                        title={`${isChecked ? "Cabut" : "Beri"} izin "${perm.name}" untuk ${r.key}`}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all font-bold text-[11px] border ${
                                          isChecked
                                            ? `${r.bg} ${r.color} ${r.border} hover:opacity-80 shadow-sm`
                                            : "bg-transparent border-emerald-900/50 text-white/15 hover:border-white/30 hover:text-white/30"
                                        }`}
                                      >
                                        {isChecked ? <Check className="w-4 h-4 stroke-[2.5]" /> : <span className="text-[14px] leading-none">○</span>}
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
}
