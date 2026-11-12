import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client dengan Service Role Key
 * Digunakan secara eksklusif di server-side (Server Actions)
 * untuk operasi administratif seperti reset password pengguna dan bypass RLS.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
