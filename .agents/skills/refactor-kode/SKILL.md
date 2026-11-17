---
name: refactor-kode
description: Standar refactoring dan pemecahan modularitas kode untuk meningkatkan kebersihan, performa, dan kemudahan pemeliharaan tanpa mengubah tampilan, fitur, atau perilaku aplikasi.
---

# /refactor-kode - Refactoring & Modularisasi Bersih

Standar prosedur restrukturisasi kode untuk meningkatkan modularitas dan performa dengan jaminan 100% *Zero Behavior Change*.

---

## 1. Tujuan
Meningkatkan keterbacaan (*readability*), modularitas komponen monolitik, efisiensi render, dan kemudahan pemeliharaan (*maintainability*) tanpa mengubah tampilan visual (*Dark Forest Emerald*), output data, atau alur logika bisnis.

---

## 2. Prosedur Kerja

1. **Audit Kondisi Awal (*Baseline Check*):**
   * Pastikan build awal berjalan sukses (`cmd /c "npm run build"`).
   * Petakan struktur komponen, state, props, dan event handler yang akan dimodularisasi.

2. **Rencana Pemecahan Modul (*Modular Breakdown Plan*):**
   * Tentukan hierarki komponen baru (misal memecah file modal monolitik menjadi sub-komponen di `src/components/modals/`).
   * Tentukan penempatan interface/tipe bersama agar tidak terjadi sirkular dependensi.
   * Pertahankan penamaan props dan fungsi context agar kompatibel ke belakang.

3. **Eksekusi Bertahap (*Incremental Refactoring*):**
   * Ekstrak sub-komponen satu per satu.
   * Buat file agregator bersih yang mengekspor atau merangkum sub-komponen tersebut.
   * Jangan mengubah logika kalkulasi, format teks, atau kelas CSS Tailwind yang sudah ada.

4. **Verifikasi Integritas Tampilan & Perilaku (*Behavior Verification*):**
   * Pastikan semua props dan event handler tersambung dengan benar ke parent context.
   * Pastikan visual antarmuka tetap identik 100% dengan desain aslinya.
   * Jalankan `cmd /c "npx tsc --noEmit"` dan `cmd /c "npm run build"`.

5. **Pelaporan Hasil (*Report*):**
   * Sajikan daftar komponen sebelum dan sesudah refactoring sesuai format baku di bawah.

---

## 3. Batasan (Guardrails)
* **Zero Behavior Change:** Dilarang menambah, mengubah, atau menghapus fitur bisnis yang sudah ada.
* Dilarang mengubah skema data mock, context API contracts, atau nama handler utama.
* Dilarang mengubah tema estetika *Dark Forest Emerald*.
* Jangan melakukan Git commit atau push tanpa persetujuan pengguna.

---

## 4. Format Laporan Refactor Kode

```markdown
### Laporan Refactor Kode: <Nama Modul/Komponen>

1. **Tujuan Refactoring:**
   - <alasan pemecahan: modularitas, ukuran file, eliminasi duplikasi>

2. **Perubahan Struktur Berkas:**
   - Berkas Awal: `<path/file>` (<ukuran awal, misal ~2.000 baris>)
   - Berkas Hasil Modularisasi:
     * `<path/sub-file-1>`: <tanggung jawab komponen>
     * `<path/sub-file-2>`: <tanggung jawab komponen>
     * `<path/aggregator>`: <komponen aggregator bersih>

3. **Jaminan Integritas Fungsional & UI:**
   - Desain & Tampilan Visual: <100% Identik>
   - Logika Bisnis & State: <Tidak berubah>

4. **Hasil Pengujian Kompilasi:**
   - TypeScript Check: <0 Error>
   - Production Build: <Sukses>
```
