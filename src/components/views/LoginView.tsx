"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { ServerClock } from "@/hooks/useClock";

export default function LoginView() {
  const {
    companyName,
    companyLogoUrl,
    companyProfile,
    handleLogin,
    handleQuickDemoLogin,
  } = useApp();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const quickDemoAccounts = [
    {
      perspective: "admin",
      label: "👑 Super Admin / CEO",
      sub: "Ir. Hendra Gunawan (Semua Akses)",
      email: "hendra@perusahaan.id",
    },
    {
      perspective: "emp-gm",
      label: "🏢 General Manager",
      sub: "Dr. Kartika Sari (6 Departemen)",
      email: "kartika.gm@perusahaan.id",
    },
    {
      perspective: "emp-hr-spv",
      label: "👩‍💼 HR Supervisor",
      sub: "Siti Rahmawati (Manajemen SDM)",
      email: "siti.hr@perusahaan.id",
    },
    {
      perspective: "emp-it-spv",
      label: "💻 IT Supervisor",
      sub: "Budi Pratama (Geofence & Server)",
      email: "budi.it@perusahaan.id",
    },
    {
      perspective: "emp-mkt-spv",
      label: "📈 Marketing SPV",
      sub: "Dewi Lestari (Tim Marketing)",
      email: "dewi.mkt@perusahaan.id",
    },
    {
      perspective: "emp-it-stf",
      label: "👤 IT Staff",
      sub: "Dimas Wicaksono (Karyawan)",
      email: "dimas.it@perusahaan.id",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#051f14] via-[#020d08] to-[#010604] text-white flex flex-col justify-center items-center p-4 md:p-8 relative overflow-y-auto selection:bg-emerald-500 selection:text-black">
      {/* Efek Glow Latar Belakang */}
      <div className="absolute top-10 left-1/4 w-[450px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[280px] bg-teal-500/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#021008]/95 border border-emerald-800/60 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/90 space-y-6 relative z-10 backdrop-blur-md">
        {/* Top Badge & Server Time */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            PostgreSQL 17 Connected
          </span>
          <div className="px-2.5 py-1 rounded-lg bg-[#010804] border border-emerald-900/60 text-emerald-300 font-mono font-bold">
            <ServerClock />
          </div>
        </div>

        {/* Brand & Company Header */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-emerald-600 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-black overflow-hidden ring-2 ring-emerald-300/40 flex-shrink-0">
            {companyLogoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={companyLogoUrl} alt={companyName} className="w-full h-full object-cover" />
            ) : (
              <span>{companyName.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-white tracking-tight truncate">
              {companyName}
            </h1>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              Sistem Absensi Geolokasi & Biometrik AI
            </p>
            <p className="text-[11px] text-white/60 truncate mt-0.5">
              {companyProfile.address}
            </p>
          </div>
        </div>

        {/* Form Login Utama */}
        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-white/90 font-bold mb-1.5">
              Email Karyawan / Nomor KTP (NIK)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: hendra@perusahaan.id"
                className="w-full bg-[#010804] border border-emerald-800/80 rounded-xl pl-10 pr-3.5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-white/90 font-bold">Kata Sandi (Password)</label>
              <span className="text-[10px] text-amber-300/90 font-mono">
                Default Demo: 123456
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun atau password sementara HRD..."
                className="w-full bg-[#010804] border border-emerald-800/80 rounded-xl pl-10 pr-10 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1"
                title={showPassword ? "Sembunyikan Password" : "Lihat Password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Sistem Absensi</span>
          </button>
        </form>

        {/* Panel Akses Cepat 1-Klik (Untuk Kemudahan Pengujian & Demo) */}
        <div className="pt-4 border-t border-emerald-900/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Akses Cepat Akun Pengujian (1-Klik)
            </span>
            <span className="text-[10px] text-white/40">Tanpa ketik manual</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickDemoAccounts.map((acc) => (
              <button
                key={acc.perspective}
                type="button"
                onClick={() => handleQuickDemoLogin(acc.perspective)}
                className="text-left p-2.5 rounded-xl bg-[#041910]/90 hover:bg-emerald-950 border border-emerald-900/70 hover:border-emerald-400/60 transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-extrabold text-white group-hover:text-emerald-300 truncate">
                  {acc.label}
                </div>
                <div className="text-[10px] text-white/60 truncate">{acc.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
