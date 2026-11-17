"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import type { DepartmentType, HierarchyLevel, ContractType } from "@/types";
import { X } from "lucide-react";

export default function EditEmployeeModal() {
  const {
    showEditEmployeeModal,
    setShowEditEmployeeModal,
    editingEmployee,
    setEditingEmployee,
    handleSaveEditEmployee,
    employees,
    shifts,
  } = useApp();

  if (!showEditEmployeeModal || !editingEmployee) return null;

  return (
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
  );
}
