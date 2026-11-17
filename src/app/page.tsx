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
  XCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  Smartphone,
  LayoutDashboard,
  Sliders,
  ChevronRight,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Building2,
  Lock,
} from "lucide-react";

export default function Home() {
  // Navigation State: 'employee' | 'admin' | 'shifts'
  const [activeTab, setActiveTab] = useState<"employee" | "admin" | "shifts">("employee");

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

  // Shift List State for Admin
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
      name: "Shift Malam (Teknis / Crossover)",
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
    <div className="min-h-screen bg-[#03150f] text-emerald-50 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#041a13]/85 border-b border-emerald-500/20 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-300/30">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-white">GeoFace Presence</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Auto-Approval
                </span>
              </div>
              <p className="text-xs text-emerald-300/60">PWA Presisi Geolokasi & Liveness Wajah</p>
            </div>
          </div>

          {/* Role Navigation Pills */}
          <div className="flex items-center p-1.5 bg-[#06241a] rounded-xl border border-emerald-500/25 shadow-inner">
            <button
              onClick={() => setActiveTab("employee")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "employee"
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/25 font-bold"
                  : "text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-500/10"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mode Karyawan (PWA)</span>
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "admin"
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/25 font-bold"
                  : "text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-500/10"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Monitoring HRD Live</span>
            </button>

            <button
              onClick={() => setActiveTab("shifts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "shifts"
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/25 font-bold"
                  : "text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-500/10"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Shift Dinamis</span>
            </button>
          </div>

          {/* Server NTP Time Indicator */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#06291e] border border-emerald-500/20 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300/70 font-mono">Server NTP:</span>
            <span className="font-mono font-bold text-emerald-200">{currentTime || "Memuat..."}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* ========================================================= */}
        {/* TAB 1: MODE KARYAWAN (MOBILE PWA SIMULATION)              */}
        {/* ========================================================= */}
        {activeTab === "employee" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Mobile Simulator Frame */}
            <div className="lg:col-span-5 mx-auto w-full max-w-sm">
              <div className="rounded-[36px] bg-gradient-to-b from-[#072c20] to-[#041912] p-4 border-2 border-emerald-500/30 shadow-2xl shadow-emerald-950/80 relative">
                {/* Simulated Speaker / Notch */}
                <div className="w-24 h-4 bg-[#03150f] rounded-full mx-auto mb-4 border border-emerald-500/20 flex items-center justify-center">
                  <div className="w-8 h-1 bg-emerald-500/40 rounded-full" />
                </div>

                {/* Profile Card Header */}
                <div className="bg-[#0b3829]/70 rounded-2xl p-4 border border-emerald-500/20 mb-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full ring-2 ring-emerald-400/60 overflow-hidden bg-emerald-900 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                      BP
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Budi Pratama</h3>
                      <p className="text-[11px] text-emerald-300/70">NIK: 2026-0891 • IT Ops</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-emerald-300 font-medium">Face Master Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Shift Indicator */}
                <div className="bg-[#082e21] rounded-xl p-3 border border-emerald-500/20 mb-4 text-xs flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-300/60 block font-semibold">
                      Shift Hari Ini
                    </span>
                    <span className="font-bold text-emerald-100">Shift Pagi (07:00 - 15:00)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[11px] border border-emerald-500/30 font-semibold">
                    Toleransi: 15m
                  </span>
                </div>

                {/* Geofence Status Widget */}
                <div className="bg-[#052218] rounded-xl p-3.5 border border-emerald-500/20 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>Validasi Geolokasi</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Geofence OK
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs mt-3">
                    <div className="bg-[#072c20] p-2 rounded-lg border border-emerald-500/15">
                      <span className="text-[10px] text-emerald-300/60 block">Jarak ke Kantor</span>
                      <span className="font-bold text-sm text-white font-mono">{distanceMeters} m</span>
                      <span className="text-[9px] text-emerald-400/80 block">(Maks: 50 m)</span>
                    </div>
                    <div className="bg-[#072c20] p-2 rounded-lg border border-emerald-500/15">
                      <span className="text-[10px] text-emerald-300/60 block">Akurasi GPS</span>
                      <span className="font-bold text-sm text-white font-mono">± 3.8 m</span>
                      <span className="text-[9px] text-emerald-400/80 block">(High Accuracy)</span>
                    </div>
                  </div>
                </div>

                {/* Camera & Liveness Scanner Preview */}
                <div className="relative rounded-2xl bg-[#03150f] border-2 border-emerald-500/40 p-4 mb-4 text-center overflow-hidden">
                  {/* Subtle Grid Scanning Effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                  {/* Oval Frame */}
                  <div
                    className={`relative mx-auto w-36 h-48 rounded-[50%] border-2 transition-all flex flex-col items-center justify-center p-2 ${
                      livenessPassed
                        ? "border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/25"
                        : "border-dashed border-emerald-500/50 hover:border-emerald-400"
                    }`}
                  >
                    <Camera className="w-8 h-8 text-emerald-400/60 mb-2" />
                    <span className="text-[10px] text-emerald-200/80 font-medium">
                      {livenessPassed ? "Wajah Terdeteksi!" : "Posisikan Wajah"}
                    </span>
                    {livenessPassed && (
                      <span className="text-[11px] font-bold text-emerald-300 font-mono mt-1">
                        AI: {faceScore}%
                      </span>
                    )}
                  </div>

                  {/* Liveness Challenge Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => setLivenessPassed(!livenessPassed)}
                      className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium transition-all ${
                        livenessPassed
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                          : "bg-emerald-500 text-black border-transparent font-bold hover:bg-emerald-400"
                      }`}
                    >
                      {livenessPassed ? "✓ Liveness Lolos (Kedip Terdeteksi)" : "Mulai Uji Liveness (Kedipkan Mata)"}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                {attendanceState === "SUCCESS" ? (
                  <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-3.5 text-center mb-3">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-bold text-sm mb-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>APPROVED (Otomatis Hadir)</span>
                    </div>
                    <p className="text-[11px] text-emerald-200/80">
                      Tercatat Server: {currentTime} • Tepat Waktu
                    </p>
                    <button
                      onClick={() => {
                        setAttendanceState("IDLE");
                        setLivenessPassed(false);
                      }}
                      className="text-[10px] text-emerald-400 underline mt-2"
                    >
                      Reset Simulasi
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={isCapturing}
                    onClick={handleCheckIn}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCapturing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Memverifikasi Wajah...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>KIRIM ABSENSI MASUK</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right: Technical Explanation & Auto-Approval Specs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Feature Highlights Card */}
              <div className="bg-gradient-to-br from-[#072f22] to-[#041a13] p-6 rounded-3xl border border-emerald-500/25 shadow-xl">
                <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Sistem Otomatisasi Absensi</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-3">
                  Persetujuan Seketika (Tanpa Beban Approval HRD)
                </h2>
                <p className="text-sm text-emerald-200/70 leading-relaxed mb-6">
                  Sesuai revisi PRD terbaru, sistem memvalidasi koordinat kantor, uji liveness gerakan, dan kemiripan biometrik secara bersamaan di backend. Jika semua valid, kehadiran langsung sah berstatus <strong className="text-emerald-300">APPROVED</strong> dalam 2 detik.
                </p>

                {/* 3 Metric Verification Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#052219] p-4 rounded-2xl border border-emerald-500/20">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-emerald-300/60 block">1. Geofence Kantor</span>
                    <span className="font-bold text-white text-sm">Radius ≤ 50m</span>
                    <p className="text-[10px] text-emerald-400 mt-1">✓ Haversine Check</p>
                  </div>

                  <div className="bg-[#052219] p-4 rounded-2xl border border-emerald-500/20">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-emerald-300/60 block">2. Uji Liveness</span>
                    <span className="font-bold text-white text-sm">Kedip / Gerak Acak</span>
                    <p className="text-[10px] text-emerald-400 mt-1">✓ Anti-Photo Attack</p>
                  </div>

                  <div className="bg-[#052219] p-4 rounded-2xl border border-emerald-500/20">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-emerald-300/60 block">3. Kecocokan Wajah</span>
                    <span className="font-bold text-white text-sm">Skor AI ≥ 80%</span>
                    <p className="text-[10px] text-emerald-400 mt-1">✓ 1:1 Face Match</p>
                  </div>
                </div>
              </div>

              {/* Attendance Log Table for Employee */}
              <div className="bg-[#052218] rounded-3xl p-6 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-base">Riwayat Kehadiran Karyawan (5 Hari Terakhir)</h3>
                  <span className="text-xs text-emerald-400 hover:underline cursor-pointer">Lihat Semua</span>
                </div>

                <div className="space-y-3">
                  {[
                    { day: "Hari Ini (Selasa)", time: "07:42 WIB", status: "APPROVED", late: false, score: "96.4%" },
                    { day: "Senin, 16 Nov", time: "07:38 WIB", status: "APPROVED", late: false, score: "97.1%" },
                    { day: "Jumat, 13 Nov", time: "08:02 WIB", status: "APPROVED", late: true, score: "95.0%" },
                    { day: "Kamis, 12 Nov", time: "07:45 WIB", status: "APPROVED", late: false, score: "96.8%" },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#072e21] border border-emerald-500/15 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{row.day}</span>
                          <span className="text-emerald-300/60 text-[11px]">Jam Masuk: {row.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-300/80 font-mono text-[11px]">AI: {row.score}</span>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                            row.late
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          }`}
                        >
                          {row.late ? "Terlambat 2m" : "APPROVED (Auto)"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DASHBOARD MONITORING HRD (EXECUTIVE VIEW)           */}
        {/* ========================================================= */}
        {activeTab === "admin" && (
          <div className="space-y-8">
            {/* Top Stat KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-[#083627] to-[#041d15] p-5 rounded-2xl border border-emerald-500/25 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-emerald-300/70">Total Karyawan</span>
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">120</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>3 Divisi Operasional Terjadwal</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-[#083627] to-[#041d15] p-5 rounded-2xl border border-emerald-500/25 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-emerald-300/70">Hadir Hari Ini (Auto)</span>
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-extrabold text-emerald-300 font-mono">108</div>
                  <span className="text-xs text-emerald-300/70 font-semibold">(90%)</span>
                </div>
                <div className="text-[11px] text-emerald-400 mt-2">
                  ✓ 102 Tepat Waktu • 6 Terlambat
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-[#083627] to-[#041d15] p-5 rounded-2xl border border-emerald-500/25 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-emerald-300/70">Rata-rata Skor AI Wajah</span>
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">95.8%</div>
                <div className="text-[11px] text-emerald-400 mt-2">
                  ✓ Akurasi Biometrik Tinggi (Threshold: 80%)
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-gradient-to-br from-[#083627] to-[#041d15] p-5 rounded-2xl border border-emerald-500/25 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-emerald-300/70">Belum Hadir / Izin</span>
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-amber-200 font-mono">12</div>
                <div className="text-[11px] text-amber-400/80 mt-2">
                  • 8 Belum Masuk Jam Shift • 4 Izin Khusus
                </div>
              </div>
            </div>

            {/* Visual Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly Attendance Bar Chart */}
              <div className="lg:col-span-8 bg-[#052218] p-6 rounded-3xl border border-emerald-500/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-base">Grafik Tren Kehadiran Mingguan</h3>
                    <p className="text-xs text-emerald-300/60">Persentase kehadiran karyawan per hari</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/20">
                    Rata-rata: 93.8%
                  </span>
                </div>

                {/* Simulated Visual Bar Chart */}
                <div className="grid grid-cols-6 gap-4 h-48 items-end pt-4 px-2">
                  {[
                    { day: "Senin", rate: 96, count: "115/120" },
                    { day: "Selasa", rate: 90, count: "108/120" },
                    { day: "Rabu", rate: 94, count: "113/120" },
                    { day: "Kamis", rate: 98, count: "118/120" },
                    { day: "Jumat", rate: 92, count: "110/120" },
                    { day: "Sabtu", rate: 85, count: "102/120" },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-emerald-300">
                        {bar.rate}%
                      </div>
                      <div
                        style={{ height: `${bar.rate}%` }}
                        className="w-full rounded-xl bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20 group-hover:brightness-125 transition-all"
                      />
                      <span className="text-xs font-semibold text-emerald-200">{bar.day}</span>
                      <span className="text-[10px] text-emerald-300/50 font-mono">{bar.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geofence & Shift Compliance Radial Card */}
              <div className="lg:col-span-4 bg-[#052218] p-6 rounded-3xl border border-emerald-500/20 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Kepatuhan Geofence</h3>
                  <p className="text-xs text-emerald-300/60 mb-6">Distribusi jarak absensi terhadap radius kantor (50m)</p>

                  <div className="relative w-36 h-36 mx-auto rounded-full border-8 border-emerald-500/20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-8 border-emerald-400 border-t-transparent -rotate-45" />
                    <div className="text-center">
                      <span className="text-2xl font-extrabold text-white font-mono block">99.2%</span>
                      <span className="text-[10px] text-emerald-300/70 uppercase">Dalam Radius</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-6 text-xs">
                  <div className="flex justify-between text-emerald-200">
                    <span>Radius &lt; 20 meter</span>
                    <span className="font-mono font-bold text-emerald-400">84% (91 Karyawan)</span>
                  </div>
                  <div className="flex justify-between text-emerald-200">
                    <span>Radius 20 - 45 meter</span>
                    <span className="font-mono font-bold text-emerald-400">15.2% (17 Karyawan)</span>
                  </div>
                  <div className="flex justify-between text-emerald-300/60">
                    <span>Di Luar Radius (Ditolak)</span>
                    <span className="font-mono font-bold text-red-400">0.8% (1 Karyawan)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Real-time Attendance Feed Table */}
            <div className="bg-[#052218] rounded-3xl p-6 border border-emerald-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-white text-base">Live Feed Kehadiran Hari Ini (Auto-Approved)</h3>
                  <p className="text-xs text-emerald-300/60">
                    Data kehadiran yang otomatis tervalidasi dan disahkan oleh sistem
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                    108 Catatan Tersimpan
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-500/20 text-emerald-300/60 text-[11px] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Karyawan</th>
                      <th className="pb-3 font-semibold">Shift Kerja</th>
                      <th className="pb-3 font-semibold">Jam Absen Server</th>
                      <th className="pb-3 font-semibold">Jarak Kantor</th>
                      <th className="pb-3 font-semibold">Skor AI Biometrik</th>
                      <th className="pb-3 font-semibold">Status Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10">
                    {[
                      { name: "Budi Pratama", nik: "2026-0891", shift: "Shift Pagi", time: "07:42:15 WIB", dist: "14.2 m", score: 96.4, late: false },
                      { name: "Siti Rahmawati", nik: "2026-0412", shift: "Shift Pagi", time: "07:35:48 WIB", dist: "8.5 m", score: 98.1, late: false },
                      { name: "Andi Saputra", nik: "2026-0775", shift: "Shift Pagi", time: "07:58:22 WIB", dist: "24.1 m", score: 93.7, late: false },
                      { name: "Dewi Lestari", nik: "2026-0219", shift: "Shift Pagi", time: "08:04:10 WIB", dist: "18.9 m", score: 95.2, late: true },
                      { name: "Rizky Firmansyah", nik: "2026-0633", shift: "Shift Pagi", time: "07:49:03 WIB", dist: "11.0 m", score: 97.4, late: false },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-emerald-500/5 transition-colors">
                        <td className="py-3.5 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-400/40 flex items-center justify-center font-bold text-white text-xs">
                            {row.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{row.name}</span>
                            <span className="text-[10px] text-emerald-300/60 font-mono">NIK: {row.nik}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-emerald-200">{row.shift}</td>
                        <td className="py-3.5 font-mono text-emerald-100">{row.time}</td>
                        <td className="py-3.5 font-mono text-emerald-300 font-semibold">{row.dist}</td>
                        <td className="py-3.5">
                          <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {row.score}%
                          </span>
                        </td>
                        <td className="py-3.5">
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

        {/* ========================================================= */}
        {/* TAB 3: MANAJEMEN SHIFT DINAMIS (ADMIN MANAGEMENT)         */}
        {/* ========================================================= */}
        {activeTab === "shifts" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Konfigurasi Shift Kerja Dinamis</h2>
                <p className="text-sm text-emerald-300/60">
                  Tentukan jam masuk, jam pulang, dan toleransi keterlambatan sesuai kebutuhan operasional kantor
                </p>
              </div>
              <button
                onClick={() => alert("Fitur Tambah Shift Baru!")}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs tracking-wide hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <span>+ Buat Shift Baru</span>
              </button>
            </div>

            {/* Shift Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="bg-gradient-to-br from-[#072f22] to-[#041a13] p-6 rounded-3xl border border-emerald-500/25 shadow-lg relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                        {shift.status}
                      </span>
                      <span className="text-xs text-emerald-300/70 font-mono">
                        {shift.activeStaff} Karyawan
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{shift.name}</h3>

                    {/* Shift Time Badge */}
                    <div className="bg-[#03150f] p-4 rounded-2xl border border-emerald-500/20 mb-4 text-center">
                      <span className="text-[10px] text-emerald-300/60 uppercase block mb-1">Jam Kerja</span>
                      <span className="font-mono text-2xl font-black text-emerald-300">
                        {shift.startTime} - {shift.endTime}
                      </span>
                    </div>

                    {/* Parameters */}
                    <div className="space-y-2 text-xs text-emerald-200">
                      <div className="flex justify-between py-1 border-b border-emerald-500/10">
                        <span className="text-emerald-300/60">Toleransi Terlambat:</span>
                        <span className="font-semibold text-white">{shift.tolerance}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-500/10">
                        <span className="text-emerald-300/60">Jendela Absen Dibuka:</span>
                        <span className="font-semibold text-white">{shift.openBefore} Sebelum</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between">
                    <button className="text-xs text-emerald-400 font-semibold hover:underline">
                      Edit Parameter
                    </button>
                    <button className="text-xs text-emerald-300/60 hover:text-white">
                      Lihat Jadwal Anggota →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-emerald-500/15 py-6 text-center text-xs text-emerald-400/50 mt-12">
        <p>GeoFace Presence System • Progressive Web App (PWA) • Powered by Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
}
