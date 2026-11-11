import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { PortalHeader } from "@/components/layout/PortalHeader";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bdc-surface flex flex-col lg:flex-row">
      {/* Sidebar */}
      <PortalSidebar
        userRole={user.role}
        userName={user.full_name}
        userNim={user.nim_id}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader
          userName={user.full_name}
          userRole={user.role}
          userEmail={user.email}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
