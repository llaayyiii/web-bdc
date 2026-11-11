"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { AttendanceRecord } from "../types/database";

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

  const result = bdcStore.recordAttendance(currentUser.id, cleanToken, method);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Gagal mencatat presensi.",
    };
  }

  // Refresh profile data to get updated attendance rate
  const updatedProfile = bdcStore.getProfileById(currentUser.id);

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

  return bdcStore.getAttendancesByUser(currentUser.id);
}

/**
 * Mengambil daftar hadir untuk sesi tertentu (khusus Admin / Presenter)
 */
export async function getSessionAttendees(sessionId: string): Promise<AttendanceRecord[]> {
  return bdcStore.getAttendancesBySession(sessionId);
}
