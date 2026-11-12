import { redirect } from "next/navigation";

// Fitur ujian diganti menjadi tugas & essay — rute lama diarahkan agar tautan tetap hidup.
export default function AssessmentsPage() {
  redirect("/assignments");
}
