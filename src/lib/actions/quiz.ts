"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";

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
