"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, Copy } from "lucide-react";

export default function CredentialsModal() {
  const {
    showCredentialsModal,
    newlyCreatedCredentials,
    setShowCredentialsModal,
    showToast,
    copyCredentialsToClipboard,
  } = useApp();

  if (!showCredentialsModal || !newlyCreatedCredentials) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#021109] border-2 border-emerald-400 rounded-3xl p-7 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
              AKUN BERHASIL DIBUAT OLEH HR
            </span>
            <h3 className="font-black text-white text-base">Kredensial Login Karyawan Baru</h3>
          </div>
        </div>

        <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-white/60">Nama:</span>
            <span className="font-bold text-white">{newlyCreatedCredentials.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">No. KTP (16 Digit):</span>
            <span className="font-mono font-bold text-white">{newlyCreatedCredentials.nik}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Departemen & Posisi:</span>
            <span className="font-bold text-emerald-300">
              {newlyCreatedCredentials.dept} — {newlyCreatedCredentials.role}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Atasan Langsung:</span>
            <span className="font-bold text-amber-300">{newlyCreatedCredentials.superiorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Email Login:</span>
            <span className="font-mono font-bold text-white">{newlyCreatedCredentials.email}</span>
          </div>

          {/* Password Acak Highlight */}
          <div className="bg-amber-500/10 border-2 border-dashed border-amber-400/60 rounded-xl p-3 text-center my-2">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block mb-1">
              PASSWORD SEMENTARA ACAK (SEKALI MUNCUL)
            </span>
            <div className="font-mono text-2xl font-black text-amber-400 tracking-widest selection:bg-white selection:text-black">
              {newlyCreatedCredentials.tempPass}
            </div>
            <span className="text-[10px] text-white/60 mt-1 block">
              Karyawan akan dipaksa mengganti password saat pertama kali masuk.
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={copyCredentialsToClipboard}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Copy className="w-4 h-4" />
            <span>Salin Info Login</span>
          </button>
          <button
            onClick={() => {
              setShowCredentialsModal(false);
              showToast("Kredensial disimpan.");
            }}
            className="flex-1 py-3 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-all text-center"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
