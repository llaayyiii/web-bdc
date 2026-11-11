# Spesifikasi Desain: Migrasi Portal BDC ke Next.js & Supabase

**Tanggal**: 12 November 2026  
**Status**: Disetujui  
**Target Platform**: Vercel (Hobby/Free Tier) + Supabase (Free Tier)  
**Institusi/Afiliasi**: Business Dev Club (BDC) — Universitas Teknologi Digital Indonesia (UTDI), Yogyakarta  

---

## 1. Ringkasan Eksekutif & Tujuan

Proyek ini bertujuan memigrasikan prototipe web portal akademik dan sertifikasi **Business Dev Club (BDC)** dari sekumpulan berkas statis HTML/JS/CSS ke aplikasi modern **Next.js App Router (TypeScript, Tailwind CSS)** dengan backend data nyata (**Supabase PostgreSQL, Supabase Auth, & Storage**).

Semua menu, alur kerja, dan estetika visual yang sudah ada dipertahankan 1:1, namun seluruh data dummy/hardcoded digantikan dengan sistem database relasional, penilaian otomatis, proteksi peran (Role-Based Access Control), dan pembatasan domain email resmi kampus **`@students.utdi.ac.id`**.

---

## 2. Arsitektur & Teknologi

- **Framework**: Next.js 14/15 (App Router, Server Components & Server Actions)
- **Bahasa**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS, Google Fonts (*Plus Jakarta Sans* & *Inter*), Material Symbols / Lucide Icons
- **Database & Auth**: Supabase PostgreSQL dengan Row Level Security (RLS) & Supabase Auth via `@supabase/ssr`
- **Session Management**: Secure HTTP-only cookies yang dikelola via Middleware Next.js
- **Ekspor Dokumen**: Cetak sertifikat & transkrip presisi resolusi tinggi A4 (CSS `@media print` + QR code verifikasi dinamis)
- **Deployment**: Vercel Free Tier (Serverless Edge Middleware & API Routes)

---

## 3. Struktur Direktori & Pemetaan Halaman

Seluruh berkas HTML prototipe awal dipindahkan ke direktori `legacy/` sebagai arsip referensi. Struktur proyek baru diatur sebagai berikut:

```text
web-bdc/
├── legacy/                               # Arsip file HTML/JS/CSS statis bawaan
│   ├── AksesLogin.html
│   ├── DasborSiswadanPembelajaran.html
│   ├── DasborAdmin.htm
│   ├── MateriPembelajaran.html
│   ├── AntarMukaUjiandanPembuatanUjian.html
│   ├── SertifikatKelulusan.html
│   └── ...
├── public/
│   ├── logo.svg
│   └── images/
├── supabase/
│   ├── schema.sql                        # DDL tabel & kebijakan RLS
│   └── seed.sql                          # Data awal (akun Siti Rahmawati, admin, materi, kuis)
├── src/
│   ├── app/
│   │   ├── page.tsx                      # Smart Root Redirect (/dashboard atau /login)
│   │   ├── layout.tsx                    # Root Layout (Fonts, Metadata SEO, Toast Provider)
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx              # Login Page (NIM/Email UTDI + Google SSO)
│   │   ├── (portal)/                     # Route Group Mahasiswa / Member
│   │   │   ├── layout.tsx                # App Shell (Sidebar responsif, Header akun, Nav)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx              # Dasbor Siswa (Statistik, Progres Capstone, Modul Berjalan)
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx              # Katalog Materi (Filter Live/Lab/Proyek/Recording)
│   │   │   │   └── [id]/page.tsx         # Detail Silabus & Pelacakan Progres Modul
│   │   │   ├── assessments/
│   │   │   │   ├── page.tsx              # Daftar Kuis & Riwayat Skor Mahasiswa
│   │   │   │   └── [id]/page.tsx         # Player Ujian (Countdown Timer, Soal Interaktif, Submit)
│   │   │   ├── certificates/
│   │   │   │   ├── page.tsx              # Status Sertifikat & Kelulusan Mahasiswa
│   │   │   │   ├── [id]/page.tsx         # Pratinjau Sertifikat & Transkrip Akademik Digital
│   │   │   │   └── [id]/print/page.tsx   # Tampilan Cetak Resmi 2 Halaman (A4 Bebas Overflow)
│   │   │   └── settings/
│   │   │       └── page.tsx              # Pengaturan Profil, Ganti Password, & Preferensi
│   │   ├── admin/                        # Area Admin & Instruktur (Tema Navy/Dark Slate)
│   │   │   ├── layout.tsx                # Shell Admin Khusus
│   │   │   ├── page.tsx                  # Dasbor Admin (Metrik Analitik, Kelulusan, Modul Aktif)
│   │   │   ├── students/page.tsx         # Manajemen Mahasiswa (Kelulusan & Unlock Sertifikat)
│   │   │   ├── assessments/page.tsx      # Bank Soal & Editor Kuis
│   │   │   └── certificates/page.tsx     # Editor Penerbitan Sertifikat & Penandatangan Resmi
│   │   └── verify/
│   │       └── page.tsx                  # Halaman Publik Verifikasi Kredensial via No Sertifikat/NIM
│   ├── components/
│   │   ├── ui/                           # Button, Input, Modal, Badge, Toast, Card
│   │   ├── layout/                       # Sidebar, Topbar, UserMenu
│   │   ├── assessment/                   # QuizTimer, QuestionCard, QuizPalette
│   │   └── certificate/                  # CertificateDoc, TranscriptDoc, SignatoryBlock, QRCodeBox
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Browser client (createBrowserClient)
│   │   │   ├── server.ts                 # Server client (createServerClient dengan cookies)
│   │   │   └── middleware.ts             # Session refresh helper
│   │   ├── actions/                      # Server Actions (auth, quiz, certificate, admin)
│   │   ├── types/                        # TypeScript Interface & Database Types
│   │   └── utils.ts                      # Format tanggal, format jam, kalkulasi nilai
│   └── middleware.ts                     # Proteksi rute berbasis token & otorisasi peran
```

---

## 4. Skema Database Supabase (PostgreSQL)

### 4.1 Tabel `profiles`
Terhubung ke `auth.users(id)` via foreign key cascading:
- `id` (UUID, Primary Key)
- `nim_id` (TEXT, Not Null, Unique) — Contoh: `255720056`
- `full_name` (TEXT, Not Null) — Contoh: `Siti Rahmawati`
- `email` (TEXT, Not Null, Unique) — Harus berdomain `@students.utdi.ac.id` (kecuali staf terdaftar)
- `role` (TEXT, Default `'learner'`) — Opsi: `'learner'`, `'instructor'`, `'admin'`
- `role_title` (TEXT) — Contoh: `'Corporate Learner'` atau `'Kemahasiswaan'`
- `division` (TEXT, Default `'Academic College Community'`)
- `period` (TEXT, Default `'2026/2027'`)
- `location` (TEXT, Default `'Yogyakarta'`)
- `avatar_url` (TEXT, Nullable)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 4.2 Tabel `courses` & `course_enrollments`
- **`courses`**:
  - `id` (TEXT, Primary Key, misal `'ACT-01'`)
  - `title` (TEXT, Not Null)
  - `category` (TEXT) — `'Sesi Minggu Ini'`, `'Workshop & Hands-On'`, `'Proyek Bersama'`, `'Arsip Recording'`
  - `session_type` (TEXT) — `'Live Session'`, `'Workshop Lab'`, `'Project File'`, `'Rekaman Web'`
  - `instructor` (TEXT)
  - `instructor_role` (TEXT)
  - `duration` (TEXT)
  - `level` (TEXT)
  - `description` (TEXT)
  - `syllabus` (JSONB) — Daftar topik materi
  - `icon` (TEXT)
  - `badge_color` (TEXT)
  - `learners_count` (INT, Default 0)
  - `rating` (NUMERIC(3,2), Default 4.9)
- **`course_enrollments`**:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, FK `profiles.id`)
  - `course_id` (TEXT, FK `courses.id`)
  - `completed_topics` (JSONB) — Indeks topik yang telah dicentang selesai
  - `progress_percent` (INT, 0-100)
  - `is_completed` (BOOLEAN, Default false)
  - `enrolled_at`, `updated_at` (TIMESTAMPTZ)

### 4.3 Tabel `quizzes`, `quiz_questions`, & `quiz_attempts`
- **`quizzes`**:
  - `id` (UUID, Primary Key)
  - `title` (TEXT, Not Null)
  - `description` (TEXT)
  - `time_limit_minutes` (INT, Default 30)
  - `passing_score` (NUMERIC(5,2), Default 75.00)
  - `is_published` (BOOLEAN, Default true)
- **`quiz_questions`**:
  - `id` (UUID, Primary Key)
  - `quiz_id` (UUID, FK `quizzes.id` ON DELETE CASCADE)
  - `question_text` (TEXT, Not Null)
  - `options` (JSONB, Not Null) — Contoh: `[{"id":"A","text":"..."},{"id":"B","text":"..."}]`
  - `correct_option` (TEXT, Not Null) — `'A'`, `'B'`, `'C'`, atau `'D'` (Hanya dibaca oleh Server Action)
  - `weight` (NUMERIC(4,2), Default 1.0)
  - `order_index` (INT)
- **`quiz_attempts`**:
  - `id` (UUID, Primary Key)
  - `quiz_id` (UUID, FK `quizzes.id`)
  - `user_id` (UUID, FK `profiles.id`)
  - `score` (NUMERIC(5,2), Not Null)
  - `passed` (BOOLEAN, Not Null)
  - `answers_json` (JSONB) — Pilihan yang dijawab oleh mahasiswa
  - `started_at`, `completed_at` (TIMESTAMPTZ)

### 4.4 Tabel `certificates`
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK `profiles.id` ON DELETE CASCADE)
- `certificate_number` (TEXT, Unique, Not Null) — Contoh: `BDC-CERT-2026-99482-SEC`
- `transcript_number` (TEXT, Unique, Not Null) — Contoh: `BDC-TRX-2026-99482`
- `recipient_name` (TEXT, Not Null)
- `nim_id` (TEXT, Not Null)
- `cohort` (TEXT, Default `'Cohort VI Nasional'`)
- `program_title` (TEXT, Default `'Cybersecurity Compliance & ISO/IEC 27001 Enterprise Defense'`)
- `period` (TEXT, Default `'2026/2027'`)
- `location` (TEXT, Default `'Yogyakarta'`)
- `issue_date` (DATE, Default `'2026-03-24'`)
- `total_hours` (NUMERIC(5,1), Default 64.5)
- `avg_score` (NUMERIC(5,2), Default 96.40)
- `completion_status` (TEXT, Default `'LULUS (KOMPETEN)'`)
- `cohort_badge` (TEXT, Default `'TOP 3% COHORT'`)
- `capstone_title` (TEXT, Default `'BDC Hub (Web Presensi & Pembelajaran Community)'`)
- `capstone_hours` (NUMERIC(5,1), Default 16.5)
- `capstone_score` (NUMERIC(5,2), Default 98.00)
- `capstone_grade` (TEXT, Default `'A+'`)
- `capstone_status` (TEXT, Default `'Lulus Paripurna'`)
- `signatory_1_name` (TEXT, Default `'Bagas Triaji, S.Kom., M.Kom.'`)
- `signatory_1_role` (TEXT, Default `'Kemahasiswaan'`)
- `signatory_2_name` (TEXT, Default `'Nurul Layli'`)
- `signatory_2_role` (TEXT, Default `'PIC Program BDC'`)
- `modules_json` (JSONB) — Rincian 4 modul kurikulum (SEC-501 s.d SEC-504)
- `is_locked` (BOOLEAN, Default false)
- `created_at`, `updated_at` (TIMESTAMPTZ)

---

## 5. Keamanan & Kebijakan Domain Kampus

1. **Enforcement Domain Email**:
   - Seluruh akun mahasiswa wajib menggunakan domain `@students.utdi.ac.id`.
   - Pada `loginAction` dan `handleGoogleCallback`:
     ```typescript
     if (!email.toLowerCase().endsWith('@students.utdi.ac.id') && !isAllowedAdminEmail(email)) {
       throw new Error('Akses ditolak: Gunakan email resmi kampus @students.utdi.ac.id');
     }
     ```
2. **Row Level Security (RLS)**:
   - Mahasiswa hanya memiliki akses `SELECT` dan `UPDATE` ke baris datanya sendiri di `profiles`, `course_enrollments`, dan `quiz_attempts`.
   - `quiz_questions.correct_option` tidak diekspos melalui public select ke mahasiswa; kalkulasi skor dilakukan eksklusif di backend Server Action.
   - Tabel `certificates` dapat di-`SELECT` oleh publik hanya jika dicari berdasarkan `certificate_number` atau `nim_id` pada rute verifikasi.
   - Admin memiliki akses `ALL` ke seluruh tabel.
3. **Next.js Middleware**:
   - Mencegah akses rute `/admin/*` bagi akun dengan peran selain `'admin'` atau `'instructor'`.
   - Otomatis meneruskan pengguna yang belum login ke `/login?redirectTo=...`.

---

## 6. Antarmuka Pengguna & Fitur Cetak

1. **Estetika & Komponen Visual**:
   - Mempertahankan palet warna ungu/indigo BDC (`#2a14b4`, `#4338ca`, `#8B5CF6`) dan tema gelap Navy Admin (`#0F172A`, `#1E293B`).
   - Feedback interaktif menggunakan Toast Notification (sukses, peringatan, error).
2. **Cetak Sertifikat Presisi (2 Halaman A4)**:
   - Dibuat menggunakan styling `@media print` A4 Landscape/Portrait tanpa margin bocor.
   - Menyertakan barcode/QR Code SVG dinamis yang memuat tautan verifikasi `https://[domain]/verify?cert=[NO_SERTIFIKAT]`.
   - Menghadirkan tombol aksi langsung: `Cetak Halaman 1`, `Cetak Transkrip (Halaman 2)`, dan `Unduh Bundel Lengkap`.

---

## 7. Data Awal (Seed Data)

Script `supabase/seed.sql` akan memuat data standar:
- Akun Mahasiswa Uji Coba:
  - **Nama**: Siti Rahmawati
  - **NIM**: `255720056`
  - **Email**: `255720056@students.utdi.ac.id`
  - **Status**: Kompeten (Lulus), Nilai Rata-rata 96.40
- Akun Admin/Dosen Uji Coba:
  - **Nama**: Bagas Triaji, S.Kom., M.Kom.
  - **Email**: `bagas.triaji@utdi.ac.id` (atau akun admin BDC)
  - **Role**: `admin`
- 5 Modul Materi Aktif (ACT-01 s.d ACT-05)
- 1 Kuis Lengkap Uji Kompetensi Keamanan Siber & Pemrograman Web
- 1 Sertifikat Sah diterbitkan untuk Siti Rahmawati (`BDC-CERT-2026-99482-SEC`)

---

## 8. Verifikasi & Pengujian

- [ ] Next.js build sukses (`npm run build`) tanpa error TypeScript atau linting.
- [ ] Login mahasiswa berhasil dengan NIM `255720056` dan email domain `@students.utdi.ac.id`.
- [ ] Login ditolak jika memasukkan email non-UTDI (misal `@gmail.com`).
- [ ] Mahasiswa dapat membuka kursus, mencentang silabus, dan progres tersimpan real di database.
- [ ] Mahasiswa dapat mengerjakan kuis, timer berjalan, dan skor terhitung akurat di server.
- [ ] Halaman sertifikat menampilkan data asli dan dapat dicetak rapi 2 halaman A4.
- [ ] Halaman verifikasi publik `/verify` dapat menemukan sertifikat berdasarkan No. Sertifikat / NIM.
- [ ] Admin dapat membuka panel `/admin`, melihat daftar siswa, dan mengubah status kelulusan.
