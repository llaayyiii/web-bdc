# Peta Dokumentasi BDC Portal

Dokumen di direktori ini membuktikan desain yang **sudah diimplementasikan** di repository.
Mock, rencana, atau fitur yang belum jalan ditandai eksplisit. Sumber kebenaran diagram ada di
file JSON; file HTML adalah render mandiri (buka langsung dari disk, tanpa server).

## Dokumen aktif

| Topik | Jenis | File | Status |
|---|---|---|---|
| Peta ini | indeks | `README.md` | live |
| Alur penilaian tugas kelompok | sequence diagram | [`diagrams/group-grading-sequence.json`](diagrams/group-grading-sequence.json) · [render HTML](diagrams/group-grading-sequence.html) | implemented |
| Alur data nilai kelompok | data-flow diagram | [`diagrams/group-grading-data-flow.json`](diagrams/group-grading-data-flow.json) · [render HTML](diagrams/group-grading-data-flow.html) | implemented |
| Batas kepercayaan & ancaman | threat model | [`threat-model-group-grading.md`](threat-model-group-grading.md) | implemented |
| Keputusan tidak pakai tabel grup | ADR | [`adr/0001-group-grading-via-shared-submissions.md`](adr/0001-group-grading-via-shared-submissions.md) | accepted |

## Arsip (bukan spesifikasi aktif)

- `docs/superpowers/plans/2026-11-12-nextjs-migration.md`
- `docs/superpowers/specs/2026-11-12-nextjs-migration-design.md`

Keduanya adalah catatan migrasi Next.js lama, bukan desain fitur saat ini.

## Konvensi

- JSON diagram memakai `schemaVersion` + `type` eksplisit, setiap node/langkah punya field `source`
  berupa path file di repository sebagai bukti.
- HTML render mandiri: SVG inline, tanpa CDN/fetch, bisa dibuka lewat `file://`.
- ADR hanya untuk keputusan teknis yang tidak jelas dari kode.
