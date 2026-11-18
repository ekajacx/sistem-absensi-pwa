"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { LogOut } from "lucide-react";

export default function LogoutModal() {
  const { showLogoutConfirm, setShowLogoutConfirm, handleLogout } = useApp();

  if (!showLogoutConfirm) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#021008] border border-amber-500/60 ring-2 ring-amber-500/20 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-400 flex items-center justify-center flex-shrink-0">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              KONFIRMASI TINDAKAN
            </span>
            <h3 className="font-black text-white text-base">Keluar dari Sesi Kerja?</h3>
          </div>
        </div>

        <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 text-xs text-white/80 space-y-1.5 leading-relaxed">
          <p>
            Anda akan keluar dari sesi sistem saat ini. Pastikan seluruh absensi mandiri, pengajuan cuti, atau jurnal kerja harian telah tersimpan sebelum keluar.
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20 text-center"
          >
            🚪 Ya, Keluar Sistem
          </button>
        </div>
      </div>
    </div>
  );
}
