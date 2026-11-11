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
  score: number;
  completed_modules: number;
  total_hours: number;
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
  correct_option?: string; // Optional on client side for security
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
