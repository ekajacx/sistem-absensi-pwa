"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, Search, Filter, UserPlus } from "lucide-react";

export default function UserManagementView() {
  const {
    employees,
    filteredUsers,
    hasPermission,
    openAddEmployeeModal,
    setUserDeptFilter,
    setUserSearchQuery,
    userDeptFilter,
    userSearchQuery,
    users,
  } = useApp();

  return (
    <div className="space-y-5">
              {/* Toolbar: Filter + Search + Tambah */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Filter Departemen */}
                  <select
                    value={userDeptFilter}
                    onChange={(e) => setUserDeptFilter(e.target.value)}
                    className="bg-[#021008] border border-emerald-900/70 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="ALL">🏢 Semua Departemen</option>
                    <option value="Direksi">🏛️ Direksi</option>
                    <option value="HR">👥 HR</option>
                    <option value="Finance">💰 Finance</option>
                    <option value="Marketing">📈 Marketing</option>
                    <option value="Sales">🤝 Sales</option>
                    <option value="Operations">⚙️ Operations</option>
                    <option value="IT">💻 IT</option>
                  </select>
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="Cari nama, email, role..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="bg-[#021008] border border-emerald-900/70 text-white text-xs rounded-xl pl-8 pr-3 py-2 w-56 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-white/30"
                    />
                  </div>
                  <span className="text-[11px] text-white/50 font-mono">
                    {filteredUsers.length} dari {users.length} akun
                  </span>
                </div>

                {hasPermission("emp_manage_hr") && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddEmployeeModal("staff")}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Tambah Staff</span>
                    </button>
                    <button
                      onClick={() => openAddEmployeeModal("atasan")}
                      className="px-3.5 py-2 rounded-xl bg-[#031d11] border border-amber-400/50 text-amber-300 font-extrabold text-xs hover:bg-emerald-950 transition-all flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>+ Tambah Atasan</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Tabel Akun User */}
              <div className="bg-gradient-to-br from-[#062417] to-[#021008] rounded-2xl p-5 border border-emerald-900/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-white/60 text-[10px] uppercase font-bold">
                      <th className="pb-3 pr-4">No</th>
                      <th className="pb-3 pr-4">Nama Karyawan</th>
                      <th className="pb-3 pr-4">Email Login</th>
                      <th className="pb-3 pr-4">Departemen</th>
                      <th className="pb-3 pr-4">Role Hak Akses</th>
                      <th className="pb-3 pr-4">Status Password</th>
                      <th className="pb-3">Status Akun</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-white/40 text-xs">
                          Tidak ada akun yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, idx) => {
                        const linkedEmp = employees.find((e) => e.email === u.email);
                        const isTemp = linkedEmp?.isFirstLogin && linkedEmp?.temporaryPassword;
                        return (
                          <tr key={u.id} className="hover:bg-emerald-950/20 transition-colors">
                            <td className="py-3 pr-4 text-white/40 font-mono">{idx + 1}</td>
                            <td className="py-3 pr-4 font-bold text-white whitespace-nowrap">{u.name}</td>
                            <td className="py-3 pr-4 font-mono text-white/70 text-[11px]">{u.email}</td>
                            <td className="py-3 pr-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                                {u.dept}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.role === "Super Admin"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : u.role === "General Manager"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : u.role.includes("HR")
                                  ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                                  : u.role.includes("IT")
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : u.role.includes("Supervisor")
                                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              {isTemp ? (
                                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-[10px]">
                                  🔑 Pass Sementara: {linkedEmp.temporaryPassword}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  ✓ Password Aktif
                                </span>
                              )}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.status === "AKTIF"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                  : "bg-red-500/20 text-red-300 border border-red-400/30"
                              }`}>
                                {u.status === "AKTIF" ? "● AKTIF" : "○ " + u.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
  );
}
