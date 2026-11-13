import {
  Profile,
  Course,
  CourseEnrollment,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Certificate,
  MeetSession,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Competition,
  CompetitionStatus,
} from "../types/database";

// Registered Accounts (Admin, Anggota & Instruktur Resmi UTDI - Synced with Supabase Auth)
export const SEED_PROFILES: Profile[] = [
  {
    id: "71c1be75-7e15-407f-80c9-a525202e23da",
    nim_id: "255720025",
    full_name: "Nurul Layli",
    email: "nurul.layli25@students.utdi.ac.id",
    role: "admin",
    role_title: "Curator Admin & PIC Komunitas",
    division: "Biro Kemahasiswaan & BDC UTDI",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    password: "Nurul123",
    score: 0.0,
    completed_modules: 0,
    total_hours: 0.0,
    points: 0,
    attendance_rate: 100,
    total_attendances: 0,
    total_sessions: 0,
  },
  {
    id: "78a53c2c-fbd8-435e-b16e-0cb1b4291a31",
    nim_id: "245720024",
    full_name: "Arrafi Nur Hafiz",
    email: "arrafi.nur24@students.utdi.ac.id",
    role: "learner",
    role_title: "Corporate Learner (Student Chapter)",
    division: "Academic College Community",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    password: "secretPassword123",
    score: 0.0,
    completed_modules: 0,
    total_hours: 0.0,
    points: 0,
    attendance_rate: 0,
    total_attendances: 0,
    total_sessions: 0,
  },
  {
    id: "07343796-f393-4f54-8488-60fb6a3bf9f2",
    nim_id: "INS-2026-01",
    full_name: "Dr. Evelyn Vance",
    email: "evelyn.vance@utdi.ac.id",
    role: "instructor",
    role_title: "Inisiator & Pemateri Komunitas",
    division: "Biro Akademik & BDC UTDI",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    password: "secretPassword123",
    score: 95.0,
    completed_modules: 5,
    total_hours: 60.0,
    points: 1200,
    attendance_rate: 100,
    total_attendances: 6,
    total_sessions: 6,
  },
];

// Seed Courses
export const SEED_COURSES: Course[] = [
  {
    id: "ACT-01",
    title: "Ngoding Bareng: Membangun Web App Interaktif dari Nol",
    category: "Sesi Minggu Ini",
    session_type: "Live Session",
    instructor: "Dr. Evelyn Vance & Tim Web Dev",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Live Session (2 Jam)",
    level: "Pemula (Beginner)",
    learners_count: 340,
    rating: 4.9,
    icon: "Code",
    badge_color: "bg-rose-100 text-rose-700",
    description:
      "Sesi interaktif mingguan membedah struktur HTML5, styling Tailwind, dan logika JavaScript interaktif langsung dengan live coding bersama anggota.",
    syllabus: [
      "Struktur Dasar Web Modern & Best Practice HTML5",
      "Live Coding: Styling Responsive dengan Tailwind CSS",
      "Interaktivitas & DOM Manipulation JavaScript",
      "Tanya Jawab & Bedah Kode Bareng Anggota Komunitas",
    ],
  },
  {
    id: "ACT-02",
    title: "Workshop Hands-On: Audit Keamanan Akun & Pengujian Jaringan",
    category: "Workshop & Hands-On",
    session_type: "Workshop Lab",
    instructor: "Ir. Hendra Saputra, M.Kom",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Workshop Lab (3 Jam)",
    level: "Semua Tingkat (All Levels)",
    learners_count: 420,
    rating: 4.9,
    icon: "Terminal",
    badge_color: "bg-emerald-100 text-emerald-700",
    description:
      "Praktik langsung simulasi mendeteksi tautan phishing, analisis lalu lintas Wi-Fi rentan, serta konfigurasi 2FA hardware key.",
    syllabus: [
      "Simulasi Uji Coba Serangan Social Engineering & Phishing",
      "Inspeksi Jaringan Wi-Fi Publik dengan Wireshark Dasar",
      "Langkah Proteksi Password Manager & Multi-Factor Auth",
      "Checklist Keamanan Siber Mandiri untuk Laptop & Ponsel",
    ],
  },
  {
    id: "ACT-03",
    title: "Proyek Kolaborasi: UI/UX Open Source Design System Komunitas",
    category: "Proyek Bersama",
    session_type: "Project File",
    instructor: "Maya Kartika, S.Ds",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Project File",
    level: "Pemula (Beginner)",
    learners_count: 280,
    rating: 4.8,
    icon: "FolderArchive",
    badge_color: "bg-purple-100 text-purple-700",
    description:
      "Repositori aset desain, komponen Figma terbuka, dan panduan kontribusi bareng untuk membangun UI kit resmi komunitas kampus.",
    syllabus: [
      "Panduan Kontribusi & Tata Kelola Figma Team Workspace",
      "Penyusunan Desain Token: Palet Warna & Tipografi",
      "Pembuatan Komponen Tombol, Input & Dialog Reusable",
      "Review Bersama & Penggabungan Aset Kontributor",
    ],
  },
  {
    id: "ACT-04",
    title: "Rekaman Sharing: Memulai Startup Digital & Pitching ke Inkubator",
    category: "Arsip Recording",
    session_type: "Rekaman Web",
    instructor: "Rian Danuarta, MBA",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Rekaman Web (1.5 Jam)",
    level: "Pemula (Beginner)",
    learners_count: 510,
    rating: 4.9,
    icon: "PlayCircle",
    badge_color: "bg-blue-100 text-blue-700",
    description:
      "Arsip video sharing alumni mengenai langkah validasi ide produk teknologi, menyusun Business Model Canvas, dan kiat lolos seleksi pendanaan inkubator.",
    syllabus: [
      "Rekaman Bagian 1: Validasi Masalah & Customer Interview",
      "Rekaman Bagian 2: Menyusun Pitch Deck 10 Slide Efektif",
      "Template Dokumen Pitching & Lembar Evaluasi Bisnis",
      "Sesi Q&A Diskusi Pengalaman Founder Startup Mahasiswa",
    ],
  },
  {
    id: "ACT-05",
    title: "Deploy Bareng: Hosting Web & Domain Gratis Menggunakan Cloud VPS",
    category: "Workshop & Hands-On",
    session_type: "Workshop Lab",
    instructor: "Arya Pratama, S.Kom",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Workshop Lab (2.5 Jam)",
    level: "Menengah (Intermediate)",
    learners_count: 390,
    rating: 4.8,
    icon: "Cloud",
    badge_color: "bg-amber-100 text-amber-700",
    description:
      "Panduan langkah demi langkah mem-publish aplikasi web ke server cloud Linux, konfigurasi DNS domain gratis, dan sertifikat SSL Let's Encrypt.",
    syllabus: [
      "Pengenalan Terminal Linux & SSH Key Authentication",
      "Instalasi Nginx Web Server & Konfigurasi Virtual Host",
      "Pemasangan Gratis SSL/TLS HTTPS dengan Certbot",
      "Otomasi Deploy Git Webhook Sederhana",
    ],
  },
];

// Seed Quiz & Questions (Dikosongkan untuk awal pangkalan data bersih)
export const SEED_QUIZZES: Quiz[] = [];
export const SEED_QUIZ: Quiz | null = null;
export const SEED_QUESTIONS: QuizQuestion[] = [];

// Seed Certificates (Dikosongkan untuk awal pangkalan data bersih)
export const SEED_CERTIFICATES: Certificate[] = [];

// Seed Meet Sessions (Dikosongkan untuk awal pangkalan data bersih)
export const SEED_SESSIONS: MeetSession[] = [];

// Seed Attendances (Dikosongkan untuk awal pangkalan data bersih)
export const SEED_ATTENDANCES: AttendanceRecord[] = [];

// Seed Assignments (Fitur 5)
export const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: "assign-01",
    course_id: "ACT-01",
    course_title: "Ngoding Bareng: Membangun Web App Interaktif dari Nol",
    title: "Tugas 1: Pembangunan Komponen Reusable & Form Validasi Next.js",
    description:
      "Bangun arsitektur komponen form login dan pendaftaran yang memiliki validasi domain email @students.utdi.ac.id, feedback Toast interaktif, serta integrasi Tailwind CSS berstandar Clean Code.",
    deadline: "2026-11-20T23:59:00Z",
    max_score: 100,
    submission_format: "github_or_drive",
  },
  {
    id: "assign-02",
    course_id: "ACT-02",
    course_title: "Workshop Hands-On: Audit Keamanan Akun & Pengujian Jaringan",
    title: "Tugas 2: Laporan Analisis Serangan Phishing & Hardening 2FA",
    description:
      "Susun laporan ringkas identifikasi jejak digital email phishing, analisis header SMTP, dan dokumentasi konfigurasi Multi-Factor Authentication (MFA) berbasis hardware token.",
    deadline: "2026-11-25T23:59:00Z",
    max_score: 100,
    submission_format: "github_or_drive",
  },
];

// Seed Assignment Submissions (Dikosongkan untuk awal pangkalan data bersih)
export const SEED_SUBMISSIONS: AssignmentSubmission[] = [];

// Initial Enrollments (Dikosongkan untuk awal pangkalan data bersih)
export const SEED_ENROLLMENTS: CourseEnrollment[] = [];

// Stateful Repository
/**
 * Menghitung status sesi secara otomatis berdasarkan jadwal waktu.
 * - Sekarang < scheduled_at   => "scheduled" (Terjadwal)
 * - scheduled_at <= Sekarang < expires_at => "live" (Aktif berlangsung)
 * - Sekarang >= expires_at    => "completed" (Selesai)
 */
export function deriveMeetSessionStatus(
  session: { scheduled_at?: string; expires_at?: string; status?: MeetSession["status"] },
  nowMs: number = Date.now()
): "scheduled" | "live" | "completed" {
  if (!session.scheduled_at || !session.expires_at) {
    return session.status || "scheduled";
  }
  const startMs = new Date(session.scheduled_at).getTime();
  const endMs = new Date(session.expires_at).getTime();

  if (isNaN(startMs) || isNaN(endMs)) {
    return session.status || "scheduled";
  }

  if (nowMs < startMs) {
    return "scheduled";
  }
  if (nowMs >= endMs) {
    return "completed";
  }
  return "live";
}

/**
 * Menurunkan status info lomba dari `expires_at` vs waktu render.
 * - expires_at kosong        => "ongoing" (tanpa batas waktu)
 * - Sekarang < expires_at    => "ongoing" (Masih Dibuka)
 * - Sekarang >= expires_at   => "expired" (Kadaluarsa / Ditutup)
 */
export function deriveCompetitionStatus(
  competition: { expires_at?: string | null },
  nowMs: number = Date.now()
): CompetitionStatus {
  if (!competition.expires_at) return "ongoing";
  const endMs = new Date(competition.expires_at).getTime();
  if (isNaN(endMs)) return "ongoing";
  return nowMs >= endMs ? "expired" : "ongoing";
}

class BdcDataStore {
  /**
   * Mengganti isi cache in-memory dengan data segar dari Supabase.
   * Dipanggil hydrateFromDb() di setiap render server / server action.
   */
  hydrate(data: Partial<{
    profiles: Profile[];
    courses: Course[];
    quizzes: Quiz[];
    questions: QuizQuestion[];
    attempts: QuizAttempt[];
    certificates: Certificate[];
    enrollments: CourseEnrollment[];
    sessions: MeetSession[];
    attendances: AttendanceRecord[];
    assignments: Assignment[];
    submissions: AssignmentSubmission[];
    competitions: Competition[];
  }>) {
    if (data.profiles) {
      // Pertahankan field password lokal yang tidak tersimpan di kolom DB
      this.profiles = data.profiles.map((p) => {
        const existing = this.profiles.find((e) => e.id === p.id);
        return {
          ...p,
          password: p.password ?? existing?.password,
          password_hash: p.password_hash ?? existing?.password_hash,
        };
      });
    }
    if (data.courses) this.courses = data.courses;
    if (data.quizzes) this.quizzes = data.quizzes;
    if (data.questions) this.questions = data.questions;
    if (data.attempts) this.attempts = data.attempts;
    if (data.certificates) this.certificates = data.certificates;
    if (data.enrollments) this.enrollments = data.enrollments;
    if (data.sessions) {
      this.sessions = data.sessions.map((s) => ({
        ...s,
        status: deriveMeetSessionStatus(s),
      }));
    }
    if (data.attendances) this.attendances = data.attendances;
    if (data.assignments) this.assignments = data.assignments;
    if (data.submissions) this.submissions = data.submissions;
    if (data.competitions) this.competitions = data.competitions;
  }

  private profiles = [...SEED_PROFILES];
  private courses = [...SEED_COURSES];
  private quizzes: Quiz[] = [...SEED_QUIZZES];
  private questions = [...SEED_QUESTIONS];
  private attempts: QuizAttempt[] = [];
  private certificates = [...SEED_CERTIFICATES];
  private enrollments = [...SEED_ENROLLMENTS];
  private sessions = [...SEED_SESSIONS];
  private attendances = [...SEED_ATTENDANCES];
  private assignments = [...SEED_ASSIGNMENTS];
  private submissions = [...SEED_SUBMISSIONS];
  private competitions: Competition[] = [];

  // Profiles
  getProfiles() {
    return this.profiles;
  }

  getProfileById(id: string) {
    return this.profiles.find((p) => p.id === id) || null;
  }

  getProfileByNimOrEmail(identifier: string) {
    const clean = identifier.trim().toLowerCase();
    return (
      this.profiles.find(
        (p) => p.nim_id.toLowerCase() === clean || p.email.toLowerCase() === clean
      ) || null
    );
  }

  registerProfile(profile: Profile): Profile {
    const existing = this.profiles.find(
      (p) =>
        p.id === profile.id ||
        p.email.toLowerCase() === profile.email.toLowerCase() ||
        p.nim_id.toLowerCase() === profile.nim_id.toLowerCase()
    );
    if (existing) {
      return existing;
    }
    this.profiles.push(profile);
    return profile;
  }

  deleteUser(id: string): boolean {
    const initialLen = this.profiles.length;
    this.profiles = this.profiles.filter((p) => p.id !== id);
    if (this.profiles.length === initialLen) return false;

    // Cascade hapus referensi entitas terkait user di in-memory store
    this.enrollments = this.enrollments.filter((e) => e.user_id !== id);
    this.submissions = this.submissions.filter((s) => s.user_id !== id);
    this.certificates = this.certificates.filter((c) => c.user_id !== id);
    this.attendances = this.attendances.filter((a) => a.user_id !== id);
    this.attempts = this.attempts.filter((a) => a.user_id !== id);

    return true;
  }

  updateProfile(id: string, update: Partial<Profile>) {
    const index = this.profiles.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.profiles[index] = { ...this.profiles[index], ...update };
      return this.profiles[index];
    }
    return null;
  }

  updateUserPassword(id: string, newPassword: string) {
    const profile = this.updateProfile(id, { password: newPassword });
    return !!profile;
  }

  updateUserRole(id: string, newRole: import("../types/database").UserRole, roleTitle?: string) {
    const user = this.getProfileById(id);
    if (!user) return null;

    let defaultTitle = user.role_title;
    if (roleTitle) {
      defaultTitle = roleTitle;
    } else if (newRole === "admin") {
      defaultTitle = "Curator Admin & PIC Komunitas";
    } else if (newRole === "instructor") {
      defaultTitle = "Inisiator & Pemateri Komunitas";
    } else if (newRole === "learner") {
      defaultTitle = "Corporate Learner (Student Chapter)";
    }

    return this.updateProfile(id, { role: newRole, role_title: defaultTitle });
  }

  updateStudentIdentity(id: string, fullName: string, nimId: string) {
    const profile = this.updateProfile(id, { full_name: fullName, nim_id: nimId });
    if (!profile) return null;

    // Sinkronkan ke data sertifikat
    this.certificates = this.certificates.map((c) =>
      c.user_id === id ? { ...c, recipient_name: fullName, nim_id: nimId } : c
    );

    // Sinkronkan ke riwayat presensi
    this.attendances = this.attendances.map((a) =>
      a.user_id === id ? { ...a, user_name: fullName, nim_id: nimId } : a
    );

    // Sinkronkan ke submission tugas
    this.submissions = this.submissions.map((s) =>
      s.user_id === id ? { ...s, user_name: fullName, nim_id: nimId } : s
    );

    return profile;
  }

  // Courses
  getCourses() {
    return this.courses;
  }

  getCourseById(id: string) {
    return this.courses.find((c) => c.id === id) || null;
  }

  createCourse(payload: Omit<Course, "id">) {
    // Kode materi pendek untuk ditampilkan di kartu & URL (MTR-01, MTR-02, ...)
    const existingNumbers = this.courses
      .map((c) => (/^MTR-\d+$/.test(c.id) ? parseInt(c.id.slice(4), 10) : NaN))
      .filter((n) => !isNaN(n));
    const next = (existingNumbers.length ? Math.max(...existingNumbers) : 0) + 1;
    const newCourse: Course = {
      ...payload,
      id: `MTR-${String(next).padStart(2, "0")}`,
    };
    this.courses.unshift(newCourse);
    return newCourse;
  }

  deleteCourse(id: string) {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.courses.splice(index, 1);
    this.enrollments = this.enrollments.filter((e) => e.course_id !== id);
    return true;
  }

  // Enrollments
  getEnrollments(userId: string) {
    return this.enrollments.filter((e) => e.user_id === userId);
  }

  getEnrollment(userId: string, courseId: string) {
    return (
      this.enrollments.find((e) => e.user_id === userId && e.course_id === courseId) || null
    );
  }

  toggleCourseTopic(userId: string, courseId: string, topicIndex: number) {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    let enrollment = this.getEnrollment(userId, courseId);
    if (!enrollment) {
      enrollment = {
        id: `enr-${Date.now()}`,
        user_id: userId,
        course_id: courseId,
        completed_topics: [topicIndex],
        progress_percent: Math.round((1 / course.syllabus.length) * 100),
        is_completed: course.syllabus.length === 1,
      };
      this.enrollments.push(enrollment);
      return enrollment;
    }

    const current = new Set(enrollment.completed_topics);
    if (current.has(topicIndex)) {
      current.delete(topicIndex);
    } else {
      current.add(topicIndex);
    }

    const completed_topics = Array.from(current).sort();
    const progress_percent = Math.round(
      (completed_topics.length / course.syllabus.length) * 100
    );
    const is_completed = progress_percent === 100;

    enrollment.completed_topics = completed_topics;
    enrollment.progress_percent = progress_percent;
    enrollment.is_completed = is_completed;

    return enrollment;
  }

  // Quizzes & Questions
  ensureDefaultQuiz(): Quiz {
    if (this.quizzes.length === 0) {
      const defaultQuiz: Quiz = {
        id: "e2b4f9d0-1234-5678-90ab-cdef12345678",
        title: "Uji Evaluasi Akhir: Keamanan Siber & Pemrograman Web Terintegrasi",
        description:
          "Ujian komprehensif standar kompetensi BDC UTDI meliputi kriptografi modern, keamanan aplikasi web, mitigasi XSS/CSRF, serta tata kelola ISO 27001.",
        time_limit_minutes: 30,
        passing_score: 75,
        total_questions: this.questions.length,
        is_published: true,
      };
      this.quizzes.push(defaultQuiz);
    }
    return this.quizzes[0];
  }

  getQuiz(id: string): Quiz | null {
    if (this.quizzes.length === 0) {
      return this.ensureDefaultQuiz();
    }
    return this.quizzes.find((q) => q.id === id) || this.quizzes[0] || null;
  }

  getAllQuizzes(): Quiz[] {
    this.ensureDefaultQuiz();
    return this.quizzes;
  }

  getAllQuestions(): QuizQuestion[] {
    return [...this.questions].sort((a, b) => a.order_index - b.order_index);
  }

  getQuizQuestions(quizId: string) {
    const questions = this.questions.filter((q) => q.quiz_id === quizId);
    if (questions.length === 0 && this.questions.length > 0) {
      return [...this.questions].sort((a, b) => a.order_index - b.order_index);
    }
    return questions.sort((a, b) => a.order_index - b.order_index);
  }

  addQuizQuestion(payload: Omit<QuizQuestion, "id">): QuizQuestion {
    const quiz = this.ensureDefaultQuiz();
    const newId = `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newQuestion: QuizQuestion = {
      ...payload,
      id: newId,
      quiz_id: payload.quiz_id || quiz.id,
      order_index: payload.order_index || (this.questions.length + 1),
      weight: payload.weight ?? 1.0,
      options: payload.options || [],
      correct_option: payload.correct_option || "A",
      explanation: payload.explanation || null,
    };
    this.questions.push(newQuestion);
    quiz.total_questions = this.questions.length;
    return newQuestion;
  }

  deleteQuizQuestion(questionId: string): boolean {
    const initialLen = this.questions.length;
    this.questions = this.questions.filter((q) => q.id !== questionId);
    if (this.questions.length < initialLen) {
      this.questions.forEach((q, idx) => {
        q.order_index = idx + 1;
      });
      const quiz = this.ensureDefaultQuiz();
      quiz.total_questions = this.questions.length;
      return true;
    }
    return false;
  }

  recordAttempt(attempt: Omit<QuizAttempt, "id">) {
    const fullAttempt: QuizAttempt = {
      ...attempt,
      id: `att-${Date.now()}`,
    };
    this.attempts.unshift(fullAttempt);
    return fullAttempt;
  }

  getAttempts(userId: string) {
    return this.attempts.filter((a) => a.user_id === userId);
  }

  // Certificates
  getCertificates() {
    return this.certificates;
  }

  getCertificateById(id: string) {
    return this.certificates.find((c) => c.id === id) || null;
  }

  getCertificateByNimOrNumber(query: string) {
    const clean = query.trim().toUpperCase();
    return (
      this.certificates.find(
        (c) =>
          c.certificate_number.toUpperCase() === clean ||
          c.nim_id.toUpperCase() === clean ||
          c.transcript_number.toUpperCase() === clean
      ) || null
    );
  }

  getCertificateByUserId(userId: string) {
    return this.certificates.find((c) => c.user_id === userId) || null;
  }

  updateCertificate(id: string, update: Partial<Certificate>) {
    const idx = this.certificates.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.certificates[idx] = { ...this.certificates[idx], ...update };
      return this.certificates[idx];
    }
    return null;
  }

  // 1. MEET SESSIONS
  getSessions() {
    const now = Date.now();
    return this.sessions.map((s) => ({
      ...s,
      status: deriveMeetSessionStatus(s, now),
    }));
  }

  getLiveSession() {
    const sessions = this.getSessions();
    return sessions.find((s) => s.status === "live") || null;
  }

  getSessionById(id: string) {
    const session = this.sessions.find((s) => s.id === id);
    if (!session) return null;
    return {
      ...session,
      status: deriveMeetSessionStatus(session),
    };
  }

  setMeetSession(payload: Partial<MeetSession> & { id?: string }) {
    if (payload.id) {
      const idx = this.sessions.findIndex((s) => s.id === payload.id);
      if (idx !== -1) {
        const merged = { ...this.sessions[idx], ...payload };
        merged.status = deriveMeetSessionStatus(merged);
        this.sessions[idx] = merged;
        return this.sessions[idx];
      }
    }

    const scheduled_at = payload.scheduled_at || new Date().toISOString();
    const expires_at = payload.expires_at || new Date(Date.now() + 3 * 3600 * 1000).toISOString();
    const computedStatus = deriveMeetSessionStatus({ scheduled_at, expires_at });

    const newSession: MeetSession = {
      id: `session-${Date.now()}`,
      course_id: payload.course_id || "ACT-01",
      course_title: payload.course_title || "Ngoding Bareng Web App",
      title: payload.title || "Sesi Live Pertemuan BDC",
      instructor: payload.instructor || "Dr. Evelyn Vance",
      meet_url: payload.meet_url || "https://meet.google.com/bdc-utdi-web",
      qr_token: payload.qr_token || `BDC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      scheduled_at,
      expires_at,
      status: payload.status && !payload.scheduled_at ? payload.status : computedStatus,
    };

    this.sessions.unshift(newSession);
    return newSession;
  }

  deleteMeetSession(id: string): boolean {
    const initialLen = this.sessions.length;
    this.sessions = this.sessions.filter((s) => s.id !== id);
    return this.sessions.length < initialLen;
  }

  // 2. ATTENDANCES (Barcode / QR)
  getAttendances() {
    return this.attendances;
  }

  getAttendancesByUser(userId: string) {
    return this.attendances.filter((a) => a.user_id === userId);
  }

  getAttendancesBySession(sessionId: string) {
    return this.attendances.filter((a) => a.session_id === sessionId);
  }

  recordAttendance(
    userId: string,
    qrToken: string,
    method: "qr_scanner" | "token_code" = "qr_scanner"
  ) {
    const user = this.getProfileById(userId);
    if (!user) return { success: false, error: "Mahasiswa tidak ditemukan." };

    // Ekstrak token jika input berbentuk URL (misal scan kamera membaca URL proyektor)
    let token = qrToken.trim();
    if (token.includes("token=")) {
      const match = token.match(/token=([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        token = match[1];
      }
    }
    const cleanToken = token.toUpperCase();

    // Find session matching token
    const matchingSession = this.sessions.find(
      (s) => s.qr_token.toUpperCase() === cleanToken
    );

    if (!matchingSession) {
      return { success: false, error: "Kode QR / Barcode presensi tidak valid atau sesi tidak ditemukan." };
    }

    const sessionStatus = deriveMeetSessionStatus(matchingSession);

    if (sessionStatus === "scheduled") {
      const startTime = new Date(matchingSession.scheduled_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        success: false,
        error: `Sesi "${matchingSession.title}" belum dimulai (dijadwalkan pukul ${startTime} WIB). Presensi belum dibuka.`,
      };
    }

    if (sessionStatus === "completed") {
      return {
        success: false,
        error: `Sesi "${matchingSession.title}" telah berakhir. Presensi ditutup.`,
      };
    }

    const session = matchingSession;

    // Check if user already attended this session
    const existing = this.attendances.find(
      (a) => a.session_id === session.id && a.user_id === userId
    );
    if (existing) {
      return { success: false, error: "Anda sudah melakukan presensi pada sesi pertemuan ini." };
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      session_id: session.id,
      session_title: session.title,
      user_id: user.id,
      user_name: user.full_name,
      nim_id: user.nim_id,
      scanned_at: new Date().toISOString(),
      method,
      points_earned: 100,
    };

    this.attendances.unshift(newRecord);

    // Update user attendance stats & XP
    const newTotalAttend = (user.total_attendances || 0) + 1;
    const newPoints = (user.points || 0) + 100;
    const totalSessions = Math.max(8, user.total_sessions || 8);
    const newRate = Math.min(100, Math.round((newTotalAttend / totalSessions) * 1000) / 10);

    this.updateProfile(userId, {
      total_attendances: newTotalAttend,
      points: newPoints,
      attendance_rate: newRate,
    });

    return { success: true, record: newRecord, pointsEarned: 100 };
  }

  // 3. ASSIGNMENTS
  getAssignments() {
    return this.assignments;
  }

  getAssignmentById(id: string) {
    return this.assignments.find((a) => a.id === id) || null;
  }

  createAssignment(payload: Omit<Assignment, "id">) {
    const newAssignment: Assignment = {
      ...payload,
      id: `assign-${Date.now()}`,
    };
    this.assignments.unshift(newAssignment);
    return newAssignment;
  }

  deleteAssignment(id: string) {
    const index = this.assignments.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.assignments.splice(index, 1);
    this.submissions = this.submissions.filter((s) => s.assignment_id !== id);
    return true;
  }

  // Info Lomba / Event (dipublikasikan admin ke portal)
  /** Seluruh lomba, terbaru di atas — status diturunkan saat dibaca (derive-on-read). */
  getCompetitions() {
    return [...this.competitions].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  }

  /** Lomba aktif saja (belum kadaluarsa) — untuk widget dashboard. */
  getActiveCompetitions() {
    const now = Date.now();
    return this.getCompetitions().filter((c) => deriveCompetitionStatus(c, now) === "ongoing");
  }

  getCompetitionById(id: string) {
    return this.competitions.find((c) => c.id === id) || null;
  }

  createCompetition(payload: Omit<Competition, "id" | "created_at">) {
    const newCompetition: Competition = {
      ...payload,
      id: `comp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.competitions.unshift(newCompetition);
    return newCompetition;
  }

  deleteCompetition(id: string) {
    const index = this.competitions.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.competitions.splice(index, 1);
    return true;
  }

  // 4. SUBMISSIONS
  getSubmissions() {
    return this.submissions;
  }

  getSubmissionsByUser(userId: string) {
    return this.submissions.filter((s) => s.user_id === userId);
  }

  getSubmission(assignmentId: string, userId: string) {
    return (
      this.submissions.find(
        (s) => s.assignment_id === assignmentId && s.user_id === userId
      ) || null
    );
  }

  submitAssignment(
    assignmentId: string,
    userId: string,
    submissionUrl: string,
    notes: string
  ) {
    const user = this.getProfileById(userId);
    if (!user) return { success: false, error: "Pengguna tidak valid." };

    const assignment = this.getAssignmentById(assignmentId);
    if (!assignment) return { success: false, error: "Tugas tidak ditemukan." };

    const existingIndex = this.submissions.findIndex(
      (s) => s.assignment_id === assignmentId && s.user_id === userId
    );

    const submission: AssignmentSubmission = {
      id: existingIndex !== -1 ? this.submissions[existingIndex].id : `sub-${Date.now()}`,
      assignment_id: assignmentId,
      user_id: userId,
      user_name: user.full_name,
      nim_id: user.nim_id,
      submission_url: submissionUrl,
      notes,
      submitted_at: new Date().toISOString(),
      score: existingIndex !== -1 ? this.submissions[existingIndex].score : null,
      feedback: existingIndex !== -1 ? this.submissions[existingIndex].feedback : null,
      status: existingIndex !== -1 && this.submissions[existingIndex].status === "graded" ? "graded" : "pending",
    };

    if (existingIndex !== -1) {
      this.submissions[existingIndex] = submission;
    } else {
      this.submissions.unshift(submission);
      // Award 150 XP for completing assignment submission
      this.updateProfile(userId, { points: (user.points || 0) + 150 });
    }

    return { success: true, submission };
  }

  gradeSubmission(submissionId: string, score: number, feedback: string) {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return { success: false, error: "Submission tidak ditemukan." };

    sub.score = score;
    sub.feedback = feedback;
    sub.status = "graded";

    // Nilai tugas tertinggi menjadi skor profil (pengganti skor ujian)
    const best = this.submissions
      .filter((s) => s.user_id === sub.user_id && s.status === "graded")
      .reduce((max, s) => Math.max(max, s.score || 0), 0);
    this.updateProfile(sub.user_id, { score: best });

    return { success: true, submission: sub };
  }

  // 5. LEADERBOARD (Rank Berdasarkan Kehadiran & XP)
  getLeaderboard() {
    const learners = this.profiles.filter((p) => p.role === "learner");
    return [...learners].sort((a, b) => {
      // Sort by attendance rate first, then by XP points, then by score
      if (b.attendance_rate !== a.attendance_rate) {
        return b.attendance_rate - a.attendance_rate;
      }
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.score - a.score;
    });
  }
}

// Global Singleton for runtime persistence across Server Action calls
const globalForStore = globalThis as unknown as { bdcStore: BdcDataStore | undefined };
export const bdcStore = globalForStore.bdcStore ?? new BdcDataStore();
if (process.env.NODE_ENV !== "production") globalForStore.bdcStore = bdcStore;
