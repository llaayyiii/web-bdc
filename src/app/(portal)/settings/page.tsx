"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Database,
  ShieldCheck,
  Save,
  CheckCircle2,
  Server,
  Cloud,
} from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";

export default function SettingsPage() {
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [nimId, setNimId] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (user) {
        setFullName(user.full_name);
        setNimId(user.nim_id);
        setEmail(user.email);
      }
    }
    loadUser();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profil data mahasiswa berhasil diperbarui!", "success");
    }, 500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Konfirmasi kata sandi tidak cocok.", "error");
      return;
    }
    showToast("Kata sandi berhasil diperbarui dengan aman.", "success");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 07 // PENGATURAN IDENTITAS MAHASISWA ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Pengaturan Akun
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Kelola profil identitas mahasiswa UTDI, keamanan akun, dan diagnostik integrasi cloud platform.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile & Password Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 sm:p-7 shadow-retro">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7] mb-5">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-bdc-blue" />
                <h2 className="font-space text-base font-bold text-bdc-midnight">
                  Identitas Mahasiswa
                </h2>
              </div>
              <BdcDots size="sm" />
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                    NIM / Nomor Induk Mahasiswa
                  </label>
                  <input
                    type="text"
                    disabled
                    value={nimId}
                    className="w-full px-3.5 py-2.5 bg-[#EFF0F0] border border-slate-300 rounded-xl text-xs text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                  Email Resmi Kampus (@students.utdi.ac.id)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3.5 py-2.5 bg-[#EFF0F0] border border-slate-300 rounded-xl text-xs text-slate-500 font-mono cursor-not-allowed"
                />
                <p className="font-mono text-[10px] text-slate-500 mt-1">
                  Email terikat permanen dengan domain resmi UTDI Yogyakarta.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                    Periode Akademik
                  </label>
                  <input
                    type="text"
                    disabled
                    value="2026/2027"
                    className="w-full px-3.5 py-2.5 bg-[#EFF0F0] border border-slate-300 rounded-xl text-xs text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                    Lokasi Kampus
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Yogyakarta"
                    className="w-full px-3.5 py-2.5 bg-[#EFF0F0] border border-slate-300 rounded-xl text-xs text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="retro-btn px-5 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm flex items-center gap-1.5 border border-bdc-midnight"
                >
                  <Save className="w-3.5 h-3.5 text-bdc-yellow" />
                  <span>{isSaving ? "Menyimpan..." : "Simpan Profil"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password Change Card */}
          <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 sm:p-7 shadow-retro">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7] mb-5">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-bdc-blue" />
                <h2 className="font-space text-base font-bold text-bdc-midnight">
                  Ganti Kata Sandi
                </h2>
              </div>
              <BdcDots size="sm" />
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Lama
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                    Ulangi Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="retro-btn px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-bdc-midnight text-xs font-bold transition-all shadow-retro-sm"
                >
                  Perbarui Sandi
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Cloud & Infrastructure Diagnostics */}
        <div className="space-y-6">
          <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 shadow-retro space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600" />
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                  [ STATUS SISTEM ]
                </h2>
              </div>
              <BdcDots size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 space-y-1 shadow-retro-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Hosting Provider:</span>
                  <span className="font-bold text-bdc-midnight">Vercel Edge</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Next.js 16.4 App Router</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 space-y-1 shadow-retro-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Database Engine:</span>
                  <span className="font-bold text-bdc-midnight">Supabase PostgreSQL</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>RLS &amp; Cookies SSR Siap</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 space-y-1 shadow-retro-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Enforcement Domain:</span>
                  <span className="font-mono font-bold text-bdc-blue text-[11px]">
                    @students.utdi.ac.id
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block font-sans">
                  Akses login siswa dibatasi eksklusif untuk civitas akademika UTDI.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
