"use client";

import React from "react";
import { useApp } from "@/context/AppContext";


export default function JabatanView() {
  const {
    employees,
    getDirectSuperior,
  } = useApp();

  return (
    <div className="space-y-5">
              <div>
                <h3 className="font-bold text-white text-base">Daftar Jabatan: Supervisor & Staff per Departemen</h3>
                <p className="text-xs text-white/70">
                  Struktur sederhana dan efisien: 1 Supervisor per departemen membawahi para Staff.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3">Departemen</th>
                      <th className="pb-3">Jabatan</th>
                      <th className="pb-3">Tingkatan</th>
                      <th className="pb-3">Karyawan Ditugaskan</th>
                      <th className="pb-3">Melapor Kepada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {employees.map((emp) => {
                      const superior = getDirectSuperior(emp);
                      return (
                        <tr key={emp.id} className="hover:bg-emerald-950/20 transition-colors">
                          <td className="py-3 font-black text-white">{emp.dept}</td>
                          <td className="py-3 font-bold text-white">{emp.role}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                emp.level === "Director"
                                  ? "bg-purple-500/20 text-purple-300"
                                  : emp.level === "Supervisor"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-emerald-500/20 text-emerald-300"
                              }`}
                            >
                              {emp.level}
                            </span>
                          </td>
                          <td className="py-3 text-white text-[11px] font-semibold">{emp.name}</td>
                          <td className="py-3 text-amber-300 font-semibold text-[11px]">
                            {superior ? superior.name : "Direksi (Puncak)"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
  );
}
