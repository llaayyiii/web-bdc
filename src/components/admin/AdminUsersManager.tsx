"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Trash2,
  Pencil,
} from "lucide-react";
import { Profile, UserRole } from "@/lib/types/database";
import {
  adminUpdateUserPasswordAction,
  adminUpdateUserRoleAction,
  adminDeleteUserAction,
  adminUpdateStudentIdentityAction,
} from "@/lib/actions/admin";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";

interface AdminUsersManagerProps {
  initialProfiles: Profile[];
  currentUserId: string;
}

export function AdminUsersManager({
  initialProfiles,
  currentUserId,
}: AdminUsersManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // State Password Modal
  const [passwordModalUser, setPasswordModalUser] = useState<Profile | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // State Role Modal
  const [roleModalUser, setRoleModalUser] = useState<Profile | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("learner");
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  // State Delete User Modal
  const [deleteModalUser, setDeleteModalUser] = useState<Profile | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // State Edit User Modal
  const [editModalUser, setEditModalUser] = useState<Profile | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editNimId, setEditNimId] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.nim_id.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || p.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalLearners = profiles.filter((p) => p.role === "learner").length;
  const totalInstructors = profiles.filter((p) => p.role === "instructor").length;
  const totalAdmins = profiles.filter((p) => p.role === "admin").length;

  // Generator kata sandi acak
  const handleGenerateRandomPassword = () => {
    const randomChars = Math.random().toString(36).slice(-6).toUpperCase();
    const generated = `BDC26#${randomChars}`;
    setNewPassword(generated);
    setConfirmPassword(generated);
    setShowPasswordText(true);
    showToast("Kata sandi acak dibuat otomatis.", "info");
  };

  // Submit Ubah Kata Sandi
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser) return;
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("Kata sandi baru minimal harus 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const res = await adminUpdateUserPasswordAction(passwordModalUser.id, newPassword);
      if (!res.success) {
        setPasswordError(res.error || "Gagal memperbarui kata sandi.");
        setIsPasswordLoading(false);
        return;
      }

      showToast(
        `Kata sandi untuk ${passwordModalUser.full_name} berhasil diubah!`,
        "success"
      );
      setPasswordModalUser(null);
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordLoading(false);
      router.refresh();
    } catch {
      setPasswordError("Terjadi kendala saat menghubungi server.");
      setIsPasswordLoading(false);
    }
  };

  // Submit Ubah Hak Akses (Role)
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalUser) return;
    setRoleError(null);

    // Proteksi self-lockout
    if (roleModalUser.id === currentUserId && selectedRole !== "admin") {
      setRoleError("Anda tidak dapat mencabut hak akses administrator dari akun Anda sendiri.");
      return;
    }

    setIsRoleLoading(true);
    try {
      const res = await adminUpdateUserRoleAction(roleModalUser.id, selectedRole);
      if (!res.success) {
        setRoleError(res.error || "Gagal mengubah hak akses.");
        setIsRoleLoading(false);
        return;
      }

      // Update state lokal
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === roleModalUser.id
            ? { ...p, role: selectedRole, role_title: res.profile?.role_title || p.role_title }
            : p
        )
      );

      showToast(
        `Hak akses ${roleModalUser.full_name} berhasil diubah menjadi ${
          selectedRole === "admin"
            ? "Administrator"
            : selectedRole === "instructor"
            ? "Instruktur"
            : "Mahasiswa"
        }!`,
        "success"
      );
      setRoleModalUser(null);
      setIsRoleLoading(false);
      router.refresh();
    } catch {
      setRoleError("Terjadi kendala saat menghubungi server.");
      setIsRoleLoading(false);
    }
  };

  // Submit Hapus Akun Pengguna
  const handleDeleteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteModalUser) return;
    setDeleteError(null);

    // Proteksi akun sendiri
    if (deleteModalUser.id === currentUserId) {
      setDeleteError("Anda tidak dapat menghapus akun Anda sendiri.");
      return;
    }

    setIsDeleteLoading(true);
    try {
      const res = await adminDeleteUserAction(deleteModalUser.id);
      if (!res.success) {
        setDeleteError(res.error || "Gagal menghapus pengguna.");
        setIsDeleteLoading(false);
        return;
      }

      // Hapus dari state lokal
      setProfiles((prev) => prev.filter((p) => p.id !== deleteModalUser.id));

      showToast(
        res.message || `Akun ${deleteModalUser.full_name} berhasil dihapus permanen.`,
        "success"
      );
      setDeleteModalUser(null);
      setIsDeleteLoading(false);
      router.refresh();
    } catch {
      setDeleteError("Terjadi kendala sistem saat menghapus akun.");
      setIsDeleteLoading(false);
    }
  };

  // Submit Edit Nama & NIM Pengguna
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalUser) return;
    setEditError(null);

    if (!editFullName.trim() || editFullName.trim().length < 2) {
      setEditError("Nama lengkap minimal harus 2 karakter.");
      return;
    }

    if (!editNimId.trim() || editNimId.trim().length < 3) {
      setEditError("NIM resmi kampus minimal harus 3 karakter.");
      return;
    }

    setIsEditLoading(true);
    try {
      const res = await adminUpdateStudentIdentityAction(
        editModalUser.id,
        editFullName.trim(),
        editNimId.trim()
      );

      if (!res.success) {
        setEditError(res.error || "Gagal memperbarui data pengguna.");
        setIsEditLoading(false);
        return;
      }

      // Update state lokal
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === editModalUser.id
            ? { ...p, full_name: editFullName.trim(), nim_id: editNimId.trim() }
            : p
        )
      );

      showToast(`Data ${editFullName.trim()} (${editNimId.trim()}) berhasil diperbarui!`, "success");
      setEditModalUser(null);
      setIsEditLoading(false);
      router.refresh();
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
      setIsEditLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Quick Stats Inset Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#fffefa] p-4 rounded-2xl border border-[#d9dfd7] shadow-retro-sm">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Pengguna
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-pixel text-2xl sm:text-3xl text-bdc-midnight">
              {profiles.length}
            </span>
            <span className="font-mono text-xs text-slate-400">Akun</span>
          </div>
        </div>

        <div className="bg-[#fffefa] p-4 rounded-2xl border border-[#d9dfd7] shadow-retro-sm">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
            Administrator
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-pixel text-2xl sm:text-3xl text-amber-700">
              {totalAdmins}
            </span>
            <span className="font-mono text-xs text-slate-400">Admin</span>
          </div>
        </div>

        <div className="bg-[#fffefa] p-4 rounded-2xl border border-[#d9dfd7] shadow-retro-sm">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
            Instruktur
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-pixel text-2xl sm:text-3xl text-purple-700">
              {totalInstructors}
            </span>
            <span className="font-mono text-xs text-slate-400">Tutor</span>
          </div>
        </div>

        <div className="bg-[#fffefa] p-4 rounded-2xl border border-[#d9dfd7] shadow-retro-sm">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-bdc-blue block">
            Mahasiswa
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-pixel text-2xl sm:text-3xl text-bdc-blue">
              {totalLearners}
            </span>
            <span className="font-mono text-xs text-slate-400">Aktif</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#eae9dc] rounded-2xl border border-[#d9dfd7] overflow-x-auto">
          <button
            type="button"
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              roleFilter === "all"
                ? "bg-white text-bdc-midnight shadow-retro-sm border border-slate-300"
                : "text-slate-600 hover:text-bdc-midnight"
            }`}
          >
            Semua ({profiles.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("admin")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              roleFilter === "admin"
                ? "bg-amber-100 text-amber-900 shadow-retro-sm border border-amber-300"
                : "text-slate-600 hover:text-amber-800"
            }`}
          >
            Admin ({totalAdmins})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("instructor")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              roleFilter === "instructor"
                ? "bg-purple-100 text-purple-900 shadow-retro-sm border border-purple-300"
                : "text-slate-600 hover:text-purple-800"
            }`}
          >
            Instruktur ({totalInstructors})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("learner")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              roleFilter === "learner"
                ? "bg-blue-100 text-blue-900 shadow-retro-sm border border-blue-300"
                : "text-slate-600 hover:text-blue-800"
            }`}
          >
            Mahasiswa ({totalLearners})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIM, atau email..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#fffefa] border border-slate-300 rounded-2xl text-xs text-bdc-midnight placeholder:text-slate-400 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm shadow-retro-sm transition-all"
          />
        </div>
      </div>

      {/* 3. Main Users Table */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] overflow-hidden shadow-retro">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold border-b border-[#d9dfd7]">
              <tr>
                <th className="px-5 py-3.5">Nama &amp; Peran Akun</th>
                <th className="px-4 py-3.5">NIM / ID Kampus</th>
                <th className="px-4 py-3.5">Email Resmi (@utdi)</th>
                <th className="px-4 py-3.5 text-center">Hak Akses</th>
                <th className="px-5 py-3.5 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9dfd7]">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-mono text-xs">
                    Tidak ada akun pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((user) => {
                  const isCurrentAuth = user.id === currentUserId;

                  return (
                    <tr key={user.id} className="hover:bg-[#fff8e6] transition-colors">
                      {/* Nama & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl font-pixel text-xs flex items-center justify-center shrink-0 border shadow-retro-sm ${
                              user.role === "admin"
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : user.role === "instructor"
                                ? "bg-purple-100 text-purple-900 border-purple-300"
                                : "bg-bdc-navy text-bdc-yellow border-bdc-midnight"
                            }`}
                          >
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-space font-bold text-sm text-bdc-midnight truncate">
                                {user.full_name}
                              </span>
                              {isCurrentAuth && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Akun Anda
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 truncate">
                              {user.role_title || "-"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* NIM */}
                      <td className="px-4 py-4 font-mono font-bold text-bdc-blue text-xs">
                        {user.nim_id}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4 font-mono text-slate-600 text-xs">
                        {user.email}
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold border shadow-retro-sm ${
                            user.role === "admin"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : user.role === "instructor"
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : "bg-blue-50 text-blue-800 border-blue-300"
                          }`}
                        >
                          {user.role === "admin" && <Shield className="w-3.5 h-3.5 text-amber-600" />}
                          {user.role === "instructor" && (
                            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                          )}
                          {user.role === "learner" && <User className="w-3.5 h-3.5 text-blue-600" />}
                          <span>
                            {user.role === "admin"
                              ? "ADMINISTRATOR"
                              : user.role === "instructor"
                              ? "INSTRUKTUR"
                              : "MAHASISWA"}
                          </span>
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* Tombol Edit Nama & NIM */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditModalUser(user);
                              setEditFullName(user.full_name);
                              setEditNimId(user.nim_id);
                              setEditError(null);
                            }}
                            className="retro-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-bdc-midnight text-xs font-bold border border-slate-300 shadow-retro-sm transition-all cursor-pointer"
                            title="Koreksi nama lengkap atau NIM"
                          >
                            <Pencil className="w-3.5 h-3.5 text-bdc-blue" />
                            <span>Edit</span>
                          </button>

                          {/* Tombol Ubah Sandi */}
                          <button
                            type="button"
                            onClick={() => {
                              setPasswordModalUser(user);
                              setNewPassword("");
                              setConfirmPassword("");
                              setPasswordError(null);
                            }}
                            className="retro-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-bdc-midnight text-xs font-bold border border-slate-300 shadow-retro-sm transition-all cursor-pointer"
                            title="Ubah kata sandi pengguna ini"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-600" />
                            <span>Ganti Sandi</span>
                          </button>

                          {/* Tombol Ubah Role */}
                          <button
                            type="button"
                            onClick={() => {
                              setRoleModalUser(user);
                              setSelectedRole(user.role);
                              setRoleError(null);
                            }}
                            className="retro-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bdc-surface hover:bg-slate-200 text-bdc-midnight text-xs font-bold border border-slate-300 shadow-retro-sm transition-all cursor-pointer"
                            title="Atur hak akses admin atau mahasiswa"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-bdc-blue" />
                            <span>Hak Akses</span>
                          </button>

                          {/* Tombol Hapus Akun */}
                          {!isCurrentAuth ? (
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteModalUser(user);
                                setDeleteError(null);
                              }}
                              className="retro-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-300 shadow-retro-sm transition-all cursor-pointer"
                              title="Hapus akun pengguna ini secara permanen"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Hapus</span>
                            </button>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                              title="Akun Anda yang sedang aktif tidak dapat dihapus"
                            >
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>Terkunci</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL: UBAH KATA SANDI */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-bdc-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border-2 border-bdc-midnight shadow-retro-lg overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#f4f3ea] border-b border-[#d9dfd7] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-sm text-bdc-midnight">
                    Ganti Kata Sandi Pengguna
                  </h3>
                  <span className="font-mono text-[10px] text-slate-500">
                    ID: {passwordModalUser.nim_id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-bdc-midnight hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePassword} className="p-6 space-y-4">
              {/* Target User Info */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-bdc-midnight block">
                    {passwordModalUser.full_name}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {passwordModalUser.email}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {passwordModalUser.role}
                </span>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-bdc-midnight font-space">
                    Kata Sandi Baru
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPassword}
                    className="text-[11px] font-mono font-bold text-bdc-blue hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-bdc-gold" />
                    <span>Acak Sandi Otomatis</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPasswordText ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-bdc-midnight font-mono focus:bg-white focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-bdc-midnight font-space">
                  Ulangi Kata Sandi Baru
                </label>
                <input
                  type={showPasswordText ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-bdc-midnight font-mono focus:bg-white focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm transition-all"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="retro-btn px-5 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold shadow-retro-sm transition-all border border-bdc-midnight flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isPasswordLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-bdc-yellow" />
                      <span>Simpan Sandi Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: UBAH HAK AKSES ROLE */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 bg-bdc-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border-2 border-bdc-midnight shadow-retro-lg overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#f4f3ea] border-b border-[#d9dfd7] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-bdc-blue">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-sm text-bdc-midnight">
                    Ubah Hak Akses Pengguna
                  </h3>
                  <span className="font-mono text-[10px] text-slate-500">
                    Atur perizinan portal BDC UTDI
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-bdc-midnight hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveRole} className="p-6 space-y-4">
              {/* Target User Info */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-bdc-midnight block">
                    {roleModalUser.full_name}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    NIM: {roleModalUser.nim_id} ({roleModalUser.email})
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Saat Ini: {roleModalUser.role}
                </span>
              </div>

              {roleError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{roleError}</span>
                </div>
              )}

              {/* Role Radio Choices */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-bdc-midnight font-space block mb-1">
                  Pilih Tingkat Akses Baru:
                </label>

                {/* Role: Administrator */}
                <label
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    selectedRole === "admin"
                      ? "bg-amber-50/80 border-amber-400 shadow-retro-sm"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="roleOption"
                    value="admin"
                    checked={selectedRole === "admin"}
                    onChange={() => setSelectedRole("admin")}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span className="font-space font-bold text-xs text-amber-900">
                        Administrator (Kurator)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Hak akses tertinggi: Mengelola seluruh menu panel admin, bank soal, sesi barcode, penilaian tugas, dan manajemen kata sandi/hak akses pengguna.
                    </p>
                  </div>
                </label>

                {/* Role: Instruktur */}
                <label
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    selectedRole === "instructor"
                      ? "bg-purple-50/80 border-purple-400 shadow-retro-sm"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="roleOption"
                    value="instructor"
                    checked={selectedRole === "instructor"}
                    onChange={() => setSelectedRole("instructor")}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-purple-600" />
                      <span className="font-space font-bold text-xs text-purple-900">
                        Instruktur Komunitas
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Hak akses kurasi: Membuat materi modul, menyelenggarakan sesi live hands-on, dan mengevaluasi tugas mahasiswa.
                    </p>
                  </div>
                </label>

                {/* Role: Mahasiswa / Learner */}
                <label
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    selectedRole === "learner"
                      ? "bg-blue-50/80 border-blue-400 shadow-retro-sm"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="roleOption"
                    value="learner"
                    checked={selectedRole === "learner"}
                    onChange={() => setSelectedRole("learner")}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-bdc-blue" />
                      <span className="font-space font-bold text-xs text-blue-900">
                        Mahasiswa (Active Learner)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Akses standar portal: Mengikuti modul, melakukan presensi barcode proyektor, mengumpulkan penugasan capstone, dan mencetak sertifikat digital.
                    </p>
                  </div>
                </label>
              </div>

              {/* Self-lockout warning if current admin edits themselves */}
              {roleModalUser.id === currentUserId && selectedRole !== "admin" && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Peringatan Proteksi:</strong> Anda sedang login dengan akun ini. Anda tidak dapat menurunkan hak akses admin dari akun sendiri.
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isRoleLoading || (roleModalUser.id === currentUserId && selectedRole !== "admin")}
                  className="retro-btn px-5 py-2 rounded-xl bg-bdc-blue hover:bg-blue-700 text-white text-xs font-bold shadow-retro-sm transition-all border border-bdc-midnight flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isRoleLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Terapkan Hak Akses</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 5. MODAL: KONFIRMASI HAPUS AKUN PENGGUNA */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 bg-bdc-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border-2 border-bdc-midnight shadow-retro-lg overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-sm text-rose-950">
                    Konfirmasi Hapus Akun
                  </h3>
                  <span className="font-mono text-[10px] text-rose-600 font-bold">
                    TINDAKAN PERMANEN TIDAK DAPAT DIBATALKAN
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-bdc-midnight hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleDeleteUser} className="p-6 space-y-4">
              {/* Target User Detail Box */}
              <div className="p-4 rounded-2xl bg-[#f4f3ea] border border-[#d9dfd7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                    Profil Pengguna
                  </span>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-300 text-bdc-midnight">
                    {deleteModalUser.role.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-space font-bold text-sm text-bdc-midnight">
                    {deleteModalUser.full_name}
                  </p>
                  <p className="font-mono text-xs text-slate-600">
                    NIM: {deleteModalUser.nim_id}
                  </p>
                  <p className="font-mono text-xs text-bdc-blue mt-0.5">
                    {deleteModalUser.email}
                  </p>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Apakah Anda yakin ingin menghapus akun ini?</p>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    Seluruh riwayat partisipasi kelas, berkas tugas, sertifikat digital, dan catatan presensi pengguna ini akan dihapus secara permanen dari server BDC UTDI serta Supabase Auth.
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isDeleteLoading || deleteModalUser.id === currentUserId}
                  className="retro-btn px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-retro-sm transition-all border border-rose-800 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDeleteLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 text-white" />
                      <span>Hapus Akun Permanen</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: KOREKSI IDENTITAS PENGGUNA (NAMA & NIM) */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 bg-bdc-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border-2 border-bdc-midnight shadow-retro-lg overflow-hidden animate-in fade-in zoom-in-95 font-sans">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-bdc-navy text-bdc-yellow flex items-center justify-center border border-bdc-midnight shadow-retro-sm">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-sm text-bdc-midnight">
                    Koreksi Data Pengguna
                  </h3>
                  <p className="font-mono text-[10px] text-slate-500 font-bold uppercase">
                    Perbarui Nama Resmi &amp; NIM Kampus
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-bdc-midnight hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              {editError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block font-space font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Nama Lengkap</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Contoh: Arrafi Nur Hafiz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm bg-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block font-space font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>NIM Kampus (Nomor Induk)</span>
                </label>
                <input
                  type="text"
                  required
                  value={editNimId}
                  onChange={(e) => setEditNimId(e.target.value)}
                  placeholder="Contoh: 245720024"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm bg-white font-mono text-xs font-bold text-bdc-blue"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#EFF0F0] border border-slate-300 text-[11px] text-slate-600 leading-relaxed">
                ℹ️ <strong>Sinkronisasi Menyeluruh:</strong> Nama &amp; NIM yang diperbarui akan otomatis disinkronkan ke <strong>sertifikat resmi</strong>, <strong>catatan presensi</strong>, <strong>berkas tugas</strong>, dan <strong>Supabase Auth</strong>.
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isEditLoading}
                  onClick={() => setEditModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isEditLoading}
                  className="retro-btn px-5 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold shadow-retro-sm transition-all border border-bdc-midnight flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isEditLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-bdc-yellow" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
