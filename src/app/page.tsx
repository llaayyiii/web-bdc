import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { hydrateFromDb } from "@/lib/data/db";
import { Competition } from "@/lib/types/database";
import { BdcDots } from "@/components/ui/BdcDots";
import { SmartNavbar } from "@/components/layout/SmartNavbar";
import {
  ArrowRight,
  ShieldCheck,
  Trophy,
  QrCode,
  Award,
  Users,
  Zap,
  Monitor,
  GraduationCap,
  CalendarDays,
  ExternalLink,
  FileDown,
} from "lucide-react";

function guidebookUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${base}/storage/v1/object/public/guidebooks/${encodeURIComponent(path)}`;
}

function CompetitionCard({ competition }: { competition: Competition }) {
  const deadlineText = competition.expires_at
    ? new Date(competition.expires_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }) + " WIB"
    : null;

  return (
    <div className="bg-[#fffefa] rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#F7B500] overflow-hidden flex flex-col group">
      {competition.image_url ? (
        <div className="h-36 bg-slate-100 overflow-hidden border-b border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={competition.image_url}
            alt={competition.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-36 bg-bdc-navy flex items-center justify-center border-b border-bdc-midnight">
          <Trophy className="w-12 h-12 text-bdc-yellow" />
        </div>
      )}

      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wide border bg-emerald-50 border-emerald-300 text-emerald-700">
            Masih Dibuka
          </span>
          {deadlineText && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[150px]">{deadlineText}</span>
            </span>
          )}
        </div>

        <h3 className="font-space text-base font-bold text-bdc-midnight group-hover:text-bdc-blue transition-colors leading-snug">
          {competition.title}
        </h3>
        {competition.description && (
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1">
            {competition.description}
          </p>
        )}

        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <a
            href={competition.url}
            target="_blank"
            rel="noopener noreferrer"
            className="retro-btn px-3.5 py-1.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm flex items-center gap-1.5 font-space"
          >
            <span>Buka Lomba</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {competition.guidebook_path && (
            <a
              href={guidebookUrl(competition.guidebook_path)}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn px-3.5 py-1.5 rounded-xl bg-[#fffefa] text-bdc-midnight border border-bdc-midnight text-xs font-bold transition-all shadow-retro-sm flex items-center gap-1.5 font-space hover:bg-[#fff8e6]"
            >
              <FileDown className="w-3.5 h-3.5 text-bdc-blue" />
              <span>Guidebook</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  await hydrateFromDb();
  const user = await getCurrentUser();
  const liveSession = bdcStore.getLiveSession();
  const topLearners = bdcStore.getLeaderboard().slice(0, 3);
  const courses = bdcStore.getCourses();
  const learners = bdcStore.getProfiles().filter((p) => p.role === "learner");
  const activeCompetitions = bdcStore.getActiveCompetitions();
  const certificates = bdcStore.getCertificates();

  const portalHref = user
    ? user.role === "admin" || user.role === "instructor"
      ? "/admin"
      : "/dashboard"
    : "/login";
  const portalLabel = user ? "Buka Dasbor Mahasiswa" : "Masuk Portal";

  return (
    <div className="bdc-page-gradient min-h-screen text-bdc-midnight font-sans selection:bg-bdc-yellow selection:text-bdc-midnight overflow-x-hidden">
      {/* ==================== NAVIGATION BAR ==================== */}
      <SmartNavbar>
      <header className="bg-[#fffefa]/95 backdrop-blur-md border-b border-[#d9dfd7] px-6 py-3 lg:px-16 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="/logo.svg"
              alt="Logo BDC UTDI"
              width={54}
              height={30}
              className="h-9 w-auto object-contain transition-transform group-hover:-translate-y-0.5"
              priority
            />
            <div>
              <span className="font-space font-bold text-base text-bdc-midnight leading-none group-hover:text-bdc-blue transition-colors block">
                BDC UTDI
              </span>
              <span className="font-mono text-[8px] font-bold tracking-widest text-bdc-muted uppercase hidden md:block mt-1">
                Business Development Club
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 font-mono text-[11px] font-bold uppercase tracking-wider">
            <a href="#hero" className="text-bdc-muted hover:text-bdc-blue transition-colors">
              Beranda
            </a>
            <a href="#tentang" className="text-bdc-muted hover:text-bdc-blue transition-colors">
              Tentang
            </a>
            <a href="#pilar" className="text-bdc-muted hover:text-bdc-blue transition-colors">
              Program
            </a>
            <a href="#lomba" className="text-bdc-muted hover:text-bdc-blue transition-colors">
              Lomba
            </a>
            <Link href="/verify" className="text-bdc-muted hover:text-bdc-blue transition-colors">
              Sertifikasi
            </Link>
            <Link
              href="/leaderboard"
              className="text-bdc-muted hover:text-bdc-blue transition-colors"
            >
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={portalHref}
              className="hidden sm:inline-block font-mono text-[11px] font-bold uppercase tracking-wider text-bdc-muted hover:text-bdc-blue transition-colors"
            >
              {portalLabel}
            </Link>
            <Link
              href={portalHref}
              className="retro-btn px-4 py-2 rounded-xl bg-bdc-yellow hover:bg-amber-300 text-bdc-midnight text-xs font-black shadow-retro-sm"
            >
              {user ? "Ke Dasbor" : "Gabung Sekarang"}
            </Link>
          </div>
        </div>
      </header>
      </SmartNavbar>

      {/* ==================== STATUS TICKER ==================== */}
      <div className="mt-[61px] bg-bdc-midnight py-2 overflow-hidden relative z-10 font-mono text-[11px] text-slate-300">
        <div className="flex items-center whitespace-nowrap animate-marquee">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex items-center gap-8 mx-4"
              aria-hidden={copy === 1}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">STATUS SESI:</span>
                <span className="text-emerald-300">
                  {liveSession
                    ? `Presensi Barcode Aktif (${liveSession.qr_token})`
                    : "Presensi Siap Terbuka"}
                </span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="flex items-center gap-2 text-bdc-yellow">
                <Trophy className="w-3.5 h-3.5" />
                <span>
                  TOP XP:{" "}
                  {topLearners[0]
                    ? `${topLearners[0].full_name} (${topLearners[0].points} XP)`
                    : "Papan Skor Mahasiswa Aktif"}
                </span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="flex items-center gap-2 text-slate-300">
                <Award className="w-3.5 h-3.5 text-bdc-yellow" />
                <span>STANDAR AKREDITASI: Kampus UTDI Yogyakarta</span>
              </span>
              <span className="text-white/20">&bull;</span>
              <span className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>KREDENSIAL RESMI: Terkoneksi Pangkalan Verifikasi</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== HERO: DASH INTRO + PANEL PRATINJAU ==================== */}
      <section
        id="hero"
        className="relative scroll-mt-24 min-h-[calc(100svh-6rem)] flex items-center px-6 lg:px-16 py-8 lg:py-10 overflow-hidden"
      >
        {/* Latar hero bergambar dengan gradient penyeimbang */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-bdc-surface/90 via-bdc-surface/55 to-bdc-surface/20" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Kolom Kiri — Intro */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-bdc-blue">
                [ 00 // Pengembangan Bisnis BDC UTDI ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-bdc-midnight">
              Build.
              <br />
              Connect.
              <br />
              <span className="text-bdc-blue">Grow Your</span>
              <br />
              Business.
            </h1>

            <p className="font-space text-xl sm:text-2xl font-bold text-bdc-muted tracking-tight">
              Platform Pengembangan Bisnis BDC UTDI.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Business Development Club (BDC) UTDI membantu mahasiswa mengembangkan ide,
              memahami pasar, membangun jejaring, dan mengubah peluang menjadi usaha yang
              memiliki arah pertumbuhan yang jelas.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={portalHref}
                className="retro-btn px-6 py-3 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-black shadow-retro flex items-center gap-2"
              >
                <span>{portalLabel}</span>
                <ArrowRight className="w-4 h-4 text-bdc-yellow" />
              </Link>
              <Link
                href="/verify"
                className="retro-btn px-5 py-3 rounded-xl bg-[#fffefa] hover:bg-white text-bdc-midnight text-xs font-bold shadow-retro-sm flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-bdc-blue" />
                <span>Verifikasi Sertifikat</span>
              </Link>
            </div>

            {/* Bukti Sosial (Data Real) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[#d9dfd7]">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2" aria-hidden="true">
                  {["B", "D", "C"].map((letter, i) => (
                    <span
                      key={letter}
                      className={`w-9 h-9 rounded-lg border font-pixel font-bold text-xs flex items-center justify-center ${
                        i === 0
                          ? "bg-bdc-navy text-white border-bdc-midnight"
                          : i === 1
                          ? "bg-bdc-yellow text-bdc-midnight border-bdc-midnight"
                          : "bg-bdc-green text-white border-bdc-midnight"
                      }`}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <div className="font-mono text-[11px] leading-relaxed">
                  <span className="font-bold text-bdc-midnight block">
                    {learners.length} Anggota Terdaftar
                  </span>
                  <span className="text-slate-500">
                    {courses.length} Modul &bull; {certificates.length} Sertifikat Terbit
                  </span>
                </div>
              </div>

              <a
                href="#pilar"
                className="font-mono text-[11px] font-bold text-bdc-blue hover:text-bdc-navy flex items-center gap-1.5 group"
              >
                <span>Jelajahi Program BDC</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== BANNER SESI PRESENSI (bila aktif) ==================== */}
      {liveSession && (
        <div className="max-w-7xl mx-auto px-6 lg:px-16 pb-2">
          <div className="bg-[#fffefa] rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#34A853] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                  Sesi Presensi Aktif
                </span>
                <p className="font-space font-bold text-sm text-bdc-midnight mt-0.5 truncate">
                  Presensi barcode dibuka — token {liveSession.qr_token}
                </p>
              </div>
            </div>
            <Link
              href={portalHref}
              className="retro-btn px-4 py-2 rounded-xl bg-bdc-green hover:bg-emerald-500 text-white text-xs font-bold shadow-retro-sm flex items-center gap-2 shrink-0"
            >
              <span>Buka Presensi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* ==================== KARTU INFO LOMBA + METRIK (Inset Bar Berwarna) ==================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 pt-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kartu Info Lomba & Event — lebar sama dengan kartu Anggota & XP */}
          <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#F7B500] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Info Lomba &amp; Event
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 space-y-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-pixel text-3xl font-black text-bdc-midnight">
                  {activeCompetitions.length}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">Dibuka</span>
              </div>
              {activeCompetitions.length === 0 ? (
                <div className="p-4 rounded-xl bg-white border border-dashed border-slate-300 font-mono text-[11px] text-slate-500 text-center">
                  Belum ada lomba/event yang dibuka — nanti muncul di sini ya.
                </div>
              ) : (
                <ul className="space-y-2">
                  {activeCompetitions.slice(0, 2).map((c) => (
                    <li key={c.id}>
                      <a
                        href={c.url || portalHref}
                        target={c.url ? "_blank" : undefined}
                        rel={c.url ? "noopener noreferrer" : undefined}
                        className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#f4f3ea] border border-[#d9dfd7] hover:border-bdc-midnight hover:bg-[#fff8e6] transition-all group/item"
                      >
                        <span className="min-w-0">
                          <span className="block font-space font-bold text-xs text-bdc-midnight truncate group-hover/item:text-bdc-blue">
                            {c.title}
                          </span>
                          <span className="block font-mono text-[10px] text-slate-500 mt-0.5 truncate">
                            {c.expires_at
                              ? `Batas: ${new Date(c.expires_at).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "Asia/Jakarta",
                                })} WIB`
                              : "Terbuka tanpa batas waktu"}
                          </span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 group-hover/item:text-bdc-blue" />
                      </a>
                    </li>
                  ))}
                  {activeCompetitions.length > 2 && (
                    <li className="text-center font-mono text-[10px] font-bold text-bdc-blue">
                      +{activeCompetitions.length - 2} lomba &amp; event lainnya
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Metrik 2: Anggota Terdaftar */}
          <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#34A853] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Anggota Terdaftar
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-pixel text-3xl font-black text-bdc-midnight">
                  {learners.length}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700">Mahasiswa</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Cohort aktif Universitas UTDI
              </p>
            </div>
          </div>

          {/* Metrik 3: XP Teratas */}
          <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#EA4335] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                XP Teratas
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-50 text-bdc-red flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-pixel text-3xl font-black text-bdc-midnight">
                  {topLearners[0]?.points ?? 0}
                </span>
                <span className="font-mono text-xs font-bold text-bdc-gold">XP</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono truncate">
                {topLearners[0] ? `Diraih ${topLearners[0].full_name}` : "Papan skor menyusul"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TENTANG KAMI ==================== */}
      <section id="tentang" className="scroll-mt-24 max-w-7xl mx-auto px-6 lg:px-16 py-14">
        <div className="flex items-center gap-2 mb-7">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-bdc-blue">
            [ 01 // Tentang Kami ]
          </span>
          <BdcDots size="sm" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Kiri: Judul besar & testimoni */}
          <div className="space-y-6">
            <h2 className="font-pixel text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-bdc-midnight leading-[1.1]">
              Smart Solutions Designed to{" "}
              <span className="text-bdc-blue">Drive</span> Your Success.
            </h2>

            <div className="retro-card rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e6eddc] border border-[#c9d7bc] font-pixel font-bold text-bdc-midnight flex items-center justify-center shrink-0">
                R
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  &ldquo;Ruang belajar dan kolaborasi untuk memahami pasar, membangun strategi,
                  dan mengembangkan bisnis dengan lebih terarah.&rdquo;
                </p>
                <p className="font-mono text-[10px] font-bold text-bdc-blue mt-2">
                  Raden Wirantashena &bull; Anggota Business Development BDC UTDI
                </p>
              </div>
            </div>
          </div>

          {/* Kanan: Panel penjelasan */}
          <div className="space-y-5">
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Kami memberdayakan mahasiswa dengan program praktis untuk menemukan peluang pasar,
              menyusun strategi bisnis, memperkuat pemasaran, dan memperluas jejaring profesional.
            </p>

            <div className="bg-[#fffefa] rounded-2xl border border-[#d9dfd7] shadow-retro-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-[#f4f3ea] border-b border-[#d9dfd7] flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-bdc-midnight">
                  Mengapa BDC UTDI?
                </span>
                <BdcDots size="sm" />
              </div>

              <p className="px-5 py-4 text-xs text-slate-600 leading-relaxed border-b border-[#d9dfd7]">
                Mulai dari validasi ide, riset pasar, penyusunan model bisnis, hingga pengembangan
                strategi pemasaran dan penjualan, BDC UTDI menyediakan pembelajaran yang dirancang
                untuk membantu mahasiswa membangun usaha secara bertahap dan terukur.
              </p>

              <ul>
                {[
                  {
                    idx: "01",
                    title: "Real-time",
                    desc: "Kegiatan dan jejaring bisnis yang terarah",
                  },
                  {
                    idx: "02",
                    title: "Gamified",
                    desc: "Tantangan strategi & proyek pengembangan usaha",
                  },
                  {
                    idx: "03",
                    title: "Akreditasi",
                    desc: "Bukti kompetensi pengembangan bisnis",
                  },
                ].map((item) => (
                  <li
                    key={item.idx}
                    className="flex items-center gap-4 px-5 py-3.5 border-b border-[#d9dfd7] last:border-b-0 hover:bg-[#fff8e6] transition-colors"
                  >
                    <span className="font-pixel text-lg font-black text-bdc-blue w-8 shrink-0">
                      {item.idx}
                    </span>
                    <div className="min-w-0">
                      <span className="block font-space font-bold text-xs text-bdc-midnight">
                        {item.title}
                      </span>
                      <span className="block text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROGRAM UNGGULAN ==================== */}
      <section id="pilar" className="scroll-mt-24 border-t border-[#d9dfd7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14">
          <div className="flex justify-between items-start flex-wrap gap-6 mb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-bdc-blue">
                  [ 02 // Program Unggulan ]
                </span>
                <BdcDots size="sm" />
              </div>
              <h2 className="font-pixel text-3xl md:text-4xl font-black tracking-tight text-bdc-midnight leading-tight">
                Program Praktis untuk{" "}
                <span className="text-bdc-blue">Mengembangkan Bisnis Anda</span>
              </h2>
            </div>

            <div className="max-w-xs space-y-3">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Rangkaian program BDC membantu Anda memahami peluang, menguji ide, menyusun
                strategi, dan membangun relasi untuk pertumbuhan usaha.
              </p>
              <Link
                href={portalHref}
                className="retro-btn inline-flex items-center gap-2 px-4 py-2 bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold rounded-xl shadow-retro-sm"
              >
                <span>Lihat Semua Program</span>
                <ArrowRight className="w-3.5 h-3.5 text-bdc-yellow" />
              </Link>
            </div>
          </div>

          {/* 3 Kartu Program */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Kartu 1 — Inkubasi Bisnis */}
            <div className="bg-[#fffefa] border border-[#d9dfd7] hover:border-bdc-midnight shadow-retro-sm hover:shadow-retro rounded-2xl p-6 transition-all group flex flex-col hover:-translate-y-1">
              <div className="space-y-3.5">
                <div className="w-11 h-11 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-bdc-blue">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-space font-bold text-lg text-bdc-midnight group-hover:text-bdc-blue transition-colors">
                  Inkubasi Bisnis
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kami membimbing mahasiswa memvalidasi masalah, mengenali target pasar, menyusun
                  model bisnis, dan menguji solusi bersama mentor.
                </p>
              </div>
              <div className="pt-4 mt-auto border-t border-[#d9dfd7] flex justify-between items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400 font-bold">
                  01 &mdash; Rintisan Bisnis
                </span>
                <Link
                  href={portalHref}
                  className="font-mono text-[11px] font-bold text-bdc-blue group-hover:underline flex items-center gap-1"
                >
                  Buka Detail &rarr;
                </Link>
              </div>
            </div>

            {/* Kartu 2 — Strategi Bisnis & Pemasaran */}
            <div className="bg-[#fffefa] border border-[#d9dfd7] hover:border-bdc-midnight shadow-retro-sm hover:shadow-retro rounded-2xl p-6 transition-all group flex flex-col hover:-translate-y-1">
              <div className="space-y-3.5">
                <div className="w-11 h-11 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center text-bdc-navy">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="font-space font-bold text-lg text-bdc-midnight group-hover:text-bdc-blue transition-colors">
                  Strategi Bisnis &amp; Pemasaran
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pelajari riset pasar, penentuan posisi merek, pemasaran, penjualan, dan perencanaan
                  keuangan melalui sesi praktis bersama pelaku usaha dan mentor.
                </p>
              </div>
              <div className="pt-4 mt-auto border-t border-[#d9dfd7] flex justify-between items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400 font-bold">
                  02 &mdash; Pengembangan Skill
                </span>
                <Link
                  href={portalHref}
                  className="font-mono text-[11px] font-bold text-bdc-blue group-hover:underline flex items-center gap-1"
                  >
                  Buka Detail &rarr;
                </Link>
              </div>
            </div>

            {/* Kartu 3 — Jejaring & Sertifikasi */}
            <div className="bg-[#fffefa] border border-[#d9dfd7] hover:border-bdc-midnight shadow-retro-sm hover:shadow-retro rounded-2xl p-6 transition-all group flex flex-col hover:-translate-y-1">
              <div className="space-y-3.5">
                <div className="w-11 h-11 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-bdc-green">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-space font-bold text-lg text-bdc-midnight group-hover:text-bdc-blue transition-colors">
                  Jejaring &amp; Sertifikasi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bangun relasi dengan komunitas dan mitra, lalu dapatkan pengakuan kompetensi
                  melalui sertifikasi resmi BDC UTDI.
                </p>
              </div>
              <div className="pt-4 mt-auto border-t border-[#d9dfd7] flex justify-between items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400 font-bold">
                  03 &mdash; Bukti Kompetensi
                </span>
                <Link
                  href="/verify"
                  className="font-mono text-[11px] font-bold text-bdc-blue group-hover:underline flex items-center gap-1"
                >
                  Verifikasi &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== INFO LOMBA & EVENT (TAMPILAN LENGKAP) ==================== */}
      <section id="lomba" className="scroll-mt-24 border-t border-[#d9dfd7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-600">
                  [ 03 // Info Lomba &amp; Event ]
                </span>
                <BdcDots size="sm" />
              </div>
              <h2 className="font-pixel text-3xl font-black text-bdc-midnight tracking-tight">
                Info Lomba &amp; Event Terbaru
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <p className="text-xs text-slate-600 max-w-md md:text-right">
                Temukan lomba, kompetisi, dan event yang melatih strategi, kreativitas, pitching,
                serta kemampuan memecahkan masalah bisnis.
              </p>
              <Link
                href="/competitions"
                className="font-mono text-[11px] font-bold text-bdc-blue hover:text-bdc-navy flex items-center gap-1"
              >
                <span>Semua Info Lomba</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {activeCompetitions.length === 0 ? (
            <div className="p-12 text-center bg-[#fffefa] rounded-2xl border border-dashed border-slate-300">
              <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-space text-base font-bold text-bdc-midnight">
                Belum ada info lomba
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Admin BDC sedang mengkurasi lomba &amp; event terbaru. Silakan cek kembali nanti.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {activeCompetitions.map((c) => (
                <CompetitionCard key={c.id} competition={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== CALL TO ACTION ==================== */}
      <section id="gabung" className="scroll-mt-24 max-w-7xl mx-auto px-6 lg:px-16 pb-14">
        <div className="bg-[#fffefa] border border-[#d9dfd7] shadow-[inset_0_4px_0_#EEDD55] rounded-2xl px-6 py-12 md:py-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-bdc-yellow/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-bdc-blue/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative max-w-xl mx-auto space-y-5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-bdc-gold">
              [ 04 // Gabung Sekarang ]
            </span>
            <h2 className="font-pixel text-2xl md:text-4xl font-black tracking-tight text-bdc-midnight leading-tight">
              Siap Memulai Perjalanan Bisnis Anda?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Mari bergabung di Business Development Club UTDI. Temukan peluang, kembangkan ide
              bisnis, perluas jejaring, dan mulai membangun langkah usaha Anda.
            </p>
            <div className="flex justify-center flex-wrap gap-3 pt-1">
              <Link
                href={portalHref}
                className="retro-btn px-7 py-3 bg-bdc-navy hover:bg-bdc-midnight text-white rounded-xl text-xs font-black shadow-retro"
              >
                {user ? "Masuk ke Dasbor Saya" : "Daftar Anggota Sekarang"}
              </Link>
              <Link
                href="/verify"
                className="retro-btn px-6 py-3 bg-[#fffefa] hover:bg-white border-slate-300 rounded-xl text-xs font-bold text-bdc-midnight shadow-retro-sm flex items-center gap-2 mx-auto"
              >
                <Award className="w-4 h-4 text-bdc-gold" />
                <span>Pangkalan Sertifikat</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer
        id="kontak"
        className="bg-[#fffefa] border-t border-[#d9dfd7] px-6 py-14 lg:px-16 relative z-10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-slate-600 text-xs font-medium">
          {/* Kolom 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt="Logo BDC UTDI"
                width={44}
                height={24}
                className="h-7 w-auto object-contain"
              />
              <span className="font-space font-bold text-base text-bdc-midnight">BDC UTDI</span>
            </div>
            <p className="leading-relaxed text-slate-500">
              Wadah kolaborasi, pembelajaran, dan pengembangan usaha untuk membentuk mahasiswa
              yang siap menciptakan serta mengembangkan peluang bisnis.
            </p>
          </div>

          {/* Kolom 2 */}
          <div className="space-y-3">
            <h5 className="font-space font-bold text-sm text-bdc-midnight">Tautan Cepat</h5>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="hover:text-bdc-blue transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-bdc-blue transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#pilar" className="hover:text-bdc-blue transition-colors">
                  Program
                </a>
              </li>
              <li>
                <a href="#lomba" className="hover:text-bdc-blue transition-colors">
                  Info Lomba
                </a>
              </li>
              <li>
                <Link href="/verify" className="hover:text-bdc-blue transition-colors">
                  Sertifikasi
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-bdc-blue transition-colors">
                  Leaderboard XP
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3 */}
          <div className="space-y-3">
            <h5 className="font-space font-bold text-sm text-bdc-midnight">Kontak Kami</h5>
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
            <h5 className="font-space font-bold text-sm text-bdc-midnight">Media Sosial</h5>
            <div className="flex gap-2.5">
              {[
                { label: "IG", href: "https://instagram.com" },
                { label: "YT", href: "https://youtube.com" },
                { label: "LN", href: "https://linkedin.com" },
                { label: "GH", href: "https://github.com" },
              ].map((sos) => (
                <a
                  key={sos.label}
                  href={sos.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Media sosial ${sos.label}`}
                  className="w-9 h-9 rounded-xl bg-white border border-[#d9dfd7] hover:border-bdc-midnight hover:text-bdc-blue flex items-center justify-center font-mono text-[10px] font-bold text-slate-600 shadow-retro-sm transition-all hover:-translate-y-0.5"
                >
                  {sos.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[#d9dfd7] mt-10 pt-6 text-center">
          <p className="font-mono text-[10px] text-slate-400">
            &copy; 2026 Business Development Club (BDC) UTDI. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
