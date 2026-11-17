"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ChevronDown, ChevronRight, Pencil, Check, X, Upload } from "lucide-react";

export default function Sidebar() {
  const {
    activeMenu,
    activityLogs,
    attendances,
    companyLogoUrl,
    companyName,
    currentActiveEmployee,
    currentMeta,
    fileInputRef,
    hasPermission,
    isEditingCompany,
    isStaff,
    journals,
    myLeaves,
    openSections,
    pendingSubordinateCount,
    saveCompanyName,
    setActiveMenu,
    setFilterDept,
    setFilterShift,
    setIsEditingCompany,
    setTempCompanyName,
    shifts,
    standardDepartments,
    tempCompanyName,
    toggleSection,
    users,
    visibleEmployees,
  } = useApp();

  return (
    <aside className="w-72 flex-shrink-0 bg-[#010a06] border-r border-emerald-950/80 flex flex-col justify-between py-5 px-3 h-screen overflow-y-auto select-none z-20 shadow-2xl shadow-black sticky top-0">
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
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm flex-shrink-0">{item.icon}</span>
                        <span className="whitespace-nowrap">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-900 text-white flex-shrink-0">
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
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm flex-shrink-0">{item.icon}</span>
                        <span className="whitespace-nowrap">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-900 text-white flex-shrink-0">
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
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm flex-shrink-0">{item.icon}</span>
                        <span className="whitespace-nowrap">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-900 text-white flex-shrink-0">
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
                { id: "log-aktivitas", label: "Audit Log", icon: "📜", badge: activityLogs.length, permId: "log_view" },
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
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-sm flex-shrink-0">{item.icon}</span>
                            <span className="whitespace-nowrap">{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-900 text-white flex-shrink-0">
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
  );
}
