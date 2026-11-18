"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Video,
  VideoOff,
  ShieldAlert,
  ScanFace,
  LocateFixed,
} from "lucide-react";
import { ServerClock } from "@/hooks/useClock";

export default function AbsensiView() {
  const {
    antiSpoofScore,
    attendanceState,
    calculateHaversineDistance,
    challengeDefinitions,
    challengeStepStatus,
    currentActiveEmployee,
    currentChallengeIndex,
    detectedDeviceModel,
    employees,
    getDirectSuperior,
    handleCheckIn,
    handlePassCurrentChallenge,
    isCapturing,
    isMobileSimulated,
    isOutOfGeofenceRadius,
    isSuspiciousFakeGps,
    isWebcamActive,
    isWithinGeofence,
    livenessChallengeSequence,
    livenessPassed,
    setActiveMenu,
    setAttendanceState,
    setEmployees,
    setLivenessPassed,
    setSimulatedDistance,
    settings,
    showToast,
    simulatedDeviceId,
    simulatedDistance,
    simulatedFaceScore,
    spoofAlertDetails,
    startLevel4Liveness,
    stopWebcam,
    toggleWebcam,
    videoRef,
  } = useApp();

  const [employeeCoords, setEmployeeCoords] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const [isDetectingUserGps, setIsDetectingUserGps] = useState<boolean>(false);
  const [showOfficeMap, setShowOfficeMap] = useState<boolean>(false);

  const handleDetectEmployeeGps = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      showToast("Browser Anda tidak mendukung fitur Geolocation GPS!", "error");
      return;
    }
    setIsDetectingUserGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const acc = Math.round(pos.coords.accuracy || 0);
        const dist = calculateHaversineDistance(
          lat,
          lng,
          settings.latitude,
          settings.longitude
        );
        setEmployeeCoords({ lat, lng, accuracy: acc });
        setSimulatedDistance(dist);
        setIsDetectingUserGps(false);

        const minSafe = settings.minSafeDistance ?? 2;
        if (dist <= minSafe) {
          showToast(
            `🚨 Terdeteksi jarak mencurigakan (${dist.toFixed(1)}m ≤ ${minSafe}m). Indikasi Fake GPS!`,
            "error"
          );
        } else if (dist > settings.geofenceRadius) {
          showToast(
            `❌ Lokasi Anda berjarak ${dist.toFixed(1)}m (melebihi radius kantor ${settings.geofenceRadius}m).`,
            "error"
          );
        } else {
          showToast(
            `✓ Lokasi GPS valid! Jarak Anda ${dist.toFixed(1)}m dari titik kantor.`,
            "success"
          );
        }
      },
      (err) => {
        setIsDetectingUserGps(false);
        console.warn("Employee GPS error:", err);
        showToast(
          "Gagal membaca GPS perangkat. Pastikan izin lokasi (Location Permission) di browser Anda sudah diaktifkan.",
          "error"
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Otomatis deteksi GPS perangkat asli saat halaman Absensi dibuka
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          const acc = Math.round(pos.coords.accuracy || 0);
          const dist = calculateHaversineDistance(
            lat,
            lng,
            settings.latitude,
            settings.longitude
          );
          setEmployeeCoords({ lat, lng, accuracy: acc });
          setSimulatedDistance(dist);
        },
        () => {
          // Pengguna dapat menekan tombol "📍 Cek GPS Saya" secara manual
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.latitude, settings.longitude]);

  // Lifecycle Cleanup: Menjamin seluruh MediaStream tracks kamera fisik hanya dihentikan saat AbsensiView benar-benar unmount
  const stopWebcamRef = useRef(stopWebcam);
  useEffect(() => {
    stopWebcamRef.current = stopWebcam;
  });
  useEffect(() => {
    return () => {
      stopWebcamRef.current();
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6">
              {/* Info Banner: Absensi Mandiri di HP Masing-Masing */}
              <div className="bg-gradient-to-r from-[#062417] via-[#041a10] to-[#021008] rounded-2xl p-4 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40 flex items-center justify-center text-xl flex-shrink-0">
                    📱
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">
                        ABSENSI MANDIRI (SELF-SERVICE HP)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Akun Anda
                      </span>
                    </div>
                    <h4 className="font-extrabold text-white text-sm">
                      {currentActiveEmployee.name}
                    </h4>
                    <p className="text-[11px] text-white/70">
                      {currentActiveEmployee.role} • Dept: <span className="text-emerald-400 font-bold">{currentActiveEmployee.dept}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendance Card untuk currentActiveEmployee */}
              <div className="rounded-3xl bg-gradient-to-b from-[#072a1b] via-[#03150d] to-[#010a06] p-6 border border-emerald-500/30 shadow-2xl relative">
                <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full ring-2 ring-emerald-400 bg-emerald-950 flex items-center justify-center font-black text-white text-base overflow-hidden shrink-0">
                      {currentActiveEmployee.photoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={currentActiveEmployee.photoUrl}
                          alt={currentActiveEmployee.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        currentActiveEmployee.avatar
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{currentActiveEmployee.name}</h3>
                      <p className="text-[11px] text-white/80">No. KTP: {currentActiveEmployee.nik} • {currentActiveEmployee.role}</p>
                      <span className="text-[10px] font-bold text-emerald-400">
                        Dept: {currentActiveEmployee.dept} • Atasan: {getDirectSuperior(currentActiveEmployee)?.name || "Direksi"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      isSuspiciousFakeGps
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                        : isWithinGeofence
                        ? "bg-emerald-500/20 text-white border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/40"
                    }`}
                  >
                    {isSuspiciousFakeGps
                      ? `🚨 Fake GPS (${simulatedDistance.toFixed(1)}m)`
                      : isWithinGeofence
                      ? `✓ Geofence OK (${simulatedDistance.toFixed(1)}m)`
                      : `❌ Di Luar Area (${simulatedDistance.toFixed(1)}m)`}
                  </span>
                </div>

                {/* Panel Validasi Titik Koordinat Kantor, Geofence & Pengaman Anti-Fake GPS */}
                <div className="bg-[#010804] rounded-2xl p-4 border border-emerald-900/60 mb-4 space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-white/70 block">
                          Jarak ke Titik Koordinat Kantor ({settings.latitude.toFixed(4)}, {settings.longitude.toFixed(4)})
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-sm ${
                              isSuspiciousFakeGps
                                ? "text-amber-300"
                                : isWithinGeofence
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {simulatedDistance.toFixed(1)} Meter
                          </span>
                          <span className="text-[10px] text-white/50">
                            (Rentang Aman: &gt; {settings.minSafeDistance ?? 2}m s/d {settings.geofenceRadius}m)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isDetectingUserGps}
                        onClick={handleDetectEmployeeGps}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 text-[11px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                        title="Perbarui posisi GPS perangkat Anda saat ini"
                      >
                        <LocateFixed className={`w-3.5 h-3.5 ${isDetectingUserGps ? "animate-spin" : ""}`} />
                        <span>{isDetectingUserGps ? "Mendeteksi..." : "📍 Perbarui GPS"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowOfficeMap((prev) => !prev)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#021008] hover:bg-emerald-950 text-white/80 hover:text-white border border-emerald-900/60 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        {showOfficeMap ? "Tutup Peta" : "🗺️ Peta Kantor"}
                      </button>
                    </div>
                  </div>

                  {employeeCoords && (
                    <div className="text-[10px] font-mono text-white/60 bg-[#021008] px-3 py-1.5 rounded-xl border border-emerald-900/40 flex flex-wrap items-center justify-between gap-2">
                      <span>
                        Posisi GPS Anda: <strong className="text-white">{employeeCoords.lat}, {employeeCoords.lng}</strong>
                      </span>
                      {employeeCoords.accuracy !== undefined && (
                        <span>Akurasi Sensor: ±{employeeCoords.accuracy}m</span>
                      )}
                    </div>
                  )}

                  {showOfficeMap && (
                    <div className="rounded-xl overflow-hidden border border-emerald-800/70 h-44 bg-[#021008]">
                      <iframe
                        title="Peta Titik Kantor Absensi"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${settings.latitude},${settings.longitude}&z=18&output=embed`}
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}

                  {/* Peringatan Anti-Fake GPS atau Luar Radius */}
                  {isSuspiciousFakeGps && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/50 text-xs text-amber-200 flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-amber-300 block">
                          🚨 TERDETEKSI INDIKASI FAKE GPS / LOKASI MENCURIGAKAN ({simulatedDistance.toFixed(1)}m)
                        </span>
                        <span className="text-[11px] text-amber-200/80">
                          Jarak terlalu dekat/identik dengan titik koordinat kantor (&le; {settings.minSafeDistance ?? 2}m). Sistem menolak absensi untuk mencegah manipulasi Mock Location / Fake GPS.
                        </span>
                      </div>
                    </div>
                  )}

                  {isOutOfGeofenceRadius && (
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/50 text-xs text-red-200 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-red-300 block">
                          ❌ DI LUAR RADIUS GEOFENCE KANTOR ({simulatedDistance.toFixed(1)}m &gt; {settings.geofenceRadius}m)
                        </span>
                        <span className="text-[11px] text-red-200/80">
                          Anda berada di luar batas radius maksimal kantor ({settings.geofenceRadius} meter). Silakan mendekat ke area kantor untuk melakukan absensi.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🛡️ LEVEL 4 BIOMETRIC AI SCANNER & ANTI-SPOOFING ENGINE */}
                <div className="relative rounded-3xl bg-gradient-to-b from-[#02130b] to-[#010804] border border-emerald-500/40 p-5 overflow-hidden mb-5 shadow-2xl">
                  {/* Cyberpunk Biometric Background Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:18px_18px] opacity-15" />

                  {/* Header Biometrik */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-900/60">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                        <ScanFace className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">
                            Level 4 AI Biometric Liveness
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-black">
                            ANTI-SPOOFING
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400/80">
                          3D Parallax Depth • Anti-Foto Statis 2D • Anti-Replay Layar HP
                        </span>
                      </div>
                    </div>

                    {/* Toggle Webcam Fisik vs Simulator */}
                    <button
                      onClick={toggleWebcam}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isWebcamActive
                          ? "bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                          : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                      }`}
                    >
                      {isWebcamActive ? (
                        <>
                          <VideoOff className="w-3.5 h-3.5" />
                          <span>Tutup Kamera</span>
                        </>
                      ) : (
                        <>
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Buka Kamera Fisik</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Oval Camera Viewport & HUD */}
                  <div className="relative z-10 my-4 text-center">
                    <div
                      className={`relative mx-auto w-44 h-56 rounded-[50%] border-2 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center shadow-2xl ${
                        challengeStepStatus === "spoof_detected"
                          ? "border-red-500 bg-red-950/40 shadow-red-500/30 animate-pulse ring-4 ring-red-500/20"
                          : livenessPassed
                          ? "border-emerald-400 bg-emerald-500/10 shadow-emerald-500/30 ring-4 ring-emerald-500/20"
                          : "border-emerald-500/50 bg-[#010a05] ring-1 ring-emerald-500/20"
                      }`}
                    >
                      {/* Live Video Feed (if webcam active) */}
                      <video
                        ref={videoRef}
                        playsInline
                        autoPlay
                        muted
                        className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
                          isWebcamActive ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      />

                      {/* Laser Scanning Animation (HUD) */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce opacity-70" />

                      {/* Facial Mesh Wireframe Overlay */}
                      <div
                        className={`relative z-10 flex flex-col items-center p-3 w-full h-full ${
                          isWebcamActive && !livenessPassed && challengeStepStatus !== "spoof_detected"
                            ? "justify-end pb-3 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                            : "justify-center"
                        }`}
                      >
                        {challengeStepStatus === "spoof_detected" ? (
                          <div className="space-y-1">
                            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
                            <span className="text-[11px] font-black text-red-300 uppercase tracking-wider block">
                              FRAUD BLOCKED
                            </span>
                            <span className="text-[9px] text-red-200/80 font-mono block">
                              Skor: {antiSpoofScore}% (Ditolak)
                            </span>
                          </div>
                        ) : livenessPassed ? (
                          <div className="space-y-1">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                            <span className="text-xs font-black text-white block">
                              Wajah Terverifikasi!
                            </span>
                            <span className="text-[10px] font-mono text-emerald-300 block font-bold">
                              AI Match: {simulatedFaceScore}%
                            </span>
                            <span className="text-[9px] font-mono text-teal-300 block">
                              Anti-Spoof: {antiSpoofScore}%
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <span className="text-3xl block filter drop-shadow">
                              {challengeDefinitions[livenessChallengeSequence[currentChallengeIndex]]?.icon || "👁️"}
                            </span>
                            <span className="text-[11px] font-bold text-white block leading-tight px-2">
                              {challengeDefinitions[livenessChallengeSequence[currentChallengeIndex]]?.title}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400/90 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 inline-block">
                              Tantangan {currentChallengeIndex + 1}/3
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Corner Biometric Crosshairs */}
                      <div className="absolute top-2 left-6 w-2 h-2 border-t-2 border-l-2 border-emerald-400/80" />
                      <div className="absolute top-2 right-6 w-2 h-2 border-t-2 border-r-2 border-emerald-400/80" />
                      <div className="absolute bottom-2 left-6 w-2 h-2 border-b-2 border-l-2 border-emerald-400/80" />
                      <div className="absolute bottom-2 right-6 w-2 h-2 border-b-2 border-r-2 border-emerald-400/80" />
                    </div>
                  </div>

                  {/* Multi-Challenge Steps Tracker (3 Tahapan Acak) */}
                  <div className="relative z-10 bg-[#010804] border border-emerald-900/60 rounded-2xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <span>Urutan Verifikasi Dinamis</span>
                        <span className="text-[9px] text-emerald-400/70 font-mono">(Anti-Video Rekaman)</span>
                      </span>
                      <button
                        onClick={startLevel4Liveness}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 underline"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Acak Ulang Urutan</span>
                      </button>
                    </div>

                    {/* Step Cards 1, 2, 3 */}
                    <div className="grid grid-cols-3 gap-2">
                      {livenessChallengeSequence.map((cType, idx) => {
                        const def = challengeDefinitions[cType];
                        const isDone = livenessPassed || idx < currentChallengeIndex;
                        const isCurrent = !livenessPassed && idx === currentChallengeIndex && challengeStepStatus !== "spoof_detected";
                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded-xl border text-center transition-all ${
                              isDone
                                ? "bg-emerald-500/20 border-emerald-500/50 text-white"
                                : isCurrent
                                ? "bg-amber-500/20 border-amber-500/60 text-amber-200 ring-2 ring-amber-500/30"
                                : "bg-white/5 border-white/10 text-white/40"
                            }`}
                          >
                            <div className="text-sm mb-0.5">{isDone ? "✅" : def.icon}</div>
                            <span className="text-[10px] font-bold block leading-tight truncate">
                              {def.title.replace("Uji ", "")}
                            </span>
                            <span className="text-[8px] font-mono opacity-70 block">
                              Step {idx + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Instruction Box for Current Step */}
                    {!livenessPassed && challengeStepStatus !== "spoof_detected" && (
                      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2.5">
                        <span className="text-xl">
                          {challengeDefinitions[livenessChallengeSequence[currentChallengeIndex]]?.icon}
                        </span>
                        <div className="flex-1 text-left">
                          <p className="text-xs font-bold text-emerald-300">
                            {challengeDefinitions[livenessChallengeSequence[currentChallengeIndex]]?.instruction}
                          </p>
                          <p className="text-[10px] text-white/60 mt-0.5 font-mono">
                            {challengeDefinitions[livenessChallengeSequence[currentChallengeIndex]]?.detail}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons to execute / simulate step */}
                    <div className="pt-1 flex flex-col sm:flex-row gap-2">
                      {!livenessPassed && challengeStepStatus !== "spoof_detected" ? (
                        <button
                          onClick={handlePassCurrentChallenge}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-black hover:brightness-110 active:scale-[0.98] shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4 text-black" />
                          <span>
                            {currentChallengeIndex < 2
                              ? `Verifikasi: ${challengeDefinitions[livenessChallengeSequence[currentChallengeIndex]]?.title} (Lanjut)`
                              : "Verifikasi Langkah Terakhir & Selesaikan"}
                          </span>
                        </button>
                      ) : livenessPassed ? (
                        <button
                          onClick={startLevel4Liveness}
                          className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Ulangi Verifikasi Liveness</span>
                        </button>
                      ) : (
                        <button
                          onClick={startLevel4Liveness}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className="w-4 h-4 text-black" />
                          <span>Atur Ulang & Scan Wajah Asli</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SPOOF FRAUD DETECTED BANNER */}
                  {spoofAlertDetails && (
                    <div className="relative z-10 mt-3 bg-red-950/60 border border-red-500/60 rounded-2xl p-4 space-y-3 animate-shake">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🚫</span>
                        <div>
                          <h5 className="text-xs font-black text-red-300 uppercase tracking-wider">
                            {spoofAlertDetails.title}
                          </h5>
                          <p className="text-[11px] text-red-200/80 mt-0.5">
                            {spoofAlertDetails.description}
                          </p>
                        </div>
                      </div>

                      {/* Forensic Metrics Breakdown */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-black/40 p-2.5 rounded-xl border border-red-500/30">
                        {spoofAlertDetails.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="space-y-0.5">
                            <span className="text-white/60 block">{m.name}:</span>
                            <span className="text-red-400 font-bold block">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {attendanceState === "SUCCESS" ? (
                  <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-2xl p-5 text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-white font-black text-base">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span>APPROVED (Otomatis Hadir Sah)</span>
                    </div>
                    <p className="text-xs text-white">
                      Jam Server: <strong><ServerClock /></strong> • Tepat Waktu • Jarak: {simulatedDistance.toFixed(1)}m
                    </p>
                    <div className="flex gap-2 justify-center pt-2">
                      <button
                        onClick={() => {
                          setAttendanceState("IDLE");
                          setLivenessPassed(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all"
                      >
                        Absen Ulang
                      </button>
                      <button
                        onClick={() => setActiveMenu("rekap-absensi")}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all"
                      >
                        Lihat di Rekap Absensi →
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* ─── DEVICE LOCK VALIDATION (REAL DEVICE FINGERPRINT) ─── */}
                    {(() => {
                      const empData = employees.find(e => e.id === currentActiveEmployee.id);
                      const isLegacySeedDevice = Boolean(
                        empData?.registeredDeviceId &&
                        !empData.registeredDeviceId.startsWith("DEV-HW-")
                      );
                      const isLaptop = !isMobileSimulated;
                      const isUnbound =
                        isMobileSimulated &&
                        (empData?.deviceStatus === "Unbound" || isLegacySeedDevice);
                      const isWrongDevice =
                        isMobileSimulated &&
                        !isLegacySeedDevice &&
                        empData?.deviceStatus === "Bound" &&
                        empData?.registeredDeviceId !== simulatedDeviceId;
                      const deviceOk =
                        isMobileSimulated &&
                        empData?.deviceStatus === "Bound" &&
                        empData?.registeredDeviceId === simulatedDeviceId;
                      return (
                        <div className="mb-3 space-y-2">
                          {isLaptop && (
                            <div className="bg-red-500/20 border border-red-500/60 rounded-xl p-4 flex items-start gap-3">
                              <span className="text-2xl">🚫</span>
                              <div>
                                <p className="text-red-400 font-bold text-sm">Absensi Hanya dari HP/Smartphone</p>
                                <p className="text-red-300/80 text-xs mt-1">Sistem mendeteksi perangkat Laptop/PC. Absensi mandiri hanya diizinkan melalui perangkat mobile untuk mencegah titip absen.</p>
                              </div>
                            </div>
                          )}
                          {isWrongDevice && (
                            <div className="bg-red-500/20 border border-red-500/60 rounded-xl p-4 flex items-start gap-3">
                              <span className="text-2xl">⚠️</span>
                              <div>
                                <p className="text-red-400 font-bold text-sm">Peringatan: Perangkat Tidak Dikenali!</p>
                                <p className="text-red-300/80 text-xs mt-1">Perangkat ini bukan perangkat resmi yang terdaftar pada akun Anda. Hubungi HRD jika Anda berganti perangkat.</p>
                                <p className="text-red-300/60 text-xs mt-1">Perangkat Terdaftar: <span className="font-semibold text-red-300">{empData?.deviceModel ?? "-"}</span></p>
                              </div>
                            </div>
                          )}
                          {isUnbound && (
                            <div className="bg-orange-500/20 border border-orange-500/60 rounded-xl p-4 flex items-start gap-3">
                              <span className="text-2xl">📱</span>
                              <div className="flex-1">
                                <p className="text-orange-400 font-bold text-sm">Perangkat Anda Belum Ditautkan</p>
                                <p className="text-orange-300/80 text-xs mt-1">
                                  Tautkan perangkat ini (<strong className="text-white">{detectedDeviceModel}</strong>) sebagai perangkat resmi absensi Anda.
                                </p>
                                <button
                                  onClick={() => {
                                    setEmployees(prev => prev.map(emp =>
                                      emp.id === currentActiveEmployee.id
                                        ? {
                                            ...emp,
                                            registeredDeviceId: simulatedDeviceId,
                                            deviceModel: detectedDeviceModel,
                                            deviceStatus: "Bound" as const,
                                          }
                                        : emp
                                    ));
                                    showToast(`✓ Perangkat "${detectedDeviceModel}" berhasil dikunci sebagai perangkat resmi Anda!`, "success");
                                  }}
                                  className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all cursor-pointer"
                                >
                                  🔗 Daftarkan Perangkat Ini sebagai Perangkat Resmi
                                </button>
                              </div>
                            </div>
                          )}
                          {deviceOk && (
                            <div className="bg-emerald-500/15 border border-emerald-500/50 rounded-xl p-3 flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                              <div>
                                <p className="text-emerald-400 font-semibold text-sm">Perangkat Terverifikasi</p>
                                <p className="text-emerald-300/70 text-xs">{empData?.deviceModel} — Perangkat Resmi Terdaftar ✓</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  <button
                    disabled={
                      isCapturing ||
                      !isWithinGeofence ||
                      !isMobileSimulated ||
                      challengeStepStatus === "spoof_detected" ||
                      !livenessPassed ||
                      (employees.find(e => e.id === currentActiveEmployee.id)?.deviceStatus === "Bound" && employees.find(e => e.id === currentActiveEmployee.id)?.registeredDeviceId !== simulatedDeviceId)
                    }
                    onClick={handleCheckIn}
                    className={`w-full py-4 rounded-xl font-black text-xs tracking-wider uppercase shadow-xl shadow-black transition-all flex items-center justify-center gap-2 ${
                      isWithinGeofence &&
                      isMobileSimulated &&
                      livenessPassed &&
                      challengeStepStatus !== "spoof_detected" &&
                      !(employees.find(e => e.id === currentActiveEmployee.id)?.deviceStatus === "Bound" && employees.find(e => e.id === currentActiveEmployee.id)?.registeredDeviceId !== simulatedDeviceId)
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black hover:brightness-110 active:scale-[0.98]"
                        : "bg-red-950/60 text-red-300 border border-red-500/40 cursor-not-allowed"
                    }`}
                  >
                    {isCapturing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Memvalidasi Data Biometrik & Jarak...</span>
                      </>
                    ) : challengeStepStatus === "spoof_detected" ? (
                      <>
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                        <span>TIDAK DAPAT ABSEN: TERDETEKSI KECURANGAN FOTO/SPOOFING</span>
                      </>
                    ) : !isMobileSimulated ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span>TIDAK DAPAT ABSEN: HARUS DARI HP/SMARTPHONE</span>
                      </>
                    ) : (employees.find(e => e.id === currentActiveEmployee.id)?.deviceStatus !== "Bound" || employees.find(e => e.id === currentActiveEmployee.id)?.registeredDeviceId !== simulatedDeviceId) ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span>
                          {employees.find(e => e.id === currentActiveEmployee.id)?.deviceStatus === "Unbound" ||
                          !employees.find(e => e.id === currentActiveEmployee.id)?.registeredDeviceId?.startsWith("DEV-HW-")
                            ? "TAUTKAN PERANGKAT RESMI ANDA TERLEBIH DAHULU"
                            : "TIDAK DAPAT ABSEN: PERANGKAT TIDAK DIKENALI"}
                        </span>
                      </>
                    ) : isSuspiciousFakeGps ? (
                      <>
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                        <span>
                          DITOLAK: TERDETEKSI FAKE GPS / JARAK MENCURIGAKAN ({simulatedDistance.toFixed(1)}m)
                        </span>
                      </>
                    ) : !isWithinGeofence ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span>
                          TIDAK DAPAT ABSEN: DI LUAR RADIUS KANTOR ({simulatedDistance.toFixed(1)}m &gt; {settings.geofenceRadius}m)
                        </span>
                      </>
                    ) : !livenessPassed ? (
                      <>
                        <ScanFace className="w-5 h-5 text-red-400" />
                        <span>LENGKAPI VERIFIKASI BIOMETRIK LEVEL 4 AI (3 TANTANGAN)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-black" />
                        <span>KIRIM ABSENSI MASUK (AUTO-APPROVED LEVEL 4 AI)</span>
                      </>
                    )}
                  </button>
                  </>
                )}
              </div>
            </div>
  );
}
