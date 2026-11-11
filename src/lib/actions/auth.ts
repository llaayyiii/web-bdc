"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { bdcStore } from "../data/store";
import { Profile } from "../types/database";

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

  // Cek kata sandi sederhana (di prototype: terima kata sandi apa pun selain kosong)
  if (!password) {
    return { success: false, error: "Kata sandi wajib diisi." };
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
 * Server Action Login Cepat (Google SSO Simulation atau Demo Akun)
 */
export async function demoLoginAction(nimOrEmail: string): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  const user = bdcStore.getProfileByNimOrEmail(nimOrEmail);
  if (!user) {
    return { success: false, error: "Akun tidak ditemukan." };
  }

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
    maxAge: 60 * 60 * 24 * 7,
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
