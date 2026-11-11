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
import { BdcDots } from "@/components/ui/BdcDots";

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
    <div className="space-y-6 font-sans">
      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((item) => {
          const sub = getSubmission(item.id);
          const isGraded = sub?.status === "graded";
          const isPending = sub?.status === "pending";

          return (
            <div
              key={item.id}
              className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 shadow-retro flex flex-col justify-between hover:shadow-retro-lg transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-bdc-midnight bg-[#EFF0F0] px-2.5 py-1 rounded-xl border border-slate-300">
                    {item.course_title.split(":")[0]}
                  </span>

                  {isGraded ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-retro-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Dinilai: {sub?.score}/100
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-retro-sm">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Menunggu Penilaian
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-[#EFF0F0] text-slate-600 border border-slate-300">
                      Belum Dikumpulkan
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2 font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-[#d9dfd7]">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Batas: {item.deadline}
                  </span>
                  <span className="font-mono font-bold text-bdc-blue text-xs">Maks: {item.max_score} Pts</span>
                </div>

                {/* Feedback Box if Graded */}
                {isGraded && sub?.feedback && (
                  <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 text-xs text-slate-700 shadow-retro-sm">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                      Catatan Evaluator:
                    </span>
                    <p className="italic font-sans">&quot;{sub.feedback}&quot;</p>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-5 pt-4 border-t border-[#d9dfd7] flex items-center justify-between gap-2">
                {sub ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={sub.submission_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="retro-btn inline-flex items-center gap-1.5 text-xs font-mono font-bold text-bdc-blue hover:text-bdc-navy border border-bdc-blue/30 px-2.5 py-1 rounded-xl bg-blue-50/50 shadow-retro-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Lihat Berkas</span>
                    </a>
                  </div>
                ) : (
                  <span className="font-mono text-[11px] text-amber-700 font-semibold">
                    Kumpulkan sebelum tenggat
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAssignment(item);
                    setSubmissionUrl(sub?.submission_url || "");
                    setNotes(sub?.notes || "");
                  }}
                  className="retro-btn px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm flex items-center gap-1.5"
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
        <div className="fixed inset-0 bg-[#000741]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fffefa] rounded-3xl border-2 border-bdc-midnight shadow-retro-lg w-full max-w-lg p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-bdc-blue tracking-wider block">
                  [ FORMULIR PENGUMPULAN TUGAS ]
                </span>
                <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                  {selectedAssignment.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="text-slate-400 hover:text-bdc-midnight font-bold text-sm px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-space font-bold text-slate-800 mb-1">
                  Tautan Repositori GitHub / Dokumen Google Drive
                </label>
                <input
                  type="url"
                  required
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://github.com/... atau https://drive.google.com/..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm font-mono text-xs bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  Pastikan tautan Google Drive disetel publik atau repo GitHub berstatus public.
                </span>
              </div>

              <div>
                <label className="block font-space font-bold text-slate-800 mb-1">
                  Catatan Teknis &amp; Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jelaskan ringkasan arsitektur atau fitur yang sudah berhasil diuji..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm text-xs bg-white"
                />
              </div>

              {result && (
                <div
                  className={`p-3.5 rounded-2xl border-2 text-xs font-bold flex items-center gap-2 shadow-retro-sm ${
                    result.success
                      ? "bg-[#fffefa] border-emerald-600 text-emerald-950"
                      : "bg-[#fffefa] border-rose-600 text-rose-950"
                  }`}
                >
                  {result.success ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{result.message}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[#d9dfd7]">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="retro-btn px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-all shadow-retro-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="retro-btn px-5 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-retro-sm"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-bdc-yellow" />
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
