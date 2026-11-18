"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { requestPasswordResetAction } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage(null);
    const result = await requestPasswordResetAction(email);
    setMessage(result.message);
    setSending(false);
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
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="font-pixel text-3xl text-bdc-midnight">Lupa kata sandi?</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Masukkan email kampus Anda. Jika terdaftar, kami akan mengirim tautan pemulihan yang aman.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-bdc-midnight">
              Email kampus
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@students.utdi.ac.id"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="retro-btn flex w-full items-center justify-center gap-2 rounded-xl bg-bdc-blue px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {sending ? "Mengirim..." : "Kirim tautan pemulihan"}
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-900">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
