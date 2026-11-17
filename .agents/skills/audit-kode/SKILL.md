---
name: audit-kode
description: Mode audit read-only untuk mengevaluasi kualitas kode, performa, re-render cascade, memory/resource leaks, arsitektur, dan keamanan tanpa mengubah kode apapun.
---

# /audit-kode - Audit Kualitas & Kesehatan Kode (Read-Only)

Standar pemeriksaan kode statis dan arsitektural secara objektif, mendalam, dan strictly *read-only*.

---

## 1. Tujuan
Mendeteksi potensi celah bug, kebocoran memori/hardware stream, pemborosan komputasi (*re-render cascade*), pelanggaran batas arsitektur, dan inkonsistensi kode tanpa melakukan perubahan file apa pun.

---

## 2. Prosedur Kerja

1. **Pemindaian Kode Sumber (*Read-Only Inspection*):**
   * Pindai file target atau seluruh codebase menggunakan `read_file` dan utilitas pencarian.
   * Periksa implementasi context, hook, event handler, dan lifecycle effect.
   * **DILARANG menggunakan alat edit (`write_file`, `edit_file`) selama proses audit.**

2. **Analisis Berdasarkan 4 Kategori Utama:**
   * **1. Performa (Performance):** Deteksi re-render yang tidak perlu, penggunaan timer global tak terisolasi, perhitungan komputasi berat tanpa memoization, atau bundle bloat.
   * **2. Fungsional & Lifecycle:** Deteksi potensi kebocoran resource (kamera, interval, WebSocket, object URL yang tidak di-revoke), unhandled null/undefined, dan unhandled unmount edge cases.
   * **3. Arsitektur & Kerapian:** Deteksi komponen raksasa (*monolithic file*), duplikasi kode, ketergantungan sirkular, dan tipe data `any`.
   * **4. UI/UX & Responsivitas:** Deteksi layout overflow pada mobile viewport (< 768px), aksesibilitas dasar, dan inkonsistensi styling tema *Dark Forest Emerald*.

3. **Klasifikasi Tingkat Risiko (*Risk Prioritization*):**
   * **High:** Bug hardware/resource leak, crash aplikasi, atau degradasi performa masif.
   * **Medium:** Masalah modularitas (file terlalu besar), UI glitch mobile, atau dialog konfirmasi tidak standar.
   * **Low:** Unused package dependency, un-revoked blob URL minor, atau inkonsistensi penamaan kecil.

4. **Penyusunan Rekomendasi Solusi & Matriks Pengerjaan:**
   * Rangkum temuan ke dalam tabel matriks terstruktur.
   * Berikan rekomendasi langkah perbaikan konkret untuk setiap temuan tanpa langsung mengedit kode.

---

## 3. Batasan (Guardrails)
* **STRICT READ-ONLY:** Jangan membuat, mengedit, atau menghapus berkas apa pun selama audit.
* Jangan menjalankan proses modifikasi dependensi atau build destruktif.
* Jangan membuat commit atau branch baru di Git.
* Seluruh output audit murni disajikan sebagai dokumen laporan ke pengguna.

---

## 4. Format Laporan Audit Kode

```markdown
### Laporan Frontend Quality Audit (Read-Only)

> **Catatan:** Sesuai standar mode audit, tidak ada baris kode yang diubah. Seluruh kode project tetap utuh.

#### 1. Ringkasan Status Keseluruhan
- Kelengkapan Fitur: <100% Utuh / Terindikasi Hilang>
- Kompilasi TypeScript (`tsc`): <0 Error / X Error>
- Status Produksi (`next build`): <Sukses / Gagal>
- Status Arsitektur & Performa: <Sehat / Perlu Optimasi>

#### 2. Temuan Masalah Berdasarkan Kategori
* **[PERF-01] <Judul Masalah>**
  - Prioritas: <High / Medium / Low>
  - File Terdampak: `<path/file>`
  - Deskripsi & Dampak: <penjelasan detail>
  - Rekomendasi Perbaikan: <solusi teknis terarah>

* **[FUNC-01] <Judul Masalah>**
  - Prioritas: <High / Medium / Low>
  - File Terdampak: `<path/file>`
  - Deskripsi & Dampak: <penjelasan detail>
  - Rekomendasi Perbaikan: <solusi teknis terarah>

#### 3. Matriks Rekomendasi & Urutan Pengerjaan
- [Tahap 1: Urgent Performance & Hardware Bug] -> <daftar ID>
- [Tahap 2: Modularisasi Arsitektur] -> <daftar ID>
- [Tahap 3: Polishing UI/UX & Clean-up] -> <daftar ID>
```
