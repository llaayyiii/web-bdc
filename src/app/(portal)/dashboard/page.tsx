import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { LiveMeetBanner } from "@/components/layout/LiveMeetBanner";
import {
  Clock,
  BookCheck,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  FileText,
  Star,
  Users,
  QrCode,
  Trophy,
  FolderGit2,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const courses = bdcStore.getCourses();
  const certificate = user ? bdcStore.getCertificateByUserId(user.id) : null;
  const enrollments = user ? bdcStore.getEnrollments(user.id) : [];
  const liveSession = bdcStore.getLiveSession();

  const completedCount = enrollments.filter((e) => e.is_completed).length;

  return (
    <div className="space-y-6">
      {/* Live Meet Island Banner (Feature 6) */}
      <LiveMeetBanner session={liveSession} />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-bdc-midnight via-bdc-navy to-bdc-blue text-white p-6 sm:p-8 shadow-xl border border-bdc-navy">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-bdc-yellow text-xs font-semibold backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Status Akademik: Aktif &amp; Terverifikasi UTDI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {user?.full_name}!
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Selamat berkarya di Business Dev Club Chapter UTDI Yogyakarta. Pantau seluruh
              kemajuan modul, hasil evaluasi ujian kompetensi, dan cetak sertifikat resmi Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/courses"
              className="px-5 py-2.5 rounded-xl bg-bdc-yellow hover:bg-amber-400 text-bdc-midnight text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Jelajahi Modul</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/certificates"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Lihat Sertifikat</span>
              <Award className="w-4 h-4 text-bdc-yellow" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Jam */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-bdc-blue flex items-center justify-center shrink-0 border border-blue-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Jam Belajar
            </span>
            <span className="text-2xl font-extrabold text-bdc-midnight">
              {user?.total_hours || 64.5} <span className="text-xs font-bold text-slate-400">Jam</span>
            </span>
          </div>
        </div>

        {/* Stat 2: Modul Tuntas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <BookCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Modul Tuntas
            </span>
            <span className="text-2xl font-extrabold text-bdc-midnight">
              {completedCount || 4} <span className="text-xs font-bold text-slate-400">/ 5 Modul</span>
            </span>
          </div>
        </div>

        {/* Stat 3: Skor Rata-rata */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-bdc-gold flex items-center justify-center shrink-0 border border-amber-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Nilai Rata-Rata
            </span>
            <span className="text-2xl font-extrabold text-bdc-midnight">
              {user?.score || 96.4} <span className="text-xs font-bold text-emerald-600">(A+)</span>
            </span>
          </div>
        </div>

        {/* Stat 4: Sertifikat Sah */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Kredensial Resmi
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-emerald-200">
              {certificate ? "Siap Dicetak A4" : "Dalam Penilaian"}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Quick Navigation Panels for the 6 Core Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Presensi Barcode Card */}
        <Link
          href="/attendance"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-bdc-blue shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-bdc-navy text-bdc-yellow flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {user?.attendance_rate || 0}% Presensi
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-bold text-bdc-midnight group-hover:text-bdc-blue transition-colors">
              Presensi Barcode Kuliah
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Scan barcode proyektor kelas atau masukkan token untuk menambah poin keaktifan.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-bdc-blue">
            <span>Buka Pemindai &rarr;</span>
          </div>
        </Link>

        {/* Peringkat Kehadiran Card */}
        <Link
          href="/leaderboard"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-bdc-gold shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-bdc-gold flex items-center justify-center border border-amber-200">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-bdc-navy bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {user?.points || 0} XP
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-bold text-bdc-midnight group-hover:text-bdc-gold transition-colors">
              Papan Peringkat Mahasiswa
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Lihat posisi podium juara berdasarkan tingkat kehadiran dan kontribusi komunitas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>Lihat Klasemen &rarr;</span>
          </div>
        </Link>

        {/* Tugas Proyek Card */}
        <Link
          href="/assignments"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-bdc-navy shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-bdc-blue flex items-center justify-center border border-blue-200">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Studi Kasus
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-bold text-bdc-midnight group-hover:text-bdc-navy transition-colors">
              Penugasan &amp; Portofolio Proyek
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kirim tautan GitHub &amp; Drive untuk dievaluasi oleh kurator akademik BDC.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-bdc-navy">
            <span>Kelola Tugas &rarr;</span>
          </div>
        </Link>
      </div>

      {/* Grid: Capstone Project & Modul Berjalan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Capstone Project Spotlight */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-bdc-yellow/20 text-bdc-gold">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-bdc-midnight">
                    Capstone Project Komunitas
                  </h2>
                  <span className="text-xs text-slate-500">Tugas Akhir Pembuktian Kompetensi Mandiri</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Lulus Paripurna
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-bdc-navy">
                  BDC Hub (Web Presensi &amp; Pembelajaran Community)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Proyek implementasi sistem web presensi dan manajemen pembelajaran komunitas
                  lengkap dengan arsitektur modern Next.js, otentikasi peran (RBAC), skema database
                  relasional PostgreSQL, serta penerbitan sertifikat digital berstandar industri.
                </p>
              </div>

              {/* Capstone Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-bdc-surface border border-slate-200/60">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Bobot Jam</span>
                  <span className="text-sm font-bold text-bdc-midnight">16.5 Jam</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Skor Evaluasi</span>
                  <span className="text-sm font-bold text-emerald-600">98.00 (A+)</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Lokasi &amp; Periode</span>
                  <span className="text-sm font-bold text-bdc-midnight">Yogyakarta, 2026/2027</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Ditandatangani Kemahasiswaan: <strong>Bagas Triaji, S.Kom., M.Kom.</strong>
            </span>
            <Link
              href="/certificates"
              className="text-xs font-bold text-bdc-blue hover:text-bdc-navy flex items-center gap-1.5 transition-colors"
            >
              <span>Buka Transkrip Nilai Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Quick Action & Next Up */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-bdc-midnight mb-1">Aktivitas Evaluasi</h2>
            <p className="text-xs text-slate-500 mb-4">Langkah berikutnya untuk pertahankan skor</p>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-bdc-blue text-xs font-bold">
                <FileText className="w-4 h-4" />
                <span>Uji Kompetensi Mandiri</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Evaluasi 10 butir soal komprehensif mengenai Keamanan Siber, Proteksi XSS/SQLi,
                dan Regulasi ISO 27001.
              </p>
              <Link
                href="/assessments"
                className="w-full py-2 px-3 rounded-lg bg-bdc-blue hover:bg-bdc-navy text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Buka Antarmuka Ujian</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Batas Waktu Pengerjaan:</span>
              <span className="font-bold text-bdc-midnight">30 Menit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Courses Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-bdc-midnight">Daftar Modul Belajar Komunitas</h2>
            <p className="text-xs text-slate-500">Materi terkini dan workshop hands-on komunitas BDC</p>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-bdc-blue hover:text-bdc-navy flex items-center gap-1"
          >
            <span>Lihat Semua (5 Modul)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-bdc-blue hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${course.badge_color}`}>
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                    <Star className="w-3 h-3 fill-bdc-gold text-bdc-gold" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-bdc-midnight group-hover:text-bdc-blue transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{course.learners_count} Siswa</span>
                </span>
                <span className="font-semibold text-bdc-blue group-hover:underline">
                  Pelajari &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
