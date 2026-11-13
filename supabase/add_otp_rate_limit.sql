-- ============================================================
-- Rate limit pengiriman OTP pendaftaran (antisipasi "orang iseng")
-- Tambahan ADITIF — tidak menyentuh tabel yang sudah ada.
-- Diberlakukan: 2026-11-13
-- ------------------------------------------------------------
-- Aturan aplikasi (src/lib/actions/auth.ts):
--   * maksimal 5 request OTP per email per jam
--   * maksimal 10 request OTP per IP per jam
--   * log otomatis dibersihkan jika lebih tua dari 24 jam
--   * dicatat SEBELUM email dikirim & SEBELUM akun auth dibuat
-- ============================================================

CREATE TABLE IF NOT EXISTS public.otp_send_log (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text,
  ip         text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_otp_send_log_email_time
  ON public.otp_send_log (email, created_at);

CREATE INDEX IF NOT EXISTS idx_otp_send_log_ip_time
  ON public.otp_send_log (ip, created_at);

-- RLS aktif tanpa policy: client anon/authenticated DIBLOKIR total.
-- Hanya service role (server action) yang membaca/menulis (bypass RLS).
ALTER TABLE public.otp_send_log ENABLE ROW LEVEL SECURITY;
