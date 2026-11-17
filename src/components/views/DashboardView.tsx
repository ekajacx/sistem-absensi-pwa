"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, UserPlus, Network } from "lucide-react";

export default function DashboardView() {
  const {
    currentActiveEmployee,
    currentRoleName,
    employees,
    hasPermission,
    openAddEmployeeModal,
    setActiveMenu,
    showToast,
    standardDepartments,
    users,
  } = useApp();

  const totalEmp = employees.length;
  const tetapCount = employees.filter((e) => e.contractType === "Tetap").length;
  const kontrakCount = employees.filter((e) => e.contractType === "Kontrak").length;
  const magangCount = employees.filter((e) => e.contractType === "Magang").length;
  const dwCount = employees.filter((e) => e.contractType === "DW").length;
  const otherCount = magangCount + dwCount;
  const percentTetap = totalEmp > 0 ? Math.round((tetapCount / totalEmp) * 100) : 0;
  const percentKontrak = totalEmp > 0 ? Math.round((kontrakCount / totalEmp) * 100) : 0;
  const percentOther = otherCount > 0 ? Math.max(0, 100 - percentTetap - percentKontrak) : 0;

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
                {/* Magang & Daily Worker (DW) Arc (Emerald Green) */}
                {percentOther > 0 && (
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="11"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - percentOther / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{
                      transformOrigin: "center",
                      transform: `rotate(${((percentTetap + percentKontrak) / 100) * 360}deg)`,
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
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500"
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
}
