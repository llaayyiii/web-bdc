import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { SessionsManager } from "@/components/admin/SessionsManager";
import { Video, Shield } from "lucide-react";

export default async function AdminSessionsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/dashboard");
  }

  const sessions = bdcStore.getSessions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-bdc-navy text-bdc-yellow mb-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Panel Pengelola Sesi</span>
          </div>
          <h1 className="text-2xl font-black text-bdc-midnight tracking-tight">
            Manajemen Sesi Pertemuan &amp; Presensi Proyektor
          </h1>
          <p className="text-xs text-slate-500">
            Sebarkan tautan Google Meet ke seluruh anggota dan tampilkan kode QR dinamis di layar proyektor
          </p>
        </div>
      </div>

      <SessionsManager initialSessions={sessions} />
    </div>
  );
}
