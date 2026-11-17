"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, AlertTriangle, Settings, Phone, CalendarDays, Download } from "lucide-react";

export default function JadwalShiftView() {
  const {
    DAYS_OF_WEEK,
    activePerspective,
    currentActiveEmployee,
    currentRoleName,
    directSuperior,
    draftSchedule,
    employees,
    formatDateISO,
    formatDateShort,
    getLeaveOnDate,
    getMondayOfWeek,
    getSchedulableEmployees,
    handleExportWeeklyScheduleExcel,
    handleSaveWeeklySchedule,
    handleSelectScheduleEmployee,
    hasPermission,
    isStaff,
    rosterDayDates,
    rosterWeekStart,
    selectedScheduleEmpId,
    setActiveMenu,
    setCutiOverrideConfirm,
    setDraftSchedule,
    setPengaturanTab,
    setRosterWeekStart,
    shifts,
    showToast,
    weeklySchedules,
  } = useApp();

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

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                        <span>🌙</span>
                        <span>Shift Malam Ditiadakan (Hanya Pagi & Siang)</span>
                      </span>
                      <button
                        onClick={handleExportWeeklyScheduleExcel}
                        className="px-3.5 py-1.5 rounded-xl bg-[#021008] border border-emerald-500/50 text-emerald-300 font-extrabold text-xs hover:bg-emerald-950 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        title="Unduh jadwal roster shift mingguan ke format Microsoft Excel (.xlsx)"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ekspor Roster (.xlsx)</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Link: Pindah ke Pengaturan Master Jam Shift */}
                  {!isStaff && hasPermission("menu_settings") && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-900/60">
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <CalendarDays className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium">Halaman Penjadwalan Roster Mingguan (7 Hari)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenu("pengaturan");
                          setPengaturanTab("shift");
                        }}
                        className="px-4 py-2 rounded-xl bg-[#021008] hover:bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Master Jam Shift di Pengaturan ({shifts.length} Shift) →</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* =================================================== */}
                {/* PENJADWALAN ROSTER MINGGUAN (7 HARI)                */}
                {/* =================================================== */}
                {isStaff ? (
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
                                      <div className="font-mono text-[11px] font-bold text-white">07:00 - 15:00 WITA</div>
                                      <span className="text-[10px] text-white/50 block">Wajib Hadir Kerja</span>
                                    </div>
                                  ) : currentVal === "Siang" ? (
                                    <div className="space-y-1 py-1">
                                      <div className="text-amber-400 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>🌤️</span>
                                        <span>Shift Siang</span>
                                      </div>
                                      <div className="font-mono text-[11px] font-bold text-white">15:00 - 23:00 WITA</div>
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
                                    <div className="font-mono text-[11px] font-bold text-white">07:00 - 15:00 WITA</div>
                                    <span className="text-[10px] text-white/50 block">Wajib Hadir Kerja</span>
                                  </div>
                                ) : currentVal === "Siang" ? (
                                  <div className="space-y-1 py-1">
                                    <div className="text-amber-400 font-extrabold text-xs flex items-center gap-1.5">
                                      <span>🌤️</span>
                                      <span>Shift Siang</span>
                                    </div>
                                    <div className="font-mono text-[11px] font-bold text-white">15:00 - 23:00 WITA</div>
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
                                      <div className="font-mono text-[11px] font-bold text-white">07:00 - 15:00 WITA</div>
                                      <span className="text-[10px] text-white/50 block">Wajib Hadir Kerja</span>
                                    </div>
                                  ) : currentVal === "Siang" ? (
                                    <div className="space-y-1 mb-4">
                                      <div className="text-amber-400 font-extrabold text-xs flex items-center gap-1.5">
                                        <span>🌤️</span>
                                        <span>Shift Siang</span>
                                      </div>
                                      <div className="font-mono text-[11px] font-bold text-white">15:00 - 23:00 WITA</div>
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
                )}
              </div>
            );
}
