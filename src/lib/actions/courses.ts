"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { createAdminClient } from "../supabase/admin";
import { Course } from "../types/database";

/**
 * Mengambil seluruh kurikulum modul dari database (dipakai halaman katalog)
 */
export async function getAllCoursesAction(): Promise<Course[]> {
  await hydrateFromDb();
  return bdcStore.getCourses();
}

export async function toggleCourseTopicAction(courseId: string, topicIndex: number) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Harap masuk terlebih dahulu." };
  }

  await hydrateFromDb();
  const enrollment = bdcStore.toggleCourseTopic(user.id, courseId, topicIndex);
  if (!enrollment) {
    return { success: false, error: "Gagal memperbarui progres materi." };
  }

  // Simpan progres checklist ke tabel course_enrollments
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      // Kolom id bertipe uuid (default gen_random_uuid) — jangan kirim id teks store
      await supabaseAdmin.from("course_enrollments").upsert(
        {
          user_id: enrollment.user_id,
          course_id: enrollment.course_id,
          completed_topics: enrollment.completed_topics,
          progress_percent: enrollment.progress_percent,
          is_completed: enrollment.is_completed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_id" }
      );
    } catch (err) {
      console.warn("Sinkronisasi progres materi ke Supabase:", err);
    }
  }

  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/courses");
  revalidatePath("/dashboard");

  return { success: true, enrollment };
}
