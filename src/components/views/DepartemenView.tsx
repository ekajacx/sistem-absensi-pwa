"use client";

import React from "react";
import { useApp } from "@/context/AppContext";


export default function DepartemenView() {
  const {
    activePerspective,
    currentActiveEmployee,
    currentRoleName,
    employees,
    setActiveMenu,
    setFilterDept,
    standardDepartments,
  } = useApp();

  const canFilterAllDepts =
    activePerspective === "admin" ||
    currentRoleName === "Super Admin" ||
    currentRoleName === "General Manager" ||
    currentRoleName === "HR Supervisor";

  return (
    <div className="space-y-5">
              <div>
                <h3 className="font-bold text-white text-base">7 Departemen Perusahaan</h3>
                <p className="text-xs text-white/70">
                  Direksi sebagai pimpinan eksekutif dan 6 departemen fungsional & operasional perusahaan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {standardDepartments.map((d) => {
                  const staffCount = employees.filter((e) => e.dept === d.id).length;
                  const spv = employees.find((e) => e.dept === d.id && e.level === "Supervisor");
                  const ceo = employees.find((e) => e.level === "Director");
                  const gm = employees.find((e) => e.level === "GeneralManager");
                  const isDireksi = d.id === "Direksi";

                  return (
                    <div key={d.id} className="bg-gradient-to-br from-[#072619] to-[#010e07] rounded-2xl p-5 border border-emerald-900/60 shadow-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{d.icon}</span>
                          <div>
                            <h4 className="font-black text-white text-base">{d.name}</h4>
                            <span className="text-[10px] text-white/60 block">{d.desc}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-white/60">Atasan:</span>
                          <span className="font-bold text-sky-300">
                            {isDireksi
                              ? (ceo ? ceo.name : "Ir. Hendra Gunawan")
                              : (gm ? gm.name : "Dr. Kartika Sari, S.E., M.M.")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">{isDireksi ? "General Manager (GM):" : "Supervisor:"}</span>
                          <span className="font-bold text-amber-300">
                            {isDireksi
                              ? (gm ? gm.name : "Dr. Kartika Sari, S.E., M.M.")
                              : (spv ? spv.name : "Belum ada")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Total Karyawan:</span>
                          <span className="font-mono font-bold text-white">{staffCount} Orang</span>
                        </div>
                      </div>

                      {canFilterAllDepts || d.id === currentActiveEmployee.dept ? (
                        <button
                          onClick={() => {
                            setFilterDept(canFilterAllDepts ? d.id : "ALL");
                            setActiveMenu("karyawan");
                          }}
                          className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all text-center cursor-pointer"
                        >
                          Lihat Karyawan {d.name} ({staffCount}) →
                        </button>
                      ) : (
                        <div className="w-full py-2 rounded-xl bg-[#010804] border border-emerald-950 text-white/40 text-[11px] font-semibold text-center select-none">
                          🔒 Otoritas Departemen {d.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
  );
}
