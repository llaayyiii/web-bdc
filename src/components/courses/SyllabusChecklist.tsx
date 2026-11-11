"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Sparkles, Check } from "lucide-react";
import { toggleCourseTopicAction } from "@/lib/actions/courses";
import { useToast } from "@/components/ui/Toast";

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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-bdc-midnight">Silabus &amp; Capaian Materi</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Centang setiap topik yang telah Anda pelajari untuk melengkapi syarat sertifikasi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-bdc-midnight">{progressPercent}%</span>
            <span className="text-[10px] text-slate-500 block">
              {completedTopics.length} dari {syllabus.length} tuntas
            </span>
          </div>
          <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-bdc-blue h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {progressPercent === 100 && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Selamat! Seluruh silabus modul ini telah berhasil Anda tuntaskan 100%.</span>
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
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                isCompleted
                  ? "bg-blue-50/40 border-blue-200/80 hover:bg-blue-50/70"
                  : "bg-slate-50/50 border-slate-200 hover:bg-slate-100/60"
              }`}
            >
              <button
                type="button"
                disabled={isLoading}
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                  isCompleted
                    ? "bg-bdc-blue text-white shadow-sm"
                    : "border-2 border-slate-300 bg-white hover:border-bdc-blue text-transparent"
                }`}
              >
                {isLoading ? (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold text-bdc-blue">Topik {index + 1}</span>
                  {isCompleted && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.2 rounded-full">
                      Tuntas
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs font-medium leading-relaxed ${
                    isCompleted ? "text-slate-800" : "text-slate-600"
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
