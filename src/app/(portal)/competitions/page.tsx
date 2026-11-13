import { hydrateFromDb } from "@/lib/data/db";
import { bdcStore, deriveCompetitionStatus } from "@/lib/data/store";
import { BdcDots } from "@/components/ui/BdcDots";
import { Competition } from "@/lib/types/database";
import {
  Trophy,
  ExternalLink,
  FileDown,
  CalendarDays,
  Megaphone,
} from "lucide-react";

function guidebookUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${base}/storage/v1/object/public/guidebooks/${encodeURIComponent(path)}`;
}

function CompetitionCard({ competition }: { competition: Competition }) {
  const expired = deriveCompetitionStatus(competition) === "expired";
  const deadlineText = competition.expires_at
    ? new Date(competition.expires_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    : null;

  return (
    <div
      className={`retro-card rounded-2xl overflow-hidden flex flex-col group ${
        expired ? "opacity-70" : ""
      }`}
    >
      {/* Gambar preview lomba */}
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
        {/* Status & batas waktu */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wide border ${
              expired
                ? "bg-slate-100 border-slate-300 text-slate-500"
                : "bg-emerald-50 border-emerald-300 text-emerald-700"
            }`}
          >
            {expired ? "Kadaluarsa" : "Masih Dibuka"}
          </span>
          {deadlineText && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">{deadlineText}</span>
            </span>
          )}
        </div>

        <h2 className="font-space text-base font-bold text-bdc-midnight group-hover:text-bdc-blue transition-colors leading-snug">
          {competition.title}
        </h2>
        {competition.description && (
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans flex-1">
            {competition.description}
          </p>
        )}

        {/* Aksi */}
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

export default async function CompetitionsPage() {
  await hydrateFromDb();

  const all = bdcStore.getCompetitions();
  const ongoing = all.filter((c) => deriveCompetitionStatus(c) === "ongoing");
  const expired = all.filter((c) => deriveCompetitionStatus(c) === "expired");

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Page Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 05 // INFO LOMBA &amp; EVENT KOMUNITAS ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Info Lomba &amp; Event
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Kurasi lomba, kompetisi, dan event pilihan Business Dev Club UTDI — lengkap dengan
              tautan resmi, batas waktu pendaftaran, dan guidebook yang bisa diunduh.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Lomba aktif */}
      {ongoing.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-bdc-blue" />
            <h2 className="font-space text-sm font-bold text-bdc-midnight uppercase tracking-wide">
              Masih Dibuka ({ongoing.length})
            </h2>
            <div className="flex-1 h-px bg-[#d9dfd7]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {ongoing.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Lomba kadaluarsa */}
      {expired.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <h2 className="font-space text-sm font-bold text-slate-500 uppercase tracking-wide">
              Kadaluarsa / Ditutup ({expired.length})
            </h2>
            <div className="flex-1 h-px bg-[#d9dfd7]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {expired.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Empty state */}
      {all.length === 0 && (
        <div className="bg-[#fffefa] rounded-2xl border border-slate-300 p-12 text-center shadow-retro-sm">
          <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-space text-base font-bold text-bdc-midnight">
            Belum ada info lomba
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Admin BDC sedang mengkurasi lomba &amp; event terbaru. Silakan cek kembali nanti.
          </p>
        </div>
      )}
    </div>
  );
}
