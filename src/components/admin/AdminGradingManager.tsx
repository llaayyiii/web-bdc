"use client";

import React, { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit3,
  Award,
  RefreshCw,
  Search,
} from "lucide-react";
import { AssignmentSubmission } from "@/lib/types/database";
import { adminGradeAssignmentAction } from "@/lib/actions/assignments";

interface AdminGradingManagerProps {
  initialSubmissions: AssignmentSubmission[];
}

export function AdminGradingManager({ initialSubmissions }: AdminGradingManagerProps) {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(initialSubmissions);
  const [selectedSub, setSelectedSub] = useState<AssignmentSubmission | null>(null);
  const [score, setScore] = useState<number>(85);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "graded">("all");

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.user_name.toLowerCase().includes(search.toLowerCase()) ||
      s.nim_id.includes(search) ||
      s.submission_url.toLowerCase().includes(search.toLowerCase());

    if (filter === "pending") return matchesSearch && s.status === "pending";
    if (filter === "graded") return matchesSearch && s.status === "graded";
    return matchesSearch;
  });

  const handleOpenGradeModal = (sub: AssignmentSubmission) => {
    setSelectedSub(sub);
    setScore(sub.score || 85);
    setFeedback(
      sub.feedback ||
        "Implementasi arsitektur rapi, validasi input berjalan baik, dan dokumentasi lengkap."
    );
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setIsSubmitting(true);
    try {
      const res = await adminGradeAssignmentAction(selectedSub.id, score, feedback);
      if (res.success) {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === selectedSub.id
              ? { ...s, score, feedback, status: "graded" }
              : s
          )
        );
        setSelectedSub(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama mahasiswa atau NIM..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-bdc-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-bdc-navy text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "pending"
                ? "bg-bdc-navy text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Menunggu ({submissions.filter((s) => s.status === "pending").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("graded")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "graded"
                ? "bg-bdc-navy text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Dinilai ({submissions.filter((s) => s.status === "graded").length})
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mahasiswa</th>
                <th className="py-3 px-4">Tautan Berkas</th>
                <th className="py-3 px-4">Waktu Kirim</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Nilai</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada pengumpulan tugas yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const date = new Date(sub.submitted_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-bdc-navy text-white font-bold flex items-center justify-center text-xs">
                            {sub.user_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-bdc-midnight">{sub.user_name}</p>
                            <p className="text-[10px] font-mono text-slate-400">
                              NIM: {sub.nim_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <a
                          href={sub.submission_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-bdc-blue hover:underline max-w-[200px] truncate font-mono text-[11px]"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.submission_url}</span>
                        </a>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        {date} WIB
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {sub.status === "graded" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Selesai Dinilai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" />
                            Perlu Penilaian
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        {sub.score !== null ? (
                          <span className="text-bdc-navy text-sm">{sub.score} / 100</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenGradeModal(sub)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-bdc-yellow" />
                          <span>{sub.status === "graded" ? "Ubah Nilai" : "Beri Nilai"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-bdc-midnight/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-bdc-blue tracking-wider block">
                  Evaluasi &amp; Penilaian Tugas Mahasiswa
                </span>
                <h3 className="text-base font-bold text-bdc-midnight">
                  {selectedSub.user_name} ({selectedSub.nim_id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Tautan Hasil Proyek:
                </span>
                <a
                  href={selectedSub.submission_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bdc-blue hover:underline font-mono break-all inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>{selectedSub.submission_url}</span>
                </a>
                {selectedSub.notes && (
                  <p className="mt-2 text-slate-600 italic">
                    &quot;{selectedSub.notes}&quot;
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nilai Angka (Skala 0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Umpan Balik &amp; Catatan Instruktur
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-bdc-yellow" />
                      <span>Simpan &amp; Perbarui Kelulusan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
