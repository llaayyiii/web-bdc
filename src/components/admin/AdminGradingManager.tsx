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
  Users,
} from "lucide-react";
import { AssignmentSubmission, Profile } from "@/lib/types/database";
import { adminGradeAssignmentAction } from "@/lib/actions/assignments";
import { BdcDots } from "@/components/ui/BdcDots";

interface AdminGradingManagerProps {
  initialSubmissions: AssignmentSubmission[];
  students: Profile[];
}

export function AdminGradingManager({ initialSubmissions, students }: AdminGradingManagerProps) {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(initialSubmissions);
  const [selectedSub, setSelectedSub] = useState<AssignmentSubmission | null>(null);
  const [score, setScore] = useState<number>(85);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "graded">("all");
  const [gradeResult, setGradeResult] = useState<{ success: boolean; message: string } | null>(null);

  // Anggota tim yang ikut menerima nilai (nilai bisa beda per orang)
  const [memberScores, setMemberScores] = useState<Record<string, number>>({});
  const [memberSearch, setMemberSearch] = useState("");

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
    setMemberScores({});
    setMemberSearch("");
    setGradeResult(null);
  };

  const toggleMember = (userId: string) => {
    setMemberScores((prev) => {
      const next = { ...prev };
      if (Object.hasOwn(next, userId)) delete next[userId];
      else next[userId] = score;
      return next;
    });
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setIsSubmitting(true);
    setGradeResult(null);
    try {
      const res = await adminGradeAssignmentAction(
        selectedSub.id,
        score,
        feedback,
        Object.entries(memberScores).map(([userId, s]) => ({ userId, score: s }))
      );
      setGradeResult({ success: res.success, message: res.message });
      if (res.success) {
        setSubmissions((prev) => {
          const next = prev.map((s) =>
            s.id === selectedSub.id ? { ...s, score, feedback, status: "graded" as const } : s
          );
          for (const shared of res.sharedSubmissions) {
            const i = next.findIndex((s) => s.id === shared.id);
            if (i === -1) next.unshift(shared);
            else next[i] = shared;
          }
          return next;
        });
        setSelectedSub(null);
      }
    } catch (err) {
      console.error(err);
      setGradeResult({ success: false, message: "Terjadi kesalahan jaringan saat menyimpan nilai." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const eligibleStudents = students
    .filter((s) => s.id !== selectedSub?.user_id)
    .filter((s) => {
      const q = memberSearch.trim().toLowerCase();
      return !q || s.full_name.toLowerCase().includes(q) || s.nim_id.toLowerCase().includes(q);
    });

  return (
    <div className="space-y-6 font-sans">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama mahasiswa atau NIM..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm bg-[#fffefa] shadow-retro-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`retro-btn px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              filter === "all"
                ? "bg-bdc-navy text-white shadow-retro-sm border border-bdc-midnight"
                : "bg-[#fffefa] text-slate-700 hover:bg-[#EFF0F0] border border-[#d9dfd7]"
            }`}
          >
            Semua ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`retro-btn px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              filter === "pending"
                ? "bg-bdc-navy text-white shadow-retro-sm border border-bdc-midnight"
                : "bg-[#fffefa] text-slate-700 hover:bg-[#EFF0F0] border border-[#d9dfd7]"
            }`}
          >
            Menunggu ({submissions.filter((s) => s.status === "pending").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("graded")}
            className={`retro-btn px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              filter === "graded"
                ? "bg-bdc-navy text-white shadow-retro-sm border border-bdc-midnight"
                : "bg-[#fffefa] text-slate-700 hover:bg-[#EFF0F0] border border-[#d9dfd7]"
            }`}
          >
            Dinilai ({submissions.filter((s) => s.status === "graded").length})
          </button>
        </div>
      </div>

      {/* Submissions Table (GDGoC dash-table) */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold border-b border-[#d9dfd7]">
              <tr>
                <th className="py-3 px-4">Mahasiswa</th>
                <th className="py-3 px-4">Tautan Berkas</th>
                <th className="py-3 px-4">Waktu Kirim</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Nilai</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9dfd7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
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
                    <tr key={sub.id} className="hover:bg-[#fff8e6] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-bdc-midnight text-bdc-yellow font-pixel text-xs flex items-center justify-center shrink-0 border border-bdc-midnight shadow-retro-sm">
                            {sub.user_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-space font-bold text-sm text-bdc-midnight">{sub.user_name}</p>
                            <p className="font-mono text-[10px] text-slate-500">
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
                          className="inline-flex items-center gap-1.5 text-bdc-blue hover:text-bdc-navy hover:underline max-w-[200px] truncate font-mono text-[11px]"
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
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-retro-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Selesai Dinilai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-retro-sm">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Perlu Penilaian
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {sub.score !== null ? (
                          <span className="font-pixel text-lg text-bdc-midnight font-bold">{sub.score} <span className="font-mono text-xs text-slate-400 font-normal">/ 100</span></span>
                        ) : (
                          <span className="font-mono text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenGradeModal(sub)}
                          className="retro-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm border border-bdc-midnight"
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
        <div className="fixed inset-0 bg-[#000741]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fffefa] rounded-3xl border-2 border-bdc-midnight shadow-retro-lg w-full max-w-lg p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-bdc-blue tracking-wider block">
                  [ EVALUASI &amp; PENILAIAN TUGAS ]
                </span>
                <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                  {selectedSub.user_name} ({selectedSub.nim_id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="text-slate-400 hover:text-bdc-midnight font-bold text-sm px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>

            {gradeResult && (
              <div
                className={`p-3 rounded-2xl border-2 text-xs font-bold shadow-retro-sm ${
                  gradeResult.success
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-red-50 border-red-300 text-red-800"
                }`}
              >
                {gradeResult.message}
              </div>
            )}

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs font-sans">
              <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-retro-sm">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Tautan Hasil Proyek Mahasiswa:
                </span>
                <a
                  href={selectedSub.submission_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bdc-blue hover:underline font-mono break-all inline-flex items-center gap-1 font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>{selectedSub.submission_url}</span>
                </a>
                {selectedSub.notes && (
                  <p className="mt-2 text-slate-700 italic font-sans">
                    &quot;{selectedSub.notes}&quot;
                  </p>
                )}
              </div>

              <div>
                <label className="block font-space font-bold text-slate-800 mb-1">
                  Nilai Angka (Skala 0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm font-pixel text-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-space font-bold text-slate-800 mb-1">
                  Umpan Balik &amp; Catatan Kurator / Instruktur
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm text-xs bg-white"
                />
              </div>

              {/* Anggota tim yang ikut menerima nilai */}
              <div className="rounded-2xl border border-[#d9dfd7] bg-[#f4f3ea] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-bdc-blue" />
                    <span className="font-space font-bold text-slate-800">
                      Bagikan ke anggota tim (opsional)
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {Object.keys(memberScores).length} dipilih
                  </span>
                </div>
                <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
                  Centang anggota yang ikut mengerjakan. Nilai bisa diubah per orang. EXP tidak
                  diberikan ke anggota yang tidak submit.
                </p>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Cari nama / NIM anggota..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-bdc-midnight bg-white"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-300 bg-white divide-y divide-slate-100">
                  {eligibleStudents.length === 0 ? (
                    <p className="py-3 text-center text-slate-400 font-mono text-[11px]">
                      Tidak ada mahasiswa yang cocok.
                    </p>
                  ) : (
                    eligibleStudents.map((student) => {
                      const checked = Object.hasOwn(memberScores, student.id);
                      return (
                        <div
                          key={student.id}
                          className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#fff8e6]"
                        >
                          <input
                            id={`member-${student.id}`}
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleMember(student.id)}
                            className="w-3.5 h-3.5 accent-bdc-midnight"
                          />
                          <label
                            htmlFor={`member-${student.id}`}
                            className="flex-1 min-w-0 cursor-pointer"
                          >
                            <span className="block font-space font-bold text-slate-800 truncate">
                              {student.full_name}
                            </span>
                            <span className="block font-mono text-[10px] text-slate-500">
                              NIM: {student.nim_id}
                            </span>
                          </label>
                          {checked && (
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={memberScores[student.id]}
                              onChange={(e) =>
                                setMemberScores((prev) => ({
                                  ...prev,
                                  [student.id]: Number(e.target.value),
                                }))
                              }
                              aria-label={`Nilai untuk ${student.full_name}`}
                              className="w-16 px-2 py-1 rounded-lg border border-slate-300 font-pixel text-sm text-center bg-white"
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#d9dfd7]">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="retro-btn px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-all shadow-retro-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="retro-btn px-5 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-retro-sm border border-bdc-midnight"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-bdc-yellow" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-bdc-yellow" />
                      <span>Simpan Nilai &amp; Kelulusan</span>
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
