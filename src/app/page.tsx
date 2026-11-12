import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { BdcDots } from "@/components/ui/BdcDots";
import { UtdiCampusInteractiveScene } from "@/components/hero/UtdiCampusInteractiveScene";
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
  Calendar,
  Users,
  Compass,
  GraduationCap,
  ChevronRight,
  MapPin,
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
      {/* 1. RETRO-MODERN STICKY NAVBAR (Identik GDGoC IPB) */}
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

          {/* Nav links (Struktur Chapter GDGoC IPB) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700">
            <a href="#community" className="hover:text-bdc-blue transition-colors">
              Kenalan
            </a>
            <a href="#misi" className="hover:text-bdc-blue transition-colors">
              Tiga Misi
            </a>
            <a href="#programs" className="hover:text-bdc-blue transition-colors">
              Program
            </a>
            <a href="#timeline" className="hover:text-bdc-blue transition-colors">
              Kalender
            </a>
            <a href="#kampus" className="hover:text-bdc-blue transition-colors">
              Dari UTDI
            </a>
            <Link href="/leaderboard" className="hover:text-bdc-blue transition-colors flex items-center gap-1.5 text-slate-700">
              <Trophy className="w-3.5 h-3.5 text-bdc-gold" />
              <span>Leaderboard</span>
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

      {/* 2. LIVE MARQUEE TICKER (Running News GDGoC IPB) */}
      <div className="bg-bdc-midnight text-white text-xs border-b border-slate-800 overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-8 px-4 font-mono text-[11px]">
            {liveSession && (
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <Radio className="w-3 h-3 animate-ping" />
                <span>SESI LIVE HARI INI: {liveSession.title}</span>
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
              <span>DEADLINE CAPSTONE: Capstone Web BDC Hub</span>
            </span>
          </div>

          {/* Duplicate for infinite loop */}
          <div className="flex items-center gap-8 px-4 font-mono text-[11px]" aria-hidden="true">
            {liveSession && (
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <Radio className="w-3 h-3 animate-ping" />
                <span>SESI LIVE HARI INI: {liveSession.title}</span>
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
              <span>DEADLINE CAPSTONE: Capstone Web BDC Hub</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. HERO SECTION (Looping Video Terkompresi 560KB + 3D Parallax & Washes) */}
      <section
        className="relative overflow-hidden isolate bg-[#EFF0F0] border-b border-slate-300 min-h-[720px] md:min-h-[820px] lg:min-h-[880px] flex flex-col justify-between"
        id="hero"
        aria-labelledby="hero-heading"
      >
        {/* Background Video Voxel Lego Kampus UTDI (Dino loncat & kedip, burung berputar, awan melayang) */}
        <UtdiCampusInteractiveScene />

        {/* Hero Content Container (Struktur GDGoC IPB) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-20 w-full my-auto">
          <div className="max-w-2xl xl:max-w-3xl space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fffefa]/95 backdrop-blur-sm border border-slate-300 text-xs font-mono shadow-retro-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-bdc-navy">
                UTDI CHAPTER // COHORT 2026/2027
              </span>
              <BdcDots size="sm" />
            </div>

            {/* Main Headline (Persis gaya tipografi GDGoC IPB) */}
            <h1
              id="hero-heading"
              className="font-pixel text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl text-bdc-midnight leading-[0.98] tracking-tight drop-shadow-sm"
            >
              Belajar teknologi<br />
              <span className="text-bdc-blue">bareng BDC UTDI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl font-sans bg-[#EFF0F0]/80 md:bg-transparent backdrop-blur-[2px] md:backdrop-blur-none rounded-xl p-1 md:p-0">
              Komunitas mahasiswa Universitas Teknologi Digital Indonesia (UTDI) untuk belajar coding, cloud, UI/UX, dan AI lewat sesi praktik langsung, presensi barcode terverifikasi, dan proyek tim.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={portalHref}
                className="retro-btn px-7 py-3.5 rounded-2xl bg-bdc-blue hover:bg-blue-600 text-white text-sm font-bold flex items-center gap-2.5 shadow-retro transition-all border border-bdc-midnight"
              >
                <span>{portalLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#community"
                className="retro-btn px-6 py-3.5 rounded-2xl bg-[#fffefa] hover:bg-[#f4f3ea] text-bdc-midnight text-sm font-bold border border-bdc-midnight shadow-retro transition-all flex items-center gap-2"
              >
                <span>Kenalan Dulu</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            </div>

            {/* Micro stats banner */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-700 font-mono">
              <div className="flex items-center gap-1.5 bg-[#fffefa]/80 px-2.5 py-1 rounded-lg border border-slate-300 shadow-retro-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Presensi Barcode Proyektor</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#fffefa]/80 px-2.5 py-1 rounded-lg border border-slate-300 shadow-retro-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Rank Kehadiran &amp; XP</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#fffefa]/80 px-2.5 py-1 rounded-lg border border-slate-300 shadow-retro-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cetak Sertifikat A4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Scroll Button (GDGoC IPB hero-scroll) */}
        <a
          href="#community"
          className="hero-scroll"
          aria-label="Jelajahi komunitas BDC UTDI"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            shapeRendering="crispEdges"
            className="text-bdc-midnight"
          >
            <path d="M13 12h6v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2h6V4h2v8Z" />
          </svg>
        </a>
      </section>

      {/* 4. CHAPTER 01: KENALAN DENGAN BDC UTDI (Format identik Chapter GDGoC IPB) */}
      <section id="community" className="py-24 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header Chapter */}
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 01 // KENALAN DENGAN BDC UTDI ]
              </span>
              <BdcDots size="sm" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-space text-bdc-midnight tracking-tight">
              Kenalan dengan Business Dev Club UTDI
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              <strong>Business Dev Club (BDC) Universitas Teknologi Digital Indonesia</strong> adalah komunitas mahasiswa Yogyakarta untuk belajar, berkolaborasi, dan berkarya di bidang teknologi digital, apa pun latar belakang peminatan dan jurusannya.
            </p>
          </div>

          {/* Visi Besar Bento Box (Gaya GDGoC IPB) */}
          <div className="retro-card p-8 sm:p-10 rounded-3xl bg-[#FAF9F2] border-2 border-slate-300 space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-bdc-yellow text-bdc-midnight border border-bdc-midnight shadow-retro-sm">
                VISI KOMUNITAS 2026/2027
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">
                EST. YOGYAKARTA
              </span>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-space font-extrabold text-bdc-midnight leading-snug">
              Menjadi ekosistem pertumbuhan teknologi yang inklusif, tempat mahasiswa dari kampus UTDI dan Yogyakarta belajar, berkarya, berkompetisi, berkolaborasi, dan memimpin.
            </p>
            <div className="pt-4 border-t border-slate-300 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Inklusif &amp; Terbuka</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-bdc-blue" />
                <span>Hands-on Project First</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-bdc-gold" />
                <span>Verifikasi Kompetensi Resmi</span>
              </div>
            </div>
          </div>

          {/* 4 Pilar Mini-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="retro-card p-6 rounded-2xl bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-bdc-blue flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-space font-bold text-base text-bdc-midnight">
                Belajar Terarah
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kurikulum terstruktur berbasis kebutuhan industri dan didampingi pemateri berpengalaman.
              </p>
            </div>

            <div className="retro-card p-6 rounded-2xl bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-bdc-red flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-space font-bold text-base text-bdc-midnight">
                Kolaborasi Proyek
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bangun produk digital bersama tim lintas peminatan dengan standar Git repositori dan code review.
              </p>
            </div>

            <div className="retro-card p-6 rounded-2xl bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-bdc-gold flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-space font-bold text-base text-bdc-midnight">
                Gamifikasi XP
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kumpulkan poin XP dari presensi barcode dan pengumpulan tugas untuk meraih podium tertinggi.
              </p>
            </div>

            <div className="retro-card p-6 rounded-2xl bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="font-space font-bold text-base text-bdc-midnight">
                Sertifikat Sah
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sertifikasi digital resmi berstandar A4 dengan QR code verifikasi publik yang diakui kampus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHAPTER 02: TIGA MISI, SATU PERJALANAN (Persis GDGoC IPB) */}
      <section id="misi" className="py-24 bg-voxel-grid border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-300 text-xs font-mono shadow-retro-sm">
              <span className="font-bold uppercase tracking-wider text-bdc-blue">
                [ 02 // TIGA MISI, SATU PERJALANAN ]
              </span>
              <BdcDots size="sm" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-space text-bdc-midnight tracking-tight">
              Tiga misi, satu perjalanan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Arah BDC UTDI sepanjang 2026/2027, dari belajar fundamental sampai membangun solusi berdampak nyata.
            </p>
          </div>

          {/* 3 Misi Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Misi 01 */}
            <div className="retro-card p-8 rounded-3xl bg-white flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-black text-bdc-blue block uppercase tracking-wider">
                  MISI 01
                </span>
                <h3 className="font-space font-extrabold text-2xl text-bdc-midnight">
                  Structured Learning
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Jalur belajar yang jelas di bidang <strong>Full-stack Web, Cybersecurity, UI/UX Design, dan Applied AI</strong>, didukung silabus kurikulum modular, modul hands-on, dan bimbingan mentor.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 font-mono text-xs text-slate-500 flex items-center justify-between">
                <span>Silabus Modular</span>
                <span className="text-bdc-blue font-bold">5 Modul &rarr;</span>
              </div>
            </div>

            {/* Misi 02 */}
            <div className="retro-card p-8 rounded-3xl bg-white flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-black text-bdc-red block uppercase tracking-wider">
                  MISI 02
                </span>
                <h3 className="font-space font-extrabold text-2xl text-bdc-midnight">
                  Applied Growth
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bukan sekadar mendengarkan materi kuliah. Mahasiswa diajak terjun langsung membangun <strong>Capstone Project nyata</strong>, mengelola repositori Git, dan melakukan code review bertahap.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 font-mono text-xs text-slate-500 flex items-center justify-between">
                <span>Hands-on Code</span>
                <span className="text-bdc-red font-bold">64+ Jam Lab &rarr;</span>
              </div>
            </div>

            {/* Misi 03 */}
            <div className="retro-card p-8 rounded-3xl bg-white flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-black text-emerald-600 block uppercase tracking-wider">
                  MISI 03
                </span>
                <h3 className="font-space font-extrabold text-2xl text-bdc-midnight">
                  Connected Ecosystem
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ekosistem presensi barcode digital proyektor, leaderboard peringkat keaktifan XP, repositori tugas terintegrasi, dan penerbitan <strong>sertifikat resmi digital standar A4</strong>.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 font-mono text-xs text-slate-500 flex items-center justify-between">
                <span>Peringkat Mahasiswa</span>
                <span className="text-emerald-600 font-bold">Leaderboard XP &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CHAPTER 03: MAU BELAJAR, BIKIN, ATAU IKUT KOMPETISI? (Tiga Program Utama) */}
      <section id="programs" className="py-24 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                  [ 03 // PROGRAM UTAMA ]
                </span>
                <BdcDots size="sm" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-space text-bdc-midnight tracking-tight">
                Mau belajar, bikin, atau ikut kompetisi?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Kenali tiga program utama kami di BDC UTDI. Informasi dan jadwal kegiatan diumumkan secara transparan melalui portal mahasiswa.
            </p>
          </div>

          {/* 3 Program Utama Cards (Gaya GDGoC IPB) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Program 1: BDC Catalyst */}
            <div className="retro-card p-8 rounded-3xl bg-[#FAF9F2] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-100 text-bdc-blue border border-blue-300">
                    PROGRAM 01
                  </span>
                  <BookOpen className="w-5 h-5 text-bdc-blue" />
                </div>
                <h3 className="font-space font-black text-2xl text-bdc-midnight">
                  BDC Catalyst
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Sesi workshop intensif mingguan bersama pemateri dan mentor. Dilengkapi sistem pemindai barcode presensi proyektor, kuis penilaian, dan modul hands-on terarah.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Presensi Barcode Proyektor</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>5 Modul Silabus Komprehensif</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Live Google Meet Interaktif</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300">
                <Link
                  href="/courses"
                  className="retro-btn w-full py-2.5 rounded-xl bg-white text-bdc-midnight text-xs font-bold flex items-center justify-center gap-2 shadow-retro-sm"
                >
                  <span>Lihat Silabus Modul</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Program 2: Tech League */}
            <div className="retro-card p-8 rounded-3xl bg-[#FAF9F2] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    PROGRAM 02
                  </span>
                  <Trophy className="w-5 h-5 text-bdc-gold" />
                </div>
                <h3 className="font-space font-black text-2xl text-bdc-midnight">
                  Tech League &amp; XP
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Liga kompetisi teknologi antarmahasiswa. Kumpulkan poin XP keaktifan dan buktikan keunggulan portofoliomu di papan klasemen podium utama.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Leaderboard Realtime</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Bonus XP Presensi &amp; Tugas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Penghargaan Top Performer</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300">
                <Link
                  href="/leaderboard"
                  className="retro-btn w-full py-2.5 rounded-xl bg-bdc-yellow text-bdc-midnight text-xs font-black flex items-center justify-center gap-2 shadow-retro-sm"
                >
                  <span>Cek Papan Klasemen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Program 3: Tech Support & Certification */}
            <div className="retro-card p-8 rounded-3xl bg-[#FAF9F2] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    PROGRAM 03
                  </span>
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-space font-black text-2xl text-bdc-midnight">
                  Tech Support &amp; Cert
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Pusat evaluasi penugasan capstone, bimbingan kode, dan penerbitan sertifikat kompetensi resmi A4 yang dapat diverifikasi keasliannya oleh industri.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Evaluasi Tugas Skala 0–100</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Transkrip Nilai Lengkap A4</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Portal Verifikasi Publik</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300">
                <Link
                  href="/leaderboard"
                  className="retro-btn w-full py-2.5 rounded-xl bg-white text-bdc-midnight text-xs font-bold flex items-center justify-center gap-2 shadow-retro-sm"
                >
                  <Trophy className="w-3.5 h-3.5 text-bdc-gold" />
                  <span>Lihat Leaderboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CHAPTER 04: SETAHUN BERSAMA BDC UTDI (Timeline Stepper GDGoC IPB) */}
      <section id="timeline" className="py-24 bg-voxel-grid border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-300 text-xs font-mono shadow-retro-sm">
              <span className="font-bold uppercase tracking-wider text-bdc-blue">
                [ 04 // KALENDER &amp; ROADMAP ]
              </span>
              <BdcDots size="sm" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-space text-bdc-midnight tracking-tight">
              Setahun bersama BDC UTDI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Jadwal dan tahapan kegiatan cohort 2026/2027, dari orientasi pendaftaran sampai final demo day dan awarding.
            </p>
          </div>

          {/* Stepper Timeline Bento (Gaya GDGoC IPB) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="retro-card p-6 rounded-2xl bg-white flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-xs font-black text-bdc-blue block">
                  TAHAP 01
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 font-mono inline-block">
                  OKTOBER
                </span>
                <h4 className="font-space font-bold text-base text-bdc-midnight">
                  Onboarding &amp; Barcode
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Registrasi anggota, aktivasi akun portal mahasiswa, dan pengenalan alur presensi barcode proyektor.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                Kickoff Cohort
              </div>
            </div>

            {/* Step 2 */}
            <div className="retro-card p-6 rounded-2xl bg-white flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-xs font-black text-bdc-red block">
                  TAHAP 02
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 font-mono inline-block">
                  NOV - DES
                </span>
                <h4 className="font-space font-bold text-base text-bdc-midnight">
                  5 Core Modul Sprint
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sesi rutin workshop, live coding mingguan, hands-on lab, dan kuis online untuk pengumpulan XP.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                Weekly Workshop
              </div>
            </div>

            {/* Step 3 */}
            <div className="retro-card p-6 rounded-2xl bg-white flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-xs font-black text-bdc-gold block">
                  TAHAP 03
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 font-mono inline-block">
                  JANUARI
                </span>
                <h4 className="font-space font-bold text-base text-bdc-midnight">
                  Capstone Briefing
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pembentukan tim kolaboratif lintas divisi, pemilihan studi kasus riil, dan penentuan mentor pendamping.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                Team Formation
              </div>
            </div>

            {/* Step 4 */}
            <div className="retro-card p-6 rounded-2xl bg-white flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-xs font-black text-purple-600 block">
                  TAHAP 04
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 font-mono inline-block">
                  FEB - MAR
                </span>
                <h4 className="font-space font-bold text-base text-bdc-midnight">
                  Build &amp; Code Review
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pengembangan sistem, pull request review di GitHub, pengujian fungsionalitas, dan evaluasi berkala.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                Git Sprint
              </div>
            </div>

            {/* Step 5 */}
            <div className="retro-card p-6 rounded-2xl bg-white flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-xs font-black text-emerald-600 block">
                  TAHAP 05
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono inline-block">
                  APRIL
                </span>
                <h4 className="font-space font-bold text-base text-bdc-midnight">
                  Demo Day &amp; Award
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pameran produk digital, penyerahan sertifikat A4 terakreditasi, dan pengumuman juara umum XP.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                Grand Finale
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CHAPTER 05: DARI UTDI UNTUK NUSANTARA (Identik Chapter Dari IPB untuk Bogor) */}
      <section id="kampus" className="py-24 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 05 // DARI UTDI UNTUK NUSANTARA ]
              </span>
              <BdcDots size="sm" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-space text-bdc-midnight tracking-tight">
              Dari Kampus UTDI untuk Ekosistem Digital
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Komunitas ini berakar di kampus <strong>Universitas Teknologi Digital Indonesia</strong> (Jl. Raya Janti / Majapahit No. 143, Yogyakarta) dan terbuka untuk mahasiswa dari seluruh fakultas serta perguruan tinggi di Yogyakarta yang ingin bertumbuh bersama.
            </p>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="retro-card p-8 rounded-3xl bg-[#FAF9F2] text-center space-y-2">
              <span className="font-pixel text-4xl sm:text-6xl font-black text-bdc-blue block">
                450+
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold block">
                Anggota Mahasiswa
              </span>
            </div>

            <div className="retro-card p-8 rounded-3xl bg-[#FAF9F2] text-center space-y-2">
              <span className="font-pixel text-4xl sm:text-6xl font-black text-emerald-600 block">
                98.4%
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold block">
                Presensi Terverifikasi
              </span>
            </div>

            <div className="retro-card p-8 rounded-3xl bg-[#FAF9F2] text-center space-y-2">
              <span className="font-pixel text-4xl sm:text-6xl font-black text-bdc-gold block">
                19
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold block">
                Rute Fitur Portal
              </span>
            </div>

            <div className="retro-card p-8 rounded-3xl bg-[#FAF9F2] text-center space-y-2">
              <span className="font-pixel text-4xl sm:text-6xl font-black text-bdc-red block">
                100%
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold block">
                Akreditasi Sertifikat
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CHAPTER 06: JADI BAGIAN DARI BDC UTDI (Final CTA Banner GDGoC IPB) */}
      <section className="py-24 bg-bdc-midnight text-white relative overflow-hidden isolate border-b border-slate-900">
        <div className="absolute inset-0 bg-voxel-grid opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-bdc-yellow shadow-retro-sm">
            <Sparkles className="w-4 h-4 text-bdc-yellow" />
            <span className="font-bold uppercase tracking-wider">
              JADI ANGGOTA BDC UTDI SEKARANG
            </span>
          </div>

          <h2 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
            Siap mulai perjalanan teknologi Anda?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Temukan rekan belajar, ikuti workshop rutin dengan barcode scanner, kerjakan capstone project, dan bangun portofolio tersertifikasi bersama komunitas mahasiswa UTDI.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={portalHref}
              className="retro-btn px-8 py-4 rounded-2xl bg-bdc-yellow hover:bg-yellow-400 text-bdc-midnight text-sm font-black flex items-center gap-2 shadow-retro transition-all border border-bdc-midnight"
            >
              <span>{portalLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/verify"
              className="retro-btn px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold border border-slate-600 shadow-retro transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verifikasi Sertifikat</span>
            </Link>
          </div>

          <div className="pt-8 text-xs font-mono text-slate-400 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Pendaftaran Cohort 2026/2027 Aktif</span>
            </span>
            <span>&bull;</span>
            <span>Kampus UTDI Yogyakarta</span>
          </div>
        </div>
      </section>

      {/* 10. FOOTER (GDGoC-inspired Clean Developer Footer) */}
      <footer className="py-14 bg-[#EFF0F0] text-slate-600 text-xs border-t border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center gap-2">
                <span className="font-space font-extrabold text-base text-bdc-midnight">
                  Business Dev Club (BDC)
                </span>
                <BdcDots size="sm" />
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Universitas Teknologi Digital Indonesia (UTDI) — Jl. Raya Janti (Majapahit) No. 143, Karang Jambe, Banguntapan, Bantul, D.I. Yogyakarta 55198.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-bold text-slate-700">
              <a href="#community" className="hover:text-bdc-blue">
                Kenalan
              </a>
              <a href="#misi" className="hover:text-bdc-blue">
                Tiga Misi
              </a>
              <a href="#programs" className="hover:text-bdc-blue">
                Program
              </a>
              <a href="#timeline" className="hover:text-bdc-blue">
                Kalender
              </a>
              <Link href="/leaderboard" className="hover:text-bdc-blue">
                Leaderboard XP
              </Link>
              <Link href="/verify" className="hover:text-bdc-blue">
                Verifikasi Sertifikat
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
            <span>
              &copy; 2026 Business Dev Club (BDC) &bull; Universitas Teknologi Digital Indonesia (UTDI).
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
