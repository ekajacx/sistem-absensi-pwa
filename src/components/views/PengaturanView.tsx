"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { MapPin, Settings, Plus, Pencil, Cpu } from "lucide-react";

export default function PengaturanView() {
  const {
    employees,
    handleOpenAddShift,
    handleOpenEditShift,
    pengaturanTab,
    setDeleteShiftConfirm,
    setPengaturanTab,
    setSettings,
    settings,
    shifts,
    showToast,
  } = useApp();

  return (
    <div className="space-y-6">
              {/* Tab Selector Utama Pengaturan */}
              <div className="flex flex-wrap items-center gap-3 border-b border-emerald-900/60 pb-3">
                <button
                  type="button"
                  onClick={() => setPengaturanTab("lokasi")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
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
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    pengaturanTab === "shift"
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-extrabold"
                      : "bg-[#021008] text-white/70 hover:text-white border border-emerald-900/60"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Master Jam Shift ({shifts.length} Shift Aktif)</span>
                </button>
              </div>

              {/* TAB 1: PENGATURAN LOKASI & GEOFENCE GPS */}
              {pengaturanTab === "lokasi" && (
                <div className="max-w-2xl bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-6 border border-emerald-900/60 space-y-5">
                  <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-base flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-blue-400" />
                        <span>Pengaturan Titik Lokasi Kantor & Geofence GPS</span>
                      </h3>
                      <p className="text-xs text-white/70">
                        Wewenang khusus IT Supervisor & IT Staff untuk mengelola infrastruktur & keamanan sistem.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                      IT ONLY
                    </span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-white block mb-1 font-bold">Nama Titik Kantor</label>
                      <input
                        type="text"
                        value={settings.officeName}
                        onChange={(e) => setSettings({ ...settings, officeName: e.target.value })}
                        className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white block mb-1 font-bold">Radius Toleransi Geofence (Meter)</label>
                        <input
                          type="number"
                          value={settings.geofenceRadius}
                          onChange={(e) => setSettings({ ...settings, geofenceRadius: parseInt(e.target.value) || 50 })}
                          className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-white block mb-1 font-bold">Ambang Batas Skor AI Wajah (%)</label>
                        <input
                          type="number"
                          value={settings.aiFaceThreshold}
                          onChange={(e) => setSettings({ ...settings, aiFaceThreshold: parseInt(e.target.value) || 80 })}
                          className="w-full bg-[#010804] border border-emerald-900/60 rounded-xl px-3.5 py-2.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => showToast("✓ Konfigurasi server geofence berhasil disimpan oleh tim IT!")}
                      className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-extrabold text-xs hover:brightness-110 transition-all shadow-lg"
                    >
                      Simpan Konfigurasi Teknis IT
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: MASTER JAM SHIFT OPERASIONAL (DIPINDAHKAN KE PENGATURAN) */}
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
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
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
                              <span className="text-[10px] text-emerald-400 font-semibold block">Waktu Indonesia Barat (WIB)</span>
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
                              className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit Shift</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteShiftConfirm(s)}
                              className="py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500 hover:text-white text-red-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
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
