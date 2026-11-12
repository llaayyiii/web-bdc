import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { adminGetAllProfilesAction } from "@/lib/actions/admin";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { BdcDots } from "@/components/ui/BdcDots";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/dashboard");
  }

  const profiles = await adminGetAllProfilesAction();

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 07 // MANAJEMEN PENGGUNA & HAK AKSES ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Manajemen Pengguna
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Pusat kendali akun anggota dan kurator BDC UTDI: atur perizinan hak akses administrator, reset kata sandi, dan pantau status akun resmi kampus.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Users Manager Component */}
      <AdminUsersManager initialProfiles={profiles} currentUserId={user.id} />
    </div>
  );
}
