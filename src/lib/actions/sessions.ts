"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore, deriveMeetSessionStatus } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { MeetSession } from "../types/database";
import { createAdminClient } from "../supabase/admin";
import { createAttendanceToken, PublicMeetSession, toPublicMeetSession } from "../security/meet-session";
import { normalizeHttpUrl } from "../security/urls";

/**
 * Mengambil sesi Google Meet / Zoom yang sedang aktif (live)
 */
export async function getLiveMeetSessionAction(): Promise<PublicMeetSession | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  await hydrateFromDb();
  const session = bdcStore.getLiveSession();
  return session ? toPublicMeetSession(session) : null;
}

/**
 * Mengambil seluruh sesi pertemuan (untuk kalender / tab course)
 */
export async function getAllMeetSessionsAction(): Promise<PublicMeetSession[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];
  await hydrateFromDb();
  return bdcStore.getSessions().map(toPublicMeetSession);
}

export async function adminGetAllMeetSessionsAction(): Promise<MeetSession[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "instructor")) return [];
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

  const { qr_token: _ignoredToken, ...safeUpdates } = updates;
  if (safeUpdates.meet_url) {
    const meetUrl = normalizeHttpUrl(safeUpdates.meet_url);
    if (!meetUrl) return { success: false, message: "Tautan pertemuan harus berupa URL http atau https yang valid." };
    safeUpdates.meet_url = meetUrl;
  }

  // Gabungkan dan hitung status terbaru berdasarkan jadwal
  const merged = { ...session, ...safeUpdates };
  merged.status = deriveMeetSessionStatus(merged);
  const finalUpdates: Partial<MeetSession> = { ...safeUpdates, status: merged.status };

  // Pastikan perubahan tersimpan sebelum memperbarui cache atau melaporkan sukses.
  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin) {
    return { success: false, message: "Penyimpanan sesi tidak tersedia. Silakan coba lagi." };
  }

  const operation = updates.scheduled_at ? "start-or-reschedule" : updates.expires_at ? "end-or-reschedule" : "edit";
  console.info("[meet-session:update]", JSON.stringify({
    operation,
    sessionId,
    previous: { scheduled_at: session.scheduled_at, expires_at: session.expires_at, status: session.status },
    requested: { scheduled_at: updates.scheduled_at, expires_at: updates.expires_at, status: merged.status },
  }));

  let savedSession: MeetSession;
  try {
    const { data, error } = await supabaseAdmin
      .from("meet_sessions")
      .update(finalUpdates)
      .eq("id", sessionId)
      .select("*")
      .single();

    if (error || !data) {
      console.warn("Gagal menyimpan perubahan sesi ke Supabase:", error);
      return { success: false, message: "Perubahan sesi belum tersimpan. Silakan coba lagi." };
    }
    savedSession = data as MeetSession;
    console.info("[meet-session:saved]", JSON.stringify({
      operation,
      sessionId,
      scheduled_at: savedSession.scheduled_at,
      expires_at: savedSession.expires_at,
      status: savedSession.status,
    }));
  } catch (err) {
    console.warn("Sinkronisasi update sesi ke Supabase:", err);
    return { success: false, message: "Gagal terhubung ke penyimpanan sesi. Silakan coba lagi." };
  }

  const updatedSession = bdcStore.setMeetSession(savedSession);

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath("/attendance");
  revalidatePath("/admin/sessions");
  revalidatePath(`/admin/sessions/${sessionId}/presenter`);
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
  sessionData: Omit<MeetSession, "id" | "qr_token">
): Promise<{ success: boolean; message: string; session?: MeetSession }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "instructor")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya instruktur atau kurator yang dapat membuat sesi.",
    };
  }

  await hydrateFromDb();

  // Link meet opsional: pertemuan bisa tatap muka/offline tanpa Google Meet.
  const rawMeetUrl = (sessionData.meet_url || "").trim();
  let meetUrl = "";
  if (rawMeetUrl) {
    const normalized = normalizeHttpUrl(rawMeetUrl);
    if (!normalized) {
      return { success: false, message: "Tautan pertemuan harus berupa URL http atau https yang valid." };
    }
    meetUrl = normalized;
  }
  if (
    !Number.isFinite(Date.parse(sessionData.scheduled_at)) ||
    !Number.isFinite(Date.parse(sessionData.expires_at)) ||
    Date.parse(sessionData.expires_at) <= Date.parse(sessionData.scheduled_at)
  ) {
    return { success: false, message: "Jadwal sesi tidak valid." };
  }

  const newSession = bdcStore.setMeetSession({
    ...sessionData,
    meet_url: meetUrl,
    qr_token: createAttendanceToken(),
  });

  // Sinkronisasi ke Supabase sebelum menganggap pembuatan berhasil.
  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin && process.env.NODE_ENV === "production") {
    bdcStore.deleteMeetSession(newSession.id);
    return { success: false, message: "Penyimpanan sesi tidak tersedia. Silakan coba lagi." };
  }
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from("meet_sessions").upsert(newSession);
      if (error) {
        bdcStore.deleteMeetSession(newSession.id);
        return { success: false, message: "Sesi belum tersimpan. Silakan coba lagi." };
      }
    } catch (err) {
      console.warn("Sinkronisasi insert sesi ke Supabase:", err);
      bdcStore.deleteMeetSession(newSession.id);
      return { success: false, message: "Sesi belum tersimpan. Silakan coba lagi." };
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

  const freshToken = createAttendanceToken();

  // Sinkronisasi ke Supabase sebelum cache lokal diperbarui.
  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin && process.env.NODE_ENV === "production") {
    return { success: false, message: "Penyimpanan sesi tidak tersedia. Silakan coba lagi." };
  }
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("meet_sessions")
        .update({ qr_token: freshToken })
        .eq("id", sessionId);
      if (error) return { success: false, message: "Token QR belum diperbarui. Silakan coba lagi." };
    } catch (err) {
      console.warn("Sinkronisasi rotasi token ke Supabase:", err);
      return { success: false, message: "Token QR belum diperbarui. Silakan coba lagi." };
    }
  }
  bdcStore.setMeetSession({ id: sessionId, qr_token: freshToken });

  revalidatePath("/attendance");
  revalidatePath(`/admin/sessions/${sessionId}/presenter`);

  return {
    success: true,
    token: freshToken,
    message: "Token QR Presensi berhasil diperbarui secara dinamis.",
  };
}
