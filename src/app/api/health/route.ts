import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Health check ringan untuk monitor uptime: membuktikan app + koneksi DB hidup.
export async function GET() {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ status: "degraded", db: "unconfigured" }, { status: 503 });
  }
  const { error } = await supabase.from("profiles").select("id").limit(1);
  if (error) {
    return NextResponse.json({ status: "degraded", db: "error" }, { status: 503 });
  }
  return NextResponse.json({ status: "ok" });
}
