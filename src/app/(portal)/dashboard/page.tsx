import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { hydrateFromDb } from "@/lib/data/db";
import { LiveMeetBanner } from "@/components/layout/LiveMeetBanner";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  Clock,
  BookCheck,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Star,
  Users,
  QrCode,
  Trophy,
  FolderGit2,
  Medal,
  Zap,
  MessageCircle,
} from "lucide-react";

export default async function DashboardPage() {
  await hydrateFromDb();
  const user = await getCurrentUser();
  const courses = bdcStore.getCourses();
  const certificate = user ? bdcStore.getCertificateByUserId(user.id) : null;
  const enrollments = user ? bdcStore.getEnrollments(user.id) : [];
  const userSubmissions = user ? bdcStore.getSubmissionsByUser(user.id) : [];
  const liveSession = bdcStore.getLiveSession();
  const leaderboard = bdcStore.getLeaderboard();
  const activeCompetitions = bdcStore.getActiveCompetitions().slice(0, 3);

  const userRankIndex = leaderboard.findIndex((p) => p.id === user?.id);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : leaderboard.length + 1;
  const completedCount = enrollments.filter((e) => e.is_completed).length;

  // Real Capstone evaluation data
  const capstoneSubmission =
    userSubmissions.find(
      (s) => s.assignment_id === "assign-01" || s.notes?.toLowerCase().includes("capstone")
    ) || userSubmissions[0] || null;
  const isCapstoneGraded = capstoneSubmission?.status === "graded";
  const capstoneScore = certificate?.capstone_score ?? capstoneSubmission?.score ?? null;
  const capstoneGrade =
    certificate?.capstone_grade ??
    (capstoneScore !== null ? (capstoneScore >= 85 ? "A" : capstoneScore >= 75 ? "B" : "C") : null);

  return (
    <div className="space-y-8 font-sans">
      {/* 1. DASH INTRO (Header Area inspired by GDGoC IPB) */}
      <div className="space-y-3 pb-2 border-b border-[#d9dfd7]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 00 // PORTAL AKADEMIK MAHASISWA ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl lg:text-6xl text-bdc-midnight tracking-tight">
              Dasbor Mahasiswa
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Selamat datang kembali, <strong className="text-bdc-midnight">{user?.full_name}</strong> (NIM:{" "}
              <span className="font-mono font-bold text-bdc-blue">{user?.nim_id}</span>). Pantau kemajuan modul,
              papan skor keaktifan, dan evaluasi kelayakan sertifikat resmi UTDI.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/attendance"
              className="retro-btn px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all flex items-center gap-2 shadow-retro-sm"
            >
              <QrCode className="w-4 h-4 text-bdc-yellow" />
              <span>Presensi Barcode</span>
            </Link>

            <Link
              href="/leaderboard"
              className="retro-btn px-4 py-2 rounded-xl bg-bdc-yellow hover:bg-amber-400 text-bdc-midnight text-xs font-black transition-all flex items-center gap-2 shadow-retro-sm"
            >
              <Trophy className="w-4 h-4 text-bdc-midnight" />
              <span>Papan Skor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. LIVE MEET BANNER */}
      <LiveMeetBanner session={liveSession} />

      {/* 2B. LINK GRUP WHATSAPP */}
      <a
        href="https://chat.whatsapp.com/IEpfpE7rY5v86iRXK83JIY?s=cl&p=a&iam=2"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[#fffefa] rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#34A853] p-5 flex flex-wrap items-center justify-between gap-4 hover:shadow-retro-sm transition-all group"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                Komunitas BDC
              </span>
              <BdcDots size="sm" />
            </div>
            <h2 className="font-space font-bold text-sm sm:text-base text-bdc-midnight mt-0.5">
              Grup WhatsApp Business Dev Club
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Info sesi, materi, dan koordinasi tugas BDC UTDI — bergabung sekarang.
            </p>
          </div>
        </div>
        <span className="retro-btn px-4 py-2 rounded-xl bg-bdc-green hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-retro-sm shrink-0">
          <span>Gabung Grup</span>
          <ArrowRight className="w-4 h-4" />
        </span>
      </a>

      {/* 2C. INFO LOMBA / EVENT MASIH DIBUKA */}
      {activeCompetitions.length > 0 && (
        <div className="bg-[#fffefa] rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#F7B500] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600">
                  Info Lomba &amp; Event
                </span>
                <h2 className="font-space font-bold text-sm sm:text-base text-bdc-midnight mt-0.5">
                  {activeCompetitions.length} lomba masih dibuka
                </h2>
              </div>
            </div>
            <Link
              href="/competitions"
              className="retro-btn px-4 py-2 rounded-xl bg-[#fffefa] text-bdc-midnight border border-bdc-midnight text-xs font-bold transition-all flex items-center gap-2 shadow-retro-sm shrink-0 hover:bg-[#fff8e6]"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ul className="space-y-2">
            {activeCompetitions.map((c) => (
              <li key={c.id}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#f4f3ea] border border-[#d9dfd7] hover:border-bdc-midnight hover:bg-[#fff8e6] transition-all group/item"
                >
                  <span className="min-w-0">
                    <span className="block font-space font-bold text-xs text-bdc-midnight truncate group-hover/item:text-bdc-blue">
                      {c.title}
                    </span>
                    {c.expires_at && (
                      <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                        Batas:{" "}
                        {new Date(c.expires_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        WIB
                      </span>
                    )}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 group-hover/item:text-bdc-blue" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. FOUR METRIC STATS CARDS WITH COLORED INSET TOP BARS (Exact GDGoC IPB dash-stats design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Jam (Google Blue Inset Top Bar) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#095BAF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Jam Belajar
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-bdc-blue flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl font-black text-bdc-midnight">
                {user?.total_hours ?? 0}
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">Jam Hands-on</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Akumulasi seluruh sesi praktik</p>
          </div>
        </div>

        {/* Metric 2: Modul Tuntas (Google Yellow/Gold Inset Top Bar) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#E9AD17] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Modul Tuntas
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-bdc-gold flex items-center justify-center">
              <BookCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl font-black text-bdc-midnight">
                {completedCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Silabus kompetensi terselesaikan</p>
          </div>
        </div>

        {/* Metric 3: Presensi Barcode (Google Green Inset Top Bar) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#34A853] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Tingkat Kehadiran
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl font-black text-bdc-midnight">
                {user?.attendance_rate ?? 0}%
              </span>
              <span className="font-mono text-xs font-bold text-emerald-700">
                ({(user?.attendance_rate ?? 0) >= 80 ? "Memenuhi" : "Perlu ditingkatkan"})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Batas minimal sertifikat: 80%</p>
          </div>
        </div>

        {/* Metric 4: Papan Skor & XP (Google Red / Midnight Inset Top Bar) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#EA4335] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Peringkat &amp; XP
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-bdc-red flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl font-black text-bdc-midnight">
                #{userRank}
              </span>
              <span className="font-mono text-xs font-bold text-bdc-gold">
                ({user?.points ?? 0} XP)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Dari {leaderboard.length} peserta cohort</p>
          </div>
        </div>
      </div>

      {/* 4. PAPAN SKOR HIGHLIGHT & CAPSTONE SPOTLIGHT (Asymmetric Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Papan Skor Snapshot (Direct Preview of leaderboard) */}
        <div className="lg:col-span-7 bg-[#fffefa] rounded-2xl border border-[#d9dfd7] p-6 shadow-retro-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase text-bdc-blue tracking-wider">
                  KLASMEN SEMENTARA
                </span>
                <BdcDots size="sm" />
              </div>
              <h2 className="font-space font-bold text-base text-bdc-midnight">
                Papan Skor Mahasiswa (Top Leaderboard)
              </h2>
            </div>
            <Link
              href="/leaderboard"
              className="retro-btn px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-bdc-midnight text-xs font-bold border border-slate-300 shadow-retro-sm flex items-center gap-1.5"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Top 3 List */}
          <div className="space-y-2.5">
            {leaderboard.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono bg-white rounded-xl border border-dashed border-slate-300">
                Belum ada data keaktifan mahasiswa di papan skor.
              </div>
            ) : (
              leaderboard.slice(0, 3).map((stu, idx) => {
                const rank = idx + 1;
                const isUser = stu.id === user?.id;
                return (
                  <div
                    key={stu.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isUser
                        ? "bg-[#fff8e6] border-bdc-gold shadow-retro-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg font-pixel flex items-center justify-center text-xs font-black border ${
                          rank === 1
                            ? "bg-bdc-gold text-bdc-midnight border-amber-600"
                            : rank === 2
                            ? "bg-slate-200 text-slate-800 border-slate-300"
                            : "bg-amber-400 text-bdc-midnight border-amber-600"
                        }`}
                      >
                        {rank}
                      </div>

                      <div className="w-8 h-8 font-pixel bg-[#e6eddc] border border-[#c9d7bc] text-bdc-midnight font-bold text-xs flex items-center justify-center shrink-0">
                        {stu.full_name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-bdc-midnight">
                            {stu.full_name}
                          </span>
                          {isUser && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-bdc-navy text-bdc-yellow uppercase">
                              Anda
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">
                          {stu.role_title} | {stu.attendance_rate}% Hadir
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-xs text-bdc-navy block">
                        {stu.points} XP
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {stu.total_attendances || 0} Sesi
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono flex items-center justify-between">
            <span>Posisi Anda saat ini: <strong>#{userRank}</strong></span>
            <span className="text-bdc-gold font-bold">+{user?.points ?? 0} XP Akumulasi</span>
          </div>
        </div>

        {/* Right 5 Cols: Capstone Project Spotlight */}
        <div className="lg:col-span-5 bg-[#fffefa] rounded-2xl border border-[#d9dfd7] p-6 shadow-retro-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                PROYEK CAPSTONE
              </span>
              {certificate ? (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    certificate.is_locked
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-emerald-100 text-emerald-800 border-emerald-300"
                  }`}
                >
                  {certificate.completion_status || "LULUS (KOMPETEN)"}
                </span>
              ) : isCapstoneGraded ? (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    (capstoneScore ?? 0) >= 75
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {(capstoneScore ?? 0) >= 75 ? "LULUS EVALUASI" : "PERLU PERBAIKAN"}
                </span>
              ) : capstoneSubmission ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-bdc-blue border border-blue-300">
                  MENUNGGU PENILAIAN
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-300">
                  BELUM DIKUMPULKAN
                </span>
              )}
            </div>

            <div>
              <h3 className="font-space font-bold text-base text-bdc-midnight">
                {certificate?.capstone_title || "BDC Hub (Web Presensi & Pembelajaran)"}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Tugas akhir pembuktian kompetensi: integrasi RBAC, skema relasional, presensi barcode proyektor,
                dan transkrip nilai digital resmi format A4.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#EFF0F0] border border-slate-300 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Nilai Evaluasi</span>
                <span className="font-bold text-bdc-midnight">
                  {capstoneScore !== null && capstoneScore !== undefined
                    ? `${capstoneScore.toFixed(1)}${capstoneGrade ? ` (${capstoneGrade})` : ""}`
                    : user?.score && user.score > 0
                    ? `${user.score.toFixed(1)}`
                    : "-"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Sertifikat</span>
                <span className="font-bold text-bdc-blue">{certificate ? "Siap Cetak" : "Pending"}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <Link
              href={certificate ? "/certificates" : "/assignments"}
              className="text-xs font-bold text-bdc-blue hover:text-bdc-navy flex items-center gap-1 font-mono"
            >
              <span>
                {certificate
                  ? "Lihat Transkrip Nilai →"
                  : capstoneSubmission
                  ? "Cek Status Pengumpulan →"
                  : "Kumpulkan Tugas Proyek →"}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5. DAFTAR MODUL PRAKTIK */}
      <div className="bg-[#fffefa] rounded-2xl border border-[#d9dfd7] p-6 shadow-retro-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="font-space font-bold text-base text-bdc-midnight">
              Modul Pelatihan &amp; Silabus Terjadwal
            </h2>
            <p className="text-xs text-slate-500">
              Materi pembelajaran langsung dan studi kasus komunitas BDC UTDI
            </p>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-bdc-blue hover:text-bdc-navy flex items-center gap-1 font-mono"
          >
            <span>Semua Modul &rarr;</span>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono bg-white rounded-xl border border-dashed border-slate-300">
            Belum ada modul pelatihan yang dipublikasikan saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-bdc-midnight hover:shadow-retro-sm transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${course.badge_color}`}>
                      {course.category}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{course.id}</span>
                  </div>

                  <h3 className="font-space font-bold text-xs text-bdc-midnight group-hover:text-bdc-blue transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{course.duration}</span>
                  <span className="font-bold text-bdc-blue group-hover:underline">
                    Buka Modul &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
