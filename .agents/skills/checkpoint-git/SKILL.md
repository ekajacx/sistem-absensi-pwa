---
name: checkpoint-git
description: Prosedur audit status Git lokal, pemeriksaan berkas yang berubah, dan pembuatan commit checkpoint lokal secara aman hanya setelah persetujuan pengguna (tanpa git push).
---

# /checkpoint-git - Audit & Pembuatan Checkpoint Git Lokal

Standar prosedur version control lokal untuk mengamankan riwayat progres koding secara disiplin dan aman.

---

## 1. Tujuan
Memeriksa status working tree repositori lokal, mengidentifikasi berkas yang dimodifikasi, dan membuat commit checkpoint lokal yang rapi **hanya setelah disetujui secara eksplisit oleh pengguna**, tanpa pernah melakukan push ke remote GitHub.

---

## 2. Prosedur Kerja

1. **Audit Status Git Lokal (*Status & Diff Audit*):**
   * Jalankan `git status` untuk memeriksa status working tree, staged files, dan untracked files.
   * Jalankan `git diff --stat` untuk melihat ringkasan baris yang ditambah/dikurangi.

2. **Pemeriksaan Berkas Sensitif & Liar (*Hygiene Check*):**
   * Pastikan tidak ada file rahasia (`.env`, credential keys, password).
   * Pastikan tidak ada berkas build temporary atau cache yang tidak sengaja terbawa.

3. **Tampilkan Ringkasan & Minta Persetujuan Pengguna (*User Approval Gate*):**
   * Paparkan daftar berkas yang akan dimasukkan ke dalam commit.
   * Ajukan draf pesan commit (*Conventional Commit message*).
   * **Wajib menunggu persetujuan eksplisit pengguna sebelum mengeksekusi `git add` dan `git commit`.**

4. **Eksekusi Commit Lokal (*Local Commit Only*):**
   * Setelah disetujui pengguna, jalankan `git add <file>` dan buat commit lokal:
     ```bash
     git commit -m "<tipe>: <deskripsi singkat>"
     ```
   * Verifikasi commit tercatat dengan `git log -n 1 --oneline`.

5. **Pelaporan Status Commit (*Report*):**
   * Tampilkan hash commit lokal dan pesan yang baru dibuat.

---

## 3. Batasan (Guardrails)
* **DILARANG KERAS MENJALANKAN `git push` KE REMOTE / GITHUB.**
* Dilarang menjalankan commit otomatis tanpa konfirmasi dan persetujuan pengguna.
* Dilarang menjalankan perintah destruktif (`git reset --hard`, `git restore .`, `git clean -fd`) tanpa instruksi eksplisit.
* Hanya beroperasi pada branch lokal yang sedang aktif.

---

## 4. Format Laporan Checkpoint Git

```markdown
### Laporan Checkpoint Git Lokal

1. **Status Working Tree:**
   - Branch Aktif: `<nama-branch>`
   - Berkas Staged/Committed:
     * `<file-1>` (+X / -Y baris)
     * `<file-2>` (+X / -Y baris)

2. **Rincian Commit Checkpoint Lokal:**
   - Commit Hash: `<misal: a1b2c3d>`
   - Pesan Commit: `<tipe: deskripsi pesan>`
   - Waktu: <timestamp lokal>

3. **Status Remote:**
   - Push Status: **OFFLINE / LOCAL ONLY** (Tidak ada kode yang dikirim ke remote GitHub).
```
