---
name: uji-aplikasi
description: Prosedur verifikasi kualitas menyeluruh mencakup validasi tipe TypeScript (tsc), Next.js production build, linter, dan pengujian alur fungsional kritis.
---

# /uji-aplikasi - Validasi & Pengujian Menyeluruh

Standar pengujian integritas aplikasi sebelum kode dinyatakan selesai atau siap dibuatkan checkpoint.

---

## 1. Tujuan
Memastikan seluruh komponen bebas dari kesalahan kompilasi tipe data (*type safety*), mampu di-generate secara sukses ke berkas statis produksi (*production build*), dan seluruh logika bisnis inti (absensi, kamera, geofence, RBAC) berfungsi normal.

---

## 2. Prosedur Kerja

1. **Pemeriksaan Tipe Data TypeScript (*Typecheck*):**
   * Jalankan: `cmd /c "npx tsc --noEmit"` (atau `npx tsc --noEmit`).
   * Pastikan output exit code adalah 0 dan tidak ada kesalahan tipe interface atau destructuring.

2. **Kompilasi Build Produksi (*Production Build*):**
   * Jalankan: `cmd /c "npm run build"`.
   * Periksa apakah prerendering static routes (SSG/Partial Prerendering) berjalan sukses tanpa runtime error (seperti `new Date()` tak terisolasi pada render pass client component).
   * Catat durasi kompilasi dan ukuran bundle.

3. **Pemeriksaan Linting (*Linter Check*):**
   * Jalankan `npm run lint` jika dependensi linter aktif dan terkonfigurasi.

4. **Verifikasi Fungsional Kritis (*Sanity Check*):**
   * Periksa status isolasi jam (tidak memicu re-render massal).
   * Periksa lifecycle stream kamera (tertutup rapi saat unmount / pindah menu).
   * Periksa keutuhan logika Geofence (Haversine formula), Device Lock, dan Level 4 Anti-Spoofing.

5. **Pelaporan Status Transparan (*Report*):**
   * Laporkan hasil uji secara ringkas dan objektif sesuai format baku di bawah.

---

## 3. Batasan (Guardrails)
* Jangan langsung memodifikasi kode jika menemukan kegagalan tes; identifikasi letak masalah dan laporkan secara transparan.
* Jangan memotong atau mem-bypass tahap build produksi.
* Dilarang menjalankan Git push ke remote repository.

---

## 4. Format Laporan Hasil Pengujian

```markdown
### Laporan Hasil Pengujian Aplikasi: <Target Pengujian>

1. **Hasil Kompilasi TypeScript (`tsc --noEmit`):**
   - Status: <Lolos (0 Error) / Gagal>
   - Detail: <rincian error jika ada>

2. **Hasil Kompilasi Produksi (`npm run build`):**
   - Status: <Sukses / Gagal>
   - Halaman Statis: <Rute yang berhasil di-generate>
   - Durasi Kompilasi: <misal: 678 ms>

3. **Hasil Verifikasi Fungsional Kritis:**
   - [x] Jam Server Topbar: Berjalan normal & terisolasi
   - [x] Kamera Fisik: Buka/tutup normal & auto-stop saat ganti menu
   - [x] Level 4 AI Anti-Spoofing & Geofence: Utuh 100%
   - [x] RBAC & Multi-Role Perspective: Berfungsi normal

4. **Kesimpulan Kesiapan:**
   - Status: <READY FOR CHECKPOINT / BLOCKED>
```
