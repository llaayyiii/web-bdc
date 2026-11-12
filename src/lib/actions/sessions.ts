"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { MeetSession } from "../types/database";
import { createAdminClient } from "../supabase/admin";

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

  // Sinkronisasi ke Supabase
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from("meet_sessions").update(updates).eq("id", sessionId);
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

  const session = bdcStore.getSessionById(sessionId);
  if (!session) {
    return { success: false, message: "Sesi tidak ditemukan." };
  }

  // Generate a fresh dynamic token
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const freshToken = `BDC-PRESENSI-LIVE-${randomSuffix}`;
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
