import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { hydrateFromDb } from "@/lib/data/db";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  FileQuestion,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default async function AssessmentsPage() {
  await hydrateFromDb();
  const user = await getCurrentUser();
  const quiz = bdcStore.getQuiz("quiz-bdc-eval-2026");
  const attempts = user ? bdcStore.getAttempts(user.id) : [];

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 05 // EVALUASI AKADEMIK MANDIRI ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Ujian Kompetensi
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Uji pemahaman silabus mandiri dengan penilaian otomatis berstandar akademik UTDI untuk membuka syarat penerbitan sertifikat resmi.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Quiz Card */}
      {quiz ? (
        <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-bdc-midnight text-bdc-yellow border border-bdc-midnight shadow-retro-sm">
                  UJIAN UTAMA COHORT
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-300">
                  Terbuka untuk Mahasiswa Aktif
                </span>
              </div>

              <h2 className="font-space text-xl sm:text-2xl font-bold text-bdc-midnight tracking-tight leading-snug">
                {quiz.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {quiz.description}
              </p>

              {/* 4 Inset Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-[inset_0_3px_0_#095BAF]">
                  <span className="font-mono text-[10px] font-bold text-slate-500 block uppercase">
                    Durasi Waktu
                  </span>
                  <span className="font-pixel text-lg text-bdc-midnight flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-bdc-blue" />
                    <span>{quiz.time_limit_minutes} Menit</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-[inset_0_3px_0_#E9AD17]">
                  <span className="font-mono text-[10px] font-bold text-slate-500 block uppercase">
                    Jumlah Soal
                  </span>
                  <span className="font-pixel text-lg text-bdc-midnight flex items-center gap-1.5 mt-0.5">
                    <FileQuestion className="w-4 h-4 text-bdc-blue" />
                    <span>{quiz.total_questions} Soal</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-[inset_0_3px_0_#34A853]">
                  <span className="font-mono text-[10px] font-bold text-slate-500 block uppercase">
                    Passing Grade
                  </span>
                  <span className="font-pixel text-lg text-emerald-700 flex items-center gap-1.5 mt-0.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Min. {quiz.passing_score}</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-[inset_0_3px_0_#EA4335]">
                  <span className="font-mono text-[10px] font-bold text-slate-500 block uppercase">
                    Percobaan
                  </span>
                  <span className="font-pixel text-lg text-bdc-midnight block mt-0.5">
                    {attempts.length > 0 ? `${attempts.length}x Dikerjakan` : "Belum Coba"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex flex-col gap-3 shrink-0 lg:w-60">
              <Link
                href={`/assessments/${quiz.id}`}
                className="retro-btn w-full py-3.5 px-5 rounded-2xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro flex items-center justify-center gap-2 border-2 border-bdc-midnight"
              >
                <Play className="w-4 h-4 text-bdc-yellow fill-bdc-yellow" />
                <span>{attempts.length > 0 ? "Ulangi Pengerjaan" : "Mulai Ujian Sekarang"}</span>
              </Link>
              <p className="font-mono text-[10px] text-center text-slate-500 leading-tight">
                Timer otomatis berjalan saat halaman dibuka.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EFF0F0] border border-slate-300 flex items-center justify-center text-slate-400 shadow-retro-sm">
            <FileQuestion className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-space text-lg sm:text-xl font-bold text-bdc-midnight">
              Belum Ada Ujian Evaluasi Aktif
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Bank butir soal evaluasi saat ini telah dibersihkan. Instruktur atau kurator akademik BDC UTDI belum menjadwalkan sesi ujian evaluasi kompetensi baru.
            </p>
          </div>
        </div>
      )}

      {/* 3. Attempt History Section (dash-table style) */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
          <div className="flex items-center gap-2">
            <h3 className="font-space text-base font-bold text-bdc-midnight">Riwayat Hasil Pengerjaan</h3>
            <BdcDots size="sm" />
          </div>
          <span className="font-mono text-xs text-slate-500">{attempts.length} Catatan Evaluasi</span>
        </div>

        {attempts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#EFF0F0] border border-slate-300 text-center text-slate-500 font-sans shadow-retro-sm">
            <p className="text-xs">
              Belum ada riwayat pengerjaan ujian. Klik tombol &quot;Mulai Ujian Sekarang&quot; di atas untuk menguji kompetensi Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold border-b border-[#d9dfd7]">
                <tr>
                  <th className="px-4 py-3">Waktu Selesai</th>
                  <th className="px-4 py-3">Skor Perolehan</th>
                  <th className="px-4 py-3">Status Evaluasi</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9dfd7]">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-[#fff8e6] transition-colors">
                    <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                      {new Date(att.completed_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-bdc-midnight">
                      <span className="font-pixel text-xl">{att.score}</span>{" "}
                      <span className="font-mono text-xs text-slate-400">/ 100</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold border shadow-retro-sm ${
                          att.passed
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}
                      >
                        {att.passed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Kompeten (Lulus)</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Perlu Remedial</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {quiz ? (
                        <Link
                          href={`/assessments/${quiz.id}`}
                          className="retro-btn text-xs font-mono font-bold text-bdc-blue hover:text-bdc-midnight inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white shadow-retro-sm"
                        >
                          <span>Coba Lagi</span>
                          <RotateCcw className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-xs font-mono text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
