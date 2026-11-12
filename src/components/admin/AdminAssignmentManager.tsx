"use client";

import React, { useState } from "react";
import {
  FilePlus2,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FolderGit2,
} from "lucide-react";
import { Assignment, AssignmentSubmission } from "@/lib/types/database";
import {
  adminCreateAssignmentAction,
  adminDeleteAssignmentAction,
} from "@/lib/actions/assignments";
import { BdcDots } from "@/components/ui/BdcDots";

interface AdminAssignmentManagerProps {
  initialAssignments: Assignment[];
  initialSubmissions: AssignmentSubmission[];
}

export function AdminAssignmentManager({
  initialAssignments,
  initialSubmissions,
}: AdminAssignmentManagerProps) {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [materialUrl, setMaterialUrl] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCourseTitle("");
    setDeadline("");
    setMaxScore(100);
    setMaterialUrl("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await adminCreateAssignmentAction({
        course_id: "GENERAL",
        course_title: courseTitle.trim() || "Tugas Umum BDC",
        title: title.trim(),
        description: description.trim(),
        deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
        max_score: maxScore,
        submission_format: "github_or_drive",
        material_url: materialUrl.trim() || null,
      });

      setResult({ success: res.success, message: res.message });
      if (res.success && res.assignment) {
        setAssignments((prev) => [res.assignment!, ...prev]);
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setResult({ success: false, message: "Terjadi kesalahan jaringan saat menerbitkan tugas." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (assignment: Assignment) => {
    if (!deletingId) {
      setDeletingId(assignment.id);
      return;
    }
    if (deletingId !== assignment.id) {
      setDeletingId(assignment.id);
      return;
    }

    try {
      const res = await adminDeleteAssignmentAction(assignment.id);
      if (res.success) {
        setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const submissionCount = (assignmentId: string) =>
    initialSubmissions.filter((s) => s.assignment_id === assignmentId).length;

  return (
    <div className="space-y-6 font-sans">
      {/* Form Penerbitan Tugas */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#d9dfd7]">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-bdc-blue tracking-wider block">
              [ PENERBITAN TUGAS &amp; ESSAY ]
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                Terbitkan Tugas Baru untuk Mahasiswa
              </h3>
              <BdcDots size="sm" />
            </div>
          </div>
          <FilePlus2 className="w-6 h-6 text-bdc-yellow shrink-0 hidden sm:block" />
        </div>

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-space font-bold text-slate-800 mb-1">
                Judul Tugas
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Essay Refleksi — Etika Digital dalam Bisnis"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm font-space font-bold text-sm bg-white"
              />
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">
                Modul / Kelas (Opsional)
              </label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Contoh: Bisnis Digital"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm text-xs bg-white"
              />
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">
                Tenggat Pengumpulan
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm text-xs bg-white"
              />
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">
                Nilai Maksimum
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm font-pixel text-lg bg-white"
              />
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">
                Tautan Google Drive Soal / Materi (Opsional)
              </label>
              <input
                type="url"
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm font-mono text-xs bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                Mahasiswa klik tautan ini untuk membuka soal essay, lalu mengumpulkan jawaban lewat
                formulir pengumpulan.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-space font-bold text-slate-800 mb-1">
                Deskripsi &amp; Instruksi Pengerjaan
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan instruksi pengerjaan, format jawaban, dan kriteria penilaian..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm text-xs bg-white"
              />
            </div>
          </div>

          {result && (
            <div
              className={`p-3.5 rounded-2xl border-2 text-xs font-bold flex items-center gap-2 shadow-retro-sm ${
                result.success
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="retro-btn px-5 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-retro-sm border border-bdc-midnight text-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-bdc-yellow" />
                  <span>Menerbitkan...</span>
                </>
              ) : (
                <>
                  <FilePlus2 className="w-4 h-4 text-bdc-yellow" />
                  <span>Terbitkan Tugas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Tugas Terbit */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro overflow-hidden">
        <div className="px-6 py-4 bg-[#f4f3ea] border-b border-[#d9dfd7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-bdc-blue" />
            <h3 className="font-space text-sm font-bold text-bdc-midnight">
              Tugas Terbit ({assignments.length})
            </h3>
          </div>
          <BdcDots size="sm" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold border-b border-[#d9dfd7]">
              <tr>
                <th className="py-3 px-4">Tugas</th>
                <th className="py-3 px-4">Tenggat</th>
                <th className="py-3 px-4 text-center">Soal / Materi</th>
                <th className="py-3 px-4 text-center">Kiriman</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9dfd7]">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-mono">
                    Belum ada tugas terbit. Mulai dengan mengisi formulir di atas.
                  </td>
                </tr>
              ) : (
                assignments.map((a) => {
                  const date = new Date(a.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <tr key={a.id} className="hover:bg-[#fff8e6] transition-colors">
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <p className="font-space font-bold text-sm text-bdc-midnight truncate">
                          {a.title}
                        </p>
                        <p className="font-mono text-[10px] text-slate-500 truncate">
                          {a.course_title} — Maks {a.max_score} Pts
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {date} WIB
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {a.material_url ? (
                          <a
                            href={a.material_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-bdc-blue hover:text-bdc-navy hover:underline font-mono text-[11px] max-w-[160px]"
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Buka Drive</span>
                          </a>
                        ) : (
                          <span className="font-mono text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-pixel text-base text-bdc-midnight font-bold">
                          {submissionCount(a.id)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(a)}
                          className={`retro-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-retro-sm border ${
                            deletingId === a.id
                              ? "bg-red-600 text-white border-red-700"
                              : "bg-[#fffefa] text-red-600 border-red-300 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{deletingId === a.id ? "Klik lagi untuk hapus" : "Hapus"}</span>
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
    </div>
  );
}
