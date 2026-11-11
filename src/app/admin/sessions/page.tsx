import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { SessionsManager } from "@/components/admin/SessionsManager";
import { BdcDots } from "@/components/ui/BdcDots";
import { Video, Shield } from "lucide-react";

export default async function AdminSessionsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/dashboard");
  }

  const sessions = bdcStore.getSessions();

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 02 // MANAJEMEN SESI &amp; PRESENSI PROYEKTOR ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Sesi Pertemuan &amp; QR
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Sebarkan tautan Google Meet ke seluruh mahasiswa dan luncurkan kode QR dinamis di layar proyektor ruang kelas untuk presensi real-time.
            </p>
          </div>
        </div>
      </div>

      <SessionsManager initialSessions={sessions} />
    </div>
  );
}
