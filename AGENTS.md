# Project Memory & Agent Guidelines: Sistem Absensi Geolokasi & Wajah (PWA)

File ini adalah **sumber kebenaran tunggal (*Single Source of Truth*)** untuk semua AI Agent (Antigravity, Codex, Cursor, Claude Code) dan anggota tim pengembang yang bekerja pada repositori ini.

---

## 1. Ringkasan Proyek & Referensi Utama
* **Nama Proyek:** Sistem Absensi Karyawan PWA (Geolokasi & Liveness Face Recognition)
* **Dokumen Acuan:** Wajib membaca dan mematuhi spesifikasi di [PRD_Sistem_Absensi.md](./PRD_Sistem_Absensi.md).
* **Target Pengguna:** Karyawan (Mobile PWA) & Tim HRD (Admin Web Dashboard).
* **Tema Visual & Desain:** Dark Forest Emerald (`#010804`, `#021008`, aksen hijau emerald `#10b981`, teks amber/putih kontras tinggi).

---

## 2. Aturan Dasar Pengembangan (12 Aturan Baku Workflow)

Setiap agent atau pengembang yang mengerjakan tugas koding pada repositori ini **wajib mematuhi 12 aturan dasar berikut**:

1. **Pahami struktur project dan kode yang sudah ada sebelum mengedit:** Lakukan audit dan pembacaan kode aktual sebelum menyentuh file apa pun.
2. **Jangan membuat ulang fitur yang sudah tersedia:** Gunakan helper, hook, komponen, dan state yang sudah ada di codebase.
3. **Pertahankan desain Dark Forest Emerald:** Konsisten dengan palet warna dark emerald, styling Tailwind CSS, dan visual HUD yang sudah terbangun.
4. **Pertahankan seluruh fitur dan logika bisnis:** Jangan menghapus atau mengubah fungsionalitas yang sudah matang tanpa instruksi tertulis.
5. **Jangan mengubah RBAC, Geofence, Device Lock, dan Anti-Spoofing:** Fitur keamanan inti ini dilarang diubah kecuali ada instruksi khusus yang eksplisit.
6. **Gunakan TypeScript dengan tipe yang jelas:** Terapkan *strict typing*. Hindari penggunaan tipe `any`, cast tanpa validasi, atau variabel tanpa tipe.
7. **Hindari duplikasi kode dan komponen yang tidak diperlukan:** Pisahkan fungsi utilitas ke modul terisolasi atau hook reusable.
8. **Jangan mengubah banyak file jika tidak diperlukan:** Terapkan intervensi minimal (*surgical changes*) yang hanya menyasar akar masalah.
9. **Lakukan pengujian setelah perubahan:** Selalu jalankan validasi TypeScript (`npx tsc --noEmit`) dan build test (`npm run build`) setelah modifikasi.
10. **Laporkan file yang diubah dan hasil pengujian:** Berikan laporan transparan berisi daftar file, rincian teknis perubahan, dan bukti hasil test.
11. **Jangan melakukan Git commit atau push tanpa persetujuan pengguna:** Seluruh checkpoint commit harus dikonfirmasi oleh pengguna, dan `git push` ke remote dilarang keras.
12. **Jangan menjalankan perintah destruktif tanpa persetujuan:** Operasi yang menghapus data, mereset git secara permanen (`reset --hard`), atau menghapus dependensi dilarang dijalankan tanpa persetujuan eksplisit.

---

## 3. Memori Keputusan Arsitektur & Aturan Sistem (Domain Specific)

1. **Skema Persetujuan (Auto-Approval / Validasi Otomatis):**
   * Semua absensi yang memenuhi kriteria validasi (berada di dalam radius geofence kantor + lulus uji liveness wajah + skor kemiripan wajah AI >= threshold) akan **langsung otomatis disetujui (Status: `APPROVED`)**.
   * Karyawan langsung mendapatkan kepastian status kehadiran sah secara instan tanpa menunggu approval manual.
   * Tim HRD fokus pada monitoring real-time, audit rekapan, dan penanganan kasus anomali/izin khusus.
2. **Verifikasi Wajah & Anti-Spoofing (Level 4 AI):**
   * Wajib melalui uji **Liveness Detection** acak (kedip mata, senyum, tengok) sebelum foto absensi dikirim.
   * Menggunakan algoritma heuristik & WebRTC native yang ringan tanpa dependensi berat.
3. **Validasi Lokasi & Geofence:**
   * Menggunakan *Haversine Formula* untuk menghitung jarak ke titik koordinat kantor.
   * Tolak pengiriman absensi jika jarak melebihi batas radius kantor atau akurasi GPS terdeteksi palsu (*mock provider*).
4. **Integritas Waktu (Anti-Time Tampering):**
   * Jam absensi dicatat menggunakan format Server Time WITA (Waktu Indonesia Tengah / Bali, UTC+8) dan diisolasi agar tidak memicu re-render cascade ke seluruh view.
5. **Idempotensi & Keandalan Jaringan:**
   * Setiap request absensi (Check-in / Check-out) wajib menyertakan header `X-Idempotency-Key` (UUID) untuk mencegah *double-logging* saat jaringan lambat.
6. **Shift Kerja Dinamis:**
   * Pengikatan shift berbasis `shift_id` dan `work_date`, bukan semata-mata tanggal kalender (mendukung shift malam yang melewati tengah malam).

---

## 4. Standar Koding & Konvensi

* **Clean Architecture & Modularity:** Pisahkan antara *Presentation Layer*, *Business Logic/Context*, dan *Data Access Layer*.
* **Strict Typing:** Selalu definisikan interface/type lengkap di `src/types/index.ts`.
* **Defensive Programming:** Selalu tangani skenario *null/undefined*, timeout API, dan kegagalan izin browser (*Permission Denied*).
* **Kompresi Gambar:** Foto wajah wajib dikompresi di sisi klien menjadi < 300 KB sebelum dikirim ke backend.

---

## 5. Coding Workflow System & Skills Khusus Proyek

Proyek ini dilengkapi kumpulan **Agent Skills Antigravity** yang tersimpan di direktori `.agents/skills/`. Panggil skill ini menggunakan perintah slash command:

* `/kerja-terstruktur` — Standar umum pengerjaan koding terstruktur, terencana, dan aman.
* `/perbaiki-bug` — Investigasi akar masalah (RCA), perbaikan minimal (*surgical fix*), dan uji anti-regresi.
* `/refactor-kode` — Peningkatan struktur & modularitas kode tanpa mengubah perilaku atau tampilan UI.
* `/audit-kode` — Pemeriksaan menyeluruh (performa, lifecycle, keamanan) dalam mode *read-only* tanpa mengubah kode.
* `/uji-aplikasi` — Menjalankan uji TypeScript (`tsc`), Next.js production build, dan verifikasi alur fungsional.
* `/checkpoint-git` — Audit status perubahan lokal dan pembuatan commit terkonfirmasi (tanpa push ke GitHub).
* `/jacxbot` — Konsultan PRD & Arsitektur Sistem Interaktif untuk membedah ide dan edge cases.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
