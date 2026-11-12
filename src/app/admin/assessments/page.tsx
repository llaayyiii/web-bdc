import React from "react";
import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { bdcStore } from "@/lib/data/store";
import { AdminAssessmentsManager } from "@/components/admin/AdminAssessmentsManager";
import { BdcDots } from "@/components/ui/BdcDots";

export default async function AdminAssessmentsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/dashboard");
  }

  const questions = bdcStore.getAllQuestions();

  return (
    <div className="space-y-8 font-sans">
      {/* Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 06 // BANK SOAL &amp; KUNCI JAWABAN TERENKRIPSI ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Bank Soal Evaluasi
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Pangkalan data butir soal evaluasi akhir kompetensi siber &amp; pemrograman web, bobot penilaian akademik, dan kunci jawaban terenkripsi resmi BDC UTDI.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Manager with Add Question Modal */}
      <AdminAssessmentsManager initialQuestions={questions} />
    </div>
  );
}
