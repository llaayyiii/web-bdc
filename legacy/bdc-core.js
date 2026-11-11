/**
 * Business Dev Club (BDC) - Academic College Community Portal Core Module
 * Manages State, Local Storage, Role Control, Dynamic Greetings, Community Courses, Responsive Navbar & Scores
 */

const DEFAULT_COMMUNITY_COURSES = [
  {
    id: "ACT-01",
    title: "Ngoding Bareng: Membangun Web App Interaktif dari Nol",
    category: "Sesi Minggu Ini",
    sessionType: "Live Session",
    instructor: "Dr. Evelyn Vance & Tim Web Dev",
    instructorRole: "Inisiator / Pemateri Komunitas",
    duration: "Live Session",
    level: "Pemula (Beginner)",
    learnersCount: 340,
    rating: 4.9,
    icon: "sensors",
    badgeColor: "bg-rose-100 text-rose-700",
    description: "Sesi interaktif mingguan membedah struktur HTML5, styling Tailwind, dan logika JavaScript interaktif langsung dengan live coding bersama anggota.",
    syllabus: [
      "Struktur Dasar Web Modern & Best Practice HTML5",
      "Live Coding: Styling Responsive dengan Tailwind CSS",
      "Interaktivitas & DOM Manipulation JavaScript",
      "Tanya Jawab & Bedah Kode Bareng Anggota Komunitas"
    ]
  },
  {
    id: "ACT-02",
    title: "Workshop Hands-On: Audit Keamanan Akun & Pengujian Jaringan",
    category: "Workshop & Hands-On",
    sessionType: "Workshop Lab",
    instructor: "Ir. Hendra Saputra, M.Kom",
    instructorRole: "Inisiator / Pemateri Komunitas",
    duration: "Workshop Lab",
    level: "Semua Tingkat (All Levels)",
    learnersCount: 420,
    rating: 4.9,
    icon: "terminal",
    badgeColor: "bg-emerald-100 text-emerald-700",
    description: "Praktik langsung simulasi mendeteksi tautan phishing, analisis lalu lintas Wi-Fi rentan, serta konfigurasi 2FA hardware key.",
    syllabus: [
      "Simulasi Uji Coba Serangan Social Engineering & Phishing",
      "Inspeksi Jaringan Wi-Fi Publik dengan Wireshark Dasar",
      "Langkah Proteksi Password Manager & Multi-Factor Auth",
      "Checklist Keamanan Siber Mandiri untuk Laptop & Ponsel"
    ]
  },
  {
    id: "ACT-03",
    title: "Proyek Kolaborasi: UI/UX Open Source Design System Komunitas",
    category: "Proyek Bersama",
    sessionType: "Project File",
    instructor: "Maya Kartika, S.Ds",
    instructorRole: "Inisiator / Pemateri Komunitas",
    duration: "Project File",
    level: "Pemula (Beginner)",
    learnersCount: 280,
    rating: 4.8,
    icon: "folder_zip",
    badgeColor: "bg-purple-100 text-purple-700",
    description: "Repositori aset desain, komponen Figma terbuka, dan panduan kontribusi bareng untuk membangun UI kit resmi komunitas kampus.",
    syllabus: [
      "Panduan Kontribusi & Tata Kelola Figma Team Workspace",
      "Penyusunan Desain Token: Palet Warna & Tipografi",
      "Pembuatan Komponen Tombol, Input & Dialog Reusable",
      "Review Bersama & Penggabungan Aset Kontributor"
    ]
  },
  {
    id: "ACT-04",
    title: "Rekaman Sharing: Memulai Startup Digital & Pitching ke Inkubator",
    category: "Arsip Recording",
    sessionType: "Rekaman Web",
    instructor: "Rian Danuarta, MBA",
    instructorRole: "Inisiator / Pemateri Komunitas",
    duration: "Rekaman Web",
    level: "Pemula (Beginner)",
    learnersCount: 510,
    rating: 4.9,
    icon: "play_circle",
    badgeColor: "bg-blue-100 text-blue-700",
    description: "Arsip video sharing alumni mengenai langkah validasi ide produk teknologi, menyusun Business Model Canvas, dan kiat lolos seleksi pendanaan inkubator.",
    syllabus: [
      "Rekaman Bagian 1: Validasi Masalah & Customer Interview",
      "Rekaman Bagian 2: Menyusun Pitch Deck 10 Slide Efektif",
      "Template Dokumen Pitching & Lembar Evaluasi Bisnis",
      "Sesi Q&A Diskusi Pengalaman Founder Startup Mahasiswa"
    ]
  },
  {
    id: "ACT-05",
    title: "Deploy Bareng: Hosting Web & Domain Gratis Menggunakan Cloud VPS",
    category: "Workshop & Hands-On",
    sessionType: "Workshop Lab",
    instructor: "Arya Pratama, S.Kom",
    instructorRole: "Inisiator / Pemateri Komunitas",
    duration: "Workshop Lab",
    level: "Menengah (Intermediate)",
    learnersCount: 390,
    rating: 4.8,
    icon: "cloud",
    badgeColor: "bg-sky-100 text-sky-700",
    description: "Panduan taktis langsung deploy aplikasi web ke server online, menghubungkan custom domain gratis, dan konfigurasi SSL HTTPS tanpa biaya.",
    syllabus: [
      "Persiapan Repository GitHub & Setup CI/CD Deployment",
      "Konfigurasi DNS Record & Hubungkan Domain Kustom",
      "Pemasangan Sertifikat SSL Gratis dengan Let's Encrypt",
      "Troubleshooting Umum: Penanganan Error 502 & Firewall"
    ]
  },
  {
    id: "ACT-06",
    title: "Rekaman Webinar: Prompt Engineering & AI Workflow untuk Riset Mahasiswa",
    category: "Arsip Recording",
    sessionType: "Rekaman Web",
    instructor: "Budi Santoso, M.Kom",
    instructorRole: "Inisiator / Pemateri Komunitas",
    duration: "Rekaman Web",
    level: "Semua Tingkat (All Levels)",
    learnersCount: 680,
    rating: 5.0,
    icon: "smart_toy",
    badgeColor: "bg-indigo-100 text-indigo-700",
    description: "Arsip lengkap rekaman webinar cara cerdas merancang prompt AI untuk mempercepat pembuatan tinjauan pustaka, analisis data, dan belajar pemrograman.",
    syllabus: [
      "Konsep Dasar Prompt Engineering: Few-Shot & Chain-of-Thought",
      "Studi Kasus: Membuat Ringkasan Jurnal Ilmiah Otomatis",
      "Workflow Debugging Kode & Analisis Log dengan AI",
      "Kumpulan Template Prompt Siap Pakai Komunitas"
    ]
  }
];

const BDC_DATABASE = {
  defaultSignatories: {
    signatory_1: {
      name: "Bagas Triaji S.Kom.,M.Kom",
      role: "Kemahasiswaan"
    },
    signatory_2: {
      name: "Nurul Layli",
      role: "PIC Program BDC"
    }
  },
  defaultPeriod: "2026/2027",
  defaultLocation: "Yogyakarta",
  users: {
    "255720056": {
      name: "Siti Rahmawati",
      email: "siti.rahmawati@perusahaan.co.id",
      nim_id: "255720056",
      nip: "255720056",
      period: "2026/2027",
      location: "Yogyakarta",
      role: "learner",
      roleTitle: "Community Cyber & Web Fellow",
      score: 96.4,
      scoreCohort: "Top 3% Nasional Cohort",
      division: "Community Academy & Student Chapter",
      completedModules: 12,
      totalHours: 64.5,
      certLocked: false,
      signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
      signatory_2: "Nurul Layli (PIC Program BDC)",
      capstoneProject: {
        title: "BDC Hub (Web Presensi & Pembelajaran Community)",
        hours: 16.5,
        score: 98.0,
        grade: "A+",
        status: "Lulus Paripurna"
      }
    },
    "siti.rahmawati@perusahaan.co.id": {
      name: "Siti Rahmawati",
      email: "siti.rahmawati@perusahaan.co.id",
      nim_id: "255720056",
      nip: "255720056",
      period: "2026/2027",
      location: "Yogyakarta",
      role: "learner",
      roleTitle: "Community Cyber & Web Fellow",
      score: 96.4,
      scoreCohort: "Top 3% Nasional Cohort",
      division: "Community Academy & Student Chapter",
      completedModules: 12,
      totalHours: 64.5,
      certLocked: false,
      signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
      signatory_2: "Nurul Layli (PIC Program BDC)",
      capstoneProject: {
        title: "BDC Hub (Web Presensi & Pembelajaran Community)",
        hours: 16.5,
        score: 98.0,
        grade: "A+",
        status: "Lulus Paripurna"
      }
    },
    "255720057": {
      name: "Arya Dananjaya, M.Kom",
      email: "arya.dananjaya@enterprise.id",
      nim_id: "255720057",
      nip: "255720057",
      period: "2026/2027",
      location: "Yogyakarta",
      role: "instructor",
      roleTitle: "Lead Community Instructor",
      score: 98.5,
      scoreCohort: "Top 1% Nasional Instructor",
      division: "Curriculum & Engineering Dean",
      completedModules: 14,
      totalHours: 120.0,
      certLocked: false,
      signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
      signatory_2: "Nurul Layli (PIC Program BDC)"
    },
    "arya.dananjaya@enterprise.id": {
      name: "Arya Dananjaya, M.Kom",
      email: "arya.dananjaya@enterprise.id",
      nim_id: "255720057",
      nip: "255720057",
      period: "2026/2027",
      location: "Yogyakarta",
      role: "instructor",
      roleTitle: "Lead Community Instructor",
      score: 98.5,
      scoreCohort: "Top 1% Nasional Instructor",
      division: "Curriculum & Engineering Dean",
      completedModules: 14,
      totalHours: 120.0,
      certLocked: false,
      signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
      signatory_2: "Nurul Layli (PIC Program BDC)"
    },
    "255720058": {
      name: "Budi Santoso, S.Kom.",
      email: "budi.santoso@bumn.co.id",
      nim_id: "255720058",
      nip: "255720058",
      period: "2026/2027",
      location: "Yogyakarta",
      role: "learner",
      roleTitle: "Cloud Security Associate",
      score: 89.2,
      scoreCohort: "Top 8% Nasional Cohort",
      division: "Cloud Infrastructure & SecOps",
      completedModules: 9,
      totalHours: 48.0,
      certLocked: false,
      signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
      signatory_2: "Nurul Layli (PIC Program BDC)"
    },
    "budi.santoso@bumn.co.id": {
      name: "Budi Santoso, S.Kom.",
      email: "budi.santoso@bumn.co.id",
      nim_id: "255720058",
      nip: "255720058",
      period: "2026/2027",
      location: "Yogyakarta",
      role: "learner",
      roleTitle: "Cloud Security Associate",
      score: 89.2,
      scoreCohort: "Top 8% Nasional Cohort",
      division: "Cloud Infrastructure & SecOps",
      completedModules: 9,
      totalHours: 48.0,
      certLocked: false,
      signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
      signatory_2: "Nurul Layli (PIC Program BDC)"
    },
    "admin@perusahaan.co.id": {
      name: "Nurul Layli",
      email: "admin@perusahaan.co.id",
      nim_id: "BDC-PIC-001",
      nip: "BDC-PIC-001",
      period: "2026/2027",
      location: "Yogyakarta",
      role: "instructor",
      roleTitle: "PIC Program BDC & Curator",
      score: 99.0,
      scoreCohort: "PIC Benchmark",
      division: "Executive Academy Governance",
      completedModules: 14,
      totalHours: 150.0,
      certLocked: false,
      signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
      signatory_2: "Nurul Layli (PIC Program BDC)"
    },
    "dean@businessdevclub.id": {
      name: "Bagas Triaji S.Kom.,M.Kom",
      email: "dean@businessdevclub.id",
      nim_id: "KMH-0001-BT",
      nip: "KMH-0001-BT",
      period: "2026/2027",
      location: "Yogyakarta",
      role: "instructor",
      roleTitle: "Kemahasiswaan & Certification Head",
      score: 99.2,
      scoreCohort: "Kemahasiswaan Benchmark",
      division: "Executive Academy Governance",
      completedModules: 14,
      totalHours: 150.0,
      certLocked: false,
      signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
      signatory_2: "Nurul Layli (PIC Program BDC)"
    }
  },
  defaultStudent: {
    name: "Siti Rahmawati",
    email: "siti.rahmawati@perusahaan.co.id",
    nim_id: "255720056",
    nip: "255720056",
    period: "2026/2027",
    location: "Yogyakarta",
    role: "learner",
    roleTitle: "Community Cyber & Web Fellow",
    score: 96.4,
    scoreCohort: "Top 3% Nasional Cohort",
    division: "Community Academy & Student Chapter",
    completedModules: 12,
    totalHours: 64.5,
    certLocked: false,
    signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
    signatory_2: "Nurul Layli (PIC Program BDC)",
    capstoneProject: {
      title: "BDC Hub (Web Presensi & Pembelajaran Community)",
      hours: 16.5,
      score: 98.0,
      grade: "A+",
      status: "Lulus Paripurna"
    }
  },
  defaultAdmin: {
    name: "Nurul Layli",
    email: "admin@perusahaan.co.id",
    nim_id: "BDC-PIC-001",
    nip: "BDC-PIC-001",
    period: "2026/2027",
    location: "Yogyakarta",
    role: "instructor",
    roleTitle: "PIC Program BDC",
    score: 99.0,
    scoreCohort: "PIC Benchmark",
    division: "Executive Academy Governance",
    completedModules: 14,
    totalHours: 150.0,
    certLocked: false,
    signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
    signatory_2: "Nurul Layli (PIC Program BDC)"
  }
};

// Authentication Helpers
function getAuthUser() {
  try {
    const raw = localStorage.getItem('bdc_auth_user');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading bdc_auth_user from localStorage', e);
  }
  
  const path = window.location.pathname.toLowerCase();
  if (path.includes('admin') || path.includes('cetakbundel')) {
    return BDC_DATABASE.defaultAdmin;
  }
  return BDC_DATABASE.defaultStudent;
}

function setAuthUser(userData) {
  try {
    localStorage.setItem('bdc_auth_user', JSON.stringify(userData));
  } catch (e) {
    console.error('Error writing to localStorage', e);
  }
}

/**
 * Find user by NIM/ID, email, or username.
 * If not in database but has valid format, dynamically creates bound user linked to that email.
 */
function findUserByIdentifier(identifier, targetRole = null) {
  const cleanId = (identifier || '').trim().toLowerCase();
  
  // Direct match in database
  if (BDC_DATABASE.users[cleanId]) {
    return { ...BDC_DATABASE.users[cleanId] };
  }
  
  // Search by nim_id, nip, email, or partial name
  for (const key in BDC_DATABASE.users) {
    const u = BDC_DATABASE.users[key];
    const uNim = (u.nim_id || u.nip || '').toLowerCase();
    if (uNim === cleanId || u.email.toLowerCase() === cleanId || u.name.toLowerCase().includes(cleanId)) {
      return { ...u };
    }
  }
  
  // Check if admin keyword
  const isAdmin = cleanId.includes('admin') || cleanId.includes('dean') || cleanId.includes('instructor') || cleanId.includes('pic') || targetRole === 'admin';
  
  // Generate user linked to email
  let derivedName = cleanId;
  let derivedEmail = cleanId;
  if (cleanId.includes('@')) {
    derivedName = cleanId.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    derivedEmail = cleanId;
  } else {
    derivedEmail = `${cleanId}@perusahaan.co.id`;
    derivedName = `Pengguna (${cleanId})`;
  }
  
  const idValue = cleanId.replace(/[^a-zA-Z0-9]/g, '') || "255720056";
  
  return {
    name: derivedName,
    email: derivedEmail,
    nim_id: idValue,
    nip: idValue,
    period: "2026/2027",
    location: "Yogyakarta",
    role: isAdmin ? "instructor" : "learner",
    roleTitle: isAdmin ? "PIC Program BDC" : "Community Learner",
    score: isAdmin ? 99.0 : 88.0,
    scoreCohort: isAdmin ? "PIC Benchmark" : "Top 8% Nasional Cohort",
    division: isAdmin ? "Executive Academy Governance" : "Community Academy & Student Chapter",
    completedModules: isAdmin ? 14 : 10,
    totalHours: isAdmin ? 140.0 : 52.0,
    certLocked: !isAdmin,
    signatory_1: "Bagas Triaji S.Kom.,M.Kom (Kemahasiswaan)",
    signatory_2: "Nurul Layli (PIC Program BDC)",
    capstoneProject: {
      title: "BDC Hub (Web Presensi & Pembelajaran Community)",
      hours: 16.5,
      score: 98.0,
      grade: "A+",
      status: "Lulus Paripurna"
    }
  };
}

function switchUserRole(targetRole) {
  let user;
  if (targetRole === 'instructor' || targetRole === 'admin') {
    user = BDC_DATABASE.defaultAdmin;
    setAuthUser(user);
    window.location.href = 'DasborAdmin.htm';
  } else {
    user = BDC_DATABASE.defaultStudent;
    setAuthUser(user);
    window.location.href = 'DasborSiswadanPembelajaran.html';
  }
}

// Community Courses Storage & CRUD
function getCommunityCourses() {
  try {
    const raw = localStorage.getItem('BDC_COMMUNITY_COURSES');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto-refresh if data is from legacy version (jargon or previous subject categories)
      const hasOldFormat = Array.isArray(parsed) && parsed.some(c => 
        (c.title && c.title.includes('Zero Trust')) || 
        (c.title && c.title.includes('Klausul 5 s.d. 8')) || 
        (c.title && c.title.includes('Terraform & Kubernetes')) ||
        c.category === 'Web & Pemrograman' ||
        c.category === 'Cybersecurity' ||
        !c.sessionType
      );
      if (!hasOldFormat && Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading BDC_COMMUNITY_COURSES', e);
  }
  // Initialize with dynamic community activities
  localStorage.setItem('BDC_COMMUNITY_COURSES', JSON.stringify(DEFAULT_COMMUNITY_COURSES));
  return DEFAULT_COMMUNITY_COURSES;
}

// Community Topic Requests (Fitur Usulkan Topik Belajar)
function getCommunityTopicRequests() {
  try {
    const raw = localStorage.getItem('BDC_COMMUNITY_TOPIC_REQUESTS');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading BDC_COMMUNITY_TOPIC_REQUESTS', e);
  }
  return [
    {
      id: "REQ-01",
      topic: "Belajar Next.js 14 App Router & Server Actions",
      category: "Workshop & Hands-On",
      sessionType: "Workshop Lab",
      proposer: "Rifky Pratama",
      reason: "Banyak anggota ingin migrasi dari React SPA ke Next.js modern.",
      date: "03/11/2026",
      votes: 12,
      status: "Dijadwalkan Minggu Depan"
    },
    {
      id: "REQ-02",
      topic: "Eksplorasi Fine-Tuning LLM & Embeddings untuk Mahasiswa",
      category: "Sesi Minggu Ini",
      sessionType: "Live Session",
      proposer: "Anisa Putri",
      reason: "Untuk persiapan tugas akhir pemrosesan bahasa alami (NLP).",
      date: "02/11/2026",
      votes: 8,
      status: "Dalam Kurasi Mentor"
    }
  ];
}

function saveCommunityTopicRequest(requestData) {
  const requests = getCommunityTopicRequests();
  const newReq = {
    id: "REQ-" + String(requests.length + 1).padStart(2, '0'),
    topic: requestData.topic || '',
    category: requestData.category || 'Workshop & Hands-On',
    sessionType: requestData.sessionType || 'Live Session',
    proposer: requestData.proposer || 'Anggota Komunitas',
    reason: requestData.reason || '',
    date: new Date().toLocaleDateString('id-ID'),
    votes: 1,
    status: 'Menunggu Kurasi'
  };
  requests.unshift(newReq);
  localStorage.setItem('BDC_COMMUNITY_TOPIC_REQUESTS', JSON.stringify(requests));
  return requests;
}

function saveCommunityCourse(courseData) {
  const courses = getCommunityCourses();
  const existingIdx = courses.findIndex(c => c.id === courseData.id);
  if (existingIdx >= 0) {
    courses[existingIdx] = { ...courses[existingIdx], ...courseData };
  } else {
    courses.unshift(courseData);
  }
  localStorage.setItem('BDC_COMMUNITY_COURSES', JSON.stringify(courses));
  return courses;
}

function deleteCommunityCourse(courseId) {
  let courses = getCommunityCourses();
  courses = courses.filter(c => c.id !== courseId);
  localStorage.setItem('BDC_COMMUNITY_COURSES', JSON.stringify(courses));
  return courses;
}

function resetCommunityCourses() {
  localStorage.setItem('BDC_COMMUNITY_COURSES', JSON.stringify(DEFAULT_COMMUNITY_COURSES));
  return DEFAULT_COMMUNITY_COURSES;
}

// Navigation & Mobile Drawer
function toggleMobileSidebar(forceState) {
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  const isClosed = sidebar.classList.contains('-translate-x-full');
  const shouldOpen = forceState !== undefined ? forceState : isClosed;

  if (shouldOpen) {
    sidebar.classList.remove('-translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function renderDynamicUserData() {
  const user = getAuthUser();
  if (!user) return;

  // 1. Dynamic User Greeting
  const greetingEl = document.getElementById('userGreeting');
  const nameTextEl = document.getElementById('userNameText');
  if (greetingEl) {
    if (nameTextEl) {
      nameTextEl.textContent = user.name;
    } else {
      greetingEl.innerHTML = `Selamat Datang, <span class="text-white">${user.name}</span>`;
    }
  }

  // 2. Dynamic User Profile in Header
  const headerNameEl = document.getElementById('headerUserName');
  const headerRoleEl = document.getElementById('headerUserRole');
  if (headerNameEl) headerNameEl.textContent = user.name;
  if (headerRoleEl) headerRoleEl.textContent = user.roleTitle || (user.role === 'instructor' || user.role === 'admin' ? 'Academic Dean & Curator' : 'Corporate Learner');

  // 3. Dynamic Competition Score
  const scoreDisplay = document.getElementById('userScoreDisplay');
  const scoreCohort = document.getElementById('userScoreCohort');
  const progressCircle = document.getElementById('scoreProgressCircle');
  if (scoreDisplay) {
    scoreDisplay.textContent = `${user.score}%`;
  }
  if (scoreCohort && user.scoreCohort) {
    scoreCohort.textContent = user.scoreCohort;
  }
  if (progressCircle) {
    const circumference = 163.36;
    const offset = Math.max(0, circumference - (user.score / 100) * circumference);
    progressCircle.style.strokeDashoffset = offset.toFixed(2);
  }

  // 4. Role Toggle Switch in Header
  const adminPill = document.getElementById('headerRoleAdminBtn');
  const studentPill = document.getElementById('headerRoleStudentBtn');
  const isAdmin = (user.role === 'instructor' || user.role === 'admin');

  if (adminPill && studentPill) {
    if (isAdmin) {
      adminPill.className = "px-3 py-1 text-on-primary bg-primary font-label-badge text-label-badge rounded-full transition-all shadow-sm cursor-default";
      studentPill.className = "px-3 py-1 text-on-surface-variant hover:text-on-surface font-label-badge text-label-badge rounded-full transition-all cursor-pointer";
      adminPill.onclick = null;
      studentPill.onclick = () => switchUserRole('learner');
    } else {
      studentPill.className = "px-3 py-1 text-on-primary bg-primary font-label-badge text-label-badge rounded-full transition-all shadow-sm cursor-default";
      adminPill.className = "px-3 py-1 text-on-surface-variant hover:text-on-surface font-label-badge text-label-badge rounded-full transition-all cursor-pointer";
      studentPill.onclick = null;
      adminPill.onclick = () => switchUserRole('admin');
    }
  }

  // 5. Ensure Dashboard links point to the right place
  const dashboardLinks = document.querySelectorAll('a[data-path="dashboard"]');
  dashboardLinks.forEach(link => {
    link.href = isAdmin ? 'DasborAdmin.htm' : 'DasborSiswadanPembelajaran.html';
  });

  // 6. Ensure Courses links point to MateriPembelajaran.html
  const coursesLinks = document.querySelectorAll('a[data-path="courses"]');
  coursesLinks.forEach(link => {
    link.href = 'MateriPembelajaran.html';
  });

  // 7. Ensure System Settings links point to PengaturanSistem.html
  const settingsLinks = document.querySelectorAll('a[data-path="system-settings"]');
  settingsLinks.forEach(link => {
    link.href = 'PengaturanSistem.html';
  });

  // 8. Remove any legacy Analytics links
  const analyticsLinks = document.querySelectorAll('a[data-path="analytics"]');
  analyticsLinks.forEach(link => link.remove());

  // 9. Role Control for Assessments & Quizzes
  const quizWidgets = document.querySelectorAll('.admin-only-quiz-creator, #openQuizWidgetBtn, #openCourseModalBtn');
  quizWidgets.forEach(el => {
    el.style.display = !isAdmin ? 'none' : '';
  });

  // 10. Role Control for Certificate
  const certLinks = document.querySelectorAll('a[data-path="certifications"]');
  certLinks.forEach(link => {
    link.href = !isAdmin ? 'SertifikatKelulusan.html' : 'PratinjauEditor&CetakBundel2.html';
  });
}

function showPortalToast(message, isSuccess = true) {
  let toast = document.getElementById('portal-global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portal-global-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-navy-admin-bg text-on-primary px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }
  
  const icon = isSuccess ? 'check_circle' : 'warning';
  const iconColor = isSuccess ? 'text-accent-emerald-success' : 'text-accent-amber-warning';
  
  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-xl">${icon}</span>
    <span class="font-body-md text-body-md font-medium">${message}</span>
  `;
  
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 3500);
}

// Certificate & Transcript Centralized Helper
function getCertificateMetadata() {
  const defaultMeta = {
    institution: "BUSINESS DEV CLUB (BDC) - Community Academy & Student Chapter",
    period: "2026/2027",
    location: "Yogyakarta",
    signatory_1: {
      name: "Bagas Triaji S.Kom.,M.Kom",
      role: "Kemahasiswaan"
    },
    signatory_2: {
      name: "Nurul Layli",
      role: "PIC Program BDC"
    },
    capstone: {
      code: "CAP-BDC",
      title: "Capstone Project (BDC Hub)",
      subtitle: "Web Presensi, Learning System & Portal Manajemen Komunitas BDC",
      learningHours: 16.5,
      score: 98.0,
      grade: "A+",
      status: "Lulus Paripurna"
    }
  };

  try {
    const raw = localStorage.getItem('bdc_academic_credential_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultMeta, ...parsed };
    }
  } catch (e) {
    console.warn('Error reading credential data', e);
  }
  return defaultMeta;
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderDynamicUserData();
});
