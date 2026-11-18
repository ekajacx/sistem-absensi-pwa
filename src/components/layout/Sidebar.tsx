"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ChevronDown, ChevronRight, Pencil, X, Upload } from "lucide-react";

export default function Sidebar() {
  const {
    activeMenu,
    activityLogs,
    companyLogoUrl,
    companyName,
    currentActiveEmployee,
    currentMeta,
    hasPermission,
    isMobileSidebarOpen,
    isStaff,
    myLeaves,
    openSections,
    pendingSubordinateCount,
    setActiveMenu,
    setFilterDept,
    setFilterShift,
    setPengaturanTab,
    showToast,
    setIsMobileSidebarOpen,
    shifts,
    standardDepartments,
    toggleSection,
    users,
    visibleAttendances,
    visibleEmployees,
    visibleJournals,
  } = useApp();

  // Satu-satunya sumber edit identitas perusahaan: tab Profil Perusahaan di Pengaturan (butuh izin menu_settings)
  const openCompanyProfileSettings = () => {
    if (!hasPermission("menu_settings")) {
      showToast("Hanya role dengan izin Pengaturan yang dapat mengubah profil perusahaan.", "error");
      return;
    }
    setPengaturanTab("perusahaan");
    setActiveMenu("pengaturan");
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-72 flex-shrink-0 bg-[#010a06] border-r border-emerald-950/80 flex flex-col justify-between py-5 px-3 h-screen overflow-y-auto select-none shadow-2xl shadow-black transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-40 md:static md:translate-x-0 md:sticky md:top-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Header Profil Perusahaan */}
          <div className="group relative p-2.5 rounded-2xl bg-[#03140d]/70 border border-emerald-900/40 hover:border-emerald-500/40 transition-all mb-6">
            <div className="flex items-center gap-3">
              <div
                onClick={openCompanyProfileSettings}
                title="Klik untuk ubah logo di Profil Perusahaan"
                className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-emerald-600 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-black cursor-pointer overflow-hidden flex-shrink-0 group/logo ring-1 ring-emerald-300/40 hover:brightness-110 transition-all"
              >
                {companyLogoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={companyLogoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>{companyName.substring(0, 2).toUpperCase()}</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Upload className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <h1 className="text-base font-extrabold text-white tracking-tight truncate">
                          {companyName}
                        </h1>
                        <button
                          onClick={openCompanyProfileSettings}
                          title="Klik untuk ubah profil perusahaan"
                          className="opacity-0 group-hover:opacity-100 text-emerald-400 hover:text-white p-1 rounded-md transition-opacity"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] font-bold text-white tracking-widest uppercase block truncate">
                        {currentMeta.title}
                      </span>
                    </div>

                    {/* Mobile Close Drawer Button */}
                    <button
                      type="button"
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="md:hidden p-1.5 rounded-lg bg-[#041910] text-emerald-400 hover:text-white hover:bg-emerald-900/60 border border-emerald-900/40 transition-all flex-shrink-0 ml-1"
                      title="Tutup Menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
              </div>
            </div>
          </div>

          {/* Menu 1: Dashboard */}
          <div className="px-1 mb-4">
            <button
              onClick={() => {
                setActiveMenu("dashboard");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors duration-100 ${
                activeMenu === "dashboard"
                  ? "bg-[#0a261a] text-white border border-emerald-500/30 shadow-lg shadow-black/80"
                  : "text-white hover:bg-emerald-950/60 border border-transparent"
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
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors duration-100 border-l-2 ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium border-transparent"
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
                  {(isStaff || (!hasPermission("att_all") && !hasPermission("att_team"))
                    ? [
                        { id: "absensi", label: "Absensi", icon: "📍" },
                        { id: "jadwal-shift", label: "Jadwal Shift", icon: "📅", badge: shifts.length },
                      ]
                    : [
                        { id: "absensi", label: "Absensi", icon: "📍" },
                        { id: "rekap-absensi", label: "Rekap Absensi", icon: "📊", badge: visibleAttendances.length },
                        { id: "jadwal-shift", label: "Jadwal Shift", icon: "📅", badge: shifts.length },
                      ]
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenu(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors duration-100 border-l-2 ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium border-transparent"
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
                      badge: visibleJournals.filter((j) => !j.isArchived).length,
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenu(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors duration-100 border-l-2 ${
                        activeMenu === item.id
                          ? "bg-emerald-950 text-white font-bold border-emerald-400 shadow-sm"
                          : "text-white hover:bg-emerald-950/40 font-medium border-transparent"
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
                          onClick={() => {
                            setActiveMenu(item.id);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors duration-100 border-l-2 ${
                            activeMenu === item.id
                              ? "bg-emerald-950 text-white font-bold border-emerald-400 shadow-sm"
                              : "text-white hover:bg-emerald-950/40 font-medium border-transparent"
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
              <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center font-bold text-xs text-white ring-1 ring-emerald-500/40 flex-shrink-0 overflow-hidden">
                {currentActiveEmployee.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={currentActiveEmployee.photoUrl}
                    alt={currentActiveEmployee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentActiveEmployee.avatar
                )}
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
    </>
  );
}
