"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { bdcStore } from "../data/store";
import { Profile } from "../types/database";
import { createAdminClient } from "../supabase/admin";

const CAMPUS_STUDENT_DOMAIN = "students.utdi.ac.id";
const CAMPUS_STAFF_DOMAINS = ["utdi.ac.id", "businessdevclub.id"];

export interface SessionData {
  userId: string;
  nimId: string;
  name: string;
  email: string;
  role: "learner" | "instructor" | "admin";
}

/**
 * Validasi domain email resmi kampus
 */
export async function validateCampusEmail(email: string): Promise<{ valid: boolean; message?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const domain = cleanEmail.split("@")[1];

  if (!domain) {
    return { valid: false, message: "Format alamat email tidak valid." };
  }

  if (domain === CAMPUS_STUDENT_DOMAIN || CAMPUS_STAFF_DOMAINS.includes(domain)) {
    return { valid: true };
  }

  return {
    valid: false,
    message: `Akses ditolak: Hanya akun email resmi kampus @${CAMPUS_STUDENT_DOMAIN} yang diizinkan untuk login portal BDC.`,
  };
}

/**
 * Server Action untuk Login via NIM atau Email Kampus
 */
export async function loginAction(formData: FormData): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  const identifier = (formData.get("identifier") as string || "").trim();
  const password = (formData.get("password") as string || "").trim();

  if (!identifier) {
    return { success: false, error: "NIM atau Email Kampus wajib diisi." };
  }

  // Jika input berupa email, validasi domain kampus
  if (identifier.includes("@")) {
    const domainCheck = await validateCampusEmail(identifier);
    if (!domainCheck.valid) {
      return { success: false, error: domainCheck.message };
    }
  }

  // Cari user di store atau Supabase
  const user = bdcStore.getProfileByNimOrEmail(identifier);

  if (!user) {
    return {
      success: false,
      error: `Akun dengan identitas "${identifier}" tidak ditemukan pada pangkalan data kampus BDC. Pastikan NIM terdaftar atau gunakan email @${CAMPUS_STUDENT_DOMAIN}.`,
    };
  }

  // Cek kata sandi
  if (!password) {
    return { success: false, error: "Kata sandi wajib diisi." };
  }

  // Jika user memiliki password tersimpan, verifikasi kecocokannya
  if (user.password && user.password !== password) {
    return { success: false, error: "Kata sandi yang Anda masukkan salah. Periksa kembali." };
  }

  // Set secure HTTP-only session cookie
  const sessionData: SessionData = {
    userId: user.id,
    nimId: user.nim_id,
    name: user.full_name,
    email: user.email,
    role: user.role,
  };

  const cookieStore = await cookies();
  cookieStore.set("bdc_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  const redirectTo = user.role === "admin" || user.role === "instructor" ? "/admin" : "/dashboard";

  return { success: true, redirectTo };
}

/**
 * Mengambil Sesi Pengguna Aktif dari Cookies
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("bdc_session");

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const session: SessionData = JSON.parse(sessionCookie.value);
    const profile = bdcStore.getProfileById(session.userId);
    return profile;
  } catch {
    return null;
  }
}

/**
 * Server Action Logout
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("bdc_session");
  redirect("/login");
}

/**
 * Server Action untuk Pendaftaran Akun Mahasiswa Baru
 */
export async function registerAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  const fullName = (formData.get("full_name") as string || "").trim();
  const nimId = (formData.get("nim_id") as string || "").trim();
  const email = (formData.get("email") as string || "").trim().toLowerCase();
  const password = (formData.get("password") as string || "").trim();
  const confirmPassword = (formData.get("confirm_password") as string || "").trim();

  if (!fullName) {
    return { success: false, error: "Nama lengkap wajib diisi." };
  }

  if (!nimId || nimId.length < 5) {
    return { success: false, error: "Nomor Induk Mahasiswa (NIM) tidak valid (minimal 5 karakter)." };
  }

  if (!email) {
    return { success: false, error: "Alamat email resmi mahasiswa wajib diisi." };
  }

  // Validasi domain kampus
  const domainCheck = await validateCampusEmail(email);
  if (!domainCheck.valid) {
    return { success: false, error: domainCheck.message };
  }

  if (!password || password.length < 8) {
    return { success: false, error: "Kata sandi minimal harus 8 karakter." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Konfirmasi kata sandi tidak cocok. Harap periksa kembali." };
  }

  // Cek apakah akun dengan NIM atau Email sudah terdaftar
  const existingUser =
    bdcStore.getProfileByNimOrEmail(email) || bdcStore.getProfileByNimOrEmail(nimId);
  if (existingUser) {
    return {
      success: false,
      error: `Akun dengan NIM "${nimId}" atau Email "${email}" telah terdaftar pada sistem. Silakan langsung login.`,
    };
  }

  const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newProfile: Profile = {
    id: userId,
    nim_id: nimId,
    full_name: fullName,
    email: email,
    role: "learner",
    role_title: "Junior Web Developer Cohort",
    division: "Academic College Community",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    password: password,
    score: 0.0,
    completed_modules: 0,
    total_hours: 0.0,
    points: 100, // Bonus XP anggota baru
    attendance_rate: 0,
    total_attendances: 0,
    total_sessions: 8,
  };

  // Simpan ke store in-memory
  bdcStore.registerProfile(newProfile);

  // Sinkronisasi ke Supabase jika terhubung
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const { data: authData } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          nim_id: nimId,
        },
      });

      const finalId = authData?.user?.id || userId;
      newProfile.id = finalId;

      await supabaseAdmin.from("profiles").upsert({
        id: finalId,
        nim_id: newProfile.nim_id,
        full_name: newProfile.full_name,
        email: newProfile.email,
        role: newProfile.role,
        role_title: newProfile.role_title,
        division: newProfile.division,
        period: newProfile.period,
        location: newProfile.location,
        score: newProfile.score,
        completed_modules: newProfile.completed_modules,
        total_hours: newProfile.total_hours,
        points: newProfile.points,
        attendance_rate: newProfile.attendance_rate,
        total_attendances: newProfile.total_attendances,
        total_sessions: newProfile.total_sessions,
      });
    } catch (err) {
      console.warn("Sinkronisasi pendaftaran ke Supabase:", err);
    }
  }

  // Set session cookie otomatis
  const sessionData: SessionData = {
    userId: newProfile.id,
    nimId: newProfile.nim_id,
    name: newProfile.full_name,
    email: newProfile.email,
    role: newProfile.role,
  };

  const cookieStore = await cookies();
  cookieStore.set("bdc_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, redirectTo: "/dashboard" };
}
