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
type DayOfWeek = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu" | "Minggu";
type ShiftSlotType = "Pagi" | "Siang" | "Libur";

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
  isEdited?: boolean;
  editedBy?: string;
  editReason?: string;
  editedAt?: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  type: "CHECK_IN" | "CHECK_OUT" | "LEAVE_APPLY" | "LEAVE_APPROVE" | "MANUAL_EDIT";
  title: string;
  description: string;
  employeeName: string;
  dept: string;
  actorName: string;
  actorRole: string;
  isEdited: boolean; // Jika true, tampil dengan warna merah mencolok
  editReason?: string;
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
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
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
  notes?: string;
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
  // 7 DEPARTEMEN PERUSAHAAN (TERMASUK DIREKSI)
  // Direksi, HR, Finance, Marketing, Sales, Operations, IT
  // ─────────────────────────────────────────────────────────────
  const standardDepartments: { id: DepartmentType; name: string; supervisorRole: string; staffRole: string; icon: string; desc: string }[] = [
    { id: "Direksi", name: "Direksi", supervisorRole: "General Manager (GM)", staffRole: "Direktur Utama (CEO)", icon: "🏛️", desc: "Kepemimpinan eksekutif, arah kebijakan strategis & pengawasan seluruh divisi" },
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
      nik: "3171012401880001",
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
      nik: "3171021501890010",
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
      nik: "3171030102900101",
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
      nik: "3171030202950102",
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
      nik: "3171040103910201",
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
      nik: "3171040203960202",
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
      nik: "3171050104920301",
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
      nik: "3171050204970302",
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
      nik: "3171060105890401",
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
      nik: "3171060205940402",
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
      nik: "3171070106880501",
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
      nik: "3171070206960502",
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
      nik: "3171080107930601",
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
      nik: "3171080207980602",
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

  // Shifts Master Data (Shift Malam Ditiadakan, Khusus Pagi & Siang)
  const [shifts, setShifts] = useState<Shift[]>([
    { id: "shift-1", name: "Shift Pagi (Utama / Office)", startTime: "07:00", endTime: "15:00", tolerance: "15 Menit", openBefore: "60 Menit", status: "Aktif" },
    { id: "shift-2", name: "Shift Siang (Operasional)", startTime: "15:00", endTime: "23:00", tolerance: "15 Menit", openBefore: "45 Menit", status: "Aktif" },
  ]);

  // Master Jadwal Shift Mingguan Seluruh 14 Karyawan
  const [weeklySchedules, setWeeklySchedules] = useState<Record<string, Record<DayOfWeek, ShiftSlotType>>>({
    "emp-ceo": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-gm": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-hr-spv": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-hr-stf": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-fin-spv": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-fin-stf": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-it-spv": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-it-stf": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-ops-spv": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Siang", Minggu: "Libur" },
    "emp-ops-stf": { Senin: "Siang", Selasa: "Siang", Rabu: "Siang", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Siang", Minggu: "Libur" },
    "emp-sls-spv": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-sls-stf": { Senin: "Pagi", Selasa: "Siang", Rabu: "Pagi", Kamis: "Siang", Jumat: "Pagi", Sabtu: "Siang", Minggu: "Libur" },
    "emp-mkt-spv": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Pagi", Kamis: "Pagi", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
    "emp-mkt-stf": { Senin: "Pagi", Selasa: "Pagi", Rabu: "Siang", Kamis: "Siang", Jumat: "Pagi", Sabtu: "Libur", Minggu: "Libur" },
  });

  // Attendances State (Mencakup Seluruh 7 Departemen)
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([
    { id: "att-1", employeeId: "emp-ceo", name: "Ir. Hendra Gunawan", nik: "3171012401880001", dept: "Direksi", shift: "Shift Pagi (Utama)", in: "07:15 WIB", out: "15:10 WIB", dist: 5.4, score: 99.2, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-2", employeeId: "emp-gm", name: "Dr. Kartika Sari, S.E., M.M.", nik: "3171021501890002", dept: "Direksi", shift: "Shift Pagi (Utama)", in: "07:22 WIB", out: "15:05 WIB", dist: 6.8, score: 98.7, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-3", employeeId: "emp-hr-spv", name: "Siti Rahmawati", nik: "3171030102900101", dept: "HR", shift: "Shift Pagi (Utama)", in: "07:35 WIB", out: "15:00 WIB", dist: 8.5, score: 98.1, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-4", employeeId: "emp-hr-stf", name: "Maya Indah", nik: "3171030202960102", dept: "HR", shift: "Shift Pagi (Utama)", in: "07:45 WIB", out: "15:00 WIB", dist: 9.1, score: 97.0, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-5", employeeId: "emp-fin-spv", name: "Andi Saputra", nik: "3171040103910201", dept: "Finance", shift: "Shift Pagi (Utama)", in: "07:58 WIB", out: "15:15 WIB", dist: 24.1, score: 95.8, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-6", employeeId: "emp-fin-stf", name: "Farhan Ramadhan", nik: "3171040203970202", dept: "Finance", shift: "Shift Pagi (Utama)", in: "07:50 WIB", out: "15:00 WIB", dist: 18.0, score: 96.2, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-7", employeeId: "emp-mkt-spv", name: "Dewi Lestari", nik: "3171050104920301", dept: "Marketing", shift: "Shift Pagi (Utama)", in: "08:04 WIB", out: "--:--", dist: 18.9, score: 96.0, status: "TERLAMBAT", date: "17 Nov 2026" },
    { id: "att-8", employeeId: "emp-mkt-stf", name: "Aditya Pratama", nik: "3171050204980302", dept: "Marketing", shift: "Shift Pagi (Utama)", in: "07:48 WIB", out: "15:05 WIB", dist: 14.5, score: 96.7, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-9", employeeId: "emp-sls-spv", name: "Reza Pahlevi", nik: "3171060105900401", dept: "Sales", shift: "Shift Pagi (Utama)", in: "07:30 WIB", out: "15:00 WIB", dist: 15.3, score: 95.5, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-10", employeeId: "emp-sls-stf", name: "Bella Savira", nik: "3171060205970402", dept: "Sales", shift: "Shift Siang (Operasional)", in: "14:52 WIB", out: "--:--", dist: 16.7, score: 94.8, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-11", employeeId: "emp-ops-spv", name: "Rian Hidayat", nik: "3171070106880501", dept: "Operations", shift: "Shift Siang (Operasional)", in: "14:48 WIB", out: "23:05 WIB", dist: 12.3, score: 94.0, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-12", employeeId: "emp-ops-stf", name: "Joko Susilo", nik: "3171070206960502", dept: "Operations", shift: "Shift Siang (Operasional)", in: "14:55 WIB", out: "23:00 WIB", dist: 19.4, score: 93.8, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-13", employeeId: "emp-it-spv", name: "Budi Pratama", nik: "3171080107930601", dept: "IT", shift: "Shift Pagi (Utama)", in: "07:42 WIB", out: "15:02 WIB", dist: 14.2, score: 96.4, status: "APPROVED", date: "17 Nov 2026" },
    { id: "att-14", employeeId: "emp-it-stf", name: "Dimas Wicaksono", nik: "3171080207980602", dept: "IT", shift: "Shift Pagi (Utama)", in: "07:40 WIB", out: "15:00 WIB", dist: 11.2, score: 96.1, status: "APPROVED", date: "17 Nov 2026" },
  ]);

  // Leave Requests State
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    {
      id: "lv-1",
      employeeId: "emp-mkt-stf",
      name: "Aditya Pratama",
      dept: "Marketing",
      type: "Sakit",
      start: "2026-11-18",
      end: "2026-11-19",
      days: 2,
      reason: "Flu & demam tinggi, istirahat dokter",
      status: "MENUNGGU",
      approverId: "emp-mkt-spv",
      approverName: "Dewi Lestari (Marketing Supervisor)",
    },
    {
      id: "lv-2",
      employeeId: "emp-fin-stf",
      name: "Farhan Ramadhan",
      dept: "Finance",
      type: "Tahunan",
      start: "2026-11-24",
      end: "2026-11-26",
      days: 3,
      reason: "Keperluan keluarga mendesak di luar kota",
      status: "MENUNGGU",
      approverId: "emp-fin-spv",
      approverName: "Andi Saputra (Finance Supervisor)",
    },
    {
      id: "lv-3",
      employeeId: "emp-hr-stf",
      name: "Maya Indah",
      dept: "HR",
      type: "Tahunan",
      start: "2026-11-10",
      end: "2026-11-12",
      days: 3,
      reason: "Acara wisuda saudara kandung",
      status: "DISETUJUI",
      approverId: "emp-hr-spv",
      approverName: "Siti Rahmawati (HR Supervisor)",
      approvedAt: "08 Nov 2026 (Disetujui)",
    },
    {
      id: "lv-4",
      employeeId: "emp-it-spv",
      name: "Budi Pratama",
      dept: "IT",
      type: "Tahunan",
      start: "2026-12-01",
      end: "2026-12-02",
      days: 2,
      reason: "Cuti tahunan riset sertifikasi Cloud Enterprise",
      status: "MENUNGGU",
      approverId: "emp-gm",
      approverName: "Dr. Kartika Sari, S.E., M.M. (General Manager)",
    },
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
    {
      id: "jrn-3",
      employeeId: "emp-fin-stf",
      name: "Farhan Ramadhan",
      dept: "Finance",
      avatar: "FR",
      date: "17 Nov 2026",
      hours: "8j 00m",
      score: 94,
      tasks: [
        "Rekonsiliasi mutasi rekening koran BCA & Mandiri bulan berjalan",
        "Pencatatan dan verifikasi voucher kas kecil operasional",
        "Pengecekan kelengkapan invoice vendor logistik & perpajakan",
      ],
    },
    {
      id: "jrn-4",
      employeeId: "emp-mkt-stf",
      name: "Aditya Pratama",
      dept: "Marketing",
      avatar: "AP",
      date: "17 Nov 2026",
      hours: "7j 45m",
      score: 91,
      tasks: [
        "Desain konten visual promosi media sosial mingguan",
        "Monitoring dan evaluasi metrik performa engagement campaign digital",
        "Riset tren copywriting iklan akhir tahun kompetitor",
      ],
    },
    {
      id: "jrn-5",
      employeeId: "emp-sls-stf",
      name: "Bella Savira",
      dept: "Sales",
      avatar: "BS",
      date: "17 Nov 2026",
      hours: "8j 15m",
      score: 93,
      tasks: [
        "Follow up 15 prospek calon klien baru melalui WhatsApp dan telepon",
        "Penyusunan penawaran harga (quotation) proyek korporat",
        "Pembaruan status pipeline leads harian ke database penjualan",
      ],
    },
    {
      id: "jrn-6",
      employeeId: "emp-ops-stf",
      name: "Joko Susilo",
      dept: "Operations",
      avatar: "JS",
      date: "17 Nov 2026",
      hours: "8j 00m",
      score: 90,
      tasks: [
        "Pemeriksaan kebersihan dan fasilitas gedung kantor",
        "Inventarisasi stok ATK dan kebutuhan operasional kerja mingguan",
        "Koordinasi pengiriman paket berkas penting via ekspedisi",
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

  // Audit Trail & Activity Log State (Log Otomatis & Koreksi Manual Warna Merah)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "log-1",
      timestamp: "17 Nov 2026, 07:15 WIB",
      type: "CHECK_IN",
      title: "Check-In Mandiri Otomatis",
      description: "Absensi hadir masuk terverifikasi via GPS (5.4m) & AI Liveness Face Match 99.2%",
      employeeName: "Ir. Hendra Gunawan",
      dept: "Direksi",
      actorName: "Ir. Hendra Gunawan",
      actorRole: "Direktur Utama (CEO)",
      isEdited: false,
    },
    {
      id: "log-2",
      timestamp: "17 Nov 2026, 07:22 WIB",
      type: "CHECK_IN",
      title: "Check-In Mandiri Otomatis",
      description: "Absensi hadir masuk terverifikasi via GPS (6.8m) & AI Liveness Face Match 98.7%",
      employeeName: "Dr. Kartika Sari, S.E., M.M.",
      dept: "Direksi",
      actorName: "Dr. Kartika Sari, S.E., M.M.",
      actorRole: "General Manager (GM)",
      isEdited: false,
    },
    {
      id: "log-3",
      timestamp: "17 Nov 2026, 07:35 WIB",
      type: "CHECK_IN",
      title: "Check-In Mandiri Otomatis",
      description: "Absensi hadir masuk terverifikasi via GPS (8.5m) & AI Liveness Face Match 98.1%",
      employeeName: "Siti Rahmawati",
      dept: "HR",
      actorName: "Siti Rahmawati",
      actorRole: "HR Supervisor",
      isEdited: false,
    },
    {
      id: "log-4",
      timestamp: "17 Nov 2026, 08:04 WIB",
      type: "CHECK_IN",
      title: "Check-In Mandiri (Terlambat)",
      description: "Absensi hadir masuk terdeteksi terlambat 4 menit dari batas toleransi shift pagi",
      employeeName: "Dewi Lestari",
      dept: "Marketing",
      actorName: "Dewi Lestari",
      actorRole: "Marketing Supervisor",
      isEdited: false,
    },
    {
      id: "log-5",
      timestamp: "17 Nov 2026, 08:30 WIB",
      type: "LEAVE_APPROVE",
      title: "Persetujuan Cuti Tahunan (Approved)",
      description: "Persetujuan cuti 3 hari Maya Indah (Acara wisuda saudara kandung) telah disetujui",
      employeeName: "Maya Indah",
      dept: "HR",
      actorName: "Siti Rahmawati",
      actorRole: "HR Supervisor",
      isEdited: false,
    },
    {
      id: "log-6",
      timestamp: "17 Nov 2026, 09:15 WIB",
      type: "MANUAL_EDIT",
      title: "⚠️ Koreksi Manual Rekap Absensi",
      description: "Koreksi data absen: Check-In disesuaikan ke 07:50 WIB & Check-Out 15:00 WIB (Status: APPROVED)",
      employeeName: "Farhan Ramadhan",
      dept: "Finance",
      actorName: "Siti Rahmawati",
      actorRole: "HR Supervisor",
      isEdited: true,
      editReason: "Karyawan lupa absen masuk karena langsung mendampingi audit internal kantor di lantai 3",
    },
    {
      id: "log-7",
      timestamp: "17 Nov 2026, 14:48 WIB",
      type: "CHECK_IN",
      title: "Check-In Mandiri Otomatis",
      description: "Absensi hadir shift siang terverifikasi via GPS (12.3m) & AI Liveness Face Match 94.0%",
      employeeName: "Rian Hidayat",
      dept: "Operations",
      actorName: "Rian Hidayat",
      actorRole: "Operations Supervisor",
      isEdited: false,
    },
  ]);

  // ─────────────────────────────────────────────────────────────
  // ROLE-BASED ACCESS CONTROL (RBAC) DENGAN PEMBAGIAN KHUSUS
  // - Akses Menu: Wewenang siapa saja yang boleh membuka menu sistem
  // - HR: Pendaftaran karyawan, akun user, data jabatan & departemen
  // - IT: Server, database, maintenance, geofence, bug & keamanan teknis
  // ─────────────────────────────────────────────────────────────
  const allPermissions: PermissionItem[] = [
    { id: "menu_user_mgmt", category: "Hak Akses Menu Sistem", name: "Akses Menu User Management", description: "Wewenang membuka menu User Management, kelola kredensial akun & matriks RBAC" },
    { id: "menu_settings", category: "Hak Akses Menu Sistem", name: "Akses Menu Pengaturan Teknis IT", description: "Wewenang membuka menu Pengaturan Teknis IT, Geofence GPS & AI Match" },
    { id: "dash_global", category: "Dashboard", name: "Lihat Dashboard Global Perusahaan", description: "Melihat grafik total SDM, absensi, dan analitik seluruh divisi" },
    { id: "dash_team", category: "Dashboard", name: "Lihat Ringkasan Tim / Bawahan Saja", description: "Hanya melihat metrik performa dan kehadiran staf di bawah supervisinya" },
    { id: "emp_manage_hr", category: "Wewenang Khusus HR", name: "Daftarkan Karyawan & Buat Akun Otomatis", description: "Hak khusus HR untuk mendaftarkan NIK, nama, atasan, status kerja & kredensial acak" },
    { id: "org_manage_hr", category: "Wewenang Khusus HR", name: "Kelola Data Jabatan & Departemen", description: "Hak khusus HR untuk mengatur struktur organisasi, posisi, dan kuota cuti" },
    { id: "it_infra_manage", category: "Wewenang Khusus IT", name: "Kelola Server, Database & Maintenance", description: "Hak khusus IT untuk pemeliharaan server, audit log, perbaikan bug & patching" },
    { id: "it_geofence_security", category: "Wewenang Khusus IT", name: "Pengaturan Geofence GPS & Keamanan Teknis", description: "Hak khusus IT untuk konfigurasi radius kantor, koordinat, dan ambang batas AI" },
    { id: "att_scan_self", category: "Absensi", name: "Absensi Mandiri (GPS & Wajah)", description: "Melakukan check-in dan check-out menggunakan kamera dan GPS" },
    { id: "att_team", category: "Absensi", name: "Lihat Rekap Absen Tim Bawahan", description: "Supervisor memantau jam datang dan keterlambatan staf di departemennya" },
    { id: "att_all", category: "Absensi", name: "Lihat Rekap Absensi Seluruh Perusahaan", description: "Audit trail kehadiran seluruh staf dan ekspor XLSX/PDF" },
    { id: "att_edit_rekap", category: "Absensi", name: "Edit Check-In/Out Rekap (Koreksi Lupa Absen)", description: "Wewenang mengoreksi jam check-in, check-out, dan status absensi karyawan yang lupa absen beserta alasan wajib" },
    { id: "log_view", category: "Audit Log & Jejak Digital", name: "Lihat Audit Log Aktivitas Kehadiran", description: "Wewenang melihat panel riwayat audit log aktivitas sistem, absensi otomatis, dan rekaman modifikasi manual berwarna merah" },
    { id: "leave_approve_subordinate", category: "Cuti", name: "Persetujuan Cuti Bawahan Langsung (N+1)", description: "Supervisor menyetujui / menolak cuti staf di departemennya" },
    { id: "journal_review_team", category: "Jurnal", name: "Review & Penilaian Jurnal Bawahan", description: "Supervisor memeriksa dan memberi skor kualitas kerja tim" },
    { id: "emp_edit", category: "Manajemen Karyawan", name: "Edit Data Karyawan", description: "Mengedit data profil karyawan (nama, departemen, jabatan, dll)" },
    { id: "emp_deactivate", category: "Manajemen Karyawan", name: "Nonaktifkan Karyawan (Resign)", description: "Menonaktifkan akun karyawan yang resign atau berhenti" },
    { id: "emp_delete", category: "Manajemen Karyawan", name: "Hapus Data Karyawan", description: "Menghapus data karyawan secara permanen dari sistem" },
  ];

  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    "Super Admin": [
      "menu_user_mgmt",
      "menu_settings",
      "dash_global",
      "dash_team",
      "emp_manage_hr",
      "org_manage_hr",
      "it_infra_manage",
      "it_geofence_security",
      "att_scan_self",
      "att_team",
      "att_all",
      "att_edit_rekap",
      "log_view",
      "leave_approve_subordinate",
      "journal_review_team",
      "emp_edit",
      "emp_deactivate",
      "emp_delete",
    ],
    "General Manager": [
      "menu_user_mgmt", // GM berwenang memantau seluruh akun dan hirarki organisasi
      "dash_global",
      "dash_team",
      "att_scan_self",
      "att_team",
      "att_all",
      "att_edit_rekap",
      "log_view",
      "leave_approve_subordinate",
      "journal_review_team",
      "emp_edit",
      "emp_deactivate",
    ],
    "HR Supervisor": [
      "menu_user_mgmt", // HR Supervisor berwenang penuh pada user management & pendaftaran
      "dash_global",
      "dash_team",
      "emp_manage_hr",
      "org_manage_hr",
      "att_scan_self",
      "att_team",
      "att_all",
      "att_edit_rekap",
      "log_view",
      "leave_approve_subordinate",
      "journal_review_team",
      "emp_edit",
      "emp_deactivate",
      "emp_delete",
    ],
    "HR Staff": [
      "menu_user_mgmt", // HR Staff diberi izin membuat akun & mendaftarkan karyawan baru
      "emp_manage_hr",
      "org_manage_hr",
      "att_scan_self",
      "emp_edit",
    ],
    "IT Supervisor": [
      "menu_user_mgmt", // IT Supervisor mengelola hak akses akun & RBAC
      "menu_settings", // IT Supervisor berwenang penuh pada pengaturan geofence & server
      "dash_global",
      "dash_team",
      "it_infra_manage",
      "it_geofence_security",
      "att_scan_self",
      "att_team",
      "att_all",
      "log_view",
      "leave_approve_subordinate",
      "journal_review_team",
    ],
    "IT Staff": [
      "menu_settings", // IT Staff mengelola konfigurasi geofence GPS & server teknis
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
      "emp_edit",
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

  // POV Karyawan Staff (Tetap, DW, Magang, Kontrak)
  const isStaff = activePerspective !== "admin" && currentActiveEmployee.level === "Staff";

  const hasPermission = (permId: string): boolean => {
    const rolePerms = rolePermissions[currentRoleName] || [];
    return rolePerms.includes(permId);
  };

  // Otomatis alihkan jika menu dibatasi untuk Staff atau tidak memiliki izin akses
  useEffect(() => {
    if (isStaff && ["departemen", "jabatan", "kontrak", "rekap-absensi", "user-management", "pengaturan"].includes(activeMenu)) {
      setActiveMenu("karyawan");
    }
    if (activeMenu === "user-management" && !hasPermission("menu_user_mgmt")) {
      setActiveMenu("dashboard");
    }
    if (activeMenu === "pengaturan" && !hasPermission("menu_settings")) {
      setActiveMenu("dashboard");
    }
  }, [activePerspective, rolePermissions, activeMenu, isStaff]);

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

  const handleOpenEditAttendance = (att: AttendanceRecord) => {
    setEditingAttendance(att);
    setEditAttendanceForm({
      in: att.in,
      out: att.out === "--:--" ? "15:00 WIB" : att.out,
      status: att.status,
      reason: att.editReason || "",
    });
    setShowEditAttendanceModal(true);
  };

  const handleSaveEditAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttendance) return;

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
          editedAt: `${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}, ${currentTime || "15:00 WIB"}`,
        };
      }
      return item;
    });

    setAttendances(updatedAttendances);

    // Tambahkan log baru berwarna merah (MANUAL_EDIT)
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}, ${currentTime || "15:00 WIB"}`,
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
      timestamp: `${journalForm.date || "17 Nov 2026"}, ${currentTime || "16:00 WIB"}`,
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
              role: (editingEmployee.role as any) || u.role,
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

  // Jika POV Staff, kunci target jadwal ke diri sendiri dan kunci tab ke roster
  useEffect(() => {
    if (isStaff) {
      setSelectedScheduleEmpId(currentActiveEmployee.id);
      setShiftActiveTab("roster");
    }
  }, [isStaff, currentActiveEmployee.id]);

  // Tanggal Senin dari minggu yang sedang dijadwalkan
  const [rosterWeekStart, setRosterWeekStart] = useState<string>("2026-11-16");

  // Set tanggal awal minggu ini saat komponen mount
  useEffect(() => {
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
    const targetEmp = employees.find((emp) => emp.id === selectedScheduleEmpId);
    if (!targetEmp) return;

    const finalSchedule = { ...draftSchedule };

    setWeeklySchedules((prev) => ({
      ...prev,
      [selectedScheduleEmpId]: finalSchedule,
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
        employeeId: currentActiveEmployee.id,
        name: currentActiveEmployee.name,
        nik: currentActiveEmployee.nik,
        dept: currentActiveEmployee.dept,
        shift: shifts.find((s) => s.id === currentActiveEmployee.shiftId)?.name || "Shift Pagi (Utama)",
        in: currentTime || "07:45 WIB",
        out: "--:--",
        dist: simulatedDistance,
        score: simulatedFaceScore,
        status: "APPROVED",
        date: "17 Nov 2026",
      };

      setAttendances((prev) => [newRecord, ...prev]);

      const autoLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: `${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}, ${currentTime || "07:45 WIB"}`,
        type: "CHECK_IN",
        title: "Check-In Mandiri Otomatis",
        description: `Absensi hadir masuk terverifikasi via GPS (${simulatedDistance.toFixed(1)}m) & AI Face Match (${simulatedFaceScore}%)`,
        employeeName: currentActiveEmployee.name,
        dept: currentActiveEmployee.dept,
        actorName: currentActiveEmployee.name,
        actorRole: currentActiveEmployee.role,
        isEdited: false,
      };
      setActivityLogs((prev) => [autoLog, ...prev]);

      showToast(`✓ Absensi mandiri ${currentActiveEmployee.name} BERHASIL disahkan secara otomatis (APPROVED)!`);
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
    "jadwal-shift": { title: "JADWAL SHIFT", subtitle: `Konfigurasi Shift Kerja Dinamis (${shifts.length} Shift Aktif)`, icon: "📅" },
    "pengajuan-cuti": { title: "PENGAJUAN CUTI", subtitle: `Self-Service Permohonan Cuti & Persetujuan Berjenjang N+1 (${pendingSubordinateCount} Pending Approval)`, icon: "⛱️" },
    "jurnal-kerja": { title: "JURNAL KERJA", subtitle: `Catatan Produktivitas Harian & Penilaian Supervisor (${journals.length} Jurnal Tercatat)`, icon: "📝" },
    "user-management": { title: "USER MANAGEMENT", subtitle: `Kelola Akun Pengguna Sistem (${users.length} Akun Terdaftar)`, icon: "👤" },
    "izin-akses": { title: "IZIN AKSES (RBAC)", subtitle: "Matriks Wewenang & Hak Akses Berdasarkan Peran Sistem (Role-Based Access Control)", icon: "🛡️" },
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

  // Filter Data Rekap Absensi
  const filteredAttendances = attendances.filter((att) => {
    const matchDept = rekapDeptFilter === "ALL" || att.dept === rekapDeptFilter;
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

  // Handler Ekspor Rekap Absensi ke CSV / Excel
  const handleExportCSV = () => {
    if (filteredAttendances.length === 0) {
      showToast("Tidak ada data absensi untuk diekspor!", "error");
      return;
    }
    const headers = [
      "No",
      "ID Log",
      "Nama Karyawan",
      "Nomor KTP",
      "Departemen",
      "Shift Kerja",
      "Tanggal",
      "Jam Check-In",
      "Jam Check-Out",
      "Jarak ke Kantor (m)",
      "Skor Validasi AI (%)",
      "Status Kehadiran",
    ];
    const rows = filteredAttendances.map((r, idx) => [
      idx + 1,
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      `'${r.nik}`,
      `"${r.dept}"`,
      `"${r.shift}"`,
      `"${r.date}"`,
      `"${r.in}"`,
      `"${r.out}"`,
      r.dist.toFixed(1),
      r.score.toFixed(1),
      r.status,
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const deptTag = rekapDeptFilter === "ALL" ? "Semua_Dept" : rekapDeptFilter;
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Absensi_${deptTag}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`✓ Berhasil mengekspor ${filteredAttendances.length} data absensi ke file CSV/Excel!`, "success");
  };

  // Filter Data Audit Log Aktivitas (di bagian bawah rekap absensi)
  const filteredActivityLogs = activityLogs.filter((log) => {
    const matchDept = rekapDeptFilter === "ALL" || log.dept === rekapDeptFilter;
    const matchType =
      rekapLogTypeFilter === "ALL" ||
      (rekapLogTypeFilter === "MANUAL_EDIT" && log.isEdited) ||
      (rekapLogTypeFilter === "AUTO" && !log.isEdited);
    const matchSearch =
      rekapSearchQuery === "" ||
      log.employeeName.toLowerCase().includes(rekapSearchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(rekapSearchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(rekapSearchQuery.toLowerCase()) ||
      (log.editReason && log.editReason.toLowerCase().includes(rekapSearchQuery.toLowerCase()));
    return matchDept && matchType && matchSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#010804] text-white font-sans selection:bg-emerald-500 selection:text-black">
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
      <aside className="w-64 flex-shrink-0 bg-[#010a06] border-r border-emerald-950/80 flex flex-col justify-between py-5 px-3 h-screen overflow-y-auto select-none z-20 shadow-2xl shadow-black sticky top-0">
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
                  {(isStaff
                    ? [{ id: "karyawan", label: "Profil Karyawan Saya", icon: "👤", badge: undefined }]
                    : [
                        { id: "karyawan", label: "Karyawan", icon: "👥", badge: visibleEmployees.length },
                        { id: "departemen", label: "Departemen", icon: "🏢", badge: standardDepartments.length },
                        { id: "jabatan", label: "Jabatan", icon: "💼" },
                        { id: "kontrak", label: "Kontrak & Lifecycle", icon: "📄" },
                      ]
                  ).map((item) => (
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
                  {(isStaff
                    ? [
                        { id: "absensi", label: "Absensi", icon: "📍" },
                        { id: "jadwal-shift", label: "Jadwal Shift", icon: "📅", badge: shifts.length },
                      ]
                    : [
                        { id: "absensi", label: "Absensi", icon: "📍" },
                        { id: "rekap-absensi", label: "Rekap Absensi", icon: "📊", badge: attendances.length },
                        { id: "jadwal-shift", label: "Jadwal Shift", icon: "📅", badge: shifts.length },
                      ]
                  ).map((item) => (
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
                    {
                      id: "pengajuan-cuti",
                      label: "Pengajuan Cuti",
                      icon: "⛱️",
                      badge: isStaff ? myLeaves.length : (pendingSubordinateCount > 0 ? `${pendingSubordinateCount} Pnd` : myLeaves.length),
                    },
                    {
                      id: "jurnal-kerja",
                      label: "Jurnal Kerja",
                      icon: "📝",
                      badge: isStaff ? journals.filter((j) => j.employeeId === currentActiveEmployee.id).length : journals.length,
                    },
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

            {/* Section 4: SISTEM (Otomatis Sembunyi Jika Tidak Memiliki Hak Akses) */}
            {(() => {
              const systemMenuItems = [
                { id: "user-management", label: "User Management", icon: "👤", badge: users.length, permId: "menu_user_mgmt" },
                { id: "izin-akses", label: "Izin Akses", icon: "🛡️", permId: "menu_user_mgmt" },
                { id: "pengaturan", label: "Pengaturan", icon: "⚙️", permId: "menu_settings" },
              ].filter((item) => hasPermission(item.permId));

              if (systemMenuItems.length === 0) return null;

              return (
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
                      {systemMenuItems.map((item) => (
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
              );
            })()}
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
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gradient-to-br from-[#051f14] via-[#020d08] to-[#010604] relative">
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-0" />

        {/* Top Header Row — Switcher Simulasi Role */}
        <header className="px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-[#021008]/90 backdrop-blur-md border-b border-emerald-950/40">
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
                    onClick={() => {
                      if (!hasPermission("menu_user_mgmt")) {
                        showToast(`⛔ Akses Ditolak: Role "${currentRoleName}" tidak memiliki hak akses ke User Management.`, "error");
                        return;
                      }
                      setActiveMenu("user-management");
                    }}
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

                  {/* Grid 7 Departemen Sesuai Referensi Gambar */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-emerald-900/60 text-white text-[11px] uppercase font-black">
                          <th className="py-2.5">Departemen</th>
                          <th className="py-2.5">Atasan (Pimpinan / GM)</th>
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
                          const isDireksi = dept.id === "Direksi";
                          const ceo = employees.find((e) => e.level === "Director");

                          return (
                            <tr key={dept.id} className="hover:bg-emerald-950/20 transition-colors">
                              <td className="py-3 font-bold text-white flex items-center gap-2">
                                <span className="text-base">{dept.icon}</span>
                                <span className="text-sm font-extrabold text-white">{dept.name}</span>
                              </td>
                              <td className="py-3">
                                <span className="font-bold text-sky-300 block">{isDireksi ? "Direktur Utama (CEO)" : "General Manager (GM)"}</span>
                                <span className="text-[11px] text-white/80 font-medium">
                                  {isDireksi ? (ceo ? ceo.name : "Ir. Hendra Gunawan") : (gm ? gm.name : "Belum Ditugaskan")}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className="font-bold text-amber-300 block">{isDireksi ? "General Manager (GM)" : dept.supervisorRole}</span>
                                <span className="text-[11px] text-white/80 font-medium">
                                  {isDireksi ? (gm ? gm.name : "Belum Ditugaskan") : (spv ? spv.name : "Belum Ditugaskan")}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className="font-bold text-emerald-400 block">{dept.staffRole}</span>
                                <span className="text-[11px] text-white/80 font-medium">
                                  {stf.length > 0 ? stf.map((s) => s.name).join(", ") : (isDireksi ? "Pimpinan Eksekutif" : "Belum Ditugaskan")}
                                </span>
                              </td>
                              <td className="py-3 text-[11px] text-white/70 max-w-xs">
                                {dept.id === "Direksi" ? (
                                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold block">
                                    👑 Pengambil kebijakan strategis tertinggi perusahaan & supervisi seluruh divisi
                                  </span>
                                ) : dept.id === "HR" ? (
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
          {/* VIEW: KARYAWAN & STRUKTUR HIRARKI / PROFIL MANDIRI    */}
          {/* ===================================================== */}
          {activeMenu === "karyawan" && (
            isStaff ? (
              <div className="space-y-6">
                {/* Header Banner: Profil Karyawan Saya */}
                <div className="bg-gradient-to-r from-[#062417] via-[#031d11] to-[#010b06] rounded-3xl p-6 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      {/* Foto Profil / Avatar Karyawan */}
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-emerald-950 flex items-center justify-center font-black text-white text-3xl ring-4 ring-emerald-500/60 shadow-xl shadow-black relative">
                          {currentActiveEmployee.avatar}
                          <span
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-[#021008] flex items-center justify-center text-[10px] text-black font-black"
                            title="Status Kepegawaian Aktif"
                          >
                            ✓
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-extrabold text-white tracking-tight">
                            {currentActiveEmployee.name}
                          </h2>
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                              currentActiveEmployee.contractType === "Tetap"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : currentActiveEmployee.contractType === "Kontrak"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                : currentActiveEmployee.contractType === "Magang"
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            }`}
                          >
                            {currentActiveEmployee.contractType === "Tetap"
                              ? "Karyawan Tetap (PKWTT)"
                              : currentActiveEmployee.contractType === "Kontrak"
                              ? "Karyawan Kontrak (PKWT)"
                              : currentActiveEmployee.contractType === "Magang"
                              ? "Karyawan Magang (Internship)"
                              : "Daily Worker (Harian Lepas)"}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Status: {currentActiveEmployee.status}
                          </span>
                        </div>

                        <p className="text-xs text-white/80 font-medium">
                          {currentActiveEmployee.role} • Departemen {currentActiveEmployee.dept}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[11px] text-white/60 font-mono">
                            No. KTP (NIK): {currentActiveEmployee.nik}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(currentActiveEmployee.nik);
                              showToast("✓ Nomor KTP berhasil disalin ke clipboard!");
                            }}
                            className="text-emerald-400 hover:text-white text-[10px] px-2 py-0.5 rounded bg-white/5 border border-emerald-500/20 font-sans transition-all flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Salin
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="flex flex-wrap sm:flex-col gap-2">
                      <button
                        onClick={() => setActiveMenu("absensi")}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20"
                      >
                        <span>📍</span>
                        <span>Absensi Masuk / Pulang</span>
                      </button>
                      <button
                        onClick={() => setActiveMenu("jadwal-shift")}
                        className="px-4 py-2 rounded-xl bg-[#010804] hover:bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition-all flex items-center gap-2"
                      >
                        <span>📅</span>
                        <span>Jadwal Shift Kerja</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid: 4 Cards Informasi Detail Mandiri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Card 1: Biodata Pribadi Karyawan */}
                  <div className="bg-[#021209] rounded-2xl p-5 border border-emerald-900/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
                      <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <span className="text-base">📋</span>
                        <span>Biodata Diri Lengkap</span>
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-mono">Tervalidasi Dukcapil</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Nomor KTP (16-Digit NIK):</span>
                        <span className="font-mono font-bold text-white text-right">{currentActiveEmployee.nik}</span>
                      </div>
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Nama Lengkap Sesuai KTP:</span>
                        <span className="font-bold text-white text-right">{currentActiveEmployee.name}</span>
                      </div>
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Alamat Email Perusahaan:</span>
                        <span className="font-semibold text-emerald-300 text-right">{currentActiveEmployee.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Nomor Telepon / WhatsApp:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-white">{currentActiveEmployee.phone}</span>
                          <a
                            href={`https://wa.me/${currentActiveEmployee.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1"
                          >
                            <Phone className="w-2.5 h-2.5" /> WA
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Tanggal Lahir:</span>
                        <span className="font-mono text-white text-right">{currentActiveEmployee.birthDate}</span>
                      </div>
                      <div className="flex justify-between items-start py-1">
                        <span className="text-white/60">Alamat Domisili:</span>
                        <span className="text-white text-right max-w-xs">{currentActiveEmployee.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Status Hubungan Kerja & Kontrak */}
                  <div className="bg-[#021209] rounded-2xl p-5 border border-emerald-900/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
                      <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <span className="text-base">📄</span>
                        <span>Status Hubungan Kerja & Kontrak</span>
                      </h3>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${
                          currentActiveEmployee.contractType === "Tetap"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : currentActiveEmployee.contractType === "Kontrak"
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                            : currentActiveEmployee.contractType === "Magang"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {currentActiveEmployee.contractType}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Tanggal Pertama Masuk (Join):</span>
                        <span className="font-mono font-bold text-white text-right">{currentActiveEmployee.startDate}</span>
                      </div>
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Tanggal Berakhir Masa Kerja:</span>
                        <span className="font-mono font-bold text-amber-400 text-right">
                          {currentActiveEmployee.endDate ? currentActiveEmployee.endDate : "Permanen (PKWTT Tidak Terbatas)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Masa Kerja (Tenure):</span>
                        <span className="font-bold text-white text-right">{currentActiveEmployee.tenure}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Verifikasi Wajah Biometrik AI:</span>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Terverifikasi ({currentActiveEmployee.faceScore}%)</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-white/60">Keamanan Akses Akun:</span>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Password Mandiri Aktif</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Shift Kerja & Kuota Cuti Mandiri */}
                  <div className="bg-[#021209] rounded-2xl p-5 border border-emerald-900/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
                      <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <span className="text-base">⏱️</span>
                        <span>Shift Kerja & Kuota Cuti</span>
                      </h3>
                      <span className="text-[10px] text-teal-300 font-bold">Roster Mingguan</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Jadwal Shift Utama:</span>
                        <span className="font-bold text-white text-right">
                          {currentActiveEmployee.shiftId === "shift-1"
                            ? "Shift Pagi (08:00 - 17:00 WIB)"
                            : "Shift Fleksibel Roster"}
                        </span>
                      </div>
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Pola Kerja:</span>
                        <span className="font-medium text-white text-right">5 Hari Kerja / Roster Terjadwal</span>
                      </div>
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Hak Cuti Tahunan:</span>
                        <span className="font-mono font-bold text-white text-right">12 Hari / Tahun</span>
                      </div>
                      <div className="flex justify-between items-start py-1 border-b border-emerald-900/20">
                        <span className="text-white/60">Cuti Terpakai:</span>
                        <span className="font-mono font-bold text-emerald-400 text-right">{myUsedLeaveDays} Hari</span>
                      </div>
                      <div className="flex justify-between items-start py-1">
                        <span className="text-white/60">Sisa Kuota Cuti Anda:</span>
                        <span className="font-mono font-black text-teal-300 text-right text-sm">
                          {myRemainingQuota} Hari Tersedia
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Atasan Langsung (N+1 Hierarchy) */}
                  <div className="bg-[#021209] rounded-2xl p-5 border border-emerald-900/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
                      <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <span className="text-base">🛡️</span>
                        <span>Atasan Langsung Saya (N+1)</span>
                      </h3>
                      <span className="text-[10px] text-amber-400 font-bold">Penyetuju Izin & Shift</span>
                    </div>

                    {directSuperior ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-[#010804] p-3.5 rounded-xl border border-emerald-900/40">
                          <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center font-black text-white text-lg ring-2 ring-emerald-500/40">
                            {directSuperior.avatar}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-white text-sm leading-tight">{directSuperior.name}</h4>
                            <p className="text-xs text-amber-300 font-medium">{directSuperior.role}</p>
                            <p className="text-[11px] text-white/60 font-mono mt-0.5">No. KTP: {directSuperior.nik}</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-emerald-900/20">
                            <span className="text-white/60">Departemen Atasan:</span>
                            <span className="font-bold text-white">{directSuperior.dept}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-emerald-900/20">
                            <span className="text-white/60">Email Atasan:</span>
                            <span className="font-semibold text-emerald-300">{directSuperior.email}</span>
                          </div>
                          <div className="flex justify-between py-1 items-center">
                            <span className="text-white/60">Kontak WhatsApp:</span>
                            <a
                              href={`https://wa.me/${directSuperior.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1.5"
                            >
                              <Phone className="w-3 h-3" /> Hubungi Atasan Langsung
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-white/60 py-4 text-center">
                        Pimpinan eksekutif tertinggi (Direktur Utama / Direksi)
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Bawah: Ajukan Cuti & Tulis Jurnal Harian */}
                <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-white block">Aktivitas Mandiri Karyawan</span>
                    <span className="text-white/60">
                      Ajukan permohonan cuti resmi atau laporkan jurnal kerja harian Anda kepada atasan langsung.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveMenu("pengajuan-cuti");
                        setShowApplyLeaveModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <span>🏖️</span>
                      <span>Ajukan Cuti</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenu("jurnal-kerja");
                        setShowAddJournalModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#031d11] hover:bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs transition-all flex items-center gap-1.5"
                    >
                      <span>📝</span>
                      <span>Tulis Jurnal Hari Ini</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
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
                        <p className="text-[11px] text-white/60 font-mono mt-0.5">No. KTP: {directSuperior.nik}</p>
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
                            setRekapDeptFilter(sub.dept);
                            setRekapSearchQuery(sub.name);
                            setActiveMenu("rekap-absensi");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500 hover:text-black transition-all"
                        >
                          Cek Rekap Absen
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
                    placeholder="Cari nama, No. KTP, posisi, atau departemen..."
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
                    <option value="ALL">Semua Departemen ({standardDepartments.length})</option>
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
                            <span className="text-[10px] text-white/60 font-mono">No. KTP: {k.nik}</span>
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

                      {/* Action Links — Edit, Nonaktifkan, Hapus (berdasarkan hak akses RBAC) */}
                      {(hasPermission("emp_edit") || hasPermission("emp_deactivate") || hasPermission("emp_delete")) && (
                      <div className="pt-2 border-t border-emerald-900/40 flex gap-2">
                        {hasPermission("emp_edit") && (
                        <button
                          onClick={() => handleOpenEditModal(k)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1"
                        >
                          <span>✏️</span>
                          <span>Edit Data</span>
                        </button>
                        )}
                        {hasPermission("emp_deactivate") && k.status === "Aktif" && (
                        <button
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              type: "deactivate",
                              employee: k,
                            });
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1"
                        >
                          <span>🚫</span>
                          <span>Nonaktifkan</span>
                        </button>
                        )}
                        {hasPermission("emp_deactivate") && k.status === "Non-Aktif" && (
                        <span className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold text-center border border-red-500/20 flex items-center justify-center gap-1">
                          <span>⛔</span>
                          <span>Non-Aktif (Resign)</span>
                        </span>
                        )}
                        {hasPermission("emp_delete") && (
                        <button
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              type: "delete",
                              employee: k,
                            });
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 hover:text-white text-red-300 text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1"
                        >
                          <span>🗑️</span>
                          <span>Hapus</span>
                        </button>
                        )}
                      </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            )
          )}

          {/* ===================================================== */}
          {/* VIEW: DEPARTEMEN                                      */}
          {/* ===================================================== */}
          {activeMenu === "departemen" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-white text-base">7 Departemen Perusahaan</h3>
                <p className="text-xs text-white/70">
                  Direksi sebagai pimpinan eksekutif dan 6 departemen fungsional & operasional perusahaan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {standardDepartments.map((d) => {
                  const staffCount = employees.filter((e) => e.dept === d.id).length;
                  const spv = employees.find((e) => e.dept === d.id && e.level === "Supervisor");
                  const ceo = employees.find((e) => e.level === "Director");
                  const gm = employees.find((e) => e.level === "GeneralManager");
                  const isDireksi = d.id === "Direksi";

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
                          <span className="text-white/60">Atasan:</span>
                          <span className="font-bold text-sky-300">
                            {isDireksi
                              ? (ceo ? ceo.name : "Ir. Hendra Gunawan")
                              : (gm ? gm.name : "Dr. Kartika Sari, S.E., M.M.")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">{isDireksi ? "General Manager (GM):" : "Supervisor:"}</span>
                          <span className="font-bold text-amber-300">
                            {isDireksi
                              ? (gm ? gm.name : "Dr. Kartika Sari, S.E., M.M.")
                              : (spv ? spv.name : "Belum ada")}
                          </span>
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
                        Lihat Karyawan {d.name} ({staffCount}) →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: USER MANAGEMENT (DATA AKUN + FILTER DEPARTEMEN)  */}
          {/* ===================================================== */}
          {activeMenu === "user-management" && hasPermission("menu_user_mgmt") && (
            <div className="space-y-5">
              {/* Toolbar: Filter + Search + Tambah */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Filter Departemen */}
                  <select
                    value={userDeptFilter}
                    onChange={(e) => setUserDeptFilter(e.target.value)}
                    className="bg-[#021008] border border-emerald-900/70 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="ALL">🏢 Semua Departemen</option>
                    <option value="Direksi">🏛️ Direksi</option>
                    <option value="HR">👥 HR</option>
                    <option value="Finance">💰 Finance</option>
                    <option value="Marketing">📈 Marketing</option>
                    <option value="Sales">🤝 Sales</option>
                    <option value="Operations">⚙️ Operations</option>
                    <option value="IT">💻 IT</option>
                  </select>
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="Cari nama, email, role..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="bg-[#021008] border border-emerald-900/70 text-white text-xs rounded-xl pl-8 pr-3 py-2 w-56 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-white/30"
                    />
                  </div>
                  <span className="text-[11px] text-white/50 font-mono">
                    {filteredUsers.length} dari {users.length} akun
                  </span>
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

              {/* Tabel Akun User */}
              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3 pr-4">No</th>
                      <th className="pb-3 pr-4">Nama Karyawan</th>
                      <th className="pb-3 pr-4">Email Login</th>
                      <th className="pb-3 pr-4">Departemen</th>
                      <th className="pb-3 pr-4">Role Hak Akses</th>
                      <th className="pb-3 pr-4">Status Password</th>
                      <th className="pb-3">Status Akun</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-white/40 text-xs">
                          Tidak ada akun yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, idx) => {
                        const linkedEmp = employees.find((e) => e.email === u.email);
                        const isTemp = linkedEmp?.isFirstLogin && linkedEmp?.temporaryPassword;
                        return (
                          <tr key={u.id} className="hover:bg-emerald-950/20 transition-colors">
                            <td className="py-3 pr-4 text-white/40 font-mono">{idx + 1}</td>
                            <td className="py-3 pr-4 font-bold text-white whitespace-nowrap">{u.name}</td>
                            <td className="py-3 pr-4 font-mono text-white/70 text-[11px]">{u.email}</td>
                            <td className="py-3 pr-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                                {u.dept}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.role === "Super Admin"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : u.role === "General Manager"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : u.role.includes("HR")
                                  ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                                  : u.role.includes("IT")
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : u.role.includes("Supervisor")
                                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              {isTemp ? (
                                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-[10px]">
                                  🔑 Pass Sementara: {linkedEmp.temporaryPassword}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  ✓ Password Aktif
                                </span>
                              )}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.status === "AKTIF"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                  : "bg-red-500/20 text-red-300 border border-red-400/30"
                              }`}>
                                {u.status === "AKTIF" ? "● AKTIF" : "○ " + u.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: IZIN AKSES (RBAC MATRIX) — Per Kategori          */}
          {/* ===================================================== */}
          {activeMenu === "izin-akses" && hasPermission("menu_user_mgmt") && (() => {
            const roles = [
              { key: "Super Admin",      label: "Super Admin",    color: "text-amber-300",  bg: "bg-amber-900/20",   border: "border-amber-700/40"  },
              { key: "General Manager",  label: "GM",             color: "text-purple-300", bg: "bg-purple-900/20",  border: "border-purple-700/40" },
              { key: "HR Supervisor",    label: "HR Spv",         color: "text-pink-300",   bg: "bg-pink-900/20",    border: "border-pink-700/40"   },
              { key: "HR Staff",         label: "HR Staff",       color: "text-pink-200",   bg: "bg-pink-900/10",    border: "border-pink-700/30"   },
              { key: "IT Supervisor",    label: "IT Spv",         color: "text-blue-300",   bg: "bg-blue-900/20",    border: "border-blue-700/40"   },
              { key: "IT Staff",         label: "IT Staff",       color: "text-blue-200",   bg: "bg-blue-900/10",    border: "border-blue-700/30"   },
              { key: "Supervisor",       label: "Supervisor",     color: "text-teal-300",   bg: "bg-teal-900/20",    border: "border-teal-700/40"   },
              { key: "Staff",            label: "Staff",          color: "text-emerald-300",bg: "bg-emerald-900/20", border: "border-emerald-700/40"},
            ];

            const categoryConfig: Record<string, { icon: string; color: string; bg: string; border: string; desc: string }> = {
              "Hak Akses Menu Sistem":    { icon: "🗂️",  color: "text-cyan-300",    bg: "bg-cyan-950/40",    border: "border-cyan-700/50",    desc: "Menu utama yang bisa dibuka di sidebar" },
              "Dashboard":                { icon: "📊",  color: "text-indigo-300",  bg: "bg-indigo-950/40",  border: "border-indigo-700/50",  desc: "Tampilan ringkasan & analitik data" },
              "Wewenang Khusus HR":       { icon: "👔",  color: "text-pink-300",    bg: "bg-pink-950/40",    border: "border-pink-700/50",    desc: "Fungsi eksklusif tim Human Resources" },
              "Wewenang Khusus IT":       { icon: "🛡️",  color: "text-blue-300",    bg: "bg-blue-950/40",    border: "border-blue-700/50",    desc: "Fungsi eksklusif tim Information Technology" },
              "Absensi":                  { icon: "📍",  color: "text-emerald-300", bg: "bg-emerald-950/40", border: "border-emerald-700/50", desc: "Fitur kehadiran, rekap & koreksi absensi" },
              "Audit Log & Jejak Digital":{ icon: "🔍",  color: "text-orange-300",  bg: "bg-orange-950/40",  border: "border-orange-700/50",  desc: "Riwayat aktivitas sistem & modifikasi data" },
              "Cuti":                     { icon: "⛱️",  color: "text-sky-300",     bg: "bg-sky-950/40",     border: "border-sky-700/50",     desc: "Pengajuan & persetujuan cuti karyawan" },
              "Jurnal":                   { icon: "📝",  color: "text-lime-300",    bg: "bg-lime-950/40",    border: "border-lime-700/50",    desc: "Catatan kerja harian & penilaian supervisor" },
              "Manajemen Karyawan":       { icon: "👥",  color: "text-amber-200",   bg: "bg-amber-950/40",   border: "border-amber-700/50",   desc: "Edit, nonaktifkan, atau hapus data karyawan" },
            };

            // Kelompokkan permissions per kategori, urutkan sesuai categoryConfig
            const categoryOrder = Object.keys(categoryConfig);
            const grouped: Record<string, typeof allPermissions> = {};
            allPermissions.forEach((p) => {
              if (!grouped[p.category]) grouped[p.category] = [];
              grouped[p.category].push(p);
            });
            const sortedCategories = categoryOrder.filter((c) => grouped[c]);

            return (
              <div className="space-y-5">
                {/* Legend Role di atas */}
                <div className="bg-[#021008] rounded-2xl p-4 border border-emerald-900/50">
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-3">Legenda Peran (Role)</p>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((r) => (
                      <span key={r.key} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${r.color} ${r.bg} ${r.border}`}>
                        {r.label}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/35 mt-3">✅ = Izin aktif &nbsp;|&nbsp; ○ = Tidak ada izin &nbsp;|&nbsp; Klik tombol untuk toggle on/off</p>
                </div>

                {/* Per-Kategori Group */}
                {sortedCategories.map((cat) => {
                  const cfg = categoryConfig[cat] ?? { icon: "📋", color: "text-white/60", bg: "bg-white/5", border: "border-white/10", desc: "" };
                  const perms = grouped[cat];
                  return (
                    <div key={cat} className={`rounded-2xl border overflow-hidden ${cfg.border}`}>
                      {/* Category Header */}
                      <div className={`${cfg.bg} px-5 py-3 flex items-center gap-3 border-b ${cfg.border}`}>
                        <span className="text-xl">{cfg.icon}</span>
                        <div>
                          <span className={`text-sm font-extrabold uppercase tracking-wide ${cfg.color}`}>{cat}</span>
                          {cfg.desc && <p className="text-[11px] text-white/50 mt-0.5">{cfg.desc}</p>}
                        </div>
                        <span className="ml-auto text-[10px] font-bold text-white/30 border border-white/10 rounded-full px-2 py-0.5">{perms.length} izin</span>
                      </div>

                      {/* Tabel per kategori */}
                      <div className="overflow-x-auto bg-[#010c06]">
                        <table className="w-full text-left text-xs min-w-[860px]">
                          <thead>
                            <tr className="border-b border-emerald-900/40 text-[10px] uppercase font-bold text-white/40">
                              <th className="py-2 px-5 w-72">Nama Izin & Keterangan</th>
                              {roles.map((r) => (
                                <th key={r.key} className={`py-2 px-3 text-center ${r.color}`}>
                                  {r.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {perms.map((perm, idx) => (
                              <tr
                                key={perm.id}
                                className={`border-b border-emerald-900/20 transition-colors hover:bg-emerald-950/25 ${idx % 2 === 0 ? "bg-[#010804]" : "bg-[#010c07]"}`}
                              >
                                <td className="py-3 px-5">
                                  <span className="font-bold text-white text-xs block leading-snug">{perm.name}</span>
                                  <span className="text-[10px] text-white/40 leading-relaxed">{perm.description}</span>
                                </td>
                                {roles.map((r) => {
                                  const isChecked = (rolePermissions[r.key] || []).includes(perm.id);
                                  return (
                                    <td key={r.key} className="py-3 px-3 text-center">
                                      <button
                                        onClick={() => togglePermission(r.key, perm.id)}
                                        title={`${isChecked ? "Cabut" : "Beri"} izin "${perm.name}" untuk ${r.key}`}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all font-bold text-[11px] border ${
                                          isChecked
                                            ? `${r.bg} ${r.color} ${r.border} hover:opacity-80 shadow-sm`
                                            : "bg-transparent border-emerald-900/50 text-white/15 hover:border-white/30 hover:text-white/30"
                                        }`}
                                      >
                                        {isChecked ? <Check className="w-4 h-4 stroke-[2.5]" /> : <span className="text-[14px] leading-none">○</span>}
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
                  );
                })}
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* VIEW: ABSENSI (SCANNER GPS & WAJAH - MANDIRI DI HP)   */}
          {/* ===================================================== */}
          {activeMenu === "absensi" && (
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

                {(currentActiveEmployee.dept === "HR" || currentActiveEmployee.level === "Supervisor" || currentActiveEmployee.level === "GeneralManager" || currentActiveEmployee.level === "Director" || activePerspective === "admin") && (
                  <button
                    onClick={() => setActiveMenu("rekap-absensi")}
                    className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#010804] hover:bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Lihat Rekap Absensi Tim →</span>
                  </button>
                )}
              </div>

              {/* Attendance Card untuk currentActiveEmployee */}
              <div className="rounded-3xl bg-gradient-to-b from-[#072a1b] via-[#03150d] to-[#010a06] p-6 border border-emerald-500/30 shadow-2xl relative">
                <div className="bg-[#020e08] rounded-2xl p-4 border border-emerald-900/60 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full ring-2 ring-emerald-400 bg-emerald-950 flex items-center justify-center font-black text-white text-base">
                      {currentActiveEmployee.avatar}
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
          {/* VIEW: REKAP ABSENSI (MONITORING HRD & ATASAN)          */}
          {/* ===================================================== */}
          {activeMenu === "rekap-absensi" && (
            <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-6 border border-emerald-900/60 space-y-5">
              {/* Header Box & Tombol Ekspor */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-emerald-900/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h3 className="font-black text-white text-lg">Rekapitulasi Kehadiran Karyawan</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Panel HRD & Manajemen
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-1 max-w-2xl">
                    Audit log kehadiran terverifikasi otomatis. HRD dan atasan memantau rekap absensi tim, memfilter per departemen, dan mengekspor laporan ke file CSV/Excel.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-black hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all"
                    title="Unduh data terfilter ke format CSV / Microsoft Excel"
                  >
                    <Download className="w-4 h-4" />
                    <span>Ekspor CSV / Excel ({filteredAttendances.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#020d07] text-white border border-emerald-900/60 text-xs font-bold hover:bg-emerald-950 transition-all"
                    title="Cetak atau simpan sebagai PDF"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Cetak / PDF</span>
                  </button>
                </div>
              </div>

              {/* Filter Controls Bar (Filter Lengkap 7 Departemen & Status) */}
              <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-3">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                  FILTER DATA REKAP ABSENSI
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Filter 1: Departemen Lengkap (7 Dept) */}
                  <div>
                    <label className="block text-[11px] text-white/70 font-bold mb-1">
                      Departemen ({standardDepartments.length})
                    </label>
                    <select
                      value={rekapDeptFilter}
                      onChange={(e) => setRekapDeptFilter(e.target.value)}
                      className="w-full bg-[#021008] border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="ALL">Semua Departemen ({standardDepartments.length})</option>
                      {standardDepartments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.icon} {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 2: Status Kehadiran */}
                  <div>
                    <label className="block text-[11px] text-white/70 font-bold mb-1">
                      Status Kehadiran
                    </label>
                    <select
                      value={rekapStatusFilter}
                      onChange={(e) => setRekapStatusFilter(e.target.value)}
                      className="w-full bg-[#021008] border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="ALL">Semua Status</option>
                      <option value="APPROVED">✓ APPROVED (Tepat Waktu)</option>
                      <option value="TERLAMBAT">⚠️ TERLAMBAT</option>
                    </select>
                  </div>

                  {/* Filter 3: Pencarian Nama / NIK */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-white/70 font-bold mb-1">
                      Cari Karyawan / No. KTP
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={rekapSearchQuery}
                        onChange={(e) => setRekapSearchQuery(e.target.value)}
                        placeholder="Ketik nama, No. KTP, atau shift..."
                        className="w-full bg-[#021008] border border-emerald-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Bar Filter Aktif & Reset */}
                {(rekapDeptFilter !== "ALL" || rekapStatusFilter !== "ALL" || rekapSearchQuery !== "") && (
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40 text-xs">
                    <span className="text-white/60 text-[11px]">
                      Menampilkan <strong>{filteredAttendances.length}</strong> dari {attendances.length} data log
                      {rekapDeptFilter !== "ALL" && ` • Dept: ${rekapDeptFilter}`}
                      {rekapStatusFilter !== "ALL" && ` • Status: ${rekapStatusFilter}`}
                    </span>
                    <button
                      onClick={() => {
                        setRekapDeptFilter("ALL");
                        setRekapStatusFilter("ALL");
                        setRekapSearchQuery("");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-500/40 text-xs font-semibold hover:bg-red-900 transition-all"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>

              {/* Ringkasan Metrik Singkat */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
                  <span className="text-[10px] text-white/60 block font-bold uppercase">Total Kehadiran</span>
                  <span className="text-lg font-black text-white">{filteredAttendances.length} Log</span>
                </div>
                <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
                  <span className="text-[10px] text-emerald-400 block font-bold uppercase">Hadir Tepat Waktu</span>
                  <span className="text-lg font-black text-emerald-400">
                    {filteredAttendances.filter((a) => a.status === "APPROVED").length}
                  </span>
                </div>
                <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
                  <span className="text-[10px] text-amber-400 block font-bold uppercase">Terlambat</span>
                  <span className="text-lg font-black text-amber-400">
                    {filteredAttendances.filter((a) => a.status === "TERLAMBAT").length}
                  </span>
                </div>
                <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60">
                  <span className="text-[10px] text-sky-400 block font-bold uppercase">Rata-rata AI Face</span>
                  <span className="text-lg font-black text-sky-300">
                    {filteredAttendances.length > 0
                      ? (filteredAttendances.reduce((acc, c) => acc + c.score, 0) / filteredAttendances.length).toFixed(1) + "%"
                      : "0%"}
                  </span>
                </div>
              </div>

              {/* Tabel Data Rekap Absensi */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white text-[10px] uppercase font-bold">
                      <th className="py-3 pl-3">No</th>
                      <th className="py-3">Karyawan</th>
                      <th className="py-3">Departemen</th>
                      <th className="py-3">Shift</th>
                      <th className="py-3">Tanggal</th>
                      <th className="py-3">Check-In</th>
                      <th className="py-3">Check-Out</th>
                      <th className="py-3">Jarak</th>
                      <th className="py-3">Skor AI</th>
                      <th className="py-3 text-center">Status</th>
                      <th className="py-3 pr-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {filteredAttendances.length > 0 ? (
                      filteredAttendances.map((r, idx) => (
                        <tr key={r.id} className="hover:bg-emerald-950/20 transition-colors">
                          <td className="py-3 pl-3 text-white/40 font-mono text-[11px]">{idx + 1}</td>
                          <td className="py-3">
                            <span className="font-bold text-white block leading-tight">{r.name}</span>
                            <span className="text-[10px] text-white/50 font-mono">No. KTP: {r.nik}</span>
                          </td>
                          <td className="py-3">
                            <span className="font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                              {r.dept}
                            </span>
                          </td>
                          <td className="py-3 text-white/70">{r.shift}</td>
                          <td className="py-3 font-mono text-white/80">{r.date}</td>
                          <td className="py-3 font-mono text-white font-bold">{r.in}</td>
                          <td className="py-3 font-mono text-white/60">{r.out}</td>
                          <td className="py-3 font-mono text-white">{r.dist.toFixed(1)}m</td>
                          <td className="py-3 font-mono text-sky-300 font-bold">{r.score}%</td>
                          <td className="py-3 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                                r.status === "APPROVED"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                              }`}
                            >
                              {r.status === "APPROVED" ? "✓ APPROVED" : "⚠️ TERLAMBAT"}
                            </span>
                            {r.isEdited && (
                              <span className="block text-[9px] text-red-400 font-bold mt-1">
                                ✏️ Diedit Manual
                              </span>
                            )}
                          </td>
                          <td className="py-3 pr-3 text-center">
                            {hasPermission("att_edit_rekap") && (
                              <button
                                onClick={() => handleOpenEditAttendance(r)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition-all flex items-center gap-1 mx-auto"
                                title="Koreksi jam check-in/out jika karyawan lupa absen"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={11} className="py-8 text-center text-white/50 text-xs">
                          Tidak ada catatan absensi yang sesuai dengan filter yang dipilih.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ========================================================= */}
              {/* BAGIAN BAWAH: AUDIT LOG AKTIVITAS (HAK AKSES ROLE: log_view) */}
              {/* ========================================================= */}
              {hasPermission("log_view") ? (
                <div className="bg-[#010804] border border-emerald-900/60 rounded-2xl p-5 shadow-2xl space-y-4 pt-4 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📜</span>
                        <h4 className="font-black text-white text-base">
                          Audit Log Aktivitas Kehadiran & Sistem
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Hak Akses log_view Terverifikasi
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">
                        Rekam jejak otomatis (check-in/out, cuti) & modifikasi manual. <strong className="text-red-400">Log berwarna merah</strong> menandakan data hasil koreksi/edit manual dengan informasi user pengedit.
                      </p>
                    </div>

                    {/* Filter Jenis Log */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-white/60 font-bold whitespace-nowrap">Filter Log:</span>
                      <select
                        value={rekapLogTypeFilter}
                        onChange={(e) => setRekapLogTypeFilter(e.target.value)}
                        className="bg-[#021008] border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="ALL">Semua Aktivitas ({activityLogs.length})</option>
                        <option value="MANUAL_EDIT">⚠️ Modifikasi Manual (Warna Merah)</option>
                        <option value="AUTO">✓ Aktivitas Otomatis</option>
                      </select>
                    </div>
                  </div>

                  {/* Daftar Card Log */}
                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {filteredActivityLogs.length > 0 ? (
                      filteredActivityLogs.map((log) => (
                        <div
                          key={log.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            log.isEdited
                              ? "bg-gradient-to-r from-red-950/60 via-red-950/30 to-[#010804] border-red-500/60 ring-1 ring-red-500/30 shadow-md shadow-red-950/30"
                              : "bg-[#021008] border-emerald-900/40 hover:border-emerald-500/30"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                  log.isEdited
                                    ? "bg-red-500 text-white shadow-sm"
                                    : log.type === "CHECK_IN"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                }`}
                              >
                                {log.isEdited ? "⚠️ MODIFIKASI MANUAL" : log.type === "CHECK_IN" ? "CHECK-IN" : "CUTI"}
                              </span>
                              <h5 className={`font-black text-xs ${log.isEdited ? "text-red-300" : "text-white"}`}>
                                {log.title}
                              </h5>
                              <span className="text-[10px] text-white/40">• Dept: <span className="text-white/80 font-bold">{log.dept}</span></span>
                            </div>
                            <span className="text-[10px] text-white/50 font-mono">
                              {log.timestamp}
                            </span>
                          </div>

                          <p className={`text-xs ${log.isEdited ? "text-red-200/90" : "text-white/70"}`}>
                            {log.description}
                          </p>

                          {/* Info User Pengedit & Alasan (Wajib & Khusus Merah) */}
                          {log.isEdited && (
                            <div className="mt-2.5 pt-2 border-t border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-red-950/40 -mx-3.5 -mb-3.5 p-3 rounded-b-xl text-xs">
                              <div className="space-y-0.5">
                                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                                  Diedit Manual Oleh User:
                                </span>
                                <span className="font-extrabold text-white">
                                  {log.actorName} <span className="text-red-300 font-semibold">({log.actorRole})</span>
                                </span>
                              </div>
                              {log.editReason && (
                                <div className="sm:max-w-md sm:text-right">
                                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                                    Alasan / Keterangan Edit:
                                  </span>
                                  <span className="italic text-red-200 font-medium">
                                    "{log.editReason}"
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {!log.isEdited && (
                            <div className="mt-1 text-[10px] text-white/40">
                              Aktor: <span className="text-white/70 font-semibold">{log.actorName}</span> ({log.actorRole})
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-white/40 text-xs">
                        Tidak ada riwayat log yang sesuai dengan filter.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-emerald-900/60 bg-[#010804] text-center space-y-1 text-xs mt-4">
                  <div className="flex items-center justify-center gap-1.5 text-white/50 font-bold">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Audit Log Kehadiran Terkunci</span>
                  </div>
                  <p className="text-[11px] text-white/40">
                    Role akun Anda (<strong className="text-white">{currentRoleName}</strong>) tidak memiliki izin <strong className="text-emerald-400">log_view</strong> di matriks Hak Akses Role. Hanya role yang dicentang yang dapat melihat riwayat audit log.
                  </p>
                </div>
              )}
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
          {/* VIEW: JADWAL SHIFT & ROSTER KERJA MINGGUAN             */}
          {/* ===================================================== */}
          {activeMenu === "jadwal-shift" && (() => {
            const schedulableEmployees = getSchedulableEmployees();
            const currentSchedTarget =
              employees.find((e) => e.id === selectedScheduleEmpId) || schedulableEmployees[0] || employees[0];
            const isSupervisorRole = currentActiveEmployee.level === "Supervisor";
            const isAdminOrHR = activePerspective === "admin" || currentRoleName === "Super Admin" || currentRoleName === "HR Supervisor";
            const canOverrideCuti = currentActiveEmployee.level === "Supervisor" || currentActiveEmployee.level === "GeneralManager" || currentActiveEmployee.level === "Director" || isAdminOrHR;

            return (
              <div className="space-y-6">
                {/* Header Information Box */}
                <div className="bg-gradient-to-r from-[#062417] via-[#041910] to-[#021008] rounded-3xl p-6 border border-emerald-900/60 shadow-xl space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📅</span>
                        <h3 className="font-black text-white text-lg tracking-wide">
                          {isStaff ? "Jadwal Shift Kerja Saya" : "Manajemen Shift & Penjadwalan Roster Kerja"}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            isStaff
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : isSupervisorRole
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : isAdminOrHR
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {isStaff
                            ? "POV Karyawan (Hanya Melihat Jadwal)"
                            : isSupervisorRole
                            ? "Wewenang Supervisor"
                            : isAdminOrHR
                            ? "Wewenang Direksi / HR"
                            : "Akses Jadwal"}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
                        {isStaff
                          ? `Jadwal shift mingguan Anda diatur dan disahkan secara resmi oleh Supervisor Anda (${
                              directSuperior ? `${directSuperior.name} — ${directSuperior.role}` : "Supervisor Departemen"
                            }). Karyawan hanya memiliki akses untuk melihat jadwal kerja.`
                          : "Supervisor dapat mengatur jadwal shift mingguan untuk diri sendiri dan seluruh staf di departemennya. Semua karyawan memiliki pilihan Shift Pagi, Siang, atau Libur setiap harinya. Sistem otomatis mendeteksi hari cuti yang telah disetujui dan mengunci kolom tersebut."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                        <span>🌙</span>
                        <span>Shift Malam Ditiadakan (Hanya Pagi & Siang)</span>
                      </span>
                    </div>
                  </div>

                  {/* Tab Selector: [📅 Roster Mingguan] vs [⚙️ Master Shift] - Khusus Supervisor & Manajemen */}
                  {!isStaff && (
                    <div className="flex items-center gap-3 pt-2 border-t border-emerald-900/60">
                      <button
                        onClick={() => setShiftActiveTab("roster")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                          shiftActiveTab === "roster"
                            ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-extrabold"
                            : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
                        }`}
                      >
                        <CalendarDays className="w-4 h-4" />
                        <span>Penjadwalan Roster Mingguan (7 Hari)</span>
                      </button>

                      <button
                        onClick={() => setShiftActiveTab("master")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                          shiftActiveTab === "master"
                            ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-extrabold"
                            : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Master Jam Shift ({shifts.length} Shift Aktif)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* =================================================== */}
                {/* TAB 1: PENJADWALAN ROSTER MINGGUAN (7 HARI)         */}
                {/* =================================================== */}
                {shiftActiveTab === "roster" && (
                  isStaff ? (
                    <div className="space-y-6">
                      {/* Notice Wewenang Supervisor & Card Info Karyawan */}
                      <div className="bg-[#021008] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-5">
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                            <div>
                              <span className="font-extrabold text-white text-sm block">
                                Mode Akses Karyawan: Hanya Melihat Jadwal (Read-Only)
                              </span>
                              <p className="text-xs text-amber-200/80 leading-relaxed mt-0.5">
                                Karyawan pelaksana tidak dapat mengubah atau membuat jadwal kerja. Pengaturan jadwal kerja Anda sepenuhnya dikelola oleh atasan langsung:{" "}
                                <strong className="text-white">
                                  {directSuperior ? `${directSuperior.name} (${directSuperior.role})` : "Supervisor Departemen"}
                                </strong>.
                              </p>
                            </div>
                          </div>

                          {directSuperior && (
                            <a
                              href={`https://wa.me/${directSuperior.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all flex items-center gap-1.5 flex-shrink-0"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Hubungi Supervisor (WA)</span>
                            </a>
                          )}
                        </div>

                        {/* Card Info Karyawan & Pemilih Minggu */}
                        <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center font-black text-white text-base ring-1 ring-emerald-500/40 flex-shrink-0">
                              {currentActiveEmployee.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-black text-white text-sm">{currentActiveEmployee.name}</h5>
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                  {currentActiveEmployee.contractType}
                                </span>
                              </div>
                              <p className="text-xs text-white/70 mt-0.5 font-medium">
                                {currentActiveEmployee.role} • Dept: <span className="text-emerald-400 font-bold">{currentActiveEmployee.dept}</span>
                              </p>
                              <span className="text-[10px] text-white/50 font-mono">No. KTP: {currentActiveEmployee.nik}</span>
                            </div>
                          </div>

                          {/* Pemilih Minggu */}
                          <div className="flex flex-col sm:items-end gap-2">
                            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">
                              Periode Minggu
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const d = new Date(rosterWeekStart + "T00:00:00");
                                  d.setDate(d.getDate() - 7);
                                  setRosterWeekStart(formatDateISO(d));
                                }}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all"
                              >
                                ◀
                              </button>
                              <input
                                type="date"
                                value={rosterWeekStart}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const monday = getMondayOfWeek(new Date(e.target.value + "T00:00:00"));
                                    setRosterWeekStart(formatDateISO(monday));
                                  }
                                }}
                                className="bg-[#010804] border border-emerald-500/50 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const d = new Date(rosterWeekStart + "T00:00:00");
                                  d.setDate(d.getDate() + 7);
                                  setRosterWeekStart(formatDateISO(d));
                                }}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all"
                              >
                                ▶
                              </button>
                            </div>
                            <span className="text-[10px] text-white/50 font-mono">
                              {(() => {
                                const mon = new Date(rosterWeekStart + "T00:00:00");
                                const sun = new Date(mon);
                                sun.setDate(sun.getDate() + 6);
                                return `${formatDateShort(mon)} — ${formatDateShort(sun)} ${sun.getFullYear()}`;
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* 7-Day Shift Grid (Read-Only) */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                              Jadwal 7 Hari Kerja Anda:
                            </span>
                            <span className="text-[10px] text-white/50 font-medium">
                              Status Roster Mingguan Resmi
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                            {DAYS_OF_WEEK.map((day) => {
                              const empSched = weeklySchedules[currentActiveEmployee.id] || {
                                Senin: "Pagi",
                                Selasa: "Pagi",
                                Rabu: "Pagi",
                                Kamis: "Pagi",
                                Jumat: "Pagi",
                                Sabtu: "Libur",
                                Minggu: "Libur",
                              };
                              const currentVal = empSched[day] || "Pagi";
                              const isWeekend = day === "Sabtu" || day === "Minggu";
                              const dayDateStr = rosterDayDates[day];
                              const dayDate = new Date(dayDateStr + "T00:00:00");
                              const leaveOnDay = getLeaveOnDate(currentActiveEmployee.id, dayDateStr);
                              const hasCuti = !!leaveOnDay;

                              return (
                                <div
                                  key={day}
                                  className={`p-4 rounded-2xl border transition-all ${
                                    hasCuti
                                      ? "bg-purple-950/40 border-purple-500/50 shadow-md ring-1 ring-purple-500/30"
                                      : currentVal === "Pagi"
                                      ? "bg-emerald-950/40 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/30"
                                      : currentVal === "Siang"
                                      ? "bg-amber-950/40 border-amber-500/40 shadow-md ring-1 ring-amber-500/30"
                                      : "bg-[#010804] border-red-900/30 opacity-80"
                                  }`}
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <span className={`font-black text-xs ${isWeekend ? "text-amber-400" : "text-white"}`}>
                                      {day}
                                    </span>
                                    <span
                                      className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                                        hasCuti
                                          ? "bg-purple-500/20 text-purple-300"
                                          : currentVal === "Pagi"
                                          ? "bg-emerald-500/20 text-emerald-300"
                                          : currentVal === "Siang"
                                          ? "bg-amber-500/20 text-amber-300"
                                          : "bg-red-500/20 text-red-300"
                                      }`}
                                    >
                                      {hasCuti ? "CUTI" : currentVal}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-white/50 font-mono block mb-3">
                                    {formatDateShort(dayDate)}
                                  </span>

                                  {/* Info Kartu Shift */}
                                  {hasCuti ? (
                                    <div className="space-y-1 py-1">
                                      <div className="text-purple-300 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>🏖️</span>
                                        <span>Cuti {leaveOnDay.type}</span>
                                      </div>
                                      <span className="text-[10px] text-white/60 block">Disetujui Atasan</span>
                                    </div>
                                  ) : currentVal === "Pagi" ? (
                                    <div className="space-y-1 py-1">
                                      <div className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>☀️</span>
                                        <span>Shift Pagi</span>
                                      </div>
                                      <div className="font-mono text-[11px] font-bold text-white">07:00 - 15:00 WIB</div>
                                      <span className="text-[10px] text-white/50 block">Wajib Hadir Kerja</span>
                                    </div>
                                  ) : currentVal === "Siang" ? (
                                    <div className="space-y-1 py-1">
                                      <div className="text-amber-400 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>🌤️</span>
                                        <span>Shift Siang</span>
                                      </div>
                                      <div className="font-mono text-[11px] font-bold text-white">15:00 - 23:00 WIB</div>
                                      <span className="text-[10px] text-white/50 block">Wajib Hadir Kerja</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-1 py-1">
                                      <div className="text-red-400 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>🏖️</span>
                                        <span>Libur (OFF)</span>
                                      </div>
                                      <div className="font-mono text-[11px] font-bold text-white/60">Tidak Bekerja</div>
                                      <span className="text-[10px] text-white/40 block">Hari Istirahat</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Tombol Pintas Ke Absensi Mandiri */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-emerald-900/60">
                          <p className="text-xs text-white/60">
                            Pastikan melakukan check-in dan check-out mandiri sesuai jadwal shift kerja resmi di atas.
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveMenu("absensi")}
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                          >
                            <span>📍</span>
                            <span>Buka Menu Absensi Sekarang</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* BANNER JADWAL 7 HARI KERJA ATASAN SENDIRI (SESUAI GAMBAR USER) */}
                      <div className="bg-[#021008] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/40 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                              JADWAL 7 HARI KERJA ANDA ({currentActiveEmployee.name} — {currentActiveEmployee.role}):
                            </span>
                          </div>
                          <span className="text-[10px] text-white/50 font-medium">
                            Status Roster Mingguan Resmi
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                          {DAYS_OF_WEEK.map((day) => {
                            const empSched = weeklySchedules[currentActiveEmployee.id] || {
                              Senin: "Pagi",
                              Selasa: "Pagi",
                              Rabu: "Pagi",
                              Kamis: "Pagi",
                              Jumat: "Pagi",
                              Sabtu: "Libur",
                              Minggu: "Libur",
                            };
                            const currentVal = empSched[day] || "Pagi";
                            const isWeekend = day === "Sabtu" || day === "Minggu";
                            const dayDateStr = rosterDayDates[day];
                            const dayDate = new Date(dayDateStr + "T00:00:00");
                            const leaveOnDay = getLeaveOnDate(currentActiveEmployee.id, dayDateStr);
                            const hasCuti = !!leaveOnDay;

                            return (
                              <div
                                key={day}
                                className={`p-4 rounded-2xl border transition-all ${
                                  hasCuti
                                    ? "bg-purple-950/40 border-purple-500/50 shadow-md ring-1 ring-purple-500/30"
                                    : currentVal === "Pagi"
                                    ? "bg-emerald-950/40 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/30"
                                    : currentVal === "Siang"
                                    ? "bg-amber-950/40 border-amber-500/40 shadow-md ring-1 ring-amber-500/30"
                                    : "bg-[#010804] border-red-900/30 opacity-80"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className={`font-black text-xs ${isWeekend ? "text-amber-400" : "text-white"}`}>
                                    {day}
                                  </span>
                                  <span
                                    className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                                      hasCuti
                                        ? "bg-purple-500/20 text-purple-300"
                                        : currentVal === "Pagi"
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : currentVal === "Siang"
                                        ? "bg-amber-500/20 text-amber-300"
                                        : "bg-red-500/20 text-red-300"
                                    }`}
                                  >
                                    {hasCuti ? "CUTI" : currentVal}
                                  </span>
                                </div>
                                <span className="text-[9px] text-white/50 font-mono block mb-3">
                                  {formatDateShort(dayDate)}
                                </span>

                                {/* Info Kartu Shift */}
                                {hasCuti ? (
                                  <div className="space-y-1 py-1">
                                    <div className="text-purple-300 font-extrabold text-xs flex items-center gap-1.5">
                                      <span>🏖️</span>
                                      <span>Cuti {leaveOnDay.type}</span>
                                    </div>
                                    <div className="font-mono text-[11px] font-bold text-white">Disetujui Atasan</div>
                                    <span className="text-[10px] text-white/50 block">Cuti Resmi</span>
                                  </div>
                                ) : currentVal === "Pagi" ? (
                                  <div className="space-y-1 py-1">
                                    <div className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5">
                                      <span>☀️</span>
                                      <span>Shift Pagi</span>
                                    </div>
                                    <div className="font-mono text-[11px] font-bold text-white">07:00 - 15:00 WIB</div>
                                    <span className="text-[10px] text-white/50 block">Wajib Hadir Kerja</span>
                                  </div>
                                ) : currentVal === "Siang" ? (
                                  <div className="space-y-1 py-1">
                                    <div className="text-amber-400 font-extrabold text-xs flex items-center gap-1.5">
                                      <span>🌤️</span>
                                      <span>Shift Siang</span>
                                    </div>
                                    <div className="font-mono text-[11px] font-bold text-white">15:00 - 23:00 WIB</div>
                                    <span className="text-[10px] text-white/50 block">Wajib Hadir Kerja</span>
                                  </div>
                                ) : (
                                  <div className="space-y-1 py-1">
                                    <div className="text-red-400 font-extrabold text-xs flex items-center gap-1.5">
                                      <span>🏖️</span>
                                      <span>Libur (OFF)</span>
                                    </div>
                                    <div className="font-mono text-[11px] font-bold text-white/60">Tidak Bekerja</div>
                                    <span className="text-[10px] text-white/40 block">Hari Istirahat</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Panel Form Penjadwalan */}
                      <div className="bg-[#021008] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-900/60 pb-4">
                        <div>
                          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
                            PENGATURAN ROSTER SHIFT MINGGUAN
                          </span>
                          <h4 className="font-bold text-white text-base">
                            Atur Jadwal Kerja: {currentSchedTarget.name}
                          </h4>
                        </div>

                        {/* Dropdown Pemilih Karyawan */}
                        <div className="flex items-center gap-2 min-w-[280px]">
                          <span className="text-xs text-white/60 font-bold whitespace-nowrap">Pilih Karyawan:</span>
                          <select
                            value={selectedScheduleEmpId}
                            onChange={(e) => handleSelectScheduleEmployee(e.target.value)}
                            className="w-full bg-[#010804] border border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none"
                          >
                            {schedulableEmployees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.name} — {emp.role} ({emp.dept}) {emp.id === currentActiveEmployee.id ? "(Saya)" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Card Info Karyawan Terpilih + Pemilih Minggu */}
                      <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center font-black text-white text-base ring-1 ring-emerald-500/40 flex-shrink-0">
                            {currentSchedTarget.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-black text-white text-sm">{currentSchedTarget.name}</h5>
                              {currentSchedTarget.id === currentActiveEmployee.id && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                  Akun Saya
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/70 mt-0.5 font-medium">
                              {currentSchedTarget.role} • Dept: <span className="text-emerald-400 font-bold">{currentSchedTarget.dept}</span>
                            </p>
                            <span className="text-[10px] text-white/50 font-mono">No. KTP: {currentSchedTarget.nik}</span>
                          </div>
                        </div>

                        {/* Pemilih Minggu */}
                        <div className="flex flex-col sm:items-end gap-2">
                          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">
                            Periode Minggu
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const d = new Date(rosterWeekStart + "T00:00:00");
                                d.setDate(d.getDate() - 7);
                                setRosterWeekStart(formatDateISO(d));
                              }}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all"
                            >
                              ◀
                            </button>
                            <input
                              type="date"
                              value={rosterWeekStart}
                              onChange={(e) => {
                                if (e.target.value) {
                                  const monday = getMondayOfWeek(new Date(e.target.value + "T00:00:00"));
                                  setRosterWeekStart(formatDateISO(monday));
                                }
                              }}
                              className="bg-[#010804] border border-emerald-500/50 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const d = new Date(rosterWeekStart + "T00:00:00");
                                d.setDate(d.getDate() + 7);
                                setRosterWeekStart(formatDateISO(d));
                              }}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all"
                            >
                              ▶
                            </button>
                          </div>
                          <span className="text-[10px] text-white/50 font-mono">
                            {(() => {
                              const mon = new Date(rosterWeekStart + "T00:00:00");
                              const sun = new Date(mon);
                              sun.setDate(sun.getDate() + 6);
                              return `${formatDateShort(mon)} — ${formatDateShort(sun)} ${sun.getFullYear()}`;
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Tombol Preset Cepat */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">
                          Terapkan Preset Jadwal Cepat:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setDraftSchedule({
                                Senin: "Pagi",
                                Selasa: "Pagi",
                                Rabu: "Pagi",
                                Kamis: "Pagi",
                                Jumat: "Pagi",
                                Sabtu: "Libur",
                                Minggu: "Libur",
                              });
                              showToast("✓ Preset Pagi 5 Hari (Sen-Jum Pagi, Sab-Min Libur) diterapkan!");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
                          >
                            <span>⚡</span>
                            <span>Preset Pagi 5 Hari (Senin-Jumat Pagi)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDraftSchedule({
                                Senin: "Siang",
                                Selasa: "Siang",
                                Rabu: "Siang",
                                Kamis: "Siang",
                                Jumat: "Siang",
                                Sabtu: "Libur",
                                Minggu: "Libur",
                              });
                              showToast("✓ Preset Siang 5 Hari diterapkan!");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all flex items-center gap-1.5"
                          >
                            <span>🌤️</span>
                            <span>Preset Siang 5 Hari (Senin-Jumat Siang)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDraftSchedule({
                                Senin: "Pagi",
                                Selasa: "Pagi",
                                Rabu: "Pagi",
                                Kamis: "Siang",
                                Jumat: "Siang",
                                Sabtu: "Siang",
                                Minggu: "Libur",
                              });
                              showToast("✓ Preset Rolling 6 Hari diterapkan!");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30 transition-all flex items-center gap-1.5"
                          >
                            <span>🔄</span>
                            <span>Preset Rolling 6 Hari (3 Pagi, 3 Siang, 1 Libur)</span>
                          </button>
                        </div>
                      </div>

                      {/* Grid 7 Hari Mingguan + Validasi Cuti */}
                      <form onSubmit={handleSaveWeeklySchedule} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                          {DAYS_OF_WEEK.map((day) => {
                            const currentVal = draftSchedule[day] || "Pagi";
                            const isWeekend = day === "Sabtu" || day === "Minggu";
                            const dayDateStr = rosterDayDates[day];
                            const dayDate = new Date(dayDateStr + "T00:00:00");
                            const leaveOnDay = getLeaveOnDate(selectedScheduleEmpId, dayDateStr);
                            const isCutiLocked = !!leaveOnDay && !canOverrideCuti;
                            const hasCuti = !!leaveOnDay;

                            return (
                              <div
                                key={day}
                                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                                  hasCuti
                                    ? "bg-purple-950/40 border-purple-500/50 shadow-md ring-1 ring-purple-500/30"
                                    : currentVal === "Pagi"
                                    ? "bg-emerald-950/40 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/30"
                                    : currentVal === "Siang"
                                    ? "bg-amber-950/40 border-amber-500/40 shadow-md ring-1 ring-amber-500/30"
                                    : "bg-[#010804] border-red-900/30 opacity-90"
                                }`}
                              >
                                <div>
                                  <div className="flex justify-between items-center mb-0.5">
                                    <span className={`font-black text-sm ${isWeekend ? "text-amber-400" : "text-white"}`}>
                                      {day}
                                    </span>
                                    <span
                                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                        hasCuti
                                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                          : currentVal === "Pagi"
                                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                          : currentVal === "Siang"
                                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                                      }`}
                                    >
                                      {hasCuti ? "CUTI" : currentVal.toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-white/50 font-mono block mb-3">
                                    {formatDateShort(dayDate)}
                                  </span>

                                  {/* Info Detail Shift (Sesuai Tampilan Roster Resmi) */}
                                  {hasCuti ? (
                                    <div className="space-y-1 mb-4">
                                      <div className="text-purple-300 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>🏖️</span>
                                        <span>Cuti {leaveOnDay.type}</span>
                                      </div>
                                      <div className="font-mono text-[11px] font-bold text-white">Disetujui Atasan</div>
                                      <span className="text-[10px] text-purple-200/60 block">Cuti Resmi ({leaveOnDay.start})</span>
                                    </div>
                                  ) : currentVal === "Pagi" ? (
                                    <div className="space-y-1 mb-4">
                                      <div className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>☀️</span>
                                        <span>Shift Pagi</span>
                                      </div>
                                      <div className="font-mono text-[11px] font-bold text-white">07:00 - 15:00 WIB</div>
                                      <span className="text-[10px] text-white/50 block">Wajib Hadir Kerja</span>
                                    </div>
                                  ) : currentVal === "Siang" ? (
                                    <div className="space-y-1 mb-4">
                                      <div className="text-amber-400 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>🌤️</span>
                                        <span>Shift Siang</span>
                                      </div>
                                      <div className="font-mono text-[11px] font-bold text-white">15:00 - 23:00 WIB</div>
                                      <span className="text-[10px] text-white/50 block">Wajib Hadir Kerja</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-1 mb-4">
                                      <div className="text-red-400 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>🏖️</span>
                                        <span>Libur (OFF)</span>
                                      </div>
                                      <div className="font-mono text-[11px] font-bold text-white/60">Tidak Bekerja</div>
                                      <span className="text-[10px] text-white/40 block">Hari Istirahat</span>
                                    </div>
                                  )}
                                </div>

                                {/* Tombol Pemilih Slot Shift 3 Pilihan */}
                                <div className="pt-2 border-t border-white/10 space-y-1">
                                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider block">
                                    Pilih Shift:
                                  </span>
                                  <div className="grid grid-cols-3 gap-1">
                                    <button
                                      type="button"
                                      disabled={isCutiLocked}
                                      onClick={() => {
                                        if (hasCuti && canOverrideCuti) {
                                          setCutiOverrideConfirm({ day, shift: "Pagi", leave: leaveOnDay });
                                          return;
                                        }
                                        setDraftSchedule((prev) => ({ ...prev, [day]: "Pagi" }));
                                      }}
                                      className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold transition-all text-center ${
                                        currentVal === "Pagi" && !hasCuti
                                          ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30"
                                          : "bg-white/5 text-white/60 hover:bg-white/15 hover:text-white"
                                      }`}
                                      title="Pilih Shift Pagi"
                                    >
                                      Pagi
                                    </button>

                                    <button
                                      type="button"
                                      disabled={isCutiLocked}
                                      onClick={() => {
                                        if (hasCuti && canOverrideCuti) {
                                          setCutiOverrideConfirm({ day, shift: "Siang", leave: leaveOnDay });
                                          return;
                                        }
                                        setDraftSchedule((prev) => ({ ...prev, [day]: "Siang" }));
                                      }}
                                      className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold transition-all text-center ${
                                        currentVal === "Siang" && !hasCuti
                                          ? "bg-amber-400 text-black shadow-md shadow-amber-400/30"
                                          : "bg-white/5 text-white/60 hover:bg-white/15 hover:text-white"
                                      }`}
                                      title="Pilih Shift Siang"
                                    >
                                      Siang
                                    </button>

                                    <button
                                      type="button"
                                      disabled={isCutiLocked}
                                      onClick={() => {
                                        if (hasCuti && canOverrideCuti) {
                                          setCutiOverrideConfirm({ day, shift: "Libur", leave: leaveOnDay });
                                          return;
                                        }
                                        setDraftSchedule((prev) => ({ ...prev, [day]: "Libur" }));
                                      }}
                                      className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold transition-all text-center ${
                                        currentVal === "Libur"
                                          ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                                          : "bg-white/5 text-white/60 hover:bg-white/15 hover:text-white"
                                      }`}
                                      title="Pilih Libur"
                                    >
                                      Libur
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-emerald-900/60">
                          <p className="text-xs text-white/60">
                            Jadwal mingguan ini akan berlaku untuk siklus absensi dan batas toleransi check-in harian karyawan.
                          </p>

                          <button
                            type="submit"
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Simpan Jadwal Mingguan ({currentSchedTarget.name})</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Matriks Roster Mingguan Tim */}
                    <div className="bg-[#021008] border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
                        <div>
                          <h4 className="font-bold text-white text-base flex items-center gap-2">
                            <span>📋</span>
                            <span>Matriks Roster Jadwal Mingguan Tim ({schedulableEmployees.length} Karyawan)</span>
                          </h4>
                          <p className="text-xs text-white/60">
                            Rekap jadwal 7 hari seluruh karyawan yang berada di bawah wewenang supervisi Anda.
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-white/90 border-collapse">
                          <thead>
                            <tr className="border-b border-emerald-900/60 text-[11px] text-emerald-400 font-extrabold uppercase tracking-wider">
                              <th className="pb-3 pl-3">Karyawan</th>
                              <th className="pb-3">Departemen</th>
                              <th className="pb-3">Tipe</th>
                              {DAYS_OF_WEEK.map((d) => (
                                <th key={d} className="pb-3 text-center">
                                  {d}
                                </th>
                              ))}
                              <th className="pb-3 text-center pr-3">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-emerald-900/30">
                            {schedulableEmployees.map((emp) => {
                              const empSched = weeklySchedules[emp.id] || {
                                Senin: "Pagi",
                                Selasa: "Pagi",
                                Rabu: "Pagi",
                                Kamis: "Pagi",
                                Jumat: "Pagi",
                                Sabtu: "Libur",
                                Minggu: "Libur",
                              };
                              const isSelected = emp.id === selectedScheduleEmpId;

                              return (
                                <tr
                                  key={emp.id}
                                  className={`transition-colors ${
                                    isSelected ? "bg-emerald-500/10 font-medium" : "hover:bg-emerald-950/30"
                                  }`}
                                >
                                  <td className="py-3 pl-3">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center font-bold text-white text-xs ring-1 ring-emerald-500/30 flex-shrink-0">
                                        {emp.avatar}
                                      </div>
                                      <div>
                                        <span className="font-bold text-white block leading-tight">{emp.name}</span>
                                        <span className="text-[10px] text-white/50">{emp.role}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 font-semibold text-white/80">{emp.dept}</td>
                                  <td className="py-3">
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                      {emp.dept}
                                    </span>
                                  </td>
                                  {DAYS_OF_WEEK.map((d) => {
                                    const val = empSched[d];
                                    const dayDateStr = rosterDayDates[d];
                                    const empLeave = getLeaveOnDate(emp.id, dayDateStr);
                                    return (
                                      <td key={d} className="py-3 text-center">
                                        {empLeave ? (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                            🏖️ Cuti
                                          </span>
                                        ) : (
                                          <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                              val === "Pagi"
                                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                                : val === "Siang"
                                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                                            }`}
                                          >
                                            {val === "Pagi" ? "☀️ Pagi" : val === "Siang" ? "🌤️ Siang" : "🏖️ Off"}
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}
                                  <td className="py-3 text-center pr-3">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleSelectScheduleEmployee(emp.id);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                        showToast(`Jadwal ${emp.name} dimuat ke form editor!`, "info");
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 text-[10px] font-bold transition-all"
                                    >
                                      Atur Jadwal
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  )
                )}

                {/* =================================================== */}
                {/* TAB 2: MASTER KONFIGURASI SHIFT (CRUD SHIFT)        */}
                {/* =================================================== */}
                {!isStaff && shiftActiveTab === "master" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021008] p-5 rounded-3xl border border-emerald-900/60 shadow-xl">
                      <div>
                        <h4 className="font-bold text-white text-base">Master Jam Shift Operasional</h4>
                        <p className="text-xs text-white/60">
                          Tambah, edit jam kerja, dan kelola toleransi keterlambatan shift kantor & operasional.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenAddShift}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Tambah Shift Baru</span>
                      </button>
                    </div>

                    {/* Grid Cards Master Shifts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {shifts.map((s) => {
                        const shiftStaffCount = employees.filter((e) => e.shiftId === s.id).length;

                        return (
                          <div
                            key={s.id}
                            className="bg-gradient-to-br from-[#062417] to-[#021008] p-6 rounded-3xl border border-emerald-900/60 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                                    s.status === "Aktif"
                                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                      : "bg-red-500/20 text-red-300 border-red-500/30"
                                  }`}
                                >
                                  {s.status}
                                </span>
                                <span className="text-xs font-bold text-white/80 bg-[#010804] px-2.5 py-1 rounded-lg border border-emerald-900/60">
                                  👥 {shiftStaffCount} Staf Terkait
                                </span>
                              </div>

                              <h4 className="font-extrabold text-white text-base">{s.name}</h4>

                              {/* Jam Masuk - Jam Pulang Block */}
                              <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 text-center space-y-1">
                                <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold block">
                                  JAM KERJA OPERASIONAL
                                </span>
                                <div className="font-mono text-2xl font-black text-white tracking-wider">
                                  {s.startTime} - {s.endTime}
                                </div>
                                <span className="text-[10px] text-emerald-400 font-semibold block">Waktu Indonesia Barat (WIB)</span>
                              </div>

                              {/* Detail Toleransi & Buka Absen */}
                              <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 text-xs space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-white/60">Toleransi Terlambat:</span>
                                  <span className="font-bold text-amber-300">{s.tolerance}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/60">Buka Absen Masuk:</span>
                                  <span className="font-bold text-teal-300">{s.openBefore} sebelum jam kerja</span>
                                </div>
                              </div>
                            </div>

                            {/* Tombol Aksi: Edit & Hapus Shift */}
                            <div className="pt-2 border-t border-emerald-900/60 flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditShift(s)}
                                className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit Shift</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeleteShiftConfirm(s)}
                                className="py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500 hover:text-white text-red-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                                title="Hapus Shift"
                              >
                                <span>🗑️</span>
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* VIEW: PENGAJUAN CUTI & PERSETUJUAN BERJENJANG         */}
          {/* ===================================================== */}
          {activeMenu === "pengajuan-cuti" && (
            <div className="space-y-6">
              {/* Header Bar dengan Profil, Atasan Penyetuju & Quota */}
              <div className="bg-gradient-to-r from-[#062417] via-[#041910] to-[#021008] rounded-3xl p-6 border border-emerald-900/60 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏖️</span>
                      <h3 className="font-black text-white text-lg tracking-wide">
                        Sistem Pengajuan & Persetujuan Cuti Mandiri
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        N+1 Hierarchy Auto-Linked
                      </span>
                    </div>
                    <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                      Karyawan dapat mengajukan permohonan cuti secara mandiri. Sistem otomatis menghubungkan permohonan ke atasan langsung Anda ({directSuperior ? `${directSuperior.name} — ${directSuperior.role}` : "Direktur Utama / Direksi"}). Atasan dapat menyetujui atau menolak permohonan bawahan secara real-time.
                    </p>
                    
                    {/* Ringkasan Profil & Atasan */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      <div className="bg-[#010804] px-3 py-1.5 rounded-xl border border-emerald-900/60 flex items-center gap-2">
                        <span className="text-white/60">Pemohon Aktif:</span>
                        <span className="font-bold text-white">{currentActiveEmployee.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-bold">
                          {currentActiveEmployee.role}
                        </span>
                      </div>
                      <div className="bg-[#010804] px-3 py-1.5 rounded-xl border border-amber-900/40 flex items-center gap-2">
                        <span className="text-amber-400 font-bold">🔒 Atasan Penyetuju (N+1):</span>
                        <span className="font-bold text-white">
                          {directSuperior ? `${directSuperior.name} (${directSuperior.role})` : "Direktur Utama (CEO)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Ajukan Cuti Baru */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowApplyLeaveModal(true)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Plus className="w-4 h-4" />
                      Ajukan Cuti Baru
                    </button>
                  </div>
                </div>

                {/* 4 Quick Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-900/50">
                  <div className="bg-[#010804]/80 p-3.5 rounded-2xl border border-emerald-900/50">
                    <span className="text-[10px] text-white/60 font-bold uppercase block">Hak Cuti Tahunan</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-black text-white font-mono">12</span>
                      <span className="text-xs text-white/50">Hari/Tahun</span>
                    </div>
                  </div>
                  <div className="bg-[#010804]/80 p-3.5 rounded-2xl border border-emerald-900/50">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">Cuti Terpakai</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-black text-emerald-400 font-mono">{myUsedLeaveDays}</span>
                      <span className="text-xs text-white/50">Hari Disetujui</span>
                    </div>
                  </div>
                  <div className="bg-[#010804]/80 p-3.5 rounded-2xl border border-emerald-900/50">
                    <span className="text-[10px] text-teal-400 font-bold uppercase block">Sisa Kuota Cuti</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-black text-teal-300 font-mono">{myRemainingQuota}</span>
                      <span className="text-xs text-white/50">Hari Tersedia</span>
                    </div>
                  </div>
                  <div className="bg-[#010804]/80 p-3.5 rounded-2xl border border-amber-900/40">
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">Menunggu Konfirmasi</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-black text-amber-300 font-mono">{myPendingLeavesCount}</span>
                      <span className="text-xs text-white/50">Pengajuan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Selector: [🏖️ Cuti Saya] vs [✍️ Persetujuan Cuti Bawahan] */}
              <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-3">
                <button
                  onClick={() => setLeaveActiveTab("my-leaves")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    leaveActiveTab === "my-leaves"
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                      : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
                  }`}
                >
                  <span>🏖️</span>
                  <span>Cuti Saya ({myLeaves.length})</span>
                </button>

                {!isStaff && (
                  <button
                    onClick={() => setLeaveActiveTab("subordinate-leaves")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all relative ${
                      leaveActiveTab === "subordinate-leaves"
                        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                        : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
                    }`}
                  >
                    <span>✍️</span>
                    <span>Persetujuan Cuti Bawahan</span>
                    {pendingSubordinateCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black animate-pulse">
                        {pendingSubordinateCount} Pending
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* CONTENT TAB 1: CUTI SAYA */}
              {leaveActiveTab === "my-leaves" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm">Riwayat Pengajuan Cuti Mandiri</h4>
                      <p className="text-xs text-white/60">
                        Daftar seluruh cuti yang diajukan oleh akun aktif Anda ({currentActiveEmployee.name}) beserta status persetujuan dari atasan.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowApplyLeaveModal(true)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-bold transition-all"
                    >
                      + Tambah Pengajuan
                    </button>
                  </div>

                  {myLeaves.length === 0 ? (
                    <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-950 flex items-center justify-center mx-auto text-2xl">
                        🏖️
                      </div>
                      <h5 className="font-bold text-white text-sm">Belum Ada Pengajuan Cuti</h5>
                      <p className="text-xs text-white/60 max-w-sm mx-auto">
                        Anda belum pernah mengajukan cuti. Gunakan tombol di bawah ini untuk mengajukan cuti tahunan, sakit, atau izin khusus.
                      </p>
                      <button
                        onClick={() => setShowApplyLeaveModal(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all"
                      >
                        Ajukan Cuti Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto shadow-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                            <th className="pb-3">ID & Jenis Cuti</th>
                            <th className="pb-3">Periode Tanggal</th>
                            <th className="pb-3">Durasi</th>
                            <th className="pb-3">Atasan Penyetuju (N+1)</th>
                            <th className="pb-3">Alasan Pengajuan</th>
                            <th className="pb-3">Status Permohonan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-900/30">
                          {myLeaves.map((c) => (
                            <tr key={c.id} className="hover:bg-emerald-950/20 transition-colors">
                              <td className="py-3">
                                <div className="font-bold text-white flex items-center gap-2">
                                  <span>{c.type === "Sakit" ? "🏥" : c.type === "Melahirkan" ? "👶" : c.type === "Khusus" ? "⭐" : "🏖️"}</span>
                                  <span>Cuti {c.type}</span>
                                </div>
                                <span className="text-[10px] text-white/50 font-mono">{c.id}</span>
                              </td>
                              <td className="py-3 font-mono text-white text-[11px]">
                                {c.start} s/d {c.end}
                              </td>
                              <td className="py-3">
                                <span className="font-extrabold text-white text-[11px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900/60">
                                  {c.days} Hari
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="text-white font-medium text-[11px]">
                                  {c.approverName || (directSuperior ? `${directSuperior.name} (${directSuperior.role})` : "Direktur Utama")}
                                </div>
                                {c.approvedAt && (
                                  <span className="text-[10px] text-emerald-400 block font-mono">
                                    {c.approvedAt}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-white/70 text-[11px] max-w-[220px]">
                                {c.reason}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black inline-flex items-center gap-1.5 ${
                                    c.status === "DISETUJUI"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                                      : c.status === "MENUNGGU"
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse"
                                      : "bg-red-500/20 text-red-300 border border-red-400/40"
                                  }`}
                                >
                                  {c.status === "DISETUJUI" && "✓ "}
                                  {c.status === "MENUNGGU" && "⏳ "}
                                  {c.status === "DITOLAK" && "✕ "}
                                  {c.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* CONTENT TAB 2: PERSETUJUAN CUTI BAWAHAN */}
              {!isStaff && leaveActiveTab === "subordinate-leaves" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">Persetujuan Cuti Bawahan Langsung</h4>
                      <p className="text-xs text-white/60">
                        {currentActiveEmployee.level === "GeneralManager"
                          ? "Sebagai General Manager, Anda bertanggung jawab meninjau cuti dari 6 Supervisor Departemen."
                          : currentActiveEmployee.level === "Supervisor"
                          ? `Sebagai Supervisor ${currentActiveEmployee.dept}, Anda bertanggung jawab menyetujui atau menolak cuti staff di departemen Anda.`
                          : currentActiveEmployee.level === "Director"
                          ? "Sebagai Direktur Utama, Anda meninjau cuti dari General Manager dan memiliki hak supervisi global."
                          : "Hanya atasan langsung (Supervisor, GM, Direksi) yang memiliki wewenang menyetujui cuti bawahan."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/70 font-medium">Bawahan Langsung:</span>
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-900/60">
                        {directSubordinates.length} Orang
                      </span>
                    </div>
                  </div>

                  {!canApproveLeaves && directSubordinates.length === 0 ? (
                    <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-2">
                      <div className="text-3xl">ℹ️</div>
                      <h5 className="font-bold text-white text-sm">Akses Khusus Atasan Langsung</h5>
                      <p className="text-xs text-white/60 max-w-md mx-auto">
                        Akun aktif Anda ({currentActiveEmployee.name} - {currentActiveEmployee.role}) berstatus Staff dan tidak memiliki bawahan langsung. Pengajuan cuti Anda diproses oleh atasan langsung Anda di tab sebelah.
                      </p>
                    </div>
                  ) : subordinateLeaves.length === 0 ? (
                    <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-2">
                      <div className="text-3xl">🎉</div>
                      <h5 className="font-bold text-white text-sm">Tidak Ada Permohonan Cuti Pending</h5>
                      <p className="text-xs text-white/60 max-w-md mx-auto">
                        Semua permohonan cuti dari staf bawahan langsung Anda telah selesai diproses.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto shadow-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                            <th className="pb-3">Karyawan Pemohon</th>
                            <th className="pb-3">Departemen</th>
                            <th className="pb-3">Jenis Cuti</th>
                            <th className="pb-3">Tanggal Pelaksanaan</th>
                            <th className="pb-3">Durasi</th>
                            <th className="pb-3">Alasan Pengajuan</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Aksi Persetujuan Atasan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-900/30">
                          {subordinateLeaves.map((c) => {
                            const empData = employees.find((e) => e.id === c.employeeId);
                            return (
                              <tr key={c.id} className="hover:bg-emerald-950/20 transition-colors">
                                <td className="py-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center font-bold text-white text-[11px]">
                                      {empData?.avatar || c.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-bold text-white">{c.name}</div>
                                      <div className="text-[10px] text-white/50 font-mono">
                                        {empData?.role || c.dept} • {empData?.nik || c.employeeId}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 font-black text-white">{c.dept}</td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-emerald-300 border border-emerald-900/60">
                                    {c.type}
                                  </span>
                                </td>
                                <td className="py-3 font-mono text-white text-[11px]">
                                  {c.start} s/d {c.end}
                                </td>
                                <td className="py-3 font-extrabold text-white text-[11px]">{c.days} Hari</td>
                                <td className="py-3 text-white/70 text-[11px] max-w-[200px]">
                                  {c.reason}
                                </td>
                                <td className="py-3">
                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 ${
                                      c.status === "DISETUJUI"
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                                        : c.status === "MENUNGGU"
                                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse"
                                        : "bg-red-500/20 text-red-300 border border-red-400/40"
                                    }`}
                                  >
                                    {c.status}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  {c.status === "MENUNGGU" ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => handleApproveLeave(c.id)}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                                        title="Setujui permohonan cuti"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        Setujui
                                      </button>
                                      <button
                                        onClick={() => handleRejectLeave(c.id)}
                                        className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 font-bold text-[11px] flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                                        title="Tolak permohonan cuti"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                        Tolak
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-right">
                                      <span className="text-[10px] text-white/50 font-mono block">
                                        {c.approvedAt || "Selesai ditinjau"}
                                      </span>
                                      <span className="text-[9px] text-white/40 block">
                                        Oleh: {c.approverName || "Atasan"}
                                      </span>
                                    </div>
                                  )}
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
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW: JURNAL KERJA                                    */}
          {/* ===================================================== */}
          {activeMenu === "jurnal-kerja" && (() => {
            const displayJournals = isStaff
              ? journals.filter((j) => j.employeeId === currentActiveEmployee.id)
              : journals;

            return (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021008] p-5 rounded-2xl border border-emerald-900/60 shadow-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📝</span>
                      <h3 className="font-extrabold text-white text-base">Jurnal Kerja Harian</h3>
                      {isStaff && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          POV Karyawan Mandiri
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/70 mt-1 max-w-2xl">
                      {isStaff
                        ? `Catat dan laporkan seluruh aktivitas pekerjaan harian Anda (${currentActiveEmployee.name}). Apa saja yang dikerjakan wajib dilaporkan secara berkala kepada Supervisor ${currentActiveEmployee.dept}.`
                        : "Catatan laporan aktivitas pekerjaan harian tim dan penilaian kualitas oleh Supervisor / Manajemen."}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddJournalModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Jurnal Kerja Harian</span>
                  </button>
                </div>

                {displayJournals.length === 0 ? (
                  <div className="bg-[#021008] rounded-2xl p-8 border border-emerald-900/60 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                      📝
                    </div>
                    <h4 className="font-bold text-white text-sm">Belum Ada Jurnal Kerja Tercatat</h4>
                    <p className="text-xs text-white/60 max-w-md mx-auto">
                      {isStaff
                        ? "Anda belum membuat laporan pekerjaan harian. Klik tombol di bawah untuk melaporkan apa saja yang Anda kerjakan hari ini."
                        : "Tidak ada data jurnal kerja yang ditemukan untuk kriteria filter ini."}
                    </p>
                    <button
                      onClick={() => setShowAddJournalModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs inline-flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tulis Jurnal Kerja Hari Ini
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayJournals.map((j) => (
                      <div
                        key={j.id}
                        className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 shadow-md space-y-3 transition-all hover:border-emerald-500/40"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/40 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center font-black text-white text-xs ring-1 ring-emerald-500/40">
                              {j.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-white text-sm">{j.name}</span>
                                {j.employeeId === currentActiveEmployee.id && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                    Jurnal Saya
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-white/60">
                                Departemen: {j.dept} • Tanggal: {j.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {j.score && (
                              <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                                Skor Evaluasi: {j.score}/100
                              </span>
                            )}
                            <span className="font-mono font-bold text-white text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-900/60">
                              ⏱️ {j.hours}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block mb-2">
                            Aktivitas & Tugas yang Dilaporkan ({j.tasks.length} Butir):
                          </span>
                          <ul className="space-y-1.5 text-xs text-white/90 pl-1">
                            {j.tasks.map((t, ti) => (
                              <li key={ti} className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span className="leading-relaxed">{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {j.notes && (
                          <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 text-[11px] text-white/70">
                            <span className="font-bold text-amber-300 block mb-0.5">Catatan / Kendala:</span>
                            <p>{j.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ===================================================== */}
          {/* VIEW: PENGATURAN TEKNIS IT (WEWENANG KHUSUS IT)       */}
          {/* ===================================================== */}
          {activeMenu === "pengaturan" && hasPermission("menu_settings") && (
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
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-white/90 font-bold">Nomor KTP (16 Digit) *</label>
                    <span className={`text-[10px] font-mono ${newEmployeeForm.nik.length === 16 ? "text-emerald-400 font-bold" : "text-white/50"}`}>
                      {newEmployeeForm.nik.length}/16 digit
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    inputMode="numeric"
                    placeholder="Contoh: 3171012304880001"
                    value={newEmployeeForm.nik}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setNewEmployeeForm({ ...newEmployeeForm, nik: val });
                    }}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                  {newEmployeeForm.nik.length > 0 && newEmployeeForm.nik.length < 16 && (
                    <span className="text-[10px] text-amber-400 mt-1 block">
                      ⚠️ Wajib 16 digit angka sesuai KTP (kurang {16 - newEmployeeForm.nik.length} digit)
                    </span>
                  )}
                  {newEmployeeForm.nik.length === 16 && (
                    <span className="text-[10px] text-emerald-400 mt-1 block font-medium">
                      ✓ Format 16 digit KTP valid
                    </span>
                  )}
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
                          {standardDepartments.filter((d) => d.id !== "Direksi").map((d) => {
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
                <span className="text-white/60">No. KTP (16 Digit):</span>
                <span className="font-mono font-bold text-white">{newlyCreatedCredentials.nik}</span>
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

      {/* ========================================================= */}
      {/* MODAL 4: FORM PENGAJUAN CUTI MANDIRI (SELF-SERVICE)       */}
      {/* ATASAN LANGSUNG TERHUBUNG OTOMATIS & TERKUNCI (READ-ONLY) */}
      {/* ========================================================= */}
      {showApplyLeaveModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-7 max-w-lg w-full shadow-2xl space-y-5 my-8">
            <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg">
                  🏖️
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
                    SELF-SERVICE EMPLOYEE LEAVE
                  </span>
                  <h3 className="font-black text-white text-base">
                    Formulir Pengajuan Cuti Mandiri
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowApplyLeaveModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-4 text-xs">
              {/* Box Karyawan Pemohon */}
              <div className="p-3.5 rounded-2xl bg-[#010804] border border-emerald-900/60 space-y-1">
                <span className="text-[10px] text-white/50 font-bold uppercase block">Karyawan Pemohon</span>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white text-sm block">{currentActiveEmployee.name}</span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {currentActiveEmployee.nik} • {currentActiveEmployee.role} ({currentActiveEmployee.dept})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/50 block">Sisa Kuota:</span>
                    <span className="font-extrabold text-teal-400 font-mono text-sm">{myRemainingQuota} Hari</span>
                  </div>
                </div>
              </div>

              {/* ATASAN LANGSUNG (N+1) - READ-ONLY TEXTBOX TERKUNCI OTOMATIS */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-white font-bold flex items-center gap-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Atasan Langsung Penyetuju (N+1)</span>
                  </label>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ⚡ Terhubung Otomatis
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={
                      directSuperior
                        ? `${directSuperior.name} — ${directSuperior.role} (${directSuperior.dept})`
                        : "Ir. Hendra Gunawan — Direktur Utama (CEO)"
                    }
                    className="w-full bg-[#010804] border border-emerald-700/60 rounded-xl p-3 text-white font-semibold cursor-not-allowed select-none text-xs pl-3 pr-8 shadow-inner"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                    🔒
                  </div>
                </div>
                <p className="text-[10px] text-emerald-400/90 leading-tight">
                  ✓ Sesuai hirarki sistem, permohonan ini otomatis dikirimkan ke atasan langsung Anda dan tidak dapat dialihkan manual.
                </p>
              </div>

              {/* Pilihan Jenis Cuti */}
              <div className="space-y-1.5">
                <label className="text-white font-bold block text-xs">
                  Jenis Cuti <span className="text-red-400">*</span>
                </label>
                <select
                  value={newLeaveForm.type}
                  onChange={(e) =>
                    setNewLeaveForm((prev) => ({
                      ...prev,
                      type: e.target.value as "Tahunan" | "Sakit" | "Melahirkan" | "Khusus",
                    }))
                  }
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white font-medium focus:border-emerald-400 focus:outline-none"
                >
                  <option value="Tahunan">🏖️ Cuti Tahunan (Potong Kuota Tahunan)</option>
                  <option value="Sakit">🏥 Cuti Sakit (Rekomendasi Dokter)</option>
                  <option value="Melahirkan">👶 Cuti Melahirkan (Maternity Leave)</option>
                  <option value="Khusus">⭐ Cuti Khusus (Pernikahan, Duka, Keperluan Mendesak)</option>
                </select>
              </div>

              {/* Rentang Tanggal Mulai & Selesai */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-white font-bold block text-xs">
                    Tanggal Mulai <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newLeaveForm.start}
                    onChange={(e) =>
                      setNewLeaveForm((prev) => ({ ...prev, start: e.target.value }))
                    }
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white font-bold block text-xs">
                    Tanggal Selesai <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newLeaveForm.end}
                    onChange={(e) =>
                      setNewLeaveForm((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Duration Calculation Helper */}
              {(() => {
                const s = new Date(newLeaveForm.start);
                const e = new Date(newLeaveForm.end);
                const diffDays = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
                return (
                  <div className="bg-[#010804] p-2.5 rounded-xl border border-emerald-900/60 flex items-center justify-between text-xs">
                    <span className="text-white/60">Estimasi Durasi Pengajuan:</span>
                    <span className="font-extrabold text-white font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {diffDays} Hari Kalender
                    </span>
                  </div>
                );
              })()}

              {/* Alasan Pengajuan Cuti */}
              <div className="space-y-1.5">
                <label className="text-white font-bold block text-xs">
                  Alasan Pengajuan Cuti <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newLeaveForm.reason}
                  onChange={(e) =>
                    setNewLeaveForm((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="Contoh: Mengurus keperluan keluarga mendesak di luar kota / Istirahat pemulihan kesehatan..."
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-3 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none text-xs"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyLeaveModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Kirim Pengajuan Cuti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT DATA KARYAWAN (WEWENANG RBAC)                 */}
      {/* ========================================================= */}
      {showEditEmployeeModal && editingEmployee && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-7 max-w-2xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
              <div>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
                  MANAJEMEN KARYAWAN • EDIT DATA PROFIL
                </span>
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <span>✏️</span>
                  <span>Edit Data: {editingEmployee.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setShowEditEmployeeModal(false)}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEmployee} className="space-y-4 text-xs">
              {/* Seksi 1: Data Identitas Diri */}
              <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  1. Identitas Pokok Karyawan
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-white/80 font-bold">
                        Nomor KTP (16 Digit) <span className="text-red-400">*</span>
                      </label>
                      <span className={`text-[10px] font-mono ${editingEmployee.nik.length === 16 ? "text-emerald-400 font-bold" : "text-white/50"}`}>
                        {editingEmployee.nik.length}/16 digit
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      inputMode="numeric"
                      placeholder="16 digit angka KTP"
                      value={editingEmployee.nik}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                        setEditingEmployee({ ...editingEmployee, nik: val });
                      }}
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                    />
                    {editingEmployee.nik.length > 0 && editingEmployee.nik.length < 16 && (
                      <span className="text-[10px] text-amber-400 mt-1 block">
                        ⚠️ Wajib 16 digit angka sesuai KTP (kurang {16 - editingEmployee.nik.length} digit)
                      </span>
                    )}
                    {editingEmployee.nik.length === 16 && (
                      <span className="text-[10px] text-emerald-400 mt-1 block font-medium">
                        ✓ Format 16 digit KTP valid
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">
                      Nama Lengkap & Gelar <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.name}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, name: e.target.value })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">
                      Email Perusahaan <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={editingEmployee.email}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, email: e.target.value })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">
                      Nomor WhatsApp / HP <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.phone}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, phone: e.target.value })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={editingEmployee.birthDate}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, birthDate: e.target.value })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">Alamat Domisili</label>
                    <input
                      type="text"
                      value={editingEmployee.address}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, address: e.target.value })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 2: Struktur Organisasi & Jabatan */}
              <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                  2. Struktur Organisasi & Penugasan
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/80 font-bold mb-1">
                      Departemen <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={editingEmployee.dept}
                      onChange={(e) => {
                        const newDept = e.target.value as DepartmentType;
                        let newMgr = editingEmployee.managerId;
                        if (editingEmployee.level === "Staff") {
                          const spv = employees.find(
                            (x) => x.dept === newDept && x.level === "Supervisor"
                          );
                          if (spv) newMgr = spv.id;
                        }
                        setEditingEmployee({
                          ...editingEmployee,
                          dept: newDept,
                          managerId: newMgr,
                        });
                      }}
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="Direksi">Direksi</option>
                      <option value="HR">HR (Human Resources)</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                      <option value="IT">IT (Information Technology)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">
                      Level Hirarki <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={editingEmployee.level}
                      onChange={(e) => {
                        const newLvl = e.target.value as HierarchyLevel;
                        let newMgr: string | null = null;
                        if (newLvl === "Staff") {
                          const spv = employees.find(
                            (x) => x.dept === editingEmployee.dept && x.level === "Supervisor"
                          );
                          newMgr = spv ? spv.id : null;
                        } else if (newLvl === "Supervisor") {
                          const gm = employees.find((x) => x.level === "GeneralManager");
                          newMgr = gm ? gm.id : null;
                        } else if (newLvl === "GeneralManager") {
                          const ceo = employees.find((x) => x.level === "Director");
                          newMgr = ceo ? ceo.id : null;
                        }
                        setEditingEmployee({
                          ...editingEmployee,
                          level: newLvl,
                          managerId: newMgr,
                        });
                      }}
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="Director">Director (CEO)</option>
                      <option value="GeneralManager">General Manager (GM)</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">
                      Nama Posisi / Jabatan <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEmployee.role}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, role: e.target.value })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">
                      Atasan Langsung (N+1)
                    </label>
                    <select
                      value={editingEmployee.managerId || ""}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          managerId: e.target.value || null,
                        })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none text-[11px]"
                    >
                      <option value="">Tanpa Atasan (Direktur Utama / Pimpinan Puncak)</option>
                      {employees
                        .filter((x) => x.id !== editingEmployee.id)
                        .map((mgr) => (
                          <option key={mgr.id} value={mgr.id}>
                            {mgr.name} — {mgr.role} ({mgr.dept})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">
                      Status Akun / Kepegawaian <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={editingEmployee.status}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          status: e.target.value as "Aktif" | "Cuti" | "Non-Aktif",
                        })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="Aktif">🟢 Aktif Bekerja</option>
                      <option value="Cuti">🏖️ Sedang Cuti</option>
                      <option value="Non-Aktif">🔴 Non-Aktif (Resign / Berhenti)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">Jadwal Shift</label>
                    <select
                      value={editingEmployee.shiftId}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, shiftId: e.target.value })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                    >
                      {shifts.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.startTime} - {s.endTime})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seksi 3: Masa Kerja & Kontrak */}
              <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">
                  3. Masa Kerja & Kontrak
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/80 font-bold mb-1">Tipe Kontrak</label>
                    <select
                      value={editingEmployee.contractType}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          contractType: e.target.value as ContractType,
                        })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="Tetap">Tetap (Permanent)</option>
                      <option value="Kontrak">Kontrak (PKWT)</option>
                      <option value="Magang">Magang (Internship)</option>
                      <option value="DW">Daily Worker (DW)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">Tanggal Mulai Kerja</label>
                    <input
                      type="date"
                      value={editingEmployee.startDate}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, startDate: e.target.value })
                      }
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-bold mb-1">
                      Tanggal Berakhir Kerja
                    </label>
                    <input
                      type="date"
                      disabled={editingEmployee.contractType === "Tetap"}
                      value={editingEmployee.endDate || ""}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, endDate: e.target.value })
                      }
                      placeholder={editingEmployee.contractType === "Tetap" ? "Karyawan Tetap" : ""}
                      className="w-full bg-[#020b06] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditEmployeeModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black hover:brightness-110 transition-all text-xs shadow-lg shadow-emerald-500/20"
                >
                  💾 Simpan Perubahan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ALERT KONFIRMASI (NONAKTIFKAN / HAPUS)              */}
      {/* ========================================================= */}
      {confirmDialog.isOpen && confirmDialog.employee && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`bg-[#021008] border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 ${
              confirmDialog.type === "delete"
                ? "border-red-500/60 ring-2 ring-red-500/20"
                : "border-amber-500/60 ring-2 ring-amber-500/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  confirmDialog.type === "delete"
                    ? "bg-red-500/20 text-red-400 ring-1 ring-red-400"
                    : "bg-amber-500/20 text-amber-400 ring-1 ring-amber-400"
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider block ${
                    confirmDialog.type === "delete" ? "text-red-400" : "text-amber-400"
                  }`}
                >
                  {confirmDialog.type === "delete"
                    ? "PERINGATAN BAHAYA SISTEM"
                    : "KONFIRMASI TINDAKAN STATUS"}
                </span>
                <h3 className="font-black text-white text-base">
                  {confirmDialog.type === "delete"
                    ? "Hapus Data Karyawan?"
                    : "Nonaktifkan Karyawan (Resign)?"}
                </h3>
              </div>
            </div>

            <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Nama:</span>
                <span className="font-bold text-white">{confirmDialog.employee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">No. KTP:</span>
                <span className="font-mono text-white">{confirmDialog.employee.nik}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Departemen & Posisi:</span>
                <span className="font-semibold text-emerald-300">
                  {confirmDialog.employee.dept} — {confirmDialog.employee.role}
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed ${
                confirmDialog.type === "delete"
                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-200"
              }`}
            >
              {confirmDialog.type === "delete" ? (
                <>
                  <strong className="block text-red-400 font-bold mb-0.5">
                    🚨 Tindakan Permanen!
                  </strong>
                  Seluruh data profil, akun login, dan riwayat karyawan ini akan dihapus dari sistem
                  secara permanen. Data yang telah dihapus <strong>tidak dapat dipulihkan</strong>.
                </>
              ) : (
                <>
                  <strong className="block text-amber-300 font-bold mb-0.5">
                    ⚠️ Status Diubah Menjadi Non-Aktif
                  </strong>
                  Karyawan ini akan tercatat telah mengundurkan diri (Resign) dan tidak dapat lagi
                  melakukan absensi mandiri, mengajukan cuti, ataupun mengakses aplikasi.
                </>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog({ isOpen: false, type: "deactivate", employee: null })
                }
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all text-center ${
                  confirmDialog.type === "delete"
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                    : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                }`}
              >
                {confirmDialog.type === "delete" ? "🗑️ Hapus Permanen" : "🚫 Ya, Nonaktifkan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH / EDIT SHIFT KERJA                          */}
      {/* ========================================================= */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-emerald-500/40 rounded-3xl p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-emerald-900/60 pb-3">
              <div>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
                  KONFIGURASI MASTER SHIFT KERJA
                </span>
                <h3 className="font-black text-white text-base">
                  {editingShiftId ? "Edit Konfigurasi Shift" : "Tambah Shift Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShiftModal(false)}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1">
                  Nama Shift Kerja <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Shift Pagi (Utama / Office)"
                  value={shiftForm.name}
                  onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-bold mb-1">
                    Jam Mulai Masuk <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={shiftForm.startTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-bold mb-1">
                    Jam Selesai Pulang <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={shiftForm.endTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-bold mb-1">Toleransi Keterlambatan</label>
                  <select
                    value={shiftForm.tolerance}
                    onChange={(e) => setShiftForm({ ...shiftForm, tolerance: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="5 Menit">5 Menit</option>
                    <option value="10 Menit">10 Menit</option>
                    <option value="15 Menit">15 Menit</option>
                    <option value="30 Menit">30 Menit</option>
                    <option value="Tanpa Toleransi">Tanpa Toleransi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-bold mb-1">Buka Absen Masuk</label>
                  <select
                    value={shiftForm.openBefore}
                    onChange={(e) => setShiftForm({ ...shiftForm, openBefore: e.target.value })}
                    className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="15 Menit">15 Menit Sebelum</option>
                    <option value="30 Menit">30 Menit Sebelum</option>
                    <option value="45 Menit">45 Menit Sebelum</option>
                    <option value="60 Menit">60 Menit Sebelum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1">Status Shift</label>
                <select
                  value={shiftForm.status}
                  onChange={(e) => setShiftForm({ ...shiftForm, status: e.target.value as "Aktif" | "Non-Aktif" })}
                  className="w-full bg-[#010804] border border-emerald-900/80 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="Aktif">🟢 Aktif Berjalan</option>
                  <option value="Non-Aktif">🔴 Non-Aktif (Ditangguhkan)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowShiftModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black font-black transition-all shadow-lg shadow-emerald-500/20"
                >
                  {editingShiftId ? "Simpan Perubahan" : "Tambahkan Shift"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ALERT KONFIRMASI HAPUS SHIFT                       */}
      {/* ========================================================= */}
      {deleteShiftConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-red-500/60 ring-2 ring-red-500/20 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center ring-1 ring-red-400 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-red-400 font-black uppercase tracking-wider block">
                  PERINGATAN BAHAYA SISTEM
                </span>
                <h3 className="font-black text-white text-base">Hapus Shift Kerja?</h3>
              </div>
            </div>

            <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Nama Shift:</span>
                <span className="font-bold text-white">{deleteShiftConfirm.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Jam Kerja:</span>
                <span className="font-mono text-emerald-300">
                  {deleteShiftConfirm.startTime} - {deleteShiftConfirm.endTime} WIB
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300 leading-relaxed">
              <strong className="block text-red-400 font-bold mb-0.5">⚠️ Konfirmasi Penghapusan:</strong>
              Shift ini akan dihapus dari konfigurasi sistem. Pastikan seluruh karyawan yang menggunakan shift ini telah dipindahkan jadwalnya ke shift lain.
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteShiftConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteShift}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs transition-all shadow-lg shadow-red-500/20"
              >
                🗑️ Ya, Hapus Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: KONFIRMASI OVERRIDE HARI CUTI OLEH ATASAN           */}
      {/* ========================================================= */}
      {cutiOverrideConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-amber-500/60 ring-2 ring-amber-500/20 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center ring-1 ring-amber-400 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">
                  PERINGATAN: OVERRIDE CUTI
                </span>
                <h3 className="font-black text-white text-base">Ubah Jadwal di Hari Cuti?</h3>
              </div>
            </div>

            <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Karyawan:</span>
                <span className="font-bold text-white">
                  {employees.find((e) => e.id === selectedScheduleEmpId)?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Hari:</span>
                <span className="font-bold text-white">
                  {cutiOverrideConfirm.day} ({rosterDayDates[cutiOverrideConfirm.day]})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Cuti Disetujui:</span>
                <span className="font-bold text-purple-300">
                  {cutiOverrideConfirm.leave.type} ({cutiOverrideConfirm.leave.start} s/d {cutiOverrideConfirm.leave.end})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Shift yang akan diterapkan:</span>
                <span className={`font-bold ${
                  cutiOverrideConfirm.shift === "Pagi" ? "text-emerald-300" :
                  cutiOverrideConfirm.shift === "Siang" ? "text-amber-300" : "text-red-300"
                }`}>
                  {cutiOverrideConfirm.shift}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 leading-relaxed">
              <strong className="block text-amber-400 font-bold mb-0.5">⚠️ Perhatian:</strong>
              Anda akan mengubah jadwal shift di hari yang sudah disetujui sebagai cuti. Karyawan akan diminta untuk tetap masuk kerja pada hari tersebut. Pastikan Anda telah berkomunikasi dengan yang bersangkutan.
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCutiOverrideConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftSchedule((prev) => ({ ...prev, [cutiOverrideConfirm.day]: cutiOverrideConfirm.shift }));
                  showToast(`⚠️ Jadwal hari ${cutiOverrideConfirm.day} diubah ke ${cutiOverrideConfirm.shift} (override cuti)`, "info");
                  setCutiOverrideConfirm(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20"
              >
                ✓ Ya, Override Cuti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT REKAP ABSENSI (KOREKSI LUPA ABSEN)            */}
      {/* ========================================================= */}
      {showEditAttendanceModal && editingAttendance && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#021008] border border-amber-500/50 ring-2 ring-amber-500/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center ring-1 ring-amber-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Koreksi Absensi (Lupa Absen)</h3>
                  <p className="text-[11px] text-white/60">
                    Perubahan data akan tercatat di Audit Log permanen bertanda merah.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditAttendanceModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Info Karyawan Terpilih */}
            <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-white text-sm block">{editingAttendance.name}</span>
                <span className="text-[10px] text-white/60 font-mono">No. KTP: {editingAttendance.nik}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  Dept: {editingAttendance.dept} • {editingAttendance.shift} ({editingAttendance.date})
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Log: {editingAttendance.id}
              </span>
            </div>

            <form onSubmit={handleSaveEditAttendance} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-white font-bold mb-1">
                    Jam Check-In <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editAttendanceForm.in}
                    onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, in: e.target.value })}
                    placeholder="07:45 WIB"
                    className="w-full bg-[#010804] border border-emerald-500/40 rounded-xl p-2.5 text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">
                    Jam Check-Out <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editAttendanceForm.out}
                    onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, out: e.target.value })}
                    placeholder="15:00 WIB"
                    className="w-full bg-[#010804] border border-emerald-500/40 rounded-xl p-2.5 text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-white font-bold mb-1">Status Kehadiran *</label>
                <select
                  value={editAttendanceForm.status}
                  onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, status: e.target.value as any })}
                  className="w-full bg-[#010804] border border-emerald-500/40 rounded-xl p-2.5 text-white font-bold focus:border-emerald-400 focus:outline-none"
                >
                  <option value="APPROVED">✓ APPROVED (Tepat Waktu / Sah)</option>
                  <option value="TERLAMBAT">⚠️ TERLAMBAT</option>
                  <option value="DITOLAK">❌ DITOLAK</option>
                </select>
              </div>

              {/* Keterangan / Alasan Edit (WAJIB) */}
              <div className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-amber-300 font-bold">
                    Keterangan / Alasan Melakukan Edit <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[10px] text-white/50 font-medium">Wajib diisi untuk audit trail</span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={editAttendanceForm.reason}
                  onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, reason: e.target.value })}
                  placeholder="Contoh: Karyawan lupa melakukan check-in mandiri karena langsung menghadiri rapat koordinasi pagi bersama klien..."
                  className="w-full bg-[#010804] border border-amber-500/40 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              {/* Notice Akuntabilitas */}
              <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-400">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Pencatatan Audit Trail Otomatis (Warna Merah)</span>
                </div>
                <p className="text-[11px] text-red-200/80 leading-relaxed">
                  Perubahan ini akan dicatat ke dalam Audit Log dengan <strong>WARNA MERAH</strong> mencantumkan identitas Anda (<strong>{currentActiveEmployee.name} - {currentActiveEmployee.role}</strong>) beserta alasan yang dimasukkan.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditAttendanceModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  ✓ Simpan Koreksi Absen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH JURNAL KERJA HARIAN                         */}
      {/* ========================================================= */}
      {showAddJournalModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#02140c] border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-black">
                  📝
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Tambah Jurnal Kerja Harian</h3>
                  <p className="text-[11px] text-white/60">
                    Laporkan seluruh tugas pekerjaan yang Anda kerjakan hari ini
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddJournalModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info Pelapor */}
            <div className="bg-[#010804] p-3.5 rounded-2xl border border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-950 flex items-center justify-center font-black text-white text-xs ring-1 ring-emerald-500/40">
                  {currentActiveEmployee.avatar}
                </div>
                <div>
                  <span className="font-extrabold text-white text-xs block">{currentActiveEmployee.name}</span>
                  <span className="text-[10px] text-white/60">
                    {currentActiveEmployee.role} • Dept: {currentActiveEmployee.dept}
                  </span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {currentActiveEmployee.contractType}
              </span>
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-semibold">Tanggal Laporan:</label>
                  <input
                    type="text"
                    value={journalForm.date}
                    onChange={(e) => setJournalForm((prev) => ({ ...prev, date: e.target.value }))}
                    placeholder="Contoh: 17 Nov 2026"
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/70 block mb-1 font-semibold">Durasi Jam Kerja:</label>
                  <input
                    type="text"
                    value={journalForm.hours}
                    onChange={(e) => setJournalForm((prev) => ({ ...prev, hours: e.target.value }))}
                    placeholder="Contoh: 8j 00m"
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">
                  Daftar Tugas yang Dikerjakan (Wajib Dilaporkan):
                </label>
                <p className="text-[10px] text-white/50 mb-1.5">
                  Tuliskan setiap tugas pekerjaan per baris (tekan Enter untuk memisahkan aktivitas):
                </p>
                <textarea
                  rows={4}
                  value={journalForm.tasksText}
                  onChange={(e) => setJournalForm((prev) => ({ ...prev, tasksText: e.target.value }))}
                  placeholder={`- Menyelesaikan rekonsiliasi berkas harian\n- Koordinasi tindak lanjut dengan rekan tim\n- Input rekap data aktivitas kerja ke sistem`}
                  className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 leading-relaxed font-sans"
                  required
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">
                  Catatan Tambahan / Hasil & Kendala (Opsional):
                </label>
                <textarea
                  rows={2}
                  value={journalForm.notes}
                  onChange={(e) => setJournalForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Contoh: Target selesai tepat waktu, berkas telah diarsipkan di drive bersama."
                  className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-emerald-900/60">
                <button
                  type="button"
                  onClick={() => setShowAddJournalModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
                >
                  ✓ Simpan & Laporkan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
