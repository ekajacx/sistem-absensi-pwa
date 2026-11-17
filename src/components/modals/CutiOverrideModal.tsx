"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import type { DayOfWeek, ShiftSlotType } from "@/types";
import { AlertTriangle } from "lucide-react";

export default function CutiOverrideModal() {
  const {
    cutiOverrideConfirm,
    setCutiOverrideConfirm,
    employees,
    selectedScheduleEmpId,
    rosterDayDates,
    setDraftSchedule,
    showToast,
  } = useApp();

  if (!cutiOverrideConfirm) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#021008] border border-amber-500/60 ring-2 ring-amber-500/20 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center ring-1 ring-amber-400 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">
              PERINGATAN: OVERRIDE CUTI
            </span>
            <h3 className="font-black text-white text-base">Ubah Jadwal di Hari Cuti?</h3>
          </div>
        </div>

        <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/60">Karyawan:</span>
            <span className="font-bold text-white">
              {employees.find((e) => e.id === selectedScheduleEmpId)?.name || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Hari:</span>
            <span className="font-bold text-white">
              {cutiOverrideConfirm.day} ({rosterDayDates[cutiOverrideConfirm.day]})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Cuti Disetujui:</span>
            <span className="font-bold text-purple-300">
              {cutiOverrideConfirm.leave.type} ({cutiOverrideConfirm.leave.start} s/d {cutiOverrideConfirm.leave.end})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Shift yang akan diterapkan:</span>
            <span className={`font-bold ${
              cutiOverrideConfirm.shift === "Pagi" ? "text-emerald-300" :
              cutiOverrideConfirm.shift === "Siang" ? "text-amber-300" : "text-red-300"
            }`}>
              {cutiOverrideConfirm.shift}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 leading-relaxed">
          <strong className="block text-amber-400 font-bold mb-0.5">⚠️ Perhatian:</strong>
          Anda akan mengubah jadwal shift di hari yang sudah disetujui sebagai cuti. Karyawan akan diminta untuk tetap masuk kerja pada hari tersebut. Pastikan Anda telah berkomunikasi dengan yang bersangkutan.
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setCutiOverrideConfirm(null)}
            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              setDraftSchedule((prev: Record<DayOfWeek, ShiftSlotType>) => ({
                ...prev,
                [cutiOverrideConfirm.day]: cutiOverrideConfirm.shift as ShiftSlotType,
              }));
              showToast(`⚠️ Jadwal hari ${cutiOverrideConfirm.day} diubah ke ${cutiOverrideConfirm.shift} (override cuti)`, "info");
              setCutiOverrideConfirm(null);
            }}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            ✓ Ya, Override Cuti
          </button>
        </div>
      </div>
    </div>
  );
}
