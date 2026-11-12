<div align="center">

# 🎓 Business Dev Club — BDC Portal

**Portal Akademik · Presensi Barcode · Sertifikasi Digital**

Universitas Teknologi Digital Indonesia (UTDI) — Yogyakarta

[![Live](https://img.shields.io/badge/live-bdcutdi.vercel.app-062A78?style=for-the-badge&logo=vercel&logoColor=white)](https://bdcutdi.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087EA8?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Copyright](https://img.shields.io/badge/copyright-2026%20BDC%20UTDI-000741?style=for-the-badge)](#-lisensi--hak-cipta)

</div>

---

## ✨ Fitur Unggulan

### 🔐 Autentikasi & Keamanan
- Login dengan **NIM** (`245720024`) atau **email kampus** — validasi ketat domain **`@students.utdi.ac.id`**.
- Sesi berbasis *HTTP-only cookie* via `@supabase/ssr` + proteksi rute di **Next.js Middleware**.
- Pendaftaran mandiri dengan pemilihan peminatan — seluruh learner otomatis berlabel **`Corporate Learner (Student Chapter)`**.

### 📚 Modul, Silabus & Tugas
- **5 modul pembelajaran** dengan silabus *checklist* interaktif — progres (0–100%) langsung tersimpan ke database.
- **Tugas & Essay** dengan pengumpulan online dan **penilaian di sisi server** (nilai tertinggi menjadi skor kompetensi).

### 📡 Presensi Barcode Realtime
- Pemindai QR lewat **kamera perangkat** (`html5-qrcode`) atau **input token manual** — contoh: `BDC-494`.
- Token pendek berputar otomatis tiap 30 detik, +100 XP per kehadiran, riwayat scan tervalidasi.

### 🎥 Mode Proyektor (Live Presentation)
- Satu klik **"Layar Proyektor QR"** → layar **fullscreen otomatis** & **sidebar sembunyi otomatis**.
- QR raksasa untuk layar kelas, token alternatif, serta **daftar hadir realtime** (sinkron tiap 5 detik).

### 🏆 Papan Skor & Dasbor
- Rank kehadiran & XP, metrik capstone, badge status sertifikat, dan tautan **grup WhatsApp komunitas**.

### 📜 Sertifikat & Verifikasi
- **Sertifikat diterbitkan manual oleh admin** (bukan otomatis karena tuntas) — alur "Terbitkan / Tarik Kembali" di panel admin.
- Dokumen **2 halaman A4**: Piagam Kelulusan + Transkrip Akademik, nomor unik, QR verifikasi, mode cetak presisi.
- Portal verifikasi publik **`/verify`** — dapat dicek siapa saja berdasarkan Nomor Sertifikat, Transkrip, atau NIM tanpa login.

### 🛡️ Panel Admin & Instruktur (`/admin`)
- Analitik akademik, manajemen sesi & QR proyektor, data mahasiswa, penilaian tugas, manajemen pengguna, dan editor penandatangan sertifikat.

---

## 🛠️ Tech Stack

| Lapisan | Teknologi |
|---|---|
| Framework | **Next.js 16** (App Router, Server Actions) |
| UI | **React 19**, **Tailwind CSS 3**, ikon `lucide-react` |
| Bahasa | **TypeScript** (strict) |
| Data | **Supabase** — PostgreSQL + Supabase Auth |
| QR / Kamera | `qrcode` (generasi) · `html5-qrcode` (pemindaian) |
| Hosting | **Vercel** (edge, free tier) |

---

## 📁 Struktur Repositori

```
web-bdc/
├── src/
│   ├── app/                  # App Router: (auth), (portal), /admin, /verify
│   ├── components/           # UI bersama, sertifikat, scanner, panel admin
│   ├── lib/                  # Server Actions, store in-memory + hydrate DB, supabase client
│   └── middleware.ts         # Proteksi rute & sesi
├── public/                   # Logo, ilustrasi landing, aset lingkungan
├── supabase/                 # schema.sql · seed.sql · skrip patch migrasi
├── legacy/                   # ⚠ Arsip versi HTML statis (sebelum migrasi Next.js)
├── docs/                     # Spesifikasi & rencana migrasi
└── scripts/                  # Skrip verifikasi fitur & seed Supabase
```

---

## 🚀 Menjalankan Secara Lokal

### 1. Prasyarat
- **Node.js 18.17+** (disarankan 20+)
- `npm`

### 2. Instalasi

```bash
git clone https://github.com/llaayyiii/web-bdc.git
cd web-bdc
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Menghubungkan ke Supabase (Free Tier)

1. Buat proyek baru di [supabase.com](https://supabase.com) (region terdekat: *Singapore*).
2. Buka **SQL Editor**, jalankan [`supabase/schema.sql`](supabase/schema.sql) lalu [`supabase/seed.sql`](supabase/seed.sql).
3. Salin **URL** & **Kunci API** dari *Project Settings → API*.
4. Buat file `.env.local` di root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

> 💡 Tanpa variabel lingkungan, aplikasi tetap berjalan penuh memakai *in-memory state engine* bawaan — cocok untuk uji coba tanpa database.

---

## ☁️ Deployment ke Vercel

1. Push repositori ke GitHub Anda.
2. Di [vercel.com](https://vercel.com): **Add New Project → Import Git Repository**.
3. Tambahkan ketiga *environment variables* di atas.
4. **Deploy** — situs live di domain `*.vercel.app`.

---

## 👤 Akun Demo

| Peran | Email | Password |
|---|---|---|
| 🎓 Mahasiswa | `arrafi.nur24@students.utdi.ac.id` | `secretPassword123` |
| 🛡️ Admin | `nurul.layli25@students.utdi.ac.id` | `Nurul123` |

> Mahasiswa lain: `ananda.enjelina25@students.utdi.ac.id` (password sama).

---

## 🎨 Palet Warna & Tipografi

Antarmuka bertema *retro-academic* dengan token warna kustom Tailwind:

| Token | Hex | Peran |
|---|---|---|
| `bdc-surface` | `#EFF0F0` | Latar halaman |
| `bdc-paper` | `#FAF9F2` | Kartu & kertas |
| `bdc-yellow` | `#EEDD55` | Aksen badge & sorotan |
| `bdc-gold` | `#E9AD17` | Rating, seal, detail emas |
| `bdc-blue` | `#095BAF` | Tombol aksi utama |
| `bdc-navy` | `#062A78` | Kartu gelap & header |
| `bdc-midnight` | `#000741` | Teks kontras & bayangan *retro* |

Tipografi: **Space Grotesk** (judul & aksen *display*) · **Plus Jakarta Sans** (teks) · **JetBrains Mono** (label & data).

---

## 📜 Lisensi & Hak Cipta

&copy; 2026 Business Dev Club (BDC) — Universitas Teknologi Digital Indonesia (UTDI), Yogyakarta.
