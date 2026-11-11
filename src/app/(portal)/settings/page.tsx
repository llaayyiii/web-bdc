"use client";

import React, { useState } from "react";
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
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("Siti Rahmawati");
  const [nimId, setNimId] = useState("255720056");
  const [email, setEmail] = useState("255720056@students.utdi.ac.id");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-bdc-midnight tracking-tight">
          Pengaturan Akun &amp; Sistem
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola profil identitas mahasiswa, keamanan akun, dan diagnostik integrasi cloud
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile & Password Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-bdc-midnight uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-bdc-blue" />
              <span>Identitas Mahasiswa</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-bdc-midnight focus:bg-white focus:outline-none focus:border-bdc-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIM / Nomor Induk Mahasiswa
                  </label>
                  <input
                    type="text"
                    disabled
                    value={nimId}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Resmi Kampus (@students.utdi.ac.id)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Email terikat permanen dengan domain resmi UTDI Yogyakarta.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Periode Akademik
                  </label>
                  <input
                    type="text"
                    disabled
                    value="2026/2027"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi Kampus
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Yogyakarta"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-bdc-blue hover:bg-bdc-navy text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Menyimpan..." : "Simpan Profil"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password Change Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-bdc-midnight uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-bdc-blue" />
              <span>Ganti Kata Sandi</span>
            </h2>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Lama
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-bdc-midnight focus:bg-white focus:outline-none focus:border-bdc-blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-bdc-midnight focus:bg-white focus:outline-none focus:border-bdc-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ulangi Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-bdc-midnight focus:bg-white focus:outline-none focus:border-bdc-blue"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-bdc-midnight text-xs font-bold transition-all"
                >
                  Perbarui Sandi
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Cloud & Infrastructure Diagnostics */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Status Integrasi Sistem</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Hosting Provider:</span>
                  <span className="font-bold text-bdc-midnight">Vercel (Free Tier)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Next.js App Router (Turbopack)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Database Engine:</span>
                  <span className="font-bold text-bdc-midnight">Supabase PostgreSQL</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>RLS &amp; Cookies SSR Siap Digunakan</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Enforcement Domain:</span>
                  <span className="font-mono font-bold text-bdc-blue text-[11px]">
                    @students.utdi.ac.id
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">
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
