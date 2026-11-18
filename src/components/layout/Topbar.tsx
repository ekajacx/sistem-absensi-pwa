"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Shield, Clock, Menu } from "lucide-react";
import { ServerClock } from "@/hooks/useClock";

export default function Topbar() {
  const {
    currentActiveEmployee,
    currentMeta,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    setShowPasswordModal,
    setShowLogoutConfirm,
  } = useApp();

  return (
    <header className="px-4 md:px-8 pt-4 md:pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-[#021008]/90 backdrop-blur-md border-b border-emerald-950/40">
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-xl bg-[#041910] text-emerald-300 border border-emerald-900/60 md:hidden hover:bg-[#072518] hover:text-white transition-all shadow-md focus:outline-none"
          aria-label="Toggle Menu Navigasi"
          title="Buka Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-3xl leading-none select-none">{currentMeta.icon}</span>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight transition-all duration-300">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-white/70 mt-0.5 transition-all duration-300">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Header Action Buttons & Active Session Identity */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        {/* Real-time Digital Server Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#020e08] border border-emerald-500/40 shadow-lg text-emerald-300 font-mono font-bold select-none">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <ServerClock />
        </div>

        {/* ACTIVE ACCOUNT SESSION BADGE */}
        <div className="flex items-center gap-2 bg-[#020e08] border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-lg">
          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3" /> Akun Aktif:
          </span>
          <span className="text-white font-bold text-xs">
            {currentActiveEmployee.name}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
            {currentActiveEmployee.role}
          </span>
        </div>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-3.5 py-1.5 rounded-lg bg-[#041910] text-white border border-emerald-900/60 hover:bg-[#072518] transition-all font-semibold cursor-pointer"
        >
          Ganti Password
        </button>
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#041910] text-amber-300 border border-emerald-900/60 hover:bg-[#072518] transition-all font-semibold cursor-pointer"
        >
          <span>🚪</span>
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
