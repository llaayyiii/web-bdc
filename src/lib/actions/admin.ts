"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { Profile, UserRole } from "../types/database";
import { createAdminClient } from "../supabase/admin";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    throw new Error("Akses ditolak: Hanya admin atau instruktur yang diizinkan.");
  }
  await hydrateFromDb();
  return user;
}

/**
 * Mengambil seluruh profil pengguna dari Supabase database
 */
export async function adminGetAllProfilesAction(): Promise<Profile[]> {
  await requireAdmin();
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: true });
      if (data && data.length > 0) {
        data.forEach((p) => bdcStore.registerProfile(p as Profile));
        return data as Profile[];
      }
    } catch (err) {
      console.warn("Gagal ambil profil dari Supabase:", err);
    }
  }
  return bdcStore.getProfiles();
}

/**
 * Mengubah kata sandi pengguna dari panel admin
 */
export async function adminUpdateUserPasswordAction(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  await requireAdmin();

  const cleanPassword = (newPassword || "").trim();
  if (!cleanPassword || cleanPassword.length < 8) {
    return {
      success: false,
      error: "Kata sandi baru minimal harus 8 karakter.",
    };
  }

  const passwordHash = await bcrypt.hash(cleanPassword, 10);

  // Update di store lokal
  const success = bdcStore.updateUserPassword(userId, cleanPassword);
  bdcStore.updateProfile(userId, { password_hash: passwordHash });
  if (!success) {
    return { success: false, error: "Pengguna tidak ditemukan." };
  }

  // Sinkronisasi live ke Supabase Auth & Profiles (jika terhubung)
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: cleanPassword,
      });
      await supabaseAdmin.from("profiles").update({
        password_hash: passwordHash,
      }).eq("id", userId);
    } catch (err: unknown) {
      console.warn("Sinkronisasi kata sandi ke Supabase Auth:", err);
    }
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/students");

  return { success: true, message: "Kata sandi pengguna berhasil diperbarui." };
}

/**
 * Mengubah hak akses role pengguna (Admin / Instruktur / Mahasiswa)
 */
export async function adminUpdateUserRoleAction(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean; profile?: any; error?: string }> {
  const currentAdmin = await requireAdmin();

  if (!["admin", "instructor", "learner"].includes(newRole)) {
    return { success: false, error: "Peran hak akses (role) tidak valid." };
  }

  // Proteksi Anti Self-Lockout
  if (currentAdmin.id === userId && newRole !== "admin") {
    return {
      success: false,
      error: "Tindakan ditolak: Anda tidak dapat mencabut hak akses administrator dari akun Anda sendiri.",
    };
  }

  // Update di store lokal
  const updatedProfile = bdcStore.updateUserRole(userId, newRole);
  if (!updatedProfile) {
    return { success: false, error: "Pengguna tidak ditemukan." };
  }

  // Sinkronisasi live ke Supabase Database Profiles
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from("profiles")
        .update({
          role: updatedProfile.role,
          role_title: updatedProfile.role_title,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    } catch (err: unknown) {
      console.warn("Sinkronisasi role ke Supabase Profiles:", err);
    }
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/students");
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return { success: true, profile: updatedProfile };
}

/**
 * Menghapus akun pengguna secara permanen dari sistem dan database
 */
export async function adminDeleteUserAction(
  userId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const currentAdmin = await requireAdmin();

  // Proteksi Anti Self-Deletion
  if (currentAdmin.id === userId) {
    return {
      success: false,
      error: "Tindakan ditolak: Anda tidak dapat menghapus akun Anda sendiri.",
    };
  }

  // Cek keberadaan profil
  const targetUser = bdcStore.getProfileById(userId);
  if (!targetUser) {
    return { success: false, error: "Pengguna tidak ditemukan." };
  }

  // Sinkronisasi hapus ke Supabase Auth & Supabase DB (jika terhubung)
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      // Hapus profil di database remote (akan meng-cascade enrollments, certs, dll)
      await supabaseAdmin.from("profiles").delete().eq("id", userId);
      // Hapus akun dari Supabase Auth
      await supabaseAdmin.auth.admin.deleteUser(userId);
    } catch (err: unknown) {
      console.warn("Sinkronisasi hapus akun ke Supabase Auth/DB:", err);
    }
  }

  // Hapus dari store in-memory
  const deleted = bdcStore.deleteUser(userId);
  if (!deleted) {
    return { success: false, error: "Gagal menghapus pengguna dari penyimpanan data lokal." };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/students");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");

  return {
    success: true,
    message: `Akun ${targetUser.full_name} (${targetUser.email}) berhasil dihapus permanen.`,
  };
}
