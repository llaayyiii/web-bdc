"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { QuizOption, QuizQuestion } from "../types/database";
import { createAdminClient } from "../supabase/admin";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    throw new Error("Akses ditolak: Hanya admin atau instruktur yang diizinkan mengelola bank soal.");
  }
  return user;
}

export interface SubmitQuizResult {
  success: boolean;
  score?: number;
  correctCount?: number;
  totalQuestions?: number;
  passed?: boolean;
  attemptId?: string;
  error?: string;
}

/**
 * Server Action: Submit Kuis & Penilaian Aman di Sisi Server
 */
export async function submitQuizAction(
  quizId: string,
  answers: Record<number, string>
): Promise<SubmitQuizResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Harap login terlebih dahulu untuk menyimpan nilai." };
  }

  const quiz = bdcStore.getQuiz(quizId);
  const questions = bdcStore.getQuizQuestions(quizId);

  if (!quiz || questions.length === 0) {
    return { success: false, error: "Ujian tidak ditemukan." };
  }

  // Hitung jumlah jawaban benar di server
  let correctCount = 0;
  questions.forEach((q) => {
    const studentAnswer = answers[q.order_index];
    if (studentAnswer && studentAnswer.toUpperCase() === q.correct_option?.toUpperCase()) {
      correctCount += 1;
    }
  });

  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100 * 10) / 10;
  const passed = score >= quiz.passing_score;

  // Catat riwayat pengerjaan riil
  const attempt = bdcStore.recordAttempt({
    quiz_id: quiz.id,
    user_id: user.id,
    score,
    passed,
    answers_json: answers,
    started_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    completed_at: new Date().toISOString(),
  });

  // Jika nilai lebih baik, perbarui nilai profil siswa
  if (score > (user.score || 0)) {
    bdcStore.updateProfile(user.id, { score });
  }

  revalidatePath("/assessments");
  revalidatePath("/dashboard");
  revalidatePath("/certificates");

  return {
    success: true,
    score,
    correctCount,
    totalQuestions,
    passed,
    attemptId: attempt.id,
  };
}

/**
 * Admin: Mengambil seluruh butir soal evaluasi
 */
export async function adminGetQuizQuestionsAction(): Promise<QuizQuestion[]> {
  await requireAdmin();
  return bdcStore.getAllQuestions();
}

/**
 * Admin: Menambahkan butir soal baru ke Bank Soal
 */
export async function adminCreateQuizQuestionAction(payload: {
  question_text: string;
  options: QuizOption[];
  correct_option: string;
  weight?: number;
  explanation?: string;
}): Promise<{ success: boolean; question?: QuizQuestion; error?: string }> {
  await requireAdmin();

  if (!payload.question_text || !payload.question_text.trim()) {
    return { success: false, error: "Teks pertanyaan wajib diisi." };
  }

  if (!payload.options || payload.options.length < 2) {
    return { success: false, error: "Minimal harus ada 2 opsi pilihan jawaban." };
  }

  if (!payload.correct_option) {
    return { success: false, error: "Kunci jawaban benar wajib ditentukan." };
  }

  const newQuestion = bdcStore.addQuizQuestion({
    quiz_id: "e2b4f9d0-1234-5678-90ab-cdef12345678",
    question_text: payload.question_text.trim(),
    options: payload.options,
    correct_option: payload.correct_option.trim().toUpperCase(),
    weight: payload.weight ?? 1.0,
    explanation: payload.explanation?.trim() || null,
    order_index: bdcStore.getAllQuestions().length + 1,
  });

  // Sinkronisasi ke Supabase jika terhubung
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from("quiz_questions").upsert({
        id: newQuestion.id,
        quiz_id: newQuestion.quiz_id,
        order_index: newQuestion.order_index,
        question_text: newQuestion.question_text,
        options: newQuestion.options,
        correct_option: newQuestion.correct_option,
        weight: newQuestion.weight,
        explanation: newQuestion.explanation,
      });
    } catch (err) {
      console.warn("Sinkronisasi butir soal ke Supabase:", err);
    }
  }

  revalidatePath("/admin/assessments");
  revalidatePath("/assessments");
  revalidatePath("/dashboard");

  return {
    success: true,
    question: newQuestion,
  };
}

/**
 * Admin: Menghapus butir soal dari Bank Soal
 */
export async function adminDeleteQuizQuestionAction(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  // Sinkronisasi hapus ke Supabase jika terhubung
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from("quiz_questions").delete().eq("id", questionId);
    } catch (err) {
      console.warn("Sinkronisasi hapus soal ke Supabase:", err);
    }
  }

  const deleted = bdcStore.deleteQuizQuestion(questionId);
  if (!deleted) {
    return { success: false, error: "Butir soal tidak ditemukan." };
  }

  revalidatePath("/admin/assessments");
  revalidatePath("/assessments");
  revalidatePath("/dashboard");

  return { success: true };
}
