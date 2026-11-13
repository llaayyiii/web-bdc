import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { hydrateFromDb } from "@/lib/data/db";
import { AdminCompetitionsManager } from "@/components/admin/AdminCompetitionsManager";
import { BdcDots } from "@/components/ui/BdcDots";

export default async function AdminCompetitionsPage() {
  await hydrateFromDb();
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/dashboard");
  }

  const competitions = bdcStore.getCompetitions();

  return (
    <div className="space-y-8 font-sans">
      {/* Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 08 // PUBLIKASI INFO LOMBA &amp; EVENT ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Info Lomba &amp; Event
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Terbitkan info lomba / event ke portal mahasiswa: nama &amp; gambar terisi otomatis dari
              tautan, batas waktu kadaluarsa otomatis, tautan resmi, dan guidebook yang bisa diunduh.
            </p>
          </div>
        </div>
      </div>

      <AdminCompetitionsManager initialCompetitions={competitions} />
    </div>
  );
}
