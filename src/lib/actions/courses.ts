"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { createAdminClient } from "../supabase/admin";
import { Course, COURSE_CATEGORIES, COURSE_LEVELS } from "../types/database";

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

export interface CourseInput {
  title: string;
  category: string;
  session_type: string;
  instructor: string;
  instructor_role?: string;
  duration: string;
  level: string;
  description: string;
  syllabus: string[];
}

export interface CourseResult {
  success: boolean;
  message: string;
  course?: Course;
}

/** Hanya admin / instruktur yang boleh mengelola materi. */
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    throw new Error("Akses ditolak: Hanya admin atau instruktur yang diizinkan.");
  }
  await hydrateFromDb();
  return user;
}

/**
 * Mengambil seluruh materi untuk panel admin (halaman Manajemen Materi).
 */
export async function adminGetAllCoursesAction(): Promise<Course[]> {
  await requireAdmin();
  return bdcStore.getCourses();
}

function validateCourseInput(input: CourseInput): string | null {
  if (!(input.title || "").trim()) return "Judul materi wajib diisi.";
  if (!(input.session_type || "").trim()) return "Jenis sesi wajib diisi.";
  if (!(input.instructor || "").trim()) return "Nama pemateri wajib diisi.";
  if (!(input.duration || "").trim()) return "Durasi wajib diisi.";
  if (!(input.description || "").trim()) return "Deskripsi materi wajib diisi.";
  if (!(COURSE_CATEGORIES as readonly string[]).includes((input.category || "").trim())) {
    return "Kategori materi tidak valid.";
  }
  if (!(COURSE_LEVELS as readonly string[]).includes((input.level || "").trim())) {
    return "Tingkat materi tidak valid.";
  }
  if (input.syllabus.filter((s) => s.trim()).length === 0) {
    return "Minimal satu topik silabus wajib diisi.";
  }
  return null;
}

/**
 * Menerbitkan materi / modul baru ke katalog portal (tabel `courses`).
 */
export async function adminCreateCourseAction(input: CourseInput): Promise<CourseResult> {
  await requireAdmin();

  const error = validateCourseInput(input);
  if (error) return { success: false, message: error };

  const newCourse = bdcStore.createCourse({
    title: input.title.trim(),
    category: input.category.trim() as Course["category"],
    session_type: input.session_type.trim(),
    instructor: input.instructor.trim(),
    instructor_role: (input.instructor_role || "").trim() || "Inisiator / Pemateri Komunitas",
    duration: input.duration.trim(),
    level: input.level.trim() as Course["level"],
    learners_count: 0,
    rating: 4.9,
    icon: "BookOpen",
    badge_color: "bg-blue-100 text-blue-700",
    description: input.description.trim(),
    syllabus: input.syllabus.map((s) => s.trim()).filter(Boolean),
    created_at: new Date().toISOString(),
  });

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    const { error: dbError } = await supabaseAdmin.from("courses").upsert({
      id: newCourse.id,
      title: newCourse.title,
      category: newCourse.category,
      session_type: newCourse.session_type,
      instructor: newCourse.instructor,
      instructor_role: newCourse.instructor_role,
      duration: newCourse.duration,
      level: newCourse.level,
      learners_count: newCourse.learners_count,
      rating: newCourse.rating,
      icon: newCourse.icon,
      badge_color: newCourse.badge_color,
      description: newCourse.description,
      syllabus: newCourse.syllabus,
      created_at: newCourse.created_at,
    });
    if (dbError) {
      console.warn("Sinkronisasi materi ke Supabase:", dbError.message);
      return { success: false, message: `Gagal menyimpan ke database: ${dbError.message}` };
    }
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: `Materi "${newCourse.title}" berhasil diterbitkan ke katalog.`,
    course: newCourse,
  };
}

/**
 * Menghapus materi. Enrollment mahasiswa pada materi ini ikut terhapus
 * (FK course_enrollments ON DELETE CASCADE).
 */
export async function adminDeleteCourseAction(id: string): Promise<CourseResult> {
  await requireAdmin();

  const existing = bdcStore.getCourseById(id);
  if (!existing) {
    return { success: false, message: "Materi tidak ditemukan." };
  }

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", id);
    if (error) {
      console.warn("Penghapusan materi di Supabase:", error.message);
      return { success: false, message: `Gagal menghapus dari database: ${error.message}` };
    }
  }

  bdcStore.deleteCourse(id);

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/dashboard");

  return { success: true, message: `Materi "${existing.title}" dihapus.` };
}
