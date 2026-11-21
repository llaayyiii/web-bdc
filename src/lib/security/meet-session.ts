import { MeetSession } from "../types/database";

export type PublicMeetSession = Omit<MeetSession, "qr_token">;

// Token pendek (BDC- + 6 = 10 karakter) agar QR tidak terlalu padat saat
// diproyeksikan dan mudah diketik manual. Alfabet 32 char menghindari 0/O/1/I;
// 6 char acak ≈ 1 miliar kombinasi, cukup untuk window satu pertemuan.
const TOKEN_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function createAttendanceToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `BDC-${Array.from(bytes, (byte) => TOKEN_ALPHABET[byte % TOKEN_ALPHABET.length]).join("")}`;
}

export function toPublicMeetSession(session: MeetSession): PublicMeetSession {
  const { qr_token: _qrToken, ...publicSession } = session;
  return publicSession;
}
