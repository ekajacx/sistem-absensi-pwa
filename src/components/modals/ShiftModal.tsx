"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";

export default function ShiftModal() {
  const {
    showShiftModal,
    setShowShiftModal,
    editingShiftId,
    handleSaveShift,
    shiftForm,
    setShiftForm,
  } = useApp();

  if (!showShiftModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-7 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
          <div>
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
              KONFIGURASI MASTER SHIFT KERJA
            </span>
            <h3 className="font-black text-white text-base">
              {editingShiftId ? "Edit Konfigurasi Shift" : "Tambah Shift Baru"}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowShiftModal(false)}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveShift} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-white/80 font-bold mb-1">
              Nama Shift Kerja <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Shift Pagi (Utama / Office)"
              value={shiftForm.name}
              onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
              className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/80 font-bold mb-1">
                Jam Mulai Masuk <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                required
                value={shiftForm.startTime}
                onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/80 font-bold mb-1">
                Jam Selesai Pulang <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                required
                value={shiftForm.endTime}
                onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/80 font-bold mb-1">Toleransi Keterlambatan</label>
              <select
                value={shiftForm.tolerance}
                onChange={(e) => setShiftForm({ ...shiftForm, tolerance: e.target.value })}
                className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
              >
                <option value="5 Menit">5 Menit</option>
                <option value="10 Menit">10 Menit</option>
                <option value="15 Menit">15 Menit</option>
                <option value="30 Menit">30 Menit</option>
                <option value="Tanpa Toleransi">Tanpa Toleransi</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 font-bold mb-1">Buka Absen Masuk</label>
              <select
                value={shiftForm.openBefore}
                onChange={(e) => setShiftForm({ ...shiftForm, openBefore: e.target.value })}
                className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
              >
                <option value="15 Menit">15 Menit Sebelum</option>
                <option value="30 Menit">30 Menit Sebelum</option>
                <option value="45 Menit">45 Menit Sebelum</option>
                <option value="60 Menit">60 Menit Sebelum</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/80 font-bold mb-1">Status Shift</label>
            <select
              value={shiftForm.status}
              onChange={(e) => setShiftForm({ ...shiftForm, status: e.target.value as "Aktif" | "Non-Aktif" })}
              className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="Aktif">🟢 Aktif Berjalan</option>
              <option value="Non-Aktif">🔴 Non-Aktif (Ditangguhkan)</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setShowShiftModal(false)}
              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black font-black transition-all shadow-lg shadow-emerald-500/20"
            >
              {editingShiftId ? "Simpan Perubahan" : "Tambahkan Shift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
