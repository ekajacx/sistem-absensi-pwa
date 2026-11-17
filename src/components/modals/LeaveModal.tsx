"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { X, Lock } from "lucide-react";

export default function LeaveModal() {
  const {
    showApplyLeaveModal,
    setShowApplyLeaveModal,
    handleApplyLeaveSubmit,
    currentActiveEmployee,
    myRemainingQuota,
    directSuperior,
    newLeaveForm,
    setNewLeaveForm,
  } = useApp();

  if (!showApplyLeaveModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-7 max-w-lg w-full shadow-2xl space-y-5 my-8">
        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg">
              🏖️
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
                SELF-SERVICE EMPLOYEE LEAVE
              </span>
              <h3 className="font-black text-white text-base">
                Formulir Pengajuan Cuti Mandiri
              </h3>
            </div>
          </div>
          <button
            onClick={() => setShowApplyLeaveModal(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApplyLeaveSubmit} className="space-y-4 text-xs">
          {/* Box Karyawan Pemohon */}
          <div className="p-3.5 rounded-2xl bg-[#010804] border border-emerald-900/60 space-y-1">
            <span className="text-[10px] text-white/50 font-bold uppercase block">Karyawan Pemohon</span>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-white text-sm block">{currentActiveEmployee.name}</span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {currentActiveEmployee.nik} • {currentActiveEmployee.role} ({currentActiveEmployee.dept})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/50 block">Sisa Kuota:</span>
                <span className="font-extrabold text-teal-400 font-mono text-sm">{myRemainingQuota} Hari</span>
              </div>
            </div>
          </div>

          {/* ATASAN LANGSUNG (N+1) - READ-ONLY TEXTBOX TERKUNCI OTOMATIS */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <label className="text-white font-bold flex items-center gap-1.5 text-xs">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Atasan Langsung Penyetuju (N+1)</span>
              </label>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⚡ Terhubung Otomatis
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                readOnly
                value={
                  directSuperior
                    ? `${directSuperior.name} — ${directSuperior.role} (${directSuperior.dept})`
                    : "Ir. Hendra Gunawan — Direktur Utama (CEO)"
                }
                className="w-full bg-[#010804] border border-emerald-700/60 rounded-xl p-3 text-white font-semibold cursor-not-allowed select-none text-xs pl-3 pr-8 shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                🔒
              </div>
            </div>
            <p className="text-[10px] text-emerald-400/90 leading-tight">
              ✓ Sesuai hirarki sistem, permohonan ini otomatis dikirimkan ke atasan langsung Anda dan tidak dapat dialihkan manual.
            </p>
          </div>

          {/* Pilihan Jenis Cuti */}
          <div className="space-y-1.5">
            <label className="text-white font-bold block text-xs">
              Jenis Cuti <span className="text-red-400">*</span>
            </label>
            <select
              value={newLeaveForm.type}
              onChange={(e) =>
                setNewLeaveForm((prev) => ({
                  ...prev,
                  type: e.target.value as "Tahunan" | "Sakit" | "Melahirkan" | "Khusus",
                }))
              }
              className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white font-medium focus:border-emerald-400 focus:outline-none"
            >
              <option value="Tahunan">🏖️ Cuti Tahunan (Potong Kuota Tahunan)</option>
              <option value="Sakit">🏥 Cuti Sakit (Rekomendasi Dokter)</option>
              <option value="Melahirkan">👶 Cuti Melahirkan (Maternity Leave)</option>
              <option value="Khusus">⭐ Cuti Khusus (Pernikahan, Duka, Keperluan Mendesak)</option>
            </select>
          </div>

          {/* Rentang Tanggal Mulai & Selesai */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white font-bold block text-xs">
                Tanggal Mulai <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                value={newLeaveForm.start}
                onChange={(e) =>
                  setNewLeaveForm((prev) => ({ ...prev, start: e.target.value }))
                }
                className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white font-bold block text-xs">
                Tanggal Selesai <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                value={newLeaveForm.end}
                onChange={(e) =>
                  setNewLeaveForm((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Live Duration Calculation Helper */}
          {(() => {
            const s = new Date(newLeaveForm.start);
            const e = new Date(newLeaveForm.end);
            const diffDays = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
            return (
              <div className="bg-[#010804] p-2.5 rounded-xl border border-emerald-900/60 flex items-center justify-between text-xs">
                <span className="text-white/60">Estimasi Durasi Pengajuan:</span>
                <span className="font-extrabold text-white font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {diffDays} Hari Kalender
                </span>
              </div>
            );
          })()}

          {/* Alasan Pengajuan Cuti */}
          <div className="space-y-1.5">
            <label className="text-white font-bold block text-xs">
              Alasan Pengajuan Cuti <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={newLeaveForm.reason}
              onChange={(e) =>
                setNewLeaveForm((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Contoh: Mengurus keperluan keluarga mendesak di luar kota / Istirahat pemulihan kesehatan..."
              className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none text-xs"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setShowApplyLeaveModal(false)}
              className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Kirim Pengajuan Cuti
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
