"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import type { DepartmentType, HierarchyLevel } from "@/types";
import { X, UserPlus, ShieldCheck, Lock } from "lucide-react";

export default function AddEmployeeModal() {
  const {
    showAddEmployeeModal,
    setShowAddEmployeeModal,
    addRegistrationType,
    setAddRegistrationType,
    employees,
    setNewEmployeeForm,
    newEmployeeForm,
    standardDepartments,
    handleRegisterEmployeeSubmit,
    handleDeptChange,
    handleLevelChange,
  } = useApp();

  if (!showAddEmployeeModal) return null;

  return (
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
  );
}
