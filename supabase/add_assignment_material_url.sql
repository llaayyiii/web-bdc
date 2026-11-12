-- ==============================================================================
-- BDC Assignments: tautan materi/soal essay (Google Drive) dari admin ke user
-- ==============================================================================

ALTER TABLE public.assignments
  ADD COLUMN IF NOT EXISTS material_url TEXT;
