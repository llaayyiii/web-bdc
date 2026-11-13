export type UserRole = "learner" | "instructor" | "admin";

export interface Profile {
  id: string;
  nim_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  role_title: string;
  division: string;
  period: string;
  location: string;
  avatar_url?: string | null;
  password?: string;
  password_hash?: string | null;
  score: number;
  completed_modules: number;
  total_hours: number;
  points: number; // XP Leaderboard
  attendance_rate: number; // Persentase Kehadiran (0-100)
  total_attendances: number;
  total_sessions: number;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string; // 'ACT-01', etc.
  title: string;
  category: "Sesi Minggu Ini" | "Workshop & Hands-On" | "Proyek Bersama" | "Arsip Recording";
  session_type: string;
  instructor: string;
  instructor_role: string;
  duration: string;
  level: "Pemula (Beginner)" | "Menengah (Intermediate)" | "Lanjutan (Advanced)" | "Semua Tingkat (All Levels)";
  learners_count: number;
  rating: number;
  icon: string;
  badge_color: string;
  description: string;
  syllabus: string[];
  created_at?: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  completed_topics: number[];
  progress_percent: number;
  is_completed: boolean;
  enrolled_at?: string;
  updated_at?: string;
}

export interface QuizOption {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  options: QuizOption[];
  correct_option?: string;
  explanation?: string | null;
  weight: number;
  order_index: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  time_limit_minutes: number;
  passing_score: number;
  total_questions: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  passed: boolean;
  answers_json: Record<number, string>;
  started_at: string;
  completed_at: string;
}

export interface TranscriptModule {
  code: string;
  title: string;
  hours: number;
  score: number;
  grade: string;
  status: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  certificate_number: string;
  transcript_number: string;
  recipient_name: string;
  nim_id: string;
  cohort: string;
  program_title: string;
  period: string;
  location: string;
  issue_date: string;
  total_hours: number;
  avg_score: number;
  completion_status: string;
  cohort_badge: string;
  is_locked: boolean;

  // Capstone
  capstone_title: string;
  capstone_hours: number;
  capstone_score: number;
  capstone_grade: string;
  capstone_status: string;

  // Signatories
  signatory_1_name: string;
  signatory_1_role: string;
  signatory_2_name: string;
  signatory_2_role: string;

  // Transcript coursework
  modules_json: TranscriptModule[];

  created_at?: string;
  updated_at?: string;
}

// 1. MEET SESSION (Live Google Meet / Zoom Links)
export interface MeetSession {
  id: string;
  course_id: string;
  course_title: string;
  title: string;
  instructor: string;
  meet_url: string;
  qr_token: string; // Token kode QR aktif
  scheduled_at: string;
  expires_at: string;
  status: "scheduled" | "live" | "completed";
}

// 2. ATTENDANCE RECORD (Catatan Presensi Barcode)
export interface AttendanceRecord {
  id: string;
  session_id: string;
  session_title: string;
  user_id: string;
  user_name: string;
  nim_id: string;
  scanned_at: string;
  method: "qr_scanner" | "token_code";
  points_earned: number;
}

// 3. ASSIGNMENT (Tugas Proyek & Studi Kasus)
export interface Assignment {
  id: string;
  course_id: string;
  course_title: string;
  title: string;
  description: string;
  deadline: string;
  max_score: number;
  submission_format: "github_or_drive" | "url" | "document";
  /** Tautan Google Drive materi/soal essay dari admin (opsional) */
  material_url?: string | null;
  /** Waktu tugas diterbitkan — dasar hitung EXP berbasis hari (kalender WIB) */
  created_at?: string;
}

// 4. ASSIGNMENT SUBMISSION (Pengumpulan & Penilaian Tugas)
export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  user_id: string;
  user_name: string;
  nim_id: string;
  submission_url: string;
  notes: string;
  submitted_at: string;
  score: number | null;
  feedback: string | null;
  status: "pending" | "graded" | "late";
}

// Opsi kategori & level materi — WAJIB tetap cocok dengan CHECK constraint
// pada tabel `public.courses` (courses_category_check / courses_level_check).
export const COURSE_CATEGORIES = [
  "Sesi Minggu Ini",
  "Workshop & Hands-On",
  "Proyek Bersama",
  "Arsip Recording",
] as const;

export const COURSE_LEVELS = [
  "Pemula (Beginner)",
  "Menengah (Intermediate)",
  "Lanjutan (Advanced)",
  "Semua Tingkat (All Levels)",
] as const;

// 5. COMPETITION (Info Lomba / Event yang dipublikasikan admin)
export interface Competition {
  id: string;
  title: string;
  description: string;
  /** Tautan lomba/event (wajib URL valid) */
  url: string;
  /** Gambar preview (auto dari OG link, bisa diganti manual) */
  image_url?: string | null;
  /** Nama file guidebook yang diunggah admin (opsional) */
  guidebook_name?: string | null;
  /** Path file di bucket Supabase Storage `guidebooks` (opsional) */
  guidebook_path?: string | null;
  /** Batas waktu lomba — status kadaluarsa diturunkan saat dibaca */
  expires_at?: string | null;
  created_at?: string;
}

/** Status lomba yang diturunkan dari `expires_at` vs waktu render (derive-on-read). */
export type CompetitionStatus = "ongoing" | "expired";
