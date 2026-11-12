"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Mail,
  Hash,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  UserPlus,
  Sparkles,
} from "lucide-react";
import { registerAction } from "@/lib/actions/auth";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";
import { UtdiCampusInteractiveScene } from "@/components/hero/UtdiCampusInteractiveScene";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [nimId, setNimId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side quick validations
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Kata sandi minimal harus 8 karakter.");
      return;
    }

    if (!email.toLowerCase().endsWith("@students.utdi.ac.id")) {
      setErrorMessage("Pendaftaran akun mahasiswa wajib menggunakan email kampus @students.utdi.ac.id.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("nim_id", nimId);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);

    try {
      const res = await registerAction(formData);
      if (!res.success) {
        setErrorMessage(res.error || "Pendaftaran gagal. Periksa kembali data Anda.");
        showToast(res.error || "Pendaftaran gagal.", "error");
        setLoading(false);
        return;
      }

      showToast("Pendaftaran Berhasil! Selamat datang di BDC UTDI.", "success");
      router.push(res.redirectTo || "/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat mendaftar.";
      setErrorMessage(msg);
      showToast(msg, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bdc-surface flex flex-col items-center justify-center p-4 relative overflow-hidden isolate">
      {/* Background Hero Scene (Lego Kampus UTDI, Awan Pixel & Washes) */}
      <UtdiCampusInteractiveScene />

      {/* Back to Login Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/login"
          className="retro-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-xs font-bold text-bdc-midnight shadow-retro-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Login</span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="mb-5 flex flex-col items-center text-center z-10">
        <div className="mb-2.5 transition-transform hover:scale-105">
          <Image
            src="/logo.svg"
            alt="BDC Logo"
            width={85}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl sm:text-2xl font-black font-space text-bdc-midnight tracking-tight">
            Registrasi Mahasiswa Baru
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-bdc-yellow text-bdc-midnight tracking-wide uppercase font-mono">
            UTDI
          </span>
          <BdcDots size="sm" />
        </div>
        <p className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-widest">
          Academic College Community &amp; Certification Portal
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-retro-lg border-2 border-bdc-midnight p-6 sm:p-8 z-10">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-bdc-midnight">Formulir Akun Baru</h2>
            <p className="text-xs text-slate-500 mt-0.5">Khusus Mahasiswa Aktif UTDI Cohort 2026/2027</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-bdc-blue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Resmi UTDI</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 leading-relaxed font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 font-sans">
          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-semibold text-bdc-midnight mb-1 font-space">
              Nama Lengkap Mahasiswa *
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-bdc-blue pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Muhammad Farhan"
                className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-bdc-midnight placeholder:text-slate-400 focus:bg-white focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* NIM & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-bdc-midnight mb-1 font-space">
                NIM Resmi Kampus *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-bdc-blue pointer-events-none">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={nimId}
                  onChange={(e) => setNimId(e.target.value)}
                  placeholder="245720099"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-bdc-midnight placeholder:text-slate-400 focus:bg-white focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20 outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-bdc-midnight mb-1 font-space">
                Email Kampus *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-bdc-blue pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farhan24@students.utdi.ac.id"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-bdc-midnight placeholder:text-slate-400 focus:bg-white focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20 outline-none transition-all font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 -mt-1 font-sans">
            Wajib berakhiran <strong className="text-bdc-blue">@students.utdi.ac.id</strong>
          </p>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-bdc-midnight mb-1 font-space">
                Kata Sandi *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-bdc-blue pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-bdc-midnight placeholder:text-slate-400 focus:bg-white focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-bdc-midnight mb-1 font-space">
                Konfirmasi Sandi *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-bdc-blue pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi sandi"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-bdc-midnight placeholder:text-slate-400 focus:bg-white focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Bonus Info Pill */}
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2 shadow-retro-sm">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Bonus Pendaftaran: Dapatkan langsung <strong className="text-amber-800">+100 XP</strong> ke leaderboard!</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-bdc-blue hover:bg-bdc-navy active:scale-[0.99] transition-all shadow-md shadow-bdc-blue/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-bdc-yellow" />
                <span>Daftar Akun Mahasiswa Baru</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link back to login */}
        <div className="mt-5 pt-4 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-600 font-sans">
            Sudah memiliki akun resmi kampus?{" "}
            <Link
              href="/login"
              className="font-bold text-bdc-blue hover:text-bdc-navy hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
