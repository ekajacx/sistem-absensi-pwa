export type DepartmentType = "HR" | "Finance" | "Marketing" | "Sales" | "Operations" | "IT" | "Direksi";
export type HierarchyLevel = "Director" | "GeneralManager" | "Supervisor" | "Staff";
export type ContractType = "Tetap" | "Kontrak" | "Magang" | "DW";
export type DayOfWeek = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu" | "Minggu";
export type ShiftSlotType = "Pagi" | "Siang" | "Libur";

export interface Employee {
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
  photoUrl?: string | null;
  managerId: string | null;
  isFirstLogin: boolean;
  temporaryPassword?: string | null;
  registeredDeviceId?: string | null;
  deviceModel?: string | null;
  deviceStatus?: "Bound" | "Unbound";
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  tolerance: string;
  openBefore: string;
  status: "Aktif" | "Non-Aktif";
}

export interface AttendanceRecord {
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

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: "CHECK_IN" | "CHECK_OUT" | "LEAVE_APPLY" | "LEAVE_APPROVE" | "MANUAL_EDIT";
  title: string;
  description: string;
  employeeName: string;
  dept: string;
  actorName: string;
  actorRole: string;
  isEdited: boolean;
  editReason?: string;
}

export interface LeaveRequest {
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

export interface WorkJournal {
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

export interface SystemUser {
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
  registeredDeviceId?: string | null;
  deviceModel?: string | null;
  deviceStatus?: "Bound" | "Unbound";
}

export interface PermissionItem {
  id: string;
  category: string;
  name: string;
  description: string;
}

export interface CompanyProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string | null;
}

export type LivenessChallengeType = "blink" | "smile" | "turnRight" | "turnLeft" | "nod";
