"use client";

import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import DashboardView from "@/components/views/DashboardView";
import KaryawanView from "@/components/views/KaryawanView";
import DepartemenView from "@/components/views/DepartemenView";
import UserManagementView from "@/components/views/UserManagementView";
import IzinAksesView from "@/components/views/IzinAksesView";
import AbsensiView from "@/components/views/AbsensiView";
import RekapAbsensiView from "@/components/views/RekapAbsensiView";
import JabatanView from "@/components/views/JabatanView";
import KontrakView from "@/components/views/KontrakView";
import JadwalShiftView from "@/components/views/JadwalShiftView";
import PengajuanCutiView from "@/components/views/PengajuanCutiView";
import JurnalKerjaView from "@/components/views/JurnalKerjaView";
import PengaturanView from "@/components/views/PengaturanView";
import AuditLogView from "@/components/views/AuditLogView";
import LoginView from "@/components/views/LoginView";
import AllModals from "@/components/modals/AllModals";
import ToastNotification from "@/components/modals/ToastNotification";

function MainApp() {
  const { activeMenu, hasPermission, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastNotification />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#010804] text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Sidebar Panel Kiri */}
      <Sidebar />

      {/* Panel Utama Kanan */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gradient-to-br from-[#051f14] via-[#020d08] to-[#010604] relative">
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-0" />

        {/* Topbar Header */}
        <Topbar />

        {/* View Konten Sesuai Menu Aktif */}
        <div className="px-4 md:px-8 py-4 md:py-6 space-y-6 relative z-10">
          {activeMenu === "dashboard" && <DashboardView />}
          {activeMenu === "karyawan" && <KaryawanView />}
          {activeMenu === "departemen" && <DepartemenView />}
          {activeMenu === "user-management" && hasPermission("menu_user_mgmt") && <UserManagementView />}
          {activeMenu === "izin-akses" && hasPermission("menu_user_mgmt") && <IzinAksesView />}
          {activeMenu === "absensi" && <AbsensiView />}
          {activeMenu === "rekap-absensi" && <RekapAbsensiView />}
          {activeMenu === "jabatan" && <JabatanView />}
          {activeMenu === "kontrak" && <KontrakView />}
          {activeMenu === "jadwal-shift" && <JadwalShiftView />}
          {activeMenu === "pengajuan-cuti" && <PengajuanCutiView />}
          {activeMenu === "jurnal-kerja" && <JurnalKerjaView />}
          {activeMenu === "pengaturan" && hasPermission("menu_settings") && <PengaturanView />}
          {activeMenu === "log-aktivitas" && hasPermission("log_view") && <AuditLogView />}
        </div>
      </div>

      {/* Semua Pop-up Modals & Floating Toast */}
      <AllModals />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
