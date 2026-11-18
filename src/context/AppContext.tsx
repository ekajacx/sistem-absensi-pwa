"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  DepartmentType,
  HierarchyLevel,
  ContractType,
  DayOfWeek,
  ShiftSlotType,
  Employee,
  Shift,
  AttendanceRecord,
  ActivityLog,
  LeaveRequest,
  WorkJournal,
  SystemUser,
  CompanyProfile,
} from "@/types";
import type { ExportToExcelOptions } from "@/utils/excelExport";

// exceljs (~1 MB) dimuat on-demand hanya saat tombol Ekspor ditekan agar tidak membebani bundle awal
async function runExcelExport<T>(options: ExportToExcelOptions<T>): Promise<boolean> {
  const { exportToExcel } = await import("@/utils/excelExport");
  return exportToExcel<T>(options);
}
import {
  standardDepartments,
  initialEmployees,
  initialShifts,
  initialWeeklySchedules,
  initialAttendances,
  initialLeaves,
  initialJournals,
  initialUsers,
  initialSettings,
  initialCompanyProfile,
  initialActivityLogs,
  allPermissions,
  initialRolePermissions,
} from "@/data/initialData";
import { getFormattedServerTime } from "@/hooks/useClock";

const COMPANY_PROFILE_STORAGE_KEY = "absensi.companyProfile.v1";
const OFFICE_SETTINGS_STORAGE_KEY = "absensi.officeSettings.v1";

/**
 * Haversine Formula: Menghitung jarak permukaan bumi (dalam meter)
 * antara titik koordinat karyawan (lat1, lon1) dan titik koordinat kantor (lat2, lon2).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius bumi dalam meter
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function useAppProviderValue() {
// Navigation State
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  // Dynamic Company Profile State (Kop Surat & Identitas Perusahaan)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialCompanyProfile);
  const [companyProfileForm, setCompanyProfileForm] = useState<CompanyProfile>(initialCompanyProfile);
  const [companyName, setCompanyName] = useState<string>(initialCompanyProfile.name);
  const [isEditingCompany, setIsEditingCompany] = useState<boolean>(false);
  const [tempCompanyName, setTempCompanyName] = useState<string>(initialCompanyProfile.name);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(initialCompanyProfile.logoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companyLogoInputRef = useRef<HTMLInputElement>(null);

  // Persistensi Profil Perusahaan (localStorage) - dimuat setelah mount agar aman dari hydration mismatch
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const raw = window.localStorage.getItem(COMPANY_PROFILE_STORAGE_KEY);
        if (!raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== "object" || parsed === null) return;
        const p = parsed as Partial<CompanyProfile>;
        if (typeof p.name !== "string" || !p.name.trim()) return;
        const restored: CompanyProfile = {
          name: p.name,
          address: typeof p.address === "string" ? p.address : "",
          phone: typeof p.phone === "string" ? p.phone : "",
          email: typeof p.email === "string" ? p.email : "",
          logoUrl: typeof p.logoUrl === "string" && p.logoUrl.startsWith("data:image/") ? p.logoUrl : null,
        };
        setCompanyProfile(restored);
        setCompanyProfileForm(restored);
        setCompanyName(restored.name);
        setTempCompanyName(restored.name);
        setCompanyLogoUrl(restored.logoUrl);
      } catch (err) {
        console.warn("Gagal memuat profil perusahaan tersimpan:", err);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Simpan = satu-satunya titik yang menerapkan perubahan (teks + logo) ke sidebar, Kop Surat Excel, dan penyimpanan.
  const handleSaveCompanyProfile = () => {
    if (!companyProfileForm.name.trim()) {
      showToast("Nama perusahaan tidak boleh kosong!", "error");
      return;
    }
    const updated: CompanyProfile = {
      ...companyProfileForm,
      name: companyProfileForm.name.trim(),
      address: companyProfileForm.address.trim(),
      phone: companyProfileForm.phone.trim(),
      email: companyProfileForm.email.trim(),
    };
    try {
      window.localStorage.setItem(COMPANY_PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Gagal menyimpan profil perusahaan:", err);
      showToast("Gagal menyimpan permanen (penyimpanan browser penuh/ditolak).", "error");
      return;
    }
    setCompanyProfile(updated);
    setCompanyProfileForm(updated);
    setCompanyName(updated.name);
    setTempCompanyName(updated.name);
    setCompanyLogoUrl(updated.logoUrl);
    showToast("✓ Informasi profil perusahaan & Kop Surat berhasil disimpan!", "success");
  };

  // Logo hanya mengubah draft form (belum berlaku sebelum Simpan). Disimpan sebagai data URL (persisten, bukan blob:).
  const handleUpdateCompanyLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("File logo harus berupa gambar (PNG/JPEG/WebP/SVG)!", "error");
      input.value = "";
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast("Ukuran logo maksimal 3 MB!", "error");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => showToast("Gagal membaca file logo!", "error");
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : null;
      if (!src) {
        showToast("Gagal membaca file logo!", "error");
        return;
      }
      const img = new Image();
      img.onerror = () => showToast("File gambar logo tidak valid!", "error");
      img.onload = () => {
        const maxSide = 256;
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
        const w = Math.max(1, Math.round((img.naturalWidth || 1) * scale));
        const h = Math.max(1, Math.round((img.naturalHeight || 1) * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          showToast("Browser tidak mendukung pemrosesan logo!", "error");
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/png");
        setCompanyProfileForm((prev) => ({ ...prev, logoUrl: dataUrl }));
        showToast("Logo dipilih. Klik 'Simpan' untuk menerapkan.", "info");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    input.value = "";
  };

  const handleRemoveCompanyLogo = () => {
    setCompanyProfileForm((prev) => ({ ...prev, logoUrl: null }));
    showToast("Logo dihapus dari draft. Klik 'Simpan' untuk menerapkan.", "info");
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
  };
  // Timer auto-hide terikat ke objek toast aktif: toast baru otomatis membatalkan timer toast lama (cleanup effect)
  useEffect(() => {
    if (!toastMessage) return;
    const timerId = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timerId);
  }, [toastMessage]);

  // Helper Generator Password Acak Sementara (8 Karakter)
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // Handle Logo Upload (dengan revoke URL lama untuk mencegah memory leak)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (companyLogoUrl && companyLogoUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(companyLogoUrl);
        } catch (err) {
          console.warn("Failed to revoke previous company logo URL:", err);
        }
      }
      const url = URL.createObjectURL(file);
      setCompanyLogoUrl(url);
      showToast("Logo perusahaan berhasil diperbarui!");
    }
  };

  const saveCompanyName = () => {
    if (tempCompanyName.trim()) {
      setCompanyName(tempCompanyName.trim());
      showToast(`Nama perusahaan diubah menjadi: ${tempCompanyName.trim()}`);
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

  // Catatan: Timer jam realtime diisolasi ke hook useClock/ServerClock agar tidak memicu re-render cascade.

  // ─────────────────────────────────────────────────────────────
  // 7 DEPARTEMEN PERUSAHAAN (TERMASUK DIREKSI)
  // Direksi, HR, Finance, Marketing, Sales, Operations, IT
  // ─────────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Shifts Master Data (Shift Malam Ditiadakan, Khusus Pagi & Siang)
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);

  // Master Jadwal Shift Mingguan Seluruh 14 Karyawan
  const [weeklySchedules, setWeeklySchedules] = useState<Record<string, Record<DayOfWeek, ShiftSlotType>>>(initialWeeklySchedules);

  // Attendances State (Mencakup Seluruh 7 Departemen)
  const [attendances, setAttendances] = useState<AttendanceRecord[]>(initialAttendances);

  // Leave Requests State
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);

  // Work Journals State
  const [journals, setJournals] = useState<WorkJournal[]>(initialJournals);

  // System Users State
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);

  // Office Geofence & System Settings State
  const [settings, setSettings] = useState(initialSettings);

  // Muat konfigurasi lokasi & geofence tersimpan dari localStorage
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const raw = window.localStorage.getItem(OFFICE_SETTINGS_STORAGE_KEY);
        if (!raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== "object" || parsed === null) return;
        const s = parsed as Partial<typeof initialSettings>;
        setSettings((prev) => ({
          officeName: typeof s.officeName === "string" && s.officeName.trim() ? s.officeName : prev.officeName,
          latitude: typeof s.latitude === "number" && Number.isFinite(s.latitude) ? s.latitude : prev.latitude,
          longitude: typeof s.longitude === "number" && Number.isFinite(s.longitude) ? s.longitude : prev.longitude,
          geofenceRadius: typeof s.geofenceRadius === "number" && s.geofenceRadius >= 5 ? s.geofenceRadius : prev.geofenceRadius,
          minSafeDistance: typeof s.minSafeDistance === "number" && s.minSafeDistance >= 0 ? s.minSafeDistance : prev.minSafeDistance,
          aiFaceThreshold: typeof s.aiFaceThreshold === "number" && s.aiFaceThreshold >= 50 ? s.aiFaceThreshold : prev.aiFaceThreshold,
        }));
      } catch (err) {
        console.warn("Gagal memuat konfigurasi geofence tersimpan:", err);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveOfficeSettings = () => {
    try {
      window.localStorage.setItem(OFFICE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      showToast(
        `✓ Titik koordinat kantor (${settings.latitude.toFixed(6)}, ${settings.longitude.toFixed(6)}) & radius geofence ${settings.geofenceRadius}m berhasil disimpan!`,
        "success"
      );
    } catch (err) {
      console.error("Gagal menyimpan pengaturan lokasi kantor:", err);
      showToast("Gagal menyimpan pengaturan lokasi ke penyimpanan browser.", "error");
    }
  };

  // Audit Trail & Activity Log State (Log Otomatis & Koreksi Manual Warna Merah)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  // ─────────────────────────────────────────────────────────────
  // ROLE-BASED ACCESS CONTROL (RBAC) DENGAN PEMBAGIAN KHUSUS
  // - Akses Menu: Wewenang siapa saja yang boleh membuka menu sistem
  // - HR: Pendaftaran karyawan, akun user, data jabatan & departemen
  // - IT: Server, database, maintenance, geofence, bug & keamanan teknis
  // ─────────────────────────────────────────────────────────────
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(initialRolePermissions);

  const togglePermission = (role: string, permId: string) => {
    setRolePermissions((prev) => {
      const current = prev[role] || [];
      const updated = current.includes(permId) ? current.filter((id) => id !== permId) : [...current, permId];
      return { ...prev, [role]: updated };
    });
    showToast(`Hak akses "${allPermissions.find((p) => p.id === permId)?.name}" untuk role ${role} telah diperbarui!`);
  };

  // ─────────────────────────────────────────────────────────────
  // ACTIVE VIEWING PERSPECTIVE (SIMULASI ROLE ATASAN vs BAWAHAN)
  // ─────────────────────────────────────────────────────────────
  const [activePerspective, setActivePerspective] = useState<string>("admin");

  const currentActiveEmployee: Employee =
    activePerspective === "admin"
      ? employees[0]
      : employees.find((e) => e.id === activePerspective) || employees[0];

  const currentRoleName =
    activePerspective === "admin"
      ? "Super Admin"
      : currentActiveEmployee.role === "HR Supervisor"
      ? "HR Supervisor"
      : currentActiveEmployee.role === "HR Staff"
      ? "HR Staff"
      : currentActiveEmployee.role === "IT Supervisor"
      ? "IT Supervisor"
      : currentActiveEmployee.role === "IT Staff"
      ? "IT Staff"
      : currentActiveEmployee.level === "GeneralManager"
      ? "General Manager"
      : currentActiveEmployee.level === "Supervisor"
      ? "Supervisor"
      : "Staff";

  // POV Karyawan Staff (Tetap, DW, Magang, Kontrak)
  const isStaff = activePerspective !== "admin" && currentActiveEmployee.level === "Staff";

  const hasPermission = useCallback(
    (permId: string): boolean => {
      if (activePerspective === "admin") return true;
      const rolePerms = rolePermissions[currentRoleName] || [];
      return rolePerms.includes(permId);
    },
    [activePerspective, rolePermissions, currentRoleName]
  );

  // Hak Akses Rekap Absensi: Global (att_all) vs Tim Bawahan (att_team)
  const canViewAllAttendances = hasPermission("att_all");
  const canViewTeamAttendances = hasPermission("att_team");

  // 1. Dataset absensi dasar yang diizinkan untuk diakses sesuai wewenang RBAC
  const visibleAttendances = attendances.filter((att) => {
    if (canViewAllAttendances) return true;
    if (canViewTeamAttendances) {
      return att.dept === currentActiveEmployee.dept;
    }
    // Jika tidak memiliki att_all maupun att_team (misal Staff), hanya boleh melihat diri sendiri
    return att.employeeId === currentActiveEmployee.id;
  });

  // Otomatis alihkan jika menu dibatasi untuk Staff atau tidak memiliki izin akses
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isStaff && ["departemen", "jabatan", "kontrak", "rekap-absensi", "user-management", "izin-akses", "pengaturan", "log-aktivitas"].includes(activeMenu)) {
      setActiveMenu("karyawan");
    }
    if (activeMenu === "rekap-absensi" && !hasPermission("att_all") && !hasPermission("att_team")) {
      setActiveMenu("dashboard");
    }
    if (activeMenu === "user-management" && !hasPermission("menu_user_mgmt")) {
      setActiveMenu("dashboard");
    }
    if (activeMenu === "izin-akses" && !hasPermission("menu_user_mgmt")) {
      setActiveMenu("dashboard");
    }
    if (activeMenu === "pengaturan" && !hasPermission("menu_settings")) {
      setActiveMenu("dashboard");
    }
    if (activeMenu === "log-aktivitas" && !hasPermission("log_view")) {
      setActiveMenu("dashboard");
    }
  }, [hasPermission, activeMenu, isStaff]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Hierarchy Helpers
  const getDirectSuperior = (emp: Employee): Employee | null => {
    if (!emp.managerId) return null;
    return employees.find((e) => e.id === emp.managerId) || null;
  };

  const getDirectSubordinates = (empId: string): Employee[] => {
    return employees.filter((e) => e.managerId === empId);
  };

  const getVisibleEmployees = (): Employee[] => {
    if (activePerspective === "admin" || currentRoleName === "Super Admin" || currentRoleName === "HR Supervisor") {
      return employees; // HR Supervisor & Admin dapat melihat seluruh direktori untuk urusan SDM
    }
    if (currentActiveEmployee.level === "GeneralManager") {
      // GM membawahi seluruh 6 Supervisor & seluruh Staff operasional
      return employees;
    }
    if (currentActiveEmployee.level === "Supervisor") {
      // Supervisor hanya melihat dirinya + staf di departemennya
      return employees.filter((e) => e.dept === currentActiveEmployee.dept && (e.level === "Staff" || e.id === currentActiveEmployee.id));
    }
    // Staff hanya melihat dirinya sendiri
    return employees.filter((e) => e.id === currentActiveEmployee.id);
  };

  const visibleEmployees = getVisibleEmployees();

  // Jurnal Kerja yang boleh dilihat mengikuti cakupan RBAC direktori karyawan (Staff: diri sendiri, Supervisor: departemen, Admin/GM/HR: semua)
  const visibleJournalEmployeeIds = new Set(visibleEmployees.map((e) => e.id));
  const visibleJournals = journals.filter((j) => visibleJournalEmployeeIds.has(j.employeeId));
  const directSuperior = getDirectSuperior(currentActiveEmployee);
  const directSubordinates = getDirectSubordinates(currentActiveEmployee.id);

  // ─────────────────────────────────────────────────────────────
  // FORM & MODAL STATES (PENDAFTARAN KARYAWAN & PAKSA GANTI PASSWORD)
  // ─────────────────────────────────────────────────────────────
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("emp-it-stf");
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  const [filterDept, setFilterDept] = useState<string>("ALL");
  const [filterShift, setFilterShift] = useState<string>("ALL");
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState<string>("");

  // User Management Filter State
  const [userDeptFilter, setUserDeptFilter] = useState<string>("ALL");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");

  // Rekap Absensi Filter State (Lengkap 7 Departemen & Ekspor)
  const [rekapDeptFilter, setRekapDeptFilter] = useState<string>("ALL");
  const [rekapStatusFilter, setRekapStatusFilter] = useState<string>("ALL");
  const [rekapSearchQuery, setRekapSearchQuery] = useState<string>("");

  // Absensi Simulator State
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [attendanceState, setAttendanceState] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [simulatedDistance, setSimulatedDistance] = useState<number>(14.2);
  const [simulatedFaceScore, setSimulatedFaceScore] = useState<number>(96.4);

  // ─── LEVEL 4 AI ANTI-SPOOFING & MULTI-CHALLENGE LIVENESS STATES ───────────
  type LivenessChallengeType = "blink" | "smile" | "turnRight" | "turnLeft" | "nod";
  const [livenessChallengeSequence, setLivenessChallengeSequence] = useState<LivenessChallengeType[]>([
    "blink",
    "smile",
    "turnRight",
  ]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [challengeStepStatus, setChallengeStepStatus] = useState<"idle" | "verifying" | "step_passed" | "all_passed" | "spoof_detected">("idle");
  const [spoofAlertDetails, setSpoofAlertDetails] = useState<{
    type: "photo_static" | "screen_replay" | null;
    title: string;
    description: string;
    metrics: { name: string; value: string; pass: boolean }[];
  } | null>(null);
  const [antiSpoofScore, setAntiSpoofScore] = useState<number>(98.5);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const challengeDefinitions: Record<LivenessChallengeType, { title: string; instruction: string; icon: string; detail: string }> = {
    blink: {
      title: "Uji Kedipan Mata",
      instruction: "Kedipkan kedua mata Anda secara natural (2x)",
      icon: "👁️",
      detail: "Analisis rasio aspek mata (EAR) & mikro-gerakan pupil",
    },
    smile: {
      title: "Uji Senyum Alami",
      instruction: "Tersenyumlah ke arah kamera hingga bibir melebar",
      icon: "😊",
      detail: "Analisis kontur otot zygomaticus & geometri mulut",
    },
    turnRight: {
      title: "Uji Kedalaman 3D (Tengok Kanan)",
      instruction: "Tengokkan kepala Anda perlahan ke arah KANAN",
      icon: "➡️",
      detail: "Verifikasi rotasi yaw 3D & pergeseran paralaks optik",
    },
    turnLeft: {
      title: "Uji Kedalaman 3D (Tengok Kiri)",
      instruction: "Tengokkan kepala Anda perlahan ke arah KIRI",
      icon: "⬅️",
      detail: "Verifikasi rotasi yaw 3D & pergeseran paralaks optik",
    },
    nod: {
      title: "Uji Gerak Vertikal (Anggukan)",
      instruction: "Anggukkan kepala Anda ke bawah perlahan",
      icon: "↕️",
      detail: "Analisis pitch aksis z-depth & volumetrik tengkorak",
    },
  };

  const startLevel4Liveness = () => {
    const allChallenges: LivenessChallengeType[] = ["blink", "smile", "turnRight", "turnLeft", "nod"];
    const shuffled = [...allChallenges].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setLivenessChallengeSequence(selected);
    setCurrentChallengeIndex(0);
    setChallengeStepStatus("verifying");
    setSpoofAlertDetails(null);
    setLivenessPassed(false);
    setAntiSpoofScore(98.5);
  };

  const handlePassCurrentChallenge = () => {
    if (challengeStepStatus !== "verifying" && challengeStepStatus !== "idle") return;

    if (currentChallengeIndex < livenessChallengeSequence.length - 1) {
      setChallengeStepStatus("step_passed");
      setTimeout(() => {
        setCurrentChallengeIndex((prev) => prev + 1);
        setChallengeStepStatus("verifying");
      }, 600);
    } else {
      setChallengeStepStatus("all_passed");
      setLivenessPassed(true);
      setAntiSpoofScore(99.2);
      showToast("🎉 Liveness Level 4 Terverifikasi! 3/3 Tantangan Acak Lolos & Anti-Spoofing Valid.");
    }
  };

  const handleSimulateSpoofAttack = (type: "photo_static" | "screen_replay") => {
    setLivenessPassed(false);
    setChallengeStepStatus("spoof_detected");
    if (type === "photo_static") {
      setAntiSpoofScore(7.2);
      setSpoofAlertDetails({
        type: "photo_static",
        title: "KECURANGAN TERDETEKSI: FOTO STATIS 2D",
        description: "Sistem AI mendeteksi foto cetak kertas/gambar mati. Tidak ada denyut mikro-vaskular dan gagal merespons tantangan acak dinamis.",
        metrics: [
          { name: "Surface Flatness (Bidang Datar 2D)", value: "99.8% (Tinggi)", pass: false },
          { name: "Micro-Movement (Mikro-Gerak Wajah)", value: "0.00 Hz (Mati)", pass: false },
          { name: "Dynamic Challenge Response", value: "0% (Gagal Reaksi)", pass: false },
          { name: "3D Volumetric Depth", value: "Tidak Ada (Flat)", pass: false },
        ],
      });
      showToast("⛔ DETEKSI KECURANGAN: Foto Statis Terdeteksi! Absensi Ditolak.", "error");
    } else {
      setAntiSpoofScore(16.4);
      setSpoofAlertDetails({
        type: "screen_replay",
        title: "KECURANGAN TERDETEKSI: REPLAY LAYAR HP / MONITOR",
        description: "Sistem AI mendeteksi pola moire dan pantulan kaca layar perangkat kedua. Urutan video rekaman tidak cocok dengan tantangan acak real-time.",
        metrics: [
          { name: "Moire Pattern & LCD Glare", value: "Terdeteksi (Layar Kaca)", pass: false },
          { name: "Challenge Sync Timing", value: "Desinkronisasi (Video Lama)", pass: false },
          { name: "Color Temperature Anomaly", value: "Emisi Cahaya Biru Layar", pass: false },
          { name: "Anti-Spoof Confidence", value: "16.4% (Di Bawah 85%)", pass: false },
        ],
      });
      showToast("⛔ DETEKSI KECURANGAN: Replay Layar HP Terdeteksi! Absensi Ditolak.", "error");
    }
  };

  const stopWebcam = () => {
    // 1. Hentikan seluruh media track dari ref terisolasi untuk mencegah resource leak
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn("Failed to stop media stream track:", e);
        }
      });
      mediaStreamRef.current = null;
    }

    // 2. Bersihkan srcObject dari videoRef jika elemen video masih terpasang
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        try {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch {
              // ignore
            }
          });
        } catch {
          // ignore
        }
        videoRef.current.srcObject = null;
      }
    }

    setIsWebcamActive(false);
  };

  const toggleWebcam = async () => {
    if (isWebcamActive) {
      stopWebcam();
      showToast("Kamera fisik dimatikan. Beralih ke Biometric Sensor Simulator.");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => console.warn("Video play error:", err));
        }
        setIsWebcamActive(true);
        showToast("📹 Kamera depan aktif! Menyelaraskan feed dengan pemindai biometrik AI Level 4.");
      } catch (err) {
        console.warn("Webcam not available:", err);
        showToast("Kamera fisik tidak dapat diakses (izin ditolak atau di simulator). Menggunakan Biometric Simulation Hub.", "error");
      }
    }
  };

  useEffect(() => {
    if (activeMenu !== "absensi" && (isWebcamActive || mediaStreamRef.current)) {
      stopWebcam();
    }
  }, [activeMenu, isWebcamActive]);

  // Modals Open State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  // Modal Edit Rekap Absen State (Koreksi Lupa Absen)
  const [showEditAttendanceModal, setShowEditAttendanceModal] = useState<boolean>(false);
  const [editingAttendance, setEditingAttendance] = useState<AttendanceRecord | null>(null);
  const [editAttendanceForm, setEditAttendanceForm] = useState<{
    in: string;
    out: string;
    status: "APPROVED" | "TERLAMBAT" | "DITOLAK";
    reason: string;
  }>({
    in: "",
    out: "",
    status: "APPROVED",
    reason: "",
  });

  // Filter Log Audit Aktivitas
  const [rekapLogTypeFilter, setRekapLogTypeFilter] = useState<string>("ALL");
  const [logDeptFilter, setLogDeptFilter] = useState<string>("ALL");
  const [logTypeFilter, setLogTypeFilter] = useState<string>("ALL");
  const [logSearchQuery, setLogSearchQuery] = useState<string>("");

  const handleOpenEditAttendance = (att: AttendanceRecord) => {
    setEditingAttendance(att);
    setEditAttendanceForm({
      in: att.in,
      out: att.out === "--:--" ? "15:00 WITA" : att.out,
      status: att.status,
      reason: att.editReason || "",
    });
    setShowEditAttendanceModal(true);
  };

  const handleSaveEditAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttendance) return;

    // Guard otorisasi di level handler (bukan hanya menyembunyikan tombol di UI)
    const inEditScope = hasPermission("att_all") || editingAttendance.dept === currentActiveEmployee.dept;
    if (!hasPermission("att_edit_rekap") || !inEditScope) {
      showToast("Anda tidak memiliki wewenang untuk mengoreksi absensi ini!", "error");
      setShowEditAttendanceModal(false);
      return;
    }

    if (!editAttendanceForm.reason.trim()) {
      showToast("Keterangan atau alasan melakukan edit absensi wajib diisi!", "error");
      return;
    }

    const updatedAttendances = attendances.map((item) => {
      if (item.id === editingAttendance.id) {
        return {
          ...item,
          in: editAttendanceForm.in,
          out: editAttendanceForm.out,
          status: editAttendanceForm.status,
          isEdited: true,
          editedBy: `${currentActiveEmployee.name} (${currentActiveEmployee.role})`,
          editReason: editAttendanceForm.reason,
          editedAt: `${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}, ${getFormattedServerTime()}`,
        };
      }
      return item;
    });

    setAttendances(updatedAttendances);

    // Tambahkan log baru berwarna merah (MANUAL_EDIT)
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}, ${getFormattedServerTime()}`,
      type: "MANUAL_EDIT",
      title: `⚠️ Koreksi Manual Rekap Absensi (${editingAttendance.name})`,
      description: `Jam Check-In disesuaikan ke "${editAttendanceForm.in}", Check-Out ke "${editAttendanceForm.out}", Status: ${editAttendanceForm.status}`,
      employeeName: editingAttendance.name,
      dept: editingAttendance.dept,
      actorName: currentActiveEmployee.name,
      actorRole: currentActiveEmployee.role,
      isEdited: true,
      editReason: editAttendanceForm.reason,
    };

    setActivityLogs((prev) => [newLog, ...prev]);

    setShowEditAttendanceModal(false);
    showToast(`✓ Rekap absensi ${editingAttendance.name} berhasil diperbarui & tercatat di log audit!`, "success");
  };

  // ─────────────────────────────────────────────────────────────
  // MODAL & FORM TAMBAH JURNAL KERJA HARIAN (POV STAFF & KARYAWAN)
  // ─────────────────────────────────────────────────────────────
  const [showAddJournalModal, setShowAddJournalModal] = useState<boolean>(false);
  const [journalForm, setJournalForm] = useState<{
    date: string;
    hours: string;
    tasksText: string;
    notes: string;
  }>({
    date: "17 Nov 2026",
    hours: "8j 00m",
    tasksText: "",
    notes: "",
  });

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const tasks = journalForm.tasksText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (tasks.length === 0) {
      showToast("Daftar aktivitas atau tugas yang dikerjakan wajib diisi!", "error");
      return;
    }

    const newJournal: WorkJournal = {
      id: `jrn-${Date.now()}`,
      employeeId: currentActiveEmployee.id,
      name: currentActiveEmployee.name,
      dept: currentActiveEmployee.dept,
      avatar: currentActiveEmployee.avatar,
      date: journalForm.date || "17 Nov 2026",
      hours: journalForm.hours || "8j 00m",
      score: 95,
      tasks: tasks,
      notes: journalForm.notes.trim() || undefined,
    };

    setJournals((prev) => [newJournal, ...prev]);

    // Catat ke log aktivitas sistem
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: `${journalForm.date || "17 Nov 2026"}, ${getFormattedServerTime()}`,
      type: "LEAVE_APPLY",
      title: "Pengisian Jurnal Kerja Harian",
      description: `Laporan jurnal kerja harian (${tasks.length} aktivitas tugas) diserahkan oleh ${currentActiveEmployee.name} (${currentActiveEmployee.role})`,
      employeeName: currentActiveEmployee.name,
      dept: currentActiveEmployee.dept,
      actorName: currentActiveEmployee.name,
      actorRole: currentActiveEmployee.role,
      isEdited: false,
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    setShowAddJournalModal(false);
    setJournalForm({
      date: "17 Nov 2026",
      hours: "8j 00m",
      tasksText: "",
      notes: "",
    });
    showToast(`✓ Jurnal kerja harian ${currentActiveEmployee.name} berhasil disimpan & dilaporkan!`, "success");
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "deactivate" | "delete";
    employee: Employee | null;
  }>({
    isOpen: false,
    type: "deactivate",
    employee: null,
  });

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee({ ...emp });
    setShowEditEmployeeModal(true);
  };

  const handleSaveEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const cleanKtp = editingEmployee.nik.replace(/\D/g, "");
    if (cleanKtp.length !== 16) {
      showToast("Nomor KTP harus tepat 16 digit angka!", "error");
      return;
    }
    if (employees.some((emp) => emp.nik === cleanKtp && emp.id !== editingEmployee.id)) {
      showToast(`Gagal: Nomor KTP ${cleanKtp} sudah terdaftar pada karyawan lain!`, "error");
      return;
    }

    const updatedEmployeeData = { ...editingEmployee, nik: cleanKtp };

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === editingEmployee.id ? updatedEmployeeData : emp))
    );
    setUsers((prev) =>
      prev.map((u) =>
        u.employeeId === editingEmployee.id
          ? {
              ...u,
              name: editingEmployee.name,
              email: editingEmployee.email,
              dept: editingEmployee.dept,
              role: (editingEmployee.role as SystemUser["role"]) || u.role,
            }
          : u
      )
    );
    setShowEditEmployeeModal(false);
    showToast(`✓ Data karyawan ${editingEmployee.name} berhasil diperbarui!`, "success");
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.employee) return;
    const emp = confirmDialog.employee;

    if (confirmDialog.type === "deactivate") {
      setEmployees((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, status: "Non-Aktif" as const } : e))
      );
      showToast(`${emp.name} telah dinonaktifkan (Resign).`, "info");
    } else if (confirmDialog.type === "delete") {
      setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
      setUsers((prev) => prev.filter((u) => u.employeeId !== emp.id));
      showToast(`Data karyawan ${emp.name} berhasil dihapus permanen.`, "error");
    }

    setConfirmDialog({ isOpen: false, type: "deactivate", employee: null });
  };

  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [leaveActiveTab, setLeaveActiveTab] = useState<"my-leaves" | "subordinate-leaves">("my-leaves");
  const [newLeaveForm, setNewLeaveForm] = useState<{
    type: "Tahunan" | "Sakit" | "Melahirkan" | "Khusus";
    start: string;
    end: string;
    reason: string;
  }>({
    type: "Tahunan",
    start: "2026-11-25",
    end: "2026-11-27",
    reason: "",
  });

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveForm.reason.trim()) {
      showToast("Alasan pengajuan cuti wajib diisi!", "error");
      return;
    }
    const startDate = new Date(newLeaveForm.start);
    const endDate = new Date(newLeaveForm.end);
    if (endDate < startDate) {
      showToast("Tanggal selesai cuti tidak boleh lebih awal dari tanggal mulai!", "error");
      return;
    }
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const targetApprover = directSuperior;
    const approverTitle = targetApprover
      ? `${targetApprover.name} (${targetApprover.role})`
      : "Direktur Utama / Dewan Direksi";

    const newLeave: LeaveRequest = {
      id: `lv-${Date.now()}`,
      employeeId: currentActiveEmployee.id,
      name: currentActiveEmployee.name,
      dept: currentActiveEmployee.dept,
      type: newLeaveForm.type,
      start: newLeaveForm.start,
      end: newLeaveForm.end,
      days: calculatedDays,
      reason: newLeaveForm.reason,
      status: "MENUNGGU",
      approverId: targetApprover?.id,
      approverName: approverTitle,
    };

    setLeaves((prev) => [newLeave, ...prev]);
    setShowApplyLeaveModal(false);
    setNewLeaveForm({
      type: "Tahunan",
      start: "2026-11-25",
      end: "2026-11-27",
      reason: "",
    });
    showToast(`✓ Permohonan cuti diajukan ke: ${targetApprover ? targetApprover.name : "Direksi"}!`);
  };

  const handleApproveLeave = (leaveId: string) => {
    const nowStr = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: "DISETUJUI",
              approverId: currentActiveEmployee.id,
              approverName: `${currentActiveEmployee.name} (${currentActiveEmployee.role})`,
              approvedAt: `${nowStr} (Disetujui)`,
            }
          : l
      )
    );
    showToast("✓ Permohonan cuti bawahan telah DISETUJUI (APPROVED)!");
  };

  const handleRejectLeave = (leaveId: string) => {
    const nowStr = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: "DITOLAK",
              approverId: currentActiveEmployee.id,
              approverName: `${currentActiveEmployee.name} (${currentActiveEmployee.role})`,
              approvedAt: `${nowStr} (Ditolak)`,
            }
          : l
      )
    );
    showToast("Permohonan cuti bawahan telah DITOLAK.", "error");
  };

  // Leave Calculations
  const myLeaves = leaves.filter((leave) => leave.employeeId === currentActiveEmployee.id);
  const myUsedLeaveDays = myLeaves
    .filter((l) => l.type === "Tahunan" && l.status === "DISETUJUI")
    .reduce((acc, curr) => acc + curr.days, 0);
  const myRemainingQuota = Math.max(0, 12 - myUsedLeaveDays);
  const myPendingLeavesCount = myLeaves.filter((l) => l.status === "MENUNGGU").length;

  const subordinateLeaves = leaves.filter((leave) => {
    if (activePerspective === "admin" || currentRoleName === "Super Admin") {
      return true; // Super Admin audit view
    }
    if (currentActiveEmployee.level === "Director") {
      return leave.employeeId === "emp-gm" || directSubordinates.some((s) => s.id === leave.employeeId);
    }
    if (currentActiveEmployee.level === "GeneralManager") {
      // GM evaluates all 6 Supervisors
      return directSubordinates.some((s) => s.id === leave.employeeId);
    }
    if (currentActiveEmployee.level === "Supervisor") {
      // Supervisor evaluates staff in department
      return (
        directSubordinates.some((s) => s.id === leave.employeeId) ||
        (leave.dept === currentActiveEmployee.dept && leave.employeeId !== currentActiveEmployee.id)
      );
    }
    return false;
  });

  const pendingSubordinateCount = subordinateLeaves.filter((l) => l.status === "MENUNGGU").length;
  const canApproveLeaves =
    hasPermission("leave_approve_subordinate") ||
    directSubordinates.length > 0 ||
    currentActiveEmployee.level === "Director" ||
    currentActiveEmployee.level === "GeneralManager" ||
    currentActiveEmployee.level === "Supervisor";

  // ─────────────────────────────────────────────────────────────
  // MANAJEMEN SHIFT & JADWAL ROSTER MINGGUAN TIM
  // ─────────────────────────────────────────────────────────────
  const DAYS_OF_WEEK: DayOfWeek[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  // Helper: cek apakah tanggal tertentu jatuh dalam rentang cuti karyawan
  const getLeaveOnDate = (empId: string, dateStr: string): LeaveRequest | null => {
    return leaves.find((lv) => {
      if (lv.employeeId !== empId) return false;
      if (lv.status !== "DISETUJUI") return false;
      const start = new Date(lv.start);
      const end = new Date(lv.end);
      const d = new Date(dateStr);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      d.setHours(12, 0, 0, 0);
      return d >= start && d <= end;
    }) || null;
  };

  // Helper: hitung tanggal senin dari minggu yang mengandung tanggal tertentu
  const getMondayOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sunday
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Helper: format tanggal ke YYYY-MM-DD
  const formatDateISO = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Helper: format tanggal ke tampilan singkat "17 Nov"
  const formatDateShort = (date: Date): string => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const getSchedulableEmployees = (): Employee[] => {
    if (activePerspective === "admin" || currentRoleName === "Super Admin" || currentRoleName === "HR Supervisor") {
      return employees;
    }
    if (currentActiveEmployee.level === "GeneralManager") {
      return employees.filter((e) => e.level !== "Director");
    }
    if (currentActiveEmployee.level === "Supervisor") {
      // Supervisor dapat mengatur shift kerja dirinya dan seluruh staf bawahannya
      return employees.filter(
        (e) => e.id === currentActiveEmployee.id || (e.dept === currentActiveEmployee.dept && e.level === "Staff")
      );
    }
    // Staff hanya melihat dirinya
    return [currentActiveEmployee];
  };

  const [shiftActiveTab, setShiftActiveTab] = useState<"roster" | "master">("roster");
  const [selectedScheduleEmpId, setSelectedScheduleEmpId] = useState<string>("emp-ops-spv");
  const [pengaturanTab, setPengaturanTab] = useState<"perusahaan" | "lokasi" | "shift">("perusahaan");

  // ─── Device Lock / Anti-Titip Absen States ───────────────────────────────
  const [simulatedDeviceId, setSimulatedDeviceId] = useState<string>("DEV-IT-601");
  const [isMobileSimulated, setIsMobileSimulated] = useState<boolean>(true);
  const [showDeviceSimulator, setShowDeviceSimulator] = useState<boolean>(false);

  // Tanggal Senin dari minggu yang sedang dijadwalkan
  const [rosterWeekStart, setRosterWeekStart] = useState<string>("2026-11-16");

  // Set tanggal awal minggu ini saat komponen mount
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setRosterWeekStart(formatDateISO(getMondayOfWeek(new Date())));
  }, []);

  // Map hari ke tanggal spesifik berdasarkan rosterWeekStart
  const rosterDayDates: Record<DayOfWeek, string> = (() => {
    const monday = new Date(rosterWeekStart + "T00:00:00");
    const result: Record<string, string> = {};
    DAYS_OF_WEEK.forEach((day, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      result[day] = formatDateISO(d);
    });
    return result as Record<DayOfWeek, string>;
  })();

  // State untuk konfirmasi override cuti
  const [cutiOverrideConfirm, setCutiOverrideConfirm] = useState<{ day: DayOfWeek; shift: ShiftSlotType; leave: LeaveRequest } | null>(null);

  const [draftSchedule, setDraftSchedule] = useState<Record<DayOfWeek, ShiftSlotType>>({
    Senin: "Pagi",
    Selasa: "Pagi",
    Rabu: "Pagi",
    Kamis: "Pagi",
    Jumat: "Pagi",
    Sabtu: "Libur",
    Minggu: "Libur",
  });

  // Sinkronisasi target jadwal & filter saat berganti akun/POV agar tidak ada data lintas departemen yang tertinggal
  useEffect(() => {
    const allowedSched = getSchedulableEmployees();
    const isCurrentValid = allowedSched.some((e) => e.id === selectedScheduleEmpId);
    const nextTargetId = isStaff
      ? currentActiveEmployee.id
      : isCurrentValid
      ? selectedScheduleEmpId
      : (allowedSched[0]?.id || currentActiveEmployee.id);

    /* eslint-disable react-hooks/set-state-in-effect */
    if (nextTargetId !== selectedScheduleEmpId) {
      setSelectedScheduleEmpId(nextTargetId);
      const existing = weeklySchedules[nextTargetId];
      setDraftSchedule(
        existing
          ? { ...existing }
          : {
              Senin: "Pagi",
              Selasa: "Pagi",
              Rabu: "Pagi",
              Kamis: "Pagi",
              Jumat: "Pagi",
              Sabtu: "Libur",
              Minggu: "Libur",
            }
      );
    }
    if (isStaff) {
      setShiftActiveTab("roster");
    }
    setFilterDept("ALL");
    setFilterShift("ALL");
    setSearchEmployeeQuery("");
    setRekapDeptFilter("ALL");
    setRekapStatusFilter("ALL");
    setRekapSearchQuery("");
    setLogDeptFilter("ALL");
    setLogTypeFilter("ALL");
    setLogSearchQuery("");
    setUserDeptFilter("ALL");
    setUserSearchQuery("");
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePerspective, isStaff, currentActiveEmployee.id]);

  const handleSelectScheduleEmployee = (empId: string) => {
    setSelectedScheduleEmpId(empId);
    const existing = weeklySchedules[empId];
    if (existing) {
      setDraftSchedule({ ...existing });
    } else {
      setDraftSchedule({
        Senin: "Pagi",
        Selasa: "Pagi",
        Rabu: "Pagi",
        Kamis: "Pagi",
        Jumat: "Pagi",
        Sabtu: "Libur",
        Minggu: "Libur",
      });
    }
  };

  const handleSaveWeeklySchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStaff) {
      showToast("Karyawan tidak memiliki wewenang untuk mengubah jadwal kerja. Pengaturan jadwal dilakukan oleh Supervisor.", "error");
      return;
    }
    const allowedSched = getSchedulableEmployees();
    const targetEmp =
      allowedSched.find((emp) => emp.id === selectedScheduleEmpId) || allowedSched[0];
    if (!targetEmp) {
      showToast("Anda tidak memiliki wewenang mengatur jadwal karyawan di luar departemen Anda!", "error");
      return;
    }

    const finalSchedule = { ...draftSchedule };

    setWeeklySchedules((prev) => ({
      ...prev,
      [targetEmp.id]: finalSchedule,
    }));
    showToast(`✓ Jadwal shift mingguan untuk ${targetEmp.name} berhasil disimpan!`, "success");
  };

  // Master Shift CRUD Modal State
  const [showShiftModal, setShowShiftModal] = useState<boolean>(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [shiftForm, setShiftForm] = useState<{
    name: string;
    startTime: string;
    endTime: string;
    tolerance: string;
    openBefore: string;
    status: "Aktif" | "Non-Aktif";
  }>({
    name: "",
    startTime: "07:00",
    endTime: "15:00",
    tolerance: "15 Menit",
    openBefore: "60 Menit",
    status: "Aktif",
  });

  const [deleteShiftConfirm, setDeleteShiftConfirm] = useState<Shift | null>(null);

  const handleOpenAddShift = () => {
    if (isStaff) {
      showToast("Karyawan tidak memiliki hak akses untuk mengelola master shift.", "error");
      return;
    }
    setEditingShiftId(null);
    setShiftForm({
      name: "",
      startTime: "07:00",
      endTime: "15:00",
      tolerance: "15 Menit",
      openBefore: "60 Menit",
      status: "Aktif",
    });
    setShowShiftModal(true);
  };

  const handleOpenEditShift = (s: Shift) => {
    if (isStaff) {
      showToast("Karyawan tidak memiliki hak akses untuk mengedit master shift.", "error");
      return;
    }
    setEditingShiftId(s.id);
    setShiftForm({
      name: s.name,
      startTime: s.startTime,
      endTime: s.endTime,
      tolerance: s.tolerance,
      openBefore: s.openBefore,
      status: s.status,
    });
    setShowShiftModal(true);
  };

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftForm.name.trim()) {
      showToast("Nama shift wajib diisi!", "error");
      return;
    }

    if (editingShiftId) {
      setShifts((prev) =>
        prev.map((s) => (s.id === editingShiftId ? { ...s, ...shiftForm } : s))
      );
      showToast(`✓ Shift "${shiftForm.name}" berhasil diperbarui!`, "success");
    } else {
      const newShift: Shift = {
        id: `shift-${Date.now()}`,
        ...shiftForm,
      };
      setShifts((prev) => [...prev, newShift]);
      showToast(`✓ Shift baru "${shiftForm.name}" berhasil ditambahkan!`, "success");
    }
    setShowShiftModal(false);
  };

  const handleDeleteShift = () => {
    if (!deleteShiftConfirm) return;
    const name = deleteShiftConfirm.name;
    setShifts((prev) => prev.filter((s) => s.id !== deleteShiftConfirm.id));
    setDeleteShiftConfirm(null);
    showToast(`✓ Shift "${name}" telah dihapus dari sistem!`, "info");
  };

  // Pop-up Kredensial Sekali Muncul untuk HRD
  const [newlyCreatedCredentials, setNewlyCreatedCredentials] = useState<{
    name: string;
    nik: string;
    email: string;
    tempPass: string;
    dept: string;
    role: string;
    contractType: string;
    startDate: string;
    endDate?: string | null;
    superiorName: string;
  } | null>(null);

  // Form State: Pendaftaran Karyawan (Pemisahan: Tambah Staff vs Tambah Atasan)
  const [addRegistrationType, setAddRegistrationType] = useState<"staff" | "atasan">("staff");

  interface NewEmployeeFormData {
    nik: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
    dept: DepartmentType;
    level: HierarchyLevel;
    managerId: string | null;
    shiftId: string;
    contractType: ContractType;
    startDate: string;
    endDate?: string | null;
    photoUrl?: string | null;
  }

  const [newEmployeeForm, setNewEmployeeForm] = useState<NewEmployeeFormData>({
    nik: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "1998-05-14",
    dept: "HR",
    level: "Staff",
    managerId: "emp-hr-spv", // Pre-linked ke HR Supervisor
    shiftId: "shift-1",
    contractType: "Kontrak",
    startDate: "2026-11-20",
    endDate: "2027-11-20",
    photoUrl: null,
  });

  const openAddEmployeeModal = (type: "staff" | "atasan" = "staff") => {
    setAddRegistrationType(type);
    if (type === "staff") {
      const hrSpv = employees.find((e) => e.dept === "HR" && e.level === "Supervisor");
      setNewEmployeeForm({
        nik: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        birthDate: "1998-05-14",
        dept: "HR",
        level: "Staff",
        managerId: hrSpv ? hrSpv.id : "",
        shiftId: "shift-1",
        contractType: "Kontrak",
        startDate: "2026-11-20",
        endDate: "2027-11-20",
        photoUrl: null,
      });
    } else {
      const hasCeo = employees.some((e) => e.level === "Director");
      const hasGm = employees.some((e) => e.level === "GeneralManager");
      const availableSpvDepts = standardDepartments.filter(
        (d) => d.id !== "Direksi" && !employees.some((e) => e.dept === d.id && e.level === "Supervisor")
      );

      let targetLevel: HierarchyLevel = "Supervisor";
      let targetDept: DepartmentType = availableSpvDepts[0]?.id || "HR";
      let targetMgr: string | null =
        employees.find((e) => e.level === "GeneralManager")?.id ||
        employees.find((e) => e.level === "Director")?.id ||
        null;

      if (!hasCeo) {
        targetLevel = "Director";
        targetDept = "Direksi";
        targetMgr = null;
      } else if (!hasGm) {
        targetLevel = "GeneralManager";
        targetDept = "Direksi";
        targetMgr = employees.find((e) => e.level === "Director")?.id || null;
      }

      setNewEmployeeForm({
        nik: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        birthDate: "1988-04-12",
        dept: targetDept,
        level: targetLevel,
        managerId: targetMgr,
        shiftId: "shift-1",
        contractType: "Tetap",
        startDate: "2026-11-20",
        endDate: null,
        photoUrl: null,
      });
    }
    setShowAddEmployeeModal(true);
  };

  const handleDeptChange = (newDept: DepartmentType) => {
    let targetMgrId: string | null = "emp-ceo";
    if (newEmployeeForm.level === "Staff") {
      const spv = employees.find((e) => e.dept === newDept && e.level === "Supervisor");
      targetMgrId = spv ? spv.id : "";
    } else if (newEmployeeForm.level === "Supervisor") {
      const gm = employees.find((e) => e.level === "GeneralManager");
      const ceo = employees.find((e) => e.level === "Director");
      targetMgrId = gm ? gm.id : (ceo ? ceo.id : null);
    } else if (newEmployeeForm.level === "GeneralManager") {
      const ceo = employees.find((e) => e.level === "Director");
      targetMgrId = ceo ? ceo.id : null;
    } else {
      targetMgrId = null;
    }
    setNewEmployeeForm((prev) => ({
      ...prev,
      dept: newDept,
      managerId: targetMgrId,
    }));
  };

  const handleLevelChange = (newLevel: HierarchyLevel) => {
    let targetMgrId: string | null = null;
    let targetDept = newEmployeeForm.dept;

    if (newLevel === "Staff") {
      const spv = employees.find((e) => e.dept === newEmployeeForm.dept && e.level === "Supervisor");
      targetMgrId = spv ? spv.id : "";
    } else if (newLevel === "Supervisor") {
      const gm = employees.find((e) => e.level === "GeneralManager");
      const ceo = employees.find((e) => e.level === "Director");
      targetMgrId = gm ? gm.id : (ceo ? ceo.id : null);
    } else if (newLevel === "GeneralManager") {
      targetDept = "Direksi";
      const ceo = employees.find((e) => e.level === "Director");
      targetMgrId = ceo ? ceo.id : null;
    } else if (newLevel === "Director") {
      targetDept = "Direksi";
      targetMgrId = null;
    }

    setNewEmployeeForm((prev) => ({
      ...prev,
      level: newLevel,
      dept: targetDept,
      managerId: targetMgrId,
    }));
  };

  // Form State: Paksa Ganti Password Karyawan Baru
  const [forcedPasswordForm, setForcedPasswordForm] = useState({
    newPass: "",
    confirmPass: "",
  });

  // Deteksi Paksa Ganti Password
  const isForcedPasswordRequired =
    activePerspective !== "admin" &&
    currentActiveEmployee.isFirstLogin === true &&
    Boolean(currentActiveEmployee.temporaryPassword);

  const minSafeDistance = settings.minSafeDistance ?? 2;
  const isSuspiciousFakeGps = simulatedDistance <= minSafeDistance;
  const isOutOfGeofenceRadius = simulatedDistance > settings.geofenceRadius;
  const isWithinGeofence = !isSuspiciousFakeGps && !isOutOfGeofenceRadius;
  const isFaceScoreValid = simulatedFaceScore >= settings.aiFaceThreshold;

  // ─────────────────────────────────────────────────────────────
  // ACTIONS: REGISTRASI KARYAWAN & USER OTOMATIS
  // Aturan Hirarki:
  // - CEO: Maksimal 1
  // - GM: Maksimal 1 (Membawahi Seluruh Supervisor)
  // - Supervisor: Maksimal 1 per departemen (Membawahi Staff departemennya)
  // - Staff: Melapor ke Supervisor departemennya
  // ─────────────────────────────────────────────────────────────
  const handleRegisterEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeForm.name || !newEmployeeForm.nik || !newEmployeeForm.email) {
      showToast("Nama, Nomor KTP, dan Email wajib diisi!", "error");
      return;
    }

    const cleanKtp = newEmployeeForm.nik.replace(/\D/g, "");
    if (cleanKtp.length !== 16) {
      showToast("Nomor KTP harus tepat 16 digit angka!", "error");
      return;
    }

    if (employees.some((emp) => emp.nik === cleanKtp)) {
      showToast(`Gagal: Nomor KTP ${cleanKtp} sudah terdaftar di sistem!`, "error");
      return;
    }

    // 1. Validasi Kuota CEO: Hanya boleh ada 1 CEO
    if (newEmployeeForm.level === "Director" && employees.some((emp) => emp.level === "Director")) {
      const existingCeo = employees.find((emp) => emp.level === "Director");
      showToast(`Gagal: Posisi Direktur Utama (CEO) sudah terisi oleh ${existingCeo?.name}!`, "error");
      return;
    }

    // 2. Validasi Kuota GM: Hanya boleh ada 1 General Manager
    if (newEmployeeForm.level === "GeneralManager" && employees.some((emp) => emp.level === "GeneralManager")) {
      const existingGm = employees.find((emp) => emp.level === "GeneralManager");
      showToast(`Gagal: Posisi General Manager (GM) sudah terisi oleh ${existingGm?.name}!`, "error");
      return;
    }

    // 3. Validasi Kuota Supervisor: Hanya boleh 1 Supervisor per departemen
    if (
      newEmployeeForm.level === "Supervisor" &&
      employees.some((emp) => emp.dept === newEmployeeForm.dept && emp.level === "Supervisor")
    ) {
      const existingSpv = employees.find((emp) => emp.dept === newEmployeeForm.dept && emp.level === "Supervisor");
      showToast(`Gagal: Departemen ${newEmployeeForm.dept} sudah memiliki Supervisor (${existingSpv?.name})!`, "error");
      return;
    }

    // 4. Validasi Staff: Harus ada Supervisor di departemen tersebut
    if (newEmployeeForm.level === "Staff") {
      const deptSpv = employees.find((emp) => emp.dept === newEmployeeForm.dept && emp.level === "Supervisor");
      if (!deptSpv) {
        showToast(`Gagal: Departemen ${newEmployeeForm.dept} belum memiliki Supervisor. Daftarkan Supervisor terlebih dahulu!`, "error");
        return;
      }
    }

    const randomTempPass = generateRandomPassword();
    const newEmpId = `emp-${Date.now()}`;
    const newUserId = `usr-${Date.now()}`;

    // Tentukan Role & Atasan Langsung Berdasarkan Level:
    let calculatedRole = "";
    let finalDept: DepartmentType = newEmployeeForm.dept;
    let superiorEmployee: Employee | null = null;

    if (newEmployeeForm.level === "Director") {
      calculatedRole = "Direktur Utama (CEO)";
      finalDept = "Direksi";
      superiorEmployee = null;
    } else if (newEmployeeForm.level === "GeneralManager") {
      calculatedRole = "General Manager (GM)";
      finalDept = "Direksi";
      superiorEmployee = employees.find((emp) => emp.level === "Director") || null; // GM melapor ke CEO
    } else if (newEmployeeForm.level === "Supervisor") {
      const deptInfo = standardDepartments.find((d) => d.id === newEmployeeForm.dept);
      calculatedRole = deptInfo?.supervisorRole || `${newEmployeeForm.dept} Supervisor`;
      superiorEmployee =
        employees.find((emp) => emp.level === "GeneralManager") ||
        employees.find((emp) => emp.level === "Director") ||
        null; // SPV melapor ke GM
    } else {
      // Staff melapor ke Supervisor departemennya
      const deptInfo = standardDepartments.find((d) => d.id === newEmployeeForm.dept);
      calculatedRole = deptInfo?.staffRole || `${newEmployeeForm.dept} Staff`;
      superiorEmployee = employees.find((emp) => emp.dept === newEmployeeForm.dept && emp.level === "Supervisor") || null;
    }

    const effectiveEndDate = newEmployeeForm.contractType === "Tetap" ? null : newEmployeeForm.endDate;

    const newEmployeeObj: Employee = {
      id: newEmpId,
      nik: cleanKtp,
      name: newEmployeeForm.name,
      email: newEmployeeForm.email,
      phone: newEmployeeForm.phone || "+62 812-0000-0000",
      address: newEmployeeForm.address || "Jakarta",
      birthDate: newEmployeeForm.birthDate,
      dept: finalDept,
      role: calculatedRole,
      level: newEmployeeForm.level,
      shiftId: newEmployeeForm.shiftId,
      contractType: newEmployeeForm.contractType,
      startDate: newEmployeeForm.startDate,
      endDate: effectiveEndDate,
      joinDate: newEmployeeForm.startDate,
      tenure: "Baru Bergabung",
      faceRegistered: true,
      faceScore: 95.0,
      status: "Aktif",
      avatar: newEmployeeForm.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      photoUrl: newEmployeeForm.photoUrl || null,
      managerId: superiorEmployee ? superiorEmployee.id : null,
      isFirstLogin: true,
      temporaryPassword: randomTempPass,
      registeredDeviceId: null,
      deviceModel: null,
      deviceStatus: "Unbound",
    };

    const newUserObj: SystemUser = {
      id: newUserId,
      employeeId: newEmpId,
      name: newEmployeeForm.name,
      email: newEmployeeForm.email,
      role: (newEmployeeForm.level === "Director"
        ? "Super Admin"
        : newEmployeeForm.level === "GeneralManager"
        ? "General Manager"
        : calculatedRole === "HR Supervisor"
        ? "HR Supervisor"
        : calculatedRole === "HR Staff"
        ? "HR Staff"
        : calculatedRole === "IT Supervisor"
        ? "IT Supervisor"
        : calculatedRole === "IT Staff"
        ? "IT Staff"
        : newEmployeeForm.level === "Supervisor"
        ? "Supervisor"
        : "Staff") as SystemUser["role"],
      dept: finalDept,
      lastLogin: "Belum Pernah Login",
      status: "AKTIF",
      isFirstLogin: true,
      temporaryPassword: randomTempPass,
    };

    setEmployees((prev) => [...prev, newEmployeeObj]);
    setUsers((prev) => [...prev, newUserObj]);

    setNewlyCreatedCredentials({
      name: newEmployeeForm.name,
      nik: cleanKtp,
      email: newEmployeeForm.email,
      tempPass: randomTempPass,
      dept: finalDept,
      role: calculatedRole,
      contractType: newEmployeeForm.contractType,
      startDate: newEmployeeForm.startDate,
      endDate: effectiveEndDate,
      superiorName: superiorEmployee ? `${superiorEmployee.name} (${superiorEmployee.role})` : "Pimpinan Tertinggi (Tanpa Atasan)",
    });

    setShowAddEmployeeModal(false);
    setShowCredentialsModal(true);
    showToast(`✓ Berhasil mendaftarkan ${newEmployeeForm.name} sebagai ${calculatedRole}! Akun login telah dibuat.`);

    setNewEmployeeForm({
      nik: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      birthDate: "1998-05-14",
      dept: "IT",
      level: "Staff",
      managerId: "emp-it-spv",
      shiftId: "shift-1",
      contractType: "Kontrak",
      startDate: "2026-11-20",
      endDate: "2027-11-20",
    });
  };

  // Submit Paksa Ganti Password Karyawan Baru
  const handleForcedPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forcedPasswordForm.newPass.length < 6) {
      showToast("Password baru minimal 6 karakter!", "error");
      return;
    }
    if (forcedPasswordForm.newPass !== forcedPasswordForm.confirmPass) {
      showToast("Konfirmasi password tidak cocok!", "error");
      return;
    }

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === currentActiveEmployee.id ? { ...emp, isFirstLogin: false, temporaryPassword: null } : emp
      )
    );

    setUsers((prev) =>
      prev.map((usr) =>
        usr.employeeId === currentActiveEmployee.id
          ? { ...usr, isFirstLogin: false, temporaryPassword: null, lastLogin: "Hari ini (Password Diganti)" }
          : usr
      )
    );

    setForcedPasswordForm({ newPass: "", confirmPass: "" });
    showToast("🎉 Password baru Anda berhasil disimpan! Password sementara kini telah dihapus permanen dari sistem.");
  };

  // Process Check-In Absensi
  const handleCheckIn = () => {
    if (challengeStepStatus === "spoof_detected") {
      showToast("Gagal: Sistem mendeteksi indikasi kecurangan biometrik / foto statis. Silakan ulangi verifikasi liveness wajah asli!", "error");
      return;
    }
    if (!livenessPassed) {
      showToast("Harap selesaikan uji liveness Level 4 AI (3 tantangan acak) terlebih dahulu!", "error");
      return;
    }
    if (isSuspiciousFakeGps) {
      showToast(
        `⛔ DITOLAK (ANTI-FAKE GPS): Jarak Anda (${simulatedDistance.toFixed(1)}m) terlalu dekat/identik dengan titik pusat kantor (≤ ${minSafeDistance}m). Sistem mendeteksi indikasi Fake GPS / Mock Location!`,
        "error"
      );
      return;
    }
    if (isOutOfGeofenceRadius || !isWithinGeofence) {
      showToast(
        `⛔ DITOLAK (DI LUAR GEOFENCE): Jarak Anda (${simulatedDistance.toFixed(1)}m) melewati batas radius kantor (${settings.geofenceRadius}m)!`,
        "error"
      );
      return;
    }
    if (!isFaceScoreValid) {
      showToast(`Gagal: Skor kecocokan wajah (${simulatedFaceScore}%) di bawah batas (${settings.aiFaceThreshold}%)!`, "error");
      return;
    }

    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setAttendanceState("SUCCESS");

      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: currentActiveEmployee.id,
        name: currentActiveEmployee.name,
        nik: currentActiveEmployee.nik,
        dept: currentActiveEmployee.dept,
        shift: shifts.find((s) => s.id === currentActiveEmployee.shiftId)?.name || "Shift Pagi (Utama)",
        in: getFormattedServerTime(),
        out: "--:--",
        dist: simulatedDistance,
        score: simulatedFaceScore,
        status: "APPROVED",
        date: "17 Nov 2026",
      };

      setAttendances((prev) => [newRecord, ...prev]);

      const autoLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: `${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}, ${getFormattedServerTime()}`,
        type: "CHECK_IN",
        title: "Check-In Mandiri Otomatis (Level 4 AI)",
        description: `Absensi hadir masuk terverifikasi via GPS (${simulatedDistance.toFixed(1)}m) & Level 4 AI Anti-Spoofing (${antiSpoofScore}%) [3/3 Multi-Challenge Valid]`,
        employeeName: currentActiveEmployee.name,
        dept: currentActiveEmployee.dept,
        actorName: currentActiveEmployee.name,
        actorRole: currentActiveEmployee.role,
        isEdited: false,
      };
      setActivityLogs((prev) => [autoLog, ...prev]);

      showToast(`✓ Absensi mandiri ${currentActiveEmployee.name} BERHASIL disahkan secara otomatis (Level 4 AI APPROVED)!`);
    }, 1200);
  };

  const copyCredentialsToClipboard = () => {
    if (!newlyCreatedCredentials) return;
    const text = `Halo ${newlyCreatedCredentials.name},\nSelamat bergabung di tim ${newlyCreatedCredentials.dept}!\nBerikut akun login Anda di AbsenKu:\n- No. KTP: ${newlyCreatedCredentials.nik}\n- Email: ${newlyCreatedCredentials.email}\n- Password Sementara: ${newlyCreatedCredentials.tempPass}\n- Atasan Langsung: ${newlyCreatedCredentials.superiorName}\n\n*Penting: Password ini berlaku sekali. Anda diwajibkan membuat password baru saat login pertama.*`;
    navigator.clipboard?.writeText(text);
    showToast("✓ Info akun & password sementara berhasil disalin!");
  };

  // Dynamic Header Meta
  const menuMeta: Record<string, { title: string; subtitle: string; icon: string }> = {
    dashboard: { title: "DASHBOARD", subtitle: `Ringkasan Data AbsenKu`, icon: "🏠" },
    karyawan: { title: "KARYAWAN", subtitle: `Direktori Karyawan & Relasi Atasan-Bawahan (${visibleEmployees.length} Karyawan)`, icon: "👥" },
    departemen: { title: "DEPARTEMEN", subtitle: "Struktur 7 Departemen Perusahaan (Direksi, HR, Finance, Marketing, Sales, Operations, IT)", icon: "🏢" },
    jabatan: { title: "JABATAN", subtitle: "Hirarki Jabatan 4 Tingkat: CEO → GM → Supervisor → Staff", icon: "💼" },
    kontrak: { title: "KONTRAK & LIFECYCLE", subtitle: "Status Kerja Karyawan: Tetap, Kontrak, Magang, DW", icon: "📄" },
    absensi: { title: "ABSENSI", subtitle: "Verifikasi Kehadiran Otomatis Real-Time (GPS & AI Liveness)", icon: "📍" },
    "rekap-absensi": { title: "REKAP ABSENSI", subtitle: `Audit Log Kehadiran Terverifikasi (${attendances.length} Log Hari Ini)`, icon: "📊" },
    "jadwal-shift": { title: "JADWAL SHIFT", subtitle: "Penjadwalan Roster Kerja Mingguan (7 Hari)", icon: "📅" },
    "pengajuan-cuti": { title: "PENGAJUAN CUTI", subtitle: `Self-Service Permohonan Cuti & Persetujuan Berjenjang N+1 (${pendingSubordinateCount} Pending Approval)`, icon: "⛱️" },
    "jurnal-kerja": { title: "JURNAL KERJA", subtitle: `Catatan Produktivitas Harian & Penilaian Supervisor (${journals.length} Jurnal Tercatat)`, icon: "📝" },
    "user-management": { title: "USER MANAGEMENT", subtitle: `Kelola Akun Pengguna Sistem (${users.length} Akun Terdaftar)`, icon: "👤" },
    "izin-akses": { title: "IZIN AKSES (RBAC)", subtitle: "Matriks Wewenang & Hak Akses Berdasarkan Peran Sistem (Role-Based Access Control)", icon: "🛡️" },
    pengaturan: { title: "PENGATURAN", subtitle: `Konfigurasi Geofence Kantor (${settings.geofenceRadius}m) & Master Jam Shift (${shifts.length} Shift)`, icon: "⚙️" },
    "log-aktivitas": { title: "AUDIT LOG SISTEM", subtitle: `Rekam Jejak Aktivitas Kehadiran & Jejak Modifikasi Sistem (${activityLogs.length} Log)`, icon: "📜" },
  };

  const currentMeta = menuMeta[activeMenu] ?? { title: activeMenu.toUpperCase(), subtitle: "", icon: "📋" };

  const filteredEmployees = visibleEmployees.filter((emp) => {
    const matchDept = filterDept === "ALL" || emp.dept === filterDept;
    const matchShift = filterShift === "ALL" || emp.shiftId === filterShift;
    const matchSearch =
      searchEmployeeQuery === "" ||
      emp.name.toLowerCase().includes(searchEmployeeQuery.toLowerCase()) ||
      emp.nik.includes(searchEmployeeQuery) ||
      emp.dept.toLowerCase().includes(searchEmployeeQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchEmployeeQuery.toLowerCase());
    return matchDept && matchShift && matchSearch;
  });

  // 2. Filter Data Rekap Absensi (Departemen, Status, Search)
  const filteredAttendances = visibleAttendances.filter((att) => {
    const matchDept =
      !canViewAllAttendances
        ? att.dept === currentActiveEmployee.dept
        : rekapDeptFilter === "ALL" || att.dept === rekapDeptFilter;
    const matchStatus = rekapStatusFilter === "ALL" || att.status === rekapStatusFilter;
    const matchSearch =
      rekapSearchQuery === "" ||
      att.name.toLowerCase().includes(rekapSearchQuery.toLowerCase()) ||
      att.nik.includes(rekapSearchQuery) ||
      att.dept.toLowerCase().includes(rekapSearchQuery.toLowerCase()) ||
      att.shift.toLowerCase().includes(rekapSearchQuery.toLowerCase());
    return matchDept && matchStatus && matchSearch;
  });

  // Filter Data User Management (Departemen + Search)
  const filteredUsers = users.filter((u) => {
    const matchDept = userDeptFilter === "ALL" || u.dept === userDeptFilter;
    const matchSearch =
      userSearchQuery === "" ||
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.dept.toLowerCase().includes(userSearchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  // ─────────────────────────────────────────────────────────────
  // MODUL EXPORT EXCEL (.XLSX) STANDAR PERUSAHAAN (DARK FOREST EMERALD)
  // ─────────────────────────────────────────────────────────────

  // Helper Kop Surat Resmi Menggunakan Profil Perusahaan Dinamis
  const getCompanyKopSurat = (reportTitle: string, periodText?: string) => ({
    companyName: companyProfile.name || companyName || "AbsenKu",
    companyAddress: companyProfile.address || settings.officeName || "Kantor Pusat - Sudirman Tower Lt. 12",
    companyContact: [
      companyProfile.phone ? `Telp: ${companyProfile.phone}` : "",
      companyProfile.email ? `Email: ${companyProfile.email}` : "",
    ].filter(Boolean).join("  •  ") || "info@perusahaan.id",
    reportTitle,
    periodText,
    exportedAt: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Makassar",
    }),
    exportedBy: currentActiveEmployee.name || "HRD Administrator",
    logoUrl: companyProfile.logoUrl,
  });

  // 1. Ekspor Rekap Kehadiran (Mendukung periode Mingguan / Bulanan & filter aktif)
  const handleExportExcel = async (
    customAttendances?: AttendanceRecord[],
    customPeriodText?: string
  ) => {
    const targetList = Array.isArray(customAttendances) ? customAttendances : filteredAttendances;
    if (targetList.length === 0) {
      showToast("Tidak ada data absensi pada periode ini untuk diekspor!", "error");
      return;
    }

    try {
      const deptTag = !canViewAllAttendances
        ? currentActiveEmployee.dept
        : rekapDeptFilter === "ALL"
        ? "Semua_Dept"
        : rekapDeptFilter;
      const todayStr = new Date()
        .toLocaleDateString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Makassar",
        })
        .replace(/\//g, "-");
      const fileName = `Laporan_Rekap_Absensi_${deptTag}_${todayStr}.xlsx`;

      const approvedCount = targetList.filter((a) => a.status === "APPROVED").length;
      const lateCount = targetList.filter((a) => a.status === "TERLAMBAT").length;
      const avgScore =
        targetList.length > 0
          ? (
              targetList.reduce((acc, c) => acc + c.score, 0) /
              targetList.length
            ).toFixed(1) + "%"
          : "0%";

      const basePeriod = !canViewAllAttendances
        ? `Departemen: ${currentActiveEmployee.dept} (Tim Bawahan) • Status: ${rekapStatusFilter}`
        : `Departemen: ${deptTag} • Status: ${rekapStatusFilter}`;
      const periodDesc = customPeriodText ? `${customPeriodText} • ${basePeriod}` : basePeriod;

      await runExcelExport<AttendanceRecord>({
        fileName,
        sheetName: "Rekap Kehadiran",
        kopSurat: getCompanyKopSurat("Laporan Rekapitulasi Kehadiran Karyawan", periodDesc),
        summaryMetrics: [
          { label: "Total Log Kehadiran", value: `${targetList.length} Log` },
          { label: "Hadir Tepat Waktu", value: `${approvedCount} Log` },
          { label: "Keterlambatan", value: `${lateCount} Log` },
          { label: "Rata-rata Skor AI", value: avgScore },
        ],
        columns: [
          { header: "No", key: "no", width: 6, align: "center", getter: (_, idx) => idx + 1 },
          { header: "ID Log", key: "id", width: 14, align: "center", getter: (r) => r.id },
          { header: "Nama Karyawan", key: "name", width: 24, align: "left", getter: (r) => r.name },
          { header: "Nomor KTP (NIK)", key: "nik", width: 20, align: "center", format: "@", getter: (r) => r.nik },
          { header: "Departemen", key: "dept", width: 16, align: "left", getter: (r) => r.dept },
          { header: "Shift Kerja", key: "shift", width: 14, align: "center", getter: (r) => r.shift },
          { header: "Tanggal", key: "date", type: "date", width: 14, align: "center", getter: (r) => r.date },
          { header: "Jam Masuk", key: "in", width: 14, align: "center", getter: (r) => (r.in ? `${r.in} WITA` : "-") },
          { header: "Jam Pulang", key: "out", width: 14, align: "center", getter: (r) => (r.out ? `${r.out} WITA` : "-") },
          { header: "Jarak GPS (m)", key: "dist", width: 14, align: "right", format: "#,##0.0", getter: (r) => r.dist },
          { header: "Skor AI (%)", key: "score", width: 13, align: "right", format: '0.0"%"', getter: (r) => r.score },
          { header: "Status Kehadiran", key: "status", width: 16, align: "center", getter: (r) => r.status },
        ],
        data: targetList,
        orientation: "landscape",
      });

      showToast(`✓ Berhasil mengunduh ${targetList.length} data absensi ke format Excel (.xlsx)!`, "success");
    } catch (err) {
      console.error("Export Excel Error:", err);
      showToast("Gagal mengekspor data absensi ke Excel!", "error");
    }
  };

  // Alias handleExportCSV untuk kompatibilitas penuh tombol lama
  const handleExportCSV = handleExportExcel;

  // 2. Ekspor Direktori Karyawan (Biodata, Jabatan, Relasi Atasan & Kontrak)
  const handleExportEmployeesExcel = async () => {
    if (filteredEmployees.length === 0) {
      showToast("Tidak ada data karyawan untuk diekspor!", "error");
      return;
    }

    try {
      const deptTag =
        currentActiveEmployee.level === "Supervisor" &&
        activePerspective !== "admin" &&
        currentRoleName !== "Super Admin" &&
        currentRoleName !== "HR Supervisor"
          ? currentActiveEmployee.dept
          : filterDept === "ALL"
          ? "Semua_Dept"
          : filterDept;
      const todayStr = new Date()
        .toLocaleDateString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Makassar",
        })
        .replace(/\//g, "-");
      const fileName = `Data_Karyawan_${deptTag}_${todayStr}.xlsx`;

      const tetapCount = filteredEmployees.filter((e) => e.contractType === "Tetap").length;
      const kontrakCount = filteredEmployees.filter((e) => e.contractType === "Kontrak").length;
      const magangDwCount = filteredEmployees.filter(
        (e) => e.contractType === "Magang" || e.contractType === "DW"
      ).length;

      await runExcelExport<Employee>({
        fileName,
        sheetName: "Data Karyawan",
        kopSurat: getCompanyKopSurat(
          "Laporan Master Data Karyawan, Jabatan & Status Kontrak",
          `Cakupan Departemen: ${deptTag === "Semua_Dept" ? "Seluruh Departemen" : deptTag}${searchEmployeeQuery ? ` • Pencarian: "${searchEmployeeQuery}"` : ""}`
        ),
        summaryMetrics: [
          { label: "Total Data Karyawan", value: `${filteredEmployees.length} Orang` },
          { label: "Karyawan Tetap (PKWTT)", value: `${tetapCount} Orang` },
          { label: "Karyawan Kontrak (PKWT)", value: `${kontrakCount} Orang` },
          { label: "Magang & Daily Worker", value: `${magangDwCount} Orang` },
        ],
        columns: [
          { header: "No", key: "no", width: 6, align: "center", getter: (_, idx) => idx + 1 },
          { header: "ID Karyawan", key: "id", width: 14, align: "center", getter: (e) => e.id },
          { header: "Nomor KTP (NIK)", key: "nik", width: 20, align: "center", format: "@", getter: (e) => e.nik },
          { header: "Nama Lengkap", key: "name", width: 24, align: "left", getter: (e) => e.name },
          { header: "Departemen", key: "dept", width: 15, align: "left", getter: (e) => e.dept },
          { header: "Jabatan / Posisi", key: "role", width: 22, align: "left", getter: (e) => e.role },
          { header: "Level Hirarki", key: "level", width: 16, align: "center", getter: (e) => e.level },
          {
            header: "Atasan Langsung (N+1)",
            key: "superior",
            width: 24,
            align: "left",
            getter: (e) => getDirectSuperior(e)?.name || "Direktur Utama",
          },
          { header: "Tipe Kontrak", key: "contractType", width: 15, align: "center", getter: (e) => e.contractType },
          {
            header: "Tgl Mulai Kerja",
            key: "startDate",
            type: "date",
            width: 16,
            align: "center",
            getter: (e) => e.startDate || e.joinDate,
          },
          {
            header: "Akhir Kontrak",
            key: "endDate",
            width: 18,
            align: "center",
            getter: (e) => e.endDate || "Permanen (PKWTT)",
          },
          { header: "Masa Kerja", key: "tenure", width: 15, align: "center", getter: (e) => e.tenure },
          { header: "Email Perusahaan", key: "email", width: 24, align: "left", getter: (e) => e.email },
          { header: "No. Telepon / WA", key: "phone", width: 16, align: "center", format: "@", getter: (e) => e.phone },
          { header: "Tanggal Lahir", key: "birthDate", type: "date", width: 15, align: "center", getter: (e) => e.birthDate },
          { header: "Alamat Domisili", key: "address", width: 32, align: "left", wrapText: true, getter: (e) => e.address },
          {
            header: "Status Perangkat HP",
            key: "device",
            width: 22,
            align: "center",
            getter: (e) => (e.deviceStatus === "Bound" ? `Terdaftar (${e.deviceModel || "Bound"})` : "Belum Terdaftar"),
          },
          { header: "Status Kepegawaian", key: "status", width: 16, align: "center", getter: (e) => e.status },
        ],
        data: filteredEmployees,
        orientation: "landscape",
      });

      showToast(`✓ Berhasil mengunduh ${filteredEmployees.length} data karyawan ke format Excel (.xlsx)!`, "success");
    } catch (err) {
      console.error("Export Employees Error:", err);
      showToast("Gagal mengekspor data karyawan ke Excel!", "error");
    }
  };

  // 3. Ekspor Pengajuan & Riwayat Cuti (Mendukung ekspor sesuai filter/tab aktif)
  const handleExportLeavesExcel = async (
    customLeaves?: LeaveRequest[],
    filterLabel?: string
  ) => {
    const defaultLeaves = leaveActiveTab === "subordinate-leaves" ? subordinateLeaves : myLeaves;
    const targetLeaves = Array.isArray(customLeaves) ? customLeaves : defaultLeaves;
    if (targetLeaves.length === 0) {
      showToast("Tidak ada data pengajuan cuti untuk diekspor!", "error");
      return;
    }

    try {
      const todayStr = new Date()
        .toLocaleDateString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Makassar",
        })
        .replace(/\//g, "-");
      const fileName = `Laporan_Pengajuan_Cuti_${todayStr}.xlsx`;

      const disetujuiCount = targetLeaves.filter((l) => l.status === "DISETUJUI").length;
      const pendingCount = targetLeaves.filter((l) => l.status === "MENUNGGU").length;
      const ditolakCount = targetLeaves.filter((l) => l.status === "DITOLAK").length;

      const baseCategory =
        leaveActiveTab === "subordinate-leaves"
          ? "Persetujuan Cuti Tim / Bawahan"
          : "Riwayat Cuti Mandiri";
      const periodInfo = filterLabel
        ? `${baseCategory} • ${filterLabel}`
        : `Kategori: ${baseCategory}`;

      await runExcelExport<LeaveRequest>({
        fileName,
        sheetName: "Data Cuti",
        kopSurat: getCompanyKopSurat(
          "Laporan Pengajuan & Persetujuan Cuti Karyawan",
          periodInfo
        ),
        summaryMetrics: [
          { label: "Total Pengajuan", value: `${targetLeaves.length} Berkas` },
          { label: "Disetujui", value: `${disetujuiCount} Berkas` },
          { label: "Menunggu Approval", value: `${pendingCount} Berkas` },
          { label: "Ditolak", value: `${ditolakCount} Berkas` },
        ],
        columns: [
          { header: "No", key: "no", width: 6, align: "center", getter: (_, idx) => idx + 1 },
          { header: "ID Cuti", key: "id", width: 14, align: "center", getter: (l) => l.id },
          { header: "Nama Karyawan", key: "name", width: 24, align: "left", getter: (l) => l.name },
          { header: "Departemen", key: "dept", width: 16, align: "left", getter: (l) => l.dept },
          { header: "Tipe Cuti", key: "type", width: 14, align: "center", getter: (l) => l.type },
          { header: "Tgl Mulai", key: "start", type: "date", width: 14, align: "center", getter: (l) => l.start },
          { header: "Tgl Selesai", key: "end", type: "date", width: 14, align: "center", getter: (l) => l.end },
          { header: "Durasi (Hari)", key: "days", width: 13, align: "right", format: "#,##0", getter: (l) => l.days },
          { header: "Alasan Cuti", key: "reason", width: 30, align: "left", wrapText: true, getter: (l) => l.reason },
          { header: "Status", key: "status", width: 16, align: "center", getter: (l) => l.status },
          { header: "Atasan Penyetuju (N+1)", key: "approver", width: 22, align: "left", getter: (l) => l.approverName || "-" },
          { header: "Tgl Disetujui", key: "approvedAt", type: "date", width: 16, align: "center", getter: (l) => l.approvedAt || "-" },
        ],
        data: targetLeaves,
        orientation: "landscape",
      });

      showToast(`✓ Berhasil mengunduh ${targetLeaves.length} data cuti ke format Excel (.xlsx)!`, "success");
    } catch (err) {
      console.error("Export Leaves Error:", err);
      showToast("Gagal mengekspor data cuti ke Excel!", "error");
    }
  };

  // 4. Ekspor Audit Log Aktivitas & Modifikasi Manual
  const handleExportAuditLogsExcel = async () => {
    if (filteredActivityLogs.length === 0) {
      showToast("Tidak ada data audit log untuk diekspor!", "error");
      return;
    }

    try {
      const todayStr = new Date()
        .toLocaleDateString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Makassar",
        })
        .replace(/\//g, "-");
      const fileName = `Laporan_Audit_Log_${todayStr}.xlsx`;

      const manualCount = filteredActivityLogs.filter((l) => l.isEdited).length;
      const autoCount = filteredActivityLogs.filter((l) => !l.isEdited).length;

      await runExcelExport<ActivityLog>({
        fileName,
        sheetName: "Audit Log",
        kopSurat: getCompanyKopSurat(
          "Laporan Audit Trail Aktivitas Kehadiran & Sistem",
          `Filter Dept: ${logDeptFilter} • Jenis Log: ${logTypeFilter}`
        ),
        summaryMetrics: [
          { label: "Total Aktivitas", value: `${filteredActivityLogs.length} Log` },
          { label: "Modifikasi Manual (Merah)", value: `${manualCount} Log` },
          { label: "Aktivitas Otomatis", value: `${autoCount} Log` },
        ],
        columns: [
          { header: "No", key: "no", width: 6, align: "center", getter: (_, idx) => idx + 1 },
          { header: "ID Log", key: "id", width: 14, align: "center", getter: (l) => l.id },
          { header: "Waktu Aktivitas (WITA)", key: "timestamp", type: "datetime", width: 22, align: "center", getter: (l) => l.timestamp },
          { header: "Tipe Log", key: "type", width: 16, align: "center", getter: (l) => l.type },
          { header: "Judul Aktivitas", key: "title", width: 28, align: "left", getter: (l) => l.title },
          { header: "Karyawan Terkait", key: "employeeName", width: 24, align: "left", getter: (l) => l.employeeName },
          { header: "Departemen", key: "dept", width: 15, align: "left", getter: (l) => l.dept },
          { header: "Aktor Pelaksana", key: "actorName", width: 22, align: "left", getter: (l) => l.actorName },
          { header: "Role Aktor", key: "actorRole", width: 20, align: "left", getter: (l) => l.actorRole },
          { header: "Status", key: "isEdited", width: 16, align: "center", getter: (l) => (l.isEdited ? "Modifikasi Manual" : "Otomatis") },
          { header: "Alasan Koreksi Manual", key: "editReason", width: 32, align: "left", wrapText: true, getter: (l) => l.editReason || "-" },
        ],
        data: filteredActivityLogs,
        orientation: "landscape",
      });

      showToast(`✓ Berhasil mengunduh ${filteredActivityLogs.length} audit log ke format Excel (.xlsx)!`, "success");
    } catch (err) {
      console.error("Export Audit Logs Error:", err);
      showToast("Gagal mengekspor audit log ke Excel!", "error");
    }
  };

  // 5. Ekspor Jadwal Roster Shift Mingguan
  const handleExportWeeklyScheduleExcel = async () => {
    const schedEmployees = getSchedulableEmployees();
    if (schedEmployees.length === 0) {
      showToast("Tidak ada jadwal shift untuk diekspor!", "error");
      return;
    }

    try {
      const todayStr = new Date()
        .toLocaleDateString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Makassar",
        })
        .replace(/\//g, "-");
      const fileName = `Laporan_Roster_Shift_Mingguan_${todayStr}.xlsx`;

      const days: DayOfWeek[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

      await runExcelExport<Employee>({
        fileName,
        sheetName: "Roster Shift",
        kopSurat: getCompanyKopSurat(
          "Laporan Penjadwalan Roster Kerja Mingguan (7 Hari)",
          `Mulai Tanggal: ${rosterWeekStart}`
        ),
        summaryMetrics: [
          { label: "Total Karyawan Terjadwal", value: `${schedEmployees.length} Orang` },
          { label: "Shift Pagi", value: "07:00 - 15:00 WITA" },
          { label: "Shift Siang", value: "14:00 - 22:00 WITA" },
          { label: "Libur (OFF)", value: "Jadwal Istirahat" },
        ],
        columns: [
          { header: "No", key: "no", width: 6, align: "center", getter: (_, idx) => idx + 1 },
          { header: "ID Karyawan", key: "id", width: 14, align: "center", getter: (e) => e.id },
          { header: "Nama Karyawan", key: "name", width: 24, align: "left", getter: (e) => e.name },
          { header: "Departemen", key: "dept", width: 16, align: "left", getter: (e) => e.dept },
          { header: "Senin", key: "senin", width: 14, align: "center", getter: (e) => (weeklySchedules[e.id]?.Senin || "Pagi") },
          { header: "Selasa", key: "selasa", width: 14, align: "center", getter: (e) => (weeklySchedules[e.id]?.Selasa || "Pagi") },
          { header: "Rabu", key: "rabu", width: 14, align: "center", getter: (e) => (weeklySchedules[e.id]?.Rabu || "Pagi") },
          { header: "Kamis", key: "kamis", width: 14, align: "center", getter: (e) => (weeklySchedules[e.id]?.Kamis || "Pagi") },
          { header: "Jumat", key: "jumat", width: 14, align: "center", getter: (e) => (weeklySchedules[e.id]?.Jumat || "Pagi") },
          { header: "Sabtu", key: "sabtu", width: 14, align: "center", getter: (e) => (weeklySchedules[e.id]?.Sabtu || "Libur") },
          { header: "Minggu", key: "minggu", width: 14, align: "center", getter: (e) => (weeklySchedules[e.id]?.Minggu || "Libur") },
          {
            header: "Total Shift Masuk",
            key: "workDays",
            width: 16,
            align: "right",
            format: "#,##0",
            getter: (e) => {
              const sched = weeklySchedules[e.id] || {
                Senin: "Pagi",
                Selasa: "Pagi",
                Rabu: "Pagi",
                Kamis: "Pagi",
                Jumat: "Pagi",
                Sabtu: "Libur",
                Minggu: "Libur",
              };
              return days.filter((d) => sched[d] !== "Libur").length;
            },
          },
          {
            header: "Total Libur (OFF)",
            key: "offDays",
            width: 16,
            align: "right",
            format: "#,##0",
            getter: (e) => {
              const sched = weeklySchedules[e.id] || {
                Senin: "Pagi",
                Selasa: "Pagi",
                Rabu: "Pagi",
                Kamis: "Pagi",
                Jumat: "Pagi",
                Sabtu: "Libur",
                Minggu: "Libur",
              };
              return days.filter((d) => sched[d] === "Libur").length;
            },
          },
        ],
        data: schedEmployees,
        orientation: "landscape",
      });

      showToast(`✓ Berhasil mengunduh ${schedEmployees.length} jadwal roster ke format Excel (.xlsx)!`, "success");
    } catch (err) {
      console.error("Export Roster Error:", err);
      showToast("Gagal mengekspor jadwal roster ke Excel!", "error");
    }
  };

  // 6. Ekspor Jurnal Kerja Harian (Mendukung ekspor sesuai filter/tab aktif)
  const handleExportJournalsExcel = async (
    customJournals?: WorkJournal[],
    filterLabel?: string
  ) => {
    const targetJournals = Array.isArray(customJournals) ? customJournals : visibleJournals;

    if (targetJournals.length === 0) {
      showToast("Tidak ada data jurnal kerja untuk diekspor!", "error");
      return;
    }

    try {
      const todayStr = new Date()
        .toLocaleDateString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Makassar",
        })
        .replace(/\//g, "-");
      const fileName = `Laporan_Jurnal_Kerja_${todayStr}.xlsx`;

      const avgScore =
        targetJournals.length > 0
          ? (
              targetJournals.reduce((acc, j) => acc + j.score, 0) / targetJournals.length
            ).toFixed(1) + "%"
          : "0%";

      const baseCategory = isStaff
        ? `Jurnal Mandiri (${currentActiveEmployee.name})`
        : "Laporan Jurnal Tim";
      const periodInfo = filterLabel ? `${baseCategory} • ${filterLabel}` : `Kategori: ${baseCategory}`;

      await runExcelExport<WorkJournal>({
        fileName,
        sheetName: "Jurnal Kerja",
        kopSurat: getCompanyKopSurat(
          "Laporan Jurnal Kerja Harian Karyawan",
          periodInfo
        ),
        summaryMetrics: [
          { label: "Total Jurnal Tercatat", value: `${targetJournals.length} Laporan` },
          { label: "Rata-rata Skor Kualitas", value: avgScore },
        ],
        columns: [
          { header: "No", key: "no", width: 6, align: "center", getter: (_, idx) => idx + 1 },
          { header: "ID Jurnal", key: "id", width: 14, align: "center", getter: (j) => j.id },
          { header: "Tanggal", key: "date", type: "date", width: 14, align: "center", getter: (j) => j.date },
          { header: "Nama Karyawan", key: "name", width: 24, align: "left", getter: (j) => j.name },
          { header: "Departemen", key: "dept", width: 16, align: "left", getter: (j) => j.dept },
          { header: "Durasi Jam Kerja", key: "hours", width: 16, align: "center", getter: (j) => j.hours },
          { header: "Skor Kualitas (%)", key: "score", width: 16, align: "right", format: '0.0"%"', getter: (j) => j.score },
          { header: "Rincian Tugas / Aktivitas", key: "tasks", width: 45, align: "left", wrapText: true, getter: (j) => j.tasks.join("; ") },
          { header: "Catatan Reviewer", key: "notes", width: 30, align: "left", wrapText: true, getter: (j) => j.notes || "-" },
        ],
        data: targetJournals,
        orientation: "landscape",
      });

      showToast(`✓ Berhasil mengunduh ${targetJournals.length} jurnal kerja ke format Excel (.xlsx)!`, "success");
    } catch (err) {
      console.error("Export Journals Error:", err);
      showToast("Gagal mengekspor jurnal kerja ke Excel!", "error");
    }
  };

  // Filter Data Audit Log Aktivitas (Menu SISTEM -> Audit Log, terisolasi dari filter Rekap Absensi)
  const filteredActivityLogs = activityLogs.filter((log) => {
    const matchDept = logDeptFilter === "ALL" || log.dept === logDeptFilter;
    const matchType =
      logTypeFilter === "ALL" ||
      (logTypeFilter === "MANUAL_EDIT" && log.isEdited) ||
      (logTypeFilter === "AUTO" && !log.isEdited);
    const q = logSearchQuery.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      log.employeeName.toLowerCase().includes(q) ||
      log.actorName.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      Boolean(log.editReason && log.editReason.toLowerCase().includes(q));
    return matchDept && matchType && matchSearch;
  });

  return {
    DAYS_OF_WEEK,
    activeMenu,
    activePerspective,
    activityLogs,
    addRegistrationType,
    allPermissions,
    antiSpoofScore,
    attendanceState,
    attendances,
    canApproveLeaves,
    calculateHaversineDistance,
    canViewAllAttendances,
    canViewTeamAttendances,
    challengeDefinitions,
    challengeStepStatus,
    companyLogoInputRef,
    companyLogoUrl,
    companyName,
    companyProfile,
    companyProfileForm,
    confirmDialog,
    copyCredentialsToClipboard,
    currentActiveEmployee,
    currentChallengeIndex,
    currentMeta,
    currentRoleName,
    currentTime: "--:-- WITA",
    getCurrentTime: getFormattedServerTime,
    getFormattedServerTime,
    cutiOverrideConfirm,
    deleteShiftConfirm,
    directSubordinates,
    directSuperior,
    draftSchedule,
    editAttendanceForm,
    editingAttendance,
    editingEmployee,
    editingShiftId,
    employees,
    fileInputRef,
    filterDept,
    filterShift,
    filteredActivityLogs,
    filteredAttendances,
    filteredEmployees,
    filteredUsers,
    forcedPasswordForm,
    formatDateISO,
    formatDateShort,
    generateRandomPassword,
    getDirectSubordinates,
    getDirectSuperior,
    getLeaveOnDate,
    getMondayOfWeek,
    getSchedulableEmployees,
    getVisibleEmployees,
    handleApplyLeaveSubmit,
    handleApproveLeave,
    handleCheckIn,
    handleConfirmAction,
    handleDeleteShift,
    handleDeptChange,
    handleExportAuditLogsExcel,
    handleExportCSV,
    handleExportEmployeesExcel,
    handleExportExcel,
    handleExportJournalsExcel,
    handleExportLeavesExcel,
    handleExportWeeklyScheduleExcel,
    handleForcedPasswordSubmit,
    handleLevelChange,
    handleLogoUpload,
    handleOpenAddShift,
    handleOpenEditAttendance,
    handleOpenEditModal,
    handleOpenEditShift,
    handlePassCurrentChallenge,
    handleRegisterEmployeeSubmit,
    handleRejectLeave,
    handleRemoveCompanyLogo,
    handleSaveCompanyProfile,
    handleSaveEditAttendance,
    handleSaveEditEmployee,
    handleSaveJournal,
    handleSaveOfficeSettings,
    handleSaveShift,
    handleSaveWeeklySchedule,
    handleSelectScheduleEmployee,
    handleSimulateSpoofAttack,
    handleUpdateCompanyLogo,
    hasPermission,
    isCapturing,
    isEditingCompany,
    isFaceScoreValid,
    isForcedPasswordRequired,
    isMobileSidebarOpen,
    isMobileSimulated,
    isOutOfGeofenceRadius,
    isStaff,
    isSuspiciousFakeGps,
    isWebcamActive,
    isWithinGeofence,
    journalForm,
    journals,
    leaveActiveTab,
    leaves,
    livenessChallengeSequence,
    livenessPassed,
    logDeptFilter,
    logSearchQuery,
    logTypeFilter,
    menuMeta,
    myLeaves,
    myPendingLeavesCount,
    myRemainingQuota,
    myUsedLeaveDays,
    newEmployeeForm,
    newLeaveForm,
    newlyCreatedCredentials,
    openAddEmployeeModal,
    openSections,
    pendingSubordinateCount,
    pengaturanTab,
    rekapDeptFilter,
    rekapLogTypeFilter,
    rekapSearchQuery,
    rekapStatusFilter,
    rolePermissions,
    rosterDayDates,
    rosterWeekStart,
    saveCompanyName,
    searchEmployeeQuery,
    selectedEmployee,
    selectedEmployeeId,
    selectedScheduleEmpId,
    setActiveMenu,
    setActivePerspective,
    setActivityLogs,
    setAddRegistrationType,
    setAntiSpoofScore,
    setAttendanceState,
    setAttendances,
    setChallengeStepStatus,
    setCompanyLogoUrl,
    setCompanyName,
    setCompanyProfile,
    setCompanyProfileForm,
    setConfirmDialog,
    setCurrentChallengeIndex,
    setCurrentTime: () => {},
    setCutiOverrideConfirm,
    setDeleteShiftConfirm,
    setDraftSchedule,
    setEditAttendanceForm,
    setEditingAttendance,
    setEditingEmployee,
    setEditingShiftId,
    setEmployees,
    setFilterDept,
    setFilterShift,
    setForcedPasswordForm,
    setIsCapturing,
    setIsEditingCompany,
    setIsMobileSimulated,
    setIsWebcamActive,
    setJournalForm,
    setJournals,
    setLeaveActiveTab,
    setLeaves,
    setLivenessChallengeSequence,
    setLivenessPassed,
    setLogDeptFilter,
    setLogSearchQuery,
    setLogTypeFilter,
    setNewEmployeeForm,
    setNewLeaveForm,
    setNewlyCreatedCredentials,
    setOpenSections,
    setPengaturanTab,
    setRekapDeptFilter,
    setRekapLogTypeFilter,
    setRekapSearchQuery,
    setRekapStatusFilter,
    setRolePermissions,
    setRosterWeekStart,
    setSearchEmployeeQuery,
    setSelectedEmployeeId,
    setSelectedScheduleEmpId,
    setSettings,
    setShiftActiveTab,
    setShiftForm,
    setShifts,
    setIsMobileSidebarOpen,
    setShowAddEmployeeModal,
    setShowAddJournalModal,
    setShowApplyLeaveModal,
    setShowCredentialsModal,
    setShowDeviceSimulator,
    setShowEditAttendanceModal,
    setShowEditEmployeeModal,
    setShowPasswordModal,
    setShowLogoutConfirm,
    setShowShiftModal,
    setSimulatedDeviceId,
    setSimulatedDistance,
    setSimulatedFaceScore,
    setSpoofAlertDetails,
    setTempCompanyName,
    setToastMessage,
    setUserDeptFilter,
    setUserSearchQuery,
    setUsers,
    setWeeklySchedules,
    settings,
    shiftActiveTab,
    shiftForm,
    shifts,
    showAddEmployeeModal,
    showAddJournalModal,
    showApplyLeaveModal,
    showCredentialsModal,
    showDeviceSimulator,
    showEditAttendanceModal,
    showEditEmployeeModal,
    showPasswordModal,
    showLogoutConfirm,
    showShiftModal,
    showToast,
    simulatedDeviceId,
    simulatedDistance,
    simulatedFaceScore,
    spoofAlertDetails,
    standardDepartments,
    startLevel4Liveness,
    subordinateLeaves,
    tempCompanyName,
    toastMessage,
    togglePermission,
    toggleSection,
    toggleWebcam,
    stopWebcam,
    userDeptFilter,
    userSearchQuery,
    users,
    videoRef,
    visibleAttendances,
    visibleEmployees,
    visibleJournals,
    weeklySchedules,
  };
}

type AppContextType = ReturnType<typeof useAppProviderValue>;
const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = useAppProviderValue();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
