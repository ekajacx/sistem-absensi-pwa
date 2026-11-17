---
name: kerja-terstruktur
description: Standar alur kerja pengembangan dan implementasi fitur/perubahan secara terstruktur, terencana, aman, dan hemat token sesuai AGENTS.md.
---

# /kerja-terstruktur - Workflow Coding Terstruktur

Standar alur kerja resmi untuk mengeksekusi tugas pengembangan atau modifikasi fitur dengan presisi tinggi dan minim risiko.

---

## 1. Tujuan
Memastikan setiap pekerjaan koding dieksekusi secara terencana, mempertahankan integritas sistem (desain *Dark Forest Emerald*, RBAC, Geofence, Device Lock, Anti-Spoofing), dan menghasilkan kode yang lolos pengujian tanpa regresi.

---

## 2. Prosedur Kerja

1. **Pahami Permintaan & Audit Awal (*Inspect*):**
   * Baca spesifikasi tugas pengguna secara menyeluruh.
   * Periksa file terkait menggunakan `read_file` atau pencarian teks (`git grep`).
   * Pahami data flow dan dependensi komponen sebelum melakukan perubahan.

2. **Tentukan Ruang Lingkup & Rencana Singkat (*Scope & Plan*):**
   * Tetapkan batasan perubahan seminimal mungkin (*surgical scope*).
   * Buat daftar langkah konkret yang akan dikerjakan.
   * Jika perubahan berdampak luas atau berisiko tinggi (misal: struktur context inti atau schema data), **tampilkan rencana dan minta persetujuan pengguna sebelum memulai koding**.

3. **Implementasi Bertahap (*Implement*):**
   * Lakukan perubahan kode secara modular dan berurutan.
   * Terapkan strict typing TypeScript (hindari `any`).
   * Pertahankan konsistensi gaya visual *Dark Forest Emerald*.

4. **Pengujian & Verifikasi (*Verify*):**
   * Jalankan pemeriksaan tipe: `cmd /c "npx tsc --noEmit"`.
   * Jalankan build produksi: `cmd /c "npm run build"`.
   * Pastikan tidak ada runtime regression atau hydration warning.

5. **Pelaporan Terstruktur (*Report*):**
   * Sajikan laporan akhir menggunakan format baku di bawah.

---

## 3. Batasan (Guardrails)
* Wajib mematuhi 12 Aturan Baku di `AGENTS.md`.
* Jangan melakukan refactoring di luar lingkup tugas yang diminta.
* Jangan mengubah logika RBAC, Geofence, Device Lock, atau Anti-Spoofing tanpa instruksi khusus.
* Dilarang menjalankan `git commit` atau `git push` tanpa persetujuan pengguna.
* Dilarang menjalankan perintah destruktif (penghapusan dependensi, file, atau branch).

---

## 4. Format Laporan Akhir

```markdown
### Laporan Pekerjaan Terstruktur: <Nama Tugas/Fitur>

1. **Berkas yang Diubah/Dibuat:**
   - `<path/file>`: <ringkasan perubahan>

2. **Rincian Implementasi:**
   - <penjelasan poin-poin perubahan teknis>

3. **Hasil Pengujian:**
   - TypeScript Check (`tsc`): <Lolos (0 error) / Gagal>
   - Production Build (`npm run build`): <Sukses / Gagal>
   - Verifikasi Fungsional: <Hasil uji alur terkait>

4. **Catatan & Rekomendasi Selanjutnya:**
   - <langkah atau verifikasi lanjutan yang disarankan>
```
