"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  MapPin,
  Settings,
  Plus,
  Pencil,
  Cpu,
  Building2,
  Building,
  Upload,
  Trash2,
  Save,
  FileSpreadsheet,
  CheckCircle2,
  Mail,
  Phone,
  LocateFixed,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";

export default function PengaturanView() {
  const {
    companyLogoInputRef,
    companyProfileForm,
    employees,
    handleOpenAddShift,
    handleOpenEditShift,
    handleRemoveCompanyLogo,
    handleSaveCompanyProfile,
    handleSaveOfficeSettings,
    handleUpdateCompanyLogo,
    pengaturanTab,
    setCompanyProfileForm,
    setDeleteShiftConfirm,
    setPengaturanTab,
    setSettings,
    settings,
    shifts,
    showToast,
  } = useApp();

  const [isDetectingOfficeGps, setIsDetectingOfficeGps] = useState<boolean>(false);

  const handleDetectCurrentOfficeLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      showToast("Browser Anda tidak mendukung fitur Geolocation GPS!", "error");
      return;
    }
    setIsDetectingOfficeGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setSettings((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setIsDetectingOfficeGps(false);
        showToast(
          `📍 Titik lokasi berhasil diambil (${lat}, ${lng})! Klik Simpan untuk mengunci titik kantor.`,
          "success"
        );
      },
      (err) => {
        setIsDetectingOfficeGps(false);
        console.warn("Geolocation error:", err);
        showToast(
          "Gagal mengakses GPS perangkat (pastikan izin lokasi browser diizinkan).",
          "error"
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Selector Utama Pengaturan */}
      <div className="flex flex-wrap items-center gap-3 border-b border-emerald-900/60 pb-3">
        <button
          type="button"
          onClick={() => setPengaturanTab("perusahaan")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            pengaturanTab === "perusahaan"
              ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-extrabold"
              : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Profil Perusahaan & Kop Surat</span>
        </button>

        <button
          type="button"
          onClick={() => setPengaturanTab("lokasi")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            pengaturanTab === "lokasi"
              ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-extrabold"
              : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Pengaturan Lokasi & Geofence GPS</span>
        </button>

        <button
          type="button"
          onClick={() => setPengaturanTab("shift")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            pengaturanTab === "shift"
              ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-extrabold"
              : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Master Jam Shift ({shifts.length} Shift Aktif)</span>
        </button>
      </div>

      {/* TAB 1: PROFIL PERUSAHAAN & KOP SURAT EXCEL */}
      {pengaturanTab === "perusahaan" && (
        <div className="space-y-6">
          {/* Banner Info */}
          <div className="bg-[#021008] p-5 rounded-3xl border border-emerald-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black tracking-wider uppercase">
                  Kop Surat Dokumen Dinamis
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs text-white/60">Microsoft Excel (.xlsx)</span>
              </div>
              <h4 className="font-bold text-white text-base">Identitas Perusahaan & Kop Surat Resmi</h4>
              <p className="text-xs text-white/60">
                Data ini digunakan sebagai Kop Surat otomatis pada seluruh 6 laporan Microsoft Excel (.xlsx) yang diekspor dari aplikasi.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveCompanyProfile}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil & Kop Surat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* FORM INPUT PROFIL PERUSAHAAN (7 Kolom) */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#062417] to-[#021008] rounded-3xl p-6 border border-emerald-900/60 shadow-xl space-y-5">
              <div className="border-b border-emerald-900/60 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Formulir Data Perusahaan</span>
                  </h4>
                  <p className="text-[11px] text-white/60">
                    Perubahan data akan otomatis memperbarui Kop Surat dan nama aplikasi di sidebar.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  Dapat Diedit
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* 1. Nama Perusahaan */}
                <div>
                  <label className="text-white block mb-1 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Nama Resmi Perusahaan <span className="text-emerald-400">*</span></span>
                    </span>
                    <span className="text-[10px] text-white/50">Wajib Diisi</span>
                  </label>
                  <input
                    type="text"
                    value={companyProfileForm.name}
                    onChange={(e) =>
                      setCompanyProfileForm({ ...companyProfileForm, name: e.target.value })
                    }
                    placeholder="Contoh: PT Nusantara Gemilang Abadi"
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                {/* 2. Alamat Lengkap */}
                <div>
                  <label className="text-white block mb-1 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>Alamat Kantor Lengkap</span>
                  </label>
                  <textarea
                    rows={3}
                    value={companyProfileForm.address}
                    onChange={(e) =>
                      setCompanyProfileForm({ ...companyProfileForm, address: e.target.value })
                    }
                    placeholder="Contoh: Gedung Graha Sudirman Lt. 8, Jl. Jend. Sudirman No. 45, Denpasar, Bali"
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                {/* 3. Kontak (Telepon & Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-1 font-bold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>No. Telepon Kantor</span>
                    </label>
                    <input
                      type="text"
                      value={companyProfileForm.phone}
                      onChange={(e) =>
                        setCompanyProfileForm({ ...companyProfileForm, phone: e.target.value })
                      }
                      placeholder="Contoh: (0361) 890-1234"
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-white block mb-1 font-bold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>Email Resmi Perusahaan</span>
                    </label>
                    <input
                      type="email"
                      value={companyProfileForm.email}
                      onChange={(e) =>
                        setCompanyProfileForm({ ...companyProfileForm, email: e.target.value })
                      }
                      placeholder="Contoh: hr@perusahaan.co.id"
                      className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>
                </div>

                {/* 4. Logo Perusahaan */}
                <div className="pt-2 border-t border-emerald-900/60">
                  <label className="text-white block mb-2 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-purple-400" />
                      <span>Logo Perusahaan (Untuk Kop Surat & Sidebar)</span>
                    </span>
                    <span className="text-[10px] text-white/50">PNG / JPEG / WebP / SVG</span>
                  </label>

                  {/* Hidden file input */}
                  <input
                    ref={companyLogoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleUpdateCompanyLogo}
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#010804] p-4 rounded-2xl border border-emerald-900/60">
                    {/* Logo Thumbnail Preview */}
                    <div className="w-20 h-20 rounded-2xl border-2 border-emerald-500/40 bg-[#021008] flex items-center justify-center overflow-hidden shrink-0 shadow-lg relative group">
                      {companyProfileForm.logoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={companyProfileForm.logoUrl}
                          alt="Logo Perusahaan"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <Building2 className="w-7 h-7 text-emerald-500/60 mx-auto mb-1" />
                          <span className="text-[9px] text-white/40 block font-bold">NO LOGO</span>
                        </div>
                      )}
                    </div>

                    {/* Logo Controls */}
                    <div className="space-y-2 text-left flex-1 w-full sm:w-auto">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => companyLogoInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{companyProfileForm.logoUrl ? "Ganti Logo" : "Unggah Logo"}</span>
                        </button>

                        {companyProfileForm.logoUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveCompanyLogo}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 hover:text-white text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Logo</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-white/50">
                        Disarankan gambar berlatar transparan (PNG/SVG) atau rasio persegi / landscape proporsional.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tombol Simpan */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleSaveCompanyProfile}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Informasi Perusahaan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PRATINJAU KOP SURAT EXCEL (5 Kolom) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#021008] to-[#010804] rounded-3xl p-6 border border-emerald-900/60 shadow-xl space-y-4">
              <div className="border-b border-emerald-900/60 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">Pratinjau Kop Surat Excel (.xlsx)</h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold font-mono">
                  LIVE PREVIEW
                </span>
              </div>

              <p className="text-[11px] text-white/60 leading-relaxed">
                Visualisasi tata letak kop surat resmi di atas tabel data pada file Microsoft Excel:
              </p>

              {/* Mock Excel Sheet Canvas */}
              <div className="bg-[#010804] rounded-2xl border-2 border-emerald-800/80 p-5 shadow-2xl space-y-3 relative overflow-hidden">
                {/* Background subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c1915_1px,transparent_1px),linear-gradient(to_bottom,#022c1915_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Top Excel Double Border Header Simulation */}
                <div className="relative border-b-2 border-double border-emerald-500/80 pb-4">
                  <div className="flex items-center gap-3">
                    {/* Logo Mock */}
                    <div className="w-14 h-14 rounded-xl border border-emerald-500/40 bg-[#062417] flex items-center justify-center overflow-hidden shrink-0 shadow">
                      {companyProfileForm.logoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={companyProfileForm.logoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span className="font-black text-xs text-emerald-400 font-mono">LOGO</span>
                      )}
                    </div>

                    {/* Identity Mock */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-black text-emerald-300 text-sm tracking-wider uppercase truncate">
                        {companyProfileForm.name || "NAMA PERUSAHAAN"}
                      </h5>
                      <p className="text-[10px] text-white/80 line-clamp-2 leading-snug mt-0.5">
                        {companyProfileForm.address || "Alamat kantor perusahaan belum diisi..."}
                      </p>
                      <p className="text-[9px] text-emerald-400 font-mono mt-1 truncate">
                        {[
                          companyProfileForm.phone ? `Telp: ${companyProfileForm.phone}` : "",
                          companyProfileForm.email ? `Email: ${companyProfileForm.email}` : "",
                        ]
                          .filter(Boolean)
                          .join("  •  ") || "Telp: - • Email: -"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mock Report Title & Period */}
                <div className="relative pt-1 space-y-1">
                  <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-lg p-2 text-center">
                    <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider">
                      JUDUL DOKUMEN LAPORAN
                    </span>
                    <span className="text-xs font-black text-white">
                      LAPORAN REKAPITULASI KEHADIRAN KARYAWAN
                    </span>
                    <div className="text-[9px] text-emerald-400 font-mono mt-0.5">
                      Periode: Bulan Berjalan • Waktu Cetak: WITA
                    </div>
                  </div>
                </div>

                {/* Mock Mini Excel Table Grid */}
                <div className="relative pt-1">
                  <div className="rounded-lg overflow-hidden border border-emerald-900/80 text-[9px]">
                    <div className="bg-[#022C19] text-emerald-200 font-bold px-2 py-1.5 flex justify-between border-b border-emerald-700/60">
                      <span>No</span>
                      <span>Nama Karyawan</span>
                      <span>Dept</span>
                      <span>Check-In</span>
                      <span>Status</span>
                    </div>
                    <div className="bg-[#01140B] text-white/70 px-2 py-1 flex justify-between border-b border-emerald-950">
                      <span>1</span>
                      <span className="font-semibold text-white">Budi Pratama</span>
                      <span>IT</span>
                      <span className="text-emerald-400">07:42 WITA</span>
                      <span className="text-emerald-400 font-bold">APPROVED</span>
                    </div>
                    <div className="bg-[#021008] text-white/50 px-2 py-1 flex justify-between">
                      <span>2</span>
                      <span className="font-semibold text-white/80">Dimas Wicaksono</span>
                      <span>IT</span>
                      <span className="text-emerald-400">07:40 WITA</span>
                      <span className="text-emerald-400 font-bold">APPROVED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Highlights */}
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2 text-[11px] text-white/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Otomatis diterapkan pada 6 modul ekspor Excel (.xlsx).</span>
                </div>
                <div className="flex items-start gap-2 text-[11px] text-white/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Tata letak siap cetak kertas A4 Landscape (Fit to 1 page width).</span>
                </div>
                <div className="flex items-start gap-2 text-[11px] text-white/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Standar format angka, tanggal WITA, dan styling Dark Emerald.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENGATURAN LOKASI & GEOFENCE GPS */}
      {pengaturanTab === "lokasi" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* KOLOM KIRI: FORM KONFIGURASI KOORDINAT, GEOFENCE & ANTI-FAKE GPS */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#062417] to-[#021008] rounded-3xl p-6 border border-emerald-900/60 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <span>Titik Koordinat Kantor & Geofence GPS</span>
                </h3>
                <p className="text-xs text-white/70">
                  Tentukan titik koordinat pusat kantor, batas radius maksimal, dan pengaman Anti-Fake GPS.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold shrink-0">
                IT & ADMIN
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Nama Titik Kantor */}
              <div>
                <label className="text-white block mb-1 font-bold">Nama Titik Lokasi Kantor</label>
                <input
                  type="text"
                  value={settings.officeName}
                  onChange={(e) => setSettings({ ...settings, officeName: e.target.value })}
                  className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Box Titik Koordinat Kantor + Tombol 1x Tekan */}
              <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Titik Koordinat Pusat Kantor (GPS)</span>
                    </span>
                    <span className="text-[11px] text-white/50 block">
                      Tekan tombol di samping untuk mengambil posisi GPS Anda saat ini secara otomatis.
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isDetectingOfficeGps}
                    onClick={handleDetectCurrentOfficeLocation}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0 disabled:opacity-60"
                  >
                    <LocateFixed className={`w-3.5 h-3.5 ${isDetectingOfficeGps ? "animate-spin" : ""}`} />
                    <span>
                      {isDetectingOfficeGps
                        ? "Mendeteksi GPS..."
                        : "📍 Ambil Lokasi Saat Ini (1x Tekan)"}
                    </span>
                  </button>
                </div>

                {/* Input Latitude & Longitude */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-white/70 block mb-1 font-semibold text-[11px]">
                      Latitude (Garis Lintang)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={settings.latitude}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          latitude: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#021008] border border-emerald-900/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 block mb-1 font-semibold text-[11px]">
                      Longitude (Garis Bujur)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={settings.longitude}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          longitude: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#021008] border border-emerald-900/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Pengaturan Radius Maksimal & Batas Anti-Fake GPS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-white block mb-1 font-bold text-[11px]">
                    Radius Maks. Kantor (m)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={1000}
                    value={settings.geofenceRadius}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        geofenceRadius: Math.max(5, parseInt(e.target.value) || 50),
                      })
                    }
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-white/50 block mt-1">
                    Ditolak jika &gt; {settings.geofenceRadius}m
                  </span>
                </div>

                <div>
                  <label className="text-amber-300 block mb-1 font-bold text-[11px] flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    <span>Batas Anti-Fake GPS (m)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step="0.5"
                    value={settings.minSafeDistance ?? 2}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        minSafeDistance: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full bg-[#010804] border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-amber-300/70 block mt-1">
                    Ditolak jika &le; {settings.minSafeDistance ?? 2}m (terlalu dekat)
                  </span>
                </div>

                <div>
                  <label className="text-white block mb-1 font-bold text-[11px]">
                    Batas Skor AI Wajah (%)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={99}
                    value={settings.aiFaceThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        aiFaceThreshold: parseInt(e.target.value) || 80,
                      })
                    }
                    className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-white/50 block mt-1">
                    Wajib &ge; {settings.aiFaceThreshold}%
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveOfficeSettings}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-extrabold text-xs hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Titik Koordinat & Konfigurasi Geofence</span>
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: TAMPILAN PETA TITIK KOORDINAT KANTOR (LIVE MAP) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#021008] to-[#010804] rounded-3xl p-6 border border-emerald-900/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Peta Lokasi Titik Pusat Kantor</span>
                </h4>
                <p className="text-[11px] text-white/60">
                  Visualisasi peta langsung berdasarkan titik Latitude & Longitude kantor.
                </p>
              </div>
              <a
                href={`https://www.google.com/maps?q=${settings.latitude},${settings.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-all shrink-0"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded Map Frame */}
            <div className="rounded-2xl overflow-hidden border-2 border-emerald-800/70 bg-[#010804] h-64 relative shadow-inner">
              <iframe
                title="Peta Titik Koordinat Kantor"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${settings.latitude},${settings.longitude}&z=18&output=embed`}
                className="w-full h-full border-0"
              />
            </div>

            {/* Ringkasan Aturan Zona Geofence & Anti-Fake GPS */}
            <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2">
                <span className="text-white/60 font-semibold">Koordinat Acuan Absensi:</span>
                <span className="font-mono font-bold text-emerald-300">
                  {settings.latitude.toFixed(6)}, {settings.longitude.toFixed(6)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-emerald-400 font-extrabold block">✓ Zona Valid (Diterima)</span>
                  <span className="font-mono text-white/90 text-xs font-bold">
                    &gt; {settings.minSafeDistance ?? 2}m s/d {settings.geofenceRadius}m
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
                  <span className="text-red-400 font-extrabold block">❌ Di Luar Radius</span>
                  <span className="font-mono text-white/90 text-xs font-bold">
                    &gt; {settings.geofenceRadius} Meter
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-amber-300 font-extrabold block">🚨 Anti-Fake GPS</span>
                  <span className="font-mono text-white/90 text-xs font-bold">
                    0m s/d {settings.minSafeDistance ?? 2}m (Ditolak)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER JAM SHIFT OPERASIONAL */}
      {pengaturanTab === "shift" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021008] p-5 rounded-3xl border border-emerald-900/60 shadow-xl">
            <div>
              <h4 className="font-bold text-white text-base">Master Jam Shift Operasional</h4>
              <p className="text-xs text-white/60">
                Tambah, edit jam kerja, dan kelola toleransi keterlambatan shift kantor & operasional.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddShift}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Shift Baru</span>
            </button>
          </div>

          {/* Grid Cards Master Shifts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shifts.map((s) => {
              const shiftStaffCount = employees.filter((e) => e.shiftId === s.id).length;

              return (
                <div
                  key={s.id}
                  className="bg-gradient-to-br from-[#062417] to-[#021008] p-6 rounded-3xl border border-emerald-900/60 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          s.status === "Aktif"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30"
                        }`}
                      >
                        {s.status}
                      </span>
                      <span className="text-xs font-bold text-white/80 bg-[#010804] px-2.5 py-1 rounded-lg border border-emerald-900/60">
                        👥 {shiftStaffCount} Staf Terkait
                      </span>
                    </div>

                    <h4 className="font-extrabold text-white text-base">{s.name}</h4>

                    {/* Jam Masuk - Jam Pulang Block */}
                    <div className="bg-[#010804] p-4 rounded-2xl border border-emerald-900/60 text-center space-y-1">
                      <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold block">
                        JAM KERJA OPERASIONAL
                      </span>
                      <div className="font-mono text-2xl font-black text-white tracking-wider">
                        {s.startTime} - {s.endTime}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold block">Waktu Indonesia Tengah (WITA)</span>
                    </div>

                    {/* Detail Toleransi & Buka Absen */}
                    <div className="bg-[#010804] p-3 rounded-xl border border-emerald-900/40 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60">Toleransi Terlambat:</span>
                        <span className="font-bold text-amber-300">{s.tolerance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Buka Absen Masuk:</span>
                        <span className="font-bold text-teal-300">{s.openBefore} sebelum jam kerja</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi: Edit & Hapus Shift */}
                  <div className="pt-2 border-t border-emerald-900/60 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditShift(s)}
                      className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Shift</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteShiftConfirm(s)}
                      className="py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500 hover:text-white text-red-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Hapus Shift"
                    >
                      <span>🗑️</span>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
