"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Sparkles, Check } from "lucide-react";
import { toggleCourseTopicAction } from "@/lib/actions/courses";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";

interface SyllabusChecklistProps {
  courseId: string;
  syllabus: string[];
  initialCompletedTopics: number[];
}

export function SyllabusChecklist({
  courseId,
  syllabus,
  initialCompletedTopics,
}: SyllabusChecklistProps) {
  const { showToast } = useToast();
  const [completedTopics, setCompletedTopics] = useState<number[]>(initialCompletedTopics);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const progressPercent = Math.round((completedTopics.length / syllabus.length) * 100);

  const handleToggle = async (index: number) => {
    setLoadingIndex(index);
    try {
      const res = await toggleCourseTopicAction(courseId, index);
      if (res.success && res.enrollment) {
        setCompletedTopics(res.enrollment.completed_topics);
        const isDoneNow = res.enrollment.completed_topics.includes(index);
        showToast(
          isDoneNow
            ? `Topik ${index + 1} ditandai selesai!`
            : `Topik ${index + 1} dibatalkan selesai.`,
          "success"
        );
      } else {
        showToast(res.error || "Gagal memperbarui progres.", "error");
      }
    } catch {
      showToast("Gagal memperbarui progres.", "error");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 sm:p-7 shadow-retro space-y-6 font-sans">
      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d9dfd7]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
              Silabus &amp; Capaian Materi Modul
            </h2>
            <BdcDots size="sm" />
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Centang setiap topik yang telah Anda pelajari untuk melengkapi syarat sertifikasi kelulusan.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#EFF0F0] p-3 rounded-2xl border border-slate-300 shadow-retro-sm">
          <div className="text-right">
            <span className="font-pixel text-xl font-bold text-bdc-midnight">{progressPercent}%</span>
            <span className="font-mono text-[10px] text-slate-500 block">
              {completedTopics.length} / {syllabus.length} tuntas
            </span>
          </div>
          <div className="w-24 bg-slate-300 h-3 rounded-full overflow-hidden border border-slate-400">
            <div
              className="bg-bdc-blue h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {progressPercent === 100 && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 text-xs font-semibold flex items-center gap-3 shadow-retro-sm">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-sans">Selamat! Seluruh silabus modul ini telah berhasil Anda tuntaskan 100%.</span>
        </div>
      )}

      {/* Interactive Topics List */}
      <div className="space-y-3">
        {syllabus.map((topic, index) => {
          const isCompleted = completedTopics.includes(index);
          const isLoading = loadingIndex === index;

          return (
            <div
              key={index}
              onClick={() => !isLoading && handleToggle(index)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none shadow-retro-sm ${
                isCompleted
                  ? "bg-[#fff8e6] border-bdc-gold shadow-[inset_4px_0_0_#E9AD17]"
                  : "bg-[#fffefa] border-[#d9dfd7] hover:bg-[#f9f9f5]"
              }`}
            >
              <button
                type="button"
                disabled={isLoading}
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all mt-0.5 border ${
                  isCompleted
                    ? "bg-bdc-blue text-white border-bdc-midnight shadow-retro-sm"
                    : "border-slate-300 bg-white hover:border-bdc-blue text-transparent"
                }`}
              >
                {isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4 stroke-[3]" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-bold text-bdc-blue">
                    Topik {String(index + 1).padStart(2, "0")}
                  </span>
                  {isCompleted && (
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-300">
                      Tuntas
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    isCompleted ? "text-slate-900 font-semibold" : "text-slate-700"
                  }`}
                >
                  {topic}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
