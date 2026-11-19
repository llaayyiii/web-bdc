-- ============================================================
-- INFO LOMBA / EVENT (fitur baru — penambahan murni, aditif)
-- Tabel baru: public.competitions
-- Aman dijalankan berulang (IF NOT EXISTS). Tidak menyentuh
-- tabel atau data yang sudah ada.
-- ============================================================

create table if not exists public.competitions (
  id              text primary key,
  title           text not null,
  description     text not null default '',
  url             text not null default '',
  image_url       text,
  guidebook_name  text,
  guidebook_path  text,
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);

-- Aktifkan RLS + policy baca untuk pengguna login (konsisten
-- dengan tabel lain); penulisan dilakukan via service role.
alter table public.competitions enable row level security;

drop policy if exists "Competitions are readable by authenticated" on public.competitions;
create policy "Competitions are readable by authenticated"
  on public.competitions
  for select
  to authenticated
  using (true);

comment on table public.competitions is
  'Info lomba/event yang dipublikasikan admin ke portal mahasiswa.';
