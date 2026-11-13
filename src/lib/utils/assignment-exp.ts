import type { Assignment } from "../types/database";

const WIB = "Asia/Jakarta";
const DAY_MS = 86_400_000;

/** Nomor hari kalender WIB (Asia/Jakarta) dari tanggal ISO; null bila tidak valid. */
function wibDayNumber(iso: string): number | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", {
    timeZone: WIB,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .split("-")
    .map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

/**
 * EXP pengumpulan tugas berbasis kecepatan hari (kalender WIB):
 * - hari ke-0 (hari tugas diberikan) = 200 XP
 * - hari tenggat = 50 XP, antarnya interpolasi rata (bulat, dijepit 50–200)
 * - dikirim setelah hari tenggat = 25 XP (upload tetap terbuka)
 * - total hari pemberian→tenggat ≤ 0 = 50 XP (tanpa interpolasi)
 */
export function computeAssignmentExp(
  assignment: Pick<Assignment, "created_at" | "deadline">,
  submittedAt: Date = new Date()
): number {
  const dayDeadline = wibDayNumber(assignment.deadline);
  const daySubmitted = wibDayNumber(submittedAt.toISOString());
  if (dayDeadline === null || daySubmitted === null) return 50;

  // Lewat hari tenggat: tetap boleh kirim, EXP tetap 25
  if (daySubmitted > dayDeadline) return 25;

  const dayCreated = assignment.created_at ? wibDayNumber(assignment.created_at) : null;
  if (dayCreated === null) return 50;

  const totalDays = dayDeadline - dayCreated;
  if (totalDays <= 0) return 50;

  const offset = Math.min(Math.max(daySubmitted - dayCreated, 0), totalDays);
  const exp = Math.round(200 - (150 * offset) / totalDays);
  return Math.min(Math.max(exp, 50), 200);
}
