"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, UserPlus } from "lucide-react";

export default function KontrakView() {
  const {
    employees,
    hasPermission,
    openAddEmployeeModal,
  } = useApp();

  return (
    <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Status Kerja & Lifecycle Karyawan</h3>
                  <p className="text-xs text-white/70">
                    Karyawan Tetap (hanya tanggal masuk) vs Kontrak, Magang, DW (dilengkapi tanggal berakhir)
                  </p>
                </div>
                {hasPermission("emp_manage_hr") && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddEmployeeModal("staff")}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> + Tambah Staff
                    </button>
                    <button
                      onClick={() => openAddEmployeeModal("atasan")}
                      className="px-3.5 py-2 rounded-xl bg-[#031d11] border border-amber-400/50 text-amber-300 font-bold text-xs hover:bg-emerald-950 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> + Tambah Atasan
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3">Karyawan</th>
                      <th className="pb-3">Departemen</th>
                      <th className="pb-3">Posisi</th>
                      <th className="pb-3">Status Kerja</th>
                      <th className="pb-3">Tanggal Pertama Kerja</th>
                      <th className="pb-3">Tanggal Terakhir Kerja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {employees.map((k) => (
                      <tr key={k.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3 font-bold text-white">{k.name}</td>
                        <td className="py-3 font-bold text-white/90">{k.dept}</td>
                        <td className="py-3 text-white/70 text-[11px]">{k.role}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              k.contractType === "Tetap"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : k.contractType === "Kontrak"
                                ? "bg-blue-500/20 text-blue-300"
                                : k.contractType === "Magang"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {k.contractType}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-white text-[11px]">{k.startDate}</td>
                        <td className="py-3 font-mono text-[11px]">
                          {k.contractType === "Tetap" ? (
                            <span className="text-white/40 italic">Hanya tanggal masuk</span>
                          ) : (
                            <span className="text-amber-400 font-bold">{k.endDate || "--"}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
  );
}
