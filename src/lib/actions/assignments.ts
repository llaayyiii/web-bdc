"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { Assignment, AssignmentSubmission } from "../types/database";
import { createAdminClient } from "../supabase/admin";

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

  await hydrateFromDb();
  const isNewSubmission = !bdcStore.getSubmission(assignmentId, currentUser.id);
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

  // Simpan pengumpulan ke tabel assignment_submissions
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin && result.submission) {
    try {
      const sub = result.submission;
      await supabaseAdmin.from("assignment_submissions").upsert({
        id: sub.id,
        assignment_id: sub.assignment_id,
        user_id: sub.user_id,
        user_name: sub.user_name,
        nim_id: sub.nim_id,
        submission_url: sub.submission_url,
        notes: sub.notes,
        submitted_at: sub.submitted_at,
        score: sub.score,
        feedback: sub.feedback,
        status: sub.status,
      });

      // Pengumpulan pertama memberi +150 XP (dihitung oleh store)
      if (isNewSubmission) {
        const updatedProfile = bdcStore.getProfileById(currentUser.id);
        if (updatedProfile) {
          await supabaseAdmin
            .from("profiles")
            .update({ points: updatedProfile.points, updated_at: new Date().toISOString() })
            .eq("id", currentUser.id);
        }
      }
    } catch (err) {
      console.warn("Sinkronisasi pengumpulan tugas ke Supabase:", err);
    }
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

  await hydrateFromDb();
  const result = bdcStore.gradeSubmission(submissionId, score, feedback.trim());
  if (!result.success) {
    return {
      success: false,
      message: result.error || "Gagal memperbarui nilai penugasan.",
    };
  }

  // Simpan nilai ke tabel assignment_submissions + status sertifikat terkait
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin && result.submission) {
    try {
      const sub = result.submission;
      await supabaseAdmin
        .from("assignment_submissions")
        .update({
          score: sub.score,
          feedback: sub.feedback,
          status: sub.status,
        })
        .eq("id", sub.id);

      // Status kelulusan sertifikat bisa berubah setelah penilaian
      const cert = bdcStore.getCertificateByUserId(sub.user_id);
      if (cert) {
        await supabaseAdmin
          .from("certificates")
          .update({
            is_locked: cert.is_locked,
            completion_status: cert.completion_status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", cert.id);
      }
    } catch (err) {
      console.warn("Sinkronisasi penilaian tugas ke Supabase:", err);
    }
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

  await hydrateFromDb();
  const newAssignment = bdcStore.createAssignment(assignmentData);

  // Simpan tugas baru ke tabel assignments
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from("assignments").upsert({
        id: newAssignment.id,
        course_id: newAssignment.course_id,
        course_title: newAssignment.course_title,
        title: newAssignment.title,
        description: newAssignment.description,
        deadline: newAssignment.deadline,
        max_score: newAssignment.max_score,
        submission_format: newAssignment.submission_format,
      });
    } catch (err) {
      console.warn("Sinkronisasi tugas baru ke Supabase:", err);
    }
  }

  revalidatePath("/admin/assignments");
  revalidatePath("/assignments");
  revalidatePath("/courses");

  return {
    success: true,
    message: "Penugasan proyek baru berhasil diterbitkan.",
    assignment: newAssignment,
  };
}
