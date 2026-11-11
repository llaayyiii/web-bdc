"use client";

import React, { useState } from "react";
import {
  FileCode2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  UploadCloud,
  Check,
  RefreshCw,
} from "lucide-react";
import { Assignment, AssignmentSubmission } from "@/lib/types/database";
import { submitAssignmentAction } from "@/lib/actions/assignments";

interface StudentAssignmentListProps {
  assignments: Assignment[];
  userSubmissions: AssignmentSubmission[];
}

export function StudentAssignmentList({
  assignments,
  userSubmissions,
}: StudentAssignmentListProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const getSubmission = (assignmentId: string) => {
    return userSubmissions.find((s) => s.assignment_id === assignmentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionUrl.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await submitAssignmentAction(
        selectedAssignment.id,
        submissionUrl.trim(),
        notes.trim()
      );
      setResult({
        success: res.success,
        message: res.message,
      });

      if (res.success) {
        setTimeout(() => {
          setSelectedAssignment(null);
          setSubmissionUrl("");
          setNotes("");
          setResult(null);
        }, 1500);
      }
    } catch {
      setResult({
        success: false,
        message: "Terjadi kesalahan jaringan saat mengirim tugas.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((item) => {
          const sub = getSubmission(item.id);
          const isGraded = sub?.status === "graded";
          const isPending = sub?.status === "pending";

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-bdc-navy bg-slate-100 px-2 py-0.5 rounded">
                    {item.course_title.split(":")[0]}
                  </span>

                  {isGraded ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Dinilai: {sub?.score}/100
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      <Clock className="w-3 h-3" />
                      Menunggu Penilaian
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      Belum Dikumpulkan
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-bdc-midnight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Batas: {item.deadline}
                  </span>
                  <span className="font-bold text-bdc-navy">Maks: {item.max_score} Pts</span>
                </div>

                {/* Feedback Box if Graded */}
                {isGraded && sub?.feedback && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Catatan Evaluator:
                    </span>
                    <p className="italic">{sub.feedback}</p>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {sub ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={sub.submission_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-bdc-blue hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Lihat Berkas</span>
                    </a>
                  </div>
                ) : (
                  <span className="text-[11px] text-amber-700 font-medium">
                    Kumpulkan sebelum deadline
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAssignment(item);
                    setSubmissionUrl(sub?.submission_url || "");
                    setNotes(sub?.notes || "");
                  }}
                  className="px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-bdc-yellow" />
                  <span>{sub ? "Perbarui Kiriman" : "Kumpulkan Tugas"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-bdc-midnight/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-bdc-blue tracking-wider block">
                  Formulir Pengumpulan Tugas
                </span>
                <h3 className="text-base font-bold text-bdc-midnight">
                  {selectedAssignment.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tautan Repositori GitHub / Dokumen Google Drive
                </label>
                <input
                  type="url"
                  required
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://github.com/... atau https://drive.google.com/..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Pastikan tautan Google Drive disetel &quot;Anyone with the link can view&quot; atau repo GitHub bersifat publik.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Teknis &amp; Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jelaskan ringkasan fitur yang diselesaikan atau petunjuk pengujian..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue"
                />
              </div>

              {result && (
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                    result.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {result.success ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>{result.message}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
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
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-bdc-yellow" />
                      <span>Kirim Tugas (+150 XP)</span>
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
