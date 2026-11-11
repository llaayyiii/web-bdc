import React from "react";
import { FileQuestion, CheckCircle2 } from "lucide-react";
import { SEED_QUESTIONS } from "@/lib/data/store";
import { BdcDots } from "@/components/ui/BdcDots";

export default function AdminAssessmentsPage() {
  return (
    <div className="space-y-8 font-sans">
      {/* Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 06 // BANK SOAL &amp; KUNCI JAWABAN TERENKRIPSI ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Bank Soal Evaluasi
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Daftar 10 butir soal evaluasi akhir keamanan siber, bobot penilaian akademik, dan kunci jawaban terenkripsi resmi BDC UTDI.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {SEED_QUESTIONS.map((q) => (
          <div
            key={q.id}
            className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 shadow-retro space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-bdc-midnight uppercase tracking-wider bg-[#EFF0F0] px-3 py-1 rounded-xl border border-slate-300">
                  Butir Soal #{q.order_index}
                </span>
                <BdcDots size="sm" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-500">
                Bobot: {q.weight.toFixed(1)} Poin
              </span>
            </div>

            <p className="font-space text-sm sm:text-base font-bold text-bdc-midnight leading-relaxed">
              {q.question_text}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {q.options.map((opt) => {
                const isCorrect = q.correct_option === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between shadow-retro-sm transition-all ${
                      isCorrect
                        ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold"
                        : "bg-[#EFF0F0] border-slate-300 text-slate-700"
                    }`}
                  >
                    <span className="font-sans">
                      <strong className="mr-2 font-mono text-bdc-midnight text-xs">{opt.id}.</strong>
                      {opt.text}
                    </span>
                    {isCorrect && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-xl flex items-center gap-1 border border-emerald-400 shrink-0 ml-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Kunci Jawaban</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
