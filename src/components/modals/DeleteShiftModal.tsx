"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { AlertTriangle } from "lucide-react";

export default function DeleteShiftModal() {
  const { deleteShiftConfirm, setDeleteShiftConfirm, handleDeleteShift } = useApp();

  if (!deleteShiftConfirm) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#021008] border border-red-500/60 ring-2 ring-red-500/20 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center ring-1 ring-red-400 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-red-400 font-black uppercase tracking-wider block">
              PERINGATAN BAHAYA SISTEM
            </span>
            <h3 className="font-black text-white text-base">Hapus Shift Kerja?</h3>
          </div>
        </div>

        <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/60">Nama Shift:</span>
            <span className="font-bold text-white">{deleteShiftConfirm.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Jam Kerja:</span>
            <span className="font-mono text-emerald-300">
              {deleteShiftConfirm.startTime} - {deleteShiftConfirm.endTime} WIB
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300 leading-relaxed">
          <strong className="block text-red-400 font-bold mb-0.5">⚠️ Konfirmasi Penghapusan:</strong>
          Shift ini akan dihapus dari konfigurasi sistem. Pastikan seluruh karyawan yang menggunakan shift ini telah dipindahkan jadwalnya ke shift lain.
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setDeleteShiftConfirm(null)}
            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDeleteShift}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs transition-all shadow-lg shadow-red-500/20"
          >
            🗑️ Ya, Hapus Shift
          </button>
        </div>
      </div>
    </div>
  );
}
