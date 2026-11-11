import React from "react";
import { FileQuestion, CheckCircle2 } from "lucide-react";
import { SEED_QUESTIONS } from "@/lib/data/store";

export default function AdminAssessmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Bank Soal Uji Kompetensi
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Daftar 10 butir soal evaluasi akhir keamanan siber dan kunci jawaban resmi terenkripsi
        </p>
      </div>

      <div className="space-y-4">
        {SEED_QUESTIONS.map((q) => (
          <div
            key={q.id}
            className="bg-[#141d33] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-bdc-yellow uppercase tracking-wider">
                Butir Soal #{q.order_index}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Bobot: {q.weight.toFixed(1)} Poin
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
              {q.question_text}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {q.options.map((opt) => {
                const isCorrect = q.correct_option === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      isCorrect
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold"
                        : "bg-[#0f172a] border-slate-800 text-slate-300"
                    }`}
                  >
                    <span>
                      <strong className="mr-2 text-bdc-yellow">{opt.id}.</strong>
                      {opt.text}
                    </span>
                    {isCorrect && (
                      <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
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
