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
 * Mengubah Nama Lengkap dan NIM Mahasiswa (dengan cascading update ke sertifikat, presensi, & tugas)
 */
export async function adminUpdateStudentIdentityAction(
  userId: string,
  fullName: string,
  nimId: string
): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  await requireAdmin();

  const cleanName = (fullName || "").trim();
  const cleanNim = (nimId || "").trim();

  if (!cleanName || cleanName.length < 2) {
    return { success: false, error: "Nama lengkap minimal harus 2 karakter." };
  }

  if (!cleanNim || cleanNim.length < 3) {
    return { success: false, error: "NIM resmi kampus minimal harus 3 karakter." };
  }

  // 1. Cek duplikasi NIM (NIM tidak boleh dipakai oleh akun lain)
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const { data: existingUser } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .eq("nim_id", cleanNim)
        .neq("id", userId)
        .maybeSingle();

      if (existingUser) {
        return {
          success: false,
          error: `NIM "${cleanNim}" telah digunakan oleh mahasiswa lain (${existingUser.full_name}).`,
        };
      }
    } catch (err) {
      console.warn("Gagal cek duplikasi NIM:", err);
    }
  }

  // 2. Update store in-memory & data relasi
  const updated = bdcStore.updateStudentIdentity(userId, cleanName, cleanNim);
  if (!updated) {
    return { success: false, error: "Mahasiswa tidak ditemukan di sistem." };
  }

  // 3. Update live ke Supabase Profiles, Certificates, Attendances, Submissions, dan Auth Metadata
  if (supabaseAdmin) {
    try {
      // Update profiles
      await supabaseAdmin
        .from("profiles")
        .update({
          full_name: cleanName,
          nim_id: cleanNim,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      // Cascading update ke certificates
      await supabaseAdmin
        .from("certificates")
        .update({
          recipient_name: cleanName,
          nim_id: cleanNim,
        })
        .eq("user_id", userId);

      // Cascading update ke attendance_records
      await supabaseAdmin
        .from("attendance_records")
        .update({
          user_name: cleanName,
          nim_id: cleanNim,
        })
        .eq("user_id", userId);

      // Cascading update ke assignment_submissions
      await supabaseAdmin
        .from("assignment_submissions")
        .update({
          user_name: cleanName,
          nim_id: cleanNim,
        })
        .eq("user_id", userId);

      // Sinkronkan ke Supabase Auth User Metadata
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          full_name: cleanName,
          nim_id: cleanNim,
        },
      });
    } catch (err) {
      console.warn("Gagal sinkronisasi pembaruan identitas mahasiswa ke Supabase:", err);
    }
  }

  revalidatePath("/admin/students");
  revalidatePath("/admin/users");
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  revalidatePath("/leaderboard");
  revalidatePath("/dashboard");
  revalidatePath("/attendance");

  return { success: true, profile: updated };
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
