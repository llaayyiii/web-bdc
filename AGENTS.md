<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 🚨 PRODUCTION — Jaga Data Jangan Sampai Hilang

Situs live di **https://bdcutdi.vercel.app** sudah dipakai pengguna nyata. Data di Supabase adalah **data produksi**.

Aturan wajib sebelum menyentuh data:

- **Dilarang** menjalankan SQL destruktif (`DROP`, `TRUNCATE`, `DELETE` tanpa `WHERE`, `UPDATE` tanpa `WHERE`) tanpa persetujuan eksplisit user di percakapan. Berhenti, jelaskan dampaknya, lalu tunggu konfirmasi.
- Perubahan skema bersifat **aditif**: kolom/tabel baru pakai `CREATE ... IF NOT EXISTS`, perubahan nilai lewat backfill terarah (ada `WHERE` id spesifik), bukan rewrite massal.
- **Verifikasi dulu** struktur DB sebelum menulis SQL (contoh: tabel `meet_sessions` TIDAK punya kolom `updated_at`).
- Seed/skrip di `scripts/` dan aksi `adminDelete*` tidak boleh diarahkan ke data live tanpa konfirmasi.
- Push ke `main` = **auto-deploy Vercel**. Selalu `npm run build` dulu sebelum push; jangan push saat build gagal.
- Sebelum perubahan besar: catat state awal (jumlah baris, id penting) agar bisa dicek ulang sesudahnya.
