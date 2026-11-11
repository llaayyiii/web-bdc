import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { StudentAssignmentList } from "@/components/assignments/StudentAssignmentList";
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
} from "lucide-react";

export default async function AssignmentsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const assignments = bdcStore.getAssignments();
  const userSubmissions = bdcStore.getSubmissionsByUser(user.id);

  const gradedCount = userSubmissions.filter((s) => s.status === "graded").length;
  const pendingCount = userSubmissions.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-bdc-navy text-bdc-yellow mb-1.5">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Manajemen Penugasan Proyek</span>
          </div>
          <h1 className="text-2xl font-black text-bdc-midnight tracking-tight">
            Tugas &amp; Portofolio Proyek BDC
          </h1>
          <p className="text-xs text-slate-500">
            Kumpulkan hasil hands-on coding, audit keamanan, dan studi kasus untuk melengkapi kriteria sertifikat
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Tugas Tersedia
            </span>
            <span className="text-2xl font-black text-bdc-midnight mt-1 block">
              {assignments.length} <span className="text-xs font-semibold text-slate-400">Tugas Proyek</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-bdc-blue flex items-center justify-center">
            <FolderGit2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Sudah Dinilai
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {gradedCount} <span className="text-xs font-semibold text-slate-400">Tersertifikasi</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Menunggu Evaluasi
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {pendingCount} <span className="text-xs font-semibold text-slate-400">Dalam Antrean</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main List */}
      <StudentAssignmentList
        assignments={assignments}
        userSubmissions={userSubmissions}
      />
    </div>
  );
}
