"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle, Sparkles, ArrowLeft } from "lucide-react";
import { loginAction, demoLoginAction } from "@/lib/actions/auth";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState("255720056");
  const [password, setPassword] = useState("secretPassword123");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

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

  const handleQuickLogin = async (nimOrEmail: string, roleName: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await demoLoginAction(nimOrEmail);
      if (res.success) {
        showToast(`Masuk sebagai ${roleName} berhasil!`, "success");
        router.push(res.redirectTo || "/dashboard");
        router.refresh();
      } else {
        setErrorMessage(res.error || "Gagal masuk.");
        setLoading(false);
      }
    } catch {
      setErrorMessage("Koneksi gagal.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bdc-surface bg-voxel-grid flex flex-col items-center justify-center p-4 relative overflow-hidden">
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

      {/* Subtle Background Geometry */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-bdc-blue/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-bdc-navy/10 blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center z-10">
        <div className="w-14 h-14 rounded-2xl bg-bdc-midnight p-3 flex items-center justify-center shadow-retro mb-3 border-2 border-bdc-midnight">
          <Image src="/logo.svg" alt="BDC Logo" width={32} height={32} className="w-8 h-8 object-contain" />
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
                placeholder="255720056 atau nama@students.utdi.ac.id"
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

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
              atau masuk dengan
            </span>
          </div>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Google Akun Kampus (@students.utdi.ac.id)</span>
        </button>

        {/* Quick Demo Selector for Review & Testing */}
        <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-bdc-gold" />
              Demo Akun Instan:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("255720056", "Siti Rahmawati (Siswa)")}
              className="p-2 rounded-lg bg-bdc-surface hover:bg-slate-200 border border-slate-200 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-bdc-midnight group-hover:text-bdc-blue truncate">
                Siti Rahmawati
              </div>
              <div className="text-[10px] text-slate-500">NIM: 255720056 (Siswa)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("bagas.triaji@utdi.ac.id", "Bagas Triaji (Admin)")}
              className="p-2 rounded-lg bg-bdc-surface hover:bg-slate-200 border border-slate-200 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-bdc-midnight group-hover:text-bdc-blue truncate">
                Bagas Triaji
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">Kemahasiswaan (Admin)</div>
            </button>
          </div>
        </div>
      </div>

      {/* Google SSO Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-bdc-midnight/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="font-bold text-bdc-midnight text-sm">Pilih Akun Google Kampus</span>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Sesuai kebijakan akademik BDC, hanya akun Google dengan domain resmi{" "}
              <strong className="text-bdc-blue">@students.utdi.ac.id</strong> yang dapat ditautkan:
            </p>
            <div className="space-y-2 mb-4">
              <button
                onClick={() => {
                  setShowGoogleModal(false);
                  handleQuickLogin("255720056@students.utdi.ac.id", "Siti Rahmawati");
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-bdc-blue hover:bg-blue-50/50 flex items-center justify-between transition-all"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-bdc-midnight truncate">Siti Rahmawati</span>
                  <span className="text-[11px] text-slate-500 truncate">255720056@students.utdi.ac.id</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                  Valid UTDI
                </span>
              </button>
              <button
                onClick={() => {
                  showToast("Akses ditolak: Akun personal @gmail.com tidak diizinkan. Gunakan email @students.utdi.ac.id.", "error");
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:bg-rose-50/50 flex items-center justify-between transition-all opacity-70"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-700 truncate">Akun Pribadi</span>
                  <span className="text-[11px] text-slate-400 truncate">siti.pribadi@gmail.com</span>
                </div>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-semibold">
                  Ditolak
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
