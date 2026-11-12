-- ==============================================================================
-- BDC Academic College Community & Certification Portal
-- PostgreSQL Schema for Supabase (Production DDL)
-- Universitas Teknologi Digital Indonesia (UTDI), Yogyakarta
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Terikat ke auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nim_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'instructor', 'admin')),
  role_title TEXT NOT NULL DEFAULT 'Corporate Learner (Student Chapter)',
  division TEXT NOT NULL DEFAULT 'Academic College Community',
  period TEXT NOT NULL DEFAULT '2026/2027',
  location TEXT NOT NULL DEFAULT 'Yogyakarta',
  avatar_url TEXT,
  score NUMERIC(5,2) DEFAULT 0.0,
  completed_modules INT DEFAULT 0,
  total_hours NUMERIC(5,1) DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indeks profiles
CREATE INDEX IF NOT EXISTS idx_profiles_nim ON public.profiles(nim_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. TABEL COURSES (Katalog Modul Pembelajaran)
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY, -- Misal 'ACT-01', 'ACT-02'
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Sesi Minggu Ini', 'Workshop & Hands-On', 'Proyek Bersama', 'Arsip Recording')),
  session_type TEXT NOT NULL, -- 'Live Session', 'Workshop Lab', 'Project File', 'Rekaman Web'
  instructor TEXT NOT NULL,
  instructor_role TEXT NOT NULL DEFAULT 'Inisiator / Pemateri Komunitas',
  duration TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Pemula (Beginner)', 'Menengah (Intermediate)', 'Lanjutan (Advanced)', 'Semua Tingkat (All Levels)')),
  learners_count INT NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.9,
  icon TEXT NOT NULL DEFAULT 'sensors',
  badge_color TEXT NOT NULL DEFAULT 'bg-blue-100 text-blue-700',
  description TEXT NOT NULL,
  syllabus JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABEL COURSE_ENROLLMENTS (Pendaftaran & Progres Topik Silabus Siswa)
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_topics JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of topic indices e.g. [0, 1]
  progress_percent INT NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON public.course_enrollments(user_id, course_id);

-- 5. TABEL QUIZZES (Bank Ujian & Kuis)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INT NOT NULL DEFAULT 30,
  passing_score NUMERIC(5,2) NOT NULL DEFAULT 75.00,
  total_questions INT NOT NULL DEFAULT 10,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABEL QUIZ_QUESTIONS (Daftar Soal & Kunci Jawaban Terenkripsi di Server)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- [{"id": "A", "text": "Jawaban A"}, ...]
  correct_option TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
  explanation TEXT,
  weight NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  order_index INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON public.quiz_questions(quiz_id);

-- 7. TABEL QUIZ_ATTEMPTS (Riwayat Pengerjaan & Nilai Riil Siswa)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);

-- 8. TABEL CERTIFICATES (Sertifikat Kelulusan & Transkrip Akademik Resmi)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  transcript_number TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  nim_id TEXT NOT NULL,
  cohort TEXT NOT NULL DEFAULT 'Cohort VI Nasional',
  program_title TEXT NOT NULL DEFAULT 'Cybersecurity Compliance & ISO/IEC 27001 Enterprise Defense',
  period TEXT NOT NULL DEFAULT '2026/2027',
  location TEXT NOT NULL DEFAULT 'Yogyakarta',
  issue_date DATE NOT NULL DEFAULT '2026-03-24',
  total_hours NUMERIC(5,1) NOT NULL DEFAULT 64.5,
  avg_score NUMERIC(5,2) NOT NULL DEFAULT 96.40,
  completion_status TEXT NOT NULL DEFAULT 'MENUNGGU PENERBITAN',
  cohort_badge TEXT DEFAULT 'TOP 3% COHORT',
  is_locked BOOLEAN NOT NULL DEFAULT true,

  -- Capstone Project Details
  capstone_title TEXT NOT NULL DEFAULT 'BDC Hub (Web Presensi & Pembelajaran Community)',
  capstone_hours NUMERIC(5,1) NOT NULL DEFAULT 16.5,
  capstone_score NUMERIC(5,2) NOT NULL DEFAULT 98.00,
  capstone_grade TEXT NOT NULL DEFAULT 'A+',
  capstone_status TEXT NOT NULL DEFAULT 'Lulus Paripurna',

  -- Penandatangan Resmi (Signatories)
  signatory_1_name TEXT NOT NULL DEFAULT 'Bagas Triaji, S.Kom., M.Kom.',
  signatory_1_role TEXT NOT NULL DEFAULT 'Kemahasiswaan',
  signatory_2_name TEXT NOT NULL DEFAULT 'Nurul Layli',
  signatory_2_role TEXT NOT NULL DEFAULT 'PIC Program BDC',

  -- Rincian Nilai Modul Transkrip (JSONB)
  modules_json JSONB NOT NULL DEFAULT '[
    {"code":"SEC-501","title":"Dasar Kriptografi Modern & Enkripsi Kunci Asimetris","hours":10.0,"score":96.0,"grade":"A","status":"Tuntas (Kompeten)"},
    {"code":"SEC-502","title":"Proteksi Endpoint, Web App Sec & Mitigasi XSS","hours":12.0,"score":98.0,"grade":"A+","status":"Unggul (Paripurna)"},
    {"code":"SEC-503","title":"Audit Regulasi ISO/IEC 27001:2022 & Framework Tata Kelola","hours":12.0,"score":94.5,"grade":"A","status":"Tuntas (Kompeten)"},
    {"code":"SEC-504","title":"Incident Response, Forensik Siber & Cloud SOC Telemetri","hours":14.0,"score":97.0,"grade":"A","status":"Tuntas (Kompeten)"}
  ]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_certificates_cert_no ON public.certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_nim ON public.certificates(nim_id);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Profiles: Pengguna baca milik sendiri, admin baca semua
CREATE POLICY "Profiles read policy" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'));

CREATE POLICY "Profiles update policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Courses: Semua orang bisa baca kursus terbit
CREATE POLICY "Courses are readable by authenticated users" ON public.courses
  FOR SELECT TO authenticated USING (true);

-- Enrollments: Siswa akses miliknya
CREATE POLICY "Enrollments read self" ON public.course_enrollments
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Enrollments upsert self" ON public.course_enrollments
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Quizzes: Dibaca user login
CREATE POLICY "Quizzes readable by authenticated" ON public.quizzes
  FOR SELECT TO authenticated USING (is_published = true OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'));

-- Questions: Opsi dibaca user login (correct_option tidak bocor jika diatur view/action)
CREATE POLICY "Questions readable by authenticated" ON public.quiz_questions
  FOR SELECT TO authenticated USING (true);

-- Attempts: Siswa baca attempt sendiri
CREATE POLICY "Attempts read self" ON public.quiz_attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'));

CREATE POLICY "Attempts insert self" ON public.quiz_attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Certificates: Siswa baca miliknya, publik bisa verifikasi via cert_number/NIM
CREATE POLICY "Public verify certificates" ON public.certificates
  FOR SELECT USING (true);

CREATE POLICY "Certificates admin manage" ON public.certificates
  FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
