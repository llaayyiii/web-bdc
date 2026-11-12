import { redirect } from "next/navigation";

// Bank soal digabung ke halaman tugas & essay — rute lama diarahkan agar tautan tetap hidup.
export default function AdminAssessmentsPage() {
  redirect("/admin/assignments");
}
