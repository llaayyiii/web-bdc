import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  QrCode,
  Award,
  ChevronRight,
  Sparkles,
  Zap,
  Monitor,
  GraduationCap,
  Play,
  Layers,
  Code2,
  Users,
  Compass,
  Check,
  ArrowUpRight,
  Globe,
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();
  const liveSession = bdcStore.getLiveSession();
  const topLearners = bdcStore.getLeaderboard().slice(0, 3);
  const courses = bdcStore.getCourses();

  const portalHref = user
    ? user.role === "admin" || user.role === "instructor"
      ? "/admin"
      : "/dashboard"
    : "/login";
  const portalLabel = user ? "Buka Dasbor Mahasiswa" : "Masuk Portal";

  return (
    <div className="min-h-screen bg-brand-dark text-slate-900 font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden relative">
      {/* ============================================================== */}
      {/* 1. TOP ZONE: DARK COSMIC THEME (Navbar + Marquee + Hero)       */}
      {/* ============================================================== */}
      <div className="bg-brand-dark text-slate-100 bg-grid-dark relative">
        {/* Gradient Blur Backdrop (Top ambient glowing lights) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-[20%] left-[20%] w-[520px] h-[520px] bg-brand-primary/20 rounded-full blur-glow" />
          <div className="absolute -top-[10%] right-[20%] w-[500px] h-[420px] bg-brand-secondary/20 rounded-full blur-glow" />
        </div>

        {/* ==================== 1. NAVIGATION BAR ==================== */}
        <header className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-4 lg:px-16 transition-colors">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo BDC UTDI (Standalone 3D Dino Logo) */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.svg"
                alt="BDC Logo"
                width={54}
                height={30}
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-brand-primary transition-colors">
                  BDC UTDI
                </span>
                <p className="text-[8px] text-slate-400 font-semibold tracking-wider -mt-0.5 hidden md:block uppercase font-mono">
                  BUSINESS DEVELOPMENT CLUB
                </p>
              </div>
            </Link>

            {/* Menu Navigasi Sesuai Referensi */}
            <nav className="hidden lg:flex gap-8 font-medium text-sm text-slate-300">
              <a href="#hero" className="hover:text-white transition-colors">
                Beranda
              </a>
              <a
                href="#tentang"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                Tentang Kami{" "}
                <ChevronRight className="w-3.5 h-3.5 opacity-60 rotate-90" />
              </a>
              <a
                href="#pilar"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                Program{" "}
                <ChevronRight className="w-3.5 h-3.5 opacity-60 rotate-90" />
              </a>
              <Link href="/verify" className="hover:text-white transition-colors">
                Sertifikasi
              </Link>
              <Link
                href="/leaderboard"
                className="hover:text-white transition-colors"
              >
                Leaderboard
              </Link>
            </nav>

            {/* Tombol CTA */}
            <div className="flex items-center gap-4">
              <Link
                href={portalHref}
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block"
              >
                {portalLabel}
              </Link>
              <Link
                href={portalHref}
                className="px-5 py-2.5 bg-white text-brand-dark rounded-full text-xs font-bold hover:bg-slate-200 transition-all shadow-md active:scale-95"
              >
                {user ? "Ke Dasbor" : "Gabung Sekarang"}
              </Link>
            </div>
          </div>
        </header>

        {/* ==================== LIVE MARQUEE TICKER (DARK COSMIC) ==================== */}
        <div className="bg-brand-card/40 border-b border-white/5 py-2.5 overflow-hidden relative z-10 text-xs font-mono text-slate-300">
          <div className="flex items-center whitespace-nowrap animate-marquee">
            <div className="flex items-center gap-8 mx-4">
              <span className="flex items-center gap-2 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">STATUS SESI:</span>
                <span>
                  {liveSession
                    ? `Presensi Barcode Aktif (${liveSession.qr_token})`
                    : "Presensi Siap Terbuka"}
                </span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="flex items-center gap-2 text-yellow-400">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>
                  TOP XP:{" "}
                  {topLearners[0]
                    ? `${topLearners[0].full_name} (${topLearners[0].points} XP)`
                    : "Papan Skor Mahasiswa Aktif"}
                </span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="flex items-center gap-2 text-slate-300">
                <Award className="w-3.5 h-3.5 text-brand-secondary" />
                <span>STANDAR AKREDITASI: Kampus UTDI Yogyakarta</span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="flex items-center gap-2 text-brand-accent">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>KREDENSIAL RESMI: Terkoneksi Pangkalan Verifikasi</span>
              </span>
            </div>

            <div className="flex items-center gap-8 mx-4" aria-hidden="true">
              <span className="flex items-center gap-2 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">STATUS SESI:</span>
                <span>
                  {liveSession
                    ? `Presensi Barcode Aktif (${liveSession.qr_token})`
                    : "Presensi Siap Terbuka"}
                </span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="flex items-center gap-2 text-yellow-400">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>
                  TOP XP:{" "}
                  {topLearners[0]
                    ? `${topLearners[0].full_name} (${topLearners[0].points} XP)`
                    : "Papan Skor Mahasiswa Aktif"}
                </span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="flex items-center gap-2 text-slate-300">
                <Award className="w-3.5 h-3.5 text-brand-secondary" />
                <span>STANDAR AKREDITASI: Kampus UTDI Yogyakarta</span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="flex items-center gap-2 text-brand-accent">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>KREDENSIAL RESMI: Terkoneksi Pangkalan Verifikasi</span>
              </span>
            </div>
          </div>
        </div>

        {/* ==================== 2. HERO SECTION ==================== */}
        <section id="hero" className="pt-16 pb-36 px-6 lg:px-16 max-w-7xl mx-auto relative z-10 hero-gradient">
          {/* Badge atas */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-primary mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
            <span>Akademik, Komunitas, &amp; Sertifikasi Kampus UTDI</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Kolom Kiri - Text Utama */}
            <div className="lg:col-span-7 space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-7.5xl font-extrabold tracking-tight leading-[1.08] text-white">
                Simplify.
                <br />
                Automate.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-400">
                  Scale Your
                </span>
                <br />
                Future.
              </h1>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-400 tracking-tight">
                All in One Platform BDC UTDI.
              </p>

              {/* Bukti Sosial & Peminat */}
              <div className="pt-8 flex flex-wrap items-center gap-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <img
                      className="w-10 h-10 rounded-full border-2 border-brand-dark object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="Pengguna"
                    />
                    <img
                      className="w-10 h-10 rounded-full border-2 border-brand-dark object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                      alt="Pengguna"
                    />
                    <img
                      className="w-10 h-10 rounded-full border-2 border-brand-dark object-cover"
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                      alt="Pengguna"
                    />
                  </div>
                  <div>
                    <div className="flex text-yellow-500 text-sm">★★★★★</div>
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wide">
                      12,540+ Mahasiswa Bergabung
                    </p>
                  </div>
                </div>

                <a
                  href="#pilar"
                  className="text-xs font-bold text-white hover:text-brand-primary transition-colors flex items-center gap-1.5 group border-b border-white/10 pb-1"
                >
                  <span>Jelajahi Platform</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Kolom Kanan - Subteks & CTA Mini */}
            <div className="lg:col-span-5 lg:pl-8 space-y-8 lg:mt-4">
              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md">
                Business Development Club (BDC) UTDI membantu para mahasiswa berkolaborasi secara real-time, mengakses inkubator bisnis, dan mengasah keterampilan digital siap kerja lebih cepat dari sebelumnya.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={portalHref}
                  className="px-6 py-3 bg-white text-brand-dark rounded-full text-xs font-bold hover:bg-slate-200 transition-all shadow-lg active:scale-95"
                >
                  {portalLabel}
                </Link>
                <Link
                  href="/verify"
                  className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs font-bold transition-all flex items-center gap-2 text-white"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                  <span>Verifikasi Sertifikat</span>
                </Link>
              </div>

              {/* Pratinjau Ilustrasi 3D / Interface */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/5">
                <div className="h-20 bg-gradient-to-tr from-brand-primary/20 to-brand-secondary/20 rounded-xl border border-white/10 flex items-center justify-center p-3 text-center transition-transform hover:scale-105">
                  <span className="text-xs font-bold text-slate-300">
                    Academic
                  </span>
                </div>
                <div className="h-20 bg-gradient-to-tr from-indigo-500/10 to-brand-primary/20 rounded-xl border border-white/10 flex items-center justify-center p-3 text-center transition-transform hover:scale-105">
                  <span className="text-xs font-bold text-slate-300">
                    College
                  </span>
                </div>
                <div className="h-20 bg-gradient-to-tr from-purple-500/10 to-indigo-500/20 rounded-xl border border-white/10 flex items-center justify-center p-3 text-center transition-transform hover:scale-105">
                  <span className="text-xs font-bold text-brand-primary animate-pulse">
                    Community
                  </span>
                </div>
              </div>

              {/* Live Session Real-time Card if active */}
              {liveSession && (
                <div className="p-4 rounded-2xl bg-brand-card/40 border border-emerald-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Sesi Presensi Aktif
                      </p>
                      <p className="text-[10px] font-mono text-emerald-400">
                        Token: {liveSession.qr_token}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={portalHref}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
                  >
                    Buka Barcode
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* RADIANT GRADIENT BLOOM: TRANSITION FROM DARK COSMIC TO WHITE   */}
        {/* ============================================================== */}
        <div className="relative w-full h-44 bg-gradient-to-b from-brand-dark via-[#3b126d]/40 via-50% to-white pointer-events-none" />
      </div>

      {/* ============================================================== */}
      {/* 2. LOWER ZONE: CLEAN WHITE & LAVENDER THEME (Semakin ke bawah) */}
      {/* ============================================================== */}
      <div className="bg-white text-slate-900 bg-grid-light relative z-10 transition-colors">
        {/* ==================== 3. ABOUT US SECTION ==================== */}
        <section
          id="tentang"
          className="pt-12 pb-24 px-6 lg:px-16 max-w-7xl mx-auto"
        >
          {/* Label Atas Sesuai Gambar 14 */}
          <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
            Tentang Kami
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* Kiri: Judul besar dan testimoni */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Smart Solutions
                <br />
                Designed to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                  Drive
                </span>
                <br />
                Your Success.
              </h2>

              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl max-w-md shadow-sm">
                <img
                  className="w-12 h-12 rounded-full border border-slate-200 object-cover shrink-0"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Anggota"
                />
                <div>
                  <p className="text-xs text-slate-700 font-medium italic">
                    &ldquo;Semua yang Anda butuhkan untuk mengelola dan mengembangkan portofolio bisnis dan karir teknologi dalam satu atap.&rdquo;
                  </p>
                  <p className="text-[10px] text-brand-primary font-bold mt-1.5">
                    Arrafi Nur Hafiz &bull; Mahasiswa Web Development BDC UTDI
                  </p>
                </div>
              </div>
            </div>

            {/* Kanan: Penjelasan detail */}
            <div className="space-y-12">
              <p className="text-slate-600 font-medium leading-relaxed text-base">
                Kami memberdayakan mahasiswa dengan seperangkat program intensif untuk merampingkan operasional, meningkatkan produktivitas, serta mempercepat pertumbuhan bisnis dan kompetensi di era digital.
              </p>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Mengapa BDC UTDI?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Mulai dari otomatisasi tugas, pembelajaran intensif, hingga analisis data dan pelaporan perkembangan, BDC UTDI menyediakan modul lengkap yang dirancang khusus untuk mahasiswa modern. Fokus pada apa yang penting, sementara kami membantu persiapan kompetensi karir dan bisnis digital Anda.
                </p>

                {/* 3 Keunggulan Utama */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-900">01. Real-time</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Presensi Barcode Proyektor otomatis
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-900">02. Gamified</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Leaderboard XP &amp; Capstone portofolio
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-900">03. Akreditasi</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Sertifikat resmi ber-QR Code valid
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 4. FEATURED TOOLS (PROGRAM) SECTION ==================== */}
        <section
          id="pilar"
          className="py-24 border-t border-slate-200/80 px-6 lg:px-16 max-w-7xl mx-auto"
        >
          {/* Label Atas Sesuai Gambar 14 */}
          <div className="flex justify-between items-start flex-wrap gap-6 mb-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 tracking-wider uppercase shadow-sm">
                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                Program Unggulan
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Powerful Tools
                <br />
                Built for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                  Your Business &amp; Career
                </span>
              </h2>
            </div>

            <div className="max-w-xs space-y-4">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Jelajahi rangkaian program terbaik kami yang dirancang khusus untuk mempermudah alur kerja, meningkatkan kolaborasi tim, dan menghasilkan pencapaian yang nyata.
              </p>
              <Link
                href={portalHref}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold rounded-full text-white transition-all shadow-sm"
              >
                <span>Lihat Semua Program</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Grid 3 Kolom Kartu Putih Bersih (Sesuai Screenshot Referensi) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - Inkubasi Bisnis */}
            <div className="bg-white border border-slate-200/90 hover:border-brand-primary/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(99,102,241,0.12)] rounded-3xl p-7 transition-all group flex flex-col justify-between h-96 hover:-translate-y-1.5">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100/80 rounded-2xl flex items-center justify-center text-brand-primary">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                  Inkubasi Bisnis
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Kami membimbing ide bisnis mahasiswa dari konsep awal, pembuatan prototype, hingga peluncuran nyata dan siap pasar dengan pendampingan mentor.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold font-mono">
                  01 &mdash; Rintisan Digital
                </span>
                <Link
                  href={portalHref}
                  className="text-xs font-bold text-brand-primary group-hover:underline flex items-center gap-1"
                >
                  Buka Detail &rarr;
                </Link>
              </div>
            </div>

            {/* Card 2 - Pelatihan & Workshop */}
            <div className="bg-white border border-slate-200/90 hover:border-brand-secondary/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(168,85,247,0.12)] rounded-3xl p-7 transition-all group flex flex-col justify-between h-96 hover:-translate-y-1.5">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-50 border border-purple-100/80 rounded-2xl flex items-center justify-center text-brand-secondary">
                  <Monitor className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-secondary transition-colors">
                  Pelatihan &amp; Workshop
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Asah kemampuan digital, cloud engineering, UI/UX, dan strategi tech terkini lewat program workshop interaktif secara berkala bersama praktisi industri.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold font-mono">
                  02 &mdash; Pengembangan Skill
                </span>
                <Link
                  href={portalHref}
                  className="text-xs font-bold text-brand-secondary group-hover:underline flex items-center gap-1"
                >
                  Buka Detail &rarr;
                </Link>
              </div>
            </div>

            {/* Card 3 - Sertifikasi Kompetensi */}
            <div className="bg-white border border-slate-200/90 hover:border-brand-accent/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(59,130,246,0.12)] rounded-3xl p-7 transition-all group flex flex-col justify-between h-96 hover:-translate-y-1.5">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100/80 rounded-2xl flex items-center justify-center text-brand-accent">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-accent transition-colors">
                  Sertifikasi Kompetensi
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Dapatkan validasi keahlianmu lewat beragam sertifikasi nasional dan internasional untuk pengakuan karir profesional dengan nomor registrasi UTDI resmi.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold font-mono">
                  03 &mdash; Bukti Kompetensi
                </span>
                <Link
                  href="/verify"
                  className="text-xs font-bold text-brand-accent group-hover:underline flex items-center gap-1"
                >
                  Verifikasi &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 5. MODUL PEMBELAJARAN (DATA STORE REAL) ==================== */}
        <section className="py-20 border-t border-slate-200/80 px-6 lg:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 tracking-wider uppercase mb-3 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Kurikulum Cohort Aktif
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Modul Kompetensi Terstruktur
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-md">
              Materi disusun bertahap mulai dari fondasi fundamental hingga pembuatan capstone project skala industri siap uji.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice(0, 3).map((c, idx) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-brand-primary/40 shadow-sm hover:shadow-md transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-brand-primary border border-slate-200 uppercase font-mono">
                    {c.level}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Modul 0{idx + 1}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {c.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {c.syllabus?.length || 4} Sesi &bull; {c.duration}
                  </span>
                  <Link
                    href={`/courses/${c.id}`}
                    className="text-slate-900 hover:text-brand-primary font-bold flex items-center gap-1"
                  >
                    Pelajari <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. CALL TO ACTION SECTION (LAVENDER / PURPLE SOFT BLOOM)       */}
        {/* ============================================================== */}
        <section
          id="gabung"
          className="py-24 border-t border-slate-200/80 px-6 lg:px-16 max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[#ede9fe] via-[#f5f3ff] to-white border border-purple-200/90 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-xl">
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-brand-secondary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative max-w-xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Siap Memulai Perjalanan Bisnis Digital Anda?
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Mari bergabung di Business Development Club UTDI sekarang juga. Kembangkan kompetensi digital, perluas jaringan profesional, dan mulailah berinovasi.
              </p>
              <div className="flex justify-center flex-wrap gap-4 pt-2">
                <Link
                  href={portalHref}
                  className="px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                >
                  {user ? "Masuk ke Dasbor Saya" : "Daftar Anggota Sekarang"}
                </Link>
                <Link
                  href="/verify"
                  className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 rounded-full text-xs font-bold transition-all text-slate-800 shadow-sm"
                >
                  Pangkalan Sertifikat
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 7. FOOTER (CLEAN LIGHT THEME) ==================== */}
        <footer
          id="kontak"
          className="bg-slate-50 border-t border-slate-200 px-6 py-16 lg:px-16 relative z-10"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-slate-600 text-xs font-medium">
            {/* Kolom 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="BDC Logo"
                  width={44}
                  height={24}
                  className="h-7 w-auto object-contain"
                />
                <span className="font-extrabold text-lg text-slate-900">
                  BDC UTDI
                </span>
              </div>
              <p className="leading-relaxed text-slate-500">
                Wadah kolaborasi akademis, inkubator, dan sertifikasi untuk mencetak wirausaha tangguh di era digital.
              </p>
            </div>

            {/* Kolom 2 */}
            <div className="space-y-3">
              <h5 className="text-slate-900 font-bold text-sm">Tautan Cepat</h5>
              <ul className="space-y-2">
                <li>
                  <a href="#hero" className="hover:text-brand-primary transition-colors">
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#tentang" className="hover:text-brand-primary transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#pilar" className="hover:text-brand-primary transition-colors">
                    Program
                  </a>
                </li>
                <li>
                  <Link href="/verify" className="hover:text-brand-primary transition-colors">
                    Sertifikasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className="hover:text-brand-primary transition-colors"
                  >
                    Leaderboard XP
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3 */}
            <div className="space-y-3">
              <h5 className="text-slate-900 font-bold text-sm">Kontak Kami</h5>
              <p className="leading-relaxed text-slate-500">
                Universitas Teknologi Digital Indonesia (UTDI)
                <br />
                Jl. Raya Janti (Majapahit) No. 143, Karang Jambe, Bantul, D.I. Yogyakarta 55198
                <br />
                Email: bdc@utdi.ac.id
              </p>
            </div>

            {/* Kolom 4 */}
            <div className="space-y-3">
              <h5 className="text-slate-900 font-bold text-sm text-left">
                Media Sosial
              </h5>
              <div className="flex gap-3 justify-start">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-brand-primary flex items-center justify-center text-slate-700 transition-colors hover:text-brand-primary shadow-sm"
                >
                  IG
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-brand-primary flex items-center justify-center text-slate-700 transition-colors hover:text-brand-primary shadow-sm"
                >
                  YT
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-brand-primary flex items-center justify-center text-slate-700 transition-colors hover:text-brand-primary shadow-sm"
                >
                  LN
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-brand-primary flex items-center justify-center text-slate-700 transition-colors hover:text-brand-primary shadow-sm"
                >
                  GH
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-slate-200 mt-12 pt-8 text-center text-slate-400 text-[10px]">
            <p>&copy; 2026 Business Development Club (BDC) UTDI. Hak Cipta Dilindungi.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
