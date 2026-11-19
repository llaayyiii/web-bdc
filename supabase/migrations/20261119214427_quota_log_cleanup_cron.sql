-- Pembersihan otomatis log kuota lama (item 5).
-- HANYA baris log OTP / reset-password yang lebih tua dari 30 hari.
-- Tidak menyentuh data pengguna (profiles, sessions, nilai, sertifikat, dll).

CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'bdc_quota_log_cleanup') THEN
    PERFORM cron.unschedule('bdc_quota_log_cleanup');
  END IF;
END
$$;

-- Harian 03:15 UTC
SELECT cron.schedule(
  'bdc_quota_log_cleanup',
  '15 3 * * *',
  $job$
    DELETE FROM public.otp_send_log WHERE created_at < now() - interval '30 days';
    DELETE FROM public.password_reset_send_log WHERE created_at < now() - interval '30 days';
  $job$
);
