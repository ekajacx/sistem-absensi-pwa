"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, Users, CheckCircle2, Smartphone, Search, Filter, UserPlus, Lock, Phone, Copy } from "lucide-react";

export default function KaryawanView() {
  const {
    activePerspective,
    currentActiveEmployee,
    currentRoleName,
    directSubordinates,
    directSuperior,
    filterDept,
    filteredEmployees,
    getDirectSuperior,
    handleOpenEditModal,
    hasPermission,
    isStaff,
    myRemainingQuota,
    myUsedLeaveDays,
    openAddEmployeeModal,
    searchEmployeeQuery,
    setActiveMenu,
    setConfirmDialog,
    setEmployees,
    setFilterDept,
    setRekapDeptFilter,
    setRekapSearchQuery,
    setSearchEmployeeQuery,
    setShowAddJournalModal,
    setShowApplyLeaveModal,
    showToast,
    standardDepartments,
  } = useApp();

  return (
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

                      {/* Device Lock Status — tampil di POV HRD */}
                      {isHRDPov && (
                        <div className="bg-[#010804] border border-emerald-900/40 rounded-xl p-2.5 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <Smartphone className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            <div>
                              <span className="text-white/60 block">Status HP:</span>
                              {k.deviceStatus === "Bound" ? (
                                <span className="text-emerald-300 font-bold">🔒 {k.deviceModel?.split(" ").slice(0, 3).join(" ")}</span>
                              ) : (
                                <span className="text-gray-400 font-bold">📵 Belum Terdaftar</span>
                              )}
                            </div>
                          </div>
                          {hasPermission("emp_manage_hr") && k.deviceStatus === "Bound" && (
                            <button
                              onClick={() => setEmployees(prev => prev.map(e =>
                                e.id === k.id ? { ...e, registeredDeviceId: null, deviceModel: null, deviceStatus: "Unbound" as const } : e
                              ))}
                              className="px-2 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 font-bold transition-all border border-orange-500/30"
                              title="Reset Kunci HP — lepas perangkat terdaftar karyawan ini"
                            >
                              🔓 Reset HP
                            </button>
                          )}
                        </div>
                      )}

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
  );
}
