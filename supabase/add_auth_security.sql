-- Penguatan autentikasi BDC. Semua perubahan bersifat aditif.
-- Jalankan sekali melalui Supabase SQL Editor setelah meninjau perubahan ini.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.password_reset_send_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_send_log_email_time
  ON public.password_reset_send_log (email, created_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_send_log_ip_time
  ON public.password_reset_send_log (ip, created_at);

ALTER TABLE public.password_reset_send_log ENABLE ROW LEVEL SECURITY;

-- Tambahan policy RESTRICTIVE memperketat policy lama tanpa menghapus atau
-- menulis ulang data produksi. Seluruh mutasi aplikasi dilakukan service role.
-- CREATE POLICY tidak mendukung IF NOT EXISTS, jadi dijaga lewat pg_policies
-- agar skrip ini tetap aman dijalankan berulang.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='profiles'
      AND policyname='Profiles update manager only'
  ) THEN
    CREATE POLICY "Profiles update manager only"
      ON public.profiles AS RESTRICTIVE FOR UPDATE TO authenticated
      USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
      WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='quiz_questions'
      AND policyname='Quiz question manager read only'
  ) THEN
    CREATE POLICY "Quiz question manager read only"
      ON public.quiz_questions AS RESTRICTIVE FOR SELECT TO authenticated
      USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='quiz_attempts'
      AND policyname='Quiz attempt manager write only'
  ) THEN
    CREATE POLICY "Quiz attempt manager write only"
      ON public.quiz_attempts AS RESTRICTIVE FOR INSERT TO authenticated
      WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='meet_sessions'
      AND policyname='Meet session manager read only'
  ) THEN
    CREATE POLICY "Meet session manager read only"
      ON public.meet_sessions AS RESTRICTIVE FOR SELECT TO authenticated
      USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='attendance_records'
      AND policyname='Attendance record scoped read'
  ) THEN
    CREATE POLICY "Attendance record scoped read"
      ON public.attendance_records AS RESTRICTIVE FOR SELECT TO authenticated
      USING (
        user_id = auth.uid()::text
        OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='assignment_submissions'
      AND policyname='Assignment submission scoped read'
  ) THEN
    CREATE POLICY "Assignment submission scoped read"
      ON public.assignment_submissions AS RESTRICTIVE FOR SELECT TO authenticated
      USING (
        user_id = auth.uid()::text
        OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='assignment_submissions'
      AND policyname='Assignment submission manager insert'
  ) THEN
    CREATE POLICY "Assignment submission manager insert"
      ON public.assignment_submissions AS RESTRICTIVE FOR INSERT TO authenticated
      WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='assignment_submissions'
      AND policyname='Assignment submission manager update'
  ) THEN
    CREATE POLICY "Assignment submission manager update"
      ON public.assignment_submissions AS RESTRICTIVE FOR UPDATE TO authenticated
      USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'))
      WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='assignment_submissions'
      AND policyname='Assignment submission manager delete'
  ) THEN
    CREATE POLICY "Assignment submission manager delete"
      ON public.assignment_submissions AS RESTRICTIVE FOR DELETE TO authenticated
      USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'instructor'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.consume_otp_send_quota(
  p_email TEXT,
  p_ip TEXT,
  p_window_ms INTEGER,
  p_email_limit INTEGER,
  p_ip_limit INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window INTERVAL;
BEGIN
  IF p_email IS NULL OR p_email = '' OR p_window_ms <= 0 OR p_email_limit <= 0 OR p_ip_limit <= 0 THEN
    RETURN FALSE;
  END IF;

  v_window := p_window_ms * INTERVAL '1 millisecond';
  PERFORM pg_advisory_xact_lock(hashtextextended('otp-email:' || lower(p_email), 0));
  IF p_ip IS NOT NULL AND p_ip <> '' THEN
    PERFORM pg_advisory_xact_lock(hashtextextended('otp-ip:' || p_ip, 0));
  END IF;

  IF (SELECT count(*) FROM public.otp_send_log
      WHERE email = p_email AND created_at >= clock_timestamp() - v_window) >= p_email_limit THEN
    RETURN FALSE;
  END IF;

  IF p_ip IS NOT NULL AND p_ip <> '' AND
     (SELECT count(*) FROM public.otp_send_log
      WHERE ip = p_ip AND created_at >= clock_timestamp() - v_window) >= p_ip_limit THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.otp_send_log (email, ip) VALUES (p_email, NULLIF(p_ip, ''));
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.consume_password_reset_quota(
  p_email TEXT,
  p_ip TEXT,
  p_window_ms INTEGER,
  p_email_limit INTEGER,
  p_ip_limit INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window INTERVAL;
BEGIN
  IF p_email IS NULL OR p_email = '' OR p_window_ms <= 0 OR p_email_limit <= 0 OR p_ip_limit <= 0 THEN
    RETURN FALSE;
  END IF;

  v_window := p_window_ms * INTERVAL '1 millisecond';
  PERFORM pg_advisory_xact_lock(hashtextextended('reset-email:' || lower(p_email), 0));
  IF p_ip IS NOT NULL AND p_ip <> '' THEN
    PERFORM pg_advisory_xact_lock(hashtextextended('reset-ip:' || p_ip, 0));
  END IF;

  IF (SELECT count(*) FROM public.password_reset_send_log
      WHERE email = p_email AND created_at >= clock_timestamp() - v_window) >= p_email_limit THEN
    RETURN FALSE;
  END IF;

  IF p_ip IS NOT NULL AND p_ip <> '' AND
     (SELECT count(*) FROM public.password_reset_send_log
      WHERE ip = p_ip AND created_at >= clock_timestamp() - v_window) >= p_ip_limit THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.password_reset_send_log (email, ip) VALUES (p_email, NULLIF(p_ip, ''));
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_otp_send_quota(TEXT, TEXT, INTEGER, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_password_reset_quota(TEXT, TEXT, INTEGER, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_otp_send_quota(TEXT, TEXT, INTEGER, INTEGER, INTEGER) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.consume_password_reset_quota(TEXT, TEXT, INTEGER, INTEGER, INTEGER) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_otp_send_quota(TEXT, TEXT, INTEGER, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.consume_password_reset_quota(TEXT, TEXT, INTEGER, INTEGER, INTEGER) TO service_role;
