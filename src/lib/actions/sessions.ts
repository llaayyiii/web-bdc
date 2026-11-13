"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore, deriveMeetSessionStatus } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { MeetSession } from "../types/database";
import { createAdminClient } from "../supabase/admin";

/**
 * Mengambil sesi Google Meet / Zoom yang sedang aktif (live)
 */
export async function getLiveMeetSessionAction(): Promise<MeetSession | null> {
  await hydrateFromDb();
  return bdcStore.getLiveSession();
}

/**
 * Mengambil seluruh sesi pertemuan (untuk kalender / tab course)
 */
export async function getAllMeetSessionsAction(): Promise<MeetSession[]> {
  await hydrateFromDb();
  return bdcStore.getSessions();
}

/**
 * Admin memperbarui status atau link Google Meet pertemuan
 */
export async function adminUpdateMeetSessionAction(
  sessionId: string,
  updates: Partial<MeetSession>
): Promise<{ success: boolean; message: string; session?: MeetSession }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "instructor")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya pengelola yang dapat mengatur sesi pertemuan.",
    };
  }

  await hydrateFromDb();

  const session = bdcStore.getSessionById(sessionId);
  if (!session) {
    return { success: false, message: "Sesi pertemuan tidak ditemukan." };
  }

  // Gabungkan dan hitung status terbaru berdasarkan jadwal
  const merged = { ...session, ...updates };
  merged.status = deriveMeetSessionStatus(merged);
  const finalUpdates: Partial<MeetSession> = { ...updates, status: merged.status };

  const updatedSession = bdcStore.setMeetSession({ id: sessionId, ...finalUpdates });

  // Sinkronisasi ke Supabase
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from("meet_sessions").update(finalUpdates).eq("id", sessionId);
    } catch (err) {
      console.warn("Sinkronisasi update sesi ke Supabase:", err);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath("/attendance");
  revalidatePath("/admin/sessions");
  revalidatePath("/admin");

  return {
    success: true,
    message: "Data sesi pertemuan berhasil diperbarui.",
    session: updatedSession || undefined,
  };
}

/**
 * Override Cepat: Mulai sesi sekarang (set jadwal mulai = sekarang, selesai = 3 jam ke depan)
 */
export async function adminStartSessionNowAction(
  sessionId: string
): Promise<{ success: boolean; message: string; session?: MeetSession }> {
  const now = new Date();
  const expires = new Date(now.getTime() + 3 * 3600 * 1000);

  return adminUpdateMeetSessionAction(sessionId, {
    scheduled_at: now.toISOString(),
    expires_at: expires.toISOString(),
  });
}

/**
 * Override Cepat: Akhiri sesi sekarang (set jadwal selesai = sekarang)
 */
export async function adminEndSessionNowAction(
  sessionId: string
): Promise<{ success: boolean; message: string; session?: MeetSession }> {
  const now = new Date();

  return adminUpdateMeetSessionAction(sessionId, {
    expires_at: now.toISOString(),
  });
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

  await hydrateFromDb();

  const newSession = bdcStore.setMeetSession(sessionData);

  // Sinkronisasi ke Supabase
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from("meet_sessions").upsert(newSession);
    } catch (err) {
      console.warn("Sinkronisasi insert sesi ke Supabase:", err);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath("/attendance");
  revalidatePath("/admin/sessions");
  revalidatePath("/admin");

  return {
    success: true,
    message: "Sesi pertemuan baru berhasil dijadwalkan.",
    session: newSession,
  };
}

/**
 * Admin menghapus sesi pertemuan (misal salah ketik atau sesi dibatalkan)
 */
export async function adminDeleteMeetSessionAction(
  sessionId: string
): Promise<{ success: boolean; message: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "instructor")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya pengelola yang dapat menghapus sesi pertemuan.",
    };
  }

  await hydrateFromDb();

  const session = bdcStore.getSessionById(sessionId);
  if (!session) {
    return { success: false, message: "Sesi pertemuan tidak ditemukan." };
  }

  // Sinkronisasi hapus ke Supabase DB
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from("meet_sessions").delete().eq("id", sessionId);
    } catch (err) {
      console.warn("Sinkronisasi hapus sesi ke Supabase:", err);
    }
  }

  const deleted = bdcStore.deleteMeetSession(sessionId);
  if (!deleted) {
    return { success: false, message: "Gagal menghapus sesi dari penyimpanan data lokal." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath("/attendance");
  revalidatePath("/admin/sessions");
  revalidatePath("/admin");

  return {
    success: true,
    message: `Sesi pertemuan "${session.title}" berhasil dihapus.`,
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

  await hydrateFromDb();

  const session = bdcStore.getSessionById(sessionId);
  if (!session) {
    return { success: false, message: "Sesi tidak ditemukan." };
  }

  // Generate a fresh dynamic token
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const freshToken = `BDC-${randomSuffix}`;
  bdcStore.setMeetSession({ id: sessionId, qr_token: freshToken });

  // Sinkronisasi ke Supabase
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from("meet_sessions")
        .update({ qr_token: freshToken })
        .eq("id", sessionId);
    } catch (err) {
      console.warn("Sinkronisasi rotasi token ke Supabase:", err);
    }
  }

  revalidatePath("/attendance");
  revalidatePath(`/admin/sessions/${sessionId}/presenter`);

  return {
    success: true,
    token: freshToken,
    message: "Token QR Presensi berhasil diperbarui secara dinamis.",
  };
}
