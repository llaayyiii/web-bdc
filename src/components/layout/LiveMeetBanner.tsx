"use client";

import React, { useState } from "react";
import { Video, ExternalLink, Clock, Copy, Check, Radio } from "lucide-react";
import { MeetSession } from "@/lib/types/database";
import { BdcDots } from "@/components/ui/BdcDots";

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
    <div className="relative overflow-hidden rounded-3xl bg-[#000741] text-white p-6 border-2 border-bdc-midnight shadow-retro mb-8 font-sans">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left Information */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse shadow-retro-sm">
                <Radio className="w-3.5 h-3.5" />
                Live Sesi Berlangsung
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-bdc-yellow/20 text-bdc-yellow border border-bdc-yellow/40 shadow-retro-sm">
                <Clock className="w-3.5 h-3.5" />
                Sesi Terjadwal
              </span>
            )}
            <span className="font-mono text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-xl border border-white/15">
              {session.course_title.split(":")[0]}
            </span>
            <BdcDots size="sm" />
          </div>

          <div>
            <h3 className="font-space text-base sm:text-xl font-bold tracking-tight text-white leading-snug">
              {session.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2 font-sans">
              <span>Instruktur: <strong className="text-bdc-yellow font-semibold">{session.instructor}</strong></span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-slate-400">Platform: Google Meet UTDI</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopyLink}
            type="button"
            className="retro-btn flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/20 text-xs font-mono font-bold transition-all shadow-retro-sm"
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
            className="retro-btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bdc-yellow hover:bg-amber-400 text-bdc-midnight font-bold text-xs shadow-retro-sm transition-all border border-bdc-midnight"
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
