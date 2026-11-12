"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { AttendanceRecord } from "../types/database";
import { createAdminClient } from "../supabase/admin";

export interface AttendanceResult {
  success: boolean;
  message: string;
  record?: AttendanceRecord;
  pointsEarned?: number;
  newAttendanceRate?: number;
}

/**
 * Server action untuk memvalidasi dan memproses scan QR Code presensi
 */
export async function scanAttendanceAction(
  token: string,
  method: "qr_scanner" | "token_code" = "qr_scanner"
): Promise<AttendanceResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      success: false,
      message: "Sesi autentikasi telah berakhir. Silakan login kembali.",
    };
  }

  const cleanToken = (token || "").trim();
  if (!cleanToken) {
    return {
      success: false,
      message: "Token presensi tidak boleh kosong.",
    };
  }

  // Pastikan sesi & data presensi terbaru dari database dimuat
  await hydrateFromDb();

  const result = bdcStore.recordAttendance(currentUser.id, cleanToken, method);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Gagal mencatat presensi.",
    };
  }

  // Refresh profile data to get updated attendance rate
  const updatedProfile = bdcStore.getProfileById(currentUser.id);

  // Sinkronisasi live ke Supabase jika terhubung
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin && result.record) {
    try {
      await supabaseAdmin.from("attendance_records").insert({
        id: result.record.id,
        session_id: result.record.session_id,
        session_title: result.record.session_title,
        user_id: result.record.user_id,
        user_name: result.record.user_name,
        nim_id: result.record.nim_id,
        scanned_at: result.record.scanned_at,
        method: result.record.method,
        points_earned: result.record.points_earned,
      });

      if (updatedProfile) {
        await supabaseAdmin
          .from("profiles")
          .update({
            points: updatedProfile.points,
            attendance_rate: updatedProfile.attendance_rate,
            total_attendances: updatedProfile.total_attendances,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentUser.id);
      }
    } catch (err) {
      console.warn("Sinkronisasi presensi ke Supabase:", err);
    }
  }

  revalidatePath("/attendance");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");
  revalidatePath("/certificates");

  return {
    success: true,
    message: `Presensi berhasil diverifikasi! +${result.record?.points_earned || 100} XP ditambahkan ke profil Anda.`,
    record: result.record,
    pointsEarned: result.record?.points_earned,
    newAttendanceRate: updatedProfile?.attendance_rate,
  };
}

/**
 * Mengambil histori presensi mahasiswa saat ini
 */
export async function getStudentAttendanceHistory(): Promise<AttendanceRecord[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  await hydrateFromDb();
  return bdcStore.getAttendancesByUser(currentUser.id);
}

/**
 * Mengambil daftar hadir untuk sesi tertentu (khusus Admin / Presenter)
 */
export async function getSessionAttendees(sessionId: string): Promise<AttendanceRecord[]> {
  await hydrateFromDb();
  return bdcStore.getAttendancesBySession(sessionId);
}
