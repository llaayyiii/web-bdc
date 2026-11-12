import { createAdminClient } from "../supabase/admin";
import { bdcStore } from "./store";
import {
  Profile,
  Course,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Certificate,
  CourseEnrollment,
  MeetSession,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
} from "../types/database";

/**
 * Menarik seluruh tabel dari Supabase ke cache in-memory bdcStore.
 * Dipanggil di awal setiap Server Component / Server Action sehingga
 * perubahan yang dilakukan lewat UI (yang tersimpan di database)
 * selalu terlihat saat halaman dirender ulang.
 *
 * Tabel yang gagal di-query akan dibiarkan apa adanya (tidak di-reset).
 */
export async function hydrateFromDb(): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;

  try {
    const [
      profiles,
      courses,
      quizzes,
      questions,
      attempts,
      certificates,
      enrollments,
      sessions,
      attendances,
      assignments,
      submissions,
    ] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("courses").select("*"),
      supabase.from("quizzes").select("*"),
      supabase.from("quiz_questions").select("*").order("order_index", { ascending: true }),
      supabase.from("quiz_attempts").select("*").order("completed_at", { ascending: false }),
      supabase.from("certificates").select("*"),
      supabase.from("course_enrollments").select("*"),
      supabase.from("meet_sessions").select("*").order("created_at", { ascending: false }),
      supabase.from("attendance_records").select("*").order("scanned_at", { ascending: false }),
      supabase.from("assignments").select("*"),
      supabase.from("assignment_submissions").select("*"),
    ]);

    const data: Parameters<typeof bdcStore.hydrate>[0] = {};

    if (!profiles.error && profiles.data) data.profiles = profiles.data as Profile[];
    if (!courses.error && courses.data) data.courses = courses.data as Course[];
    if (!quizzes.error && quizzes.data) data.quizzes = quizzes.data as Quiz[];
    if (!questions.error && questions.data) data.questions = questions.data as QuizQuestion[];
    if (!attempts.error && attempts.data) data.attempts = attempts.data as QuizAttempt[];
    if (!certificates.error && certificates.data) data.certificates = certificates.data as Certificate[];
    if (!enrollments.error && enrollments.data) data.enrollments = enrollments.data as CourseEnrollment[];
    if (!sessions.error && sessions.data) data.sessions = sessions.data as MeetSession[];
    if (!attendances.error && attendances.data) data.attendances = attendances.data as AttendanceRecord[];
    if (!assignments.error && assignments.data) data.assignments = assignments.data as Assignment[];
    if (!submissions.error && submissions.data) data.submissions = submissions.data as AssignmentSubmission[];

    bdcStore.hydrate(data);
  } catch (err) {
    console.warn("Gagal hydrate data dari Supabase:", err);
  }
}
