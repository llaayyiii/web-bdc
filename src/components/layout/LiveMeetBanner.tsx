"use client";

import React, { useState } from "react";
import { Video, ExternalLink, Clock, Copy, Check, Radio } from "lucide-react";
import { MeetSession } from "@/lib/types/database";

interface LiveMeetBannerProps {
  session: MeetSession | null;
}

export function LiveMeetBanner({ session }: LiveMeetBannerProps) {
  const [copied, setCopied] = useState(false);

  if (!session) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(session.meet_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLive = session.status === "live";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-bdc-midnight via-bdc-navy to-[#0b3b82] text-white p-5 border border-bdc-blue/40 shadow-xl mb-6">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-bdc-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-bdc-yellow/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Information */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                <Radio className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                Sesi Tatap Muka Berlangsung
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-bdc-yellow/20 text-bdc-yellow border border-bdc-yellow/30">
                <Clock className="w-3.5 h-3.5" />
                Sesi Mendatang
              </span>
            )}
            <span className="text-[11px] font-mono text-slate-300 bg-black/30 px-2 py-0.5 rounded border border-white/10">
              {session.course_title.split(":")[0]}
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-snug">
              {session.title}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
              <span>Instruktur: <strong className="text-bdc-yellow font-semibold">{session.instructor}</strong></span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-slate-400">Platform: Google Meet Kampus</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopyLink}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 text-xs font-semibold transition-all"
            title="Salin Tautan Google Meet"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-300" />
                <span className="hidden sm:inline">Salin Link</span>
              </>
            )}
          </button>

          <a
            href={session.meet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-bdc-gold to-bdc-yellow hover:from-amber-400 hover:to-yellow-300 text-bdc-midnight font-black text-xs shadow-lg shadow-bdc-gold/25 transition-all transform hover:-translate-y-0.5"
          >
            <Video className="w-4 h-4 text-bdc-midnight" />
            <span>Masuk Ruang Meet</span>
            <ExternalLink className="w-3.5 h-3.5 text-bdc-midnight/70" />
          </a>
        </div>
      </div>
    </div>
  );
}
