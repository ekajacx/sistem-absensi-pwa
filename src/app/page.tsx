"use client";

import React, { useState, useEffect } from "react";
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
  FileCheck,
  Palmtree,
  BookOpen,
  UserCheck,
  Settings,
  Search,
  Filter,
  Download,
  Plus,
} from "lucide-react";

export default function Home() {
  // Active Menu Navigation
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");

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

  // Live NTP Clock Simulator
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
      activeStaff: 68,
      status: "Aktif",
    },
    {
      id: "2",
      name: "Shift Siang (Operasional)",
      startTime: "15:00",
      endTime: "23:00",
      tolerance: "15 Menit",
      openBefore: "45 Menit",
      activeStaff: 34,
      status: "Aktif",
    },
    {
      id: "3",
      name: "Shift Malam (Teknis / Lintas Hari)",
      startTime: "23:00",
      endTime: "07:00",
      tolerance: "10 Menit",
      openBefore: "30 Menit",
      activeStaff: 18,
      status: "Aktif",
    },
  ]);

  // Handle Attendance Action Simulator
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
    <div className="flex min-h-screen bg-[#02130c] text-emerald-50 font-sans selection:bg-emerald-500 selection:text-black">
      {/* ========================================================= */}
      {/* SIDEBAR NAVIGATION (PERSIS SESUAI GAMBAR DARI USER)      */}
      {/* ========================================================= */}
      <aside className="w-64 flex-shrink-0 bg-[#051c14] border-r border-emerald-500/15 flex flex-col justify-between py-5 px-3 min-h-screen select-none">
        <div>
          {/* Logo Brand: AbsenKu DASHBOARD */}
          <div className="flex items-center gap-3 px-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300/40">
              AK
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                AbsenKu
              </h1>
              <span className="text-[10px] font-bold text-emerald-400/80 tracking-widest uppercase">
                DASHBOARD
              </span>
            </div>
          </div>

          {/* Menu 1: Dashboard (Single Highlighted Item) */}
          <div className="px-1 mb-4">
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeMenu === "dashboard"
                  ? "bg-[#0b3324] text-white border border-emerald-500/30 shadow-md shadow-emerald-950"
                  : "text-emerald-300/70 hover:text-white hover:bg-emerald-500/10"
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
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/80 hover:text-emerald-300"
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
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-500/20 ml-4">
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
                          ? "bg-emerald-500/20 text-white font-bold border-l-2 border-emerald-400"
                          : "text-emerald-300/60 hover:text-emerald-100 hover:bg-emerald-500/5 font-medium"
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: KEHADIRAN (Menu Inti Absensi) */}
            <div>
              <button
                onClick={() => toggleSection("kehadiran")}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/80 hover:text-emerald-300"
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
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-500/20 ml-4">
                  {[
                    { id: "absensi", label: "Absensi (Kamera & GPS)", icon: "📍" },
                    { id: "rekap-absensi", label: "Rekap Absensi", icon: "📊" },
                    { id: "jadwal-shift", label: "Jadwal Shift", icon: "📅" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-500/20 text-white font-bold border-l-2 border-emerald-400"
                          : "text-emerald-300/60 hover:text-emerald-100 hover:bg-emerald-500/5 font-medium"
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
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/80 hover:text-emerald-300"
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
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-500/20 ml-4">
                  {[
                    { id: "pengajuan-cuti", label: "Pengajuan Cuti", icon: "🏖️" },
                    { id: "jurnal-kerja", label: "Jurnal Kerja", icon: "📑" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-500/20 text-white font-bold border-l-2 border-emerald-400"
                          : "text-emerald-300/60 hover:text-emerald-100 hover:bg-emerald-500/5 font-medium"
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
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/80 hover:text-emerald-300"
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
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-500/20 ml-4">
                  {[
                    { id: "user-management", label: "User Management", icon: "👤" },
                    { id: "pengaturan", label: "Pengaturan", icon: "⚙️" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-500/20 text-white font-bold border-l-2 border-emerald-400"
                          : "text-emerald-300/60 hover:text-emerald-100 hover:bg-emerald-500/5 font-medium"
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
        <div className="p-3 bg-[#03140d] rounded-2xl border border-emerald-500/15 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs text-white ring-2 ring-emerald-400/40">
            BP
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-white block truncate">Budi Pratama</span>
            <span className="text-[10px] text-emerald-400/70 block truncate">Admin HRD / Ops</span>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-[#051c14]/90 backdrop-blur-md border-b border-emerald-500/15 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-white capitalize">
              {activeMenu === "dashboard"
                ? "Ringkasan Eksekutif Kehadiran"
                : activeMenu === "absensi"
                ? "Pintu Absensi Online (Geofence & AI Liveness)"
                : activeMenu === "rekap-absensi"
                ? "Rekapitulasi Kehadiran & Audit Trail"
                : activeMenu === "jadwal-shift"
                ? "Manajemen Shift Kerja Dinamis"
                : activeMenu.replace("-", " ")}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
              Auto-Approval System
            </span>
          </div>

          {/* Real-time NTP Time & Location Pill */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#072a1e] border border-emerald-500/20">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300/80">Kantor Pusat Jakarta (50m Radius)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#072a1e] border border-emerald-500/20 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-200">{currentTime || "07:45:12 WIB"}</span>
            </div>
          </div>
        </header>

        {/* Content Body Based on Active Menu */}
        <div className="p-6 lg:p-8 space-y-6">
          {/* ===================================================== */}
          {/* VIEW: DASHBOARD (OVERVIEW)                            */}
          {/* ===================================================== */}
          {activeMenu === "dashboard" && (
            <div className="space-y-6">
              {/* Top Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#06241a] p-5 rounded-2xl border border-emerald-500/20 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-emerald-300/70">Total Karyawan</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">120</div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    ✓ 3 Shift Operasional Aktif
                  </span>
                </div>

                <div className="bg-[#06241a] p-5 rounded-2xl border border-emerald-500/20 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-emerald-300/70">Hadir Hari Ini (Auto-Approved)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-300 font-mono">108</span>
                    <span className="text-xs text-emerald-400/80 font-bold">(90%)</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    ✓ 102 Tepat Waktu • 6 Terlambat
                  </span>
                </div>

                <div className="bg-[#06241a] p-5 rounded-2xl border border-emerald-500/20 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-emerald-300/70">Akurasi AI Biometrik</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">95.8%</div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    ✓ Nilai Lolos Ambang Batas (&gt;80%)
                  </span>
                </div>

                <div className="bg-[#06241a] p-5 rounded-2xl border border-emerald-500/20 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-emerald-300/70">Belum Hadir / Cuti</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-amber-200 font-mono">12</div>
                  <span className="text-[11px] text-amber-400/80 mt-1 block">
                    • 8 Belum Jam Shift • 4 Pengajuan Cuti
                  </span>
                </div>
              </div>

              {/* Attendance Visual Chart & Geofence Radial Meter */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-8 bg-[#06241a] p-6 rounded-2xl border border-emerald-500/20">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-white text-sm">Grafik Tren Kehadiran Mingguan</h3>
                      <p className="text-xs text-emerald-300/60">Persentase kehadiran karyawan per hari</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                      Rata-rata: 93.8%
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-3 h-44 items-end pt-4">
                    {[
                      { day: "Senin", rate: 96, count: "115" },
                      { day: "Selasa", rate: 90, count: "108" },
                      { day: "Rabu", rate: 94, count: "113" },
                      { day: "Kamis", rate: 98, count: "118" },
                      { day: "Jumat", rate: 92, count: "110" },
                      { day: "Sabtu", rate: 85, count: "102" },
                    ].map((b, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-mono font-bold text-emerald-300 group-hover:scale-110 transition-transform">
                          {b.rate}%
                        </span>
                        <div
                          style={{ height: `${b.rate}%` }}
                          className="w-full rounded-xl bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20 group-hover:brightness-125 transition-all"
                        />
                        <span className="text-xs font-semibold text-emerald-200 mt-1">{b.day}</span>
                        <span className="text-[10px] text-emerald-300/50 font-mono">{b.count}/120</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Geofence Radial Widget */}
                <div className="lg:col-span-4 bg-[#06241a] p-6 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">Kepatuhan Geofence</h3>
                    <p className="text-xs text-emerald-300/60 mb-6">Jarak GPS absensi terhadap kantor (Radius 50m)</p>

                    <div className="relative w-32 h-32 mx-auto rounded-full border-8 border-emerald-500/20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-8 border-emerald-400 border-t-transparent -rotate-45" />
                      <div className="text-center">
                        <span className="text-2xl font-black text-white font-mono block">99.2%</span>
                        <span className="text-[9px] text-emerald-300/70 uppercase">Lolos Radius</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-4 text-xs">
                    <div className="flex justify-between text-emerald-200">
                      <span>Radius &lt; 20 meter</span>
                      <span className="font-mono font-bold text-emerald-400">84.2%</span>
                    </div>
                    <div className="flex justify-between text-emerald-200">
                      <span>Radius 20 - 45 meter</span>
                      <span className="font-mono font-bold text-emerald-400">15.0%</span>
                    </div>
                    <div className="flex justify-between text-emerald-300/60">
                      <span>Di Luar Radius (Ditolak)</span>
                      <span className="font-mono font-bold text-red-400">0.8%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Attendance Table */}
              <div className="bg-[#06241a] rounded-2xl p-6 border border-emerald-500/20">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-white text-sm">Live Feed Kehadiran Otomatis Hari Ini</h3>
                    <p className="text-xs text-emerald-300/60">
                      Karyawan yang berhasil absen langsung disetujui (Approved) secara instan oleh sistem
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveMenu("rekap-absensi")}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Buka Rekap Lengkap →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-emerald-500/20 text-emerald-300/60 text-[10px] uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Karyawan</th>
                        <th className="pb-3 font-semibold">Shift Kerja</th>
                        <th className="pb-3 font-semibold">Jam Absen Server</th>
                        <th className="pb-3 font-semibold">Jarak Kantor</th>
                        <th className="pb-3 font-semibold">Skor AI Wajah</th>
                        <th className="pb-3 font-semibold">Status Sah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/10">
                      {[
                        { name: "Budi Pratama", nik: "2026-0891", shift: "Shift Pagi", time: "07:42:15 WIB", dist: "14.2 m", score: 96.4, late: false },
                        { name: "Siti Rahmawati", nik: "2026-0412", shift: "Shift Pagi", time: "07:35:48 WIB", dist: "8.5 m", score: 98.1, late: false },
                        { name: "Andi Saputra", nik: "2026-0775", shift: "Shift Pagi", time: "07:58:22 WIB", dist: "24.1 m", score: 93.7, late: false },
                        { name: "Dewi Lestari", nik: "2026-0219", shift: "Shift Pagi", time: "08:04:10 WIB", dist: "18.9 m", score: 95.2, late: true },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-emerald-500/5 transition-colors">
                          <td className="py-3 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-emerald-900 border border-emerald-400/40 flex items-center justify-center font-bold text-white text-[11px]">
                              {row.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{row.name}</span>
                              <span className="text-[10px] text-emerald-300/60 font-mono">NIK: {row.nik}</span>
                            </div>
                          </td>
                          <td className="py-3 text-emerald-200">{row.shift}</td>
                          <td className="py-3 font-mono text-emerald-100">{row.time}</td>
                          <td className="py-3 font-mono text-emerald-300 font-semibold">{row.dist}</td>
                          <td className="py-3">
                            <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {row.score}%
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                row.late
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              }`}
                            >
                              {row.late ? "TERLAMBAT (AUTO)" : "APPROVED (AUTO)"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: ABSENSI (CAMERA & GPS AUTO-APPROVAL SCANNER)    */}
          {/* ===================================================== */}
          {activeMenu === "absensi" && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="rounded-3xl bg-gradient-to-b from-[#083324] to-[#041a12] p-6 border-2 border-emerald-500/30 shadow-2xl relative">
                {/* Employee Info Header */}
                <div className="bg-[#06241a] rounded-2xl p-4 border border-emerald-500/20 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full ring-2 ring-emerald-400 bg-emerald-900 flex items-center justify-center text-lg font-bold text-white">
                      BP
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Budi Pratama</h3>
                      <p className="text-[11px] text-emerald-300/70">NIK: 2026-0891 • IT Ops</p>
                      <span className="text-[10px] font-semibold text-emerald-400">Shift Pagi (07:00 - 15:00)</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Geofence OK
                  </span>
                </div>

                {/* Geofence Distance Card */}
                <div className="bg-[#03150f] rounded-xl p-3 border border-emerald-500/20 mb-4 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[10px] text-emerald-300/60 block">Jarak ke Kantor Pusat</span>
                      <span className="font-bold text-white">{distanceMeters} Meter</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">Batas Toleransi: 50 m</span>
                </div>

                {/* Oval Camera Face Scanner */}
                <div className="relative rounded-2xl bg-[#020e08] border-2 border-emerald-500/40 p-6 text-center overflow-hidden mb-5">
                  <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                  <div
                    className={`relative mx-auto w-40 h-52 rounded-[50%] border-2 transition-all flex flex-col items-center justify-center p-2 ${
                      livenessPassed
                        ? "border-emerald-400 bg-emerald-500/10 shadow-xl shadow-emerald-500/30"
                        : "border-dashed border-emerald-500/50"
                    }`}
                  >
                    <Camera className="w-8 h-8 text-emerald-400 mb-2" />
                    <span className="text-[11px] text-emerald-200 font-medium">
                      {livenessPassed ? "Wajah Terverifikasi!" : "Arahkan Wajah ke Bingkai"}
                    </span>
                    {livenessPassed && (
                      <span className="text-xs font-bold text-emerald-300 font-mono mt-1">
                        AI Match: {faceScore}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setLivenessPassed(!livenessPassed)}
                    className={`mt-4 text-xs px-4 py-2 rounded-xl border font-bold transition-all ${
                      livenessPassed
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                        : "bg-emerald-500 text-black border-transparent hover:bg-emerald-400"
                    }`}
                  >
                    {livenessPassed ? "✓ Uji Liveness Lolos (Kedipan Terbaca)" : "Simulasikan Kedipan Mata (Uji Liveness)"}
                  </button>
                </div>

                {/* Auto-Approval Result / Action Button */}
                {attendanceState === "SUCCESS" ? (
                  <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-emerald-300 font-extrabold text-base mb-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span>APPROVED (Otomatis Hadir Sah)</span>
                    </div>
                    <p className="text-xs text-emerald-200/80 mb-2">
                      Jam Server: {currentTime} • Tepat Waktu (Tidak Terlambat)
                    </p>
                    <p className="text-[11px] text-emerald-300/60">
                      Sistem telah mencocokkan biometrik & geolokasi secara instan tanpa perlu approval manual HRD.
                    </p>
                    <button
                      onClick={() => {
                        setAttendanceState("IDLE");
                        setLivenessPassed(false);
                      }}
                      className="mt-3 text-xs text-emerald-400 underline font-semibold"
                    >
                      Ulangi Simulasi Absen
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={isCapturing}
                    onClick={handleCheckIn}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black text-sm tracking-wide shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            <div className="bg-[#06241a] rounded-2xl p-6 border border-emerald-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">Rekapitulasi Kehadiran Karyawan</h3>
                  <p className="text-xs text-emerald-300/60">Laporan log kehadiran lengkap untuk payroll</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20">
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor XLSX</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20">
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor PDF</span>
                  </button>
                </div>
              </div>

              {/* Filter Row */}
              <div className="flex gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Cari nama karyawan / NIK..."
                  className="bg-[#03150f] border border-emerald-500/25 rounded-xl px-3.5 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-emerald-400 flex-1"
                />
                <select className="bg-[#03150f] border border-emerald-500/25 rounded-xl px-3 py-2 text-emerald-200">
                  <option>Semua Shift</option>
                  <option>Shift Pagi</option>
                  <option>Shift Siang</option>
                  <option>Shift Malam</option>
                </select>
                <select className="bg-[#03150f] border border-emerald-500/25 rounded-xl px-3 py-2 text-emerald-200">
                  <option>Semua Status</option>
                  <option>Approved (Auto)</option>
                  <option>Terlambat</option>
                  <option>Dispensasi</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-500/20 text-emerald-300/60 text-[10px] uppercase">
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
                  <tbody className="divide-y divide-emerald-500/10">
                    {[
                      { name: "Budi Pratama", nik: "2026-0891", dept: "IT Ops", shift: "Shift Pagi", in: "07:42 WIB", out: "15:02 WIB", dist: "14.2m", score: "96.4%", status: "APPROVED" },
                      { name: "Siti Rahmawati", nik: "2026-0412", dept: "HRD", shift: "Shift Pagi", in: "07:35 WIB", out: "15:00 WIB", dist: "8.5m", score: "98.1%", status: "APPROVED" },
                      { name: "Andi Saputra", nik: "2026-0775", dept: "Finance", shift: "Shift Pagi", in: "07:58 WIB", out: "15:15 WIB", dist: "24.1m", score: "93.7%", status: "APPROVED" },
                      { name: "Dewi Lestari", nik: "2026-0219", dept: "Marketing", shift: "Shift Pagi", in: "08:04 WIB", out: "--:--", dist: "18.9m", score: "95.2%", status: "TERLAMBAT" },
                      { name: "Rian Hidayat", nik: "2026-0155", dept: "Operasional", shift: "Shift Pagi", in: "07:29 WIB", out: "15:01 WIB", dist: "12.0m", score: "97.5%", status: "APPROVED" },
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-emerald-500/5">
                        <td className="py-3 font-bold text-white">{r.name}</td>
                        <td className="py-3 text-emerald-300/80">{r.dept}</td>
                        <td className="py-3 text-emerald-200">{r.shift}</td>
                        <td className="py-3 font-mono text-emerald-100">{r.in}</td>
                        <td className="py-3 font-mono text-emerald-300/60">{r.out}</td>
                        <td className="py-3 font-mono">{r.dist}</td>
                        <td className="py-3 font-mono text-emerald-300 font-bold">{r.score}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === "APPROVED"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/20 text-amber-300"
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
                  <p className="text-xs text-emerald-300/60">Tentukan jam masuk, jam pulang, dan batas toleransi</p>
                </div>
                <button
                  onClick={() => alert("Form Tambah Shift Dinamis")}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Tambah Shift Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {shifts.map((s) => (
                  <div key={s.id} className="bg-[#06241a] p-6 rounded-2xl border border-emerald-500/20 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {s.status}
                        </span>
                        <span className="text-xs text-emerald-300/60">{s.activeStaff} Anggota</span>
                      </div>
                      <h4 className="font-bold text-white text-base mb-2">{s.name}</h4>
                      <div className="bg-[#03150f] p-3 rounded-xl border border-emerald-500/15 text-center my-3">
                        <span className="font-mono text-xl font-extrabold text-emerald-300">
                          {s.startTime} - {s.endTime}
                        </span>
                      </div>
                      <div className="text-xs space-y-1.5 text-emerald-200">
                        <div className="flex justify-between">
                          <span className="text-emerald-300/60">Toleransi Terlambat:</span>
                          <span className="font-semibold text-white">{s.tolerance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-300/60">Jendela Dibuka:</span>
                          <span className="font-semibold text-white">{s.openBefore} Sebelum</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-5 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-semibold">
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
            <div className="bg-[#06241a] rounded-2xl p-6 border border-emerald-500/20 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-base">Direktori Karyawan & Master Biometrik Wajah</h3>
                <button className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400">
                  + Daftarkan Karyawan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {[
                  { name: "Budi Pratama", nik: "2026-0891", dept: "IT Operations", role: "Sr. Software Eng", face: "Terdaftar (Embedding Valid)" },
                  { name: "Siti Rahmawati", nik: "2026-0412", dept: "HR & People", role: "HR Specialist", face: "Terdaftar (Embedding Valid)" },
                  { name: "Andi Saputra", nik: "2026-0775", dept: "Finance", role: "Finance Officer", face: "Terdaftar (Embedding Valid)" },
                ].map((k, idx) => (
                  <div key={idx} className="bg-[#03150f] p-4 rounded-xl border border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-white text-sm ring-2 ring-emerald-400/40">
                        {k.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">{k.name}</span>
                        <span className="text-[10px] text-emerald-300/60 font-mono">NIK: {k.nik}</span>
                      </div>
                    </div>
                    <div className="text-xs text-emerald-200/80 pt-2 border-t border-emerald-500/10">
                      <div>Departemen: <span className="text-white font-semibold">{k.dept}</span></div>
                      <div>Jabatan: <span className="text-white font-semibold">{k.role}</span></div>
                      <div className="text-[10px] text-emerald-400 mt-1">✓ {k.face}</div>
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
            <div className="max-w-2xl bg-[#06241a] rounded-2xl p-6 border border-emerald-500/20 space-y-5">
              <div>
                <h3 className="font-bold text-white text-base">Pengaturan Lokasi Kantor & Parameter Geofence</h3>
                <p className="text-xs text-emerald-300/60">Tentukan titik koordinat pusat kantor dan radius batas toleransi</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-emerald-300/80 block mb-1 font-semibold">Nama Lokasi Kantor</label>
                  <input
                    type="text"
                    defaultValue="Kantor Pusat - Sudirman Tower Lt. 12"
                    className="w-full bg-[#03150f] border border-emerald-500/25 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-emerald-300/80 block mb-1 font-semibold">Latitude</label>
                    <input
                      type="text"
                      defaultValue="-6.2088"
                      className="w-full bg-[#03150f] border border-emerald-500/25 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-emerald-300/80 block mb-1 font-semibold">Longitude</label>
                    <input
                      type="text"
                      defaultValue="106.8456"
                      className="w-full bg-[#03150f] border border-emerald-500/25 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-emerald-300/80 block mb-1 font-semibold">Radius Toleransi Geofence (Meter)</label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full bg-[#03150f] border border-emerald-500/25 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-emerald-300/80 block mb-1 font-semibold">Ambang Batas Skor AI Wajah (%)</label>
                    <input
                      type="number"
                      defaultValue="80"
                      className="w-full bg-[#03150f] border border-emerald-500/25 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <button className="w-full mt-4 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-all">
                  Simpan Konfigurasi Sistem
                </button>
              </div>
            </div>
          )}

          {/* Placeholder for other menus */}
          {!["dashboard", "absensi", "rekap-absensi", "jadwal-shift", "karyawan", "pengaturan"].includes(activeMenu) && (
            <div className="bg-[#06241a] rounded-2xl p-12 border border-emerald-500/20 text-center space-y-3">
              <div className="text-4xl">📂</div>
              <h3 className="font-bold text-white text-base capitalize">
                Modul {activeMenu.replace("-", " ")}
              </h3>
              <p className="text-xs text-emerald-300/60 max-w-sm mx-auto">
                Modul ini siap dikembangkan sesuai alur kerja yang sudah kita tentukan di PRD.
              </p>
              <button
                onClick={() => setActiveMenu("dashboard")}
                className="mt-2 text-xs text-emerald-400 underline font-semibold"
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
