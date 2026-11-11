# Rencana Implementasi: Migrasi Portal BDC ke Next.js & Supabase

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memigrasikan seluruh prototipe statis web portal akademik dan sertifikasi Business Dev Club (BDC) ke Next.js 14/15 App Router (TypeScript, Tailwind CSS) dengan integrasi Supabase PostgreSQL, autentikasi terproteksi domain `@students.utdi.ac.id`, kuis interaktif riil, cetak sertifikat 2 halaman presisi, dan panel admin.

**Architecture:** Next.js App Router dengan Server Components secara default, Server Actions untuk mutasi data riil yang aman, `@supabase/ssr` untuk manajemen sesi berbasis cookie pada Next.js Middleware, dan Tailwind CSS dengan token palet warna kustom sesuai arahan `taste-skill`.

**Tech Stack:** Next.js 14/15, React 18/19, TypeScript, Tailwind CSS, `@supabase/ssr`, `@supabase/supabase-js`, Lucide React.

**Spec:** `docs/superpowers/specs/2026-11-12-nextjs-migration-design.md`

## Global Constraints & Design Tokens (Taste Skill)

- **Color Palette Tokens**:
  - Surface Neutral: `#EFF0F0` (`bg-[#EFF0F0]`, `text-slate-800`)
  - Accent Yellow: `#EEDD55` (`bg-[#EEDD55]`, highlight badge)
  - Amber / Gold: `#E9AD17` (`text-[#E9AD17]`, `bg-[#E9AD17]`, star rating, premium badge)
  - Vibrant Blue: `#095BAF` (`bg-[#095BAF]`, `hover:bg-[#062A78]`, interactive links & primary buttons)
  - Deep Navy: `#062A78` (`bg-[#062A78]`, card headers, sidebar active)
  - Midnight Navy: `#000741` (`bg-[#000741]`, dark surface, admin sidebar, high contrast text)
- **Email Domain Constraint**: Pendaftaran dan login mahasiswa secara ketat hanya menerima domain email `@students.utdi.ac.id`.
- **No Mock/Dummy Data**: Seluruh data modul, kuis, progres silabus, dan sertifikat dimuat dan disimpan ke tabel PostgreSQL Supabase melalui Server Actions.
- **Legacy Preservation**: Seluruh berkas `.html`, `.js`, dan `.css` prototipe awal dipindahkan ke folder `legacy/` tanpa ada yang dihapus.

---

### Task 1: Reorganisasi Direktori & Scaffolding Proyek Next.js

**Files:**
- Create: `legacy/` (arsip seluruh file html/js/htm awal)
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `next.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Modify: `.gitignore`

**Interfaces:**
- Produces: Setup Next.js App Router dengan konfigurasi Tailwind warna kustom (#EFF0F0, #EEDD55, #E9AD17, #095BAF, #062A78, #000741).

- [ ] **Step 1: Pindahkan seluruh file statis lama ke folder `legacy/`**
  Pindahkan file: `AdminVersiCetakSertifikat.html`, `AksesLogin.html`, `AntarMukaUjiandanPembuatanUjian.html`, `api-certificate-handler.js`, `bdc-core.js`, `Courses.html`, `DasborAdmin.htm`, `DasborAdmin.html`, `DasborSiswadanPembelajaran.html`, `MateriPembelajaran.html`, `PengaturanSistem.html`, `PratinjaudanCetakSertifikat.html`, `PratinjauEditor&CetakBundel2.html`, `SertifikatKelulusan.html`, `test_tool_write.html`, `test_tool_write.txt`. Salin `logo.svg` ke `public/logo.svg`.

- [ ] **Step 2: Inisialisasi dependensi `package.json`**
  Pasang: `next`, `react`, `react-dom`, `@supabase/ssr`, `@supabase/supabase-js`, `lucide-react`, `clsx`, `tailwind-merge`, serta devDependencies `typescript`, `@types/node`, `@types/react`, `tailwindcss`, `postcss`.

- [ ] **Step 3: Konfigurasi Tailwind CSS dengan Palet Taste**
  Daftarkan warna kustom pada `tailwind.config.ts`:
  ```typescript
  theme: {
    extend: {
      colors: {
        bdc: {
          surface: '#EFF0F0',
          yellow: '#EEDD55',
          gold: '#E9AD17',
          blue: '#095BAF',
          navy: '#062A78',
          midnight: '#000741',
        }
      }
    }
  }
  ```

- [ ] **Step 4: Buat Root Layout dan Global CSS**
  Buat `src/app/globals.css` dan `src/app/layout.tsx` yang memuat font Plus Jakarta Sans / Inter.

- [ ] **Step 5: Verifikasi build awal**
  Jalankan `npm run build` dan pastikan compile sukses tanpa error.

- [ ] **Step 6: Commit Task 1**
  ```bash
  git add .
  git commit -m "chore: scaffold next.js app router dan arsipkan file statis ke legacy"
  ```

---

### Task 2: Supabase Schema DDL, Seed Data, & Client Helpers

**Files:**
- Create: `supabase/schema.sql`
- Create: `supabase/seed.sql`
- Create: `src/lib/types/database.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `.env.example`

**Interfaces:**
- Produces: Type-safe Supabase clients (`createBrowserClient`, `createServerClient`) dan skema DDL relasional lengkap (profiles, courses, enrollments, quizzes, attempts, certificates).

- [ ] **Step 1: Tulis skema DDL lengkap pada `supabase/schema.sql`**
  Buat tabel: `profiles`, `courses`, `course_enrollments`, `quizzes`, `quiz_questions`, `quiz_attempts`, dan `certificates` beserta indeks dan aturan RLS (Row Level Security).

- [ ] **Step 2: Tulis data awal real pada `supabase/seed.sql`**
  Masukkan akun default Siti Rahmawati (`255720056@students.utdi.ac.id`, NIM `255720056`), akun Admin Kemahasiswaan (`bagas.triaji@utdi.ac.id`), 5 kursus BDC (ACT-01 s.d ACT-05), bank soal ujian siber & pemrograman web, serta sertifikat resmi `BDC-CERT-2026-99482-SEC`.

- [ ] **Step 3: Definisikan tipe TypeScript pada `src/lib/types/database.ts`**
  Ekspor antarmuka TypeScript untuk `Profile`, `Course`, `CourseEnrollment`, `Quiz`, `QuizQuestion`, `QuizAttempt`, dan `Certificate`.

- [ ] **Step 4: Implementasikan Supabase Client Helpers**
  Tulis `src/lib/supabase/client.ts` untuk browser dan `src/lib/supabase/server.ts` untuk Server Components/Actions dengan cookie handling aman. Sediakan fallback in-memory data store yang rapi jika env Supabase belum diisi pengguna pada saat inisialisasi lokal.

- [ ] **Step 5: Verifikasi type-checking**
  Jalankan `npx tsc --noEmit` untuk memastikan tidak ada konflik tipe.

- [ ] **Step 6: Commit Task 2**
  ```bash
  git add supabase/ src/lib/ .env.example
  git commit -m "feat: tambahkan skema ddl supabase, seed data, tipe typescript, dan supabase client"
  ```

---

### Task 3: Autentikasi, Validasi Domain `@students.utdi.ac.id`, & Middleware

**Files:**
- Create: `src/lib/actions/auth.ts`
- Create: `src/middleware.ts`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/components/ui/Toast.tsx`

**Interfaces:**
- Consumes: `src/lib/supabase/server.ts`, `src/lib/types/database.ts`
- Produces: Server Actions `loginAction(formData)`, `logoutAction()`, dan proteksi rute di `middleware.ts`.

- [ ] **Step 1: Tulis validasi domain & Server Action Login pada `src/lib/actions/auth.ts`**
  - Validasi bahwa input login berupa NIM (misal `255720056`) atau Email berdomain `@students.utdi.ac.id` (atau whitelist dosen/admin `@utdi.ac.id`).
  - Tolak dengan pesan ramah jika mencoba login dengan email selain domain resmi kampus.
  - Kelola sesi via Supabase Auth atau fallback authenticated session cookies.

- [ ] **Step 2: Implementasikan Next.js `middleware.ts`**
  - Lindungi rute `/(portal)/*` dari pengunjung yang belum login (redirect ke `/login`).
  - Lindungi rute `/admin/*` khusus untuk pengguna dengan `role === 'admin' || role === 'instructor'`.
  - Izinkan rute `/verify` diakses oleh publik tanpa login.

- [ ] **Step 3: Bangun Halaman Login `src/app/(auth)/login/page.tsx`**
  - Desain antarmuka login yang estetik sesuai palet Taste (`#000741`, `#062A78`, `#095BAF`, `#EEDD55`, `#EFF0F0`).
  - Dukung login dengan NIM atau Email UTDI.
  - Tambahkan tombol Google SSO dengan peringatan: *"Hanya akun @students.utdi.ac.id yang diizinkan"*.
  - Sediakan quick demo login switcher untuk memudahkan pengujian (Siti Rahmawati - Siswa, & Dr. Evelyn Vance / Bagas Triaji - Admin).

- [ ] **Step 4: Komponen Notifikasi Toast `src/components/ui/Toast.tsx`**
  Buat provider Toast yang dapat dipanggil dari Server Action maupun interaksi client.

- [ ] **Step 5: Uji verifikasi alur login dan proteksi domain**
  Verifikasi via test script atau browser call bahwa email non-UTDI ditolak dan sesi tersimpan dengan benar.

- [ ] **Step 6: Commit Task 3**
  ```bash
  git add src/lib/actions/auth.ts src/middleware.ts src/app/(auth)/login/ src/components/ui/Toast.tsx
  git commit -m "feat: implementasi login dengan validasi domain students.utdi.ac.id dan rbac middleware"
  ```

---

### Task 4: Shell Portal Mahasiswa & Dasbor Pembelajaran

**Files:**
- Create: `src/app/(portal)/layout.tsx`
- Create: `src/components/layout/PortalSidebar.tsx`
- Create: `src/components/layout/PortalHeader.tsx`
- Create: `src/app/(portal)/dashboard/page.tsx`
- Create: `src/components/dashboard/StatCards.tsx`
- Create: `src/components/dashboard/CapstoneProgress.tsx`
- Create: `src/components/dashboard/ActiveModulesList.tsx`

**Interfaces:**
- Consumes: Data profil mahasiswa dan progres modul dari Supabase Server Client.
- Produces: Layout bersama portal mahasiswa dan tampilan Dasbor Siswa interaktif.

- [ ] **Step 1: Bangun Sidebar Navigasi `PortalSidebar.tsx`**
  - Menu: Dasbor (`/dashboard`), Materi / Courses (`/courses`), Ujian & Kuis (`/assessments`), Sertifikasi (`/certificates`), Pengaturan (`/settings`).
  - Styling palet Taste: Background `#000741` / `#062A78`, teks aktif `#EEDD55`, hover `#095BAF`.
  - Responsif: Sidebar desktop tetap dan drawer mobile yang dapat di-toggle.

- [ ] **Step 2: Bangun Header Portal `PortalHeader.tsx`**
  - Menampilkan badge institusi *"BDC Academic College Community - UTDI Yogyakarta"*.
  - Menampilkan nama mahasiswa (Siti Rahmawati), NIM (`255720056`), avatar, dan tombol logout.

- [ ] **Step 3: Bangun Dasbor Mahasiswa `src/app/(portal)/dashboard/page.tsx`**
  - Sambungkan data riil: Jam Belajar (64.5 Jam), Modul Selesai, Rata-rata Skor (96.4), Status Capstone.
  - Kartu Capstone Project *"BDC Hub (Web Presensi & Pembelajaran Community)"* dengan grade A+ dan progress 100%.
  - Modul berjalan dengan tautan langsung ke halaman detail kursus.

- [ ] **Step 4: Verifikasi render dan responsivitas**
  Buka `/dashboard` dan pastikan layout tampil presisi tanpa error hydrasi.

- [ ] **Step 5: Commit Task 4**
  ```bash
  git add src/app/(portal)/layout.tsx src/components/layout/ src/app/(portal)/dashboard/ src/components/dashboard/
  git commit -m "feat: implementasi layout portal mahasiswa dan dasbor siswa dengan data riil"
  ```

---

### Task 5: Katalog Materi Pembelajaran & Pelacakan Progres Silabus

**Files:**
- Create: `src/app/(portal)/courses/page.tsx`
- Create: `src/app/(portal)/courses/[id]/page.tsx`
- Create: `src/components/courses/CourseCard.tsx`
- Create: `src/components/courses/CourseFilters.tsx`
- Create: `src/components/courses/SyllabusChecklist.tsx`
- Create: `src/lib/actions/courses.ts`

**Interfaces:**
- Consumes: Tabel `courses` dan `course_enrollments`.
- Produces: Halaman katalog materi, filter kategori, live search, detail silabus, dan Server Action `toggleCourseTopicAction`.

- [ ] **Step 1: Tulis Server Action `src/lib/actions/courses.ts`**
  Implementasikan `toggleCourseTopicAction(courseId: string, topicIndex: number)` untuk mencatat topik yang diselesaikan mahasiswa ke tabel `course_enrollments` dan menghitung ulang persentase progress (0-100%).

- [ ] **Step 2: Bangun Halaman Katalog `src/app/(portal)/courses/page.tsx`**
  - Tampilkan 5 modul riil (ACT-01 s.d ACT-05) dengan kategori: *Sesi Minggu Ini*, *Workshop Lab*, *Proyek Bersama*, *Arsip Recording*.
  - Filter interaktif berbasis kategori dan input pencarian judul/pemateri.

- [ ] **Step 3: Bangun Halaman Detail Modul `src/app/(portal)/courses/[id]/page.tsx`**
  - Tampilkan rincian materi, durasi, tingkat kesulitan, instruktur, dan silabus lengkap.
  - Komponen `SyllabusChecklist.tsx`: checkbox interaktif yang langsung memanggil Server Action dan memperbarui progress secara real-time.

- [ ] **Step 4: Uji fungsionalitas pencarian dan toggle silabus**
  Pastikan perubahan checklist tersimpan ke state/database dan persentase progress bertambah.

- [ ] **Step 5: Commit Task 5**
  ```bash
  git add src/app/(portal)/courses/ src/components/courses/ src/lib/actions/courses.ts
  git commit -m "feat: implementasi katalog modul pembelajaran dan checklist progres silabus riil"
  ```

---

### Task 6: Antarmuka Ujian & Kuis Interaktif (Player & Penilaian Riil)

**Files:**
- Create: `src/app/(portal)/assessments/page.tsx`
- Create: `src/app/(portal)/assessments/[id]/page.tsx`
- Create: `src/components/assessment/QuizTimer.tsx`
- Create: `src/components/assessment/QuestionPalette.tsx`
- Create: `src/components/assessment/QuizResultModal.tsx`
- Create: `src/lib/actions/quiz.ts`

**Interfaces:**
- Consumes: Tabel `quizzes`, `quiz_questions`, dan `quiz_attempts`.
- Produces: Server Action `submitQuizAction(quizId, answers)` dan player ujian interaktif.

- [ ] **Step 1: Tulis Server Action `src/lib/actions/quiz.ts`**
  - Ambil kunci jawaban langsung dari database (tanpa pernah membocorkan kunci ke browser).
  - Bandingkan jawaban mahasiswa, hitung skor secara matematis, tentukan status kelulusan (Kompeten jika >= 75.0), dan simpan riwayat ke tabel `quiz_attempts`.

- [ ] **Step 2: Bangun Daftar Ujian `src/app/(portal)/assessments/page.tsx`**
  - Menampilkan daftar ujian yang tersedia, durasi waktu, ambang batas skor kelulusan, dan riwayat nilai pengerjaan sebelumnya.

- [ ] **Step 3: Bangun Player Ujian `src/app/(portal)/assessments/[id]/page.tsx`**
  - `QuizTimer.tsx`: Countdown timer tersinkronisasi. Jika waktu habis, form ujian otomatis melakukan submit.
  - Pilihan ganda interaktif dengan palet Taste (`#095BAF` untuk pilihan aktif, `#EEDD55` untuk tanda ragu-ragu).
  - `QuestionPalette.tsx`: Grid nomor soal untuk navigasi cepat (Sudah Diisi, Belum, Ragu-ragu).
  - Dialog konfirmasi sebelum submit.
  - `QuizResultModal.tsx`: Menampilkan hasil skor riil, persentase kebenaran, dan status kelulusan secara instan.

- [ ] **Step 4: Uji pengerjaan kuis dari awal hingga selesai**
  Verifikasi bahwa kuis dapat dikerjakan, timer berfungsi, dan skor terhitung akurat.

- [ ] **Step 5: Commit Task 6**
  ```bash
  git add src/app/(portal)/assessments/ src/components/assessment/ src/lib/actions/quiz.ts
  git commit -m "feat: implementasi player ujian interaktif dengan timer dan penilaian otomatis di server"
  ```

---

### Task 7: Sertifikat Kelulusan, Transkrip Akademik, Mesin Cetak Presisi, & Verifikasi Publik

**Files:**
- Create: `src/app/(portal)/certificates/page.tsx`
- Create: `src/app/(portal)/certificates/[id]/page.tsx`
- Create: `src/app/(portal)/certificates/[id]/print/page.tsx`
- Create: `src/app/verify/page.tsx`
- Create: `src/components/certificate/CertificatePageOne.tsx`
- Create: `src/components/certificate/TranscriptPageTwo.tsx`
- Create: `src/components/certificate/QRCodeGenerator.tsx`
- Create: `src/lib/actions/certificates.ts`

**Interfaces:**
- Consumes: Data sertifikat dari tabel `certificates`.
- Produces: Pratinjau sertifikat digital, layout cetak 2 halaman A4 bebas overflow, dan halaman verifikasi publik `/verify`.

- [ ] **Step 1: Bangun Komponen Sertifikat Halaman 1 `CertificatePageOne.tsx`**
  - Mengadopsi desain elegan dari prototipe: Border ornamen klasik, lambang BDC & UTDI, teks piagam resmi, nama penerima (Siti Rahmawati), NIM `255720056`, nomor sertifikat `BDC-CERT-2026-99482-SEC`.
  - Tanda tangan resmi: **Bagas Triaji, S.Kom., M.Kom.** (Kemahasiswaan) dan **Nurul Layli** (PIC Program BDC).
  - Komponen QR Code dinamis yang menautkan langsung ke URL verifikasi publik.

- [ ] **Step 2: Bangun Komponen Transkrip Halaman 2 `TranscriptPageTwo.tsx`**
  - Menampilkan tabel rincian nilai 4 modul (SEC-501 s.d SEC-504), jam pelatihan (64.5 Jam), nilai rata-rata 96.40 (A+), dan Capstone Project BDC Hub.
  - Tanda tangan penanggung jawab program dan stempel resmi.

- [ ] **Step 3: Bangun Mode Cetak Presisi `[id]/print/page.tsx`**
  - Konfigurasi CSS `@media print` untuk ukuran A4 (page-break-after: always untuk memisahkan Halaman 1 dan Halaman 2 secara sempurna tanpa overflow).
  - Tombol aksi: Cetak Sertifikat Saja, Cetak Transkrip Saja, atau Cetak Bundel Lengkap.

- [ ] **Step 4: Bangun Halaman Verifikasi Publik `src/app/verify/page.tsx`**
  - Dapat diakses siapapun tanpa login.
  - Form pencarian berdasarkan Nomor Sertifikat atau NIM.
  - Menampilkan badge "Terverifikasi Resmi di Pangkalan Data BDC UTDI" jika sertifikat valid.

- [ ] **Step 5: Uji pratinjau sertifikat, cetak browser (print preview), dan pencarian verifikasi**
  Pastikan tampilan cetak A4 presisi tanpa ada halaman kosong ekstra.

- [ ] **Step 6: Commit Task 7**
  ```bash
  git add src/app/(portal)/certificates/ src/app/verify/ src/components/certificate/ src/lib/actions/certificates.ts
  git commit -m "feat: implementasi sertifikat digital, transkrip nilai akademik, mesin cetak a4, dan verifikasi publik"
  ```

---

### Task 8: Panel Dasbor & Manajemen Admin (`/admin`)

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/students/page.tsx`
- Create: `src/app/admin/certificates/page.tsx`
- Create: `src/app/admin/assessments/page.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/StudentTable.tsx`
- Create: `src/lib/actions/admin.ts`

**Interfaces:**
- Consumes: Hak akses role `admin` / `instructor`.
- Produces: Panel manajemen mahasiswa, pembaruan status kelulusan, dan kustomisasi sertifikat.

- [ ] **Step 1: Tulis Server Actions Admin `src/lib/actions/admin.ts`**
  - `adminToggleStudentStatusAction(userId: string, isCompetent: boolean)`: Mengubah status kelulusan mahasiswa.
  - `adminToggleCertificateLockAction(certId: string, isLocked: boolean)`: Membuka atau mengunci sertifikat mahasiswa.
  - `adminUpdateSignatoriesAction(payload)`: Mengubah data nama dan jabatan penandatangan resmi.

- [ ] **Step 2: Bangun Layout & Sidebar Admin `src/app/admin/layout.tsx`**
  - Terapkan estetika Navy / Slate Gelap (`#000741`, `#062A78`) sesuai tema Dasbor Admin BDC.
  - Navigasi: Ringkasan Analitik, Kelola Mahasiswa, Bank Soal Ujian, Editor Sertifikat.

- [ ] **Step 3: Bangun Dasbor Ringkasan Analitik `src/app/admin/page.tsx`**
  - Metrik riil: Total Mahasiswa Terdaftar, Tingkat Kelulusan (%), Modul Aktif, dan Sertifikat yang Telah Diterbitkan.

- [ ] **Step 4: Bangun Halaman Kelola Mahasiswa `src/app/admin/students/page.tsx`**
  - Tabel mahasiswa dengan pencarian, status kelulusan, nilai rata-rata, dan tombol aksi "Buka Kunci Sertifikat" (*Unlock Certificate*).

- [ ] **Step 5: Bangun Editor Sertifikat Admin `src/app/admin/certificates/page.tsx`**
  - Form untuk mengubah penandatangan (Kemahasiswaan & PIC), periode akademik (`2026/2027`), dan lokasi (`Yogyakarta`).

- [ ] **Step 6: Uji fungsi manajemen admin**
  Pastikan perubahan status mahasiswa atau penandatangan langsung tercermin di portal siswa.

- [ ] **Step 7: Commit Task 8**
  ```bash
  git add src/app/admin/ src/components/admin/ src/lib/actions/admin.ts
  git commit -m "feat: implementasi dasbor admin untuk manajemen siswa dan penerbitan sertifikat"
  ```

---

### Task 9: Pengaturan Sistem, Verifikasi Menyeluruh, & Kesiapan Deploy Vercel

**Files:**
- Create: `src/app/(portal)/settings/page.tsx`
- Modify: `README.md`
- Test: Full Build & Lint Check

**Interfaces:**
- Consumes: Seluruh komponen dan rute yang telah dibangun.
- Produces: Halaman pengaturan sistem, dokumentasi setup environment variable Vercel, dan build produksi yang bersih.

- [ ] **Step 1: Bangun Halaman Pengaturan Sistem `src/app/(portal)/settings/page.tsx`**
  - Form profil pengguna (Nama, NIM, Email UTDI, Lokasi).
  - Form ganti kata sandi.
  - Tampilan informasi status koneksi database Supabase.

- [ ] **Step 2: Dokumentasi Deploy Vercel & Supabase pada `README.md`**
  - Panduan konfigurasi Environment Variables di Vercel:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
  - Panduan eksekusi `supabase/schema.sql` dan `supabase/seed.sql`.

- [ ] **Step 3: Jalankan Uji Kompilasi TypeScript Ketat**
  Jalankan `npx tsc --noEmit` dan perbaiki jika ada tipe yang tidak cocok.

- [ ] **Step 4: Jalankan Production Build Next.js**
  Jalankan `npm run build` dan pastikan seluruh rute (SSG/SSR/Server Actions) terkompilasi 100% tanpa error.

- [ ] **Step 5: Verifikasi Alur Pengguna Akhir**
  - Login mahasiswa dengan NIM `255720056` -> berhasil masuk ke `/dashboard`.
  - Coba login dengan email selain `@students.utdi.ac.id` -> ditolak dengan notifikasi yang jelas.
  - Buka `/courses` -> cek silabus modul -> progres bertambah.
  - Buka `/assessments` -> kerjakan kuis -> nilai terhitung riil.
  - Buka `/certificates` -> lihat pratinjau sertifikat dan uji tombol cetak A4.
  - Buka `/verify` -> cari `BDC-CERT-2026-99482-SEC` -> status valid terverifikasi.
  - Login admin -> buka `/admin` -> ubah status mahasiswa -> berhasil.

- [ ] **Step 6: Commit Task 9 & Finalisasi**
  ```bash
  git add .
  git commit -m "feat: finalisasi pengaturan sistem, dokumentasi vercel deploy, dan verifikasi production build"
  ```
