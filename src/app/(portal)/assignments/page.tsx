import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { hydrateFromDb } from "@/lib/data/db";
import { StudentAssignmentList } from "@/components/assignments/StudentAssignmentList";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
} from "lucide-react";

export default async function AssignmentsPage() {
  await hydrateFromDb();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const assignments = bdcStore.getAssignments();
  const userSubmissions = bdcStore.getSubmissionsByUser(user.id);

  const gradedCount = userSubmissions.filter((s) => s.status === "graded").length;
  const pendingCount = userSubmissions.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 04 // MANAJEMEN PENUGASAN &amp; STUDI KASUS ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Tugas &amp; Portofolio
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Kumpulkan hasil hands-on coding, audit keamanan siber, dan studi kasus proyek untuk melengkapi syarat penerbitan sertifikat kompetensi.
            </p>
          </div>
        </div>
      </div>

      {/* 2. 3 Stats Cards with Top Inset Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Tasks (Blue Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#095BAF] flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Tugas Tersedia
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-pixel text-3xl text-bdc-midnight">{assignments.length}</span>
              <span className="font-mono text-xs text-slate-500">Tugas Proyek</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-bdc-blue flex items-center justify-center border border-blue-200 shadow-retro-sm">
            <FolderGit2 className="w-6 h-6" />
          </div>
        </div>

        {/* Graded Tasks (Green Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#34A853] flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Sudah Dinilai
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-pixel text-3xl text-emerald-600">{gradedCount}</span>
              <span className="font-mono text-xs text-slate-500">Tersertifikasi</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-retro-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Evaluation (Yellow Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#E9AD17] flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Menunggu Evaluasi
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-pixel text-3xl text-amber-600">{pendingCount}</span>
              <span className="font-mono text-xs text-slate-500">Dalam Antrean</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-retro-sm">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Main Assignment List */}
      <StudentAssignmentList
        assignments={assignments}
        userSubmissions={userSubmissions}
      />
    </div>
  );
}
