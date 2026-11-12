-- ==============================================================================
-- BDC Sessions, Attendance & Assignments Extension Schema
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.meet_sessions (
  id TEXT PRIMARY KEY,
  course_id TEXT,
  course_title TEXT NOT NULL,
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  meet_url TEXT NOT NULL,
  qr_token TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  session_title TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  nim_id TEXT NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT now(),
  method TEXT NOT NULL DEFAULT 'qr_scanner' CHECK (method IN ('qr_scanner', 'token_code')),
  points_earned INT NOT NULL DEFAULT 50
);

CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY,
  course_id TEXT,
  course_title TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  max_score INT NOT NULL DEFAULT 100,
  submission_format TEXT NOT NULL DEFAULT 'github_or_drive'
);

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  nim_id TEXT NOT NULL,
  submission_url TEXT NOT NULL,
  notes TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ DEFAULT now(),
  score NUMERIC(5,2),
  feedback TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'graded', 'late'))
);

ALTER TABLE public.meet_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meet_sessions read policy" ON public.meet_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "attendance_records read policy" ON public.attendance_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "assignments read policy" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "assignment_submissions read policy" ON public.assignment_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "assignment_submissions write policy" ON public.assignment_submissions FOR ALL TO authenticated USING (true);
