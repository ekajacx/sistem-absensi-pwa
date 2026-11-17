"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";

export default function ChangePasswordModal() {
  const { showPasswordModal, setShowPasswordModal, showToast } = useApp();

  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-white text-base">Ganti Kata Sandi Akun</h3>
          <button onClick={() => setShowPasswordModal(false)} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowPasswordModal(false);
            showToast("Kata sandi akun Anda berhasil diperbarui!");
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block text-white/80 font-bold mb-1">Password Baru</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
            />
          </div>
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-black hover:bg-emerald-400"
            >
              Perbarui Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
