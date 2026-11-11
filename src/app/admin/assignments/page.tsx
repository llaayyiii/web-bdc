import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { AdminGradingManager } from "@/components/admin/AdminGradingManager";
import { FolderGit2, Shield } from "lucide-react";

export default async function AdminAssignmentsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/dashboard");
  }

  const submissions = bdcStore.getSubmissions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-bdc-navy text-bdc-yellow mb-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Panel Kurasi Penugasan</span>
          </div>
          <h1 className="text-2xl font-black text-bdc-midnight tracking-tight">
            Penilaian Tugas Proyek &amp; Capstone
          </h1>
          <p className="text-xs text-slate-500">
            Periksa tautan repositori GitHub dan Google Drive mahasiswa, berikan feedback, dan validasi prasyarat kelulusan sertifikat
          </p>
        </div>
      </div>

      <AdminGradingManager initialSubmissions={submissions} />
    </div>
  );
}
