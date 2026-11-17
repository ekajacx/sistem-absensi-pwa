"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Pencil, X, AlertTriangle } from "lucide-react";

export default function EditAttendanceModal() {
  const {
    showEditAttendanceModal,
    setShowEditAttendanceModal,
    editingAttendance,
    editAttendanceForm,
    setEditAttendanceForm,
    handleSaveEditAttendance,
    currentActiveEmployee,
  } = useApp();

  if (!showEditAttendanceModal || !editingAttendance) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#021008] border border-amber-500/50 ring-2 ring-amber-500/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center ring-1 ring-amber-400">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Koreksi Absensi (Lupa Absen)</h3>
              <p className="text-[11px] text-white/60">
                Perubahan data akan tercatat di Audit Log permanen bertanda merah.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEditAttendanceModal(false)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Karyawan Terpilih */}
        <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60 flex items-center justify-between">
          <div>
            <span className="font-extrabold text-white text-sm block">{editingAttendance.name}</span>
            <span className="text-[10px] text-white/60 font-mono">No. KTP: {editingAttendance.nik}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              Dept: {editingAttendance.dept} • {editingAttendance.shift} ({editingAttendance.date})
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Log: {editingAttendance.id}
          </span>
        </div>

        <form onSubmit={handleSaveEditAttendance} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-white font-bold mb-1">
                Jam Check-In <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={editAttendanceForm.in}
                onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, in: e.target.value })}
                placeholder="07:45 WIB"
                className="w-full bg-[#010804] border border-emerald-500/40 rounded-xl p-2.5 text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">
                Jam Check-Out <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={editAttendanceForm.out}
                onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, out: e.target.value })}
                placeholder="15:00 WIB"
                className="w-full bg-[#010804] border border-emerald-500/40 rounded-xl p-2.5 text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-white font-bold mb-1">Status Kehadiran *</label>
            <select
              value={editAttendanceForm.status}
              onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, status: e.target.value as "APPROVED" | "TERLAMBAT" | "DITOLAK" })}
              className="w-full bg-[#010804] border border-emerald-500/40 rounded-xl p-2.5 text-white font-bold focus:border-emerald-400 focus:outline-none"
            >
              <option value="APPROVED">✓ APPROVED (Tepat Waktu / Sah)</option>
              <option value="TERLAMBAT">⚠️ TERLAMBAT</option>
              <option value="DITOLAK">❌ DITOLAK</option>
            </select>
          </div>

          {/* Keterangan / Alasan Edit (WAJIB) */}
          <div className="text-xs">
            <div className="flex justify-between items-center mb-1">
              <label className="text-amber-300 font-bold">
                Keterangan / Alasan Melakukan Edit <span className="text-red-400">*</span>
              </label>
              <span className="text-[10px] text-white/50 font-medium">Wajib diisi untuk audit trail</span>
            </div>
            <textarea
              required
              rows={3}
              value={editAttendanceForm.reason}
              onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, reason: e.target.value })}
              placeholder="Contoh: Karyawan lupa melakukan check-in mandiri karena langsung menghadiri rapat koordinasi pagi bersama klien..."
              className="w-full bg-[#010804] border border-amber-500/40 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Notice Akuntabilitas */}
          <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Pencatatan Audit Trail Otomatis (Warna Merah)</span>
            </div>
            <p className="text-[11px] text-red-200/80 leading-relaxed">
              Perubahan ini akan dicatat ke dalam Audit Log dengan <strong>WARNA MERAH</strong> mencantumkan identitas Anda (<strong>{currentActiveEmployee.name} - {currentActiveEmployee.role}</strong>) beserta alasan yang dimasukkan.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowEditAttendanceModal(false)}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              ✓ Simpan Koreksi Absen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
