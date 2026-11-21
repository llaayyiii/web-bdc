# Threat Model — Penilaian Tugas Kelompok

Status: **implemented** · Ruang lingkup: fitur "bagi nilai ke anggota tim" di `/admin/assignments`.
Bukti kode: `src/lib/actions/assignments.ts`, `src/lib/data/store.ts`, `src/components/admin/AdminGradingManager.tsx`.

## Aset

| Aset | Sensitivitas | Catatan |
|---|---|---|
| `assignment_submissions.score` | tinggi | Menentukan kelulusan & `profiles.score` |
| `profiles.points` (EXP) | menengah | Peringkat leaderboard; harus mencerminkan usaha submit |
| `submission_url` | menengah | Tautan Drive/GitHub milik mahasiswa |
| `profiles.score` | tinggi | Dipakai sertifikat & leaderboard |

## Batas kepercayaan

1. **Browser → Server Action**: input dari admin tidak dipercaya.
2. **Server → Supabase**: kredensial service role hanya di server (`src/lib/supabase/admin.ts`).
3. **Store in-memory → DB**: store adalah cache; Supabase sumber kebenaran setelah `hydrateFromDb`.

## Ancaman & mitigasi

| ID | Ancaman | Mitigasi (bukti) | Residual |
|---|---|---|---|
| T1 | Learner memanggil aksi penilaian langsung | Guard `role !== "admin" && role !== "instructor"` di `adminGradeAssignmentAction` | — |
| T2 | Admin tidak sengaja menurunkan nilai anggota yang sudah lebih tinggi | `shareGradeToMember` skip bila `existing.score >= score`; pesan "tidak diubah" dikembalikan | Admin tetap bisa menurunkan lewat tombol "Ubah Nilai" per submission |
| T3 | Anggota dimasukkan dua kali / pengumpul dimasukkan sebagai anggota | Dedup `userId` di action + penolakan `memberUserId === source.user_id` di store | — |
| T4 | Instructor/admin ikut menerima nilai | Store menolak `member.role !== "learner"` | — |
| T5 | Anggota dapat EXP tanpa submit | EXP hanya diberikan di `submitAssignment`; jalur `shareGradeToMember` tidak menyentuh `points` | — |
| T6 | Nilai dari tugas lain ikut tersalin | `shareGradeToMember` memakai `source.assignment_id`, bukan input klien | — |
| T7 | Gagal sinkron Supabase tapi store berubah | `try/catch` + `console.warn`, pola sama dengan aksi lain; cache tetap dipakai sampai retry | Perubahan bisa tertunda jika Supabase down; tidak ada antrean retry |
| T8 | Tautan submission pribadi terekspos ke anggota | Sesuai desain kerja kelompok; admin yang memilih penerima | Admin bertanggung jawab atas pemilihan anggota |
| T9 | Isi `notes`/`feedback` disuntik HTML | Dirender React (escaped) di panel admin & daftar mahasiswa; sanitizer HTML hanya dipakai untuk halaman publik (`src/lib/security/public-html.ts`) | — |

## Asumsi yang disengaja

- Admin adalah otoritas penilaian: tidak ada pembuktian otomatis bahwa anggota benar-benar berkontribusi.
- Tidak ada tabel keanggotaan grup; pilihan anggota dibuat ulang setiap kali menilai (lihat ADR 0001).
- Data produksi tidak diubah oleh migrasi; fitur hanya menulis baris baru saat admin berinteraksi.
