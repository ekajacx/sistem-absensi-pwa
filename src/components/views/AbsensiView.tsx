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
  X,
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
  type FaceDistanceStatus = "NO_FACE" | "TOO_FAR" | "TOO_CLOSE" | "OPTIMAL";
  const [faceDistanceStatus, setFaceDistanceStatus] = useState<FaceDistanceStatus>("NO_FACE");
  const [isPhoneShaking, setIsPhoneShaking] = useState<boolean>(false);

  const passChallengeRef = useRef(handlePassCurrentChallenge);
  useEffect(() => {
    passChallengeRef.current = handlePassCurrentChallenge;
  });

  // Reset progress bar dan status deteksi wajah setiap berpindah langkah tantangan
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoStepProgress(0);
      setFaceDistanceStatus("NO_FACE");
      setIsPhoneShaking(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [currentChallengeIndex, isWebcamActive, livenessPassed]);

  // Deteksi Wajah Nyata, Jarak Optimal & Respons Gerakan Khusus per Tantangan
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
    let accumulated = 0;
    let prevLum: Uint8Array | null = null;

    const intervalId = window.setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !ctx) return;

      try {
        // Menggambar mirrored canvas agar koordinat (X, Y) identik dengan tampilan layar pengguna
        ctx.save();
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, width, height);
        ctx.restore();

        const frameData = ctx.getImageData(0, 0, width, height).data;
        const currentLum = new Uint8Array(width * height);

        for (let i = 0; i < width * height; i++) {
          const p = i * 4;
          currentLum[i] = Math.round(
            (frameData[p] * 299 + frameData[p + 1] * 587 + frameData[p + 2] * 114) / 1000
          );
        }

        // 🛡️ ANTI-PHONE SHAKE: Evaluasi stabilitas 4 sudut latar belakang (background corners)
        // Jika HP digoyangkan/diayunkan, seluruh latar belakang bergerak serentak (diff tinggi)
        // Jika kepala ditengokkan secara wajar, latar belakang tetap diam / stabil (diff rendah)
        let bgDiffSum = 0;
        let bgPixelCount = 0;

        if (prevLum) {
          // Sudut Kiri-Atas (x: 2..8, y: 2..8) dan Kanan-Atas (x: 39..45, y: 2..8)
          for (let y = 2; y <= 8; y++) {
            for (let x = 2; x <= 8; x++) {
              const idx = y * width + x;
              bgDiffSum += Math.abs(currentLum[idx] - prevLum[idx]);
              bgPixelCount++;
            }
            for (let x = 39; x <= 45; x++) {
              const idx = y * width + x;
              bgDiffSum += Math.abs(currentLum[idx] - prevLum[idx]);
              bgPixelCount++;
            }
          }
          // Sudut Kiri-Bawah (x: 2..8, y: 39..45) dan Kanan-Bawah (x: 39..45, y: 39..45)
          for (let y = 39; y <= 45; y++) {
            for (let x = 2; x <= 8; x++) {
              const idx = y * width + x;
              bgDiffSum += Math.abs(currentLum[idx] - prevLum[idx]);
              bgPixelCount++;
            }
            for (let x = 39; x <= 45; x++) {
              const idx = y * width + x;
              bgDiffSum += Math.abs(currentLum[idx] - prevLum[idx]);
              bgPixelCount++;
            }
          }
        }

        const avgBgDiff = bgPixelCount > 0 ? bgDiffSum / bgPixelCount : 0;
        const isShaking = avgBgDiff >= 8.5;
        setIsPhoneShaking(isShaking);

        if (isShaking) {
          // Goyangan HP terdeteksi: Reset/turunkan progres dengan cepat, tolak verifikasi otomatis!
          accumulated = Math.max(0, accumulated - 20);
          setAutoStepProgress(accumulated);
          prevLum = currentLum;
          return;
        }

        // Analisis Area Tengah (Zona Oval Wajah: x:13..34, y:9..38)
        let centerPixels = 0;
        let skinPixels = 0;
        let lumSum = 0;
        let lumSqSum = 0;

        let skinXSum = 0;
        let skinYSum = 0;
        let leftSkinPixels = 0;
        let rightSkinPixels = 0;
        let topSkinPixels = 0;
        let bottomSkinPixels = 0;

        for (let y = 9; y <= 38; y++) {
          for (let x = 13; x <= 34; x++) {
            const idx = (y * width + x) * 4;
            const r = frameData[idx];
            const g = frameData[idx + 1];
            const b = frameData[idx + 2];
            centerPixels++;

            const lum = currentLum[y * width + x];
            lumSum += lum;
            lumSqSum += lum * lum;

            // Cek warna kulit manusia alami (Melanin / Hemoglobin RGB)
            const maxVal = Math.max(r, g, b);
            const minVal = Math.min(r, g, b);
            const isSkin =
              r > 48 &&
              g > 28 &&
              b > 15 &&
              r > g &&
              r > b &&
              r - g >= 5 &&
              maxVal - minVal >= 10;

            if (isSkin) {
              skinPixels++;
              skinXSum += x;
              skinYSum += y;
              if (x < 24) leftSkinPixels++;
              else if (x > 24) rightSkinPixels++;

              if (y < 24) topSkinPixels++;
              else if (y > 24) bottomSkinPixels++;
            }
          }
        }

        const avgLum = centerPixels > 0 ? lumSum / centerPixels : 0;
        const variance = centerPixels > 0 ? lumSqSum / centerPixels - avgLum * avgLum : 0;
        const skinRatio = centerPixels > 0 ? skinPixels / centerPixels : 0;

        const skinCentroidX = skinPixels > 0 ? skinXSum / skinPixels : 23.5;
        const skinCentroidY = skinPixels > 0 ? skinYSum / skinPixels : 23.5;

        // Evaluasi Jarak Wajah:
        // - NO_FACE: tidak ada kulit / gelap / tidak ada kontras
        // - TOO_FAR: wajah terlalu jauh (skinRatio < 0.28)
        // - TOO_CLOSE: wajah terlalu dekat/terpotong (skinRatio > 0.88 atau silau)
        // - OPTIMAL: wajah pas di dalam bingkai oval (skinRatio 0.28 - 0.88)
        let detectedStatus: FaceDistanceStatus = "NO_FACE";
        const hasBasicFace =
          skinRatio >= 0.16 && avgLum >= 22 && avgLum <= 236 && variance >= 42;

        if (!hasBasicFace) {
          detectedStatus = "NO_FACE";
        } else if (skinRatio < 0.28) {
          detectedStatus = "TOO_FAR";
        } else if (skinRatio > 0.88 || avgLum > 236) {
          detectedStatus = "TOO_CLOSE";
        } else {
          detectedStatus = "OPTIMAL";
        }

        // Validasi native FaceDetector jika tersedia di browser Chrome Android
        if (typeof window !== "undefined" && "FaceDetector" in window) {
          try {
            // @ts-expect-error Native Shape Detection API
            const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
            const faces = await detector.detect(video);
            if (faces && faces.length > 0) {
              const faceBox = faces[0].boundingBox;
              const vidWidth = video.videoWidth || 640;
              const coverage = faceBox.width / vidWidth;
              if (coverage < 0.24) {
                detectedStatus = "TOO_FAR";
              } else if (coverage > 0.78) {
                detectedStatus = "TOO_CLOSE";
              } else {
                detectedStatus = "OPTIMAL";
              }
            } else if (skinRatio < 0.18) {
              detectedStatus = "NO_FACE";
            }
          } catch {
            // Fallback ke heuristik
          }
        }

        setFaceDistanceStatus(detectedStatus);

        // Jika jarak belum optimal (terlalu jauh / belum ada wajah):
        // Kunci progres di 0%, tolak verifikasi otomatis!
        if (detectedStatus !== "OPTIMAL") {
          accumulated = Math.max(0, accumulated - 14);
          setAutoStepProgress(accumulated);
          prevLum = currentLum;
          return;
        }

        // 🎯 COMPUTATIONAL MOTION FLOW (Optical Flow Block-Matching pada Fitur Wajah Tengah)
        // Mencari vektor pergeseran (flowDx, flowDy) dari fitur wajah di tengah frame
        let bestSad = 999999;
        let flowDx = 0;
        let flowDy = 0;
        let centerSad0 = 0;

        if (prevLum) {
          for (let dx = -3; dx <= 3; dx++) {
            for (let dy = -3; dy <= 3; dy++) {
              let sad = 0;
              for (let v = 16; v <= 32; v++) {
                for (let u = 18; u <= 30; u++) {
                  const curIdx = v * width + u;
                  const prevX = u - dx;
                  const prevY = v - dy;
                  const prevIdx = prevY * width + prevX;
                  sad += Math.abs(currentLum[curIdx] - prevLum[prevIdx]);
                }
              }
              if (dx === 0 && dy === 0) {
                centerSad0 = sad;
              }
              if (sad < bestSad) {
                bestSad = sad;
                flowDx = dx;
                flowDy = dy;
              }
            }
          }
        }

        // Jarak sudah OPTIMAL & HP Tenang! Evaluasi arah gerakan aktif:
        const activeChallenge = livenessChallengeSequence[0] || "turnRight";
        let actionDetected = false;

        if (activeChallenge === "turnLeft") {
          // Tengok Kiri: Pada mirrored screen, wajah memutar / bergerak ke sisi KIRI layar (flowDx < 0)
          const isMovingLeft = flowDx <= -1 && bestSad < centerSad0 * 0.96;
          const isPosedLeft =
            skinCentroidX < 22.8 ||
            leftSkinPixels / (rightSkinPixels + 1) >= 1.2 ||
            (rightSkinPixels / (leftSkinPixels + 1) >= 1.2 && skinCentroidX < 23.5);
          if (isMovingLeft || isPosedLeft) {
            actionDetected = true;
          }
        } else if (activeChallenge === "turnRight") {
          // Tengok Kanan: Pada mirrored screen, wajah memutar / bergerak ke sisi KANAN layar (flowDx > 0)
          const isMovingRight = flowDx >= 1 && bestSad < centerSad0 * 0.96;
          const isPosedRight =
            skinCentroidX > 24.2 ||
            rightSkinPixels / (leftSkinPixels + 1) >= 1.2 ||
            (leftSkinPixels / (rightSkinPixels + 1) >= 1.2 && skinCentroidX > 23.5);
          if (isMovingRight || isPosedRight) {
            actionDetected = true;
          }
        } else if (activeChallenge === "lookUp") {
          // Tengok Atas / Dongak: Wajah memutar / bergerak ke ATAS layar (flowDy < 0)
          const isMovingUp = flowDy <= -1 && bestSad < centerSad0 * 0.96;
          const isPosedUp = skinCentroidY < 22.6 || topSkinPixels / (bottomSkinPixels + 1) >= 1.2;
          if (isMovingUp || isPosedUp) {
            actionDetected = true;
          }
        } else if (activeChallenge === "lookDown") {
          // Tengok Bawah / Tunduk: Wajah memutar / bergerak ke BAWAH layar (flowDy > 0)
          const isMovingDown = flowDy >= 1 && bestSad < centerSad0 * 0.96;
          const isPosedDown = skinCentroidY > 24.8 || bottomSkinPixels / (topSkinPixels + 1) >= 1.2;
          if (isMovingDown || isPosedDown) {
            actionDetected = true;
          }
        }

        if (actionDetected) {
          accumulated = Math.min(100, accumulated + 35);
        } else {
          // Bengong / tidak melakukan gerakan yang diminta: turunkan progres perlahan
          accumulated = Math.max(0, accumulated - 7);
        }

        setAutoStepProgress(accumulated);
        prevLum = currentLum;

        if (accumulated >= 100) {
          window.clearInterval(intervalId);
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([70, 40, 70]);
          }
          passChallengeRef.current();
        }
      } catch {
        // Fallback jika frame canvas belum siap
      }
    }, 120);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    isWebcamActive,
    livenessPassed,
    challengeStepStatus,
    currentChallengeIndex,
    livenessChallengeSequence,
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

                {/* 🛡️ POP-UP KAMERA BERSIH FULLSCREEN WARNA PUTIH - 1 VERIFIKASI GERAKAN */}
                {isWebcamActive && (
                  <div className="fixed inset-0 z-[99999] bg-white w-screen h-screen flex flex-col justify-between p-4 sm:p-6 overflow-y-auto select-none animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md mx-auto my-auto flex flex-col justify-between space-y-3">
                      {/* Header Pop-up Bersih */}
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                            <ScanFace className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-gray-900 tracking-wide uppercase flex items-center gap-2">
                              <span>
                                {pendingAttendanceAction === "CHECK_OUT"
                                  ? "Check-Out (Absen Pulang)"
                                  : "Check-In (Absen Masuk)"}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white">
                                OTOMATIS
                              </span>
                            </h3>
                            <p className="text-[11px] text-gray-500 font-medium">
                              Verifikasi Arah Wajah Biometrik
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={stopWebcam}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 flex items-center justify-center border border-gray-200 transition-all cursor-pointer"
                          title="Tutup / Batal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Kartu Petunjuk Gerakan (Jelas & Kontras Tinggi) */}
                      <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-3.5 shadow-sm text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-3xl filter drop-shadow">
                            {challengeDefinitions[livenessChallengeSequence[0]]?.icon}
                          </span>
                          <div className="text-left">
                            <span className="text-[9px] font-mono font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md inline-block mb-0.5">
                              PETUNJUK GERAKAN
                            </span>
                            <h4 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                              {challengeDefinitions[livenessChallengeSequence[0]]?.instruction}
                            </h4>
                            <p className="text-[11px] text-emerald-900/70 font-medium">
                              {challengeDefinitions[livenessChallengeSequence[0]]?.detail}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Panduan Jarak, Stabilitas & Kesiapan Wajah (DI LUAR LINGKARAN, SANGAT JELAS TERBACA) */}
                      <div className="text-center py-0.5">
                        {isPhoneShaking ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-sm animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            ⚠️ Goyangan HP Terdeteksi — Tahan HP Tetap Tenang
                          </span>
                        ) : faceDistanceStatus === "OPTIMAL" ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Wajah Siap — Silakan Lakukan Gerakan Sekarang!
                          </span>
                        ) : faceDistanceStatus === "TOO_FAR" ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 shadow-sm animate-bounce">
                            <ScanFace className="w-3.5 h-3.5 text-amber-600" />
                            Dekatkan Wajah ke Kamera (Terlalu Jauh)
                          </span>
                        ) : faceDistanceStatus === "TOO_CLOSE" ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-800 border border-orange-300 shadow-sm">
                            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                            Mundurkan Sedikit Wajah Anda
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-700 border border-gray-300 shadow-sm animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-gray-500" />
                            Posisikan Wajah Anda di Lingkaran
                          </span>
                        )}
                      </div>

                      {/* Oval Camera Viewport (BERSIH TOTAL — TANPA TULISAN DI DALAM LINGKARAN) */}
                      <div className="relative text-center py-1">
                        <div
                          className={`relative mx-auto w-56 h-72 sm:w-64 sm:h-80 rounded-[50%] border-4 transition-all duration-300 overflow-hidden shadow-lg bg-gray-950 ${
                            isPhoneShaking
                              ? "border-amber-500 ring-4 ring-amber-400/40 animate-pulse"
                              : challengeStepStatus === "spoof_detected"
                              ? "border-red-500 ring-4 ring-red-400/30 animate-pulse"
                              : livenessPassed
                              ? "border-emerald-500 ring-4 ring-emerald-400/40"
                              : autoStepProgress >= 50
                              ? "border-emerald-400 ring-4 ring-emerald-400/40"
                              : faceDistanceStatus === "OPTIMAL"
                              ? "border-emerald-500 ring-4 ring-emerald-400/30"
                              : faceDistanceStatus === "TOO_FAR"
                              ? "border-amber-500 ring-4 ring-amber-400/30 animate-pulse"
                              : "border-gray-300 ring-2 ring-gray-200"
                          }`}
                        >
                          <video
                            ref={videoRef}
                            playsInline
                            autoPlay
                            muted
                            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                          />

                          {/* Scanline Efek */}
                          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce opacity-70 pointer-events-none" />

                          {/* Reticle Sudut */}
                          <div className="absolute top-4 left-8 w-3 h-3 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
                          <div className="absolute top-4 right-8 w-3 h-3 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
                          <div className="absolute bottom-4 left-8 w-3 h-3 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
                          <div className="absolute bottom-4 right-8 w-3 h-3 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Progress Bar & Status Respons Gerakan (DI LUAR LINGKARAN) */}
                      <div className="space-y-1.5 pt-1 text-center">
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-700 px-1">
                          <span className="flex items-center gap-1.5 text-emerald-800">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                            {livenessPassed
                              ? "✓ Gerakan Berhasil Tervalidasi!"
                              : isPhoneShaking
                              ? "HP bergoyang, mohon pegang HP stabil..."
                              : faceDistanceStatus === "OPTIMAL"
                              ? `Mendeteksi respon ${challengeDefinitions[livenessChallengeSequence[0]]?.title}...`
                              : faceDistanceStatus === "TOO_FAR"
                              ? "Wajah terlalu jauh, silakan dekatkan!"
                              : "Posisikan wajah di lingkaran..."}
                          </span>
                          <span className="text-gray-900 font-extrabold">{autoStepProgress}%</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shadow-inner">
                          <div
                            className={`h-full transition-all duration-200 ${
                              livenessPassed || faceDistanceStatus === "OPTIMAL"
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                : "bg-gray-300"
                            }`}
                            style={{ width: `${autoStepProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Tombol Batal Saja (Tanpa Tombol Konfirmasi Manual) */}
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={stopWebcam}
                          className="w-full py-3 px-4 rounded-xl text-xs font-bold border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                        >
                          <VideoOff className="w-4 h-4 text-gray-500" />
                          <span>Batal / Tutup Kamera</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
  );
}
