import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMain } from "@/components/admin/AdminMain";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin" && user.role !== "instructor") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#EFF0F0] text-bdc-midnight flex flex-col lg:flex-row font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminMain>{children}</AdminMain>
      </div>
    </div>
  );
}
