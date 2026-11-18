"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";
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
  const [isMediaPipeLoading, setIsMediaPipeLoading] = useState<boolean>(false);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);

  const passChallengeRef = useRef(handlePassCurrentChallenge);
  useEffect(() => {
    passChallengeRef.current = handlePassCurrentChallenge;
  });

  // Reset progress bar dan status deteksi wajah setiap berpindah langkah tantangan
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoStepProgress(0);
      setFaceDistanceStatus("NO_FACE");
    }, 0);
    return () => clearTimeout(timer);
  }, [currentChallengeIndex, isWebcamActive, livenessPassed]);

  // Inisialisasi Google MediaPipe Face Landmarker resmi
  useEffect(() => {
    if (!isWebcamActive) {
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch {
          // ignore
        }
        landmarkerRef.current = null;
      }
      setIsMediaPipeLoading(false);
      return;
    }

    let isCancelled = false;
    setIsMediaPipeLoading(true);

    async function loadMediaPipe() {
      try {
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        if (isCancelled) return;

        let landmarker: FaceLandmarker;
        try {
          landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
          });
        } catch {
          landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "CPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
          });
        }

        if (isCancelled) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;
        setIsMediaPipeLoading(false);
      } catch (err) {
        console.warn("MediaPipe model load error:", err);
        setIsMediaPipeLoading(false);
      }
    }

    loadMediaPipe();

    return () => {
      isCancelled = true;
    };
  }, [isWebcamActive]);

  // Deteksi Wajah 3D, Jarak & Arah Gerakan Menggunakan Google MediaPipe AI Landmarker
  useEffect(() => {
    if (
      !isWebcamActive ||
      livenessPassed ||
      challengeStepStatus === "spoof_detected" ||
      challengeStepStatus === "step_passed"
    ) {
      return;
    }

    let accumulated = 0;
    let lastVideoTime = -1;

    const intervalId = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      const landmarker = landmarkerRef.current;
      if (!landmarker) {
        // Menunggu model MediaPipe siap
        return;
      }

      if (video.currentTime === lastVideoTime) return;
      lastVideoTime = video.currentTime;

      try {
        const results = landmarker.detectForVideo(video, performance.now());

        if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
          setFaceDistanceStatus("NO_FACE");
          accumulated = Math.max(0, accumulated - 15);
          setAutoStepProgress(accumulated);
          return;
        }

        const landmarks = results.faceLandmarks[0];

        // 🎯 KOORDINAT LANDMARK 3D WAJAH MEDIA PIPE (Mirrored Screen Coordinates):
        // Hidung (Landmark 1)
        const noseX = 1 - landmarks[1].x;
        const noseY = landmarks[1].y;

        // Mata Kiri Layar (Landmark 263 di sensor mentah)
        const leftEyeX = 1 - landmarks[263].x;
        const leftEyeY = landmarks[263].y;

        // Mata Kanan Layar (Landmark 33 di sensor mentah)
        const rightEyeX = 1 - landmarks[33].x;
        const rightEyeY = landmarks[33].y;

        // Dahi (Landmark 10) & Dagu (Landmark 152)
        const foreheadY = landmarks[10].y;
        const chinY = landmarks[152].y;

        const eyeMidX = (leftEyeX + rightEyeX) / 2;
        const eyeMidY = (leftEyeY + rightEyeY) / 2;
        const eyeDist = Math.hypot(rightEyeX - leftEyeX, rightEyeY - leftEyeY);
        const faceHeight = Math.abs(chinY - foreheadY);

        // 📏 EVALUASI JARAK DARI PROPORSI TINGGI WAJAH 3D:
        let detectedStatus: FaceDistanceStatus = "OPTIMAL";
        if (faceHeight < 0.22) {
          detectedStatus = "TOO_FAR";
        } else if (faceHeight > 0.85) {
          detectedStatus = "TOO_CLOSE";
        } else {
          detectedStatus = "OPTIMAL";
        }

        setFaceDistanceStatus(detectedStatus);

        if (detectedStatus !== "OPTIMAL") {
          accumulated = Math.max(0, accumulated - 15);
          setAutoStepProgress(accumulated);
          return;
        }

        // 🎯 ROTASI KEPALA BIOMETRIS (YAW & PITCH 3D):
        // Yaw = posisi ujung hidung relatif terhadap garis tengah mata
        // - Hadap Lurus: yaw ≈ 0.0 (-0.08 s/d +0.08)
        // - Tengok Kiri: hidung bergeser ke sisi kiri mata -> yaw <= -0.16
        // - Tengok Kanan: hidung bergeser ke sisi kanan mata -> yaw >= +0.16
        const yaw = (noseX - eyeMidX) / Math.max(0.01, eyeDist);

        // Pitch = posisi ujung hidung relatif terhadap tinggi wajah
        // - Hadap Lurus: pitch ≈ 0.30 - 0.36
        // - Tengok Atas (Dongak): hidung naik mendekati mata -> pitch <= 0.22
        // - Tengok Bawah (Tunduk): hidung turun menjauhi mata -> pitch >= 0.44
        const pitch = (noseY - eyeMidY) / Math.max(0.01, faceHeight);

        const activeChallenge = livenessChallengeSequence[0] || "turnRight";
        let actionDetected = false;

        if (activeChallenge === "turnLeft") {
          if (yaw <= -0.16) actionDetected = true;
        } else if (activeChallenge === "turnRight") {
          if (yaw >= 0.16) actionDetected = true;
        } else if (activeChallenge === "lookUp") {
          if (pitch <= 0.22) actionDetected = true;
        } else if (activeChallenge === "lookDown") {
          if (pitch >= 0.44) actionDetected = true;
        }

        // ⚡ RESPON VERIFIKASI: Wajib menengok nyata ~0.5 detik untuk mencapai 100%
        if (actionDetected) {
          accumulated = Math.min(100, accumulated + 20);
        } else {
          // Diam / lurus: progres meluruh kembali ke 0%
          accumulated = Math.max(0, accumulated - 10);
        }

        setAutoStepProgress(accumulated);

        if (accumulated >= 100) {
          window.clearInterval(intervalId);
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([70, 40, 70]);
          }
          passChallengeRef.current();
        }
      } catch (err) {
        console.warn("Detection frame error:", err);
      }
    }, 80);

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

                      {/* Status Panduan Jarak, Kesiapan & AI MediaPipe */}
                      <div className="text-center py-0.5">
                        {isMediaPipeLoading ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-300 shadow-sm animate-pulse">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                            Memuat AI MediaPipe Vision...
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
                            isMediaPipeLoading
                              ? "border-blue-400 ring-4 ring-blue-300/40 animate-pulse"
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
                              : isMediaPipeLoading
                              ? "Menyiapkan AI MediaPipe Vision..."
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
