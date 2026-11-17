"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import type { DepartmentType, HierarchyLevel, ContractType } from "@/types";
import { ShieldCheck, CheckCircle2, AlertTriangle, Pencil, Check, X, UserPlus, Lock, Copy, KeyRound } from "lucide-react";

export default function AllModals() {
  const {
    addRegistrationType,
    confirmDialog,
    copyCredentialsToClipboard,
    currentActiveEmployee,
    cutiOverrideConfirm,
    deleteShiftConfirm,
    directSuperior,
    editAttendanceForm,
    editingAttendance,
    editingEmployee,
    editingShiftId,
    employees,
    forcedPasswordForm,
    handleApplyLeaveSubmit,
    handleConfirmAction,
    handleDeleteShift,
    handleDeptChange,
    handleForcedPasswordSubmit,
    handleLevelChange,
    handleRegisterEmployeeSubmit,
    handleSaveEditAttendance,
    handleSaveEditEmployee,
    handleSaveJournal,
    handleSaveShift,
    isForcedPasswordRequired,
    journalForm,
    myRemainingQuota,
    newEmployeeForm,
    newLeaveForm,
    newlyCreatedCredentials,
    rosterDayDates,
    selectedScheduleEmpId,
    setAddRegistrationType,
    setConfirmDialog,
    setCutiOverrideConfirm,
    setDeleteShiftConfirm,
    setDraftSchedule,
    setEditAttendanceForm,
    setEditingEmployee,
    setForcedPasswordForm,
    setJournalForm,
    setNewEmployeeForm,
    setNewLeaveForm,
    setShiftForm,
    setShowAddEmployeeModal,
    setShowAddJournalModal,
    setShowApplyLeaveModal,
    setShowCredentialsModal,
    setShowEditAttendanceModal,
    setShowEditEmployeeModal,
    setShowPasswordModal,
    setShowShiftModal,
    shiftForm,
    shifts,
    showAddEmployeeModal,
    showAddJournalModal,
    showApplyLeaveModal,
    showCredentialsModal,
    showEditAttendanceModal,
    showEditEmployeeModal,
    showPasswordModal,
    showShiftModal,
    showToast,
    standardDepartments,
    toastMessage,
  } = useApp();

  return (
    <>
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
    </>
  );
}
