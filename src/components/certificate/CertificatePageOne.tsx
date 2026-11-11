import React from "react";
import Image from "next/image";
import { Certificate } from "@/lib/types/database";
import { Award, ShieldCheck } from "lucide-react";

interface CertificatePageOneProps {
  cert: Certificate;
  verifyUrl: string;
}

export function CertificatePageOne({ cert, verifyUrl }: CertificatePageOneProps) {
  return (
    <div className="relative w-full max-w-[840px] aspect-[1.414/1] bg-white border-[8px] border-double border-bdc-navy p-8 sm:p-12 shadow-2xl mx-auto flex flex-col justify-between text-bdc-midnight overflow-hidden select-none">
      {/* Guilloche Corner Accents */}
      <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-bdc-gold pointer-events-none" />
      <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-bdc-gold pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-bdc-gold pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-bdc-gold pointer-events-none" />

      {/* Subtle Background Seal Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Image src="/logo.svg" alt="Watermark" width={400} height={400} className="w-[400px] h-[400px]" />
      </div>

      {/* Certificate Header */}
      <div className="text-center space-y-2 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-bdc-midnight p-2 flex items-center justify-center shadow-md border border-bdc-navy">
            <Image src="/logo.svg" alt="BDC Logo" width={24} height={24} className="w-6 h-6 object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-bdc-navy">
              Business Dev Club (BDC)
            </h1>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
              Universitas Teknologi Digital Indonesia (UTDI) — Yogyakarta
            </p>
          </div>
        </div>

        <div className="inline-block py-0.5 px-4 rounded-full bg-bdc-surface border border-slate-300 text-[10px] font-mono font-bold text-bdc-blue tracking-widest uppercase">
          NO: {cert.certificate_number}
        </div>

        <div className="pt-2">
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-bdc-midnight uppercase font-serif">
            Sertifikat Kelulusan &amp; Kompetensi
          </h2>
          <p className="text-xs text-slate-500 font-medium italic mt-0.5">
            Diberikan sebagai bukti sah atas pencapaian akademik dan penyelesaian kurikulum:
          </p>
        </div>
      </div>

      {/* Recipient Area */}
      <div className="text-center my-3 relative z-10 space-y-1">
        <div className="text-xl sm:text-3xl font-extrabold text-bdc-navy tracking-tight underline decoration-bdc-gold decoration-2 underline-offset-8">
          {cert.recipient_name}
        </div>
        <p className="text-xs sm:text-sm font-bold text-slate-600 font-mono tracking-wider pt-2">
          NIM / ID: {cert.nim_id}
        </p>
      </div>

      {/* Program & Competency Description */}
      <div className="text-center max-w-xl mx-auto space-y-2 relative z-10">
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Telah menyelesaikan seluruh rangkaian pelatihan intensif, evaluasi kompetensi mandiri, serta
          Capstone Project resmi pada program:
        </p>
        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
          <h3 className="text-xs sm:text-sm font-extrabold text-bdc-navy uppercase">
            {cert.program_title}
          </h3>
          <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-600 mt-1">
            <span>{cert.cohort}</span>
            <span>•</span>
            <span>Durasi: {cert.total_hours} Jam Pelatihan</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Predikat: {cert.completion_status}</span>
          </div>
        </div>
      </div>

      {/* Signatories & Verification QR */}
      <div className="pt-4 border-t border-slate-200 grid grid-cols-3 items-end gap-4 relative z-10 text-center">
        {/* Signatory 1: Bagas Triaji */}
        <div className="space-y-1">
          <div className="h-10 flex items-center justify-center">
            <span className="font-serif italic text-base text-slate-700 font-bold">
              Bagas Triaji
            </span>
          </div>
          <div className="border-t border-slate-400 pt-1">
            <div className="text-xs font-bold text-bdc-midnight">{cert.signatory_1_name}</div>
            <div className="text-[10px] text-slate-500 font-medium">
              {cert.signatory_1_role} UTDI, {cert.location}
            </div>
          </div>
        </div>

        {/* Center: Official Seal & QR Code */}
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="w-14 h-14 rounded-full border-2 border-bdc-gold bg-amber-50/50 flex items-center justify-center p-1 shadow-inner">
            <Award className="w-7 h-7 text-bdc-gold" />
          </div>
          <span className="text-[9px] font-bold text-bdc-navy uppercase tracking-wider">
            Akreditasi BDC UTDI
          </span>
          <span className="text-[9px] text-slate-400 font-mono">
            {cert.period} | {cert.issue_date}
          </span>
        </div>

        {/* Signatory 2: Nurul Layli */}
        <div className="space-y-1">
          <div className="h-10 flex items-center justify-center">
            <span className="font-serif italic text-base text-slate-700 font-bold">
              Nurul Layli
            </span>
          </div>
          <div className="border-t border-slate-400 pt-1">
            <div className="text-xs font-bold text-bdc-midnight">{cert.signatory_2_name}</div>
            <div className="text-[10px] text-slate-500 font-medium">{cert.signatory_2_role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
