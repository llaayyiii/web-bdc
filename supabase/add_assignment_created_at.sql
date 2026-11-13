-- ============================================================
-- WAKTU PEMBERIAN TUGAS (sistem EXP berbasis hari — penambahan
-- murni, aditif). Kolom baru: public.assignments.created_at
-- Dipakai untuk menghitung EXP pengumpulan: hari ke-0 = 200 XP,
-- hari tenggat = 50 XP, lewat tenggat = 25 XP (kalender WIB).
-- Aman dijalankan berulang (IF NOT EXISTS). Baris lama otomatis
-- terisi waktu sekarang; tidak menyentuh data lain.
-- ============================================================

alter table public.assignments
  add column if not exists created_at timestamptz not null default now();
