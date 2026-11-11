"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Flag,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  Send,
  HelpCircle,
} from "lucide-react";
import { submitQuizAction, SubmitQuizResult } from "@/lib/actions/quiz";
import { useToast } from "@/components/ui/Toast";
import { QuizQuestion } from "@/lib/types/database";

const QUESTIONS_DATA: QuizQuestion[] = [
  {
    id: "q-1",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 1,
    question_text:
      "Metode enkripsi mana yang menggunakan sepasang kunci publik (public key) dan kunci privat (private key) untuk mengamankan transmisi data?",
    options: [
      { id: "A", text: "Enkripsi Simetris (AES-256)" },
      { id: "B", text: "Enkripsi Asimetris (RSA / ECC)" },
      { id: "C", text: "Fungsi Hash Kriptografis (SHA-256)" },
      { id: "D", text: "Base64 Encoding" },
    ],
    weight: 1.0,
  },
  {
    id: "q-2",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 2,
    question_text:
      "Serangan siber di mana penyerang menyisipkan script berbahaya ke dalam halaman web yang kemudian dieksekusi di browser korban dikenal dengan istilah?",
    options: [
      { id: "A", text: "SQL Injection (SQLi)" },
      { id: "B", text: "Cross-Site Scripting (XSS)" },
      { id: "C", text: "Distributed Denial of Service (DDoS)" },
      { id: "D", text: "Man-in-the-Middle (MitM)" },
    ],
    weight: 1.0,
  },
  {
    id: "q-3",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 3,
    question_text:
      "Langkah mitigasi paling efektif untuk mencegah serangan SQL Injection pada aplikasi modern adalah?",
    options: [
      { id: "A", text: "Menggunakan Prepared Statements dan Parameterized Queries" },
      { id: "B", text: "Melakukan enkripsi MD5 pada seluruh input string" },
      { id: "C", text: "Menghapus tanda spasi dari query database" },
      { id: "D", text: "Menonaktifkan firewall server database" },
    ],
    weight: 1.0,
  },
  {
    id: "q-4",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 4,
    question_text:
      "Standar internasional terkemuka untuk Sistem Manajemen Keamanan Informasi (SMKI / ISMS) adalah?",
    options: [
      { id: "A", text: "ISO 9001:2015" },
      { id: "B", text: "ISO/IEC 27001:2022" },
      { id: "C", text: "IEEE 802.11" },
      { id: "D", text: "RFC 2616" },
    ],
    weight: 1.0,
  },
  {
    id: "q-5",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 5,
    question_text:
      "Dalam konsep keamanan informasi, prinsip \"CIA Triad\" merupakan singkatan dari?",
    options: [
      { id: "A", text: "Confidentiality, Integrity, Availability" },
      { id: "B", text: "Control, Identification, Authentication" },
      { id: "C", text: "Compliance, Inspection, Authorization" },
      { id: "D", text: "Cryptography, Infrastructure, Analytics" },
    ],
    weight: 1.0,
  },
  {
    id: "q-6",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 6,
    question_text:
      "Manakah atribut cookie berikut yang berfungsi mencegah script JavaScript di sisi browser membaca token autentikasi sesi?",
    options: [
      { id: "A", text: "SameSite=Lax" },
      { id: "B", text: "HttpOnly" },
      { id: "C", text: "Secure" },
      { id: "D", text: "Domain=.utdi.ac.id" },
    ],
    weight: 1.0,
  },
  {
    id: "q-7",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 7,
    question_text:
      "Di Next.js App Router, pemanggilan database atau operasi sensitif disarankan diletakkan pada komponen jenis apa?",
    options: [
      { id: "A", text: "Client Component dengan useLayoutEffect" },
      { id: "B", text: "Server Component / Server Actions" },
      { id: "C", text: "Public static JSON file" },
      { id: "D", text: "HTML inline script" },
    ],
    weight: 1.0,
  },
  {
    id: "q-8",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 8,
    question_text:
      "Protokol jaringan yang digunakan untuk mengamankan pertukaran data web melalui saluran terenkripsi SSL/TLS adalah?",
    options: [
      { id: "A", text: "HTTP" },
      { id: "B", text: "FTP" },
      { id: "C", text: "HTTPS" },
      { id: "D", text: "Telnet" },
    ],
    weight: 1.0,
  },
  {
    id: "q-9",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 9,
    question_text:
      "Apa fungsi utama dari mekanisme Row Level Security (RLS) pada PostgreSQL Supabase?",
    options: [
      { id: "A", text: "Mempercepat pengurutan kolom string" },
      { id: "B", text: "Membatasi akses baris data secara spesifik berdasarkan token identitas pengguna" },
      { id: "C", text: "Menghapus data duplikat secara otomatis" },
      { id: "D", text: "Mengompresi file media di storage" },
    ],
    weight: 1.0,
  },
  {
    id: "q-10",
    quiz_id: "quiz-bdc-eval-2026",
    order_index: 10,
    question_text:
      "Faktor pembuktian identitas yang menggabungkan kata sandi (knowledge) dengan token OTP di ponsel (possession) disebut?",
    options: [
      { id: "A", text: "Single Sign-On (SSO)" },
      { id: "B", text: "Multi-Factor Authentication (MFA / 2FA)" },
      { id: "C", text: "Role-Based Access Control (RBAC)" },
      { id: "D", text: "Biometric Spoofing" },
    ],
    weight: 1.0,
  },
];

export default function QuizPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: quizId } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 Menit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [result, setResult] = useState<SubmitQuizResult | null>(null);

  // Timer countdown
  useEffect(() => {
    if (result) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionId: string) => {
    const questionNumber = currentIndex + 1;
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: optionId,
    }));
  };

  const toggleFlag = () => {
    const qNum = currentIndex + 1;
    setFlagged((prev) =>
      prev.includes(qNum) ? prev.filter((n) => n !== qNum) : [...prev, qNum]
    );
  };

  const handleAutoSubmit = async () => {
    showToast("Waktu ujian telah habis! Mengirimkan lembar jawaban otomatis...", "info");
    await executeSubmission();
  };

  const executeSubmission = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const res = await submitQuizAction(quizId, answers);
      if (res.success) {
        setResult(res);
        showToast("Ujian berhasil diselesaikan! Skor telah tersimpan.", "success");
      } else {
        showToast(res.error || "Gagal mengirimkan ujian.", "error");
        setIsSubmitting(false);
      }
    } catch {
      showToast("Terjadi kesalahan saat memproses nilai.", "error");
      setIsSubmitting(false);
    }
  };

  const currentQ = QUESTIONS_DATA[currentIndex];
  const selectedAnswer = answers[currentIndex + 1];
  const isCurrentFlagged = flagged.includes(currentIndex + 1);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/assessments"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-extrabold text-bdc-midnight">
              Uji Evaluasi Akhir: Keamanan Siber &amp; Web
            </h1>
            <span className="text-[10px] text-slate-500 font-medium">
              10 Butir Soal Terstandarisasi BDC UTDI
            </span>
          </div>
        </div>

        {/* Live Timer Clock */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold shadow-sm ${
              timeLeft < 300
                ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
                : "bg-bdc-surface border-slate-200 text-bdc-midnight"
            }`}
          >
            <Clock className="w-4 h-4 text-bdc-blue" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting || !!result}
            className="px-4 py-2 rounded-xl bg-bdc-blue hover:bg-bdc-navy active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Selesai Ujian</span>
          </button>
        </div>
      </div>

      {/* Main Examination Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Question Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[460px]">
          <div>
            {/* Question Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-bold text-bdc-blue uppercase tracking-wider">
                Soal Nomor {currentIndex + 1} dari {QUESTIONS_DATA.length}
              </span>

              <button
                type="button"
                onClick={toggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isCurrentFlagged
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? "fill-amber-600 text-amber-600" : ""}`} />
                <span>{isCurrentFlagged ? "Ditandai Ragu-ragu" : "Ragu-ragu"}</span>
              </button>
            </div>

            {/* Question Text */}
            <p className="text-sm sm:text-base font-semibold text-bdc-midnight leading-relaxed mb-6">
              {currentQ.question_text}
            </p>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-bdc-blue ring-1 ring-bdc-blue text-bdc-midnight shadow-sm"
                        : "bg-slate-50/50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-bdc-blue text-white shadow-sm"
                          : "bg-white border border-slate-300 text-slate-600"
                      }`}
                    >
                      {option.id}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Step Buttons */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Terjawab: {answeredCount} dari {QUESTIONS_DATA.length}
            </span>

            <button
              type="button"
              disabled={currentIndex === QUESTIONS_DATA.length - 1}
              onClick={() =>
                setCurrentIndex((prev) => Math.min(QUESTIONS_DATA.length - 1, prev + 1))
              }
              className="px-4 py-2 rounded-xl bg-bdc-midnight hover:bg-bdc-navy text-xs font-bold text-white disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <span>Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Question Number Palette */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div>
            <h3 className="text-xs font-bold text-bdc-midnight uppercase tracking-wider mb-1">
              Navigasi Soal
            </h3>
            <p className="text-[11px] text-slate-500">Klik nomor untuk melompat ke soal</p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {QUESTIONS_DATA.map((q, idx) => {
              const qNum = idx + 1;
              const isAnswered = !!answers[qNum];
              const isFlag = flagged.includes(qNum);
              const isCurrent = currentIndex === idx;

              let btnStyle = "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
              if (isAnswered) {
                btnStyle = "bg-bdc-blue text-white border-bdc-blue shadow-sm";
              }
              if (isFlag) {
                btnStyle = "bg-bdc-yellow text-bdc-midnight border-amber-400 font-extrabold";
              }
              if (isCurrent) {
                btnStyle += " ring-2 ring-offset-2 ring-bdc-midnight";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg font-bold text-xs border transition-all flex items-center justify-center cursor-pointer ${btnStyle}`}
                >
                  {qNum}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[10px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-bdc-blue shrink-0" />
              <span>Sudah Dijawab ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-bdc-yellow border border-amber-300 shrink-0" />
              <span>Ragu-ragu ({flagged.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 shrink-0" />
              <span>Belum Dijawab ({QUESTIONS_DATA.length - answeredCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-bdc-midnight/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-bdc-midnight mb-2">
              Konfirmasi Selesai Ujian
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Anda telah menjawab <strong>{answeredCount}</strong> dari {QUESTIONS_DATA.length} soal.
              Apakah Anda yakin ingin menyelesaikan dan mengirimkan lembar jawaban ini?
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Kembali Periksa
              </button>
              <button
                onClick={executeSubmission}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-bdc-blue hover:bg-bdc-navy text-white text-xs font-bold shadow-md"
              >
                {isSubmitting ? "Mengirimkan..." : "Ya, Kirim Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal / Screen */}
      {result && (
        <div className="fixed inset-0 bg-bdc-midnight/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center flex flex-col items-center animate-in fade-in zoom-in-95">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                result.passed
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {result.passed ? (
                <Award className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Hasil Evaluasi Otomatis
            </span>
            <h2 className="text-2xl font-extrabold text-bdc-midnight mt-0.5 mb-1">
              {result.passed ? "KOMPETEN (LULUS)" : "PERLU REMEDIAL"}
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mb-6">
              {result.passed
                ? "Selamat! Anda memenuhi standar kriteria kelulusan akademik BDC UTDI."
                : "Nilai Anda masih berada di bawah batas ambang kelulusan min. 75.00."}
            </p>

            {/* Score Big Display */}
            <div className="w-full p-4 rounded-2xl bg-bdc-surface border border-slate-200 mb-6 flex items-center justify-around">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Skor Perolehan
                </span>
                <span className="text-3xl font-extrabold text-bdc-midnight">
                  {result.score}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Jawaban Benar
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {result.correctCount} / {result.totalQuestions}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2">
              {result.passed && (
                <Link
                  href="/certificates"
                  className="w-full py-3 px-4 rounded-xl bg-bdc-blue hover:bg-bdc-navy text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-bdc-yellow" />
                  <span>Buka Sertifikat &amp; Transkrip Nilai</span>
                </Link>
              )}
              <Link
                href="/assessments"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all block"
              >
                Kembali ke Halaman Evaluasi
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
