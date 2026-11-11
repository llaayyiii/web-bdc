import React from "react";
import Image from "next/image";
import { Certificate } from "@/lib/types/database";
import { CheckCircle2, ShieldCheck, Award } from "lucide-react";

interface TranscriptPageTwoProps {
  cert: Certificate;
  verifyUrl: string;
}

export function TranscriptPageTwo({ cert, verifyUrl }: TranscriptPageTwoProps) {
  return (
    <div className="relative w-full max-w-[840px] aspect-[1.414/1] bg-white border-[6px] border-slate-300 p-8 sm:p-10 shadow-2xl mx-auto flex flex-col justify-between text-bdc-midnight overflow-hidden select-none">
      {/* Header */}
      <div className="border-b-2 border-bdc-navy pb-3 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bdc-midnight p-2 flex items-center justify-center shadow-md border border-bdc-navy">
            <Image src="/logo.svg" alt="BDC Logo" width={24} height={24} className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-bdc-midnight uppercase tracking-wider">
              Transkrip Akademik &amp; Capstone Project
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">
              Business Dev Club — Universitas Teknologi Digital Indonesia (UTDI)
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">No. Transkrip:</span>
          <span className="text-xs font-mono font-bold text-bdc-blue">{cert.transcript_number}</span>
        </div>
      </div>

      {/* Student Meta Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 p-3 rounded-xl bg-bdc-surface border border-slate-200 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Nama Mahasiswa</span>
          <span className="font-extrabold text-bdc-midnight truncate block">{cert.recipient_name}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">NIM / ID Kampus</span>
          <span className="font-mono font-bold text-bdc-midnight block">{cert.nim_id}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Periode Akademik</span>
          <span className="font-bold text-bdc-midnight block">{cert.period}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Lokasi Penyelenggaraan</span>
          <span className="font-bold text-bdc-midnight block">{cert.location}</span>
        </div>
      </div>

      {/* Coursework Modules Table */}
      <div className="flex-1 my-1 overflow-hidden">
        <table className="w-full text-left text-xs border border-slate-200">
          <thead className="bg-bdc-midnight text-white text-[10px] uppercase font-bold">
            <tr>
              <th className="py-2 px-3 border border-slate-700 w-20">Kode</th>
              <th className="py-2 px-3 border border-slate-700">Materi &amp; Silabus Modul Kompetensi</th>
              <th className="py-2 px-2 border border-slate-700 text-center w-16">Jam</th>
              <th className="py-2 px-2 border border-slate-700 text-center w-16">Nilai</th>
              <th className="py-2 px-2 border border-slate-700 text-center w-14">Grade</th>
              <th className="py-2 px-3 border border-slate-700 w-32">Status Capaian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cert.modules_json.map((mod, i) => (
              <tr key={mod.code} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                <td className="py-1.5 px-3 font-mono font-bold text-[11px] text-bdc-blue border-r border-slate-200">
                  {mod.code}
                </td>
                <td className="py-1.5 px-3 font-medium text-slate-800 border-r border-slate-200">
                  {mod.title}
                </td>
                <td className="py-1.5 px-2 text-center text-slate-600 border-r border-slate-200">
                  {mod.hours.toFixed(1)}
                </td>
                <td className="py-1.5 px-2 text-center font-bold text-bdc-midnight border-r border-slate-200">
                  {mod.score.toFixed(1)}
                </td>
                <td className="py-1.5 px-2 text-center font-extrabold text-emerald-700 border-r border-slate-200">
                  {mod.grade}
                </td>
                <td className="py-1.5 px-3 text-[11px] font-semibold text-emerald-700">
                  {mod.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Capstone Project Section */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 my-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-bdc-blue flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>Capstone Project Mandiri:</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
            {cert.capstone_status}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div>
            <h4 className="font-bold text-bdc-midnight">{cert.capstone_title}</h4>
            <span className="text-[10px] text-slate-500">
              Bobot Jam: {cert.capstone_hours} Jam | Nilai Evaluasi: {cert.capstone_score} ({cert.capstone_grade})
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Rata-Rata Total</span>
            <span className="text-sm font-extrabold text-bdc-navy">
              {cert.avg_score.toFixed(2)} (A+)
            </span>
          </div>
        </div>
      </div>

      {/* Footer Signatures */}
      <div className="pt-3 border-t border-slate-200 grid grid-cols-3 items-end gap-4 text-center">
        <div className="space-y-1">
          <div className="text-[10px] text-slate-400">Yogyakarta, {cert.issue_date}</div>
          <div className="h-8 flex items-center justify-center font-serif italic font-bold text-slate-700">
            Bagas Triaji
          </div>
          <div className="border-t border-slate-400 pt-0.5">
            <div className="text-xs font-bold text-bdc-midnight">{cert.signatory_1_name}</div>
            <div className="text-[10px] text-slate-500">{cert.signatory_1_role} UTDI</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">
            Pangkalan Data Resmi BDC
          </div>
          <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Kredensial Terverifikasi</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-slate-400">Mengetahui,</div>
          <div className="h-8 flex items-center justify-center font-serif italic font-bold text-slate-700">
            Nurul Layli
          </div>
          <div className="border-t border-slate-400 pt-0.5">
            <div className="text-xs font-bold text-bdc-midnight">{cert.signatory_2_name}</div>
            <div className="text-[10px] text-slate-500">{cert.signatory_2_role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
