"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle, Sparkles, ArrowLeft, UserPlus } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";
import { UtdiCampusInteractiveScene } from "@/components/hero/UtdiCampusInteractiveScene";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("password", password);

    try {
      const res = await loginAction(formData);
      if (!res.success) {
        setErrorMessage(res.error || "Gagal masuk. Periksa kembali data Anda.");
        showToast(res.error || "Gagal masuk.", "error");
        setLoading(false);
        return;
      }

      showToast("Otentikasi Berhasil! Mengalihkan...", "success");
      router.push(res.redirectTo || "/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem.";
      setErrorMessage(msg);
      showToast(msg, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bdc-surface flex flex-col items-center justify-center p-4 relative overflow-hidden isolate">
      {/* Background Hero Scene (Lego Kampus UTDI, Awan Pixel & Washes) */}
      <UtdiCampusInteractiveScene />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="retro-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-xs font-bold text-bdc-midnight shadow-retro-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center z-10">
        <div className="mb-3 transition-transform hover:scale-105">
          <Image
            src="/logo.svg"
            alt="BDC Logo"
            width={90}
            height={50}
            className="h-14 w-auto object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-black font-space text-bdc-midnight tracking-tight">Business Dev Club</h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-bdc-yellow text-bdc-midnight tracking-wide uppercase font-mono">
            UTDI
          </span>
          <BdcDots size="sm" />
        </div>
        <p className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-widest">
          Academic College Community &amp; Certification
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-retro-lg border-2 border-bdc-midnight p-8 z-10">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-bdc-midnight">Akses Portal Masuk</h2>
            <p className="text-xs text-slate-500 mt-0.5">Khusus Mahasiswa &amp; Instruktur Resmi</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-bdc-blue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Terverifikasi</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Identifier Input */}
          <div>
            <label className="block text-xs font-semibold text-bdc-midnight mb-1.5">
              NIM Mahasiswa atau Email Resmi Kampus
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-bdc-blue pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="arrafi.nur24@students.utdi.ac.id atau 245720024"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-bdc-midnight placeholder:text-slate-400 focus:bg-white focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20 outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-bdc-blue">Format:</span> @students.utdi.ac.id untuk mahasiswa
            </p>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-bdc-midnight">Kata Sandi</label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("Tautan reset kata sandi telah dikirim ke email terdaftar.", "info");
                }}
                className="text-[11px] font-medium text-bdc-blue hover:text-bdc-navy hover:underline"
              >
                Lupa sandi?
              </a>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-bdc-blue pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-bdc-midnight placeholder:text-slate-400 focus:bg-white focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-bdc-blue hover:bg-bdc-navy active:scale-[0.99] transition-all shadow-md shadow-bdc-blue/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk ke Portal Akademik</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Action Link: Register Account Baru */}
        <div className="mt-5 pt-4 border-t border-slate-200 text-center space-y-2">
          <p className="text-xs text-slate-600 font-sans">
            Belum memiliki akun mahasiswa BDC UTDI?
          </p>
          <Link
            href="/register"
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-bdc-midnight bg-[#EFF0F0] hover:bg-slate-200 border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-retro-sm"
          >
            <UserPlus className="w-4 h-4 text-bdc-blue" />
            <span>Daftar Akun Mahasiswa Baru</span>
          </Link>
        </div>

        {/* Footer info resmi */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
            Portal resmi Business Development Club (BDC) &bull; Universitas Teknologi Digital Indonesia.
            Gunakan email atau NIM resmi yang telah terdaftar di pangkalan data kampus.
          </p>
        </div>
      </div>
    </div>
  );
}
