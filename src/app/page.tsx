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
  UserPlus,
  Lock,
  Layers,
  SlidersHorizontal,
  ChevronLeft,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// DATA TYPES
// ─────────────────────────────────────────────────────────────
interface Employee {
  id: string;
  nik: string;
  name: string;
  email: string;
  dept: string;
  role: string;
  level: "Senior" | "Mid" | "Staff";
  shiftId: string;
  contractType: "Tetap" | "Kontrak";
  joinDate: string;
  tenure: string;
  faceRegistered: boolean;
  faceScore: number;
  status: "Aktif" | "Cuti" | "Non-Aktif";
  avatar: string;
}

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  tolerance: string;
  openBefore: string;
  status: "Aktif" | "Non-Aktif";
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  nik: string;
  dept: string;
  shift: string;
  in: string;
  out: string;
  dist: number;
  score: number;
  status: "APPROVED" | "TERLAMBAT" | "DITOLAK";
  date: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  name: string;
  dept: string;
  type: "Tahunan" | "Sakit" | "Melahirkan" | "Khusus";
  start: string;
  end: string;
  days: number;
  reason: string;
  status: "MENUNGGU" | "DISETUJUI" | "DITOLAK";
}

interface WorkJournal {
  id: string;
  employeeId: string;
  name: string;
  dept: string;
  avatar: string;
  date: string;
  hours: string;
  score: number;
  tasks: string[];
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "HR Manager" | "Staff";
  dept: string;
  lastLogin: string;
  status: "AKTIF" | "NON-AKTIF";
}

export default function Home() {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");

  // Dynamic Company Profile State
  const [companyName, setCompanyName] = useState<string>("AbsenKu");
  const [isEditingCompany, setIsEditingCompany] = useState<boolean>(false);
  const [tempCompanyName, setTempCompanyName] = useState<string>("AbsenKu");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  // ─────────────────────────────────────────────────────────────
  // CENTRAL INTERCONNECTED DATA STATE
  // ─────────────────────────────────────────────────────────────

  // 1. Employees Master Data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "emp-1",
      nik: "2026-0891",
      name: "Budi Pratama",
      email: "budi@perusahaan.id",
      dept: "IT Operations",
      role: "Sr. Software Eng",
      level: "Senior",
      shiftId: "shift-1",
      contractType: "Tetap",
      joinDate: "01 Jan 2024",
      tenure: "2 Thn 10 Bln",
      faceRegistered: true,
      faceScore: 96.4,
      status: "Aktif",
      avatar: "BP",
    },
    {
      id: "emp-2",
      nik: "2026-0412",
      name: "Siti Rahmawati",
      email: "siti@perusahaan.id",
      dept: "HR & People",
      role: "HR Specialist",
      level: "Mid",
      shiftId: "shift-1",
      contractType: "Tetap",
      joinDate: "15 Mar 2024",
      tenure: "2 Thn 8 Bln",
      faceRegistered: true,
      faceScore: 98.1,
      status: "Aktif",
      avatar: "SR",
    },
    {
      id: "emp-3",
      nik: "2026-0775",
      name: "Andi Saputra",
      email: "andi@perusahaan.id",
      dept: "Finance",
      role: "Finance Officer",
      level: "Mid",
      shiftId: "shift-1",
      contractType: "Tetap",
      joinDate: "10 Feb 2024",
      tenure: "2 Thn 9 Bln",
      faceRegistered: true,
      faceScore: 93.7,
      status: "Aktif",
      avatar: "AS",
    },
    {
      id: "emp-4",
      nik: "2026-0219",
      name: "Dewi Lestari",
      email: "dewi@perusahaan.id",
      dept: "Marketing",
      role: "Marketing Lead",
      level: "Senior",
      shiftId: "shift-1",
      contractType: "Tetap",
      joinDate: "05 Jun 2024",
      tenure: "2 Thn 5 Bln",
      faceRegistered: true,
      faceScore: 95.2,
      status: "Aktif",
      avatar: "DL",
    },
    {
      id: "emp-5",
      nik: "2026-0155",
      name: "Rian Hidayat",
      email: "rian@perusahaan.id",
      dept: "Operations",
      role: "Operations Staff",
      level: "Staff",
      shiftId: "shift-2",
      contractType: "Tetap",
      joinDate: "20 Apr 2024",
      tenure: "2 Thn 7 Bln",
      faceRegistered: true,
      faceScore: 94.0,
      status: "Aktif",
      avatar: "RH",
    },
    {
      id: "emp-6",
      nik: "2026-0348",
      name: "Maya Indah",
      email: "maya@perusahaan.id",
      dept: "Legal & Compliance",
      role: "Legal Specialist",
      level: "Mid",
      shiftId: "shift-2",
      contractType: "Tetap",
      joinDate: "12 Aug 2024",
      tenure: "2 Thn 3 Bln",
      faceRegistered: true,
      faceScore: 97.5,
      status: "Aktif",
      avatar: "MI",
    },
  ]);

  // 2. Shifts Master Data
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: "shift-1",
      name: "Shift Pagi (Utama)",
      startTime: "07:00",
      endTime: "15:00",
      tolerance: "15 Menit",
      openBefore: "60 Menit",
      status: "Aktif",
    },
    {
      id: "shift-2",
      name: "Shift Siang (Operasional)",
      startTime: "15:00",
      endTime: "23:00",
      tolerance: "15 Menit",
      openBefore: "45 Menit",
      status: "Aktif",
    },
    {
      id: "shift-3",
      name: "Shift Malam (Teknis / Lintas Hari)",
      startTime: "23:00",
      endTime: "07:00",
      tolerance: "10 Menit",
      openBefore: "30 Menit",
      status: "Aktif",
    },
  ]);

  // 3. Departments Data
  const [departments, setDepartments] = useState([
    { id: "dept-1", name: "IT Operations", head: "Budi Pratama", color: "from-blue-900/40 to-blue-950/60", border: "border-blue-700/40", badge: "bg-blue-500/20 text-blue-200" },
    { id: "dept-2", name: "HR & People", head: "Siti Rahmawati", color: "from-pink-900/40 to-pink-950/60", border: "border-pink-700/40", badge: "bg-pink-500/20 text-pink-200" },
    { id: "dept-3", name: "Finance", head: "Andi Saputra", color: "from-amber-900/40 to-amber-950/60", border: "border-amber-700/40", badge: "bg-amber-500/20 text-amber-200" },
    { id: "dept-4", name: "Marketing", head: "Dewi Lestari", color: "from-purple-900/40 to-purple-950/60", border: "border-purple-700/40", badge: "bg-purple-500/20 text-purple-200" },
    { id: "dept-5", name: "Operations", head: "Rian Hidayat", color: "from-teal-900/40 to-teal-950/60", border: "border-teal-700/40", badge: "bg-teal-500/20 text-teal-200" },
    { id: "dept-6", name: "Legal & Compliance", head: "Maya Indah", color: "from-emerald-900/40 to-emerald-950/60", border: "border-emerald-700/40", badge: "bg-emerald-500/20 text-emerald-200" },
  ]);

  // 4. Attendances State (Real-time Log)
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([
    { id: "att-1", employeeId: "emp-1", name: "Budi Pratama", nik: "2026-0891", dept: "IT Operations", shift: "Shift Pagi (Utama)", in: "07:42 WIB", out: "15:02 WIB", dist: 14.2, score: 96.4, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-2", employeeId: "emp-2", name: "Siti Rahmawati", nik: "2026-0412", dept: "HR & People", shift: "Shift Pagi (Utama)", in: "07:35 WIB", out: "15:00 WIB", dist: 8.5, score: 98.1, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-3", employeeId: "emp-3", name: "Andi Saputra", nik: "2026-0775", dept: "Finance", shift: "Shift Pagi (Utama)", in: "07:58 WIB", out: "15:15 WIB", dist: 24.1, score: 93.7, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-4", employeeId: "emp-4", name: "Dewi Lestari", nik: "2026-0219", dept: "Marketing", shift: "Shift Pagi (Utama)", in: "08:04 WIB", out: "--:--", dist: 18.9, score: 95.2, status: "TERLAMBAT", date: "17 Nov 2026" },
  ]);

  // 5. Leave Requests State
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: "lv-1", employeeId: "emp-1", name: "Budi Pratama", dept: "IT Operations", type: "Tahunan", start: "10 Nov 2026", end: "14 Nov 2026", days: 5, reason: "Keperluan keluarga", status: "DISETUJUI" },
    { id: "lv-2", employeeId: "emp-2", name: "Siti Rahmawati", dept: "HR & People", type: "Sakit", start: "15 Nov 2026", end: "16 Nov 2026", days: 2, reason: "Demam & rekomendasi istirahat dokter", status: "DISETUJUI" },
    { id: "lv-3", employeeId: "emp-3", name: "Andi Saputra", dept: "Finance", type: "Tahunan", start: "20 Nov 2026", end: "22 Nov 2026", days: 3, reason: "Liburan akhir tahun", status: "MENUNGGU" },
    { id: "lv-4", employeeId: "emp-4", name: "Dewi Lestari", dept: "Marketing", type: "Melahirkan", start: "01 Dec 2026", end: "31 Jan 2027", days: 61, reason: "Cuti melahirkan anak pertama", status: "MENUNGGU" },
    { id: "lv-5", employeeId: "emp-5", name: "Rian Hidayat", dept: "Operations", type: "Tahunan", start: "05 Nov 2026", end: "07 Nov 2026", days: 3, reason: "Urusan pindah domisili pribadi", status: "DITOLAK" },
  ]);

  // 6. Work Journals State
  const [journals, setJournals] = useState<WorkJournal[]>([
    {
      id: "jrn-1",
      employeeId: "emp-1",
      name: "Budi Pratama",
      dept: "IT Operations",
      avatar: "BP",
      date: "17 Nov 2026",
      hours: "7j 48m",
      score: 92,
      tasks: [
        "Deploy hotfix auth module ke staging server",
        "Review PR #42 — rate limiter & security policy",
        "Meeting sprint planning tim engineering 1 jam",
      ],
    },
    {
      id: "jrn-2",
      employeeId: "emp-2",
      name: "Siti Rahmawati",
      dept: "HR & People",
      avatar: "SR",
      date: "17 Nov 2026",
      hours: "7j 25m",
      score: 88,
      tasks: [
        "Proses onboarding 1 karyawan baru divisi tech",
        "Update database biometrik & embedding wajah",
        "Rekap absensi mingguan seluruh divisi",
      ],
    },
    {
      id: "jrn-3",
      employeeId: "emp-3",
      name: "Andi Saputra",
      dept: "Finance",
      avatar: "AS",
      date: "17 Nov 2026",
      hours: "8j 10m",
      score: 95,
      tasks: [
        "Rekonsiliasi jurnal pengeluaran kantor November",
        "Approve invoice vendor cloud & lisensi software",
        "Draft laporan arus kas Q4 divisi finance",
      ],
    },
    {
      id: "jrn-4",
      employeeId: "emp-6",
      name: "Maya Indah",
      dept: "Legal & Compliance",
      avatar: "MI",
      date: "17 Nov 2026",
      hours: "6j 50m",
      score: 85,
      tasks: [
        "Review draf kontrak kerjasama vendor penyedia server",
        "Audit berkas NDA & SOP compliance regulasi 2026",
      ],
    },
  ]);

  // 7. System Users State
  const [users, setUsers] = useState<SystemUser[]>([
    { id: "usr-1", name: "Admin Sistem", email: "admin@absenku.id", role: "Super Admin", dept: "SISTEM", lastLogin: "17 Nov 2026 10:30", status: "AKTIF" },
    { id: "usr-2", name: "Siti Rahmawati", email: "siti@perusahaan.id", role: "HR Manager", dept: "HR & People", lastLogin: "17 Nov 2026 09:15", status: "AKTIF" },
    { id: "usr-3", name: "Budi Pratama", email: "budi@perusahaan.id", role: "Staff", dept: "IT Operations", lastLogin: "17 Nov 2026 10:42", status: "AKTIF" },
    { id: "usr-4", name: "Andi Saputra", email: "andi@perusahaan.id", role: "Staff", dept: "Finance", lastLogin: "17 Nov 2026 08:50", status: "AKTIF" },
    { id: "usr-5", name: "Dewi Lestari", email: "dewi@perusahaan.id", role: "Staff", dept: "Marketing", lastLogin: "16 Nov 2026 17:22", status: "AKTIF" },
    { id: "usr-6", name: "Rian Hidayat", email: "rian@perusahaan.id", role: "Staff", dept: "Operations", lastLogin: "17 Nov 2026 07:35", status: "AKTIF" },
    { id: "usr-7", name: "Maya Indah", email: "maya@perusahaan.id", role: "Staff", dept: "Legal & Compliance", lastLogin: "16 Nov 2026 16:00", status: "AKTIF" },
  ]);

  // 8. Office Geofence & System Settings State
  const [settings, setSettings] = useState({
    officeName: "Kantor Pusat - Sudirman Tower Lt. 12",
    latitude: -6.2088,
    longitude: 106.8456,
    geofenceRadius: 50, // in meters
    aiFaceThreshold: 80, // min score %
  });

  // ─────────────────────────────────────────────────────────────
  // INTERCONNECTED FILTERS & SELECTION STATE
  // ─────────────────────────────────────────────────────────────
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("emp-1");
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  // Filters for Employee Directory
  const [filterDept, setFilterDept] = useState<string>("ALL");
  const [filterShift, setFilterShift] = useState<string>("ALL");
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState<string>("");

  // Absensi Simulator State
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [attendanceState, setAttendanceState] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [simulatedDistance, setSimulatedDistance] = useState<number>(14.2);
  const [simulatedFaceScore, setSimulatedFaceScore] = useState<number>(96.4);

  // Modals Open State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [showAddJournalModal, setShowAddJournalModal] = useState(false);
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form States for Modals
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    nik: "",
    email: "",
    dept: "IT Operations",
    role: "",
    shiftId: "shift-1",
    contractType: "Tetap" as "Tetap" | "Kontrak",
  });

  const [newLeave, setNewLeave] = useState({
    employeeId: "emp-1",
    type: "Tahunan" as "Tahunan" | "Sakit" | "Melahirkan" | "Khusus",
    start: "2026-11-20",
    end: "2026-11-22",
    days: 3,
    reason: "",
  });

  const [newJournal, setNewJournal] = useState({
    employeeId: "emp-1",
    task: "",
    hours: "8",
  });

  const [newShift, setNewShift] = useState({
    name: "",
    startTime: "08:00",
    endTime: "17:00",
    tolerance: "15 Menit",
    openBefore: "45 Menit",
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Staff" as "Super Admin" | "HR Manager" | "Staff",
    dept: "IT Operations",
  });

  // Selected Metric in Dashboard
  const [selectedMetric, setSelectedMetric] = useState<string>("all");

  // Geofence Evaluation
  const isWithinGeofence = simulatedDistance <= settings.geofenceRadius;
  const isFaceScoreValid = simulatedFaceScore >= settings.aiFaceThreshold;

  // ─────────────────────────────────────────────────────────────
  // INTERCONNECTED ACTIONS
  // ─────────────────────────────────────────────────────────────

  // 1. Process Check-In (Absensi)
  const handleCheckIn = () => {
    if (!livenessPassed) {
      showToast("Harap selesaikan uji liveness (kedipan mata) terlebih dahulu!", "error");
      return;
    }
    if (!isWithinGeofence) {
      showToast(`Gagal: Jarak Anda (${simulatedDistance}m) melebihi batas geofence (${settings.geofenceRadius}m)!`, "error");
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

      // Auto-create attendance entry
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: selectedEmployee.id,
        name: selectedEmployee.name,
        nik: selectedEmployee.nik,
        dept: selectedEmployee.dept,
        shift: shifts.find((s) => s.id === selectedEmployee.shiftId)?.name || "Shift Pagi (Utama)",
        in: currentTime || "07:45 WIB",
        out: "--:--",
        dist: simulatedDistance,
        score: simulatedFaceScore,
        status: "APPROVED",
        date: "17 Nov 2026",
      };

      setAttendances((prev) => [newRecord, ...prev]);
      showToast(`✓ Absensi ${selectedEmployee.name} BERHASIL disahkan secara otomatis (APPROVED)!`);
    }, 1200);
  };

  // 2. Approve or Reject Leave
  const handleUpdateLeaveStatus = (leaveId: string, newStatus: "DISETUJUI" | "DITOLAK") => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status: newStatus } : l))
    );
    showToast(`Pengajuan cuti telah diubah menjadi: ${newStatus}`);
  };

  // 3. Add New Employee Form Submit
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.nik) {
      showToast("Nama dan NIK wajib diisi!", "error");
      return;
    }

    const created: Employee = {
      id: `emp-${Date.now()}`,
      nik: newEmployee.nik,
      name: newEmployee.name,
      email: newEmployee.email || `${newEmployee.nik}@perusahaan.id`,
      dept: newEmployee.dept,
      role: newEmployee.role || "Staff Anggota",
      level: "Staff",
      shiftId: newEmployee.shiftId,
      contractType: newEmployee.contractType,
      joinDate: "17 Nov 2026",
      tenure: "Baru Bergabung",
      faceRegistered: true,
      faceScore: 95.0,
      status: "Aktif",
      avatar: newEmployee.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    };

    setEmployees((prev) => [...prev, created]);
    setShowAddEmployeeModal(false);
    showToast(`Karyawan baru ${created.name} berhasil didaftarkan!`);
  };

  // 4. Add Leave Request Form Submit
  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((emp) => emp.id === newLeave.employeeId) || selectedEmployee;
    const req: LeaveRequest = {
      id: `lv-${Date.now()}`,
      employeeId: emp.id,
      name: emp.name,
      dept: emp.dept,
      type: newLeave.type,
      start: newLeave.start,
      end: newLeave.end,
      days: Number(newLeave.days) || 1,
      reason: newLeave.reason || "Cuti permohonan dinas",
      status: "MENUNGGU",
    };
    setLeaves((prev) => [req, ...prev]);
    setShowAddLeaveModal(false);
    showToast(`Pengajuan cuti atas nama ${emp.name} berhasil diajukan!`);
  };

  // 5. Add Work Journal Form Submit
  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((emp) => emp.id === newJournal.employeeId) || selectedEmployee;
    if (!newJournal.task) {
      showToast("Tuliskan aktivitas pekerjaan Anda!", "error");
      return;
    }

    const journalEntry: WorkJournal = {
      id: `jrn-${Date.now()}`,
      employeeId: emp.id,
      name: emp.name,
      dept: emp.dept,
      avatar: emp.avatar,
      date: "17 Nov 2026",
      hours: `${newJournal.hours}j 00m`,
      score: 90,
      tasks: [newJournal.task],
    };

    setJournals((prev) => [journalEntry, ...prev]);
    setShowAddJournalModal(false);
    showToast(`Jurnal kerja untuk ${emp.name} berhasil disimpan!`);
  };

  // 6. Add Shift Form Submit
  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShift.name) {
      showToast("Nama shift wajib diisi!", "error");
      return;
    }
    const createdShift: Shift = {
      id: `shift-${Date.now()}`,
      name: newShift.name,
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      tolerance: newShift.tolerance,
      openBefore: newShift.openBefore,
      status: "Aktif",
    };
    setShifts((prev) => [...prev, createdShift]);
    setShowAddShiftModal(false);
    showToast(`Shift baru "${createdShift.name}" berhasil ditambahkan!`);
  };

  // 7. Add User Form Submit
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      showToast("Nama dan email wajib diisi!", "error");
      return;
    }
    const createdUser: SystemUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      dept: newUser.dept,
      lastLogin: "Baru Dibuat",
      status: "AKTIF",
    };
    setUsers((prev) => [...prev, createdUser]);
    setShowAddUserModal(false);
    showToast(`User ${createdUser.name} dengan hak akses ${createdUser.role} berhasil dibuat!`);
  };

  // 8. Save System Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("✓ Pengaturan geofence kantor & ambang batas AI berhasil disimpan!");
  };

  // 9. Quick Actions from Other Menus
  const navigateToKaryawanWithFilter = (deptName: string) => {
    setFilterDept(deptName);
    setFilterShift("ALL");
    setActiveMenu("karyawan");
  };

  const navigateToKaryawanWithShiftFilter = (shiftId: string) => {
    setFilterShift(shiftId);
    setFilterDept("ALL");
    setActiveMenu("karyawan");
  };

  const startAbsenForEmployee = (empId: string) => {
    setSelectedEmployeeId(empId);
    setAttendanceState("IDLE");
    setLivenessPassed(false);
    setActiveMenu("absensi");
    showToast(`Mode Absensi aktif untuk: ${employees.find((e) => e.id === empId)?.name}`);
  };

  // Dynamic Header Title & Subtitle per Active Menu
  const menuMeta: Record<string, { title: string; subtitle: string; icon: string }> = {
    dashboard: { title: "DASHBOARD", subtitle: `Ringkasan Data & Workforce Intelligence ${companyName}`, icon: "🏠" },
    karyawan: { title: "KARYAWAN", subtitle: `Direktori & Master Biometrik (${employees.length} Karyawan Aktif)`, icon: "👥" },
    departemen: { title: "DEPARTEMEN", subtitle: `Manajemen Struktur Organisasi (${departments.length} Unit Kerja)`, icon: "🏢" },
    jabatan: { title: "JABATAN", subtitle: "Daftar Posisi & Level Hirarki Karyawan", icon: "💼" },
    kontrak: { title: "KONTRAK & LIFECYCLE", subtitle: "Manajemen Kontrak, Status & Masa Kerja", icon: "📄" },
    absensi: { title: "ABSENSI (GPS & WAJAH)", subtitle: "Verifikasi Kehadiran Otomatis Real-Time & Auto-Approval", icon: "📍" },
    "rekap-absensi": { title: "REKAP ABSENSI", subtitle: `Laporan Kehadiran, Audit Trail & Export Data (${attendances.length} Log Hari Ini)`, icon: "📊" },
    "jadwal-shift": { title: "JADWAL SHIFT", subtitle: `Konfigurasi Shift Kerja Dinamis & Alokasi SDM (${shifts.length} Shift Aktif)`, icon: "📅" },
    "pengajuan-cuti": { title: "PENGAJUAN CUTI", subtitle: `Kelola & Pantau Pengajuan Cuti Karyawan (${leaves.filter((l) => l.status === "MENUNGGU").length} Menunggu)`, icon: "🏖️" },
    "jurnal-kerja": { title: "JURNAL KERJA", subtitle: `Catatan Aktivitas, Produktivitas & Log Harian (${journals.length} Jurnal Tercatat)`, icon: "📑" },
    "user-management": { title: "USER MANAGEMENT", subtitle: `Kelola Akun Pengguna & Hak Akses Sistem (${users.length} User Terdaftar)`, icon: "👤" },
    pengaturan: { title: "PENGATURAN SISTEM", subtitle: `Konfigurasi Geofence Kantor (${settings.geofenceRadius}m) & AI Match (${settings.aiFaceThreshold}%)`, icon: "⚙️" },
  };

  const currentMeta = menuMeta[activeMenu] ?? { title: activeMenu.toUpperCase(), subtitle: "", icon: "📋" };

  // Filtered Employees
  const filteredEmployees = employees.filter((emp) => {
    const matchDept = filterDept === "ALL" || emp.dept === filterDept;
    const matchShift = filterShift === "ALL" || emp.shiftId === filterShift;
    const matchSearch =
      searchEmployeeQuery === "" ||
      emp.name.toLowerCase().includes(searchEmployeeQuery.toLowerCase()) ||
      emp.nik.includes(searchEmployeeQuery) ||
      emp.dept.toLowerCase().includes(searchEmployeeQuery.toLowerCase());
    return matchDept && matchShift && matchSearch;
  });

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

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold transition-all animate-bounce ${
            toastMessage.type === "error"
              ? "bg-red-950/90 border-red-500/50 text-white"
              : "bg-[#042416]/95 border-emerald-400 text-white shadow-emerald-950/80"
          }`}
        >
          {toastMessage.type === "error" ? (
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* PANEL KIRI: LEBIH GELAP PEKAT (#010a06)                  */}
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
                    { id: "karyawan", label: "Karyawan", icon: "👥", badge: employees.length },
                    { id: "departemen", label: "Departemen", icon: "🏢", badge: departments.length },
                    { id: "jabatan", label: "Jabatan", icon: "💼" },
                    { id: "kontrak", label: "Kontrak & Lifecycle", icon: "📄" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === "karyawan") {
                          setFilterDept("ALL");
                          setFilterShift("ALL");
                        }
                        setActiveMenu(item.id);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-l-2 border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-900 text-white">
                          {item.badge}
                        </span>
                      )}
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
                    { id: "rekap-absensi", label: "Rekap Absensi", icon: "📊", badge: attendances.length },
                    { id: "jadwal-shift", label: "Jadwal Shift", icon: "📅", badge: shifts.length },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-l-2 border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-900 text-white">
                          {item.badge}
                        </span>
                      )}
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
                    { id: "pengajuan-cuti", label: "Pengajuan Cuti", icon: "🏖️", badge: leaves.length },
                    { id: "jurnal-kerja", label: "Jurnal Kerja", icon: "📑", badge: journals.length },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-l-2 border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-900 text-white">
                          {item.badge}
                        </span>
                      )}
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
                    { id: "user-management", label: "User Management", icon: "👤", badge: users.length },
                    { id: "pengaturan", label: "Pengaturan", icon: "⚙️" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-l-2 border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-900 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 bg-[#010704] rounded-xl border border-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-xs text-white ring-1 ring-emerald-500/40 flex-shrink-0">
              {selectedEmployee.avatar}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">{selectedEmployee.name}</span>
              <span className="text-[10px] text-white/80 block truncate">{selectedEmployee.role}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveMenu("absensi")}
            title="Buka Scanner Absensi"
            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all flex-shrink-0"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* PANEL KANAN: BERGRADASI HIJAU TUA MODERN                  */}
      {/* Background: Gradient dari #051f14 via #020d08 ke #010604  */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-[#051f14] via-[#020d08] to-[#010604] relative">
        {/* Modern Radial Lighting Effect in the Background */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-0" />

        {/* Top Header Row — Dinamis sesuai menu aktif */}
        <header className="px-8 pt-7 pb-4 flex items-center justify-between relative z-10 border-b border-emerald-950/40">
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

          {/* Right Header Action Buttons: Dark, Ganti Password, Keluar */}
          <div className="flex items-center gap-2.5 text-xs">
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

        {/* Content Body Based on Active Menu */}
        <div className="px-8 py-6 space-y-6 relative z-10">
          {/* ===================================================== */}
          {/* VIEW: DASHBOARD (PERSIS SEPERTI GAMBAR REFERENSI)    */}
          {/* ===================================================== */}
          {activeMenu === "dashboard" && (
            <div className="space-y-5">
              {/* BIG HERO CARD: Human Capital Overview dengan Gradasi Modern */}
              <div className="rounded-3xl bg-gradient-to-br from-[#072619] via-[#03150d] to-[#010a06] p-7 border border-emerald-500/25 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black tracking-widest uppercase text-amber-400">
                    {companyName.toUpperCase()} - WORKFORCE INTELLIGENCE
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#020e08] text-white text-[10px] font-extrabold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DATA {companyName.toUpperCase()}</span>
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-white">Human Capital Overview</h2>
                  <p className="text-xs text-white">Komposisi dan statistik SDM aktif</p>
                </div>

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
                      <div className="absolute text-center">
                        <span className="text-4xl font-black text-white font-mono block">
                          {employees.length}
                        </span>
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
                        <span className="font-mono text-white font-bold">
                          {employees.filter((e) => e.contractType === "Kontrak").length} •{" "}
                          {Math.round(
                            (employees.filter((e) => e.contractType === "Kontrak").length /
                              employees.length) *
                              100 || 0
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#010804] overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${
                              (employees.filter((e) => e.contractType === "Kontrak").length /
                                employees.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Progress Bar 2: Karyawan Tetap (Gold Bar) */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="text-white font-bold">Karyawan Tetap</span>
                        </div>
                        <span className="font-mono text-white font-bold">
                          {employees.filter((e) => e.contractType === "Tetap").length} •{" "}
                          {Math.round(
                            (employees.filter((e) => e.contractType === "Tetap").length /
                              employees.length) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#010804] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full shadow-sm shadow-amber-400/50"
                          style={{
                            width: `${
                              (employees.filter((e) => e.contractType === "Tetap").length /
                                employees.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* INSIGHT SDM Box (Persis Sesuai Gambar) */}
                    <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 mt-4">
                      <span className="text-[10px] font-black tracking-wider uppercase text-amber-400 block mb-1">
                        INSIGHT SDM
                      </span>
                      <p className="text-xs text-white font-medium">
                        Sebagian besar karyawan aktif berstatus tetap (
                        {Math.round(
                          (employees.filter((e) => e.contractType === "Tetap").length /
                            employees.length) *
                            100
                        )}
                        %). Auto-approval absensi aktif dengan toleransi geofence {settings.geofenceRadius}m.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 SUMMARY STAT CARDS (Persis Sesuai Gambar) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => {
                    setSelectedMetric("all");
                    setActiveMenu("karyawan");
                  }}
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
                  <div className="text-3xl font-black text-white font-mono">{employees.length}</div>
                  <span className="text-[10px] text-white mt-1 block">Klik untuk direktori</span>
                </div>

                <div
                  onClick={() => {
                    setSelectedMetric("kontrak");
                    setActiveMenu("kontrak");
                  }}
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
                  <div className="text-3xl font-black text-white font-mono">
                    {employees.filter((e) => e.contractType === "Kontrak").length}
                  </div>
                  <span className="text-[10px] text-white mt-1 block">Status kontrak aktif</span>
                </div>

                <div
                  onClick={() => {
                    setSelectedMetric("tetap");
                    setActiveMenu("kontrak");
                  }}
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
                  <div className="text-3xl font-black text-white font-mono">
                    {employees.filter((e) => e.contractType === "Tetap").length}
                  </div>
                  <span className="text-[10px] text-white mt-1 block">Status tetap</span>
                </div>

                <div
                  onClick={() => {
                    setSelectedMetric("user");
                    setActiveMenu("user-management");
                  }}
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
                  <div className="text-3xl font-black text-white font-mono">
                    {users.filter((u) => u.status === "AKTIF").length}
                  </div>
                  <span className="text-[10px] text-white mt-1 block">Akun sistem aktif</span>
                </div>
              </div>

              {/* ROW: METRIK TERPILIH & QUICK ATTENDANCE STAT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-[#062417] to-[#03150d] rounded-2xl p-5 border border-emerald-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                      LOG ABSENSI HARI INI
                    </span>
                    <h3 className="text-base font-bold text-white">Kehadiran Terverifikasi</h3>
                    <p className="text-xs text-white">
                      {attendances.filter((a) => a.status === "APPROVED").length} dari {employees.length} karyawan hadir sah.
                    </p>
                  </div>
                  <div className="text-4xl font-black text-white font-mono">
                    {attendances.filter((a) => a.status === "APPROVED").length}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#062417] to-[#03150d] rounded-2xl p-5 border border-emerald-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                      PENGAJUAN CUTI PENDING
                    </span>
                    <h3 className="text-base font-bold text-white">Perlu Tindakan HRD</h3>
                    <p className="text-xs text-white">
                      {leaves.filter((l) => l.status === "MENUNGGU").length} pengajuan menunggu konfirmasi.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveMenu("pengajuan-cuti")}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40 hover:bg-amber-500 hover:text-black transition-all"
                  >
                    Buka Cuti →
                  </button>
                </div>
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
              {/* Employee Selector Bar (Bisa Switch Karyawan untuk Ujicoba) */}
              <div className="bg-[#03150d] rounded-2xl p-4 border border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Simulasi Akun Absensi:</span>
                  <span className="text-xs text-white">Pilih karyawan yang sedang melakukan absen:</span>
                </div>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => {
                    setSelectedEmployeeId(e.target.value);
                    setAttendanceState("IDLE");
                    setLivenessPassed(false);
                  }}
                  className="bg-[#010804] border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-[#010804] text-white">
                      {emp.name} ({emp.dept})
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-3xl bg-gradient-to-b from-[#072a1b] via-[#03150d] to-[#010a06] p-6 border border-emerald-500/30 shadow-2xl relative">
                {/* Employee Header */}
                <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full ring-2 ring-emerald-400 bg-emerald-950 flex items-center justify-center font-black text-white text-base">
                      {selectedEmployee.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{selectedEmployee.name}</h3>
                      <p className="text-[11px] text-white/80">NIK: {selectedEmployee.nik} • {selectedEmployee.dept}</p>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {shifts.find((s) => s.id === selectedEmployee.shiftId)?.name || "Shift Pagi (Utama)"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      isWithinGeofence
                        ? "bg-emerald-500/20 text-white border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/40"
                    }`}
                  >
                    {isWithinGeofence ? "✓ Geofence OK" : "❌ Di Luar Area"}
                  </span>
                </div>

                {/* Geofence Distance Card & Interactive Distance Slider */}
                <div className="bg-[#010804] rounded-2xl p-4 border border-emerald-900/60 mb-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-[10px] text-white/70 block">Jarak Simulasi ke Pusat Kantor</span>
                        <span className="font-black text-white text-sm">{simulatedDistance.toFixed(1)} Meter</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/70 block">Batas Radius Kantor</span>
                      <span className="font-mono font-bold text-emerald-400">{settings.geofenceRadius} Meter</span>
                    </div>
                  </div>

                  {/* Distance Simulator Slider */}
                  <div>
                    <div className="flex justify-between text-[10px] text-white/60 mb-1">
                      <span>Uji Jarak GPS: 5m (Dalam Gedung)</span>
                      <span>120m (Luar Kantor)</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="1"
                      value={simulatedDistance}
                      onChange={(e) => setSimulatedDistance(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>
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
                        AI Match: {simulatedFaceScore}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setLivenessPassed(!livenessPassed);
                      if (!livenessPassed) {
                        showToast("Kedipan mata terdeteksi! Wajah hidup (Liveness Valid)");
                      }
                    }}
                    className={`mt-4 text-xs px-4 py-2.5 rounded-xl border font-bold transition-all shadow-md ${
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
                  <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-2xl p-5 text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-white font-black text-base">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span>APPROVED (Otomatis Hadir Sah)</span>
                    </div>
                    <p className="text-xs text-white">
                      Jam Server: <strong>{currentTime}</strong> • Tepat Waktu • Jarak: {simulatedDistance.toFixed(1)}m
                    </p>
                    <p className="text-[11px] text-white/80">
                      Sistem telah mengesahkan absensi {selectedEmployee.name} secara otomatis tanpa perlu approval manual HRD.
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
                  <button
                    disabled={isCapturing || !isWithinGeofence}
                    onClick={handleCheckIn}
                    className={`w-full py-4 rounded-xl font-black text-xs tracking-wider uppercase shadow-xl shadow-black transition-all flex items-center justify-center gap-2 ${
                      isWithinGeofence
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black hover:brightness-110 active:scale-[0.98]"
                        : "bg-red-950/60 text-red-300 border border-red-500/40 cursor-not-allowed"
                    }`}
                  >
                    {isCapturing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Memvalidasi Data Biometrik & Jarak...</span>
                      </>
                    ) : !isWithinGeofence ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span>TIDAK DAPAT ABSEN: DI LUAR RADIUS KANTOR</span>
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
            <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-6 border border-emerald-900/60 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">Rekapitulasi Kehadiran Karyawan</h3>
                  <p className="text-xs text-white/70">
                    Semua absensi terverifikasi otomatis oleh AI Liveness & Geofence tanpa antrean HRD
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => showToast("Mengekspor laporan format XLSX (Microsoft Excel)...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#020d07] text-white border border-emerald-900/60 text-xs font-semibold hover:bg-emerald-950 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor XLSX</span>
                  </button>
                  <button
                    onClick={() => showToast("Mengekspor laporan audit trail PDF...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#020d07] text-white border border-emerald-900/60 text-xs font-semibold hover:bg-emerald-950 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor PDF</span>
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
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
                    {attendances.map((r) => (
                      <tr key={r.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3">
                          <span className="font-bold text-white block">{r.name}</span>
                          <span className="text-[10px] text-white/60 font-mono">NIK: {r.nik}</span>
                        </td>
                        <td className="py-3 text-white font-medium">{r.dept}</td>
                        <td className="py-3 text-white/80">{r.shift}</td>
                        <td className="py-3 font-mono text-white">{r.in}</td>
                        <td className="py-3 font-mono text-white/80">{r.out}</td>
                        <td className="py-3 font-mono text-white">{r.dist.toFixed(1)}m</td>
                        <td className="py-3 font-mono text-white font-bold">{r.score}%</td>
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

              <div className="pt-2 flex justify-between items-center text-xs text-white/70">
                <span>Menampilkan {attendances.length} catatan kehadiran hari ini</span>
                <button
                  onClick={() => setActiveMenu("absensi")}
                  className="text-emerald-400 hover:text-white underline font-semibold transition-all"
                >
                  + Uji Absen Baru di Scanner
                </button>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: KARYAWAN & KEPEGAWAIAN                          */}
          {/* ===================================================== */}
          {activeMenu === "karyawan" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">Direktori Master Biometrik Karyawan</h3>
                  <p className="text-xs text-white/70">
                    Daftar seluruh tenaga kerja aktif, status biometrik wajah, dan jadwal shift
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEmployeeModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 self-start"
                >
                  <UserPlus className="w-4 h-4 text-black" />
                  <span>Daftarkan Karyawan</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-[#03150d] rounded-2xl p-4 border border-emerald-900/60 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Cari nama, NIK, atau departemen..."
                    value={searchEmployeeQuery}
                    onChange={(e) => setSearchEmployeeQuery(e.target.value)}
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="ALL">Semua Departemen</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterShift}
                    onChange={(e) => setFilterShift(e.target.value)}
                    className="bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="ALL">Semua Shift</option>
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  {(filterDept !== "ALL" || filterShift !== "ALL" || searchEmployeeQuery) && (
                    <button
                      onClick={() => {
                        setFilterDept("ALL");
                        setFilterShift("ALL");
                        setSearchEmployeeQuery("");
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-500/40 text-xs font-semibold hover:bg-red-900"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Employee Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((k) => (
                  <div
                    key={k.id}
                    className="bg-gradient-to-br from-[#062417] to-[#021008] p-5 rounded-2xl border border-emerald-900/60 shadow-lg space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-emerald-950 flex items-center justify-center font-black text-white text-sm ring-1 ring-emerald-500/40">
                          {k.avatar}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block leading-tight">{k.name}</span>
                          <span className="text-[10px] text-white/60 font-mono">NIK: {k.nik}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {k.contractType}
                      </span>
                    </div>

                    <div className="text-xs text-white/90 space-y-1 pt-2 border-t border-emerald-900/40">
                      <div className="flex justify-between">
                        <span className="text-white/60">Departemen:</span>
                        <span className="font-semibold text-white">{k.dept}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Jabatan:</span>
                        <span className="font-semibold text-white">{k.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Shift:</span>
                        <span className="font-semibold text-white">
                          {shifts.find((s) => s.id === k.shiftId)?.name.split(" ")[0]} ({shifts.find((s) => s.id === k.shiftId)?.startTime})
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-white/60">Biometrik:</span>
                        <span className="text-[10px] text-emerald-400 font-bold">✓ Terdaftar ({k.faceScore}%)</span>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="pt-2 border-t border-emerald-900/40 flex gap-2">
                      <button
                        onClick={() => startAbsenForEmployee(k.id)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 text-[10px] font-bold transition-all text-center"
                      >
                        📍 Absen Wajah
                      </button>
                      <button
                        onClick={() => {
                          setNewLeave((prev) => ({ ...prev, employeeId: k.id }));
                          setShowAddLeaveModal(true);
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[10px] font-semibold transition-all text-center"
                      >
                        🏖️ Cuti
                      </button>
                      <button
                        onClick={() => setActiveMenu("jurnal-kerja")}
                        className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[10px] font-semibold transition-all text-center"
                      >
                        📑 Jurnal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: DEPARTEMEN                                      */}
          {/* ===================================================== */}
          {activeMenu === "departemen" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Struktur Departemen Perusahaan</h3>
                  <p className="text-xs text-white/70">Kelola unit kerja dan distribusi SDM per departemen</p>
                </div>
                <button
                  onClick={() => showToast("Fitur tambah departemen siap dikonfigurasi!", "info")}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Departemen
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((d) => {
                  const staffCount = employees.filter((e) => e.dept === d.name).length;
                  return (
                    <div key={d.id} className={`bg-gradient-to-br ${d.color} rounded-2xl p-5 border ${d.border} shadow-lg`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.badge} border border-white/10`}>
                          {staffCount} Karyawan
                        </span>
                        <button
                          onClick={() => showToast(`Edit departemen: ${d.name}`)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                      <h4 className="font-extrabold text-white text-sm mb-1">{d.name}</h4>
                      <p className="text-[11px] text-white/60">
                        Kepala: <span className="text-white font-semibold">{d.head}</span>
                      </p>
                      <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
                        <button
                          onClick={() => navigateToKaryawanWithFilter(d.name)}
                          className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold transition-all text-center"
                        >
                          Lihat Karyawan ({staffCount}) →
                        </button>
                        <button
                          onClick={() => setActiveMenu("rekap-absensi")}
                          className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold transition-all text-center"
                        >
                          Rekap Hadir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Bar */}
              <div className="bg-[#03150d] rounded-2xl p-4 border border-emerald-900/60 flex flex-wrap gap-6 items-center">
                <div className="text-xs text-white">
                  <span className="text-amber-400 font-black mr-1">{departments.length}</span> Departemen Aktif
                </div>
                <div className="text-xs text-white">
                  <span className="text-emerald-400 font-black mr-1">{employees.length}</span> Total Karyawan Terdistribusi
                </div>
                <button
                  onClick={() => setActiveMenu("jabatan")}
                  className="ml-auto text-xs text-emerald-400 font-bold hover:text-white transition-all underline"
                >
                  Kelola Jabatan Organisasi →
                </button>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: JABATAN                                         */}
          {/* ===================================================== */}
          {activeMenu === "jabatan" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Daftar Jabatan & Level Organisasi</h3>
                  <p className="text-xs text-white/70">Hirarki posisi pekerjaan dan grade karyawan</p>
                </div>
                <button
                  onClick={() => showToast("Form tambah jabatan baru dibuka", "info")}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Jabatan
                </button>
              </div>

              {/* Level Summary Header */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { level: "Level 1 — Senior", count: employees.filter((e) => e.level === "Senior").length, color: "text-amber-400", ring: "border-amber-500/40", bg: "bg-amber-500/10" },
                  { level: "Level 2 — Mid", count: employees.filter((e) => e.level === "Mid").length, color: "text-blue-400", ring: "border-blue-500/40", bg: "bg-blue-500/10" },
                  { level: "Level 3 — Staff", count: employees.filter((e) => e.level === "Staff").length, color: "text-emerald-400", ring: "border-emerald-500/40", bg: "bg-emerald-500/10" },
                ].map((lv, i) => (
                  <div key={i} className={`${lv.bg} rounded-2xl p-4 border ${lv.ring} text-center`}>
                    <div className={`text-2xl font-black font-mono ${lv.color}`}>{lv.count}</div>
                    <p className="text-[11px] text-white/80 mt-1">{lv.level}</p>
                  </div>
                ))}
              </div>

              {/* Jabatan Table */}
              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3">Jabatan</th>
                      <th className="pb-3">Departemen</th>
                      <th className="pb-3">Level</th>
                      <th className="pb-3">Karyawan Ditugaskan</th>
                      <th className="pb-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3 font-bold text-white">{emp.role}</td>
                        <td className="py-3 text-white/70">{emp.dept}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              emp.level === "Senior"
                                ? "bg-amber-500/20 text-amber-300"
                                : emp.level === "Mid"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {emp.level}
                          </span>
                        </td>
                        <td className="py-3 text-white text-[11px] font-semibold">{emp.name}</td>
                        <td className="py-3">
                          <button
                            onClick={() => {
                              setSelectedEmployeeId(emp.id);
                              setActiveMenu("karyawan");
                            }}
                            className="text-emerald-400 hover:text-white text-[10px] font-bold transition-all underline"
                          >
                            Detail →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: KONTRAK & LIFECYCLE                             */}
          {/* ===================================================== */}
          {activeMenu === "kontrak" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Manajemen Kontrak & Lifecycle Karyawan</h3>
                  <p className="text-xs text-white/70">Status kontrak kerja, masa kerja, dan histori kepegawaian</p>
                </div>
                <button
                  onClick={() => setShowAddEmployeeModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Daftarkan Kontrak Baru
                </button>
              </div>

              {/* Status Overview */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Karyawan Tetap",
                    val: employees.filter((e) => e.contractType === "Tetap").length,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/30",
                  },
                  {
                    label: "Karyawan Kontrak Aktif",
                    val: employees.filter((e) => e.contractType === "Kontrak").length,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/30",
                  },
                  {
                    label: "Total Tenaga Kerja",
                    val: employees.length,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10",
                    border: "border-amber-500/30",
                  },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-2xl p-4 border ${s.border} text-center`}>
                    <div className={`text-3xl font-black font-mono ${s.color}`}>{s.val}</div>
                    <p className="text-xs text-white/70 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Kontrak Table */}
              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3">Karyawan</th>
                      <th className="pb-3">Departemen</th>
                      <th className="pb-3">Jenis Kontrak</th>
                      <th className="pb-3">Mulai Kerja</th>
                      <th className="pb-3">Masa Kerja</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {employees.map((k) => (
                      <tr key={k.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3 font-bold text-white">{k.name}</td>
                        <td className="py-3 text-white/70 text-[11px]">{k.dept}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            🏅 {k.contractType}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-white text-[11px]">{k.joinDate}</td>
                        <td className="py-3 font-mono text-white font-bold text-[11px]">{k.tenure}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-white border border-emerald-400/30">
                            {k.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => {
                              setSelectedEmployeeId(k.id);
                              setActiveMenu("karyawan");
                            }}
                            className="text-emerald-400 hover:text-white text-[10px] font-bold transition-all underline"
                          >
                            Detail
                          </button>
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
                  onClick={() => setShowAddShiftModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Tambah Shift Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {shifts.map((s) => {
                  const shiftStaffCount = employees.filter((e) => e.shiftId === s.id).length;
                  return (
                    <div
                      key={s.id}
                      className="bg-gradient-to-br from-[#062417] to-[#021008] p-6 rounded-2xl border border-emerald-900/60 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-white border border-emerald-500/30">
                            {s.status}
                          </span>
                          <span className="text-xs text-white font-bold">{shiftStaffCount} Anggota Ditugaskan</span>
                        </div>
                        <h4 className="font-bold text-white text-base mb-2">{s.name}</h4>
                        <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 text-center my-3">
                          <span className="font-mono text-xl font-extrabold text-white">
                            {s.startTime} - {s.endTime}
                          </span>
                        </div>
                        <div className="text-xs space-y-1.5 text-white">
                          <div className="flex justify-between">
                            <span className="text-white/70">Toleransi Terlambat:</span>
                            <span className="font-bold text-white">{s.tolerance}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Jendela Dibuka:</span>
                            <span className="font-bold text-white">{s.openBefore} Sebelum</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 pt-3 border-t border-emerald-900/40 flex gap-2">
                        <button
                          onClick={() => navigateToKaryawanWithShiftFilter(s.id)}
                          className="flex-1 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black text-xs font-bold transition-all text-center"
                        >
                          Lihat Anggota ({shiftStaffCount}) →
                        </button>
                        <button
                          onClick={() => showToast(`Ubah parameter untuk ${s.name}`, "info")}
                          className="py-2 px-3 rounded-lg bg-[#020e08] text-white border border-emerald-900/60 hover:bg-emerald-950 text-xs font-semibold"
                        >
                          Ubah
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: PENGAJUAN CUTI                                  */}
          {/* ===================================================== */}
          {activeMenu === "pengajuan-cuti" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Kelola Pengajuan Cuti Karyawan</h3>
                  <p className="text-xs text-white/70">Riwayat & status pengajuan cuti semua karyawan</p>
                </div>
                <button
                  onClick={() => setShowAddLeaveModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Ajukan Cuti Baru
                </button>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Total Pengajuan", val: leaves.length, color: "text-white", bg: "bg-[#03150d]", border: "border-emerald-900/60" },
                  { label: "Disetujui", val: leaves.filter((l) => l.status === "DISETUJUI").length, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
                  { label: "Menunggu", val: leaves.filter((l) => l.status === "MENUNGGU").length, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
                  { label: "Ditolak", val: leaves.filter((l) => l.status === "DITOLAK").length, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-2xl p-4 border ${s.border} text-center`}>
                    <div className={`text-2xl font-black font-mono ${s.color}`}>{s.val}</div>
                    <p className="text-[11px] text-white/70 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Cuti Table with Approve/Reject Actions */}
              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3">Karyawan</th>
                      <th className="pb-3">Departemen</th>
                      <th className="pb-3">Jenis Cuti</th>
                      <th className="pb-3">Mulai</th>
                      <th className="pb-3">Selesai</th>
                      <th className="pb-3">Durasi</th>
                      <th className="pb-3">Alasan</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Tindakan HRD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {leaves.map((c) => (
                      <tr key={c.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3 font-bold text-white">{c.name}</td>
                        <td className="py-3 text-white/70 text-[11px]">{c.dept}</td>
                        <td className="py-3 text-white text-[11px]">{c.type}</td>
                        <td className="py-3 font-mono text-white text-[11px]">{c.start}</td>
                        <td className="py-3 font-mono text-white text-[11px]">{c.end}</td>
                        <td className="py-3 font-bold text-white text-[11px]">{c.days} Hari</td>
                        <td className="py-3 text-white/60 text-[11px] max-w-[140px] truncate">{c.reason}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.status === "DISETUJUI"
                                ? "bg-emerald-500/20 text-white border border-emerald-400/30"
                                : c.status === "MENUNGGU"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                                : "bg-red-500/20 text-red-300 border border-red-400/30"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3">
                          {c.status === "MENUNGGU" ? (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleUpdateLeaveStatus(c.id, "DISETUJUI")}
                                className="px-2 py-1 rounded bg-emerald-500 text-black text-[10px] font-bold hover:bg-emerald-400 transition-all"
                              >
                                ✓ Setujui
                              </button>
                              <button
                                onClick={() => handleUpdateLeaveStatus(c.id, "DITOLAK")}
                                className="px-2 py-1 rounded bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-bold hover:bg-red-900 transition-all"
                              >
                                ✕ Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-white/50">Telah Diproses</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: JURNAL KERJA                                    */}
          {/* ===================================================== */}
          {activeMenu === "jurnal-kerja" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Jurnal Kerja Harian Karyawan</h3>
                  <p className="text-xs text-white/70">Log aktivitas, produktivitas & catatan kerja per karyawan</p>
                </div>
                <button
                  onClick={() => setShowAddJournalModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tulis Jurnal Baru
                </button>
              </div>

              {/* Stat summary */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Jurnal Tercatat", val: journals.length, color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
                  { label: "Karyawan Menulis", val: new Set(journals.map((j) => j.employeeId)).size, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
                  { label: "Rata-rata Skor", val: "90%", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-2xl p-4 border ${s.border} text-center`}>
                    <div className={`text-2xl font-black font-mono ${s.color}`}>{s.val}</div>
                    <p className="text-[11px] text-white/70 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Jurnal Cards */}
              <div className="space-y-3">
                {journals.map((j) => (
                  <div key={j.id} className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-white text-xs ring-1 ring-emerald-500/30">
                          {j.avatar}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm">{j.name}</span>
                          <p className="text-[10px] text-white/60">
                            {j.dept} • {j.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-right">
                        <div>
                          <p className="text-[10px] text-white/50">Jam Kerja</p>
                          <p className="font-mono font-bold text-white">{j.hours}</p>
                        </div>
                        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-center">
                          <p className="text-[9px] text-white/60 uppercase font-bold">Skor</p>
                          <p className="font-black text-emerald-400 text-sm font-mono">{j.score}</p>
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-1.5 text-xs text-white/80 pl-2">
                      {j.tasks.map((t, ti) => (
                        <li key={ti} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: USER MANAGEMENT                                 */}
          {/* ===================================================== */}
          {activeMenu === "user-management" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Manajemen Akun & Hak Akses</h3>
                  <p className="text-xs text-white/70">Kelola user login, role, dan level izin sistem</p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah User
                </button>
              </div>

              {/* Role Summary */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { role: "Super Admin", count: users.filter((u) => u.role === "Super Admin").length, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
                  { role: "HR Manager", count: users.filter((u) => u.role === "HR Manager").length, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
                  { role: "Staff", count: users.filter((u) => u.role === "Staff").length, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
                ].map((r, i) => (
                  <div key={i} className={`${r.bg} rounded-2xl p-4 border ${r.border} flex items-center gap-4`}>
                    <div className={`text-3xl font-black font-mono ${r.color}`}>{r.count}</div>
                    <div>
                      <p className="text-xs font-bold text-white">{r.role}</p>
                      <p className="text-[10px] text-white/50">Akun terdaftar</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* User Table */}
              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3">Pengguna</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Departemen</th>
                      <th className="pb-3">Last Login</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-900 flex items-center justify-center text-[10px] font-bold text-white ring-1 ring-emerald-500/20">
                              {u.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                            </div>
                            <span className="font-bold text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-white/60 text-[11px]">{u.email}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === "Super Admin"
                                ? "bg-amber-500/20 text-amber-300"
                                : u.role === "HR Manager"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-white/70 text-[11px]">{u.dept}</td>
                        <td className="py-3 font-mono text-white/60 text-[11px]">{u.lastLogin}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-white border border-emerald-400/30">
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 flex gap-2">
                          <button
                            onClick={() => {
                              setUsers((prev) =>
                                prev.map((usr) =>
                                  usr.id === u.id
                                    ? { ...usr, status: usr.status === "AKTIF" ? "NON-AKTIF" : "AKTIF" }
                                    : usr
                                )
                              );
                              showToast(`Status user ${u.name} diperbarui!`);
                            }}
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold"
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <p className="text-xs text-white">
                  Tentukan titik koordinat pusat kantor, radius toleransi (meter), dan ambang batas skor AI
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="text-white block mb-1 font-bold">Nama Lokasi Kantor</label>
                  <input
                    type="text"
                    value={settings.officeName}
                    onChange={(e) => setSettings({ ...settings, officeName: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-1 font-bold">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={settings.latitude}
                      onChange={(e) => setSettings({ ...settings, latitude: parseFloat(e.target.value) })}
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white block mb-1 font-bold">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={settings.longitude}
                      onChange={(e) => setSettings({ ...settings, longitude: parseFloat(e.target.value) })}
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-1 font-bold">Radius Toleransi Geofence (Meter)</label>
                    <input
                      type="number"
                      value={settings.geofenceRadius}
                      onChange={(e) => setSettings({ ...settings, geofenceRadius: parseInt(e.target.value) || 50 })}
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                    <span className="text-[10px] text-white/50 mt-1 block">
                      Karyawan harus berada di dalam radius ini untuk auto-approval.
                    </span>
                  </div>
                  <div>
                    <label className="text-white block mb-1 font-bold">Ambang Batas Skor AI Wajah (%)</label>
                    <input
                      type="number"
                      value={settings.aiFaceThreshold}
                      onChange={(e) => setSettings({ ...settings, aiFaceThreshold: parseInt(e.target.value) || 80 })}
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                    <span className="text-[10px] text-white/50 mt-1 block">
                      Default PRD: 80% similarity embedding.
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-all shadow-lg"
                >
                  Simpan Konfigurasi Sistem
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODALS SECTION (POP-UP INTERAKTIF)                        */}
      {/* ========================================================= */}

      {/* 1. Modal Tambah Karyawan */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-base">Daftarkan Karyawan Baru</h3>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Wijaya"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-bold mb-1">NIK</label>
                  <input
                    type="text"
                    required
                    placeholder="2026-0999"
                    value={newEmployee.nik}
                    onChange={(e) => setNewEmployee({ ...newEmployee, nik: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/80 font-bold mb-1">Jenis Kontrak</label>
                  <select
                    value={newEmployee.contractType}
                    onChange={(e) => setNewEmployee({ ...newEmployee, contractType: e.target.value as "Tetap" | "Kontrak" })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                  >
                    <option value="Tetap">Tetap</option>
                    <option value="Kontrak">Kontrak</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-bold mb-1">Departemen</label>
                  <select
                    value={newEmployee.dept}
                    onChange={(e) => setNewEmployee({ ...newEmployee, dept: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 font-bold mb-1">Jadwal Shift</label>
                  <select
                    value={newEmployee.shiftId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, shiftId: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/80 font-bold mb-1">Jabatan / Peran</label>
                <input
                  type="text"
                  placeholder="Contoh: Frontend Developer"
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-black hover:bg-emerald-400"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Ajukan Cuti */}
      {showAddLeaveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-base">Ajukan Permohonan Cuti</h3>
              <button onClick={() => setShowAddLeaveModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLeave} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1">Nama Karyawan</label>
                <select
                  value={newLeave.employeeId}
                  onChange={(e) => setNewLeave({ ...newLeave, employeeId: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-bold"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.dept})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-bold mb-1">Jenis Cuti</label>
                  <select
                    value={newLeave.type}
                    onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value as any })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                  >
                    <option value="Tahunan">Tahunan</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Melahirkan">Melahirkan</option>
                    <option value="Khusus">Khusus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 font-bold mb-1">Jumlah Hari</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newLeave.days}
                    onChange={(e) => setNewLeave({ ...newLeave, days: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 font-bold mb-1">Alasan Pengajuan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan alasan permohonan cuti..."
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeaveModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-black hover:bg-emerald-400"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Tulis Jurnal */}
      {showAddJournalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-base">Tulis Jurnal Harian Kerja</h3>
              <button onClick={() => setShowAddJournalModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateJournal} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1">Karyawan</label>
                <select
                  value={newJournal.employeeId}
                  onChange={(e) => setNewJournal({ ...newJournal, employeeId: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-bold"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.dept})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 font-bold mb-1">Durasi Kerja (Jam)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={newJournal.hours}
                  onChange={(e) => setNewJournal({ ...newJournal, hours: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-white/80 font-bold mb-1">Deskripsi Tugas / Aktivitas yang Selesai</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Menyelesaikan integrasi payment gateway dan testing end-to-end..."
                  value={newJournal.task}
                  onChange={(e) => setNewJournal({ ...newJournal, task: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddJournalModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-black hover:bg-emerald-400"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Tambah Shift */}
      {showAddShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-base">Tambah Jadwal Shift Baru</h3>
              <button onClick={() => setShowAddShiftModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateShift} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1">Nama Shift</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Shift Khusus Weekend"
                  value={newShift.name}
                  onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-bold mb-1">Jam Masuk</label>
                  <input
                    type="time"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/80 font-bold mb-1">Jam Pulang</label>
                  <input
                    type="time"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddShiftModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-black hover:bg-emerald-400"
                >
                  Simpan Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Tambah User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-base">Tambah Akun Sistem</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1">Nama Pengguna</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-white/80 font-bold mb-1">Email Login</label>
                <input
                  type="email"
                  required
                  placeholder="nama@perusahaan.id"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-bold mb-1">Hak Akses (Role)</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                  >
                    <option value="Staff">Staff</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 font-bold mb-1">Departemen</label>
                  <select
                    value={newUser.dept}
                    onChange={(e) => setNewUser({ ...newUser, dept: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-black hover:bg-emerald-400"
                >
                  Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal Ganti Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white text-base">Ganti Kata Sandi Akun</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowPasswordModal(false);
                showToast("Kata sandi akun Anda berhasil diperbarui!");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-white/80 font-bold mb-1">Password Saat Ini</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-white/80 font-bold mb-1">Password Baru</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-black hover:bg-emerald-400"
                >
                  Perbarui Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
