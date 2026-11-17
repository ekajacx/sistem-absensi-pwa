---
name: perbaiki-bug
description: Prosedur investigasi akar masalah (Root Cause Analysis), perbaikan bug presisi (surgical fix), dan pengujian verifikasi regresi agar fitur kembali normal tanpa efek samping.
---

# /perbaiki-bug - Investigasi & Perbaikan Bug Presisi

Standar prosedur penanganan bug dan anomali kode secara akurat, minimal, dan bebas regresi.

---

## 1. Tujuan
Mengidentifikasi akar permasalahan teknis (*root cause*), menerapkan perbaikan presisi (*surgical fix*) tanpa merombak kode yang sudah berjalan baik, dan memastikan fitur terkait berfungsi normal kembali.

---

## 2. Prosedur Kerja

1. **Investigasi & Analisis Akar Masalah (*Root Cause Analysis*):**
   * Periksa deskripsi error, log konsol, atau perilaku anomali yang dilaporkan.
   * Telusuri alur kode sumber menggunakan `read_file` dan pencarian pola.
   * Bedakan antara "gejala di permukaan" (*symptom*) dan "akar penyebab sebenarnya" (*root cause*).

2. **Rancang Solusi Minimal (*Minimal Surgical Fix*):**
   * Rancang perbaikan yang hanya menyentuh titik masalah.
   * Hindari merombak file atau komponen lain yang tidak terlibat langsung.
   * Pertahankan interface, signature fungsi, dan tipe data yang sudah ada agar tidak memicu *breaking changes*.

3. **Terapkan Perbaikan (*Fix Implementation*):**
   * Edit berkas yang bermasalah secara presisi.
   * Tambahkan defensive handling (penanganan null/undefined, error boundary, fallback) bila relevan.

4. **Pengujian Verifikasi & Anti-Regresi (*Regression Testing*):**
   * Uji skenario yang sebelumnya memicu bug (pastikan sudah teratasi).
   * Uji skenario normal di sekitar fitur tersebut (pastikan tidak ada regresi).
   * Jalankan `cmd /c "npx tsc --noEmit"` dan `cmd /c "npm run build"`.

5. **Pelaporan Hasil (*Report*):**
   * Sajikan temuan akar masalah dan hasil uji sesuai format baku di bawah.

---

## 3. Batasan (Guardrails)
* Jangan melakukan refactoring besar-besaran saat memperbaiki bug.
* Jangan mengubah mock data, skema database, atau konfigurasi build.
* Jangan menyembunyikan error menggunakan `@ts-ignore` atau bypass type checking.
* Jangan commit atau push ke Git tanpa persetujuan pengguna.

---

## 4. Format Laporan Perbaikan Bug

```markdown
### Laporan Perbaikan Bug: <Judul Masalah>

1. **Gejala Masalah (*Symptom*):**
   - <apa yang error atau tidak berjalan semestinya>

2. **Akar Penyebab (*Root Cause*):**
   - <penjelasan teknis mengapa bug tersebut terjadi>

3. **Berkas & Titik Perbaikan:**
   - `<path/file>`: <baris atau fungsi yang diperbaiki>

4. **Solusi yang Diterapkan (*Surgical Fix*):**
   - <ringkasan kode/logika yang diperbarui>

5. **Hasil Uji Verifikasi & Regresi:**
   - Skenario Bug: <Teratasi>
   - Skenario Fitur Terkait: <Normal / Bebas Regresi>
   - TypeScript Check: <0 Error>
   - Production Build: <Sukses>
```
