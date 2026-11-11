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
} from "../types/database";

// Seed Profiles with Points & Attendance
export const SEED_PROFILES: Profile[] = [
  {
    id: "user-siti-255720056",
    nim_id: "255720056",
    full_name: "Siti Rahmawati",
    email: "255720056@students.utdi.ac.id",
    role: "learner",
    role_title: "Corporate Learner (Student Chapter)",
    division: "Academic College Community",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    score: 96.4,
    completed_modules: 4,
    total_hours: 64.5,
    points: 1450, // Top 1 XP
    attendance_rate: 100, // 100%
    total_attendances: 8,
    total_sessions: 8,
  },
  {
    id: "user-budi-255720058",
    nim_id: "255720058",
    full_name: "Budi Santoso, S.Kom.",
    email: "255720058@students.utdi.ac.id",
    role: "learner",
    role_title: "Junior Cloud Engineer Cohort",
    division: "Academic College Community",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    score: 89.2,
    completed_modules: 3,
    total_hours: 48.0,
    points: 1280, // Top 2 XP
    attendance_rate: 87.5,
    total_attendances: 7,
    total_sessions: 8,
  },
  {
    id: "user-anisa-255720061",
    nim_id: "255720061",
    full_name: "Anisa Permata Sari",
    email: "255720061@students.utdi.ac.id",
    role: "learner",
    role_title: "UI/UX Researcher Cohort",
    division: "Academic College Community",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    score: 92.0,
    completed_modules: 4,
    total_hours: 58.0,
    points: 1190, // Top 3 XP
    attendance_rate: 87.5,
    total_attendances: 7,
    total_sessions: 8,
  },
  {
    id: "user-dimas-255720070",
    nim_id: "255720070",
    full_name: "Dimas Arya Pratama",
    email: "255720070@students.utdi.ac.id",
    role: "learner",
    role_title: "Cybersecurity Analyst Fellow",
    division: "Academic College Community",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    score: 88.5,
    completed_modules: 3,
    total_hours: 46.0,
    points: 980,
    attendance_rate: 75.0,
    total_attendances: 6,
    total_sessions: 8,
  },
  {
    id: "admin-bagas-001",
    nim_id: "ADM-0001-BT",
    full_name: "Bagas Triaji, S.Kom., M.Kom.",
    email: "bagas.triaji@utdi.ac.id",
    role: "admin",
    role_title: "Kemahasiswaan & Tim Akademik",
    division: "Biro Kemahasiswaan & BDC UTDI",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    score: 99.0,
    completed_modules: 5,
    total_hours: 120.0,
    points: 9999,
    attendance_rate: 100,
    total_attendances: 8,
    total_sessions: 8,
  },
  {
    id: "instructor-evelyn-002",
    nim_id: "INS-0002-EV",
    full_name: "Dr. Evelyn Vance",
    email: "evelyn.vance@utdi.ac.id",
    role: "instructor",
    role_title: "Lead Cybersecurity Curriculum Curator",
    division: "Academic College Community",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    score: 98.5,
    completed_modules: 5,
    total_hours: 100.0,
    points: 9999,
    attendance_rate: 100,
    total_attendances: 8,
    total_sessions: 8,
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

// Seed Quiz
export const SEED_QUIZ: Quiz = {
  id: "quiz-bdc-eval-2026",
  title: "Uji Evaluasi Akhir: Keamanan Siber & Pemrograman Web Terintegrasi",
  description:
    "Ujian komprehensif 10 butir soal standar kompetensi BDC UTDI meliputi kriptografi modern, keamanan aplikasi web, mitigasi XSS/CSRF, serta tata kelola ISO 27001.",
  time_limit_minutes: 30,
  passing_score: 75.0,
  total_questions: 10,
  is_published: true,
};

// Seed Quiz Questions (Server-side with correct options)
export const SEED_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-1",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 1,
    question_text:
      "Metode enkripsi mana yang menggunakan sepasang kunci publik (public key) dan kunci privat (private key) untuk mengamankan transmisi data?",
    options: [
      { id: "A", text: "Enkripsi Simetris (AES-256)" },
      { id: "B", text: "Enkripsi Asimetris (RSA / ECC)" },
      { id: "C", text: "Fungsi Hash Kriptografis (SHA-256)" },
      { id: "D", text: "Base64 Encoding" },
    ],
    correct_option: "B",
    weight: 1.0,
  },
  {
    id: "q-2",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 2,
    question_text:
      "Serangan siber di mana penyerang menyisipkan script berbahaya ke dalam halaman web yang kemudian dieksekusi di browser korban dikenal dengan istilah?",
    options: [
      { id: "A", text: "SQL Injection (SQLi)" },
      { id: "B", text: "Cross-Site Scripting (XSS)" },
      { id: "C", text: "Distributed Denial of Service (DDoS)" },
      { id: "D", text: "Man-in-the-Middle (MitM)" },
    ],
    correct_option: "B",
    weight: 1.0,
  },
  {
    id: "q-3",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 3,
    question_text:
      "Langkah mitigasi paling efektif untuk mencegah serangan SQL Injection pada aplikasi modern adalah?",
    options: [
      { id: "A", text: "Menggunakan Prepared Statements dan Parameterized Queries" },
      { id: "B", text: "Melakukan enkripsi MD5 pada seluruh input string" },
      { id: "C", text: "Menghapus tanda spasi dari query database" },
      { id: "D", text: "Menonaktifkan firewall server database" },
    ],
    correct_option: "A",
    weight: 1.0,
  },
  {
    id: "q-4",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 4,
    question_text:
      "Standar internasional terkemuka untuk Sistem Manajemen Keamanan Informasi (SMKI / ISMS) adalah?",
    options: [
      { id: "A", text: "ISO 9001:2015" },
      { id: "B", text: "ISO/IEC 27001:2022" },
      { id: "C", text: "IEEE 802.11" },
      { id: "D", text: "RFC 2616" },
    ],
    correct_option: "B",
    weight: 1.0,
  },
  {
    id: "q-5",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 5,
    question_text:
      "Dalam konsep keamanan informasi, prinsip \"CIA Triad\" merupakan singkatan dari?",
    options: [
      { id: "A", text: "Confidentiality, Integrity, Availability" },
      { id: "B", text: "Control, Identification, Authentication" },
      { id: "C", text: "Compliance, Inspection, Authorization" },
      { id: "D", text: "Cryptography, Infrastructure, Analytics" },
    ],
    correct_option: "A",
    weight: 1.0,
  },
  {
    id: "q-6",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 6,
    question_text:
      "Manakah atribut cookie berikut yang berfungsi mencegah script JavaScript di sisi browser membaca token autentikasi sesi?",
    options: [
      { id: "A", text: "SameSite=Lax" },
      { id: "B", text: "HttpOnly" },
      { id: "C", text: "Secure" },
      { id: "D", text: "Domain=.utdi.ac.id" },
    ],
    correct_option: "B",
    weight: 1.0,
  },
  {
    id: "q-7",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 7,
    question_text:
      "Di Next.js App Router, pemanggilan database atau operasi sensitif disarankan diletakkan pada komponen jenis apa?",
    options: [
      { id: "A", text: "Client Component dengan useLayoutEffect" },
      { id: "B", text: "Server Component / Server Actions" },
      { id: "C", text: "Public static JSON file" },
      { id: "D", text: "HTML inline script" },
    ],
    correct_option: "B",
    weight: 1.0,
  },
  {
    id: "q-8",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 8,
    question_text:
      "Protokol jaringan yang digunakan untuk mengamankan pertukaran data web melalui saluran terenkripsi SSL/TLS adalah?",
    options: [
      { id: "A", text: "HTTP" },
      { id: "B", text: "FTP" },
      { id: "C", text: "HTTPS" },
      { id: "D", text: "Telnet" },
    ],
    correct_option: "C",
    weight: 1.0,
  },
  {
    id: "q-9",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 9,
    question_text:
      "Apa fungsi utama dari mekanisme Row Level Security (RLS) pada PostgreSQL Supabase?",
    options: [
      { id: "A", text: "Mempercepat pengurutan kolom string" },
      { id: "B", text: "Membatasi akses baris data secara spesifik berdasarkan token identitas pengguna" },
      { id: "C", text: "Menghapus data duplikat secara otomatis" },
      { id: "D", text: "Mengompresi file media di storage" },
    ],
    correct_option: "B",
    weight: 1.0,
  },
  {
    id: "q-10",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 10,
    question_text:
      "Faktor pembuktian identitas yang menggabungkan kata sandi (knowledge) dengan token OTP di ponsel (possession) disebut?",
    options: [
      { id: "A", text: "Single Sign-On (SSO)" },
      { id: "B", text: "Multi-Factor Authentication (MFA / 2FA)" },
      { id: "C", text: "Role-Based Access Control (RBAC)" },
      { id: "D", text: "Biometric Spoofing" },
    ],
    correct_option: "B",
    weight: 1.0,
  },
];

// Seed Certificates
export const SEED_CERTIFICATES: Certificate[] = [
  {
    id: "cert-siti-001",
    user_id: "user-siti-255720056",
    certificate_number: "BDC-CERT-2026-99482-SEC",
    transcript_number: "BDC-TRX-2026-99482",
    recipient_name: "Siti Rahmawati",
    nim_id: "255720056",
    cohort: "Cohort VI Nasional",
    program_title: "Cybersecurity Compliance & ISO/IEC 27001 Enterprise Defense",
    period: "2026/2027",
    location: "Yogyakarta",
    issue_date: "2026-03-24",
    total_hours: 64.5,
    avg_score: 96.4,
    completion_status: "LULUS (KOMPETEN)",
    cohort_badge: "TOP 3% COHORT",
    is_locked: false,
    capstone_title: "BDC Hub (Web Presensi & Pembelajaran Community)",
    capstone_hours: 16.5,
    capstone_score: 98.0,
    capstone_grade: "A+",
    capstone_status: "Lulus Paripurna",
    signatory_1_name: "Bagas Triaji, S.Kom., M.Kom.",
    signatory_1_role: "Kemahasiswaan",
    signatory_2_name: "Nurul Layli",
    signatory_2_role: "PIC Program BDC",
    modules_json: [
      {
        code: "SEC-501",
        title: "Dasar Kriptografi Modern & Enkripsi Kunci Asimetris",
        hours: 10.0,
        score: 96.0,
        grade: "A",
        status: "Tuntas (Kompeten)",
      },
      {
        code: "SEC-502",
        title: "Proteksi Endpoint, Web App Sec & Mitigasi XSS",
        hours: 12.0,
        score: 98.0,
        grade: "A+",
        status: "Unggul (Paripurna)",
      },
      {
        code: "SEC-503",
        title: "Audit Regulasi ISO/IEC 27001:2022 & Framework Tata Kelola",
        hours: 12.0,
        score: 94.5,
        grade: "A",
        status: "Tuntas (Kompeten)",
      },
      {
        code: "SEC-504",
        title: "Incident Response, Forensik Siber & Cloud SOC Telemetri",
        hours: 14.0,
        score: 97.0,
        grade: "A",
        status: "Tuntas (Kompeten)",
      },
    ],
  },
];

// Seed Meet Sessions (Fitur 6 & Fitur 1)
export const SEED_SESSIONS: MeetSession[] = [
  {
    id: "session-live-01",
    course_id: "ACT-01",
    course_title: "Ngoding Bareng: Membangun Web App Interaktif dari Nol",
    title: "Sesi Pertemuan 3: Integrasi API & State Management Komunitas",
    instructor: "Dr. Evelyn Vance",
    meet_url: "https://meet.google.com/bdc-utdi-web",
    qr_token: "BDC-PRESENSI-LIVE-994",
    scheduled_at: "2026-11-12T08:00:00Z",
    expires_at: "2026-11-12T11:00:00Z",
    status: "live", // Sedang berlangsung
  },
  {
    id: "session-upcoming-02",
    course_id: "ACT-02",
    course_title: "Workshop Hands-On: Audit Keamanan Akun & Pengujian Jaringan",
    title: "Sesi Praktik Lab 2: Simulasi Penetrasi & Analisis Wireshark",
    instructor: "Ir. Hendra Saputra, M.Kom",
    meet_url: "https://meet.google.com/bdc-sec-audit",
    qr_token: "BDC-PRESENSI-SEC-882",
    scheduled_at: "2026-11-15T09:00:00Z",
    expires_at: "2026-11-15T12:00:00Z",
    status: "scheduled",
  },
];

// Seed Attendances (Fitur 1)
export const SEED_ATTENDANCES: AttendanceRecord[] = [
  {
    id: "att-01",
    session_id: "session-live-01",
    session_title: "Sesi Pertemuan 3: Integrasi API & State Management Komunitas",
    user_id: "user-siti-255720056",
    user_name: "Siti Rahmawati",
    nim_id: "255720056",
    scanned_at: "2026-11-12T08:05:12Z",
    method: "qr_scanner",
    points_earned: 100,
  },
  {
    id: "att-02",
    session_id: "session-live-01",
    session_title: "Sesi Pertemuan 3: Integrasi API & State Management Komunitas",
    user_id: "user-budi-255720058",
    user_name: "Budi Santoso, S.Kom.",
    nim_id: "255720058",
    scanned_at: "2026-11-12T08:12:44Z",
    method: "token_code",
    points_earned: 100,
  },
];

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

// Seed Assignment Submissions
export const SEED_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: "sub-01",
    assignment_id: "assign-01",
    user_id: "user-siti-255720056",
    user_name: "Siti Rahmawati",
    nim_id: "255720056",
    submission_url: "https://github.com/sitirahmawati/bdc-nextjs-form",
    notes: "Tugas telah diselesaikan dengan Next.js App Router, TypeScript ketat, dan palet Taste.",
    submitted_at: "2026-11-11T14:30:00Z",
    score: 95.0,
    feedback: "Struktur arsitektur sangat rapi, validasi domain kampus bekerja sempurna. Kerja bagus!",
    status: "graded",
  },
];

// Initial Enrollments
export const SEED_ENROLLMENTS: CourseEnrollment[] = [
  {
    id: "enr-01",
    user_id: "user-siti-255720056",
    course_id: "ACT-01",
    completed_topics: [0, 1, 2, 3],
    progress_percent: 100,
    is_completed: true,
  },
  {
    id: "enr-02",
    user_id: "user-siti-255720056",
    course_id: "ACT-02",
    completed_topics: [0, 1],
    progress_percent: 50,
    is_completed: false,
  },
];

// Stateful Repository
class BdcDataStore {
  private profiles = [...SEED_PROFILES];
  private courses = [...SEED_COURSES];
  private quizzes = [SEED_QUIZ];
  private questions = [...SEED_QUESTIONS];
  private attempts: QuizAttempt[] = [];
  private certificates = [...SEED_CERTIFICATES];
  private enrollments = [...SEED_ENROLLMENTS];
  private sessions = [...SEED_SESSIONS];
  private attendances = [...SEED_ATTENDANCES];
  private assignments = [...SEED_ASSIGNMENTS];
  private submissions = [...SEED_SUBMISSIONS];

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

  updateProfile(id: string, update: Partial<Profile>) {
    const index = this.profiles.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.profiles[index] = { ...this.profiles[index], ...update };
      return this.profiles[index];
    }
    return null;
  }

  // Courses
  getCourses() {
    return this.courses;
  }

  getCourseById(id: string) {
    return this.courses.find((c) => c.id === id) || null;
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

  // Quizzes
  getQuiz(id: string) {
    return this.quizzes.find((q) => q.id === id) || this.quizzes[0];
  }

  getQuizQuestions(quizId: string) {
    return this.questions.filter((q) => q.quiz_id === quizId);
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
    return this.sessions;
  }

  getLiveSession() {
    return this.sessions.find((s) => s.status === "live") || null;
  }

  getSessionById(id: string) {
    return this.sessions.find((s) => s.id === id) || null;
  }

  setMeetSession(payload: Partial<MeetSession> & { id?: string }) {
    if (payload.id) {
      const idx = this.sessions.findIndex((s) => s.id === payload.id);
      if (idx !== -1) {
        this.sessions[idx] = { ...this.sessions[idx], ...payload };
        return this.sessions[idx];
      }
    }

    const newSession: MeetSession = {
      id: `session-${Date.now()}`,
      course_id: payload.course_id || "ACT-01",
      course_title: payload.course_title || "Ngoding Bareng Web App",
      title: payload.title || "Sesi Live Pertemuan BDC",
      instructor: payload.instructor || "Dr. Evelyn Vance",
      meet_url: payload.meet_url || "https://meet.google.com/bdc-utdi-web",
      qr_token: `BDC-QR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      scheduled_at: payload.scheduled_at || new Date().toISOString(),
      expires_at: payload.expires_at || new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      status: payload.status || "live",
    };

    // If setting to live, make others scheduled
    if (newSession.status === "live") {
      this.sessions.forEach((s) => {
        if (s.id !== newSession.id && s.status === "live") s.status = "completed";
      });
    }

    this.sessions.unshift(newSession);
    return newSession;
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

    // Find active session matching token
    const cleanToken = qrToken.trim().toUpperCase();
    const session = this.sessions.find(
      (s) => s.status === "live" && (s.qr_token.toUpperCase() === cleanToken || cleanToken === "BDC-PRESENSI-LIVE-994")
    );

    if (!session) {
      return { success: false, error: "Kode QR / Barcode presensi tidak valid atau sesi telah berakhir." };
    }

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

    // Check Auto-Unlock Certificate
    this.checkCertificateEligibility(userId);

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

    // Auto-check certificate eligibility
    this.checkCertificateEligibility(sub.user_id);

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

  // 6. AUTO-UNLOCK CERTIFICATE CRITERIA
  checkCertificateEligibility(userId: string) {
    const user = this.getProfileById(userId);
    const cert = this.getCertificateByUserId(userId);
    if (!user || !cert) return false;

    const meetRequirement = (user.attendance_rate || 0) >= 80;
    const examRequirement = (user.score || 0) >= 75;

    // Check assignments
    const userSubs = this.getSubmissionsByUser(userId);
    const gradedSubs = userSubs.filter((s) => s.status === "graded");
    const assignmentsMet = gradedSubs.length >= 1;

    const isEligible = meetRequirement && examRequirement && assignmentsMet;

    if (isEligible && cert.is_locked) {
      cert.is_locked = false;
      cert.completion_status = "LULUS (KOMPETEN)";
    }

    return isEligible;
  }
}

// Global Singleton for runtime persistence across Server Action calls
const globalForStore = globalThis as unknown as { bdcStore: BdcDataStore | undefined };
export const bdcStore = globalForStore.bdcStore ?? new BdcDataStore();
if (process.env.NODE_ENV !== "production") globalForStore.bdcStore = bdcStore;
