-- ==============================================================================
-- BDC Hub & Community Academy - Supabase Database Schema
-- Penyesuaian Kolom NIM, Periode 2026/2027, Lokasi Yogyakarta, & Penandatangan
-- ==============================================================================

-- 1. Penyesuaian Kolom pada Tabel Profiles (Migrasi NIP -> NIM / ID)
DO $$
BEGIN
  -- Jika kolom 'nip' ada, rename menjadi 'nim_id'
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'nip'
  ) THEN
    ALTER TABLE public.profiles RENAME COLUMN nip TO nim_id;
  END IF;

  -- Jika kolom 'nim' ada tapi 'nim_id' belum ada, tambahkan nim_id dan salin nilainya
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'nim_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN nim_id TEXT;
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'nim'
    ) THEN
      UPDATE public.profiles SET nim_id = nim WHERE nim_id IS NULL;
    END IF;
  END IF;

  -- Tambahkan kolom 'period' dengan default '2026/2027' jika belum ada
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'period'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN period TEXT NOT NULL DEFAULT '2026/2027';
  END IF;

  -- Tambahkan kolom 'location' dengan default 'Yogyakarta' jika belum ada
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN location TEXT NOT NULL DEFAULT 'Yogyakarta';
  END IF;
END $$;


-- 2. TABEL CERTIFICATES (Sertifikat & Transkrip Komunitas BDC)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles (id) ON DELETE CASCADE,
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
  completion_status TEXT NOT NULL DEFAULT 'LULUS (KOMPETEN)',
  cohort_badge TEXT DEFAULT 'TOP 3% COHORT',

  -- Capstone Project (BDC Hub) Details
  capstone_title TEXT NOT NULL DEFAULT 'BDC Hub (Web Presensi & Pembelajaran Community)',
  capstone_hours NUMERIC(5,1) NOT NULL DEFAULT 16.5,
  capstone_score NUMERIC(5,2) NOT NULL DEFAULT 98.00,
  capstone_grade TEXT NOT NULL DEFAULT 'A+',
  capstone_status TEXT NOT NULL DEFAULT 'Lulus Paripurna',

  -- Official Signatories
  signatory_1_name TEXT NOT NULL DEFAULT 'Bagas Triaji, S.Kom., M.Kom.',
  signatory_1_role TEXT NOT NULL DEFAULT 'Kemahasiswaan',
  signatory_2_name TEXT NOT NULL DEFAULT 'Nurul Layli',
  signatory_2_role TEXT NOT NULL DEFAULT 'PIC Program BDC',

  -- Modules and Coursework payload
  modules_json JSONB NOT NULL DEFAULT '[
    {"code":"SEC-501","title":"Dasar Kriptografi Modern & Enkripsi Kunci Asimetris","hours":10.0,"score":96.0,"grade":"A","status":"Tuntas (Kompeten)"},
    {"code":"SEC-502","title":"Proteksi Endpoint, Web App Sec & Mitigasi XSS","hours":12.0,"score":98.0,"grade":"A+","status":"Unggul (Paripurna)"},
    {"code":"SEC-503","title":"Audit Regulasi ISO/IEC 27001:2022 & Framework Tata Kelola","hours":12.0,"score":94.5,"grade":"A","status":"Tuntas (Kompeten)"},
    {"code":"SEC-504","title":"Incident Response, Forensik Siber & Cloud SOC Telemetri","hours":14.0,"score":97.0,"grade":"A","status":"Tuntas (Kompeten)"}
  ]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indeks untuk lookup cepat berdasarkan nomor sertifikat dan NIM
CREATE INDEX IF NOT EXISTS idx_certificates_cert_no ON public.certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_nim ON public.certificates(nim_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Policy 1: Publik dapat membaca sertifikat untuk verifikasi kredensial via nomor sertifikat atau NIM
DROP POLICY IF EXISTS "certificates_public_verify" ON public.certificates;
CREATE POLICY "certificates_public_verify" ON public.certificates
  FOR SELECT
  USING (true);

-- Policy 2: Admin dapat mengelola (insert, update, delete) seluruh sertifikat
DROP POLICY IF EXISTS "certificates_admin_manage" ON public.certificates;
CREATE POLICY "certificates_admin_manage" ON public.certificates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 4. SEED DATA DEFAULT (Sesuai Kredensial Resmi BDC)
INSERT INTO public.certificates (
  certificate_number,
  transcript_number,
  recipient_name,
  nim_id,
  cohort,
  program_title,
  period,
  location,
  issue_date,
  total_hours,
  avg_score,
  completion_status,
  cohort_badge,
  capstone_title,
  capstone_hours,
  capstone_score,
  capstone_grade,
  capstone_status,
  signatory_1_name,
  signatory_1_role,
  signatory_2_name,
  signatory_2_role
) VALUES (
  'BDC-CERT-2026-99482-SEC',
  'BDC-TRX-2026-99482',
  'Siti Rahmawati',
  '255720056',
  'Cohort VI Nasional',
  'Cybersecurity Compliance & ISO/IEC 27001 Enterprise Defense',
  '2026/2027',
  'Yogyakarta',
  '2026-03-24',
  64.5,
  96.40,
  'LULUS (KOMPETEN)',
  'TOP 3% COHORT',
  'BDC Hub (Web Presensi & Pembelajaran Community)',
  16.5,
  98.00,
  'A+',
  'Lulus Paripurna',
  'Bagas Triaji, S.Kom., M.Kom.',
  'Kemahasiswaan',
  'Nurul Layli',
  'PIC Program BDC'
) ON CONFLICT (certificate_number) DO UPDATE SET
  transcript_number = EXCLUDED.transcript_number,
  recipient_name = EXCLUDED.recipient_name,
  nim_id = EXCLUDED.nim_id,
  period = EXCLUDED.period,
  location = EXCLUDED.location,
  signatory_1_name = EXCLUDED.signatory_1_name,
  signatory_1_role = EXCLUDED.signatory_1_role,
  signatory_2_name = EXCLUDED.signatory_2_name,
  signatory_2_role = EXCLUDED.signatory_2_role,
  total_hours = EXCLUDED.total_hours,
  avg_score = EXCLUDED.avg_score,
  completion_status = EXCLUDED.completion_status,
  capstone_title = EXCLUDED.capstone_title,
  capstone_hours = EXCLUDED.capstone_hours,
  capstone_score = EXCLUDED.capstone_score,
  updated_at = now();
