"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";

export default function AddJournalModal() {
  const {
    showAddJournalModal,
    setShowAddJournalModal,
    currentActiveEmployee,
    journalForm,
    setJournalForm,
    handleSaveJournal,
  } = useApp();

  if (!showAddJournalModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#02140c] border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-black">
              📝
            </div>
            <div>
              <h3 className="font-black text-white text-base">Tambah Jurnal Kerja Harian</h3>
              <p className="text-[11px] text-white/60">
                Laporkan seluruh tugas pekerjaan yang Anda kerjakan hari ini
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddJournalModal(false)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info Pelapor */}
        <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-950 flex items-center justify-center font-black text-white text-xs ring-1 ring-emerald-500/40">
              {currentActiveEmployee.avatar}
            </div>
            <div>
              <span className="font-extrabold text-white text-xs block">{currentActiveEmployee.name}</span>
              <span className="text-[10px] text-white/60">
                {currentActiveEmployee.role} • Dept: {currentActiveEmployee.dept}
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            {currentActiveEmployee.contractType}
          </span>
        </div>

        <form onSubmit={handleSaveJournal} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 block mb-1 font-semibold">Tanggal Laporan:</label>
              <input
                type="text"
                value={journalForm.date}
                onChange={(e) => setJournalForm((prev) => ({ ...prev, date: e.target.value }))}
                placeholder="Contoh: 17 Nov 2026"
                className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
            <div>
              <label className="text-white/70 block mb-1 font-semibold">Durasi Jam Kerja:</label>
              <input
                type="text"
                value={journalForm.hours}
                onChange={(e) => setJournalForm((prev) => ({ ...prev, hours: e.target.value }))}
                placeholder="Contoh: 8j 00m"
                className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 block mb-1 font-semibold">
              Daftar Tugas yang Dikerjakan (Wajib Dilaporkan):
            </label>
            <p className="text-[10px] text-white/50 mb-1.5">
              Tuliskan setiap tugas pekerjaan per baris (tekan Enter untuk memisahkan aktivitas):
            </p>
            <textarea
              rows={4}
              value={journalForm.tasksText}
              onChange={(e) => setJournalForm((prev) => ({ ...prev, tasksText: e.target.value }))}
              placeholder={`- Menyelesaikan rekonsiliasi berkas harian\n- Koordinasi tindak lanjut dengan rekan tim\n- Input rekap data aktivitas kerja ke sistem`}
              className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 leading-relaxed font-sans"
              required
            />
          </div>

          <div>
            <label className="text-white/70 block mb-1 font-semibold">
              Catatan Tambahan / Hasil & Kendala (Opsional):
            </label>
            <textarea
              rows={2}
              value={journalForm.notes}
              onChange={(e) => setJournalForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Contoh: Target selesai tepat waktu, berkas telah diarsipkan di drive bersama."
              className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 text-xs"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-emerald-900/60">
            <button
              type="button"
              onClick={() => setShowAddJournalModal(false)}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              ✓ Simpan & Laporkan Jurnal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
