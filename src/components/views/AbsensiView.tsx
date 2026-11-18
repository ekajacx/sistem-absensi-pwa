"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  VideoOff,
  ShieldAlert,
  ScanFace,
  LocateFixed,
} from "lucide-react";

export default function AbsensiView() {
  const {
    calculateHaversineDistance,
    challengeDefinitions,
    challengeStepStatus,
    currentActiveEmployee,
    currentChallengeIndex,
    detectedDeviceModel,
    employees,
    getDirectSuperior,
    handlePassCurrentChallenge,
    handleStartAttendanceFlow,
    hasCheckedInToday,
    hasCheckedOutToday,
    isMobileSimulated,
    isOutOfGeofenceRadius,
    isSuspiciousFakeGps,
    isWebcamActive,
    isWithinGeofence,
    livenessChallengeSequence,
    livenessPassed,
    pendingAttendanceAction,
    setActiveMenu,
    setEmployees,
    setSimulatedDistance,
    settings,
    showToast,
    simulatedDeviceId,
    simulatedDistance,
    stopWebcam,
    todayAttendanceRecord,
    videoRef,
  } = useApp();

  const [employeeCoords, setEmployeeCoords] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const [isDetectingUserGps, setIsDetectingUserGps] = useState<boolean>(false);
  const [showOfficeMap, setShowOfficeMap] = useState<boolean>(false);
  const [autoStepProgress, setAutoStepProgress] = useState<number>(0);

  const passChallengeRef = useRef(handlePassCurrentChallenge);
  useEffect(() => {
    passChallengeRef.current = handlePassCurrentChallenge;
  });

  // Reset progress bar setiap berpindah langkah tantangan
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setAutoStepProgress(0);
  }, [currentChallengeIndex, isWebcamActive, livenessPassed]);

  // Deteksi Gerakan Wajah Otomatis (Real-Time WebRTC Frame Analyzer) tanpa perlu klik tombol manual
  useEffect(() => {
    if (
      !isWebcamActive ||
      livenessPassed ||
      challengeStepStatus === "spoof_detected" ||
      challengeStepStatus === "step_passed"
    ) {
      return;
    }

    const canvas = document.createElement("canvas");
    const width = 48;
    const height = 48;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let prevFrame: Uint8ClampedArray | null = null;
    let accumulated = 0;

    const intervalId = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !ctx) return;

      try {
        ctx.drawImage(video, 0, 0, width, height);
        const frameData = ctx.getImageData(0, 0, width, height).data;

        let totalLum = 0;
        let diffSum = 0;
        const pixelCount = width * height;

        for (let i = 0; i < frameData.length; i += 4) {
          const lum =
            0.299 * frameData[i] +
            0.587 * frameData[i + 1] +
            0.114 * frameData[i + 2];
          totalLum += lum;
          if (prevFrame) {
            const prevLum =
              0.299 * prevFrame[i] +
              0.587 * prevFrame[i + 1] +
              0.114 * prevFrame[i + 2];
            diffSum += Math.abs(lum - prevLum);
          }
        }

        const avgLum = totalLum / pixelCount;
        const avgDiff = prevFrame ? diffSum / pixelCount : 0;
        prevFrame = new Uint8ClampedArray(frameData);

        // Pastikan kamera tidak tertutup gelap (avgLum > 12) dan ada aktivitas mikro/gerakan wajah (avgDiff > 0.6)
        if (avgLum > 12) {
          const stepIncrement = avgDiff > 1.2 ? 28 : avgDiff > 0.4 ? 18 : 10;
          accumulated = Math.min(100, accumulated + stepIncrement);
          setAutoStepProgress(accumulated);

          if (accumulated >= 100) {
            window.clearInterval(intervalId);
            passChallengeRef.current();
          }
        }
      } catch {
        // Fallback jika canvas drawImage belum siap
      }
    }, 220);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    isWebcamActive,
    livenessPassed,
    challengeStepStatus,
    currentChallengeIndex,
    videoRef,
  ]);

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

                {/* ─── DEVICE LOCK VALIDATION (REAL DEVICE FINGERPRINT) ─── */}
                {(() => {
                  const empData = employees.find((e) => e.id === currentActiveEmployee.id);
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
                    <div className="mb-4 space-y-2">
                      {isLaptop && (
                        <div className="bg-red-500/20 border border-red-500/60 rounded-xl p-4 flex items-start gap-3">
                          <span className="text-2xl">🚫</span>
                          <div>
                            <p className="text-red-400 font-bold text-sm">Absensi Hanya dari HP/Smartphone</p>
                            <p className="text-red-300/80 text-xs mt-1">
                              Sistem mendeteksi perangkat Laptop/PC. Absensi mandiri hanya diizinkan melalui perangkat mobile untuk mencegah titip absen.
                            </p>
                          </div>
                        </div>
                      )}
                      {isWrongDevice && (
                        <div className="bg-red-500/20 border border-red-500/60 rounded-xl p-4 flex items-start gap-3">
                          <span className="text-2xl">⚠️</span>
                          <div>
                            <p className="text-red-400 font-bold text-sm">Peringatan: Perangkat Tidak Dikenali!</p>
                            <p className="text-red-300/80 text-xs mt-1">
                              Perangkat ini bukan perangkat resmi yang terdaftar pada akun Anda. Hubungi HRD jika Anda berganti perangkat.
                            </p>
                            <p className="text-red-300/60 text-xs mt-1">
                              Perangkat Terdaftar:{" "}
                              <span className="font-semibold text-red-300">{empData?.deviceModel ?? "-"}</span>
                            </p>
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
                                setEmployees((prev) =>
                                  prev.map((emp) =>
                                    emp.id === currentActiveEmployee.id
                                      ? {
                                          ...emp,
                                          registeredDeviceId: simulatedDeviceId,
                                          deviceModel: detectedDeviceModel,
                                          deviceStatus: "Bound" as const,
                                        }
                                      : emp
                                  )
                                );
                                showToast(
                                  `✓ Perangkat "${detectedDeviceModel}" berhasil dikunci sebagai perangkat resmi Anda!`,
                                  "success"
                                );
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
                            <p className="text-emerald-300/70 text-xs">
                              {empData?.deviceModel} — Perangkat Resmi Terdaftar ✓
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* ─── TOMBOL UTAMA: CHECK-IN & CHECK-OUT ─── */}
                {(() => {
                  const empData = employees.find((e) => e.id === currentActiveEmployee.id);
                  const deviceBoundOk =
                    isMobileSimulated &&
                    empData?.deviceStatus === "Bound" &&
                    empData?.registeredDeviceId === simulatedDeviceId;
                  const canTriggerAttendance = isWithinGeofence && deviceBoundOk;

                  const checkInActive = !hasCheckedInToday && canTriggerAttendance;
                  const checkOutActive = hasCheckedInToday && !hasCheckedOutToday && canTriggerAttendance;

                  return (
                    <div className="space-y-4 mb-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* TOMBOL 1: CHECK-IN (ABSEN MASUK) */}
                        <button
                          type="button"
                          disabled={!checkInActive}
                          onClick={() => handleStartAttendanceFlow("CHECK_IN")}
                          className={`py-4 px-4 rounded-2xl font-black text-xs tracking-wider uppercase transition-all flex flex-col items-center justify-center gap-1 border shadow-lg ${
                            checkInActive
                              ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black border-emerald-300 hover:brightness-110 active:scale-[0.98] cursor-pointer shadow-emerald-950/60"
                              : "bg-[#010804]/80 text-white/35 border-emerald-950/60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <span>📥</span>
                            <span>CHECK-IN (MASUK)</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold ${
                              checkInActive ? "text-black/80" : "text-emerald-400/60"
                            }`}
                          >
                            {hasCheckedInToday
                              ? `✓ Tercatat: ${todayAttendanceRecord?.in}`
                              : !deviceBoundOk
                              ? "Tautkan Perangkat Dulu"
                              : !isWithinGeofence
                              ? "Di Luar Radius Kantor"
                              : "Klik untuk Buka Kamera & Absen Masuk"}
                          </span>
                        </button>

                        {/* TOMBOL 2: CHECK-OUT (ABSEN PULANG) */}
                        <button
                          type="button"
                          disabled={!checkOutActive}
                          onClick={() => handleStartAttendanceFlow("CHECK_OUT")}
                          className={`py-4 px-4 rounded-2xl font-black text-xs tracking-wider uppercase transition-all flex flex-col items-center justify-center gap-1 border shadow-lg ${
                            checkOutActive
                              ? "bg-gradient-to-r from-amber-400 to-orange-400 text-black border-amber-300 hover:brightness-110 active:scale-[0.98] cursor-pointer shadow-amber-950/60"
                              : "bg-[#010804]/80 text-white/35 border-emerald-950/60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <span>📤</span>
                            <span>CHECK-OUT (PULANG)</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold ${
                              checkOutActive ? "text-black/80" : "text-amber-300/60"
                            }`}
                          >
                            {hasCheckedOutToday
                              ? `✓ Tercatat: ${todayAttendanceRecord?.out}`
                              : !hasCheckedInToday
                              ? "Menunggu Check-In Masuk"
                              : !deviceBoundOk
                              ? "Tautkan Perangkat Dulu"
                              : !isWithinGeofence
                              ? "Di Luar Radius Kantor"
                              : "Klik untuk Buka Kamera & Absen Pulang"}
                          </span>
                        </button>
                      </div>

                      {/* Ringkasan Status Kehadiran Hari Ini */}
                      {hasCheckedInToday && hasCheckedOutToday && (
                        <div className="bg-emerald-500/15 border border-emerald-400/50 rounded-2xl p-4 text-center space-y-2">
                          <div className="flex items-center justify-center gap-2 text-emerald-300 font-black text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span>ABSENSI HARI INI TELAH SELESAI</span>
                          </div>
                          <p className="text-xs text-white/80 font-mono">
                            Check-In Masuk: <strong className="text-emerald-300">{todayAttendanceRecord?.in}</strong> • Check-Out Pulang: <strong className="text-amber-300">{todayAttendanceRecord?.out}</strong>
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveMenu("rekap-absensi")}
                            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all cursor-pointer"
                          >
                            Lihat di Rekap Absensi →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 🛡️ PANEL KAMERA & VERIFIKASI WAJAH OTOMATIS (MUNCUL SAAT KLIK CHECK-IN / CHECK-OUT) */}
                {isWebcamActive && (
                  <div className="relative rounded-3xl bg-gradient-to-b from-[#02130b] to-[#010804] border border-emerald-500/50 p-5 overflow-hidden shadow-2xl animate-in fade-in duration-200">
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
                              Verifikasi Wajah Otomatis ({pendingAttendanceAction === "CHECK_OUT" ? "Check-Out Pulang" : "Check-In Masuk"})
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-black">
                              AUTO-NEXT
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400/80">
                            Ikuti 3 gerakan di bawah • Otomatis tersimpan setelah langkah ke-3 selesai
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={stopWebcam}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 transition-all cursor-pointer"
                      >
                        <VideoOff className="w-3.5 h-3.5" />
                        <span>Batal / Tutup Kamera</span>
                      </button>
                    </div>

                    {/* Oval Camera Viewport & HUD (Ukuran Besar) */}
                    <div className="relative z-10 my-5 text-center">
                      <div
                        className={`relative mx-auto w-64 h-80 sm:w-72 sm:h-96 rounded-[50%] border-4 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center shadow-2xl ${
                          challengeStepStatus === "spoof_detected"
                            ? "border-red-500 bg-red-950/40 shadow-red-500/30 animate-pulse ring-4 ring-red-500/20"
                            : livenessPassed
                            ? "border-emerald-400 bg-emerald-500/10 shadow-emerald-500/30 ring-4 ring-emerald-500/20"
                            : "border-emerald-500/60 bg-[#010a05] ring-2 ring-emerald-500/20"
                        }`}
                      >
                        <video
                          ref={videoRef}
                          playsInline
                          autoPlay
                          muted
                          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                        />

                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce opacity-70" />

                        <div
                          className={`relative z-10 flex flex-col items-center p-3 w-full h-full ${
                            !livenessPassed && challengeStepStatus !== "spoof_detected"
                              ? "justify-end pb-4 bg-gradient-to-t from-black/85 via-transparent to-transparent"
                              : "justify-center bg-black/50"
                          }`}
                        >
                          {challengeStepStatus === "spoof_detected" ? (
                            <div className="space-y-1">
                              <ShieldAlert className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
                              <span className="text-[11px] font-black text-red-300 uppercase tracking-wider block">
                                FRAUD BLOCKED
                              </span>
                            </div>
                          ) : livenessPassed ? (
                            <div className="space-y-1">
                              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                              <span className="text-sm font-black text-white block">
                                Wajah Terverifikasi!
                              </span>
                              <span className="text-[11px] font-mono text-emerald-300 block font-bold">
                                Menyimpan {pendingAttendanceAction === "CHECK_OUT" ? "Check-Out" : "Check-In"}...
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="text-3xl block filter drop-shadow">
                                {challengeDefinitions[livenessChallengeSequence[currentChallengeIndex]]?.icon || "👁️"}
                              </span>
                              <span className="text-xs font-extrabold text-white block leading-tight px-2">
                                {challengeDefinitions[livenessChallengeSequence[currentChallengeIndex]]?.title}
                              </span>
                              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-500/40 inline-block">
                                Langkah {currentChallengeIndex + 1} dari 3 ({autoStepProgress}%)
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="absolute top-3 left-8 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400/80" />
                        <div className="absolute top-3 right-8 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400/80" />
                        <div className="absolute bottom-3 left-8 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400/80" />
                        <div className="absolute bottom-3 right-8 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400/80" />
                      </div>
                    </div>

                    {/* Multi-Challenge Steps Tracker (3 Tahapan Acak Otomatis) */}
                    <div className="relative z-10 bg-[#010804] border border-emerald-900/60 rounded-2xl p-3.5 space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {livenessChallengeSequence.map((cType, idx) => {
                          const def = challengeDefinitions[cType];
                          const isDone = livenessPassed || idx < currentChallengeIndex;
                          const isCurrent =
                            !livenessPassed &&
                            idx === currentChallengeIndex &&
                            challengeStepStatus !== "spoof_detected";
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

                      {!livenessPassed && challengeStepStatus !== "spoof_detected" && (
                        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 space-y-2.5">
                          <div className="flex items-start gap-2.5">
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

                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 animate-spin" />
                                Mendeteksi wajah & gerakan otomatis (Langkah {currentChallengeIndex + 1}/3)...
                              </span>
                              <span className="text-white font-extrabold">{autoStepProgress}%</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-black/60 overflow-hidden border border-emerald-500/30">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-200"
                                style={{ width: `${autoStepProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
  );
}
