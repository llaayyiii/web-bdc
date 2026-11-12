# Business Dev Club (BDC) — Portal Akademik & Sertifikasi Mahasiswa

Portal resmi pembelajaran, evaluasi kompetensi, penerbitan sertifikat digital, dan verifikasi kredensial mahasiswa **Business Dev Club (BDC)** — Universitas Teknologi Digital Indonesia (UTDI), Yogyakarta.

Aplikasi ini telah dimigrasikan dari berkas statis HTML ke **Next.js App Router (TypeScript, Tailwind CSS)** dengan integrasi data nyata **Supabase PostgreSQL & Supabase Auth**, dilengkapi proteksi domain email kampus **`@students.utdi.ac.id`**.

---

## 🎨 Palet Warna & Desain (Taste Skill)

Antarmuka dirancang presisi dengan token palet warna kustom:
- **Surface Neutral**: `#EFF0F0` (`bg-bdc-surface`)
- **Highlight Badge**: `#EEDD55` (`bg-bdc-yellow`)
- **Accent Gold**: `#E9AD17` (`text-bdc-gold`, bintang rating, seal)
- **Primary Interactive Blue**: `#095BAF` (`bg-bdc-blue`, tombol aksi & navigasi)
- **Deep Navy**: `#062A78` (`bg-bdc-navy`, kartu & header)
- **Dark Midnight**: `#000741` (`bg-bdc-midnight`, sidebar & teks kontras tinggi)

---

## 🚀 Fitur Utama

1. **Autentikasi & Pembatasan Domain Kampus**:
   - Mendukung login dengan **NIM Mahasiswa** (cth: `255720056`) atau **Email Resmi**.
   - Validasi ketat domain email: hanya menerima **`@students.utdi.ac.id`** untuk mahasiswa.
   - Sesi aman berbasis HTTP-only Cookie via `@supabase/ssr` dan Next.js Middleware.

2. **Dasbor Mahasiswa & Capstone Project**:
   - Metrik riil: Total Jam Belajar (64.5 Jam), Modul Selesai (4/5), Skor Rata-rata (96.40 / A+), dan Kredensial Resmi.
   - Capstone Project *"BDC Hub (Web Presensi & Pembelajaran Community)"*.

3. **Katalog Modul Pembelajaran & Silabus Interaktif**:
   - 5 Modul Riil: *Live Coding Web App*, *Audit Keamanan Siber & Jaringan*, *UI/UX Design System*, *Startup Pitching*, dan *Cloud VPS Deployment*.
   - Filter kategori dan pencarian live.
   - Checklist silabus topik interaktif yang langsung menyimpan progres siswa (0-100%) ke database.

4. **Ujian & Kuis Interaktif dengan Penilaian Server**:
   - Countdown timer 30 menit dengan auto-submit saat waktu habis.
   - Palet nomor soal interaktif (Terjawab, Ragu-ragu, Belum).
   - Penilaian otomatis di sisi server (anti-cheat di sisi klien) dan feedback kelulusan instan.

5. **Sertifikat & Transkrip Akademik 2 Halaman (A4 Bebas Overflow)**:
   - **Halaman 1**: Piagam Sertifikat Kelulusan Resmi dengan ornamen klasik, nomor unik (`BDC-CERT-2026-99482-SEC`), dan penandatangan resmi:
     - **Bagas Triaji, S.Kom., M.Kom.** (Kemahasiswaan UTDI, Yogyakarta)
     - **Nurul Layli** (PIC Program BDC)
   - **Halaman 2**: Transkrip Akademik Rinci (rincian modul SEC-501 s.d SEC-504, jam, nilai, dan Capstone Project).
   - Mode Cetak A4 presisi (`window.print()`) dan QR Code verifikasi dinamis.

6. **Pangkalan Verifikasi Kredensial Publik (`/verify`)**:
   - Dapat diakses bebas oleh siapa saja (perusahaan/publik) tanpa harus login.
   - Verifikasi keaslian berdasarkan Nomor Sertifikat, Nomor Transkrip, atau NIM.

7. **Panel Admin & Instruktur (`/admin`)**:
   - Tema gelap Navy khas Dasbor Admin.
   - Ringkasan analitik akademik (Total mahasiswa, tingkat kelulusan, modul aktif).
   - Manajemen pembukaan kunci sertifikat (*lock/unlock*).
   - Editor data penandatangan resmi dan periode akademik.

---

## 🛠️ Panduan Instalasi Lokal

### 1. Prasyarat
- Node.js versi 18.17+ atau 20+
- npm atau pnpm

### 2. Jalankan di Lingkungan Lokal
```bash
# Clone repositori dan masuk ke folder
git clone https://github.com/arraffinh/web-bdc.git
cd web-bdc

# Pasang dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Menghubungkan ke Supabase (Free Tier)

1. Buat proyek baru di [supabase.com](https://supabase.com) (Pilih region terdekat: *Singapore*).
2. Buka **SQL Editor** di dashboard Supabase.
3. Jalankan isi berkas [`supabase/schema.sql`](supabase/schema.sql) untuk membuat seluruh tabel dan kebijakan keamanan RLS.
4. Jalankan isi berkas [`supabase/seed.sql`](supabase/seed.sql) untuk memasukkan data awal.
5. Salin URL dan Kunci API dari menu **Project Settings > API**.
6. Buat file `.env.local` di root proyek:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

*Catatan: Jika variabel lingkungan belum diatur, aplikasi secara cerdas menggunakan in-memory state engine bawaan sehingga seluruh alur halaman dapat dijalankan dan diuji 100% tanpa kendala.*

---

## ☁️ Deployment ke Vercel (Free Tier / Hobby)

1. Push repositori ini ke akun GitHub Anda.
2. Masuk ke [vercel.com](https://vercel.com) dan klik **Add New Project > Import Git Repository**.
3. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Klik **Deploy**. Proyek Anda akan langsung live dengan domain `*.vercel.app`.

---

## 👤 Akun Uji Coba Cepat (Demo Accounts)

Untuk mempermudah pengujian, halaman login menyediakan tombol **Demo Akun Instan**:

- **Mahasiswa (Siswa)**:
  - **Nama**: Siti Rahmawati
  - **NIM**: `255720056`
  - **Email**: `255720056@students.utdi.ac.id`
  - **Password**: `secretPassword123`
- **Admin (Kemahasiswaan)**:
  - **Nama**: .
  - **Email**: ``
  - **Password**: `adminPassword123`

---

## 🏛️ Lisensi & Hak Cipta
&copy; 2026 Business Dev Club (BDC) — Universitas Teknologi Digital Indonesia (UTDI), Yogyakarta.
