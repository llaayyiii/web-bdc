"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { completePasswordResetAction } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [status, setStatus] = useState("Memverifikasi tautan pemulihan...");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function establishRecoverySession() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hashParams = new URLSearchParams(url.hash.slice(1));
      const hashAccessToken = hashParams.get("access_token");

      try {
        if (code) {
          const { data, error } = await createClient().auth.exchangeCodeForSession(code);
          if (error || !data.session?.access_token) throw error || new Error("Sesi pemulihan tidak tersedia.");
          setAccessToken(data.session.access_token);
        } else if (hashAccessToken) {
          setAccessToken(hashAccessToken);
        } else {
          throw new Error("Tautan pemulihan tidak lengkap.");
        }
        setStatus("");
      } catch {
        setStatus("Tautan pemulihan tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.");
      }
    }

    establishRecoverySession();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    if (newPassword !== confirmPassword) {
      setStatus("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSubmitting(true);
    const result = await completePasswordResetAction(accessToken, newPassword);
    if (!result.success) {
      setStatus(result.error || "Kata sandi belum diperbarui. Silakan minta tautan baru.");
      setSubmitting(false);
      return;
    }
    await createClient().auth.signOut();
    window.location.assign(result.redirectTo || "/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f4f3ea] px-5 py-16 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-[#fffefa] p-7 shadow-retro">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-bdc-blue hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke login
        </Link>
        <div className="mt-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-bdc-blue">
            <KeyRound className="h-5 w-5" />
          </div>
          <h1 className="font-pixel text-3xl text-bdc-midnight">Buat kata sandi baru</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Gunakan kata sandi baru minimal delapan karakter.
          </p>
        </div>

        {accessToken ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-xs font-bold text-bdc-midnight">
                Kata sandi baru
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold text-bdc-midnight">
                Konfirmasi kata sandi baru
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="retro-btn w-full rounded-xl bg-bdc-blue px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {submitting ? "Memperbarui..." : "Simpan kata sandi baru"}
            </button>
          </form>
        ) : (
          <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
            {status}
          </p>
        )}

        {accessToken && status && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-900">
            {status}
          </p>
        )}
      </section>
    </main>
  );
}
