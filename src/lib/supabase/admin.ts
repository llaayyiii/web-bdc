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

/**
 * Supabase Client dengan Anon Key (tanpa persistensi sesi).
 * Dipakai di Server Action untuk operasi auth publik seperti
 * `signInWithOtp` (kirim kode OTP email) dan `verifyOtp` (verifikasi kode),
 * dengan hak akses yang sama seperti pemanggilan dari browser.
 */
export function createAnonClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  return createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
