import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import {
  FileQuestion,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export default async function AssessmentsPage() {
  const user = await getCurrentUser();
  const quiz = bdcStore.getQuiz("quiz-bdc-eval-2026");
  const attempts = user ? bdcStore.getAttempts(user.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-bdc-midnight tracking-tight">
          Evaluasi Kompetensi &amp; Ujian
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Uji pemahaman silabus mandiri dengan penilaian otomatis berstandar akademik UTDI
        </p>
      </div>

      {/* Primary Quiz Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-bdc-navy text-bdc-yellow uppercase tracking-wide">
                Ujian Utama Komunitas
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Terbuka untuk Mahasiswa Aktif
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-bdc-midnight tracking-tight leading-snug">
              {quiz.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {quiz.description}
            </p>

            {/* Constraints */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Durasi Waktu
                </span>
                <span className="text-sm font-bold text-bdc-midnight flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-bdc-blue" />
                  <span>{quiz.time_limit_minutes} Menit</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Jumlah Soal
                </span>
                <span className="text-sm font-bold text-bdc-midnight flex items-center gap-1 mt-0.5">
                  <FileQuestion className="w-3.5 h-3.5 text-bdc-blue" />
                  <span>{quiz.total_questions} Butir Soal</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Nilai Kelulusan
                </span>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Min. {quiz.passing_score}</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Percobaan
                </span>
                <span className="text-sm font-bold text-bdc-midnight block mt-0.5">
                  {attempts.length > 0 ? `${attempts.length}x Dikerjakan` : "Belum Dikerjakan"}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col gap-3 shrink-0 lg:w-56">
            <Link
              href={`/assessments/${quiz.id}`}
              className="w-full py-3 px-4 rounded-xl bg-bdc-blue hover:bg-bdc-navy active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-bdc-blue/20 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{attempts.length > 0 ? "Ulangi Pengerjaan" : "Mulai Ujian Sekarang"}</span>
            </Link>
            <p className="text-[10px] text-center text-slate-400 leading-tight">
              Timer otomatis berjalan saat halaman dibuka.
            </p>
          </div>
        </div>
      </div>

      {/* Attempt History Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <h3 className="text-sm font-bold text-bdc-midnight mb-3">Riwayat Hasil Pengerjaan</h3>

        {attempts.length === 0 ? (
          <div className="p-6 rounded-xl bg-bdc-surface text-center">
            <p className="text-xs text-slate-500">
              Belum ada riwayat pengerjaan ujian. Klik tombol &quot;Mulai Ujian Sekarang&quot; di atas untuk menguji kompetensi Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bdc-surface text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Waktu Selesai</th>
                  <th className="px-4 py-3">Skor Perolehan</th>
                  <th className="px-4 py-3">Status Evaluasi</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map((att, idx) => (
                  <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                      {new Date(att.completed_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 font-extrabold text-bdc-midnight">
                      <span className="text-sm">{att.score}</span> / 100
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          att.passed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {att.passed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Kompeten (Lulus)</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Perlu Remedial</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/assessments/${quiz.id}`}
                        className="text-xs font-bold text-bdc-blue hover:text-bdc-navy inline-flex items-center gap-1"
                      >
                        <span>Coba Lagi</span>
                        <RotateCcw className="w-3 h-3" />
                      </Link>
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
