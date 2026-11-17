# Product Requirements Document (PRD)
## Sistem Absensi Online Berbasis Geolokasi & Deteksi Wajah (PWA)
### [Revisi: Sistem Auto-Approval Otomatis]

---

### Informasi Dokumen
* **Nama Proyek:** Sistem Absensi Karyawan PWA (Geolokasi & Liveness Face Recognition)
* **Versi:** 1.1.0 (Revisi: Auto-Approval Kehadiran)
* **Status:** Ready for Development / Approved
* **Tanggal Penyusunan:** 17 November 2026
* **Penyusun:** JacxBot (Principal PM & Lead System Architect)
* **Target Platform:** Progressive Web App (PWA) - Mobile & Desktop Browser

---

## 1. Ringkasan Eksekutif & Latar Belakang

### 1.1 Masalah Bisnis
Sistem pencatatan kehadiran konvensional (seperti mesin sidik jari fisik atau form manual) memiliki sejumlah kendala:
1. **Antrean Fisik:** Menumpuknya antrean karyawan pada jam sibuk di dekat mesin absensi.
2. **Kecurangan Kehadiran (*Buddy Punching*):** Titip absen melalui rekan kerja atau manipulasi posisi GPS saat absensi online sederhana.
3. **Fleksibilitas Shift Kerja:** Kebutuhan operasional kantor dengan sistem kerja bergilir (Pagi, Siang, Malam) yang jam kerjanya dinamis dan perlu diatur secara mandiri oleh tim HRD.
4. **Beban Kerja HRD (*Bottleneck Manual Approval*):** Memverifikasi dan menyetujui absensi harian ratusan karyawan secara manual satu per satu sangat tidak efisien dan memperlambat pencatatan payroll.

### 1.2 Solusi
Membangun aplikasi web berbasis **Progressive Web App (PWA)** yang dapat diakses langsung melalui browser smartphone tanpa instalasi toko aplikasi (Play Store/App Store). Sistem mengombinasikan:
* **Validasi Geolokasi Presisi (Geofence):** Mengunci koordinat karyawan hanya dalam radius kantor yang ditentukan.
* **Deteksi Wajah 1:1 + Liveness Test:** Pengujian kedipan/senyuman acak untuk mencegah *photo spoofing* dan pencocokan AI dengan foto master profil karyawan.
* **Mesin Persetujuan Otomatis (*Auto-Approval Engine*):** Jika seluruh parameter absensi valid (di dalam radius kantor + lulus uji liveness + skor kemiripan wajah AI memenuhi ambang batas), sistem **seketika mengesahkan kehadiran karyawan dengan status `APPROVED` (Hadir Sah)**. Karyawan langsung menerima kepastian tanpa menunggu approval manual HRD.
* **Dashboard Monitoring HRD & Shift Dinamis:** Admin HRD fokus memantau dashboard kehadiran real-time, mengelola jam shift dinamis, dan hanya menangani kasus khusus (izin/dispensasi).

---

## 2. Alur Kerja Aplikasi di Sisi Pengguna (User Workflow Detail)

Alur kerja karyawan (*User*) dirancang *mobile-first* dengan langkah-langkah presisi sebagai berikut:

```
[Buka PWA] 
    └──> [Izin Lokasi & Kamera] 
            └──> [Pengecekan Geofence] 
                    └──> [Uji Liveness Wajah] 
                            └──> [Kirim Data Absen] 
                                    └──> [Validasi Otomatis] ──> [Status: APPROVED / HADIR]
```

### 2.1 Pendaftaran & Profil Wajah Pertama Kali (*Enrollment*)
1. Karyawan login menggunakan NIK / Email dan Kata Sandi sementara yang diberikan HRD.
2. Sistem mendeteksi bahwa karyawan belum memiliki *Face Master Profile*.
3. Karyawan diarahkan ke halaman pendaftaran wajah:
   * Mengambil 3 sampel foto wajah dari sudut lurus dengan pencahayaan cukup.
   * Sistem mengekstraksi *face vector embeddings* dan mengunggah foto master ke penyimpanan aman.
   * Status profil wajah otomatis aktif setelah verifikasi kualitas foto.

### 2.2 Alur Absensi Masuk (*Check-In*)
1. **Akses Dashboard Karyawan:**
   * Karyawan membuka PWA pada smartphone.
   * Layar menampilkan informasi tanggal hari ini, shift kerja yang aktif, serta status kehadiran saat ini.
2. **Inisialisasi Sensor Perangkat (Kamera & GPS):**
   * PWA meminta izin browser untuk mengakses `Geolocation API` dan `MediaDevices.getUserMedia` (Kamera Depan).
   * Jika izin ditolak, sistem menampilkan panduan visual instruksi cara mengaktifkan izin di pengaturan browser.
3. **Validasi Geofence (Radius Lokasi Kantor):**
   * PWA mengambil titik koordinat GPS (`latitude`, `longitude`, `accuracy`).
   * Sistem menghitung jarak ke titik kantor menggunakan rumus *Haversine Formula*.
   * **Jika jarak > radius kantor:** Tombol absen dinonaktifkan (*disabled*) dan muncul pesan peringatan: *"Anda berada di luar radius kantor (Jarak: X meter. Maksimum: Y meter)"*.
   * **Jika jarak <= radius kantor:** Tombol absen aktif dan kamera otomatis dinyalakan.
4. **Pengujian Keaslian Wajah (*Liveness Detection*):**
   * Pengguna diminta memposisikan wajah di dalam bingkai oval di layar.
   * Sistem memberikan instruksi acak (misal: *"Kedipkan mata Anda"* atau *"Buka mulut sedikit"*).
   * Algoritma mendeteksi pergerakan wajah alami untuk memastikan pengguna bukan mengarahkan kamera ke foto cetak atau layar perangkat lain.
5. **Pengambilan Foto & Ekstraksi Kecocokan (1:1 Face Matching):**
   * Sistem mengambil frame foto terbaik saat liveness terpenuhi.
   * Model AI mencocokkan wajah saat ini dengan *Face Master Profile*.
   * Skor kemiripan (*similarity confidence score*) dihitung (misal: 94.5%).
6. **Pengiriman Data (*Payload Submission*):**
   * Foto dikompresi di sisi browser (< 300 KB).
   * Data dikirim ke backend API: ID User, ID Shift, Koordinat GPS, Foto Selfie, Skor Kemiripan AI, serta *Idempotency Key* untuk mencegah klik ganda.
   * Waktu absensi dicatat menggunakan **Server NTP Timestamp** (bukan jam lokal HP).
7. **Persetujuan Otomatis (*Instant Auto-Approval*):**
   * Backend memverifikasi: `Jarak <= Radius Kantor` DAN `Liveness == True` DAN `Face Score >= 80%`.
   * **Jika semua valid:** Sistem seketika menyimpan absensi dengan status **`APPROVED`** (Hadir).
   * Karyawan langsung melihat notifikasi sukses:  
     🎉 *"Absensi Masuk Berhasil! Status: Terverifikasi (Hadir Tepat Waktu / Terlambat X Menit)."*

### 2.3 Alur Absensi Pulang (*Check-Out*)
* Mengikuti prosedur yang identik dengan Check-In (validasi radius kantor + verifikasi wajah liveness).
* Waktu check-out dicatat dan langsung berstatus terverifikasi pada record kehadiran yang sama.

### 2.4 Monitoring Riwayat Kehadiran
* Karyawan dapat memantau status absensi di menu **Riwayat Kehadiran**:
  * Tag Hijau: **`APPROVED`** (Hadir sah terverifikasi otomatis oleh sistem).
  * Tag Merah: **`REJECTED`** (Gagal verifikasi wajah atau di luar lokasi).
  * Tag Biru: **`DISPENSATION`** (Disetujui khusus oleh HRD untuk dinas luar/izin).

---

## 3. Alur Kerja Aplikasi di Sisi Admin HRD (Admin Workflow Detail)

Karena absensi berjalan otomatis, tim HRD tidak dibebani pekerjaan approval manual harian dan dapat fokus pada monitoring serta konfigurasi sistem.

### 3.1 Manajemen Pengaturan Kantor & Geofence
1. Admin membuka menu **Master Data > Lokasi Kantor**.
2. Admin menentukan titik pusat kantor pada peta interaktif (Latitude & Longitude).
3. Admin menentukan parameter radius toleransi (misalnya: 50 meter) dan akurasi GPS maksimum yang diterima (misal: akurasi < 20 meter untuk mencegah Fake GPS).

### 3.2 Manajemen Shift Kerja Dinamis
Admin memiliki kontrol penuh untuk menentukan jam kerja sesuai kebutuhan operasional:
1. Admin membuka menu **Master Data > Pengaturan Shift**.
2. Admin dapat membuat shift baru (misal: Shift Pagi, Shift Siang, Shift Malam) dengan parameter:
   * **Nama Shift:** (Contoh: *"Shift Pagi - Operasional"*).
   * **Jam Masuk:** (Contoh: `07:00`).
   * **Jam Pulang:** (Contoh: `15:00`).
   * **Batas Toleransi Keterlambatan (*Grace Period*):** (Contoh: `15 menit` setelah jam masuk).
   * **Jendela Absen Dibuka:** (Contoh: `60 menit` sebelum jam masuk).
3. Admin menetapkan jadwal shift ke karyawan secara individu atau per divisi.

### 3.3 Dashboard Monitoring Kehadiran Real-Time (Tanpa Approval Manual)
1. **Ringkasan Statistik Harian:**
   * Kartu ringkasan: Total Karyawan, Jumlah Hadir Tepat Waktu, Jumlah Terlambat, dan Karyawan Belum Hadir.
2. **Tabel Log Kehadiran Real-Time:**
   * Setiap kali karyawan absen, data langsung muncul di tabel dashboard secara live.
   * Kolom tabel: Nama Karyawan, Shift, Jam Masuk, Skor Kecocokan AI (misal 94%), Jarak ke Kantor (misal 12 meter), dan Foto Selfie (bisa diklik untuk audit visual).
3. **Pemberian Dispensasi / Izin Khusus (Jika Diperlukan):**
   * Jika ada karyawan yang harus dinas luar, sakit, atau mengalami kendala perangkat, HRD dapat menginput izin atau memberikan status **`DISPENSATION`** secara manual melalui dashboard.

### 3.4 Rekapitulasi & Audit Trail
* **Menu Laporan:** Filter per tanggal, per shift, dan per divisi untuk melihat persentase kehadiran, jumlah keterlambatan, dan jam kerja efektif. Ekspor data ke Excel (XLSX) dan PDF untuk keperluan penggajian (*payroll*).
* **Audit Trail Log:** Mencatat jejak digital sistem dan admin (waktu pencatatan server, IP address, perubahan shift).

---

## 4. Diagram Alur Sistem (Flowchart)

Diagram alir berikut menggambarkan proses absensi instan dengan validasi otomatis:

```mermaid
flowchart TD
    Start(["Karyawan Buka PWA"]) --> CheckAuth{"Sudah Login?"}
    CheckAuth -- "Tidak" --> PageLogin["Halaman Login"] --> CheckAuth
    CheckAuth -- "Ya" --> GetSensors["Browser Request: Izin GPS & Kamera"]
    
    GetSensors --> CheckPerm{"Izin Diberikan?"}
    CheckPerm -- "Tidak" --> ErrorPerm["Tampilkan Panduan Izin Browser"]
    CheckPerm -- "Ya" --> FetchGPS["Ambil Koordinat GPS Karyawan"]
    
    FetchGPS --> CalcDistance["Hitung Jarak ke Geofence Kantor (Haversine)"]
    CalcDistance --> CheckRadius{"Jarak <= Radius Kantor?"}
    CheckRadius -- "Tidak" --> ErrorRadius["Tolak: Di Luar Jarak Kantor"]
    
    CheckRadius -- "Ya" --> OpenCam["Buka Kamera Depan PWA"]
    OpenCam --> LivenessTest["Jalankan Uji Liveness (Kedip / Gerak Acak)"]
    LivenessTest --> LivenessPassed{"Liveness Valid?"}
    LivenessPassed -- "Tidak / Timeout" --> ErrorLive["Gagal Uji Liveness, Coba Lagi"]
    
    LivenessPassed -- "Ya" --> CaptureFrame["Ambil Foto Wajah & Ekstrak Fitur"]
    CaptureFrame --> MatchFace["Hitung AI Similarity Score vs Foto Master"]
    
    MatchFace --> CheckAllValid{"Semua Data Valid?\n(Jarak OK + Liveness OK + AI Score >= 80%)"}
    
    CheckAllValid -- "Tidak" --> RejectFail["Tolak Absensi: Data Tidak Sesuai"]
    
    CheckAllValid -- "Ya" --> SaveApproved[("Simpan Database: Status = APPROVED (Auto)")]
    SaveApproved --> ShowUserSuccess["Tampilan Karyawan:\nSukses Terverifikasi (Hadir Sah)"]
    SaveApproved --> UpdateDashboard["Live Update Dashboard Monitoring HRD"]
```

---

## 5. Entity Relationship Diagram (ERD)

Struktur data mendukung validasi otomatis, multi-shift dinamis, profil wajah, dan audit pelaporan:

```mermaid
erDiagram
    USERS ||--o| FACE_PROFILES : "memiliki"
    USERS ||--o{ USER_SHIFTS : "dijadwalkan"
    SHIFTS ||--o{ USER_SHIFTS : "diterapkan_ke"
    SHIFTS ||--o{ ATTENDANCES : "menjadi_rujukan"
    USERS ||--o{ ATTENDANCES : "melakukan"
    USERS ||--o{ ATTENDANCES : "memberikan_dispensasi"
    OFFICE_LOCATIONS ||--o{ ATTENDANCES : "lokasi_target"
    USERS ||--o{ AUDIT_LOGS : "mencatat_aktivitas"

    USERS {
        uuid id PK
        string nik UK "Nomor Induk Karyawan"
        string full_name
        string email UK
        string password_hash
        string phone_number
        enum role "EMPLOYEE / HRD_ADMIN / SUPERADMIN"
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    FACE_PROFILES {
        uuid id PK
        uuid user_id FK UK
        string master_photo_url
        jsonb face_embeddings "Vector representasi wajah 128/512 dimensi"
        boolean is_verified
        datetime created_at
        datetime updated_at
    }

    OFFICE_LOCATIONS {
        uuid id PK
        string office_name
        decimal latitude
        decimal longitude
        int radius_meters "Contoh: 50 meter"
        int max_gps_accuracy_meters "Contoh: 20 meter"
        boolean is_active
        datetime created_at
    }

    SHIFTS {
        uuid id PK
        string shift_name "Contoh: Shift Pagi, Siang, Malam"
        time start_time "Contoh: 08:00:00"
        time end_time "Contoh: 17:00:00"
        int late_tolerance_minutes "Toleransi keterlambatan (Menit)"
        int open_before_minutes "Jendela absen buka sebelum jam masuk"
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    USER_SHIFTS {
        uuid id PK
        uuid user_id FK
        uuid shift_id FK
        date work_date "Tanggal berlakunya shift"
        datetime created_at
    }

    ATTENDANCES {
        uuid id PK
        uuid user_id FK
        uuid shift_id FK
        uuid office_location_id FK
        date attendance_date
        datetime check_in_time "Server timestamp"
        decimal check_in_lat
        decimal check_in_lng
        decimal check_in_distance_meters
        string check_in_photo_url
        decimal check_in_face_score "Skor kemiripan AI (0 - 100%)"
        boolean check_in_liveness_verified
        datetime check_out_time "Server timestamp"
        decimal check_out_lat
        decimal check_out_lng
        decimal check_out_distance_meters
        string check_out_photo_url
        decimal check_out_face_score
        boolean check_out_liveness_verified
        enum status "APPROVED / REJECTED / DISPENSATION"
        uuid approved_by FK "SYSTEM (null) atau ID Admin jika dispensasi"
        datetime approved_at
        string idempotency_key UK
        datetime created_at
        datetime updated_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK "Pelaku aksi"
        string action_name "Contoh: AUTO_APPROVE / UPDATE_SHIFT"
        string target_entity "Nama tabel terkait"
        uuid target_id "ID record terkait"
        jsonb old_values
        jsonb new_values
        string ip_address
        string user_agent
        datetime created_at
    }
```

---

## 6. Kebutuhan Fungsional & Non-Fungsional

### 6.1 Kebutuhan Fungsional (Functional Requirements)
* **FR-01 (PWA Compatibility):** Aplikasi web harus memiliki Service Worker dan Web App Manifest (`manifest.json`) agar dapat diinstal di homescreen smartphone (*Add to Home Screen*) dan beroperasi dalam mode *standalone*.
* **FR-02 (Hardware Sensor Integration):** PWA wajib mengakses GPS akurat (`enableHighAccuracy: true`) dan kamera depan secara langsung melalui browser.
* **FR-03 (Liveness Detection Engine):** Sistem mendeteksi respons kedipan atau gerakan kepala acak secara real-time di sisi browser sebelum foto diambil.
* **FR-04 (1:1 Face Verification):** Sistem menghitung jarak euklidian / cosine similarity antara vektor wajah saat ini dengan foto master profil; menghasilkan persentase skor kemiripan.
* **FR-05 (Instant Auto-Approval Engine):** Backend memverifikasi seluruh syarat kehadiran (Geofence + Liveness + Skor Wajah) dalam satu transaksi atomik dan langsung memberikan status `APPROVED`.
* **FR-06 (Dynamic Shift Engine):** Admin HRD dapat menambah, mengubah, mengaktifkan/menonaktifkan shift kerja (jam masuk, jam pulang, toleransi keterlambatan) kapan saja melalui antarmuka web.
* **FR-07 (Live Monitoring Dashboard):** Antarmuka dashboard admin untuk memantau kehadiran secara live (siapa yang hadir, terlambat, belum hadir) tanpa perlu klik tombol approval harian.
* **FR-08 (Reporting & Export):** Fitur unduh rekap absensi harian dan bulanan dalam format XLSX dan PDF untuk keperluan payroll.

### 6.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **NFR-01 (Integritas Waktu - Server NTP):** Jam absensi wajib menggunakan waktu server backend yang tersinkronisasi NTP, mengabaikan jam lokal perangkat browser.
* **NFR-02 (Performa Cepat):** Seluruh proses dari capture wajah hingga notifikasi sukses harus selesai dalam waktu **kurang dari 3 detik**.
* **NFR-03 (Keamanan Biometrik & Privasi Data):** Foto wajah disimpan pada cloud storage privat (*presigned URL* berdurasi terbatas). Vektor biometrik dienkripsi dalam database sesuai prinsip perlindungan data pribadi (UU PDP).
* **NFR-04 (Keandalan Jaringan & Idempotensi):** Implementasi *Idempotency Key* untuk memastikan tidak ada data ganda saat jaringan lemot.

---

## 7. User Stories & Acceptance Criteria (Gherkin Format)

### US-01: Absensi Masuk Otomatis Disetujui (Auto-Approved)
* **Sebagai** Karyawan,  
* **Saya ingin** melakukan absen masuk melalui browser HP menggunakan verifikasi wajah dan GPS,  
* **Agar** kehadiran saya langsung sah tercatat otomatis tanpa harus menunggu persetujuan HRD.

```gherkin
Scenario: Absensi masuk memenuhi syarat dan langsung disetujui otomatis
  Given Karyawan telah login di PWA dan berada di dalam radius 50 meter kantor
  And Karyawan memiliki Face Master Profile yang terverifikasi
  When Karyawan membuka menu absen masuk dan berhasil menyelesaikan uji liveness
  And Skor kemiripan wajah AI melebihi ambang batas 80%
  Then Sistem mencatat koordinat, waktu server, dan foto selfie
  And Status absensi langsung menjadi "APPROVED"
  And Karyawan langsung melihat notifikasi "Absensi Masuk Berhasil! Status: Terverifikasi"
  And Dashboard HRD langsung menampilkan data kehadiran karyawan secara real-time

Scenario: Karyawan mencoba absen di luar radius geofence
  Given Karyawan berada 150 meter dari titik kantor
  When Karyawan membuka halaman absensi
  Then Sistem menampilkan pesan "Anda berada di luar radius kantor"
  And Tombol kamera dan absen dinonaktifkan
```

### US-02: HRD Memantau Kehadiran Real-Time & Audit
* **Sebagai** Admin HRD,  
* **Saya ingin** melihat ringkasan kehadiran karyawan secara live di dashboard,  
* **Agar** saya mengetahui siapa saja yang hadir tepat waktu, terlambat, atau belum absen tanpa harus melakukan approval manual.

```gherkin
Scenario: Admin melihat pembaruan data absensi secara real-time
  Given Karyawan baru saja berhasil melakukan absen masuk otomatis
  When Admin membuka dashboard monitoring HRD
  Then Admin melihat nama karyawan muncul di daftar "Hadir Tepat Waktu"
  And Admin dapat melihat foto selfie dan skor kecocokan AI untuk keperluan audit
```

---

## 8. Matriks Mitigasi Celah Bug, Fraud & Edge Cases

| No | Potensi Celah / Kasus Ekstrem | Risiko Masalah | Solusi & Penanganan Teknis |
| :--- | :--- | :--- | :--- |
| **1** | **Fake GPS / DevTools Location Override** | Karyawan memanipulasi koordinat agar terlihat di kantor. | Evaluasi `geolocation.accuracy` (jika akurasi tidak realistis < 1m atau > 50m, beri peringatan). Validasi konsistensi IP Address provider dengan subnet Wi-Fi kantor jika tersedia. |
| **2** | **Photo Attack (Menodongkan foto cetak / HP lain)** | Titip absen dengan foto rekan kerja. | Wajib lulus uji *Liveness Detection* interaktif (kedipan mata acak / pergerakan) sebelum kamera mengambil frame foto. |
| **3** | **Time Tampering (Memundurkan jam di HP)** | Menghindari status terlambat dengan memutar jam HP. | Waktu submit absensi **mutlak** diambil dari Server Timestamp di Backend (menggunakan sinkronisasi NTP), waktu lokal HP diabaikan. |
| **4** | **Double Click / Lemot Jaringan (Race Condition)** | Karyawan menekan tombol absen berkali-kali sehingga data tersimpan ganda. | Implementasi *Idempotency Key* berbasis UUID pada request POST. Tombol langsung di-disable dan diberi indikator loading setelah klik pertama. |
| **5** | **Izin Kamera / GPS Ditolak Pengguna** | PWA macet tanpa pesan jelas jika user menolak izin browser. | Handler khusus untuk `NotAllowedError` dan `PermissionDenied`. Tampilkan modal panduan visual langkah-langkah me-reset izin di browser. |
| **6** | **Peralihan Jam Shift Malam (Melewati Tengah Malam)** | Shift malam masuk jam 22.00 dan pulang jam 06.00 besoknya. | Pengikatan record absensi berbasis `shift_id` dan `work_date` jadwal, bukan berdasarkan tanggal kalender saat check-out. |

---

## 9. Desain API & Data Contract Ringkas

```text
POST /api/v1/auth/login
Request:  { "nik": "100234", "password": "secure_password" }
Response: { "token": "jwt_token", "user": { "id": "uuid", "role": "EMPLOYEE", "name": "Budi" } }

POST /api/v1/attendance/check-in
Headers:  Authorization: Bearer <token>, X-Idempotency-Key: <uuid>
Request:  {
            "shift_id": "uuid_shift_pagi",
            "latitude": -6.2088,
            "longitude": 106.8456,
            "accuracy": 12.5,
            "liveness_passed": true,
            "photo_base64": "data:image/jpeg;base64,..."
          }
Response: { 
            "status": "success", 
            "message": "Attendance successfully verified and recorded",
            "data": { 
              "attendance_id": "uuid", 
              "state": "APPROVED",
              "is_late": false,
              "check_in_time": "2026-11-17T07:55:12Z"
            } 
          }

GET /api/v1/admin/attendances/live-today
Response: { 
            "total_employees": 120,
            "total_present": 95,
            "total_late": 8,
            "total_absent": 17,
            "items": [
              {
                "id": "uuid_absen",
                "user_name": "Budi",
                "shift_name": "Shift Pagi",
                "check_in_time": "2026-11-17T07:55:12Z",
                "distance_meters": 14.2,
                "face_score": 93.4,
                "status": "APPROVED",
                "photo_selfie_url": "https://storage.../selfie.jpg"
              }
            ]
          }

POST /api/v1/admin/shifts
Request:  { "shift_name": "Shift Malam", "start_time": "22:00:00", "end_time": "06:00:00", "late_tolerance_minutes": 10 }
Response: { "status": "success", "data": { "id": "uuid_shift_baru" } }
```

---

## 10. Metrik Keberhasilan (Success Metrics / KPI)

1. **Efisiensi Waktu HRD:** Beban waktu approval absensi harian berkurang 100% (otomatis).
2. **Kecepatan Respons Pengguna (*Instant Feedback*):** Karyawan mendapatkan kepastian status absensi dalam waktu < 3 detik.
3. **Tingkat Akurasi Verifikasi Wajah (False Acceptance Rate / FAR):** FAR < 0.1% (mencegah kecurangan titip absen).
4. **Tingkat Keberhasilan PWA:** Kompatibilitas 99% pada Chrome (Android) dan Safari (iOS).
