import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  ArrowRight,
  QrCode,
  Trophy,
  BookOpen,
  FolderGit2,
  Video,
  Award,
  ShieldCheck,
  CheckCircle2,
  Radio,
  ExternalLink,
  Terminal,
  Code2,
  Sparkles,
  Layers,
  Cpu,
  Lock,
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();
  const liveSession = bdcStore.getLiveSession();
  const topLearners = bdcStore.getLeaderboard().slice(0, 3);
  const courses = bdcStore.getCourses();

  const portalHref = user ? (user.role === "admin" || user.role === "instructor" ? "/admin" : "/dashboard") : "/login";
  const portalLabel = user ? "Buka Dasbor Mahasiswa" : "Masuk Portal Mahasiswa";

  return (
    <div className="min-h-screen bg-bdc-surface text-bdc-midnight flex flex-col font-sans selection:bg-bdc-yellow selection:text-bdc-midnight">
      {/* 1. RETRO-MODERN STICKY NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#EFF0F0]/90 backdrop-blur-md border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-bdc-midnight border border-slate-700 flex items-center justify-center p-2 shadow-retro-sm transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
              <Image src="/logo.svg" alt="BDC Logo" width={24} height={24} className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-space font-extrabold text-base tracking-tight text-bdc-midnight">
                  Business Dev Club
                </span>
                <BdcDots size="sm" />
              </div>
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                Chapter UTDI Yogyakarta
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
            <a href="#tracks" className="hover:text-bdc-blue transition-colors">
              Peminatan Track
            </a>
            <a href="#fitur" className="hover:text-bdc-blue transition-colors">
              Fitur Portal
            </a>
            <a href="#modul" className="hover:text-bdc-blue transition-colors">
              Silabus Modul
            </a>
            <Link href="/verify" className="hover:text-bdc-blue transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verifikasi Ijazah</span>
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href={portalHref}
              className="retro-btn px-4 py-2 rounded-xl bg-bdc-yellow text-bdc-midnight text-xs font-black flex items-center gap-2 shadow-retro-sm transition-all"
            >
              <span>{portalLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. LIVE MARQUEE TICKER (Running News inspired by GDGoC IPB) */}
      <div className="bg-bdc-midnight text-white text-xs border-b border-slate-800 overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-8 px-4 font-mono text-[11px]">
            {liveSession && (
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <Radio className="w-3 h-3 animate-ping" />
                <span>SESI LIVE: {liveSession.title}</span>
              </span>
            )}
            <span className="text-bdc-yellow flex items-center gap-2">
              <QrCode className="w-3.5 h-3.5" />
              <span>PRESENSI BARCODE AKTIF: {liveSession?.qr_token || "BDC-PRESENSI-LIVE-994"}</span>
            </span>
            <span className="text-slate-300 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-bdc-gold" />
              <span>TOP XP LEADERBOARD: {topLearners[0]?.full_name || "Siti Rahmawati"} ({topLearners[0]?.points || 1450} XP)</span>
            </span>
            <span className="text-slate-300 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>STANDAR AKREDITASI: Kampus UTDI Yogyakarta</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>DEADLINE PROYEK: Capstone Web BDC Hub</span>
            </span>
          </div>

          {/* Duplicate for infinite loop */}
          <div className="flex items-center gap-8 px-4 font-mono text-[11px]" aria-hidden="true">
            {liveSession && (
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <Radio className="w-3 h-3 animate-ping" />
                <span>SESI LIVE: {liveSession.title}</span>
              </span>
            )}
            <span className="text-bdc-yellow flex items-center gap-2">
              <QrCode className="w-3.5 h-3.5" />
              <span>PRESENSI BARCODE AKTIF: {liveSession?.qr_token || "BDC-PRESENSI-LIVE-994"}</span>
            </span>
            <span className="text-slate-300 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-bdc-gold" />
              <span>TOP XP LEADERBOARD: {topLearners[0]?.full_name || "Siti Rahmawati"} ({topLearners[0]?.points || 1450} XP)</span>
            </span>
            <span className="text-slate-300 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>STANDAR AKREDITASI: Kampus UTDI Yogyakarta</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>DEADLINE PROYEK: Capstone Web BDC Hub</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. HERO SECTION (Neo-Retro Voxel Arcade Aesthetic) */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-voxel-grid border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 7 Cols: Punchy Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-300 text-xs font-mono shadow-retro-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold uppercase tracking-wider text-bdc-navy">
                  UTDI CHAPTER // COHORT 2026
                </span>
                <BdcDots size="sm" />
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-space tracking-tight text-bdc-midnight leading-[1.08]">
                Belajar Coding, Bangun Solusi Digital bareng{" "}
                <span className="font-pixel text-bdc-blue underline decoration-bdc-yellow decoration-4 underline-offset-4">
                  BDC UTDI
                </span>
                .
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Komunitas mahasiswa teknologi Universitas Teknologi Digital Indonesia: tingkatkan keterampilan
                rekayasa web, audit keamanan, dan UI/UX lewat sesi praktik langsung, presensi barcode terverifikasi,
                dan sertifikasi kompetensi resmi.
              </p>

              {/* CTA Group */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={portalHref}
                  className="retro-btn px-6 py-3.5 rounded-2xl bg-bdc-midnight hover:bg-bdc-navy text-white text-sm font-black flex items-center gap-2 shadow-retro transition-all"
                >
                  <Terminal className="w-4 h-4 text-bdc-yellow" />
                  <span>{portalLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#fitur"
                  className="retro-btn px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-bdc-midnight text-sm font-bold border border-slate-400 shadow-retro transition-all flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4 text-bdc-blue" />
                  <span>Lihat Fitur &amp; Silabus</span>
                </a>
              </div>

              {/* Micro stats banner */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Presensi Barcode Proyektor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rank Kehadiran &amp; XP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cetak Sertifikat A4</span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Retro Voxel / Terminal Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Decorative retro offset shadow frame */}
                <div className="rounded-3xl bg-white border-2 border-bdc-midnight shadow-retro-lg p-6 sm:p-7 space-y-5">
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#EA4335] border border-red-700" />
                      <div className="w-3 h-3 rounded-full bg-[#EEDD55] border border-amber-600" />
                      <div className="w-3 h-3 rounded-full bg-[#34A853] border border-emerald-700" />
                    </div>
                    <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      bdc-terminal v2.6.4
                    </span>
                    <BdcDots size="sm" />
                  </div>

                  {/* Terminal CLI code animation */}
                  <div className="p-4 rounded-xl bg-bdc-midnight text-white font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
                    <p className="text-slate-400">$ bdc init --cohort 2026 --campus utdi</p>
                    <p className="text-emerald-400">&gt; Menghubungkan ke pangkalan data kampus...</p>
                    <p className="text-bdc-yellow">&gt; Presensi Sesi Aktif: BDC-PRESENSI-LIVE-994</p>
                    <p className="text-slate-200">&gt; Status Mahasiswa: Valid (@students.utdi.ac.id)</p>
                    <div className="pt-2 flex items-center gap-1 text-slate-400">
                      <span className="text-bdc-blue font-bold">&gt;</span>
                      <span className="w-2.5 h-4 bg-bdc-yellow animate-pulse inline-block" />
                    </div>
                  </div>

                  {/* Live Activity Snapshot Card */}
                  <div className="p-4 rounded-xl bg-bdc-surface border border-slate-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                        Live Sesi Hari Ini
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Google Meet
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-bdc-midnight leading-snug">
                      {liveSession?.title || "Sesi Pertemuan 3: Integrasi API & State Management Komunitas"}
                    </h4>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-mono">
                      <span>Pemateri: {liveSession?.instructor || "Dr. Evelyn Vance"}</span>
                      <Link
                        href={portalHref}
                        className="text-bdc-blue hover:text-bdc-navy font-bold flex items-center gap-1"
                      >
                        <span>Presensi</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR LEARNING TRACKS (Level System inspired by GDGoC IPB) */}
      <section id="tracks" className="py-20 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                  [ 01 // PEMINATAN COHORT ]
                </span>
                <BdcDots size="sm" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-space text-bdc-midnight tracking-tight">
                4 Jalur Peminatan Teknologi BDC
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Pilih fokus spesialisasi untuk mengasah keahlian praktis sesuai standar industri teknologi modern.
            </p>
          </div>

          {/* 4 Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Track 1 */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-bdc-blue flex items-center justify-center shadow-retro-sm">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
                  LEVEL 01 // WEB &amp; CLOUD
                </span>
                <h3 className="font-space font-bold text-base text-bdc-midnight">
                  Full-stack Web Architecture
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Membangun aplikasi modern Next.js 16, TypeScript, RESTful API, dan integrasi database relational Supabase.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 font-mono text-[11px] text-bdc-blue font-bold flex items-center justify-between">
                <span>16 Jam Praktik</span>
                <span>Modul ACT-01 &rarr;</span>
              </div>
            </div>

            {/* Track 2 */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-bdc-red flex items-center justify-center shadow-retro-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
                  LEVEL 02 // CYBERSECURITY
                </span>
                <h3 className="font-space font-bold text-base text-bdc-midnight">
                  Ethical Hacking &amp; Audit
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Analisis paket Wireshark, mitigasi celah OWASP Top 10, autentikasi aman, dan pemenuhan standar ISO 27001.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 font-mono text-[11px] text-bdc-red font-bold flex items-center justify-between">
                <span>12 Jam Praktik</span>
                <span>Modul ACT-02 &rarr;</span>
              </div>
            </div>

            {/* Track 3 */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-bdc-gold flex items-center justify-center shadow-retro-sm">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
                  LEVEL 03 // UI/UX DESIGN
                </span>
                <h3 className="font-space font-bold text-base text-bdc-midnight">
                  Product Design Engineering
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Eksplorasi Design Tokens, wireframing, aksesibilitas WCAG, micro-interactions, dan audit visual anti-slop.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 font-mono text-[11px] text-bdc-gold font-bold flex items-center justify-between">
                <span>14 Jam Praktik</span>
                <span>Modul ACT-03 &rarr;</span>
              </div>
            </div>

            {/* Track 4 */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-retro-sm">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
                  LEVEL 04 // APPLIED AI
                </span>
                <h3 className="font-space font-bold text-base text-bdc-midnight">
                  AI &amp; Data Insights
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pemanfaatan model bahasa (LLM), embedding semantik, ekstraksi data cerdas, dan integrasi analitik ke web.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 font-mono text-[11px] text-emerald-600 font-bold flex items-center justify-between">
                <span>10 Jam Praktik</span>
                <span>Modul ACT-04 &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE 6 CORE FEATURES BENTO SHOWCASE */}
      <section id="fitur" className="py-20 bg-voxel-grid border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-300 text-xs font-mono shadow-retro-sm">
              <span className="font-bold uppercase tracking-wider text-bdc-blue">
                [ 02 // EKOSISTEM PORTAL ]
              </span>
              <BdcDots size="sm" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-space text-bdc-midnight tracking-tight">
              Fitur Lengkap Terpadu BDC Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Mulai dari pemindai barcode, papan peringkat keaktifan, hingga evaluasi tugas dan cetak sertifikat A4.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Barcode Presensi */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-bdc-navy text-bdc-yellow flex items-center justify-center shadow-retro-sm">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-space font-bold text-lg text-bdc-midnight">
                  Presensi Barcode Proyektor
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pemindai optik kamera otomatis dan validasi kode token kelas. Membantu instruktur menampilkan QR resolusi tinggi di layar proyektor ruang kuliah.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
                <span>Token Aktif: </span>
                <strong className="text-bdc-blue">BDC-PRESENSI-LIVE-994</strong>
              </div>
            </div>

            {/* Feature 2: Leaderboard */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-bdc-gold flex items-center justify-center shadow-retro-sm">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="font-space font-bold text-lg text-bdc-midnight">
                  Rank Kehadiran &amp; XP
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Podium asimetris Top 3 juara dan papan klasemen lengkap. Poin XP terakumulasi otomatis dari presensi barcode (+100 XP) dan pengumpulan tugas (+150 XP).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 font-mono text-[11px] text-amber-900 flex justify-between">
                <span>Top #1: Siti Rahmawati</span>
                <strong className="text-bdc-gold">1450 XP</strong>
              </div>
            </div>

            {/* Feature 3: Modul & Capstone */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-bdc-blue flex items-center justify-center shadow-retro-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-space font-bold text-lg text-bdc-midnight">
                  Modul &amp; Capstone Checklist
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Katalog materi komprehensif dengan 4 tab terpadu: Silabus interaktif, Sesi Presensi, Penugasan Proyek, dan Tautan Google Meet tatap muka.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 font-mono text-[11px] text-bdc-navy flex justify-between">
                <span>5 Modul Terdaftar</span>
                <strong className="text-bdc-blue">100% Praktik</strong>
              </div>
            </div>

            {/* Feature 4: Tugas & Portofolio */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shadow-retro-sm">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <h3 className="font-space font-bold text-lg text-bdc-midnight">
                  Penugasan &amp; Penilaian Proyek
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mahasiswa mengumpulkan tautan repositori GitHub &amp; Drive. Tim kurator memberikan nilai skala 0–100 dan catatan evaluasi yang membuka sertifikat.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 font-mono text-[11px] text-purple-900">
                <span>Review Standard: </span>
                <strong>Skala 0-100 &amp; Feedback</strong>
              </div>
            </div>

            {/* Feature 5: Google Meet Tatap Muka */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-retro-sm">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="font-space font-bold text-lg text-bdc-midnight">
                  Live Meet &amp; Video Conference
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Admin menyebarkan link ruang tatap muka virtual resmi. Mahasiswa mendapatkan notifikasi Live Island banner bernafas dengan tombol sekali klik.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-[11px] text-emerald-900 flex justify-between">
                <span>Google Meet Kampus</span>
                <strong className="text-emerald-700">Live Island</strong>
              </div>
            </div>

            {/* Feature 6: Sertifikat Digital A4 */}
            <div className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-200 text-amber-700 flex items-center justify-center shadow-retro-sm">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-space font-bold text-lg text-bdc-midnight">
                  Sertifikat &amp; Transkrip A4 Sah
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Otomatis terbit saat presensi &gt;= 80%, nilai ujian &gt;= 75, dan tugas lulus. Dilengkapi QR code verifikasi publik dan cetak standar A4 portrait.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 font-mono text-[11px] text-amber-900 flex justify-between">
                <span>Nomor Registrasi:</span>
                <strong className="text-amber-800">BDC/CERT/2026/...</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MODUL HIGHLIGHTS */}
      <section id="modul" className="py-20 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest block mb-1">
                [ 03 // SILABUS AKADEMIK ]
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-space text-bdc-midnight tracking-tight">
                5 Modul Praktik Komunitas BDC
              </h2>
            </div>
            <Link
              href={portalHref}
              className="text-xs font-bold text-bdc-blue hover:text-bdc-navy flex items-center gap-1 font-mono"
            >
              <span>Akses Penuh di Portal Mahasiswa &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="retro-card p-6 rounded-2xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${course.badge_color}`}>
                      {course.category}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      {course.id}
                    </span>
                  </div>

                  <h3 className="font-space font-bold text-sm text-bdc-midnight leading-snug line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{course.duration}</span>
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-bdc-blue hover:text-bdc-navy font-bold flex items-center gap-1"
                  >
                    <span>Silabus</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY STATS BANNER */}
      <section className="py-16 bg-bdc-midnight text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="font-pixel text-4xl sm:text-5xl font-black text-bdc-yellow block">5</span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1 block">
                Modul Kompetensi
              </span>
            </div>
            <div>
              <span className="font-pixel text-4xl sm:text-5xl font-black text-white block">150+</span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1 block">
                Mahasiswa Anggota
              </span>
            </div>
            <div>
              <span className="font-pixel text-4xl sm:text-5xl font-black text-emerald-400 block">64.5+</span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1 block">
                Jam Hands-On
              </span>
            </div>
            <div>
              <span className="font-pixel text-4xl sm:text-5xl font-black text-bdc-gold block">100%</span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1 block">
                Akreditasi UTDI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (GDGoC-inspired Clean Developer Footer) */}
      <footer className="py-12 bg-[#EFF0F0] text-slate-600 text-xs border-t border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-space font-extrabold text-sm text-bdc-midnight">
                  Business Dev Club (BDC)
                </span>
                <BdcDots size="sm" />
              </div>
              <p className="text-slate-500 text-[11px]">
                Universitas Teknologi Digital Indonesia (UTDI) — Jl. Raya Janti No. 143, Karang Jambe, Banguntapan, Bantul, D.I. Yogyakarta 55198.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-bold text-slate-700">
              <Link href="/login" className="hover:text-bdc-blue">
                Login Mahasiswa
              </Link>
              <Link href="/courses" className="hover:text-bdc-blue">
                Katalog Modul
              </Link>
              <Link href="/attendance" className="hover:text-bdc-blue">
                Presensi Barcode
              </Link>
              <Link href="/leaderboard" className="hover:text-bdc-blue">
                Peringkat XP
              </Link>
              <Link href="/verify" className="hover:text-bdc-blue">
                Verifikasi Sertifikat
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
            <span>
              &copy; 2026 Business Dev Club (BDC) — Biro Kemahasiswaan UTDI. All rights reserved.
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Sistem Aktif &amp; Terverifikasi Kampus</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
