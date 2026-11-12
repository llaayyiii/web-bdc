"use client";

import React, { useState } from "react";
import {
  FileQuestion,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
  Check,
} from "lucide-react";
import { QuizOption, QuizQuestion } from "@/lib/types/database";
import {
  adminCreateQuizQuestionAction,
  adminDeleteQuizQuestionAction,
} from "@/lib/actions/quiz";
import { BdcDots } from "@/components/ui/BdcDots";

interface AdminAssessmentsManagerProps {
  initialQuestions: QuizQuestion[];
}

export function AdminAssessmentsManager({
  initialQuestions,
}: AdminAssessmentsManagerProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctOption, setCorrectOption] = useState<string>("A");
  const [weight, setWeight] = useState<number>(1.0);
  const [explanation, setExplanation] = useState("");

  // Delete State
  const [questionToDelete, setQuestionToDelete] = useState<QuizQuestion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetForm = () => {
    setQuestionText("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setCorrectOption("A");
    setWeight(1.0);
    setExplanation("");
    setErrorMessage(null);
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!questionText.trim()) {
      setErrorMessage("Teks pertanyaan tidak boleh kosong.");
      return;
    }

    if (!optA.trim() || !optB.trim()) {
      setErrorMessage("Opsi A dan Opsi B wajib diisi.");
      return;
    }

    const options: QuizOption[] = [
      { id: "A", text: optA.trim() },
      { id: "B", text: optB.trim() },
    ];
    if (optC.trim()) options.push({ id: "C", text: optC.trim() });
    if (optD.trim()) options.push({ id: "D", text: optD.trim() });

    setIsSubmitting(true);
    try {
      const res = await adminCreateQuizQuestionAction({
        question_text: questionText.trim(),
        options,
        correct_option: correctOption,
        weight: Number(weight) || 1.0,
        explanation: explanation.trim() || undefined,
      });

      if (!res.success || !res.question) {
        setErrorMessage(res.error || "Gagal menambahkan butir soal.");
        return;
      }

      setQuestions((prev) => [...prev, res.question!]);
      resetForm();
      setShowAddModal(false);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menyimpan butir soal."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;

    setIsDeleting(true);
    try {
      const res = await adminDeleteQuizQuestionAction(questionToDelete.id);
      if (!res.success) {
        alert(res.error || "Gagal menghapus butir soal.");
        return;
      }

      setQuestions((prev) => {
        const filtered = prev.filter((q) => q.id !== questionToDelete.id);
        return filtered.map((q, idx) => ({ ...q, order_index: idx + 1 }));
      });
      setQuestionToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus soal.");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPoints = questions.reduce((acc, q) => acc + (q.weight || 1), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d9dfd7]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-space text-lg font-bold text-bdc-midnight">
              Daftar Butir Soal Uji Kompetensi
            </h2>
            <BdcDots size="sm" />
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Kelola soal ujian sertifikasi kompetensi BDC UTDI (Kriptografi, Keamanan Siber &amp; Web)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="retro-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm border border-bdc-midnight shrink-0"
        >
          <Plus className="w-4 h-4 text-bdc-yellow" />
          <span>Tambah Butir Soal Baru</span>
        </button>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#fffefa] p-4 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_3px_0_#095BAF] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-bdc-blue flex items-center justify-center border border-blue-200">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
              Total Butir Soal
            </span>
            <span className="font-pixel text-2xl font-black text-bdc-midnight">
              {questions.length} <span className="text-xs font-sans font-normal text-slate-400">Butir</span>
            </span>
          </div>
        </div>

        <div className="bg-[#fffefa] p-4 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_3px_0_#E9AD17] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
              Total Bobot Poin
            </span>
            <span className="font-pixel text-2xl font-black text-bdc-midnight">
              {totalPoints.toFixed(1)} <span className="text-xs font-sans font-normal text-slate-400">Poin</span>
            </span>
          </div>
        </div>

        <div className="bg-[#fffefa] p-4 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_3px_0_#068153] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
              Batas Lulus (Passing)
            </span>
            <span className="font-pixel text-2xl font-black text-bdc-midnight">
              75.0% <span className="text-xs font-sans font-normal text-slate-400">Minimum</span>
            </span>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-8 sm:p-12 text-center shadow-retro space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EFF0F0] border border-slate-300 flex items-center justify-center text-slate-400 shadow-retro-sm">
              <FileQuestion className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-space text-lg font-bold text-bdc-midnight">
                Bank Soal Masih Kosong
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Belum ada butir soal yang ditambahkan. Klik tombol &quot;Tambah Butir Soal Baru&quot; di atas untuk memasukkan pertanyaan ujian kompetensi pertama.
              </p>
            </div>
          </div>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 shadow-retro space-y-4 transition-all hover:shadow-retro-lg"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-bdc-midnight uppercase tracking-wider bg-[#EFF0F0] px-3 py-1 rounded-xl border border-slate-300">
                    Butir Soal #{q.order_index}
                  </span>
                  <BdcDots size="sm" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    Bobot: {q.weight.toFixed(1)} Poin
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuestionToDelete(q)}
                    className="retro-btn p-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 transition-all text-xs"
                    title="Hapus Butir Soal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="font-space text-sm sm:text-base font-bold text-bdc-midnight leading-relaxed">
                {q.question_text}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt) => {
                  const isCorrect = q.correct_option?.toUpperCase() === opt.id.toUpperCase();
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
                        <strong className="mr-2 font-mono text-bdc-midnight text-xs">
                          {opt.id}.
                        </strong>
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

              {q.explanation && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-sans leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Penjelasan Akademik: </strong>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Add Question */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#000741]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffefa] rounded-3xl border-2 border-bdc-midnight shadow-retro-lg w-full max-w-xl p-6 sm:p-7 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-bdc-blue tracking-wider block">
                  [ FORMULIR BUTIR SOAL BARU ]
                </span>
                <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                  Tambah Soal Uji Kompetensi BDC
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-bdc-midnight mb-1 font-space">
                  Pertanyaan / Soal Evaluasi *
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Contoh: Metode enkripsi mana yang menggunakan sepasang public key dan private key?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm text-xs bg-white resize-none"
                />
              </div>

              <div className="space-y-2.5 pt-1 border-t border-slate-200">
                <span className="block font-bold text-bdc-midnight font-space">
                  Pilihan Jawaban (Minimal A &amp; B) *
                </span>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-bdc-midnight text-bdc-yellow font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                      A
                    </span>
                    <input
                      type="text"
                      required
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="Pilihan jawaban A"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight text-xs bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-bdc-midnight text-bdc-yellow font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                      B
                    </span>
                    <input
                      type="text"
                      required
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="Pilihan jawaban B"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight text-xs bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#EFF0F0] text-slate-700 font-mono font-bold flex items-center justify-center shrink-0 text-xs border border-slate-300">
                      C
                    </span>
                    <input
                      type="text"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="Pilihan jawaban C (opsional)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight text-xs bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#EFF0F0] text-slate-700 font-mono font-bold flex items-center justify-center shrink-0 text-xs border border-slate-300">
                      D
                    </span>
                    <input
                      type="text"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="Pilihan jawaban D (opsional)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block font-bold text-bdc-midnight mb-1 font-space">
                    Kunci Jawaban Benar *
                  </label>
                  <select
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight text-xs font-mono font-bold bg-[#EFF0F0]"
                  >
                    <option value="A">Opsi A</option>
                    <option value="B">Opsi B</option>
                    {optC.trim() && <option value="C">Opsi C</option>}
                    {optD.trim() && <option value="D">Opsi D</option>}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-bdc-midnight mb-1 font-space">
                    Bobot Penilaian (Poin) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 1.0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight text-xs font-mono bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-bdc-midnight mb-1 font-space">
                  Penjelasan Kunci Jawaban (Opsional)
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Contoh: Kriptografi asimetris menggunakan pasangan public dan private key."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight text-xs bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#d9dfd7]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="retro-btn px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-all text-xs shadow-retro-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="retro-btn px-5 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all text-xs disabled:opacity-50 shadow-retro-sm border border-bdc-midnight"
                >
                  {isSubmitting ? "Menyimpan Soal..." : "Simpan Butir Soal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete Question */}
      {questionToDelete && (
        <div className="fixed inset-0 bg-[#000741]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fffefa] rounded-3xl border-2 border-rose-600 shadow-retro-lg w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#d9dfd7]">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-300 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-space text-base font-bold text-bdc-midnight">
                  Hapus Butir Soal #{questionToDelete.order_index}?
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Konfirmasi penghapusan butir soal ujian
                </p>
              </div>
            </div>

            <div className="text-xs font-sans text-slate-700 bg-[#EFF0F0] p-4 rounded-2xl border border-slate-300 space-y-1">
              <p className="font-bold text-bdc-midnight leading-relaxed">
                &ldquo;{questionToDelete.question_text}&rdquo;
              </p>
              <p className="font-mono text-[11px] text-slate-500">
                Kunci: {questionToDelete.correct_option} | Bobot: {questionToDelete.weight} Poin
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#d9dfd7]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setQuestionToDelete(null)}
                className="retro-btn px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-all text-xs shadow-retro-sm"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteQuestion}
                className="retro-btn px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all text-xs disabled:opacity-50 flex items-center gap-1.5 shadow-retro-sm border border-rose-700"
              >
                {isDeleting ? (
                  <span>Menghapus...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Butir Soal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
