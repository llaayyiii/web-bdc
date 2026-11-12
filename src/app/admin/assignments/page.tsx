import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { hydrateFromDb } from "@/lib/data/db";
import { AdminGradingManager } from "@/components/admin/AdminGradingManager";
import { BdcDots } from "@/components/ui/BdcDots";
import { FolderGit2, Shield } from "lucide-react";

export default async function AdminAssignmentsPage() {
  await hydrateFromDb();
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/dashboard");
  }

  const submissions = bdcStore.getSubmissions();

  return (
    <div className="space-y-8 font-sans">
      {/* Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 03 // EVALUASI PENUGASAN MAHASISWA ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Penilaian Tugas &amp; Portofolio
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Periksa tautan repositori GitHub dan Google Drive mahasiswa, berikan evaluasi nilai, dan verifikasi kriteria pembukaan kunci sertifikat.
            </p>
          </div>
        </div>
      </div>

      <AdminGradingManager initialSubmissions={submissions} />
    </div>
  );
}
