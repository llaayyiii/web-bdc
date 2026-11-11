"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { MeetSession } from "../types/database";

/**
 * Mengambil sesi Google Meet / Zoom yang sedang aktif (live)
 */
export async function getLiveMeetSessionAction(): Promise<MeetSession | null> {
  return bdcStore.getLiveSession();
}

/**
 * Mengambil seluruh sesi pertemuan (untuk kalender / tab course)
 */
export async function getAllMeetSessionsAction(): Promise<MeetSession[]> {
  return bdcStore.getSessions();
}

/**
 * Admin memperbarui status atau link Google Meet pertemuan
 */
export async function adminUpdateMeetSessionAction(
  sessionId: string,
  updates: Partial<MeetSession>
): Promise<{ success: boolean; message: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "instructor")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya pengelola yang dapat mengatur sesi pertemuan.",
    };
  }

  const session = bdcStore.getSessionById(sessionId);
  if (!session) {
    return { success: false, message: "Sesi pertemuan tidak ditemukan." };
  }

  bdcStore.setMeetSession({ id: sessionId, ...updates });

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath("/attendance");
  revalidatePath("/admin/sessions");

  return {
    success: true,
    message: "Data sesi pertemuan dan link konferensi video berhasil diperbarui.",
  };
}

/**
 * Admin membuat sesi meet / presensi baru
 */
export async function adminCreateMeetSessionAction(
  sessionData: Omit<MeetSession, "id">
): Promise<{ success: boolean; message: string; session?: MeetSession }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "instructor")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya instruktur atau kurator yang dapat membuat sesi.",
    };
  }

  const newSession = bdcStore.setMeetSession(sessionData);

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath("/attendance");
  revalidatePath("/admin/sessions");

  return {
    success: true,
    message: "Sesi pertemuan baru berhasil dijadwalkan.",
    session: newSession,
  };
}

/**
 * Admin merotasi token QR code untuk mencegah screenshot kecurangan
 */
export async function adminRotateSessionTokenAction(
  sessionId: string
): Promise<{ success: boolean; token?: string; message: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "instructor")) {
    return {
      success: false,
      message: "Akses ditolak.",
    };
  }

  const session = bdcStore.getSessionById(sessionId);
  if (!session) {
    return { success: false, message: "Sesi tidak ditemukan." };
  }

  // Generate a fresh dynamic token
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const freshToken = `BDC-PRESENSI-LIVE-${randomSuffix}`;
  bdcStore.setMeetSession({ id: sessionId, qr_token: freshToken });

  revalidatePath("/attendance");
  revalidatePath(`/admin/sessions/${sessionId}/presenter`);

  return {
    success: true,
    token: freshToken,
    message: "Token QR Presensi berhasil diperbarui secara dinamis.",
  };
}
