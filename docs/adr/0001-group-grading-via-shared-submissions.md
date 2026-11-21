# ADR 0001 — Bagikan nilai kelompok lewat baris submission, bukan tabel grup

- Status: **accepted**
- Tanggal: 2026-11-21
- Terkait: `src/lib/data/store.ts:shareGradeToMember`, `src/lib/actions/assignments.ts`

## Konteks

Tugas kelompok dikumpulkan oleh satu orang. Model lama menyimpan satu `assignment_submissions`
per `(assignment, user)`, sehingga hanya submitter yang memiliki baris bernilai. Anggota lain
tidak mendapat nilai walaupun ikut mengerjakan. Dibutuhkan cara memberi nilai ke anggota tanpa
memaksa setiap orang mengumpulkan tautan yang sama.

## Keputusan

Tidak menambah tabel grup atau kolom skema. Saat menilai, admin memilih anggota dari roster
mahasiswa. Untuk setiap anggota, sistem membuat (atau mengisi) baris `assignment_submissions`
dengan `assignment_id`, `submission_url`, dan `feedback` yang sama dengan submission sumber.
`profiles.score` dihitung ulang sebagai nilai graded tertinggi. EXP tidak diberikan.

## Alternatif yang ditolak

- **Tabel `assignment_groups` + flag `is_group`**: lebih rapi secara model, tapi butuh migrasi
  produksi, UI pembuatan grup, dan alur kumpul baru. Biaya tidak sepadan dengan kasus yang jarang.
- **Semua anggota submit link yang sama**: nol kode, namun itulah masalah yang dilaporkan.

## Konsekuensi

- Positif: tanpa migrasi; nilai anggota langsung tampil di daftar tugas & sertifikat; EXP tetap
  jujur (hanya untuk yang submit); nilai lama lebih tinggi tidak diturunkan.
- Negatif: keanggotaan grup tidak tersimpan — admin memilih ulang setiap penilaian; baris anggota
  memiliki `submission_url` milik ketua; catatan anggota yang sudah ada dipertahankan.
- Upgrade path: jika grup menjadi permanen, tambahkan tabel keanggotaan dan isi `memberUserId`
  dari grup, lalu hapus pemilihan manual di modal.
