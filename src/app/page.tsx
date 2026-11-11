import { redirect } from "next/navigation";

export default function RootPage() {
  // By default redirect to login page (middleware will handle session checks)
  redirect("/login");
}
