"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { KeyRound } from "lucide-react";

export default function ForcedPasswordModal() {
  const {
    isForcedPasswordRequired,
    currentActiveEmployee,
    handleForcedPasswordSubmit,
    forcedPasswordForm,
    setForcedPasswordForm,
  } = useApp();

  if (!isForcedPasswordRequired) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#021109] border-2 border-amber-400/80 rounded-3xl p-7 max-w-md w-full shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center ring-1 ring-amber-400/40 flex-shrink-0">
            <KeyRound className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">
              KEAMANAN AKUN • LOGIN PERTAMA KALI
            </span>
            <h3 className="font-black text-white text-base leading-tight">Wajib Buat Password Baru</h3>
          </div>
        </div>

        <div className="bg-[#010804] p-3.5 rounded-xl border border-amber-900/60 text-xs text-white/80 space-y-1.5">
          <p>
            Halo <strong className="text-white">{currentActiveEmployee.name}</strong> ({currentActiveEmployee.role}), Anda saat ini masuk menggunakan{" "}
            <strong className="text-amber-300">password sementara acak dari HRD</strong>.
          </p>
          <p className="text-[11px] text-white/70">
            Demi privasi & keamanan akun, Anda diwajibkan mengganti password baru sekarang sebelum dapat mengakses menu sistem.
          </p>
        </div>

        <form onSubmit={handleForcedPasswordSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-white font-bold mb-1">Password Baru Anda</label>
            <input
              type="password"
              required
              placeholder="Minimal 6 karakter..."
              value={forcedPasswordForm.newPass}
              onChange={(e) => setForcedPasswordForm({ ...forcedPasswordForm, newPass: e.target.value })}
              className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-white font-bold mb-1">Konfirmasi Password Baru</label>
            <input
              type="password"
              required
              placeholder="Ulangi password baru..."
              value={forcedPasswordForm.confirmPass}
              onChange={(e) => setForcedPasswordForm({ ...forcedPasswordForm, confirmPass: e.target.value })}
              className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black uppercase tracking-wider text-xs hover:brightness-110 shadow-lg shadow-black transition-all"
          >
            Simpan Password & Masuk Sistem →
          </button>
        </form>
      </div>
    </div>
  );
}
