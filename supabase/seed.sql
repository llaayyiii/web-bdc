-- ==============================================================================
-- BDC Academic College Community & Certification Portal
-- Initial Real Seed Data (UTDI Yogyakarta)
-- ==============================================================================

-- 1. COURSES SEED (5 Modul Pembelajaran Nyata BDC)
INSERT INTO public.courses (id, title, category, session_type, instructor, instructor_role, duration, level, learners_count, rating, icon, badge_color, description, syllabus)
VALUES
(
  'ACT-01',
  'Ngoding Bareng: Membangun Web App Interaktif dari Nol',
  'Sesi Minggu Ini',
  'Live Session',
  'Dr. Evelyn Vance & Tim Web Dev',
  'Inisiator / Pemateri Komunitas',
  'Live Session (2 Jam)',
  'Pemula (Beginner)',
  340,
  4.9,
  'Code',
  'bg-rose-100 text-rose-700',
  'Sesi interaktif mingguan membedah struktur HTML5, styling Tailwind, dan logika JavaScript interaktif langsung dengan live coding bersama anggota.',
  '[
    "Struktur Dasar Web Modern & Best Practice HTML5",
    "Live Coding: Styling Responsive dengan Tailwind CSS",
    "Interaktivitas & DOM Manipulation JavaScript",
    "Tanya Jawab & Bedah Kode Bareng Anggota Komunitas"
  ]'::jsonb
),
(
  'ACT-02',
  'Workshop Hands-On: Audit Keamanan Akun & Pengujian Jaringan',
  'Workshop & Hands-On',
  'Workshop Lab',
  'Ir. Hendra Saputra, M.Kom',
  'Inisiator / Pemateri Komunitas',
  'Workshop Lab (3 Jam)',
  'Semua Tingkat (All Levels)',
  420,
  4.9,
  'Terminal',
  'bg-emerald-100 text-emerald-700',
  'Praktik langsung simulasi mendeteksi tautan phishing, analisis lalu lintas Wi-Fi rentan, serta konfigurasi 2FA hardware key.',
  '[
    "Simulasi Uji Coba Serangan Social Engineering & Phishing",
    "Inspeksi Jaringan Wi-Fi Publik dengan Wireshark Dasar",
    "Langkah Proteksi Password Manager & Multi-Factor Auth",
    "Checklist Keamanan Siber Mandiri untuk Laptop & Ponsel"
  ]'::jsonb
),
(
  'ACT-03',
  'Proyek Kolaborasi: UI/UX Open Source Design System Komunitas',
  'Proyek Bersama',
  'Project File',
  'Maya Kartika, S.Ds',
  'Inisiator / Pemateri Komunitas',
  'Project File',
  'Pemula (Beginner)',
  280,
  4.8,
  'FolderArchive',
  'bg-purple-100 text-purple-700',
  'Repositori aset desain, komponen Figma terbuka, dan panduan kontribusi bareng untuk membangun UI kit resmi komunitas kampus.',
  '[
    "Panduan Kontribusi & Tata Kelola Figma Team Workspace",
    "Penyusunan Desain Token: Palet Warna & Tipografi",
    "Pembuatan Komponen Tombol, Input & Dialog Reusable",
    "Review Bersama & Penggabungan Aset Kontributor"
  ]'::jsonb
),
(
  'ACT-04',
  'Rekaman Sharing: Memulai Startup Digital & Pitching ke Inkubator',
  'Arsip Recording',
  'Rekaman Web',
  'Rian Danuarta, MBA',
  'Inisiator / Pemateri Komunitas',
  'Rekaman Web (1.5 Jam)',
  'Pemula (Beginner)',
  510,
  4.9,
  'PlayCircle',
  'bg-blue-100 text-blue-700',
  'Arsip video sharing alumni mengenai langkah validasi ide produk teknologi, menyusun Business Model Canvas, dan kiat lolos seleksi pendanaan inkubator.',
  '[
    "Rekaman Bagian 1: Validasi Masalah & Customer Interview",
    "Rekaman Bagian 2: Menyusun Pitch Deck 10 Slide Efektif",
    "Template Dokumen Pitching & Lembar Evaluasi Bisnis",
    "Sesi Q&A Diskusi Pengalaman Founder Startup Mahasiswa"
  ]'::jsonb
),
(
  'ACT-05',
  'Deploy Bareng: Hosting Web & Domain Gratis Menggunakan Cloud VPS',
  'Workshop & Hands-On',
  'Workshop Lab',
  'Arya Pratama, S.Kom',
  'Inisiator / Pemateri Komunitas',
  'Workshop Lab (2.5 Jam)',
  'Menengah (Intermediate)',
  390,
  4.8,
  'Cloud',
  'bg-amber-100 text-amber-700',
  'Panduan langkah demi langkah mem-publish aplikasi web ke server cloud Linux, konfigurasi DNS domain gratis, dan sertifikat SSL Let\'s Encrypt.',
  '[
    "Pengenalan Terminal Linux & SSH Key Authentication",
    "Instalasi Nginx Web Server & Konfigurasi Virtual Host",
    "Pemasangan Gratis SSL/TLS HTTPS dengan Certbot",
    "Otomasi Deploy Git Webhook Sederhana"
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  syllabus = EXCLUDED.syllabus;

-- 2. QUIZZES SEED (Uji Kompetensi BDC)
INSERT INTO public.quizzes (id, title, description, time_limit_minutes, passing_score, total_questions, is_published)
VALUES
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  'Uji Evaluasi Akhir: Keamanan Siber & Pemrograman Web Terintegrasi',
  'Ujian komprehensif 10 butir soal standar kompetensi BDC UTDI meliputi kriptografi modern, keamanan aplikasi web, mitigasi XSS/CSRF, serta tata kelola ISO 27001.',
  30,
  75.00,
  10,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 3. QUIZ QUESTIONS SEED (10 Soal Riil)
INSERT INTO public.quiz_questions (quiz_id, order_index, question_text, options, correct_option, weight)
VALUES
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  1,
  'Metode enkripsi mana yang menggunakan sepasang kunci publik (public key) dan kunci privat (private key) untuk mengamankan transmisi data?',
  '[
    {"id": "A", "text": "Enkripsi Simetris (AES-256)"},
    {"id": "B", "text": "Enkripsi Asimetris (RSA / ECC)"},
    {"id": "C", "text": "Fungsi Hash Kriptografis (SHA-256)"},
    {"id": "D", "text": "Base64 Encoding"}
  ]'::jsonb,
  'B',
  1.0
),
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  2,
  'Serangan siber di mana penyerang menyisipkan script berbahaya ke dalam halaman web yang kemudian dieksekusi di browser korban dikenal dengan istilah?',
  '[
    {"id": "A", "text": "SQL Injection (SQLi)"},
    {"id": "B", "text": "Cross-Site Scripting (XSS)"},
    {"id": "C", "text": "Distributed Denial of Service (DDoS)"},
    {"id": "D", "text": "Man-in-the-Middle (MitM)"}
  ]'::jsonb,
  'B',
  1.0
),
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  3,
  'Langkah mitigasi paling efektif untuk mencegah serangan SQL Injection pada aplikasi modern adalah?',
  '[
    {"id": "A", "text": "Menggunakan Prepared Statements dan Parameterized Queries"},
    {"id": "B", "text": "Melakukan enkripsi MD5 pada seluruh input string"},
    {"id": "C", "text": "Menghapus tanda spasi dari query database"},
    {"id": "D", "text": "Menonaktifkan firewall server database"}
  ]'::jsonb,
  'A',
  1.0
),
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  4,
  'Standar internasional terkemuka untuk Sistem Manajemen Keamanan Informasi (SMKI / ISMS) adalah?',
  '[
    {"id": "A", "text": "ISO 9001:2015"},
    {"id": "B", "text": "ISO/IEC 27001:2022"},
    {"id": "C", "text": "IEEE 802.11"},
    {"id": "D", "text": "RFC 2616"}
  ]'::jsonb,
  'B',
  1.0
),
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  5,
  'Dalam konsep keamanan informasi, prinsip "CIA Triad" merupakan singkatan dari?',
  '[
    {"id": "A", "text": "Confidentiality, Integrity, Availability"},
    {"id": "B", "text": "Control, Identification, Authentication"},
    {"id": "C", "text": "Compliance, Inspection, Authorization"},
    {"id": "D", "text": "Cryptography, Infrastructure, Analytics"}
  ]'::jsonb,
  'A',
  1.0
),
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  6,
  'Manakah atribut cookie berikut yang berfungsi mencegah script JavaScript di sisi browser membaca token autentikasi sesi?',
  '[
    {"id": "A", "text": "SameSite=Lax"},
    {"id": "B", "text": "HttpOnly"},
    {"id": "C", "text": "Secure"},
    {"id": "D", "text": "Domain=.utdi.ac.id"}
  ]'::jsonb,
  'B',
  1.0
),
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  7,
  'Di Next.js App Router, pemanggilan database atau operasi sensitif disarankan diletakkan pada komponen jenis apa?',
  '[
    {"id": "A", "text": "Client Component dengan useLayoutEffect"},
    {"id": "B", "text": "Server Component / Server Actions"},
    {"id": "C", "text": "Public static JSON file"},
    {"id": "D", "text": "HTML inline script"}
  ]'::jsonb,
  'B',
  1.0
),
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  8,
  'Protokol jaringan yang digunakan untuk mengamankan pertukaran data web melalui saluran terenkripsi SSL/TLS adalah?',
  '[
    {"id": "A", "text": "HTTP"},
    {"id": "B", "text": "FTP"},
    {"id": "C", "text": "HTTPS"},
    {"id": "D", "text": "Telnet"}
  ]'::jsonb,
  'C',
  1.0
),
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  9,
  'Apa fungsi utama dari mekanisme Row Level Security (RLS) pada PostgreSQL Supabase?',
  '[
    {"id": "A", "text": "Mempercepat pengurutan kolom string"},
    {"id": "B", "text": "Membatasi akses baris data secara spesifik berdasarkan token identitas pengguna"},
    {"id": "C", "text": "Menghapus data duplikat secara otomatis"},
    {"id": "D", "text": "Mengompresi file media di storage"}
  ]'::jsonb,
  'B',
  1.0
),
(
  'e2b4f9d0-1234-5678-90ab-cdef12345678',
  10,
  'Faktor pembuktian identitas yang menggabungkan kata sandi (knowledge) dengan token OTP di ponsel (possession) disebut?',
  '[
    {"id": "A", "text": "Single Sign-On (SSO)"},
    {"id": "B", "text": "Multi-Factor Authentication (MFA / 2FA)"},
    {"id": "C", "text": "Role-Based Access Control (RBAC)"},
    {"id": "D", "text": "Biometric Spoofing"}
  ]'::jsonb,
  'B',
  1.0
);
