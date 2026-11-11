import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { SessionPresenter } from "@/components/admin/SessionPresenter";

interface PresenterPageProps {
  params: Promise<{ id: string }>;
}

export default async function PresenterPage({ params }: PresenterPageProps) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const session = bdcStore.getSessionById(id);

  if (!session) {
    notFound();
  }

  const attendees = bdcStore.getAttendancesBySession(id);

  return <SessionPresenter session={session} initialAttendees={attendees} />;
}
