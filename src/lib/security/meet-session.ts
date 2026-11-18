import { MeetSession } from "../types/database";

export type PublicMeetSession = Omit<MeetSession, "qr_token">;

export function createAttendanceToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return `BDC-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export function toPublicMeetSession(session: MeetSession): PublicMeetSession {
  const { qr_token: _qrToken, ...publicSession } = session;
  return publicSession;
}
