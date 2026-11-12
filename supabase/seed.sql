-- ==============================================================================
-- BDC Academic College Community & Certification Portal
-- Initial Real Seed Data (UTDI Yogyakarta)
-- ==============================================================================

-- 1. QUIZZES SEED (Uji Kompetensi BDC)
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

-- 2. QUIZ QUESTIONS SEED (10 Soal Riil)
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
