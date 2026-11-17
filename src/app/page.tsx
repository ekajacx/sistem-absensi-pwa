"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  MapPin,
  Camera,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Calendar,
  Smartphone,
  LayoutDashboard,
  Sliders,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Building2,
  Briefcase,
  FileText,
  Palmtree,
  BookOpen,
  UserCheck,
  Settings,
  Search,
  Filter,
  Download,
  Plus,
  Pencil,
  Check,
  X,
  Upload,
} from "lucide-react";

export default function Home() {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");

  // Dynamic Company Profile State
  const [companyName, setCompanyName] = useState<string>("AbsenKu");
  const [isEditingCompany, setIsEditingCompany] = useState<boolean>(false);
  const [tempCompanyName, setTempCompanyName] = useState<string>("AbsenKu");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCompanyLogoUrl(url);
    }
  };

  const saveCompanyName = () => {
    if (tempCompanyName.trim()) {
      setCompanyName(tempCompanyName.trim());
    }
    setIsEditingCompany(false);
  };

  // Collapsible Sidebar Sections
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    kepegawaian: true,
    kehadiran: true,
    aktivitas: true,
    sistem: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ─── Menu Meta: Dynamic Header Title & Subtitle per Active Menu ───────────
  const menuMeta: Record<string, { title: string; subtitle: string; icon: string }> = {
    dashboard:        { title: "DASHBOARD",           subtitle: `Ringkasan Data ${companyName}`,                    icon: "🏠" },
    karyawan:         { title: "KARYAWAN",             subtitle: "Direktori & Master Biometrik Karyawan",            icon: "👥" },
    departemen:       { title: "DEPARTEMEN",           subtitle: "Manajemen Struktur Organisasi Perusahaan",         icon: "🏢" },
    jabatan:          { title: "JABATAN",              subtitle: "Daftar Posisi & Level Jabatan Karyawan",           icon: "💼" },
    kontrak:          { title: "KONTRAK & LIFECYCLE",  subtitle: "Manajemen Kontrak & Masa Kerja Karyawan",         icon: "📄" },
    absensi:          { title: "ABSENSI (GPS & WAJAH)", subtitle: "Verifikasi Kehadiran Otomatis Real-Time",        icon: "📍" },
    "rekap-absensi":  { title: "REKAP ABSENSI",        subtitle: "Laporan Kehadiran, Audit Trail & Export Data",    icon: "📊" },
    "jadwal-shift":   { title: "JADWAL SHIFT",         subtitle: "Konfigurasi Shift Kerja Dinamis & Alokasi SDM",   icon: "📅" },
    "pengajuan-cuti": { title: "PENGAJUAN CUTI",       subtitle: "Kelola & Pantau Pengajuan Cuti Karyawan",         icon: "🏖️" },
    "jurnal-kerja":   { title: "JURNAL KERJA",         subtitle: "Catatan Aktivitas, Produktivitas & Log Harian",   icon: "📑" },
    "user-management":{ title: "USER MANAGEMENT",      subtitle: "Kelola Akun Pengguna & Hak Akses Sistem",         icon: "👤" },
    pengaturan:       { title: "PENGATURAN SISTEM",    subtitle: "Konfigurasi Geofence, AI & Parameter Sistem",     icon: "⚙️" },
  };
  const currentMeta = menuMeta[activeMenu] ?? { title: activeMenu.toUpperCase(), subtitle: "", icon: "📋" };

  // Selected Metric in Dashboard
  const [selectedMetric, setSelectedMetric] = useState<string>("all");

  // Real-time Clock
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Employee Simulator States
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [attendanceState, setAttendanceState] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [faceScore, setFaceScore] = useState(96.4);
  const [distanceMeters, setDistanceMeters] = useState(14.2);

  // Shift Management State
  const [shifts, setShifts] = useState([
    {
      id: "1",
      name: "Shift Pagi (Utama)",
      startTime: "07:00",
      endTime: "15:00",
      tolerance: "15 Menit",
      openBefore: "60 Menit",
      activeStaff: 4,
      status: "Aktif",
    },
    {
      id: "2",
      name: "Shift Siang (Operasional)",
      startTime: "15:00",
      endTime: "23:00",
      tolerance: "15 Menit",
      openBefore: "45 Menit",
      activeStaff: 2,
      status: "Aktif",
    },
    {
      id: "3",
      name: "Shift Malam (Teknis / Lintas Hari)",
      startTime: "23:00",
      endTime: "07:00",
      tolerance: "10 Menit",
      openBefore: "30 Menit",
      activeStaff: 0,
      status: "Aktif",
    },
  ]);

  const handleCheckIn = () => {
    if (!livenessPassed) {
      alert("Harap lakukan uji liveness wajah terlebih dahulu!");
      return;
    }
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setAttendanceState("SUCCESS");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-[#010804] text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Hidden File Input for Logo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLogoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* ========================================================= */}
      {/* PANEL KIRI: LEBIH GELAP PEKAT (#010905)                  */}
      {/* ========================================================= */}
      <aside className="w-64 flex-shrink-0 bg-[#010a06] border-r border-emerald-950/80 flex flex-col justify-between py-5 px-3 min-h-screen select-none z-20 shadow-2xl shadow-black">
        <div>
          {/* Header Profil Perusahaan Dinamis (Bisa Ganti Foto & Nama) */}
          <div className="group relative p-2.5 rounded-2xl bg-[#03140d]/70 border border-emerald-900/40 hover:border-emerald-500/40 transition-all mb-6">
            <div className="flex items-center gap-3">
              {/* Foto Profil Perusahaan (Bisa Diklik untuk Ganti Foto) */}
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Klik untuk ganti foto logo perusahaan"
                className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-emerald-600 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-black cursor-pointer overflow-hidden flex-shrink-0 group/logo ring-1 ring-emerald-300/40 hover:brightness-110 transition-all"
              >
                {companyLogoUrl ? (
                  <img src={companyLogoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>{companyName.substring(0, 2).toUpperCase()}</span>
                )}
                {/* Upload Overlay Icon on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Upload className="w-4 h-4" />
                </div>
              </div>

              {/* Nama Perusahaan & Tombol Pensil Saat Di-Sorot */}
              <div className="flex-1 min-w-0">
                {isEditingCompany ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempCompanyName}
                      onChange={(e) => setTempCompanyName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveCompanyName()}
                      className="w-full bg-[#020b06] border border-emerald-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={saveCompanyName}
                      className="p-1 rounded bg-emerald-500 text-black hover:bg-emerald-400"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setIsEditingCompany(false)}
                      className="p-1 rounded bg-red-950 text-red-300 hover:bg-red-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <h1 className="text-base font-extrabold text-white tracking-tight truncate">
                          {companyName}
                        </h1>
                        {/* Tombol Pensil yang Muncul Saat Di-Sorot (Hover) */}
                        <button
                          onClick={() => {
                            setTempCompanyName(companyName);
                            setIsEditingCompany(true);
                          }}
                          title="Klik untuk ubah nama perusahaan"
                          className="opacity-0 group-hover:opacity-100 text-emerald-400 hover:text-white p-1 rounded-md transition-opacity"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] font-bold text-white tracking-widest uppercase block truncate">
                        {currentMeta.title}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu 1: Dashboard */}
          <div className="px-1 mb-4">
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeMenu === "dashboard"
                  ? "bg-[#0a261a] text-white border border-emerald-500/30 shadow-lg shadow-black/80"
                  : "text-white hover:bg-emerald-950/60"
              }`}
            >
              <span className="text-base">🏠</span>
              <span>Dashboard</span>
            </button>
          </div>

          {/* Collapsible Sections List */}
          <div className="space-y-4 px-1 text-xs">
            {/* Section 1: KEPEGAWAIAN */}
            <div>
              <button
                onClick={() => toggleSection("kepegawaian")}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white hover:text-emerald-300"
              >
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <span>KEPEGAWAIAN</span>
                </div>
                {openSections.kepegawaian ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {openSections.kepegawaian && (
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-900/60 ml-4">
                  {[
                    { id: "karyawan", label: "Karyawan", icon: "👥" },
                    { id: "departemen", label: "Departemen", icon: "🏢" },
                    { id: "jabatan", label: "Jabatan", icon: "💼" },
                    { id: "kontrak", label: "Kontrak & Lifecycle", icon: "📄" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-l-2 border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium"
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: KEHADIRAN */}
            <div>
              <button
                onClick={() => toggleSection("kehadiran")}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white hover:text-emerald-300"
              >
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>KEHADIRAN</span>
                </div>
                {openSections.kehadiran ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {openSections.kehadiran && (
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-900/60 ml-4">
                  {[
                    { id: "absensi", label: "Absensi (GPS & Wajah)", icon: "📍" },
                    { id: "rekap-absensi", label: "Rekap Absensi", icon: "📊" },
                    { id: "jadwal-shift", label: "Jadwal Shift", icon: "📅" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-l-2 border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium"
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: AKTIVITAS */}
            <div>
              <button
                onClick={() => toggleSection("aktivitas")}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white hover:text-emerald-300"
              >
                <div className="flex items-center gap-2">
                  <span>📝</span>
                  <span>AKTIVITAS</span>
                </div>
                {openSections.aktivitas ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {openSections.aktivitas && (
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-900/60 ml-4">
                  {[
                    { id: "pengajuan-cuti", label: "Pengajuan Cuti", icon: "🏖️" },
                    { id: "jurnal-kerja", label: "Jurnal Kerja", icon: "📑" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-l-2 border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium"
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: SISTEM */}
            <div>
              <button
                onClick={() => toggleSection("sistem")}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white hover:text-emerald-300"
              >
                <div className="flex items-center gap-2">
                  <span>⚙️</span>
                  <span>SISTEM</span>
                </div>
                {openSections.sistem ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {openSections.sistem && (
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-900/60 ml-4">
                  {[
                    { id: "user-management", label: "User Management", icon: "👤" },
                    { id: "pengaturan", label: "Pengaturan", icon: "⚙️" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-l-2 border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium"
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 bg-[#010704] rounded-xl border border-emerald-950 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-xs text-white ring-1 ring-emerald-500/40">
            BP
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-white block truncate">Budi Pratama</span>
            <span className="text-[10px] text-white/80 block truncate">Administrator</span>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* PANEL KANAN: BERGRADASI HIJAU TUA MODERN                  */}
      {/* Background: Gradient dari #051e13 via #020b07 ke #010604  */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-[#051f14] via-[#020d08] to-[#010604] relative">
        {/* Modern Radial Lighting Effect in the Background */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-0" />

        {/* Top Header Row — Dinamis sesuai menu aktif */}
        <header className="px-8 pt-7 pb-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            {/* Icon Menu Aktif */}
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

          {/* Right Header Action Buttons: Dark, Ganti Password, Keluar */}
          <div className="flex items-center gap-2.5 text-xs">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#041910] text-amber-300 border border-emerald-900/60 hover:bg-[#072518] transition-all font-semibold">
              <span>🌙</span>
              <span>Dark</span>
            </button>
            <button className="px-3.5 py-1.5 rounded-lg bg-[#041910] text-white border border-emerald-900/60 hover:bg-[#072518] transition-all font-semibold">
              Ganti Password
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#041910] text-amber-300 border border-emerald-900/60 hover:bg-[#072518] transition-all font-semibold">
              <span>🚪</span>
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Content Body Based on Active Menu */}
        <div className="px-8 pb-10 space-y-6 relative z-10">
          {/* ===================================================== */}
          {/* VIEW: DASHBOARD (PERSIS SEPERTI GAMBAR REFERENSI)    */}
          {/* ===================================================== */}
          {activeMenu === "dashboard" && (
            <div className="space-y-5">
              {/* BIG HERO CARD: Human Capital Overview dengan Gradasi Modern */}
              <div className="rounded-3xl bg-gradient-to-br from-[#072619] via-[#03150d] to-[#010a06] p-7 border border-emerald-500/25 shadow-2xl relative overflow-hidden">
                {/* Card Top Label & Badge */}
                <div className="flex items-center justify-between mb-4">
                  {/* Warning/Alert Accent Color (Amber) */}
                  <span className="text-[11px] font-black tracking-widest uppercase text-amber-400">
                    {companyName.toUpperCase()} - WORKFORCE INTELLIGENCE
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#020e08] text-white text-[10px] font-extrabold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DATA {companyName.toUpperCase()}</span>
                  </span>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-white">Human Capital Overview</h2>
                  <p className="text-xs text-white">Komposisi dan statistik SDM aktif</p>
                </div>

                {/* 2-Columns Body inside Hero Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Golden Circular Donut Dial */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="rgba(16, 185, 129, 0.15)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#eab308"
                          strokeWidth="8"
                          strokeDasharray="238.76"
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      {/* Center Number */}
                      <div className="absolute text-center">
                        <span className="text-4xl font-black text-white font-mono block">6</span>
                        <span className="text-xs text-white font-bold">Karyawan</span>
                      </div>
                    </div>
                    <span className="text-xs text-white mt-3 font-semibold">
                      Komposisi karyawan aktif
                    </span>
                  </div>

                  {/* Right Column: Progress Bars & Insight SDM Box */}
                  <div className="lg:col-span-8 space-y-5">
                    {/* Progress Bar 1: Karyawan Kontrak */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <span className="text-white font-bold">Karyawan Kontrak</span>
                        </div>
                        <span className="font-mono text-white font-bold">0 • 0%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#010804] overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "0%" }} />
                      </div>
                    </div>

                    {/* Progress Bar 2: Karyawan Tetap (Gold Bar) */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="text-white font-bold">Karyawan Tetap</span>
                        </div>
                        <span className="font-mono text-white font-bold">6 • 100%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#010804] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full shadow-sm shadow-amber-400/50" style={{ width: "100%" }} />
                      </div>
                    </div>

                    {/* INSIGHT SDM Box (Persis Sesuai Gambar) */}
                    <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 mt-4">
                      {/* Alert / Highlight Accent */}
                      <span className="text-[10px] font-black tracking-wider uppercase text-amber-400 block mb-1">
                        INSIGHT SDM
                      </span>
                      <p className="text-xs text-white font-medium">
                        Sebagian besar karyawan aktif berstatus tetap (100%).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 SUMMARY STAT CARDS (Persis Sesuai Gambar) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Seluruh Karyawan (Active Border Ring) */}
                <div
                  onClick={() => setSelectedMetric("all")}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedMetric === "all"
                      ? "bg-gradient-to-br from-[#082e1e] to-[#03150d] border-2 border-emerald-400 shadow-xl shadow-black"
                      : "bg-[#03140d] border border-emerald-900/60 hover:bg-[#062216]"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-white mb-2 font-bold">
                    <span className="text-sm">👥</span>
                    <span>Seluruh Karyawan</span>
                  </div>
                  <div className="text-3xl font-black text-white font-mono">6</div>
                  <span className="text-[10px] text-white mt-1 block">Tenaga kerja aktif</span>
                </div>

                {/* Card 2: Karyawan Kontrak */}
                <div
                  onClick={() => setSelectedMetric("kontrak")}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedMetric === "kontrak"
                      ? "bg-gradient-to-br from-[#082e1e] to-[#03150d] border-2 border-emerald-400 shadow-xl shadow-black"
                      : "bg-[#03140d] border border-emerald-900/60 hover:bg-[#062216]"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-white mb-2 font-bold">
                    <span className="text-sm">📄</span>
                    <span>Karyawan Kontrak</span>
                  </div>
                  <div className="text-3xl font-black text-white font-mono">0</div>
                  <span className="text-[10px] text-white mt-1 block">Status kontrak</span>
                </div>

                {/* Card 3: Karyawan Tetap */}
                <div
                  onClick={() => setSelectedMetric("tetap")}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedMetric === "tetap"
                      ? "bg-gradient-to-br from-[#082e1e] to-[#03150d] border-2 border-emerald-400 shadow-xl shadow-black"
                      : "bg-[#03140d] border border-emerald-900/60 hover:bg-[#062216]"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-white mb-2 font-bold">
                    <span className="text-sm">🏅</span>
                    <span>Karyawan Tetap</span>
                  </div>
                  <div className="text-3xl font-black text-white font-mono">6</div>
                  <span className="text-[10px] text-white mt-1 block">Status tetap</span>
                </div>

                {/* Card 4: User Aktif */}
                <div
                  onClick={() => setSelectedMetric("user")}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedMetric === "user"
                      ? "bg-gradient-to-br from-[#082e1e] to-[#03150d] border-2 border-emerald-400 shadow-xl shadow-black"
                      : "bg-[#03140d] border border-emerald-900/60 hover:bg-[#062216]"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-white mb-2 font-bold">
                    <span className="text-sm">🔐</span>
                    <span>User Aktif</span>
                  </div>
                  <div className="text-3xl font-black text-white font-mono">7</div>
                  <span className="text-[10px] text-white mt-1 block">Akun sistem aktif</span>
                </div>
              </div>

              {/* ROW: METRIK TERPILIH (Persis Sesuai Gambar) */}
              <div className="bg-gradient-to-r from-[#062417] to-[#03150d] rounded-2xl p-5 border border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                    METRIK TERPILIH
                  </span>
                  <h3 className="text-base font-bold text-white">Seluruh Karyawan</h3>
                  <p className="text-xs text-white">Total tenaga kerja aktif di database HRIS.</p>
                </div>
                <div className="text-4xl font-black text-white font-mono">6</div>
              </div>

              {/* BOTTOM SECTION: Informasi Akun & Server Sync */}
              <div className="bg-[#03150d] rounded-2xl p-5 border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Informasi Akun & Server Sync</h3>
                  <p className="text-xs text-white">
                    Sistem absensi tersinkronisasi otomatis dengan database kantor dan waktu server NTP.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-white text-xs font-mono font-bold border border-emerald-500/30">
                    NTP: {currentTime || "07:45:12 WIB"}
                  </span>
                  <button
                    onClick={() => setActiveMenu("absensi")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-extrabold hover:brightness-110 shadow-lg shadow-black transition-all"
                  >
                    Buka Pintu Absensi →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: ABSENSI (CAMERA & GPS AUTO-APPROVAL SCANNER)    */}
          {/* ===================================================== */}
          {activeMenu === "absensi" && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="rounded-3xl bg-gradient-to-b from-[#072a1b] via-[#03150d] to-[#010a06] p-6 border border-emerald-500/30 shadow-2xl relative">
                {/* Employee Header */}
                <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full ring-2 ring-emerald-400 bg-emerald-950 flex items-center justify-center font-bold text-white text-sm">
                      BP
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Budi Pratama</h3>
                      <p className="text-[11px] text-white">NIK: 2026-0891 • IT Ops</p>
                      <span className="text-[10px] font-bold text-emerald-400">Shift Pagi (07:00 - 15:00)</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-white text-[10px] font-bold border border-emerald-500/30">
                    Geofence OK
                  </span>
                </div>

                {/* Geofence Distance Card */}
                <div className="bg-[#010804] rounded-xl p-3.5 border border-emerald-900/60 mb-4 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[10px] text-white block">Jarak ke Kantor Pusat</span>
                      <span className="font-bold text-white">{distanceMeters} Meter</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white font-mono font-bold">Batas Toleransi: 50 m</span>
                </div>

                {/* Oval Camera Face Scanner */}
                <div className="relative rounded-2xl bg-[#010603] border border-emerald-500/30 p-6 text-center overflow-hidden mb-5">
                  <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                  <div
                    className={`relative mx-auto w-36 h-48 rounded-[50%] border-2 transition-all flex flex-col items-center justify-center p-2 ${
                      livenessPassed
                        ? "border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/25"
                        : "border-dashed border-emerald-500/40"
                    }`}
                  >
                    <Camera className="w-8 h-8 text-emerald-400 mb-2" />
                    <span className="text-[11px] text-white font-bold">
                      {livenessPassed ? "Wajah Terverifikasi!" : "Arahkan Wajah ke Bingkai"}
                    </span>
                    {livenessPassed && (
                      <span className="text-xs font-bold text-white font-mono mt-1">
                        AI Match: {faceScore}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setLivenessPassed(!livenessPassed)}
                    className={`mt-4 text-xs px-4 py-2 rounded-xl border font-bold transition-all ${
                      livenessPassed
                        ? "bg-emerald-500/20 text-white border-emerald-400/40"
                        : "bg-emerald-500 text-black border-transparent hover:bg-emerald-400"
                    }`}
                  >
                    {livenessPassed ? "✓ Uji Liveness Lolos (Kedipan Terbaca)" : "Simulasikan Kedipan Mata (Uji Liveness)"}
                  </button>
                </div>

                {/* Auto-Approval Result / Action Button */}
                {attendanceState === "SUCCESS" ? (
                  <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-white font-black text-sm mb-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>APPROVED (Otomatis Hadir Sah)</span>
                    </div>
                    <p className="text-xs text-white mb-2">
                      Jam Server: {currentTime} • Tepat Waktu
                    </p>
                    <p className="text-[11px] text-white/80">
                      Sistem telah mengesahkan absensi secara otomatis tanpa perlu approval manual HRD.
                    </p>
                    <button
                      onClick={() => {
                        setAttendanceState("IDLE");
                        setLivenessPassed(false);
                      }}
                      className="mt-3 text-xs text-white underline font-semibold"
                    >
                      Ulangi Simulasi Absen
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={isCapturing}
                    onClick={handleCheckIn}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs tracking-wider uppercase shadow-xl shadow-black hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCapturing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Memvalidasi Data Biometrik & Jarak...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-black" />
                        <span>KIRIM ABSENSI MASUK (AUTO-APPROVED)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: REKAP ABSENSI                                   */}
          {/* ===================================================== */}
          {activeMenu === "rekap-absensi" && (
            <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-6 border border-emerald-900/60 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">Rekapitulasi Kehadiran Karyawan</h3>
                  <p className="text-xs text-white">Log kehadiran terverifikasi otomatis</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#020d07] text-white border border-emerald-900/60 text-xs font-semibold hover:bg-emerald-950">
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor XLSX</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#020d07] text-white border border-emerald-900/60 text-xs font-semibold hover:bg-emerald-950">
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor PDF</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white text-[10px] uppercase font-bold">
                      <th className="py-3">Karyawan</th>
                      <th className="py-3">Departemen</th>
                      <th className="py-3">Shift</th>
                      <th className="py-3">Check-In</th>
                      <th className="py-3">Check-Out</th>
                      <th className="py-3">Jarak</th>
                      <th className="py-3">Skor AI</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {[
                      { name: "Budi Pratama", nik: "2026-0891", dept: "IT Ops", shift: "Shift Pagi", in: "07:42 WIB", out: "15:02 WIB", dist: "14.2m", score: "96.4%", status: "APPROVED" },
                      { name: "Siti Rahmawati", nik: "2026-0412", dept: "HRD", shift: "Shift Pagi", in: "07:35 WIB", out: "15:00 WIB", dist: "8.5m", score: "98.1%", status: "APPROVED" },
                      { name: "Andi Saputra", nik: "2026-0775", dept: "Finance", shift: "Shift Pagi", in: "07:58 WIB", out: "15:15 WIB", dist: "24.1m", score: "93.7%", status: "APPROVED" },
                      { name: "Dewi Lestari", nik: "2026-0219", dept: "Marketing", shift: "Shift Pagi", in: "08:04 WIB", out: "--:--", dist: "18.9m", score: "95.2%", status: "TERLAMBAT" },
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-emerald-950/20">
                        <td className="py-3 font-bold text-white">{r.name}</td>
                        <td className="py-3 text-white font-medium">{r.dept}</td>
                        <td className="py-3 text-white">{r.shift}</td>
                        <td className="py-3 font-mono text-white">{r.in}</td>
                        <td className="py-3 font-mono text-white/80">{r.out}</td>
                        <td className="py-3 font-mono text-white">{r.dist}</td>
                        <td className="py-3 font-mono text-white font-bold">{r.score}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === "APPROVED"
                                ? "bg-emerald-500/20 text-white border border-emerald-400/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: JADWAL SHIFT                                    */}
          {/* ===================================================== */}
          {activeMenu === "jadwal-shift" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Manajemen Shift Kerja Dinamis</h3>
                  <p className="text-xs text-white">Tentukan jam masuk, jam pulang, dan batas toleransi</p>
                </div>
                <button
                  onClick={() => alert("Form Tambah Shift Baru")}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Tambah Shift Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {shifts.map((s) => (
                  <div key={s.id} className="bg-gradient-to-br from-[#062417] to-[#021008] p-6 rounded-2xl border border-emerald-900/60 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-white border border-emerald-500/30">
                          {s.status}
                        </span>
                        <span className="text-xs text-white font-bold">{s.activeStaff} Anggota</span>
                      </div>
                      <h4 className="font-bold text-white text-base mb-2">{s.name}</h4>
                      <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 text-center my-3">
                        <span className="font-mono text-xl font-extrabold text-white">
                          {s.startTime} - {s.endTime}
                        </span>
                      </div>
                      <div className="text-xs space-y-1.5 text-white">
                        <div className="flex justify-between">
                          <span className="text-white">Toleransi Terlambat:</span>
                          <span className="font-bold text-white">{s.tolerance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white">Jendela Dibuka:</span>
                          <span className="font-bold text-white">{s.openBefore} Sebelum</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-5 py-2 rounded-lg bg-[#020e08] text-white border border-emerald-900/60 hover:bg-emerald-950 text-xs font-semibold">
                      Ubah Parameter
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: KARYAWAN & KEPEGAWAIAN                          */}
          {/* ===================================================== */}
          {activeMenu === "karyawan" && (
            <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-6 border border-emerald-900/60 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-base">Direktori 6 Karyawan Aktif</h3>
                <button className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400">
                  + Daftarkan Karyawan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {[
                  { name: "Budi Pratama", nik: "2026-0891", dept: "IT Operations", role: "Sr. Software Eng", face: "Terdaftar (Embedding Valid)" },
                  { name: "Siti Rahmawati", nik: "2026-0412", dept: "HR & People", role: "HR Specialist", face: "Terdaftar (Embedding Valid)" },
                  { name: "Andi Saputra", nik: "2026-0775", dept: "Finance", role: "Finance Officer", face: "Terdaftar (Embedding Valid)" },
                  { name: "Dewi Lestari", nik: "2026-0219", dept: "Marketing", role: "Marketing Lead", face: "Terdaftar (Embedding Valid)" },
                  { name: "Rian Hidayat", nik: "2026-0155", dept: "Operations", role: "Operations Staff", face: "Terdaftar (Embedding Valid)" },
                  { name: "Maya Indah", nik: "2026-0348", dept: "Legal & Compliance", role: "Legal Specialist", face: "Terdaftar (Embedding Valid)" },
                ].map((k, idx) => (
                  <div key={idx} className="bg-[#010804] p-4 rounded-xl border border-emerald-900/50 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center font-bold text-white text-sm ring-1 ring-emerald-500/30">
                        {k.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">{k.name}</span>
                        <span className="text-[10px] text-white font-mono">NIK: {k.nik}</span>
                      </div>
                    </div>
                    <div className="text-xs text-white pt-2 border-t border-emerald-900/30">
                      <div>Departemen: <span className="text-white font-bold">{k.dept}</span></div>
                      <div>Jabatan: <span className="text-white font-bold">{k.role}</span></div>
                      <div className="text-[10px] text-white font-semibold mt-1">✓ {k.face}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: PENGATURAN KANTOR & GEOFENCE                    */}
          {/* ===================================================== */}
          {activeMenu === "pengaturan" && (
            <div className="max-w-2xl bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-6 border border-emerald-900/60 space-y-5">
              <div>
                <h3 className="font-bold text-white text-base">Pengaturan Lokasi Kantor & Parameter Geofence</h3>
                <p className="text-xs text-white">Tentukan titik koordinat pusat kantor dan radius batas toleransi</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-white block mb-1 font-bold">Nama Lokasi Kantor</label>
                  <input
                    type="text"
                    defaultValue="Kantor Pusat - Sudirman Tower Lt. 12"
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-1 font-bold">Latitude</label>
                    <input
                      type="text"
                      defaultValue="-6.2088"
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white block mb-1 font-bold">Longitude</label>
                    <input
                      type="text"
                      defaultValue="106.8456"
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-1 font-bold">Radius Toleransi Geofence (Meter)</label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white block mb-1 font-bold">Ambang Batas Skor AI Wajah (%)</label>
                    <input
                      type="number"
                      defaultValue="80"
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <button className="w-full mt-4 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-all">
                  Simpan Konfigurasi Sistem
                </button>
              </div>
            </div>
          )}

          {/* Placeholder for other sub-menus */}
          {!["dashboard", "absensi", "rekap-absensi", "jadwal-shift", "karyawan", "pengaturan"].includes(activeMenu) && (
            <div className="bg-[#03150d] rounded-2xl p-12 border border-emerald-900/60 text-center space-y-3">
              <div className="text-4xl">📂</div>
              <h3 className="font-bold text-white text-base capitalize">
                Modul {activeMenu.replace("-", " ")}
              </h3>
              <p className="text-xs text-white max-w-sm mx-auto">
                Modul siap dihubungkan dengan database sesuai alur kerja PRD.
              </p>
              <button
                onClick={() => setActiveMenu("dashboard")}
                className="mt-2 text-xs text-white underline font-bold"
              >
                Kembali ke Dashboard Utama
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
