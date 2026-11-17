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
  Phone,
  Mail,
  Shield,
  CheckSquare,
  Square,
  Network,
  GitFork,
  MessageSquare,
  Copy,
  KeyRound,
  GraduationCap,
  CalendarDays,
  Server,
  Cpu,
  UserCog,
  BriefcaseBusiness,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// DATA TYPES
// ─────────────────────────────────────────────────────────────
type DepartmentType = "HR" | "Finance" | "Marketing" | "Sales" | "Operations" | "IT" | "Direksi";
type HierarchyLevel = "Director" | "GeneralManager" | "Supervisor" | "Staff";
type ContractType = "Tetap" | "Kontrak" | "Magang" | "DW";

interface Employee {
  id: string;
  nik: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  dept: DepartmentType;
  role: string;
  level: HierarchyLevel;
  shiftId: string;
  contractType: ContractType;
  startDate: string;
  endDate?: string | null;
  joinDate: string;
  tenure: string;
  faceRegistered: boolean;
  faceScore: number;
  status: "Aktif" | "Cuti" | "Non-Aktif";
  avatar: string;
  managerId: string | null; // Atasan langsung
  isFirstLogin: boolean;
  temporaryPassword?: string | null;
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
  employeeId: string;
  name: string;
  email: string;
  role: "Super Admin" | "General Manager" | "HR Supervisor" | "HR Staff" | "IT Supervisor" | "IT Staff" | "Supervisor" | "Staff";
  dept: string;
  lastLogin: string;
  status: "AKTIF" | "NON-AKTIF";
  isFirstLogin: boolean;
  temporaryPassword?: string | null;
}

interface PermissionItem {
  id: string;
  category: string;
  name: string;
  description: string;
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

  // Helper Generator Password Acak Sementara (8 Karakter)
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
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
  // 6 DEPARTEMEN STANDAR (SESUAI GAMBAR REFERENSI USER)
  // HR, Finance, Marketing, Sales, Operations, IT
  // ─────────────────────────────────────────────────────────────
  const standardDepartments: { id: "HR" | "Finance" | "Marketing" | "Sales" | "Operations" | "IT"; name: string; supervisorRole: string; staffRole: string; icon: string; desc: string }[] = [
    { id: "HR", name: "HR (Human Resources)", supervisorRole: "HR Supervisor", staffRole: "HR Staff", icon: "👥", desc: "Pengelolaan SDM, pendaftaran akun karyawan, cuti & data jabatan" },
    { id: "Finance", name: "Finance", supervisorRole: "Finance Supervisor", staffRole: "Finance Staff", icon: "💰", desc: "Manajemen keuangan, kas kantor, invoice & pembukuan" },
    { id: "Marketing", name: "Marketing", supervisorRole: "Marketing Supervisor", staffRole: "Marketing Staff", icon: "📈", desc: "Pemasaran digital, branding perusahaan & pertumbuhan audiens" },
    { id: "Sales", name: "Sales", supervisorRole: "Sales Supervisor", staffRole: "Sales Staff", icon: "🤝", desc: "Penjualan produk, kemitraan bisnis & akuisisi klien" },
    { id: "Operations", name: "Operations", supervisorRole: "Operations Supervisor", staffRole: "Operations Staff", icon: "⚙️", desc: "Operasional logistik, fasilitas kantor & pengadaan" },
    { id: "IT", name: "IT (Information Technology)", supervisorRole: "IT Supervisor", staffRole: "IT Staff", icon: "💻", desc: "Server, database, maintenance, geofence, bug & keamanan teknis" },
  ];

  // ─────────────────────────────────────────────────────────────
  // EMPLOYEES MASTER DATA
  // Hirarki 4 Tingkat: CEO (1) → GM (1) → Supervisor (6 Dept) → Staff
  // ─────────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>([
    // 1. Direktur Utama (CEO) — Pimpinan Tertinggi
    {
      id: "emp-ceo",
      nik: "2024-0001",
      name: "Ir. Hendra Gunawan",
      email: "hendra@perusahaan.id",
      phone: "+62 811-9876-0001",
      address: "Jl. Sudirman No. 10, Jakarta Pusat",
      birthDate: "1978-04-12",
      dept: "Direksi",
      role: "Direktur Utama (CEO)",
      level: "Director",
      shiftId: "shift-1",
      contractType: "Tetap",
      startDate: "2024-01-01",
      endDate: null,
      joinDate: "01 Jan 2024",
      tenure: "2 Thn 11 Bln",
      faceRegistered: true,
      faceScore: 99.2,
      status: "Aktif",
      avatar: "HG",
      managerId: null,
      isFirstLogin: false,
      temporaryPassword: null,
    },
    // 2. General Manager (GM) — Tepat 1 Orang, Membawahi Seluruh 6 Supervisor
    {
      id: "emp-gm",
      nik: "2024-0010",
      name: "Dr. Kartika Sari, S.E., M.M.",
      email: "kartika.gm@perusahaan.id",
      phone: "+62 811-1000-0010",
      address: "Jl. Gatot Subroto No. 55, Jakarta Selatan",
      birthDate: "1980-03-15",
      dept: "Direksi",
      role: "General Manager (GM)",
      level: "GeneralManager",
      shiftId: "shift-1",
      contractType: "Tetap",
      startDate: "2024-01-15",
      endDate: null,
      joinDate: "15 Jan 2024",
      tenure: "2 Thn 10 Bln",
      faceRegistered: true,
      faceScore: 98.5,
      status: "Aktif",
      avatar: "KS",
      managerId: "emp-ceo", // Lapor langsung ke CEO
      isFirstLogin: false,
      temporaryPassword: null,
    },
    // 3. SUPERVISOR & STAFF PER DEPARTEMEN (Semua Supervisor Melapor ke GM)
    // HR DEPT
    {
      id: "emp-hr-spv",
      nik: "2026-0101",
      name: "Siti Rahmawati",
      email: "siti.hr@perusahaan.id",
      phone: "+62 813-8888-0101",
      address: "Jl. Kemang Raya No. 45, Jakarta Selatan",
      birthDate: "1992-11-05",
      dept: "HR",
      role: "HR Supervisor",
      level: "Supervisor",
      shiftId: "shift-1",
      contractType: "Tetap",
      startDate: "2024-02-01",
      endDate: null,
      joinDate: "01 Feb 2024",
      tenure: "2 Thn 9 Bln",
      faceRegistered: true,
      faceScore: 98.1,
      status: "Aktif",
      avatar: "SR",
      managerId: "emp-gm", // Lapor ke General Manager
      isFirstLogin: false,
      temporaryPassword: null,
    },
    {
      id: "emp-hr-stf",
      nik: "2026-0102",
      name: "Maya Indah",
      email: "maya.hr@perusahaan.id",
      phone: "+62 878-3333-0102",
      address: "Jl. Margonda Raya No. 12, Depok",
      birthDate: "1999-07-22",
      dept: "HR",
      role: "HR Staff",
      level: "Staff",
      shiftId: "shift-1",
      contractType: "Tetap",
      startDate: "2024-06-15",
      endDate: null,
      joinDate: "15 Jun 2024",
      tenure: "2 Thn 5 Bln",
      faceRegistered: true,
      faceScore: 97.5,
      status: "Aktif",
      avatar: "MI",
      managerId: "emp-hr-spv", // Lapor ke HR Supervisor
      isFirstLogin: false,
      temporaryPassword: null,
    },
    // FINANCE DEPT
    {
      id: "emp-fin-spv",
      nik: "2026-0201",
      name: "Andi Saputra",
      email: "andi.fin@perusahaan.id",
      phone: "+62 815-5555-0201",
      address: "Jl. Bendungan Hilir No. 22, Jakarta Pusat",
      birthDate: "1993-03-18",
      dept: "Finance",
      role: "Finance Supervisor",
      level: "Supervisor",
      shiftId: "shift-1",
      contractType: "Tetap",
      startDate: "2024-03-10",
      endDate: null,
      joinDate: "10 Mar 2024",
      tenure: "2 Thn 8 Bln",
      faceRegistered: true,
      faceScore: 95.8,
      status: "Aktif",
      avatar: "AS",
      managerId: "emp-gm", // Lapor ke General Manager
      isFirstLogin: false,
      temporaryPassword: null,
    },
    {
      id: "emp-fin-stf",
      nik: "2026-0202",
      name: "Farhan Ramadhan",
      email: "farhan.fin@perusahaan.id",
      phone: "+62 812-4444-0202",
      address: "Jl. Tebet Barat No. 18, Jakarta Selatan",
      birthDate: "2000-05-14",
      dept: "Finance",
      role: "Finance Staff",
      level: "Staff",
      shiftId: "shift-1",
      contractType: "Kontrak",
      startDate: "2026-01-10",
      endDate: "2027-01-09",
      joinDate: "10 Jan 2026",
      tenure: "10 Bulan",
      faceRegistered: true,
      faceScore: 94.2,
      status: "Aktif",
      avatar: "FR",
      managerId: "emp-fin-spv", // Lapor ke Finance Supervisor
      isFirstLogin: false,
      temporaryPassword: null,
    },
    // MARKETING DEPT
    {
      id: "emp-mkt-spv",
      nik: "2026-0301",
      name: "Dewi Lestari",
      email: "dewi.mkt@perusahaan.id",
      phone: "+62 819-2222-0301",
      address: "Jl. Rawamangun No. 8, Jakarta Timur",
      birthDate: "1994-08-11",
      dept: "Marketing",
      role: "Marketing Supervisor",
      level: "Supervisor",
      shiftId: "shift-1",
      contractType: "Tetap",
      startDate: "2024-05-05",
      endDate: null,
      joinDate: "05 May 2024",
      tenure: "2 Thn 6 Bln",
      faceRegistered: true,
      faceScore: 96.0,
      status: "Aktif",
      avatar: "DL",
      managerId: "emp-gm", // Lapor ke General Manager
      isFirstLogin: false,
      temporaryPassword: null,
    },
    {
      id: "emp-mkt-stf",
      nik: "2026-0302",
      name: "Aditya Pratama",
      email: "aditya.mkt@perusahaan.id",
      phone: "+62 818-7777-0302",
      address: "Jl. Cempaka Putih No. 19, Jakarta Pusat",
      birthDate: "2001-09-30",
      dept: "Marketing",
      role: "Marketing Staff",
      level: "Staff",
      shiftId: "shift-1",
      contractType: "Magang",
      startDate: "2026-07-01",
      endDate: "2026-12-31",
      joinDate: "01 Jul 2026",
      tenure: "4 Bulan",
      faceRegistered: true,
      faceScore: 93.5,
      status: "Aktif",
      avatar: "AP",
      managerId: "emp-mkt-spv", // Lapor ke Marketing Supervisor
      isFirstLogin: false,
      temporaryPassword: null,
    },
    // SALES DEPT
    {
      id: "emp-sls-spv",
      nik: "2026-0401",
      name: "Reza Pahlevi",
      email: "reza.sls@perusahaan.id",
      phone: "+62 811-2233-0401",
      address: "Jl. Kelapa Gading No. 88, Jakarta Utara",
      birthDate: "1991-01-25",
      dept: "Sales",
      role: "Sales Supervisor",
      level: "Supervisor",
      shiftId: "shift-1",
      contractType: "Tetap",
      startDate: "2024-04-12",
      endDate: null,
      joinDate: "12 Apr 2024",
      tenure: "2 Thn 7 Bln",
      faceRegistered: true,
      faceScore: 95.1,
      status: "Aktif",
      avatar: "RP",
      managerId: "emp-gm", // Lapor ke General Manager
      isFirstLogin: false,
      temporaryPassword: null,
    },
    {
      id: "emp-sls-stf",
      nik: "2026-0402",
      name: "Bella Savira",
      email: "bella.sls@perusahaan.id",
      phone: "+62 812-6666-0402",
      address: "Jl. Bintaro Utama No. 3, Tangerang Selatan",
      birthDate: "1998-10-14",
      dept: "Sales",
      role: "Sales Staff",
      level: "Staff",
      shiftId: "shift-1",
      contractType: "DW",
      startDate: "2026-11-01",
      endDate: "2026-12-01",
      joinDate: "01 Nov 2026",
      tenure: "1 Bulan",
      faceRegistered: true,
      faceScore: 94.7,
      status: "Aktif",
      avatar: "BS",
      managerId: "emp-sls-spv", // Lapor ke Sales Supervisor
      isFirstLogin: false,
      temporaryPassword: null,
    },
    // OPERATIONS DEPT
    {
      id: "emp-ops-spv",
      nik: "2026-0501",
      name: "Rian Hidayat",
      email: "rian.ops@perusahaan.id",
      phone: "+62 856-1111-0501",
      address: "Jl. Kebon Jeruk No. 31, Jakarta Barat",
      birthDate: "1993-06-20",
      dept: "Operations",
      role: "Operations Supervisor",
      level: "Supervisor",
      shiftId: "shift-2",
      contractType: "Tetap",
      startDate: "2024-03-01",
      endDate: null,
      joinDate: "01 Mar 2024",
      tenure: "2 Thn 8 Bln",
      faceRegistered: true,
      faceScore: 94.0,
      status: "Aktif",
      avatar: "RH",
      managerId: "emp-gm", // Lapor ke General Manager
      isFirstLogin: false,
      temporaryPassword: null,
    },
    {
      id: "emp-ops-stf",
      nik: "2026-0502",
      name: "Joko Susilo",
      email: "joko.ops@perusahaan.id",
      phone: "+62 857-9999-0502",
      address: "Jl. Daan Mogot No. 50, Jakarta Barat",
      birthDate: "1997-04-16",
      dept: "Operations",
      role: "Operations Staff",
      level: "Staff",
      shiftId: "shift-2",
      contractType: "Kontrak",
      startDate: "2026-05-01",
      endDate: "2027-05-01",
      joinDate: "01 May 2026",
      tenure: "6 Bulan",
      faceRegistered: true,
      faceScore: 93.9,
      status: "Aktif",
      avatar: "JS",
      managerId: "emp-ops-spv", // Lapor ke Operations Supervisor
      isFirstLogin: false,
      temporaryPassword: null,
    },
    // IT DEPT
    {
      id: "emp-it-spv",
      nik: "2026-0601",
      name: "Budi Pratama",
      email: "budi.it@perusahaan.id",
      phone: "+62 812-3456-0601",
      address: "Jl. Tebet Timur Dalam No. 15, Jakarta Selatan",
      birthDate: "1990-08-20",
      dept: "IT",
      role: "IT Supervisor",
      level: "Supervisor",
      shiftId: "shift-1",
      contractType: "Tetap",
      startDate: "2024-01-01",
      endDate: null,
      joinDate: "01 Jan 2024",
      tenure: "2 Thn 10 Bln",
      faceRegistered: true,
      faceScore: 96.4,
      status: "Aktif",
      avatar: "BP",
      managerId: "emp-gm", // Lapor ke General Manager
      isFirstLogin: false,
      temporaryPassword: null,
    },
    {
      id: "emp-it-stf",
      nik: "2026-0602",
      name: "Dimas Wicaksono",
      email: "dimas.it@perusahaan.id",
      phone: "+62 813-7777-0602",
      address: "Jl. Fatmawati No. 40, Jakarta Selatan",
      birthDate: "1998-12-05",
      dept: "IT",
      role: "IT Staff",
      level: "Staff",
      shiftId: "shift-1",
      contractType: "Tetap",
      startDate: "2025-02-15",
      endDate: null,
      joinDate: "15 Feb 2025",
      tenure: "1 Thn 9 Bln",
      faceRegistered: true,
      faceScore: 96.1,
      status: "Aktif",
      avatar: "DW",
      managerId: "emp-it-spv", // Lapor ke IT Supervisor
      isFirstLogin: false,
      temporaryPassword: null,
    },
  ]);

  // Shifts Master Data
  const [shifts, setShifts] = useState<Shift[]>([
    { id: "shift-1", name: "Shift Pagi (Utama)", startTime: "07:00", endTime: "15:00", tolerance: "15 Menit", openBefore: "60 Menit", status: "Aktif" },
    { id: "shift-2", name: "Shift Siang (Operasional)", startTime: "15:00", endTime: "23:00", tolerance: "15 Menit", openBefore: "45 Menit", status: "Aktif" },
    { id: "shift-3", name: "Shift Malam (Teknis / Lintas Hari)", startTime: "23:00", endTime: "07:00", tolerance: "10 Menit", openBefore: "30 Menit", status: "Aktif" },
  ]);

  // Attendances State
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([
    { id: "att-1", employeeId: "emp-it-spv", name: "Budi Pratama", nik: "2026-0601", dept: "IT", shift: "Shift Pagi (Utama)", in: "07:42 WIB", out: "15:02 WIB", dist: 14.2, score: 96.4, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-2", employeeId: "emp-hr-spv", name: "Siti Rahmawati", nik: "2026-0101", dept: "HR", shift: "Shift Pagi (Utama)", in: "07:35 WIB", out: "15:00 WIB", dist: 8.5, score: 98.1, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-3", employeeId: "emp-fin-spv", name: "Andi Saputra", nik: "2026-0201", dept: "Finance", shift: "Shift Pagi (Utama)", in: "07:58 WIB", out: "15:15 WIB", dist: 24.1, score: 95.8, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-4", employeeId: "emp-mkt-spv", name: "Dewi Lestari", nik: "2026-0301", dept: "Marketing", shift: "Shift Pagi (Utama)", in: "08:04 WIB", out: "--:--", dist: 18.9, score: 96.0, status: "TERLAMBAT", date: "17 Nov 2026" },
    { id: "att-5", employeeId: "emp-ops-spv", name: "Rian Hidayat", nik: "2026-0501", dept: "Operations", shift: "Shift Siang (Operasional)", in: "14:48 WIB", out: "23:05 WIB", dist: 12.3, score: 94.0, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-6", employeeId: "emp-it-stf", name: "Dimas Wicaksono", nik: "2026-0602", dept: "IT", shift: "Shift Pagi (Utama)", in: "07:40 WIB", out: "15:00 WIB", dist: 11.2, score: 96.1, status: "APPROVED", date: "17 Nov 2026" },
  ]);

  // Leave Requests State
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: "lv-1", employeeId: "emp-mkt-stf", name: "Aditya Pratama", dept: "Marketing", type: "Sakit", start: "18 Nov 2026", end: "19 Nov 2026", days: 2, reason: "Flu & demam, istirahat dokter", status: "MENUNGGU" },
    { id: "lv-2", employeeId: "emp-fin-stf", name: "Farhan Ramadhan", dept: "Finance", type: "Tahunan", start: "24 Nov 2026", end: "26 Nov 2026", days: 3, reason: "Keperluan keluarga di luar kota", status: "MENUNGGU" },
    { id: "lv-3", employeeId: "emp-hr-stf", name: "Maya Indah", dept: "HR", type: "Tahunan", start: "10 Nov 2026", end: "12 Nov 2026", days: 3, reason: "Acara wisuda saudara", status: "DISETUJUI" },
  ]);

  // Work Journals State
  const [journals, setJournals] = useState<WorkJournal[]>([
    {
      id: "jrn-1",
      employeeId: "emp-it-stf",
      name: "Dimas Wicaksono",
      dept: "IT",
      avatar: "DW",
      date: "17 Nov 2026",
      hours: "8j 00m",
      score: 95,
      tasks: [
        "Pembaruan struktur hirarki: HR, Finance, Marketing, Sales, Operations, IT",
        "Setup wewenang khusus HR (Manajemen SDM & User) & IT (Server, Geofence & Teknis)",
        "Audit log konektivitas geofence GPS pada scanner PWA",
      ],
    },
    {
      id: "jrn-2",
      employeeId: "emp-hr-stf",
      name: "Maya Indah",
      dept: "HR",
      avatar: "MI",
      date: "17 Nov 2026",
      hours: "7j 30m",
      score: 92,
      tasks: [
        "Verifikasi berkas karyawan kontrak & magang",
        "Pemberian password sementara acak untuk karyawan baru",
        "Penyelarasan kuota cuti tahunan",
      ],
    },
  ]);

  // System Users State
  const [users, setUsers] = useState<SystemUser[]>([
    { id: "usr-0", employeeId: "emp-ceo", name: "Ir. Hendra Gunawan", email: "hendra@perusahaan.id", role: "Super Admin", dept: "Direksi", lastLogin: "17 Nov 2026 08:00", status: "AKTIF", isFirstLogin: false, temporaryPassword: null },
    { id: "usr-gm", employeeId: "emp-gm", name: "Dr. Kartika Sari", email: "kartika.gm@perusahaan.id", role: "General Manager", dept: "Direksi", lastLogin: "17 Nov 2026 08:10", status: "AKTIF", isFirstLogin: false, temporaryPassword: null },
    { id: "usr-hr-1", employeeId: "emp-hr-spv", name: "Siti Rahmawati", email: "siti.hr@perusahaan.id", role: "HR Supervisor", dept: "HR", lastLogin: "17 Nov 2026 09:15", status: "AKTIF", isFirstLogin: false, temporaryPassword: null },
    { id: "usr-hr-2", employeeId: "emp-hr-stf", name: "Maya Indah", email: "maya.hr@perusahaan.id", role: "HR Staff", dept: "HR", lastLogin: "17 Nov 2026 08:30", status: "AKTIF", isFirstLogin: false, temporaryPassword: null },
    { id: "usr-it-1", employeeId: "emp-it-spv", name: "Budi Pratama", email: "budi.it@perusahaan.id", role: "IT Supervisor", dept: "IT", lastLogin: "17 Nov 2026 10:42", status: "AKTIF", isFirstLogin: false, temporaryPassword: null },
    { id: "usr-it-2", employeeId: "emp-it-stf", name: "Dimas Wicaksono", email: "dimas.it@perusahaan.id", role: "IT Staff", dept: "IT", lastLogin: "17 Nov 2026 07:45", status: "AKTIF", isFirstLogin: false, temporaryPassword: null },
    { id: "usr-fin-1", employeeId: "emp-fin-spv", name: "Andi Saputra", email: "andi.fin@perusahaan.id", role: "Supervisor", dept: "Finance", lastLogin: "17 Nov 2026 08:50", status: "AKTIF", isFirstLogin: false, temporaryPassword: null },
    { id: "usr-mkt-1", employeeId: "emp-mkt-spv", name: "Dewi Lestari", email: "dewi.mkt@perusahaan.id", role: "Supervisor", dept: "Marketing", lastLogin: "16 Nov 2026 17:22", status: "AKTIF", isFirstLogin: false, temporaryPassword: null },
  ]);

  // Office Geofence & System Settings State
  const [settings, setSettings] = useState({
    officeName: "Kantor Pusat - Sudirman Tower Lt. 12",
    latitude: -6.2088,
    longitude: 106.8456,
    geofenceRadius: 50,
    aiFaceThreshold: 80,
  });

  // ─────────────────────────────────────────────────────────────
  // ROLE-BASED ACCESS CONTROL (RBAC) DENGAN PEMBAGIAN KHUSUS
  // - HR: Pendaftaran karyawan, akun user, data jabatan & departemen
  // - IT: Server, database, maintenance, geofence, bug & keamanan teknis
  // ─────────────────────────────────────────────────────────────
  const allPermissions: PermissionItem[] = [
    { id: "dash_global", category: "Dashboard", name: "Lihat Dashboard Global Perusahaan", description: "Melihat grafik total SDM, absensi, dan analitik seluruh divisi" },
    { id: "dash_team", category: "Dashboard", name: "Lihat Ringkasan Tim / Bawahan Saja", description: "Hanya melihat metrik performa dan kehadiran staf di bawah supervisinya" },
    { id: "emp_manage_hr", category: "Wewenang Khusus HR", name: "Daftarkan Karyawan & Buat Akun Otomatis", description: "Hak khusus HR untuk mendaftarkan NIK, nama, atasan, status kerja & kredensial acak" },
    { id: "org_manage_hr", category: "Wewenang Khusus HR", name: "Kelola Data Jabatan & Departemen", description: "Hak khusus HR untuk mengatur struktur organisasi, posisi, dan kuota cuti" },
    { id: "it_infra_manage", category: "Wewenang Khusus IT", name: "Kelola Server, Database & Maintenance", description: "Hak khusus IT untuk pemeliharaan server, audit log, perbaikan bug & patching" },
    { id: "it_geofence_security", category: "Wewenang Khusus IT", name: "Pengaturan Geofence GPS & Keamanan Teknis", description: "Hak khusus IT untuk konfigurasi radius kantor, koordinat, dan ambang batas AI" },
    { id: "att_scan_self", category: "Absensi", name: "Absensi Mandiri (GPS & Wajah)", description: "Melakukan check-in dan check-out menggunakan kamera dan GPS" },
    { id: "att_team", category: "Absensi", name: "Lihat Rekap Absen Tim Bawahan", description: "Supervisor memantau jam datang dan keterlambatan staf di departemennya" },
    { id: "att_all", category: "Absensi", name: "Lihat Rekap Absensi Seluruh Perusahaan", description: "Audit trail kehadiran seluruh staf dan ekspor XLSX/PDF" },
    { id: "leave_approve_subordinate", category: "Cuti", name: "Persetujuan Cuti Bawahan Langsung (N+1)", description: "Supervisor menyetujui / menolak cuti staf di departemennya" },
    { id: "journal_review_team", category: "Jurnal", name: "Review & Penilaian Jurnal Bawahan", description: "Supervisor memeriksa dan memberi skor kualitas kerja tim" },
  ];

  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    "Super Admin": allPermissions.map((p) => p.id),
    "HR Supervisor": [
      "dash_global",
      "dash_team",
      "emp_manage_hr",
      "org_manage_hr",
      "att_scan_self",
      "att_team",
      "att_all",
      "leave_approve_subordinate",
      "journal_review_team",
    ],
    "HR Staff": [
      "emp_manage_hr", // Diberi izin membuat akun & mendaftarkan karyawan
      "org_manage_hr",
      "att_scan_self",
    ],
    "IT Supervisor": [
      "dash_global",
      "dash_team",
      "it_infra_manage",
      "it_geofence_security",
      "att_scan_self",
      "att_team",
      "att_all",
      "leave_approve_subordinate",
      "journal_review_team",
    ],
    "IT Staff": [
      "it_infra_manage",
      "it_geofence_security",
      "att_scan_self",
    ],
    Supervisor: [
      "dash_team",
      "att_scan_self",
      "att_team",
      "leave_approve_subordinate",
      "journal_review_team",
    ],
    "General Manager": [
      "dash_global",
      "dash_team",
      "att_scan_self",
      "att_team",
      "att_all",
      "leave_approve_subordinate",
      "journal_review_team",
    ],
    Staff: [
      "att_scan_self",
    ],
  });

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

  const hasPermission = (permId: string): boolean => {
    const rolePerms = rolePermissions[currentRoleName] || [];
    return rolePerms.includes(permId);
  };

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
  const [userManagementTab, setUserManagementTab] = useState<"users" | "rbac">("rbac");

  // Absensi Simulator State
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [attendanceState, setAttendanceState] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [simulatedDistance, setSimulatedDistance] = useState<number>(14.2);
  const [simulatedFaceScore, setSimulatedFaceScore] = useState<number>(96.4);

  // Modals Open State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
      });
    } else {
      const hasCeo = employees.some((e) => e.level === "Director");
      const hasGm = employees.some((e) => e.level === "GeneralManager");
      const availableSpvDepts = standardDepartments.filter(
        (d) => !employees.some((e) => e.dept === d.id && e.level === "Supervisor")
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

  const isWithinGeofence = simulatedDistance <= settings.geofenceRadius;
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
      showToast("Nama, NIK, dan Email wajib diisi!", "error");
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
      nik: newEmployeeForm.nik,
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
      managerId: superiorEmployee ? superiorEmployee.id : null,
      isFirstLogin: true,
      temporaryPassword: randomTempPass,
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
        : "Staff") as any,
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
      nik: newEmployeeForm.nik,
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

  const copyCredentialsToClipboard = () => {
    if (!newlyCreatedCredentials) return;
    const text = `Halo ${newlyCreatedCredentials.name},\nSelamat bergabung di tim ${newlyCreatedCredentials.dept}!\nBerikut akun login Anda di AbsenKu:\n- Email: ${newlyCreatedCredentials.email}\n- Password Sementara: ${newlyCreatedCredentials.tempPass}\n- Atasan Langsung: ${newlyCreatedCredentials.superiorName}\n\n*Penting: Password ini berlaku sekali. Anda diwajibkan membuat password baru saat login pertama.*`;
    navigator.clipboard?.writeText(text);
    showToast("✓ Info akun & password sementara berhasil disalin!");
  };

  // Dynamic Header Meta
  const menuMeta: Record<string, { title: string; subtitle: string; icon: string }> = {
    dashboard: { title: "DASHBOARD", subtitle: `Ringkasan Data AbsenKu`, icon: "🏠" },
    karyawan: { title: "KARYAWAN", subtitle: `Direktori Karyawan & Relasi Atasan-Bawahan (${visibleEmployees.length} Karyawan)`, icon: "👥" },
    departemen: { title: "DEPARTEMEN", subtitle: "Struktur 6 Departemen Pokok (HR, Finance, Marketing, Sales, Operations, IT)", icon: "🏢" },
    jabatan: { title: "JABATAN", subtitle: "Hirarki Jabatan 4 Tingkat: CEO → GM → Supervisor → Staff", icon: "💼" },
    kontrak: { title: "KONTRAK & LIFECYCLE", subtitle: "Status Kerja Karyawan: Tetap, Kontrak, Magang, DW", icon: "📄" },
    absensi: { title: "ABSENSI", subtitle: "Verifikasi Kehadiran Otomatis Real-Time (GPS & AI Liveness)", icon: "📍" },
    "rekap-absensi": { title: "REKAP ABSENSI", subtitle: `Audit Log Kehadiran Terverifikasi (${attendances.length} Log Hari Ini)`, icon: "📊" },
    "jadwal-shift": { title: "JADWAL SHIFT", subtitle: `Konfigurasi Shift Kerja Dinamis (${shifts.length} Shift Aktif)`, icon: "📅" },
    "pengajuan-cuti": { title: "PENGAJUAN CUTI", subtitle: `Persetujuan Cuti oleh Supervisor Departemen Masing-Masing (${leaves.filter((l) => l.status === "MENUNGGU").length} Pending)`, icon: "⛱️" },
    "jurnal-kerja": { title: "JURNAL KERJA", subtitle: `Catatan Produktivitas Harian & Penilaian Supervisor (${journals.length} Jurnal Tercatat)`, icon: "📝" },
    "user-management": { title: "USER MANAGEMENT", subtitle: `Kelola Akun, Wewenang Khusus HR & IT (${users.length} Akun)`, icon: "👤" },
    pengaturan: { title: "PENGATURAN", subtitle: `Konfigurasi Geofence Kantor (${settings.geofenceRadius}m) & AI Match (${settings.aiFaceThreshold}%)`, icon: "⚙️" },
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

  return (
    <div className="flex min-h-screen bg-[#010804] text-white font-sans selection:bg-emerald-500 selection:text-black">
      <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

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

      {/* MODAL PAKSA GANTI PASSWORD */}
      {isForcedPasswordRequired && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#021109] border-2 border-amber-400/80 rounded-3xl p-7 max-w-md w-full shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center ring-1 ring-amber-400/40 flex-shrink-0">
                <KeyRound className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">
                  KEAMANAN AKUN • LOGIN PERTAMA KALI
                </span>
                <h3 className="font-black text-white text-base leading-tight">Wajib Buat Password Baru</h3>
              </div>
            </div>

            <div className="bg-[#010804] p-3.5 rounded-xl border border-amber-900/60 text-xs text-white/80 space-y-1.5">
              <p>
                Halo <strong className="text-white">{currentActiveEmployee.name}</strong> ({currentActiveEmployee.role}), Anda saat ini masuk menggunakan{" "}
                <strong className="text-amber-300">password sementara acak dari HRD</strong>.
              </p>
              <p className="text-[11px] text-white/70">
                Demi privasi & keamanan akun, Anda diwajibkan mengganti password baru sekarang sebelum dapat mengakses menu sistem.
              </p>
            </div>

            <form onSubmit={handleForcedPasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-white font-bold mb-1">Password Baru Anda</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter..."
                  value={forcedPasswordForm.newPass}
                  onChange={(e) => setForcedPasswordForm({ ...forcedPasswordForm, newPass: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  required
                  placeholder="Ulangi password baru..."
                  value={forcedPasswordForm.confirmPass}
                  onChange={(e) => setForcedPasswordForm({ ...forcedPasswordForm, confirmPass: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black uppercase tracking-wider text-xs hover:brightness-110 shadow-lg shadow-black transition-all"
              >
                Simpan Password & Masuk Sistem →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PANEL KIRI: LEBIH GELAP PEKAT (#010a06)                  */}
      {/* ========================================================= */}
      <aside className="w-64 flex-shrink-0 bg-[#010a06] border-r border-emerald-950/80 flex flex-col justify-between py-5 px-3 min-h-screen select-none z-20 shadow-2xl shadow-black">
        <div>
          {/* Header Profil Perusahaan */}
          <div className="group relative p-2.5 rounded-2xl bg-[#03140d]/70 border border-emerald-900/40 hover:border-emerald-500/40 transition-all mb-6">
            <div className="flex items-center gap-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Klik untuk ganti logo perusahaan"
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
                    <button onClick={saveCompanyName} className="p-1 rounded bg-emerald-500 text-black hover:bg-emerald-400">
                      <Check className="w-3 h-3" />
                    </button>
                    <button onClick={() => setIsEditingCompany(false)} className="p-1 rounded bg-red-950 text-red-300 hover:bg-red-900">
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
                {openSections.kepegawaian ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openSections.kepegawaian && (
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-900/60 ml-4">
                  {[
                    { id: "karyawan", label: "Karyawan", icon: "👥", badge: visibleEmployees.length },
                    { id: "departemen", label: "Departemen", icon: "🏢", badge: 6 },
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
                {openSections.kehadiran ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openSections.kehadiran && (
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-900/60 ml-4">
                  {[
                    { id: "absensi", label: "Absensi", icon: "📍" },
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
                  <span>📋</span>
                  <span>AKTIVITAS</span>
                </div>
                {openSections.aktivitas ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {openSections.aktivitas && (
                <div className="mt-1 space-y-0.5 pl-3 border-l-2 border-emerald-900/60 ml-4">
                  {[
                    { id: "pengajuan-cuti", label: "Pengajuan Cuti", icon: "⛱️", badge: leaves.length },
                    { id: "jurnal-kerja", label: "Jurnal Kerja", icon: "📝", badge: journals.length },
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
                {openSections.sistem ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
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
        <div className="p-3 bg-[#010704] rounded-xl border border-emerald-950 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-xs text-white ring-1 ring-emerald-500/40 flex-shrink-0">
                {currentActiveEmployee.avatar}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white block truncate">{currentActiveEmployee.name}</span>
                <span className="text-[10px] text-emerald-400 font-semibold block truncate">{currentActiveEmployee.role}</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/50 border-t border-emerald-900/40 pt-1 flex items-center justify-between">
            <span>Level: {currentActiveEmployee.level}</span>
            <span className="text-white/80">Dept: {currentActiveEmployee.dept}</span>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* PANEL KANAN: BERGRADASI HIJAU TUA MODERN                  */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-br from-[#051f14] via-[#020d08] to-[#010604] relative">
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-0" />

        {/* Top Header Row — Switcher Simulasi Role */}
        <header className="px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-emerald-950/40">
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

        {/* Content Body Based on Active Menu */}
        <div className="px-8 py-6 space-y-6 relative z-10">
          {/* ===================================================== */}
          {/* VIEW: DASHBOARD                                       */}
          {/* ===================================================== */}
          {activeMenu === "dashboard" && (() => {
            const totalEmp = employees.length;
            const tetapCount = employees.filter((e) => e.contractType === "Tetap").length;
            const kontrakCount = employees.filter((e) => e.contractType === "Kontrak").length;
            const magangCount = employees.filter((e) => e.contractType === "Magang").length;
            const dwCount = employees.filter((e) => e.contractType === "DW").length;
            const otherCount = magangCount + dwCount;
            const percentTetap = totalEmp > 0 ? Math.round((tetapCount / totalEmp) * 100) : 0;
            const percentKontrak = totalEmp > 0 ? Math.round((kontrakCount / totalEmp) * 100) : 0;
            const percentOther = Math.max(0, 100 - percentTetap - percentKontrak);

            return (
              <div className="space-y-6">
                {/* Role Scope Notice Banner */}
                <div className="bg-[#021109] rounded-2xl p-4 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm flex-shrink-0">
                      {currentActiveEmployee.dept}
                    </div>
                    <div>
                      <span className="font-bold text-white block">
                        Sudut Pandang Login: {currentActiveEmployee.name} — {currentActiveEmployee.role}
                      </span>
                      <span className="text-[11px] text-white/70">
                        {currentActiveEmployee.role.includes("HR")
                          ? "Anda memiliki wewenang khusus HR untuk mendaftarkan karyawan baru dan mengelola akun user."
                          : currentActiveEmployee.role.includes("IT")
                          ? "Anda memiliki wewenang khusus IT untuk mengelola server, database, geofence, dan keamanan teknis."
                          : currentActiveEmployee.level === "Supervisor"
                          ? `Sebagai ${currentActiveEmployee.role}, Anda mengawasi dan menyetujui absensi & cuti staf departemen ${currentActiveEmployee.dept}.`
                          : `Sebagai ${currentActiveEmployee.role}, Anda melapor langsung ke Supervisor ${currentActiveEmployee.dept}.`}
                      </span>
                    </div>
                  </div>

                  {hasPermission("emp_manage_hr") && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openAddEmployeeModal("staff")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Tambah Staff</span>
                      </button>
                      <button
                        onClick={() => openAddEmployeeModal("atasan")}
                        className="px-3 py-1.5 rounded-xl bg-[#031d11] border border-amber-400/50 text-amber-300 font-extrabold text-xs hover:bg-emerald-950 transition-all flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                        <span>+ Tambah Atasan</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 1. KARTU UTAMA: WORKFORCE INTELLIGENCE - HUMAN CAPITAL OVERVIEW (SESUAI GAMBAR REFERENSI USER) */}
                <div className="bg-gradient-to-br from-[#06291a] via-[#02180e] to-[#010b06] rounded-3xl p-6 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/60 pb-3 mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                          ABSENKU • WORKFORCE INTELLIGENCE
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-white mt-0.5">Human Capital Overview</h2>
                      <p className="text-xs text-white/70">Komposisi dan statistik SDM aktif</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-extrabold text-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        DATA ABSENKU
                      </span>
                    </div>
                  </div>

                  {/* Grid 2 Kolom: Donut Chart Kiri + Progress Bar Kanan */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Donut Chart Kolom Kiri */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
                      <div className="relative w-44 h-44 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                          {/* Background Ring */}
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="#042013"
                            strokeWidth="11"
                          />
                          {/* Tetap Arc (Gold/Amber) */}
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="#eab308"
                            strokeWidth="11"
                            strokeDasharray={2 * Math.PI * 46}
                            strokeDashoffset={2 * Math.PI * 46 * (1 - percentTetap / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                          {/* Kontrak Arc (Sky Blue) */}
                          {percentKontrak > 0 && (
                            <circle
                              cx="60"
                              cy="60"
                              r="46"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="11"
                              strokeDasharray={2 * Math.PI * 46}
                              strokeDashoffset={2 * Math.PI * 46 * (1 - percentKontrak / 100)}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                              style={{
                                transformOrigin: "center",
                                transform: `rotate(${(percentTetap / 100) * 360}deg)`,
                              }}
                            />
                          )}
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-4xl font-black text-white font-mono tracking-tight leading-none">
                            {totalEmp}
                          </span>
                          <span className="text-xs font-bold text-white/80 mt-1">Karyawan</span>
                        </div>
                      </div>
                      <span className="text-xs text-white/70 font-semibold mt-3 text-center">
                        Komposisi karyawan aktif
                      </span>
                    </div>

                    {/* Progress Bars & Insight SDM Kolom Kanan */}
                    <div className="md:col-span-7 flex flex-col justify-center space-y-4">
                      {/* Bar 1: Kontrak */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                            <span>Karyawan Kontrak</span>
                          </div>
                          <span className="font-mono text-white/90">{kontrakCount} · {percentKontrak}%</span>
                        </div>
                        <div className="w-full bg-[#021008] h-3 rounded-full overflow-hidden border border-emerald-900/40">
                          <div
                            className="bg-sky-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-sky-500"
                            style={{ width: `${percentKontrak}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Bar 2: Tetap */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                            <span>Karyawan Tetap</span>
                          </div>
                          <span className="font-mono text-white/90">{tetapCount} · {percentTetap}%</span>
                        </div>
                        <div className="w-full bg-[#021008] h-3 rounded-full overflow-hidden border border-emerald-900/40">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-amber-500"
                            style={{ width: `${percentTetap}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Bar 3: Magang & DW jika ada */}
                      {otherCount > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                              <span>Magang & Daily Worker (DW)</span>
                            </div>
                            <span className="font-mono text-white/90">{otherCount} · {percentOther}%</span>
                          </div>
                          <div className="w-full bg-[#021008] h-3 rounded-full overflow-hidden border border-emerald-900/40">
                            <div
                              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentOther}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Box Insight SDM */}
                      <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                          INSIGHT SDM
                        </span>
                        <p className="text-xs text-white/90 font-medium leading-relaxed">
                          Sebagian besar karyawan aktif berstatus {percentTetap >= 50 ? "tetap" : "kontrak"} ({percentTetap}% tetap, {percentKontrak}% kontrak).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. BARIS 4 KARTU STATISTIK METRIK SDM (SESUAI GAMBAR REFERENSI USER) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    onClick={() => setActiveMenu("karyawan")}
                    className="p-4 rounded-2xl cursor-pointer bg-gradient-to-br from-[#062417] to-[#021008] border-2 border-emerald-400 shadow-xl shadow-black hover:brightness-110 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-xs text-white mb-2 font-bold">
                      <span className="text-sm">👥</span>
                      <span>Seluruh Karyawan</span>
                    </div>
                    <div className="text-3xl font-black text-white font-mono group-hover:text-emerald-300 transition-colors">
                      {totalEmp}
                    </div>
                    <span className="text-[11px] text-white/70 mt-1 block">Tenaga kerja aktif</span>
                  </div>

                  <div
                    onClick={() => setActiveMenu("kontrak")}
                    className="p-4 rounded-2xl cursor-pointer bg-gradient-to-br from-[#062417] to-[#021008] border border-emerald-900/60 hover:border-sky-400/50 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-xs text-white mb-2 font-bold">
                      <span className="text-sm">📋</span>
                      <span>Karyawan Kontrak</span>
                    </div>
                    <div className="text-3xl font-black text-white font-mono group-hover:text-sky-300 transition-colors">
                      {kontrakCount}
                    </div>
                    <span className="text-[11px] text-white/70 mt-1 block">Status kontrak</span>
                  </div>

                  <div
                    onClick={() => setActiveMenu("kontrak")}
                    className="p-4 rounded-2xl cursor-pointer bg-gradient-to-br from-[#062417] to-[#021008] border border-emerald-900/60 hover:border-amber-400/50 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-xs text-white mb-2 font-bold">
                      <span className="text-sm">🏅</span>
                      <span>Karyawan Tetap</span>
                    </div>
                    <div className="text-3xl font-black text-white font-mono group-hover:text-amber-300 transition-colors">
                      {tetapCount}
                    </div>
                    <span className="text-[11px] text-white/70 mt-1 block">Status tetap</span>
                  </div>

                  <div
                    onClick={() => setActiveMenu("user-management")}
                    className="p-4 rounded-2xl cursor-pointer bg-gradient-to-br from-[#062417] to-[#021008] border border-emerald-900/60 hover:border-emerald-400/50 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-xs text-white mb-2 font-bold">
                      <span className="text-sm">👤</span>
                      <span>User Aktif</span>
                    </div>
                    <div className="text-3xl font-black text-white font-mono group-hover:text-emerald-300 transition-colors">
                      {users.length}
                    </div>
                    <span className="text-[11px] text-white/70 mt-1 block">Akun sistem aktif</span>
                  </div>
                </div>

                {/* 3. BANNER METRIK TERPILIH (SESUAI GAMBAR REFERENSI USER) */}
                <div className="bg-gradient-to-r from-[#062417] to-[#021008] border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                      METRIK TERPILIH
                    </span>
                    <h3 className="text-lg font-black text-white">Seluruh Karyawan</h3>
                    <p className="text-xs text-white/70 mt-0.5">Total tenaga kerja aktif di database HRIS.</p>
                  </div>
                  <div className="text-4xl font-black text-white font-mono">
                    {totalEmp}
                  </div>
                </div>

                {/* 4. TABEL STRUKTUR HIRARKI ORGANISASI (SESUAI GAMBAR REFERENSI USER) */}
                <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-emerald-900/60 pb-3">
                    <div>
                      <h2 className="text-base font-black text-white flex items-center gap-2">
                        <Network className="w-5 h-5 text-emerald-400" />
                        <span>Matriks Hirarki Organisasi (4 Tingkat: CEO → GM → Supervisor → Staff)</span>
                      </h2>
                      <p className="text-xs text-white/70">
                        1 CEO membawahi 1 General Manager. 1 GM membawahi seluruh 6 Supervisor. Masing-masing Supervisor membawahi Staff di departemennya.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 self-start">
                      6 DEPARTEMEN AKTIF
                    </span>
                  </div>

                  {/* Executive Leadership Bar (1 CEO & 1 GM) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#010804] p-4 rounded-2xl border border-emerald-900/60">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 font-black text-lg flex items-center justify-center ring-1 ring-amber-400">
                        HG
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">PUCUK PIMPINAN • MAKS 1 CEO</span>
                        <h4 className="font-extrabold text-white text-sm">Ir. Hendra Gunawan</h4>
                        <p className="text-[11px] text-white/70">Direktur Utama (CEO) — Membawahi General Manager</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sky-500/10 to-transparent border border-sky-500/30">
                      <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 font-black text-lg flex items-center justify-center ring-1 ring-sky-400">
                        KS
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-sky-400 block tracking-wider">MANAJEMEN EKSEKUTIF • MAKS 1 GM</span>
                        <h4 className="font-extrabold text-white text-sm">
                          {employees.find((e) => e.level === "GeneralManager")?.name || "Dr. Kartika Sari, S.E., M.M."}
                        </h4>
                        <p className="text-[11px] text-white/70">General Manager (GM) — Membawahi Seluruh 6 Supervisor</p>
                      </div>
                    </div>
                  </div>

                  {/* Grid 6 Departemen Sesuai Referensi Gambar */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-emerald-900/60 text-white text-[11px] uppercase font-black">
                          <th className="py-2.5">Departemen</th>
                          <th className="py-2.5">General Manager (Membawahi SPV)</th>
                          <th className="py-2.5">Supervisor (Atasan Langsung)</th>
                          <th className="py-2.5">Staff (Bawahan)</th>
                          <th className="py-2.5">Wewenang Khusus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-900/30">
                        {standardDepartments.map((dept) => {
                          const gm = employees.find((e) => e.level === "GeneralManager");
                          const spv = employees.find((e) => e.dept === dept.id && e.level === "Supervisor");
                          const stf = employees.filter((e) => e.dept === dept.id && e.level === "Staff");

                          return (
                            <tr key={dept.id} className="hover:bg-emerald-950/20 transition-colors">
                              <td className="py-3 font-bold text-white flex items-center gap-2">
                                <span className="text-base">{dept.icon}</span>
                                <span className="text-sm font-extrabold text-white">{dept.name}</span>
                              </td>
                              <td className="py-3">
                                <span className="font-bold text-sky-300 block">General Manager (GM)</span>
                                <span className="text-[11px] text-white/80 font-medium">
                                  {gm ? gm.name : "Belum Ditugaskan"}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className="font-bold text-amber-300 block">{dept.supervisorRole}</span>
                                <span className="text-[11px] text-white/80 font-medium">
                                  {spv ? spv.name : "Belum Ditugaskan"}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className="font-bold text-emerald-400 block">{dept.staffRole}</span>
                                <span className="text-[11px] text-white/80 font-medium">
                                  {stf.length > 0 ? stf.map((s) => s.name).join(", ") : "Belum Ditugaskan"}
                                </span>
                              </td>
                              <td className="py-3 text-[11px] text-white/70 max-w-xs">
                                {dept.id === "HR" ? (
                                  <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-200 border border-pink-500/30 font-semibold block">
                                    👔 Membuat akun, daftarkan karyawan, atur jabatan & departemen
                                  </span>
                                ) : dept.id === "IT" ? (
                                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-500/30 font-semibold block">
                                    🛡️ Mengurus server, database, maintenance, bug & geofence teknis
                                  </span>
                                ) : (
                                  <span>{dept.desc}</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Kotak Catatan Pembagian Khusus Sesuai Gambar User */}
                  <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 space-y-1.5 text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                      PEMBAGIAN KHUSUS (SPECIAL RESPONSIBILITIES):
                    </span>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="text-emerald-400 font-bold">•</span>
                      <p>
                        <strong>Hirarki 4 Tingkat:</strong> CEO (Direktur Utama) → General Manager → Supervisor → Staff. GM membawahi semua Supervisor di departemennya.
                      </p>
                    </div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="text-emerald-400 font-bold">•</span>
                      <p>
                        <strong>HR Supervisor atau HR Staff yang diberi izin</strong> dapat membuat akun karyawan, mendaftarkan karyawan, mengatur data jabatan dan departemen.
                      </p>
                    </div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="text-emerald-400 font-bold">•</span>
                      <p>
                        <strong>IT Supervisor atau IT Staff</strong> mengurus server, database, maintenance, bug, geofence GPS, dan keamanan teknis sistem absensi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* VIEW: KARYAWAN & STRUKTUR HIRARKI                     */}
          {/* ===================================================== */}
          {activeMenu === "karyawan" && (
            <div className="space-y-6">
              {/* Header Box: Pendaftaran Karyawan Baru */}
              <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">Direktori Karyawan & Relasi Atasan-Bawahan</h3>
                  <p className="text-xs text-white/70">
                    Hirarki: CEO → GM → Supervisor → Staff. Staf melapor ke Supervisor, Supervisor ke GM, GM ke CEO. HR mendaftarkan akun, IT mengelola keamanan.
                  </p>
                </div>

                {hasPermission("emp_manage_hr") && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openAddEmployeeModal("staff")}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-black"
                    >
                      <UserPlus className="w-4 h-4 text-black" />
                      <span>+ Tambah Staff (Karyawan)</span>
                    </button>
                    <button
                      onClick={() => openAddEmployeeModal("atasan")}
                      className="px-4 py-2.5 rounded-xl bg-[#031d11] border border-amber-400/50 text-amber-300 font-extrabold text-xs hover:bg-emerald-950 transition-all flex items-center gap-2 shadow-lg shadow-black"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>+ Tambah Atasan (Pimpinan)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* BANNER ATASAN LANGSUNG (UNTUK STAFF & SUPERVISOR) */}
              {directSuperior && (
                <div className="bg-gradient-to-r from-[#06291a] to-[#021008] rounded-2xl p-5 border border-emerald-500/40 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> ATASAN LANGSUNG SAYA (N+1)
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Departemen: {directSuperior.dept}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-950 flex items-center justify-center font-black text-white text-xl ring-2 ring-emerald-400">
                        {directSuperior.avatar}
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-white leading-tight">{directSuperior.name}</h4>
                        <p className="text-xs text-white/80">{directSuperior.role}</p>
                        <p className="text-[11px] text-white/60 font-mono mt-0.5">NIK: {directSuperior.nik}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${directSuperior.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1.5 text-xs font-bold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hubungi Atasan Langsung (WA)</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* BANNER BAWAHAN LANGSUNG (UNTUK SUPERVISOR) */}
              {directSubordinates.length > 0 && (
                <div className="bg-[#02110a] rounded-2xl p-5 border border-emerald-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> BAWAHAN LANGSUNG SAYA DI DEPARTEMEN {currentActiveEmployee.dept} ({directSubordinates.length} STAF)
                    </span>
                    <span className="text-[10px] text-white/60">
                      Anda bertanggung jawab penuh atas absensi, jadwal shift & approval cuti mereka
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {directSubordinates.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-xl bg-[#010804] border border-emerald-900/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center font-bold text-white text-xs ring-1 ring-emerald-500/30">
                            {sub.avatar}
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">{sub.name}</span>
                            <span className="text-[10px] text-white/60 block">{sub.role} ({sub.contractType})</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedEmployeeId(sub.id);
                            setActiveMenu("absensi");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500 hover:text-black transition-all"
                        >
                          Cek Absen
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter & Search Bar */}
              <div className="bg-[#03150d] rounded-2xl p-4 border border-emerald-900/60 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Cari nama, NIK, posisi, atau departemen..."
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
                    <option value="ALL">Semua Departemen (6)</option>
                    {standardDepartments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  {(filterDept !== "ALL" || searchEmployeeQuery) && (
                    <button
                      onClick={() => {
                        setFilterDept("ALL");
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
                {filteredEmployees.map((k) => {
                  const empSuperior = getDirectSuperior(k);
                  const isHRDPov = activePerspective === "admin" || currentRoleName === "Super Admin" || currentRoleName === "HR Supervisor";

                  return (
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

                        {/* Status Badge: Tetap / Kontrak / Magang / DW */}
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                            k.contractType === "Tetap"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : k.contractType === "Kontrak"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : k.contractType === "Magang"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {k.contractType}
                        </span>
                      </div>

                      {/* Detail Info Karyawan */}
                      <div className="text-xs text-white/90 space-y-1.5 pt-2 border-t border-emerald-900/40">
                        <div className="flex justify-between">
                          <span className="text-white/60">Departemen:</span>
                          <span className="font-black text-white">{k.dept}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Posisi:</span>
                          <span className="font-semibold text-white">{k.role}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Atasan Langsung:</span>
                          <span className="font-semibold text-amber-300">
                            {empSuperior ? empSuperior.name : "Direktur Utama"}
                          </span>
                        </div>

                        {/* Tanggal Kerja */}
                        <div className="bg-[#010804] p-2.5 rounded-xl border border-emerald-900/40 space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-white/60">Tanggal Pertama Kerja:</span>
                            <span className="font-mono font-bold text-white">{k.startDate}</span>
                          </div>
                          {k.contractType !== "Tetap" && k.endDate && (
                            <div className="flex justify-between">
                              <span className="text-white/60">Tanggal Terakhir Kerja:</span>
                              <span className="font-mono font-bold text-amber-400">{k.endDate}</span>
                            </div>
                          )}
                        </div>

                        {/* STATUS PASSWORD DI SISI POV HRD */}
                        {isHRDPov && (
                          <div className="pt-1">
                            {k.isFirstLogin && k.temporaryPassword ? (
                              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 flex items-center justify-between text-[10px]">
                                <div>
                                  <span className="text-amber-300 font-bold block">Password Sementara:</span>
                                  <span className="font-mono font-black text-white tracking-widest">
                                    {k.temporaryPassword}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                  Belum Login
                                </span>
                              </div>
                            ) : (
                              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                <span>Password Aktif (Telah Diganti Mandiri)</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Links */}
                      <div className="pt-2 border-t border-emerald-900/40 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedEmployeeId(k.id);
                            setActiveMenu("absensi");
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 text-[10px] font-bold transition-all text-center"
                        >
                          📍 Absen Wajah
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenu("pengajuan-cuti");
                            showToast(`Buka pengajuan cuti untuk ${k.name}`);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[10px] font-semibold transition-all text-center"
                        >
                          🏖️ Cuti
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: DEPARTEMEN                                      */}
          {/* ===================================================== */}
          {activeMenu === "departemen" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-white text-base">6 Departemen Perusahaan</h3>
                <p className="text-xs text-white/70">
                  HR dan IT tetap menjadi departemen fungsional, bukan level jabatan tambahan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {standardDepartments.map((d) => {
                  const staffCount = employees.filter((e) => e.dept === d.id).length;
                  const spv = employees.find((e) => e.dept === d.id && e.level === "Supervisor");

                  return (
                    <div key={d.id} className="bg-gradient-to-br from-[#072619] to-[#010e07] rounded-2xl p-5 border border-emerald-900/60 shadow-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{d.icon}</span>
                          <div>
                            <h4 className="font-black text-white text-base">{d.name}</h4>
                            <span className="text-[10px] text-white/60 block">{d.desc}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-white/60">General Manager (GM):</span>
                          <span className="font-bold text-sky-300">
                            {employees.find((e) => e.level === "GeneralManager")?.name || "Belum ada"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Supervisor:</span>
                          <span className="font-bold text-amber-300">{spv ? spv.name : "Belum ada"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Total Karyawan:</span>
                          <span className="font-mono font-bold text-white">{staffCount} Orang</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setFilterDept(d.id);
                          setActiveMenu("karyawan");
                        }}
                        className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all text-center"
                      >
                        Lihat Karyawan {d.id} ({staffCount}) →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: USER MANAGEMENT & RBAC                          */}
          {/* ===================================================== */}
          {activeMenu === "user-management" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => setUserManagementTab("rbac")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      userManagementTab === "rbac"
                        ? "bg-emerald-500 text-black shadow-lg"
                        : "bg-[#021008] text-white hover:bg-emerald-950/60 border border-emerald-900/60"
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Matriks Izin Akses (HR & IT Khusus)</span>
                  </button>
                  <button
                    onClick={() => setUserManagementTab("users")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      userManagementTab === "users"
                        ? "bg-emerald-500 text-black shadow-lg"
                        : "bg-[#021008] text-white hover:bg-emerald-950/60 border border-emerald-900/60"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Daftar Akun User ({users.length})</span>
                  </button>
                </div>

                {hasPermission("emp_manage_hr") && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddEmployeeModal("staff")}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Tambah Staff</span>
                    </button>
                    <button
                      onClick={() => openAddEmployeeModal("atasan")}
                      className="px-3.5 py-2 rounded-xl bg-[#031d11] border border-amber-400/50 text-amber-300 font-extrabold text-xs hover:bg-emerald-950 transition-all flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>+ Tambah Atasan</span>
                    </button>
                  </div>
                )}
              </div>

              {/* TAB 1: RBAC MATRIX DENGAN PEMBAGIAN KHUSUS HR & IT */}
              {userManagementTab === "rbac" && (
                <div className="space-y-4">
                  <div className="bg-[#03150d] rounded-2xl p-4 border border-emerald-900/60 space-y-2">
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">
                      PEMBAGIAN KHUSUS WEWENANG SISTEM (HR & IT)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-[#010804] p-3 rounded-xl border border-pink-500/30">
                        <span className="font-bold text-pink-300 block mb-0.5">👔 Wewenang Khusus HR:</span>
                        <p className="text-[11px] text-white/80">
                          HR Supervisor atau HR Staff yang diberi izin dapat membuat akun karyawan, mendaftarkan karyawan baru, dan mengatur data jabatan/departemen.
                        </p>
                      </div>
                      <div className="bg-[#010804] p-3 rounded-xl border border-blue-500/30">
                        <span className="font-bold text-blue-300 block mb-0.5">🛡️ Wewenang Khusus IT:</span>
                        <p className="text-[11px] text-white/80">
                          IT Supervisor atau IT Staff mengurus server, database, maintenance, perbaikan bug, dan keamanan teknis (Geofence GPS).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-emerald-900/60 text-white text-[10px] uppercase font-bold">
                          <th className="pb-3 w-1/3">Izin Akses & Fitur Sistem</th>
                          <th className="pb-3 text-center">Super Admin</th>
                          <th className="pb-3 text-center">HR Supervisor</th>
                          <th className="pb-3 text-center">HR Staff</th>
                          <th className="pb-3 text-center">IT Supervisor</th>
                          <th className="pb-3 text-center">IT Staff</th>
                          <th className="pb-3 text-center">Supervisor (Umum)</th>
                          <th className="pb-3 text-center">Staff (Umum)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-900/30">
                        {allPermissions.map((perm) => (
                          <tr key={perm.id} className="hover:bg-emerald-950/20 transition-colors">
                            <td className="py-3">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase block">{perm.category}</span>
                              <span className="font-bold text-white text-xs block">{perm.name}</span>
                              <span className="text-[10px] text-white/60">{perm.description}</span>
                            </td>
                            {["Super Admin", "HR Supervisor", "HR Staff", "IT Supervisor", "IT Staff", "Supervisor", "Staff"].map((role) => {
                              const isChecked = (rolePermissions[role] || []).includes(perm.id);
                              return (
                                <td key={role} className="py-3 text-center">
                                  <button
                                    onClick={() => togglePermission(role, perm.id)}
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center mx-auto transition-all ${
                                      isChecked
                                        ? "bg-emerald-500 text-black hover:bg-emerald-400"
                                        : "bg-[#010804] border border-emerald-900/80 text-white/30 hover:border-emerald-500/50"
                                    }`}
                                  >
                                    {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: LIST USER AKUN */}
              {userManagementTab === "users" && (
                <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                        <th className="pb-3">Nama Karyawan</th>
                        <th className="pb-3">Email Login</th>
                        <th className="pb-3">Departemen</th>
                        <th className="pb-3">Role Hak Akses</th>
                        <th className="pb-3">Status Password</th>
                        <th className="pb-3">Status Akun</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/30">
                      {users.map((u) => {
                        const linkedEmp = employees.find((e) => e.email === u.email);
                        const isTemp = linkedEmp?.isFirstLogin && linkedEmp?.temporaryPassword;

                        return (
                          <tr key={u.id} className="hover:bg-emerald-950/20 transition-colors">
                            <td className="py-3 font-bold text-white">{u.name}</td>
                            <td className="py-3 font-mono text-white/80">{u.email}</td>
                            <td className="py-3 font-bold text-white">{u.dept}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3">
                              {isTemp ? (
                                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-[10px]">
                                  🔑 Pass Sementara: {linkedEmp.temporaryPassword}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  ✓ Password Aktif (Rahasia)
                                </span>
                              )}
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-white border border-emerald-400/30">
                                {u.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: ABSENSI (SCANNER GPS & WAJAH)                   */}
          {/* ===================================================== */}
          {activeMenu === "absensi" && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-[#03150d] rounded-2xl p-4 border border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Pilih Akun yang Melakukan Absensi:</span>
                  <span className="text-xs text-white">Simulasikan check-in karyawan:</span>
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
                      {emp.name} ({emp.dept} - {emp.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-3xl bg-gradient-to-b from-[#072a1b] via-[#03150d] to-[#010a06] p-6 border border-emerald-500/30 shadow-2xl relative">
                <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full ring-2 ring-emerald-400 bg-emerald-950 flex items-center justify-center font-black text-white text-base">
                      {selectedEmployee.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{selectedEmployee.name}</h3>
                      <p className="text-[11px] text-white/80">NIK: {selectedEmployee.nik} • {selectedEmployee.role}</p>
                      <span className="text-[10px] font-bold text-emerald-400">
                        Dept: {selectedEmployee.dept} • Atasan: {getDirectSuperior(selectedEmployee)?.name || "Direksi"}
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

                {/* Distance Slider */}
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

                {/* Camera Scanner Oval */}
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

                {attendanceState === "SUCCESS" ? (
                  <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-2xl p-5 text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-white font-black text-base">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span>APPROVED (Otomatis Hadir Sah)</span>
                    </div>
                    <p className="text-xs text-white">
                      Jam Server: <strong>{currentTime}</strong> • Tepat Waktu • Jarak: {simulatedDistance.toFixed(1)}m
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
                    Audit log kehadiran terverifikasi otomatis untuk 6 departemen
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => showToast("Mengekspor laporan format XLSX...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#020d07] text-white border border-emerald-900/60 text-xs font-semibold hover:bg-emerald-950 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor XLSX</span>
                  </button>
                  <button
                    onClick={() => showToast("Mengekspor audit trail PDF...")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#020d07] text-white border border-emerald-900/60 text-xs font-semibold hover:bg-emerald-950 transition-all"
                  >
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
                    {attendances.map((r) => (
                      <tr key={r.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3 font-bold text-white">{r.name}</td>
                        <td className="py-3 text-white/80 font-semibold">{r.dept}</td>
                        <td className="py-3 text-white/70">{r.shift}</td>
                        <td className="py-3 font-mono text-white">{r.in}</td>
                        <td className="py-3 font-mono text-white/70">{r.out}</td>
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
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: JABATAN                                         */}
          {/* ===================================================== */}
          {activeMenu === "jabatan" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-white text-base">Daftar Jabatan: Supervisor & Staff per Departemen</h3>
                <p className="text-xs text-white/70">
                  Struktur sederhana dan efisien: 1 Supervisor per departemen membawahi para Staff.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3">Departemen</th>
                      <th className="pb-3">Jabatan</th>
                      <th className="pb-3">Tingkatan</th>
                      <th className="pb-3">Karyawan Ditugaskan</th>
                      <th className="pb-3">Melapor Kepada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {employees.map((emp) => {
                      const superior = getDirectSuperior(emp);
                      return (
                        <tr key={emp.id} className="hover:bg-emerald-950/20 transition-colors">
                          <td className="py-3 font-black text-white">{emp.dept}</td>
                          <td className="py-3 font-bold text-white">{emp.role}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                emp.level === "Director"
                                  ? "bg-purple-500/20 text-purple-300"
                                  : emp.level === "Supervisor"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-emerald-500/20 text-emerald-300"
                              }`}
                            >
                              {emp.level}
                            </span>
                          </td>
                          <td className="py-3 text-white text-[11px] font-semibold">{emp.name}</td>
                          <td className="py-3 text-amber-300 font-semibold text-[11px]">
                            {superior ? superior.name : "Direksi (Puncak)"}
                          </td>
                        </tr>
                      );
                    })}
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
                  <h3 className="font-bold text-white text-base">Status Kerja & Lifecycle Karyawan</h3>
                  <p className="text-xs text-white/70">
                    Karyawan Tetap (hanya tanggal masuk) vs Kontrak, Magang, DW (dilengkapi tanggal berakhir)
                  </p>
                </div>
                {hasPermission("emp_manage_hr") && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddEmployeeModal("staff")}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> + Tambah Staff
                    </button>
                    <button
                      onClick={() => openAddEmployeeModal("atasan")}
                      className="px-3.5 py-2 rounded-xl bg-[#031d11] border border-amber-400/50 text-amber-300 font-bold text-xs hover:bg-emerald-950 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> + Tambah Atasan
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3">Karyawan</th>
                      <th className="pb-3">Departemen</th>
                      <th className="pb-3">Posisi</th>
                      <th className="pb-3">Status Kerja</th>
                      <th className="pb-3">Tanggal Pertama Kerja</th>
                      <th className="pb-3">Tanggal Terakhir Kerja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {employees.map((k) => (
                      <tr key={k.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3 font-bold text-white">{k.name}</td>
                        <td className="py-3 font-bold text-white/90">{k.dept}</td>
                        <td className="py-3 text-white/70 text-[11px]">{k.role}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              k.contractType === "Tetap"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : k.contractType === "Kontrak"
                                ? "bg-blue-500/20 text-blue-300"
                                : k.contractType === "Magang"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {k.contractType}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-white text-[11px]">{k.startDate}</td>
                        <td className="py-3 font-mono text-[11px]">
                          {k.contractType === "Tetap" ? (
                            <span className="text-white/40 italic">Hanya tanggal masuk</span>
                          ) : (
                            <span className="text-amber-400 font-bold">{k.endDate || "--"}</span>
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
          {/* VIEW: JADWAL SHIFT                                    */}
          {/* ===================================================== */}
          {activeMenu === "jadwal-shift" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white text-base">Manajemen Shift Kerja Dinamis</h3>
                <p className="text-xs text-white">Konfigurasi jam kerja untuk 6 departemen</p>
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
                          <span className="text-xs text-white font-bold">{shiftStaffCount} Anggota</span>
                        </div>
                        <h4 className="font-bold text-white text-base mb-2">{s.name}</h4>
                        <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 text-center my-3">
                          <span className="font-mono text-xl font-extrabold text-white">
                            {s.startTime} - {s.endTime}
                          </span>
                        </div>
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
              <div>
                <h3 className="font-bold text-white text-base">Pengajuan Cuti Karyawan</h3>
                <p className="text-xs text-white/70">
                  Supervisor masing-masing departemen bertanggung jawab menyetujui permohonan cuti bawahannya.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3">Karyawan</th>
                      <th className="pb-3">Departemen</th>
                      <th className="pb-3">Jenis Cuti</th>
                      <th className="pb-3">Tanggal</th>
                      <th className="pb-3">Durasi</th>
                      <th className="pb-3">Alasan</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {leaves.map((c) => (
                      <tr key={c.id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-3 font-bold text-white">{c.name}</td>
                        <td className="py-3 font-black text-white">{c.dept}</td>
                        <td className="py-3 text-white text-[11px]">{c.type}</td>
                        <td className="py-3 font-mono text-white text-[11px]">{c.start} s/d {c.end}</td>
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
              <div>
                <h3 className="font-bold text-white text-base">Jurnal Kerja Harian</h3>
                <p className="text-xs text-white/70">Catatan aktivitas pekerjaan dan review kualitas oleh Supervisor</p>
              </div>

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
                          <p className="text-[10px] text-white/60">Dept: {j.dept} • {j.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white text-xs">{j.hours}</span>
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
          {/* VIEW: PENGATURAN TEKNIS IT (WEWENANG KHUSUS IT)       */}
          {/* ===================================================== */}
          {activeMenu === "pengaturan" && (
            <div className="max-w-2xl bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-6 border border-emerald-900/60 space-y-5">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    <span>Pengaturan Teknis IT & Geofence GPS</span>
                  </h3>
                  <p className="text-xs text-white/70">
                    Wewenang khusus IT Supervisor & IT Staff untuk mengelola infrastruktur & keamanan sistem.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                  IT ONLY
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-white block mb-1 font-bold">Nama Titik Kantor</label>
                  <input
                    type="text"
                    value={settings.officeName}
                    onChange={(e) => setSettings({ ...settings, officeName: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white"
                  />
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
                  </div>
                  <div>
                    <label className="text-white block mb-1 font-bold">Ambang Batas Skor AI Wajah (%)</label>
                    <input
                      type="number"
                      value={settings.aiFaceThreshold}
                      onChange={(e) => setSettings({ ...settings, aiFaceThreshold: parseInt(e.target.value) || 80 })}
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={() => showToast("✓ Konfigurasi server geofence berhasil disimpan oleh tim IT!")}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-extrabold text-xs hover:brightness-110 transition-all shadow-lg"
                >
                  Simpan Konfigurasi Teknis IT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: FORM PENDAFTARAN KARYAWAN (WEWENANG KHUSUS HR)   */}
      {/* PEMISAHAN: TAMBAH STAFF vs TAMBAH ATASAN                  */}
      {/* ========================================================= */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-7 max-w-xl w-full shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
              <div>
                <span className="text-[10px] text-pink-400 font-black uppercase tracking-wider block">
                  WEWENANG KHUSUS HR • PENDAFTARAN AKUN
                </span>
                <h3 className="font-black text-white text-base">
                  {addRegistrationType === "staff" ? "Daftarkan Staff (Karyawan Pelaksana)" : "Daftarkan Atasan (Pimpinan Struktur)"}
                </h3>
              </div>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELEKSI: TAMBAH STAFF vs TAMBAH ATASAN */}
            <div className="flex bg-[#010804] p-1.5 rounded-2xl border border-emerald-900/80 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAddRegistrationType("staff");
                  const hrSpv = employees.find((e) => e.dept === "HR" && e.level === "Supervisor");
                  setNewEmployeeForm((prev) => ({
                    ...prev,
                    level: "Staff",
                    dept: "HR",
                    managerId: hrSpv ? hrSpv.id : "",
                  }));
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  addRegistrationType === "staff"
                    ? "bg-emerald-500 text-black shadow-lg shadow-black"
                    : "text-white/70 hover:text-white hover:bg-emerald-950/40"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Staff (Karyawan)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAddRegistrationType("atasan");
                  const hasCeo = employees.some((e) => e.level === "Director");
                  const hasGm = employees.some((e) => e.level === "GeneralManager");
                  const availableSpvDepts = standardDepartments.filter(
                    (d) => !employees.some((e) => e.dept === d.id && e.level === "Supervisor")
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

                  setNewEmployeeForm((prev) => ({
                    ...prev,
                    level: targetLevel,
                    dept: targetDept,
                    managerId: targetMgr,
                  }));
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  addRegistrationType === "atasan"
                    ? "bg-amber-400 text-black shadow-lg shadow-black"
                    : "text-white/70 hover:text-white hover:bg-emerald-950/40"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Tambah Atasan (Pimpinan)</span>
              </button>
            </div>

            <form onSubmit={handleRegisterEmployeeSubmit} className="space-y-3.5 text-xs">
              {/* Data Pribadi (Sama untuk Staff & Atasan) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/90 font-bold mb-1">NIK (Nomor Induk Karyawan) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 2026-0701"
                    value={newEmployeeForm.nik}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, nik: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-bold mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Maulana"
                    value={newEmployeeForm.name}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, name: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/90 font-bold mb-1">Email (Untuk Login Akun) *</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@perusahaan.id"
                    value={newEmployeeForm.email}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-bold mb-1">Nomor Handphone (WhatsApp) *</label>
                  <input
                    type="text"
                    required
                    placeholder="+62 812-9999-8888"
                    value={newEmployeeForm.phone}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, phone: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/90 font-bold mb-1">Alamat Tempat Tinggal</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Sudirman No. 12"
                    value={newEmployeeForm.address}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, address: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-bold mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    required
                    value={newEmployeeForm.birthDate}
                    onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, birthDate: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* KONDISIONAL: JIKA MODE TAMBAH STAFF (PELAKSANA)               */}
              {/* General Manager TIDAK PERNAH MUNCUL di sini!                 */}
              {/* ───────────────────────────────────────────────────────────── */}
              {addRegistrationType === "staff" ? (
                <div className="space-y-3">
                  <div className="bg-[#010c06] p-3 rounded-2xl border border-emerald-500/30 space-y-2">
                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
                      POSISI TINGKAT PELAKSANA (STAFF)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white font-bold mb-1">Pilih Departemen (6 Pokok) *</label>
                        <select
                          value={newEmployeeForm.dept}
                          onChange={(e) => handleDeptChange(e.target.value as DepartmentType)}
                          className="w-full bg-[#021008] border border-emerald-500/40 rounded-xl p-2.5 text-white font-bold focus:border-emerald-400 focus:outline-none"
                        >
                          {standardDepartments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-white/70 font-bold mb-1">Jabatan Otomatis</label>
                        <div className="w-full bg-[#021008] border border-emerald-900/80 rounded-xl p-2.5 text-emerald-300 font-bold">
                          {newEmployeeForm.dept} Staff
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Atasan Langsung Staff (Otomatis Terkunci ke Supervisor Departemen) */}
                  {(() => {
                    const deptSpv = employees.find(
                      (e) => e.dept === newEmployeeForm.dept && e.level === "Supervisor"
                    );

                    return (
                      <div className="bg-[#010804] p-3 rounded-2xl border border-emerald-500/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-emerald-400 font-bold text-xs">
                            Atasan Langsung (N+1) *
                          </label>
                          <span className="text-[10px] font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>Terkunci Otomatis</span>
                          </span>
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={
                              deptSpv
                                ? `${deptSpv.name} — ${deptSpv.role} (${deptSpv.dept})`
                                : `⚠️ Belum ada Supervisor untuk departemen ${newEmployeeForm.dept}`
                            }
                            className={`w-full bg-[#021008] border rounded-xl p-2.5 pr-10 font-bold cursor-not-allowed select-none focus:outline-none ${
                              deptSpv
                                ? "border-emerald-900/80 text-white"
                                : "border-red-500/60 text-red-300"
                            }`}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400">
                            <Lock className="w-4 h-4 text-emerald-400" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-0.5 text-[11px]">
                          {deptSpv ? (
                            <>
                              <span className="text-emerald-400 font-bold">✓ Relasi:</span>
                              <span className="text-white/80">
                                Staff ini otomatis melapor langsung ke Supervisor departemennya:{" "}
                                <strong className="text-amber-300">{deptSpv.name}</strong>.
                              </span>
                            </>
                          ) : (
                            <span className="text-red-400 font-semibold">
                              ⚠️ Harap daftarkan Supervisor untuk departemen {newEmployeeForm.dept} terlebih dahulu di tab &quot;Tambah Atasan&quot;.
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* ───────────────────────────────────────────────────────────── */
                /* KONDISIONAL: JIKA MODE TAMBAH ATASAN (PIMPINAN STRUKTUR)      */
                /* CEO (Maks 1), GM (Maks 1), Supervisor (1 per departemen)      */
                /* ───────────────────────────────────────────────────────────── */
                <div className="space-y-3">
                  {/* Status Kuota Atasan */}
                  {(() => {
                    const ceo = employees.find((e) => e.level === "Director");
                    const gm = employees.find((e) => e.level === "GeneralManager");
                    const spvList = employees.filter((e) => e.level === "Supervisor");

                    return (
                      <div className="bg-[#02120a] p-3 rounded-2xl border border-amber-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider">
                            STATUS KUOTA PIMPINAN (ATASAN)
                          </span>
                          <span className="text-[10px] text-white/60">Hirarki: CEO → GM → SPV</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                          <div className={`p-2 rounded-xl border ${ceo ? "bg-emerald-950/40 border-emerald-500/40" : "bg-black/40 border-emerald-900/40"}`}>
                            <span className="text-white/60 block">Direktur Utama</span>
                            <span className={`font-bold block mt-0.5 ${ceo ? "text-emerald-300" : "text-amber-300"}`}>
                              {ceo ? "1/1 Terisi" : "0/1 Kosong"}
                            </span>
                          </div>
                          <div className={`p-2 rounded-xl border ${gm ? "bg-emerald-950/40 border-emerald-500/40" : "bg-black/40 border-emerald-900/40"}`}>
                            <span className="text-white/60 block">General Manager</span>
                            <span className={`font-bold block mt-0.5 ${gm ? "text-emerald-300" : "text-amber-300"}`}>
                              {gm ? "1/1 Terisi" : "0/1 Kosong"}
                            </span>
                          </div>
                          <div className={`p-2 rounded-xl border ${spvList.length >= 6 ? "bg-emerald-950/40 border-emerald-500/40" : "bg-black/40 border-emerald-900/40"}`}>
                            <span className="text-white/60 block">Supervisor</span>
                            <span className={`font-bold block mt-0.5 ${spvList.length >= 6 ? "text-emerald-300" : "text-amber-300"}`}>
                              {spvList.length}/6 Terisi
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Form Pilihan Level Atasan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#010804] p-3 rounded-2xl border border-emerald-900/60">
                    <div>
                      <label className="block text-amber-300 font-bold mb-1">Tingkatan Atasan *</label>
                      {(() => {
                        const ceo = employees.find((e) => e.level === "Director");
                        const gm = employees.find((e) => e.level === "GeneralManager");
                        const spvList = employees.filter((e) => e.level === "Supervisor");

                        return (
                          <select
                            value={newEmployeeForm.level}
                            onChange={(e) => handleLevelChange(e.target.value as HierarchyLevel)}
                            className="w-full bg-[#021008] border border-amber-500/40 rounded-xl p-2.5 text-white font-bold focus:border-amber-400 focus:outline-none"
                          >
                            <option value="Director" disabled={Boolean(ceo)}>
                              👑 Direktur Utama (CEO) {ceo ? `— Terisi: ${ceo.name} (Terkunci)` : "— (Kosong)"}
                            </option>
                            <option value="GeneralManager" disabled={Boolean(gm)}>
                              🏢 General Manager (GM) {gm ? `— Terisi: ${gm.name} (Terkunci)` : "— (Kosong)"}
                            </option>
                            <option value="Supervisor" disabled={spvList.length >= 6}>
                              👔 Supervisor Departemen {spvList.length >= 6 ? "— Semua 6 Terisi (Terkunci)" : `— (Tersisa ${6 - spvList.length} Dept)`}
                            </option>
                          </select>
                        );
                      })()}
                    </div>

                    {/* Jika Supervisor: Pilih Departemen yang Belum Terisi */}
                    {newEmployeeForm.level === "Supervisor" ? (
                      <div>
                        <label className="block text-amber-300 font-bold mb-1">Pilih Departemen SPV *</label>
                        <select
                          value={newEmployeeForm.dept}
                          onChange={(e) => handleDeptChange(e.target.value as DepartmentType)}
                          className="w-full bg-[#021008] border border-amber-500/40 rounded-xl p-2.5 text-white font-bold focus:border-amber-400 focus:outline-none"
                        >
                          {standardDepartments.map((d) => {
                            const existingSpv = employees.find((e) => e.dept === d.id && e.level === "Supervisor");
                            return (
                              <option key={d.id} value={d.id} disabled={Boolean(existingSpv)}>
                                {d.name} {existingSpv ? `— Sudah Ada: ${existingSpv.name} (Terkunci)` : "— (Tersedia)"}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-white/70 font-bold mb-1">Struktur</label>
                        <div className="w-full bg-[#021008] border border-emerald-900/80 rounded-xl p-2.5 text-amber-300 font-bold">
                          {newEmployeeForm.level === "Director" ? "Direksi (Puncak Pimpinan)" : "Direksi (Manajemen Umum)"}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Atasan Langsung untuk Level Atasan (CEO -> Null, GM -> CEO, SPV -> GM) */}
                  {(() => {
                    const ceo = employees.find((e) => e.level === "Director");
                    const gm = employees.find((e) => e.level === "GeneralManager");

                    let superiorText = "";
                    let relationText = "";

                    if (newEmployeeForm.level === "Director") {
                      superiorText = "Pimpinan Tertinggi Organisasi (Tidak Memiliki Atasan)";
                      relationText = "CEO merupakan pimpinan tertinggi di perusahaan yang membawahi General Manager.";
                    } else if (newEmployeeForm.level === "GeneralManager") {
                      superiorText = ceo ? `${ceo.name} — Direktur Utama (CEO)` : "Belum Ada CEO";
                      relationText = `General Manager bertanggung jawab dan melapor langsung ke CEO (${ceo?.name || 'Direktur Utama'}), serta membawahi seluruh 6 Supervisor.`;
                    } else {
                      // Supervisor
                      superiorText = gm ? `${gm.name} — General Manager (GM)` : (ceo ? `${ceo.name} — Direktur Utama (CEO)` : "Belum Ada GM");
                      relationText = `Supervisor ${newEmployeeForm.dept} bertanggung jawab dan melapor langsung ke General Manager (${gm?.name || ceo?.name}), serta membawahi Staff departemen ${newEmployeeForm.dept}.`;
                    }

                    return (
                      <div className="bg-[#010804] p-3 rounded-2xl border border-amber-500/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-amber-400 font-bold text-xs">
                            Atasan Langsung (N+1) *
                          </label>
                          <span className="text-[10px] font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>Terkunci Otomatis</span>
                          </span>
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={superiorText}
                            className="w-full bg-[#021008] border border-emerald-900/80 rounded-xl p-2.5 pr-10 text-white font-bold cursor-not-allowed select-none opacity-90 focus:outline-none"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400">
                            <Lock className="w-4 h-4 text-amber-400" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-0.5 text-[11px] text-white/80">
                          <span className="text-amber-400 font-bold">✓ Relasi:</span>
                          <span>{relationText}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Status Kerja: Tetap, Kontrak, Magang, DW */}
              <div className="bg-[#010703] p-3.5 rounded-2xl border border-emerald-900/60 space-y-3">
                <div>
                  <label className="block text-amber-300 font-black mb-1">Status Kerja Karyawan *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["Tetap", "Kontrak", "Magang", "DW"] as const).map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setNewEmployeeForm({ ...newEmployeeForm, contractType: st })}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          newEmployeeForm.contractType === st
                            ? "bg-emerald-500 text-black border-emerald-400 font-black shadow-md"
                            : "bg-[#021008] text-white/70 border-emerald-950 hover:bg-emerald-950/60"
                        }`}
                      >
                        {st === "Tetap" ? "🏅 Tetap" : st === "Kontrak" ? "📄 Kontrak" : st === "Magang" ? "🎓 Magang" : "⏱️ DW"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-white font-bold mb-1">Tanggal Pertama Kerja *</label>
                    <input
                      type="date"
                      required
                      value={newEmployeeForm.startDate}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, startDate: e.target.value })}
                      className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  {newEmployeeForm.contractType !== "Tetap" ? (
                    <div>
                      <label className="block text-amber-300 font-bold mb-1">
                        Tanggal Terakhir Kerja ({newEmployeeForm.contractType}) *
                      </label>
                      <input
                        type="date"
                        required
                        value={newEmployeeForm.endDate || ""}
                        onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, endDate: e.target.value })}
                        className="w-full bg-[#010804] border border-amber-500/50 rounded-xl p-2.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center p-2.5 bg-[#020d07] rounded-xl border border-emerald-900/40 text-center">
                      <span className="text-[11px] text-emerald-400 font-bold">Karyawan Berstatus Tetap</span>
                      <span className="text-[10px] text-white/60">Tidak memiliki tanggal batas akhir kerja.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit / Batal */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black hover:brightness-110 transition-all shadow-lg"
                >
                  {addRegistrationType === "staff" ? "Daftarkan Staff & Buat Akun" : "Daftarkan Atasan & Buat Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: KREDENSIAL SEKALI MUNCUL (POV HRD)                */}
      {/* ========================================================= */}
      {showCredentialsModal && newlyCreatedCredentials && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021109] border-2 border-emerald-400 rounded-3xl p-7 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
                  AKUN BERHASIL DIBUAT OLEH HR
                </span>
                <h3 className="font-black text-white text-base">Kredensial Login Karyawan Baru</h3>
              </div>
            </div>

            <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Nama:</span>
                <span className="font-bold text-white">{newlyCreatedCredentials.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Departemen & Posisi:</span>
                <span className="font-bold text-emerald-300">
                  {newlyCreatedCredentials.dept} — {newlyCreatedCredentials.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Atasan Langsung:</span>
                <span className="font-bold text-amber-300">{newlyCreatedCredentials.superiorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Email Login:</span>
                <span className="font-mono font-bold text-white">{newlyCreatedCredentials.email}</span>
              </div>

              {/* Password Acak Highlight */}
              <div className="bg-amber-500/10 border-2 border-dashed border-amber-400/60 rounded-xl p-3 text-center my-2">
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block mb-1">
                  PASSWORD SEMENTARA ACAK (SEKALI MUNCUL)
                </span>
                <div className="font-mono text-2xl font-black text-amber-400 tracking-widest selection:bg-white selection:text-black">
                  {newlyCreatedCredentials.tempPass}
                </div>
                <span className="text-[10px] text-white/60 mt-1 block">
                  Karyawan akan dipaksa mengganti password saat pertama kali masuk.
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={copyCredentialsToClipboard}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>Salin Info Login</span>
              </button>
              <button
                onClick={() => {
                  setShowCredentialsModal(false);
                  showToast("Kredensial disimpan.");
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-all text-center"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: GANTI PASSWORD */}
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
