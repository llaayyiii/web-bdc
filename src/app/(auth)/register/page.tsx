"use client";

import React, { useEffect, useState } from "react";
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
  KeyRound,
  RefreshCw,
} from "lucide-react";
import {
  registerAction,
  verifyRegistrationOtpAction,
  resendRegistrationOtpAction,
} from "@/lib/actions/auth";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";
import { UtdiCampusInteractiveScene } from "@/components/hero/UtdiCampusInteractiveScene";

/** Sembunyikan sebagian alamat email untuk ditampilkan di layar verifikasi. */
function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(user.length - visible.length, 3))}@${domain}`;
}

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

  // Status langkah verifikasi OTP
  const [step, setStep] = useState<"form" | "otp">("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // Hitung mundur cooldown kirim ulang kode
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const displayError = step === "form" ? errorMessage : otpError;

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

      if (res.requiresOtp) {
        // Langkah 2: minta kode OTP dari email kampus
        setPendingEmail(res.email || email);
        setOtpCode("");
        setOtpError(null);
        setStep("otp");
        setResendIn(60);
        setLoading(false);
        showToast("Kode verifikasi telah dikirim ke email kampus Anda.", "success");
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (otpCode.length < 6) {
      setOtpError("Masukkan kode verifikasi yang Anda terima di email.");
      return;
    }

    setVerifying(true);
    try {
      const res = await verifyRegistrationOtpAction(otpCode);
      if (!res.success) {
        setOtpError(res.error || "Verifikasi gagal. Periksa kembali kode Anda.");
        showToast(res.error || "Verifikasi gagal.", "error");
        setVerifying(false);
        return;
      }

      showToast("Verifikasi berhasil! Akun Anda aktif. Selamat datang di BDC UTDI.", "success");
      router.push(res.redirectTo || "/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat verifikasi.";
      setOtpError(msg);
      showToast(msg, "error");
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || resending) return;
    setResending(true);
    try {
      const res = await resendRegistrationOtpAction();
      if (!res.success) {
        showToast(res.error || "Gagal mengirim ulang kode verifikasi.", "error");
        return;
      }
      setResendIn(60);
      showToast("Kode verifikasi baru telah dikirim ke email Anda.", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim ulang kode verifikasi.";
      showToast(msg, "error");
    } finally {
      setResending(false);
    }
  };

  const backToForm = () => {
    setStep("form");
    setOtpCode("");
    setOtpError(null);
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
            <h2 className="text-base sm:text-lg font-bold text-bdc-midnight">
              {step === "form" ? "Formulir Akun Baru" : "Verifikasi Email Kampus"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === "form"
                ? "Khusus Mahasiswa Aktif UTDI Cohort 2026/2027"
                : "Masukkan kode verifikasi yang dikirim ke email Anda"}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-bdc-blue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Resmi UTDI</span>
          </div>
        </div>

        {displayError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 leading-relaxed font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{displayError}</span>
          </div>
        )}

        {step === "form" ? (
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
        ) : (
        <form onSubmit={handleVerify} className="flex flex-col gap-3.5 font-sans">
          {/* Email tujuan kode OTP (disamarkan) */}
          <div className="flex flex-col items-center text-center pt-1 pb-1">
            <div className="w-14 h-14 rounded-2xl bg-bdc-blue/10 border-2 border-bdc-blue/30 flex items-center justify-center mb-3 shadow-retro-sm">
              <KeyRound className="w-7 h-7 text-bdc-blue" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Kami telah mengirim kode verifikasi ke
            </p>
            <p className="text-xs sm:text-sm font-bold text-bdc-midnight font-mono mt-1 break-all">
              {maskEmail(pendingEmail)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5 font-sans">
              Kode berlaku <strong className="text-bdc-blue">10 menit</strong>. Periksa juga folder{" "}
              <strong className="text-bdc-blue">Spam</strong>.
            </p>
          </div>

          {/* Input Kode OTP */}
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={10}
            required
            autoFocus
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full py-3 text-center font-mono text-xl sm:text-2xl font-bold tracking-[0.35em] text-bdc-midnight bg-slate-50/70 border border-slate-200 rounded-xl placeholder:text-slate-300 focus:bg-white focus:border-bdc-blue focus:ring-2 focus:ring-bdc-blue/20 outline-none transition-all"
          />

          {/* Tombol Verifikasi */}
          <button
            type="submit"
            disabled={verifying || otpCode.length < 6}
            className="w-full mt-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-bdc-blue hover:bg-bdc-navy active:scale-[0.99] transition-all shadow-md shadow-bdc-blue/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {verifying ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-bdc-yellow" />
                <span>Verifikasi &amp; Aktifkan Akun</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Aksi tambahan */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendIn > 0 || resending}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans text-bdc-blue hover:text-bdc-navy disabled:text-slate-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
              <span>
                {resendIn > 0 ? `Kirim ulang dalam ${resendIn}s` : "Kirim ulang kode"}
              </span>
            </button>
            <button
              type="button"
              onClick={backToForm}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans text-slate-500 hover:text-bdc-midnight transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ganti data pendaftaran</span>
            </button>
          </div>
        </form>
        )}

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
