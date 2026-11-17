"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Shield, Clock } from "lucide-react";
import { ServerClock } from "@/hooks/useClock";

export default function Topbar() {
  const {
    activePerspective,
    currentMeta,
    employees,
    setActivePerspective,
    setShowPasswordModal,
    showToast,
  } = useApp();

  return (
    <header className="px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-[#021008]/90 backdrop-blur-md border-b border-emerald-950/40">
      <div className="flex items-center gap-3.5">
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

      {/* Right Header Action Buttons & Perspective Switcher */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        {/* Real-time Digital Server Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#020e08] border border-emerald-500/40 shadow-lg text-emerald-300 font-mono font-bold select-none">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <ServerClock />
        </div>

        {/* PERSPECTIVE SWITCHER */}
        <div className="flex items-center gap-2 bg-[#020e08] border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-lg">
          <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3" /> Login Sebagai:
          </span>
          <select
            value={activePerspective}
            onChange={(e) => {
              setActivePerspective(e.target.value);
              showToast(
                `Beralih sudut pandang ke: ${
                  e.target.value === "admin"
                    ? "Super Admin / Direksi"
                    : employees.find((emp) => emp.id === e.target.value)?.name
                }`
              );
            }}
            className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
          >
            <option value="admin" className="bg-[#021008] text-white">👑 Super Admin / Direksi (Semua Akses)</option>
            <option value="emp-gm" className="bg-[#021008] text-white">🏢 Dr. Kartika Sari (General Manager — Membawahi 6 Supervisor)</option>
            <option value="emp-hr-spv" className="bg-[#021008] text-white">👩‍💼 Siti Rahmawati (HR Supervisor — Akses Registrasi SDM)</option>
            <option value="emp-it-spv" className="bg-[#021008] text-white">💻 Budi Pratama (IT Supervisor — Akses Server & Geofence)</option>
            <option value="emp-mkt-spv" className="bg-[#021008] text-white">📈 Dewi Lestari (Marketing Supervisor)</option>
            <option value="emp-it-stf" className="bg-[#021008] text-white">👤 Dimas Wicaksono (IT Staff — Bawahan Budi)</option>
            <option value="emp-mkt-stf" className="bg-[#021008] text-white">👤 Aditya Pratama (Marketing Staff — Bawahan Dewi)</option>
            {employees
              .filter((emp) => !["emp-ceo", "emp-gm", "emp-hr-spv", "emp-it-spv", "emp-mkt-spv", "emp-it-stf", "emp-mkt-stf"].includes(emp.id))
              .map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#021008] text-white">
                  👤 {emp.name} ({emp.role})
                </option>
              ))}
          </select>
        </div>

        <button
          onClick={() => showToast("Mode Gelap Aktif (Dark Forest Aesthetic)")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#041910] text-amber-300 border border-emerald-900/60 hover:bg-[#072518] transition-all font-semibold"
        >
          <span>🌙</span>
          <span>Dark</span>
        </button>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-3.5 py-1.5 rounded-lg bg-[#041910] text-white border border-emerald-900/60 hover:bg-[#072518] transition-all font-semibold"
        >
          Ganti Password
        </button>
        <button
          onClick={() => {
            if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
              showToast("Anda telah keluar dari sesi kerja.", "info");
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#041910] text-amber-300 border border-emerald-900/60 hover:bg-[#072518] transition-all font-semibold"
        >
          <span>🚪</span>
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
