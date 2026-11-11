"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { Assignment, AssignmentSubmission } from "../types/database";

export interface SubmissionResult {
  success: boolean;
  message: string;
  submission?: AssignmentSubmission;
}

/**
 * Server action untuk mengumpulkan tugas mahasiswa
 */
export async function submitAssignmentAction(
  assignmentId: string,
  submissionUrl: string,
  notes: string = ""
): Promise<SubmissionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      success: false,
      message: "Sesi tidak sah. Silakan login kembali.",
    };
  }

  const cleanUrl = (submissionUrl || "").trim();
  if (!cleanUrl) {
    return {
      success: false,
      message: "Tautan pengumpulan tugas (GitHub / Google Drive / URL) wajib diisi.",
    };
  }

  // URL basic validation
  try {
    new URL(cleanUrl);
  } catch {
    return {
      success: false,
      message: "Format tautan tidak valid. Gunakan format URL lengkap (https://...).",
    };
  }

  const result = bdcStore.submitAssignment(
    assignmentId,
    currentUser.id,
    cleanUrl,
    notes.trim()
  );

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Gagal mengumpulkan tugas.",
    };
  }

  revalidatePath("/assignments");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");
  revalidatePath("/certificates");

  return {
    success: true,
    message: "Tugas berhasil dikumpulkan dan tercatat dalam sistem pangkalan data BDC.",
    submission: result.submission,
  };
}

/**
 * Server action untuk Admin/Instruktur menilai tugas mahasiswa
 */
export async function adminGradeAssignmentAction(
  submissionId: string,
  score: number,
  feedback: string
): Promise<{ success: boolean; message: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "instructor")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya kurator atau instruktur yang memiliki hak menilai tugas.",
    };
  }

  if (score < 0 || score > 100) {
    return {
      success: false,
      message: "Rentang nilai evaluasi harus berada antara 0 hingga 100.",
    };
  }

  const result = bdcStore.gradeSubmission(submissionId, score, feedback.trim());
  if (!result.success) {
    return {
      success: false,
      message: result.error || "Gagal memperbarui nilai penugasan.",
    };
  }

  revalidatePath("/admin/assignments");
  revalidatePath("/assignments");
  revalidatePath("/certificates");
  revalidatePath("/leaderboard");

  return {
    success: true,
    message: `Evaluasi tugas berhasil disimpan. Nilai: ${score}/100.`,
  };
}

/**
 * Server action untuk Admin membuat penugasan baru
 */
export async function adminCreateAssignmentAction(
  assignmentData: Omit<Assignment, "id">
): Promise<{ success: boolean; message: string; assignment?: Assignment }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "instructor")) {
    return {
      success: false,
      message: "Akses ditolak: Hanya pengelola yang dapat menambahkan tugas.",
    };
  }

  const newAssignment = bdcStore.createAssignment(assignmentData);

  revalidatePath("/admin/assignments");
  revalidatePath("/assignments");
  revalidatePath("/courses");

  return {
    success: true,
    message: "Penugasan proyek baru berhasil diterbitkan.",
    assignment: newAssignment,
  };
}
