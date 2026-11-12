"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
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

  if (!password) {
    return { success: false, error: "Kata sandi wajib diisi." };
  }

  let user: Profile | null = null;
  let passwordMatched = false;

  // 1. Cek profil dari Supabase (sumber data utama)
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const cleanId = identifier.toLowerCase();
      const { data: dbProfile } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .or(`email.ilike.${cleanId},nim_id.eq.${identifier}`)
        .maybeSingle();

      if (dbProfile) {
        user = dbProfile as Profile;

        if (user.password_hash) {
          passwordMatched = await bcrypt.compare(password, user.password_hash);
        } else if (user.password) {
          passwordMatched = user.password === password;
        }

        // Auto-upgrade plaintext password ke bcrypt hash
        if (passwordMatched && !user.password_hash) {
          const newHash = await bcrypt.hash(password, 10);
          await supabaseAdmin.from("profiles").update({ password_hash: newHash }).eq("id", user.id);
          user.password_hash = newHash;
        }
      }
    } catch (err) {
      console.warn("Gagal query profil dari Supabase:", err);
    }
  }

  // 2. Fallback ke bdcStore in-memory jika belum/tidak ditemukan di Supabase
  if (!user) {
    const localUser = bdcStore.getProfileByNimOrEmail(identifier);
    if (localUser) {
      user = localUser;
      if (user.password_hash) {
        passwordMatched = bcrypt.compareSync(password, user.password_hash);
      } else if (user.password) {
        passwordMatched = user.password === password;
      }
    }
  }

  if (!user) {
    return {
      success: false,
      error: `Akun dengan identitas "${identifier}" tidak ditemukan pada pangkalan data kampus BDC. Pastikan NIM terdaftar atau gunakan email @${CAMPUS_STUDENT_DOMAIN}.`,
    };
  }

  if (!passwordMatched) {
    return { success: false, error: "Kata sandi yang Anda masukkan salah. Periksa kembali." };
  }

  // Sinkronisasi user ke store lokal
  bdcStore.registerProfile(user);

  // Set secure HTTP-only session cookie
  const sessionData: SessionData = {
    userId: user.id,
    nimId: user.nim_id,
    name: user.full_name,
    email: user.email,
    role: user.role,
  };

  try {
    const cookieStore = await cookies();
    cookieStore.set("bdc_session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });
  } catch {
    // Diamkan jika dipanggil di luar konteks request Next.js (misal runner/test script)
  }

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
    let profile = bdcStore.getProfileById(session.userId);

    // Jika tidak ditemukan di store memori (misal server restart / serverless spin-up), tarik dari Supabase
    if (!profile) {
      const supabaseAdmin = createAdminClient();
      if (supabaseAdmin) {
        const { data: dbUser } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("id", session.userId)
          .maybeSingle();

        if (dbUser) {
          profile = dbUser as Profile;
          bdcStore.registerProfile(profile);
        }
      }
    }

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

  const passwordHash = await bcrypt.hash(password, 10);
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
    password_hash: passwordHash,
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
        password_hash: passwordHash,
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

/**
 * Server Action bagi pengguna aktif untuk memperbarui kata sandi sendiri
 */
export async function updateSelfPasswordAction(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Sesi login tidak valid. Silakan login kembali." };
  }

  const cleanNew = (newPassword || "").trim();
  if (!cleanNew || cleanNew.length < 8) {
    return { success: false, error: "Kata sandi baru minimal harus 8 karakter." };
  }

  // Verifikasi oldPassword
  let oldValid = false;
  if (user.password_hash) {
    oldValid = await bcrypt.compare(oldPassword, user.password_hash);
  } else if (user.password) {
    oldValid = user.password === oldPassword;
  }

  if (!oldValid) {
    return { success: false, error: "Kata sandi lama yang Anda masukkan salah." };
  }

  const passwordHash = await bcrypt.hash(cleanNew, 10);
  bdcStore.updateUserPassword(user.id, cleanNew);
  bdcStore.updateProfile(user.id, { password_hash: passwordHash });

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.auth.admin.updateUserById(user.id, { password: cleanNew });
      await supabaseAdmin.from("profiles").update({ password_hash: passwordHash }).eq("id", user.id);
    } catch (err) {
      console.warn("Gagal update password user di Supabase:", err);
    }
  }

  return { success: true, message: "Kata sandi berhasil diperbarui dengan aman." };
}
