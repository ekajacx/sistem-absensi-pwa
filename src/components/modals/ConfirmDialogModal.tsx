"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialogModal() {
  const { confirmDialog, setConfirmDialog, handleConfirmAction } = useApp();

  if (!confirmDialog.isOpen || !confirmDialog.employee) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`bg-[#021008] border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 ${
          confirmDialog.type === "delete"
            ? "border-red-500/60 ring-2 ring-red-500/20"
            : "border-amber-500/60 ring-2 ring-amber-500/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              confirmDialog.type === "delete"
                ? "bg-red-500/20 text-red-400 ring-1 ring-red-400"
                : "bg-amber-500/20 text-amber-400 ring-1 ring-amber-400"
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span
              className={`text-[10px] font-black uppercase tracking-wider block ${
                confirmDialog.type === "delete" ? "text-red-400" : "text-amber-400"
              }`}
            >
              {confirmDialog.type === "delete"
                ? "PERINGATAN BAHAYA SISTEM"
                : "KONFIRMASI TINDAKAN STATUS"}
            </span>
            <h3 className="font-black text-white text-base">
              {confirmDialog.type === "delete"
                ? "Hapus Data Karyawan?"
                : "Nonaktifkan Karyawan (Resign)?"}
            </h3>
          </div>
        </div>

        <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/60">Nama:</span>
            <span className="font-bold text-white">{confirmDialog.employee.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">No. KTP:</span>
            <span className="font-mono text-white">{confirmDialog.employee.nik}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Departemen & Posisi:</span>
            <span className="font-semibold text-emerald-300">
              {confirmDialog.employee.dept} — {confirmDialog.employee.role}
            </span>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border text-xs leading-relaxed ${
            confirmDialog.type === "delete"
              ? "bg-red-500/10 border-red-500/30 text-red-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-200"
          }`}
        >
          {confirmDialog.type === "delete" ? (
            <>
              <strong className="block text-red-400 font-bold mb-0.5">
                🚨 Tindakan Permanen!
              </strong>
              Seluruh data profil, akun login, dan riwayat karyawan ini akan dihapus dari sistem
              secara permanen. Data yang telah dihapus <strong>tidak dapat dipulihkan</strong>.
            </>
          ) : (
            <>
              <strong className="block text-amber-300 font-bold mb-0.5">
                ⚠️ Status Diubah Menjadi Non-Aktif
              </strong>
              Karyawan ini akan tercatat telah mengundurkan diri (Resign) dan tidak dapat lagi
              melakukan absensi mandiri, mengajukan cuti, ataupun mengakses aplikasi.
            </>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              setConfirmDialog({ isOpen: false, type: "deactivate", employee: null })
            }
            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirmAction}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all text-center ${
              confirmDialog.type === "delete"
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
            }`}
          >
            {confirmDialog.type === "delete" ? "🗑️ Hapus Permanen" : "🚫 Ya, Nonaktifkan"}
          </button>
        </div>
      </div>
    </div>
  );
}
