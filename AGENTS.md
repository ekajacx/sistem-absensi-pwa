# Project Memory & Agent Guidelines: Sistem Absensi Geolokasi & Wajah (PWA)

File ini adalah **sumber kebenaran tunggal (*Single Source of Truth*)** untuk semua AI Agent (Antigravity, Codex, Cursor, Claude Code) dan anggota tim pengembang yang bekerja pada repositori ini.

---

## 1. Ringkasan Proyek & Referensi Utama
* **Nama Proyek:** Sistem Absensi Karyawan PWA (Geolokasi & Liveness Face Recognition)
* **Dokumen Acuan:** Wajib membaca dan mematuhi spesifikasi di [PRD_Sistem_Absensi.md](./PRD_Sistem_Absensi.md).
* **Target Pengguna:** Karyawan (Mobile PWA) & Tim HRD (Admin Web Dashboard).

---

## 2. Memori Keputusan Arsitektur & Aturan Sistem (Wajib Dipatuhi)

Setiap agent atau developer yang menulis kode untuk fitur baru harus mematuhi aturan berikut:

1. **Skema Persetujuan (Auto-Approval / Validasi Otomatis):**
   * Semua absensi yang memenuhi kriteria validasi (berada di dalam radius geofence kantor + lulus uji liveness wajah + skor kemiripan wajah AI >= threshold) akan **langsung otomatis disetujui (Status: `APPROVED`)**.
   * Karyawan langsung mendapatkan kepastian status kehadiran sah secara instan tanpa menunggu approval manual.
   * Tim HRD tidak perlu menyetujui absensi harian satu per satu, melainkan fokus pada monitoring dashboard real-time, audit rekapan, dan penanganan kasus anomali/izin khusus.
2. **Verifikasi Wajah & Anti-Spoofing:**
   * Wajib melalui uji **Liveness Detection** (kedipan mata/senyum acak) sebelum foto dikirim.
   * Wajib melakukan pencocokan 1:1 (*Face Matching*) terhadap *Face Master Profile* karyawan.
3. **Validasi Lokasi & Geofence:**
   * Menggunakan *Haversine Formula* untuk menghitung jarak ke titik koordinat kantor.
   * Tolak pengiriman absensi jika jarak melebihi batas radius kantor atau akurasi GPS terlalu rendah/terdeteksi *mock provider*.
4. **Integritas Waktu (Anti-Time Tampering):**
   * Jam absensi **wajib** dicatat dari Server NTP Timestamp di backend, bukan dari jam lokal browser pengguna.
5. **Idempotensi & Keandalan Jaringan:**
   * Setiap request absensi (Check-in / Check-out) wajib menyertakan header `X-Idempotency-Key` (UUID) untuk mencegah *double-logging* saat jaringan lambat.
6. **Shift Kerja Dinamis:**
   * Pengikatan shift berbasis `shift_id` dan `work_date`, bukan semata-mata tanggal kalender (untuk mendukung shift malam yang melewati tengah malam).

---

## 3. Standar Koding & Konvensi

* **Clean Architecture & Modularity:** Pisahkan antara *Presentation Layer*, *Business Logic/Service*, dan *Data Access Layer*.
* **Strict Typing:** Selalu gunakan tipe data ketat (TypeScript / Python type hints / Go struct). Hindari tipe `any`.
* **Defensive Programming:** Selalu tangani skenario *null/undefined*, timeout API, dan kegagalan izin browser (*Permission Denied*).
* **Kompresi Gambar:** Foto wajah wajib dikompresi di sisi klien menjadi < 300 KB sebelum dikirim ke backend API.

---

## 4. Skills & Bot Khusus Proyek
Repositori ini dilengkapi dengan skill **JacxBot** yang terletak di [.agents/skills/jacxbot/SKILL.md](./.agents/skills/jacxbot/SKILL.md).
* Siapa pun anggota tim yang membuka project ini di Antigravity dapat langsung memanggil:
  ```text
  /jacxbot <pertanyaan atau fitur baru>
  ```
  untuk melakukan konsultasi fitur, audit celah bug, dan perancangan modul baru.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
