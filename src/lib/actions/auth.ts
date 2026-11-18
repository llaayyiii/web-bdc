"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { bdcStore } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { Profile } from "../types/database";
import { createAdminClient, createAnonClient } from "../supabase/admin";
import { signSecurePayload, signSession, verifySecurePayload, verifySession } from "../auth/session";

const CAMPUS_STUDENT_DOMAIN = "students.utdi.ac.id";
const CAMPUS_STAFF_DOMAINS = ["utdi.ac.id", "businessdevclub.id"];

/** Cookie berisi data pendaftaran yang menunggu verifikasi OTP email (10 menit). */
const PENDING_REG_COOKIE = "bdc_pending_reg";
const PENDING_REG_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

/** Batas server-side anti-spam request OTP (per jam), disimpan di tabel otp_send_log. */
const OTP_SEND_LIMIT_PER_EMAIL = 5;
const OTP_SEND_LIMIT_PER_IP = 10;
const OTP_SEND_WINDOW_MS = 60 * 60 * 1000;
const PASSWORD_RESET_LIMIT_PER_EMAIL = 3;
const PASSWORD_RESET_LIMIT_PER_IP = 10;
const PASSWORD_RESET_WINDOW_MS = 60 * 60 * 1000;
const PASSWORD_RESET_REDIRECT_URL =
  `${(process.env.NEXT_PUBLIC_SITE_URL || "https://bdcutdi.vercel.app").replace(/\/$/, "")}/reset-password`;

interface PendingRegistration {
  fullName: string;
  nimId: string;
  email: string;
  passwordHash: string;
  exp: number;
  attempts: number;
  lastSentAt: number;
}

async function readPendingReg(): Promise<PendingRegistration | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PENDING_REG_COOKIE)?.value;
  if (!raw) return null;
  const parsed = await verifySecurePayload<PendingRegistration>(raw);
  if (
    !parsed ||
    typeof parsed.fullName !== "string" ||
    typeof parsed.nimId !== "string" ||
    typeof parsed.email !== "string" ||
    typeof parsed.passwordHash !== "string" ||
    typeof parsed.exp !== "number" ||
    typeof parsed.attempts !== "number" ||
    typeof parsed.lastSentAt !== "number"
  ) return null;
  return parsed;
}

async function writePendingReg(pending: PendingRegistration) {
  const cookieStore = await cookies();
  const maxAge = Math.max(1, Math.ceil((pending.exp - Date.now()) / 1000));
  cookieStore.set(PENDING_REG_COOKIE, await signSecurePayload(pending), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

async function clearPendingReg() {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_REG_COOKIE);
}

/** Vercel overwrites this header, jadi IP pengguna tidak dapat dipalsukan oleh klien. */
async function getClientIp(): Promise<string | null> {
  try {
    const h = await headers();
    const ip = h.get("x-vercel-forwarded-for") || h.get("x-real-ip");
    return ip ? ip.slice(0, 64) : null;
  } catch {
    return null;
  }
}

/**
 * Konsumsi kuota request OTP secara atomik di tabel otp_send_log:
 * maksimal 5 request per email dan 10 per IP dalam satu jam.
 */
async function consumeOtpSendQuota(
  email: string,
  ip: string | null
): Promise<{ allowed: boolean; error?: string }> {
  const admin = createAdminClient();
  if (!admin) {
    return { allowed: false, error: "Layanan verifikasi sementara tidak tersedia. Silakan coba lagi nanti." };
  }

  try {
    const { data, error } = await admin.rpc("consume_otp_send_quota", {
      p_email: email,
      p_ip: ip,
      p_window_ms: OTP_SEND_WINDOW_MS,
      p_email_limit: OTP_SEND_LIMIT_PER_EMAIL,
      p_ip_limit: OTP_SEND_LIMIT_PER_IP,
    });
    if (error) throw error;
    return data === true
      ? { allowed: true }
      : { allowed: false, error: "Terlalu banyak permintaan kode verifikasi. Silakan coba lagi nanti." };
  } catch (err) {
    console.warn("Gagal memeriksa kuota request OTP:", err);
    return { allowed: false, error: "Layanan verifikasi sementara tidak tersedia. Silakan coba lagi nanti." };
  }
}

async function consumePasswordResetQuota(email: string, ip: string | null): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return false;
  try {
    const { data, error } = await admin.rpc("consume_password_reset_quota", {
      p_email: email,
      p_ip: ip,
      p_window_ms: PASSWORD_RESET_WINDOW_MS,
      p_email_limit: PASSWORD_RESET_LIMIT_PER_EMAIL,
      p_ip_limit: PASSWORD_RESET_LIMIT_PER_IP,
    });
    return !error && data === true;
  } catch (err) {
    console.warn("Gagal memeriksa kuota reset kata sandi:", err);
    return false;
  }
}

/** Pesan error yang ramah untuk kegagalan pengiriman email OTP. */
function friendlyEmailError(err: { code?: string; message: string }, email: string): string {
  if (err.code === "over_email_send_rate_limit") {
    return "Layanan pengiriman email verifikasi sedang mencapai batas. Silakan coba lagi dalam beberapa menit.";
  }
  if (err.code === "email_address_not_authorized") {
    return `Alamat ${email} tidak dapat menerima email dari layanan bawaan Supabase. Silakan hubungi admin kampus.`;
  }
  return `Gagal mengirim kode verifikasi ke ${email}. ${err.message}`;
}

async function setSessionCookie(profile: Profile) {
  const cookieStore = await cookies();
  cookieStore.set("bdc_session", await signSession({
    userId: profile.id,
    role: profile.role,
    passwordChangedAt: profile.password_changed_at || "",
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
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
          const passwordChangedAt = new Date().toISOString();
          const { error: upgradeError } = await supabaseAdmin
            .from("profiles")
            .update({ password_hash: newHash, password_changed_at: passwordChangedAt })
            .eq("id", user.id);
          if (upgradeError) throw upgradeError;
          user.password_hash = newHash;
          user.password_changed_at = passwordChangedAt;
        }
      }
    } catch (err) {
      console.warn("Gagal query profil dari Supabase:", err);
    }
  }

  // 2. Fallback ke bdcStore in-memory jika belum/tidak ditemukan di Supabase
  if (!user && process.env.NODE_ENV !== "production") {
    await hydrateFromDb();
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

  try {
    await setSessionCookie(user);
  } catch {
    return { success: false, error: "Layanan sesi tidak tersedia. Silakan hubungi admin." };
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
    const session = await verifySession(sessionCookie.value);
    if (!session) return null;
    let profile: Profile | null = null;

    // Sumber data utama: Supabase (selalu segar dari database)
    const supabaseAdmin = createAdminClient();
    if (supabaseAdmin) {
      try {
        const { data: dbUser } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("id", session.userId)
          .maybeSingle();

        if (dbUser) {
          profile = dbUser as Profile;
        }
      } catch (err) {
        console.warn("Gagal mengambil profil dari Supabase:", err);
      }
    }

    // Fallback ke cache lokal jika Supabase tidak terjangkau
    if (!profile && process.env.NODE_ENV !== "production") {
      profile = bdcStore.getProfileById(session.userId);
    }

    if (profile && (profile.password_changed_at || "") !== (session.passwordChangedAt || "")) {
      return null;
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
): Promise<{
  success: boolean;
  error?: string;
  requiresOtp?: boolean;
  email?: string;
  redirectTo?: string;
}> {
  try {
    await signSession({ userId: "configuration-check", role: "learner", passwordChangedAt: "" });
  } catch {
    return { success: false, error: "Layanan sesi tidak tersedia. Silakan hubungi admin." };
  }
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

  // Cek apakah akun dengan NIM atau Email sudah terdaftar (DB & cache lokal)
  await hydrateFromDb();
  let existingUser =
    bdcStore.getProfileByNimOrEmail(email) || bdcStore.getProfileByNimOrEmail(nimId);

  const supabaseCheck = createAdminClient();
  let dbDuplicate = false;
  if (supabaseCheck && !existingUser) {
    try {
      const { data: dup } = await supabaseCheck
        .from("profiles")
        .select("id")
        .or(`email.eq.${email},nim_id.eq.${nimId}`)
        .maybeSingle();
      dbDuplicate = !!dup;
    } catch (err) {
      console.warn("Gagal cek duplikat akun di Supabase:", err);
    }
  }

  if (existingUser || dbDuplicate) {
    return {
      success: false,
      error: `Akun dengan NIM "${nimId}" atau Email "${email}" telah terdaftar pada sistem. Silakan langsung login.`,
    };
  }

  // Kuota anti-spam server-side: maks 5 request/email/jam & 10/IP/jam.
  // Dicatat sebelum akun auth dibuat — request yang diblokir tidak menghasilkan akun.
  const clientIp = await getClientIp();
  const otpQuota = await consumeOtpSendQuota(email, clientIp);
  if (!otpQuota.allowed) {
    return { success: false, error: otpQuota.error };
  }

  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin) {
    return { success: false, error: "Layanan pendaftaran belum terkonfigurasi. Silakan coba lagi nanti." };
  }

  // 1. Buat akun autentikasi Supabase (email sudah dikonfirmasi;
  //    verifikasi kepemilikan email dilakukan lewat kode OTP di langkah berikutnya)
  try {
    const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: fullName, nim_id: nimId },
    });

    if (createErr) {
      const alreadyExists =
        createErr.code === "email_exists" || /already registered|has already been/i.test(createErr.message);

      if (!alreadyExists) {
        return { success: false, error: createErr.message || "Gagal membuat akun autentikasi." };
      }

      // Sudah pernah mendaftar: lanjutkan hanya jika verifikasi belum selesai (profil belum ada)
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingProfile) {
        return {
          success: false,
          error: `Akun dengan NIM "${nimId}" atau Email "${email}" telah terdaftar pada sistem. Silakan langsung login.`,
        };
      }
    }
  } catch (err) {
    console.warn("Gagal membuat akun autentikasi Supabase:", err);
    return { success: false, error: "Gagal membuat akun autentikasi. Silakan coba lagi." };
  }

  // 2. Hash kata sandi untuk disimpan ke tabel profiles
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Kirim kode OTP ke email kampus
  const anonClient = createAnonClient();
  if (!anonClient) {
    return { success: false, error: "Layanan verifikasi email tidak terkonfigurasi. Silakan hubungi admin." };
  }

  const { error: otpErr } = await anonClient.auth.signInWithOtp({ email: email });
  if (otpErr) {
    console.warn("Gagal mengirim kode OTP pendaftaran:", otpErr);
    return { success: false, error: friendlyEmailError(otpErr, email) };
  }

  // 4. Simpan data pendaftaran sementara di cookie httpOnly (berlaku 10 menit)
  await writePendingReg({
    fullName: fullName,
    nimId: nimId,
    email: email,
    passwordHash: passwordHash,
    exp: Date.now() + PENDING_REG_TTL_MS,
    attempts: 0,
    lastSentAt: Date.now(),
  });

  return { success: true, requiresOtp: true, email: email };
}

/**
 * Server Action untuk memverifikasi kode OTP saat pendaftaran.
 * Jika berhasil, profil mahasiswa disimpan ke database dan sesi diaktifkan.
 */
export async function verifyRegistrationOtpAction(
  rawCode: string
): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  try {
    await signSession({ userId: "configuration-check", role: "learner", passwordChangedAt: "" });
  } catch {
    return { success: false, error: "Layanan sesi tidak tersedia. Silakan hubungi admin." };
  }
  const code = (rawCode || "").replace(/\D/g, "");

  if (code.length < 6) {
    return { success: false, error: "Kode verifikasi terdiri dari angka. Periksa kembali email Anda." };
  }

  const pending = await readPendingReg();
  if (!pending) {
    return { success: false, error: "Sesi pendaftaran tidak ditemukan atau sudah kedaluwarsa. Silakan daftar ulang." };
  }

  if (pending.exp < Date.now()) {
    await clearPendingReg();
    return { success: false, error: "Kode verifikasi kedaluwarsa. Silakan daftar ulang." };
  }

  if (pending.attempts >= OTP_MAX_ATTEMPTS) {
    await clearPendingReg();
    return { success: false, error: "Terlalu banyak percobaan kode yang salah. Silakan daftar ulang." };
  }

  const anonClient = createAnonClient();
  const supabaseAdmin = createAdminClient();
  if (!anonClient || !supabaseAdmin) {
    return { success: false, error: "Layanan verifikasi email tidak terkonfigurasi. Silakan hubungi admin." };
  }

  // 1. Verifikasi kode OTP terhadap email pendaftaran
  const { data: verifyData, error: verifyErr } = await anonClient.auth.verifyOtp({
    email: pending.email,
    token: code,
    type: "email",
  });

  if (verifyErr) {
    pending.attempts += 1;
    const exhausted = pending.attempts >= OTP_MAX_ATTEMPTS;
    if (exhausted) {
      await clearPendingReg();
    } else {
      await writePendingReg(pending);
    }

    if (exhausted) {
      return { success: false, error: "Terlalu banyak percobaan kode yang salah. Silakan daftar ulang." };
    }

    // Supabase memakai pesan generik "Token has expired or is invalid" (code otp_expired)
    // untuk kode yang salah maupun yang sudah kedaluwarsa, jadi pesannya digabung.
    return {
      success: false,
      error: "Kode verifikasi salah atau sudah kedaluwarsa. Periksa kembali email Anda, atau minta kode baru.",
    };
  }

  // 2. Ambil id akun auth dari hasil verifikasi (identitas pengguna pada sesi)
  const authUserId = verifyData?.user?.id || verifyData?.session?.user?.id || null;

  if (!authUserId) {
    await clearPendingReg();
    return { success: false, error: "Akun autentikasi tidak ditemukan. Silakan daftar ulang." };
  }

  // 3. Cek ulang duplikat NIM/Email (kondisi dapat berubah sejak langkah pertama)
  const { data: duplicate } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .or(`email.eq.${pending.email},nim_id.eq.${pending.nimId}`)
    .maybeSingle();

  if (duplicate) {
    await clearPendingReg();
    return {
      success: false,
      error: `Akun dengan NIM "${pending.nimId}" atau Email "${pending.email}" telah terdaftar pada sistem. Silakan langsung login.`,
    };
  }

  // 4. Simpan profil mahasiswa ke database (terikat ke akun auth)
  const newProfile: Profile = {
    id: authUserId,
    nim_id: pending.nimId,
    full_name: pending.fullName,
    email: pending.email,
    role: "learner",
    role_title: "Corporate Learner (Student Chapter)",
    division: "Academic College Community",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    password_hash: pending.passwordHash,
    password_changed_at: new Date().toISOString(),
    score: 0.0,
    completed_modules: 0,
    total_hours: 0.0,
    points: 100, // Bonus XP anggota baru
    attendance_rate: 0,
    total_attendances: 0,
    total_sessions: 8,
  };

  try {
    const { error: insertErr } = await supabaseAdmin.from("profiles").upsert(
      {
        id: newProfile.id,
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
        password_hash: newProfile.password_hash,
        password_changed_at: newProfile.password_changed_at,
      },
      { onConflict: "id" }
    );

    if (insertErr) {
      console.warn("Gagal menyimpan profil pendaftaran baru:", insertErr);
      return {
        success: false,
        error: `Gagal menyimpan data akun (${insertErr.message}). Silakan coba lagi.`,
      };
    }
  } catch (err) {
    console.warn("Gagal menyimpan profil pendaftaran baru:", err);
    return { success: false, error: "Gagal menyimpan data akun. Silakan coba lagi." };
  }

  // 5. Sinkronkan ke cache lokal, aktifkan sesi, hapus cookie pendaftaran
  bdcStore.registerProfile(newProfile);

  await setSessionCookie(newProfile);
  await clearPendingReg();

  return { success: true, redirectTo: "/dashboard" };
}

/**
 * Server Action untuk mengirim ulang kode OTP pendaftaran (cooldown 60 detik).
 */
export async function resendRegistrationOtpAction(): Promise<{ success: boolean; error?: string }> {
  const pending = await readPendingReg();
  if (!pending || pending.exp < Date.now()) {
    await clearPendingReg();
    return { success: false, error: "Sesi pendaftaran sudah kedaluwarsa. Silakan daftar ulang." };
  }

  const waitMs = pending.lastSentAt + OTP_RESEND_COOLDOWN_MS - Date.now();
  if (waitMs > 0) {
    return {
      success: false,
      error: `Tunggu ${Math.ceil(waitMs / 1000)} detik sebelum meminta kode baru.`,
    };
  }

  // Kuota server yang sama dengan pendaftaran (5/email/jam, 10/IP/jam)
  const resendIp = await getClientIp();
  const resendQuota = await consumeOtpSendQuota(pending.email, resendIp);
  if (!resendQuota.allowed) {
    return { success: false, error: resendQuota.error };
  }

  const anonClient = createAnonClient();
  if (!anonClient) {
    return { success: false, error: "Layanan verifikasi email tidak terkonfigurasi. Silakan hubungi admin." };
  }

  const { error } = await anonClient.auth.signInWithOtp({ email: pending.email });
  if (error) {
    console.warn("Gagal mengirim ulang kode OTP:", error);
    return { success: false, error: friendlyEmailError(error, pending.email) };
  }

  pending.lastSentAt = Date.now();
  await writePendingReg(pending);

  return { success: true };
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

  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin && process.env.NODE_ENV === "production") {
    return { success: false, error: "Layanan pembaruan kata sandi sementara tidak tersedia." };
  }

  const passwordHash = await bcrypt.hash(cleanNew, 10);
  const passwordChangedAt = new Date().toISOString();

  if (supabaseAdmin) {
    try {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password: cleanNew });
      if (authError) throw authError;

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ password_hash: passwordHash, password_changed_at: passwordChangedAt })
        .eq("id", user.id);
      if (profileError) {
        await supabaseAdmin.auth.admin.updateUserById(user.id, { password: oldPassword });
        throw profileError;
      }
    } catch (err) {
      console.warn("Gagal memperbarui kata sandi user:", err);
      return { success: false, error: "Kata sandi belum diperbarui. Silakan coba lagi." };
    }
  }

  const updatedUser = { ...user, password_hash: passwordHash, password_changed_at: passwordChangedAt };
  bdcStore.updateUserPassword(user.id, cleanNew);
  bdcStore.updateProfile(user.id, { password_hash: passwordHash, password_changed_at: passwordChangedAt });
  await setSessionCookie(updatedUser);

  return { success: true, message: "Kata sandi berhasil diperbarui dengan aman." };
}

const PASSWORD_RESET_REQUEST_MESSAGE =
  "Jika alamat email tersebut terdaftar, kami telah mengirim tautan pemulihan. Periksa inbox dan folder spam Anda.";

/**
 * Mengirim tautan reset dengan respons generik untuk mencegah enumerasi akun.
 * Kuota dikonsumsi sebelum email dikirim agar klik berulang tidak mengirim spam.
 */
export async function requestPasswordResetAction(
  rawEmail: string
): Promise<{ success: boolean; message: string }> {
  const email = (rawEmail || "").trim().toLowerCase();
  const domainCheck = email ? await validateCampusEmail(email) : { valid: false };

  if (!domainCheck.valid) {
    return { success: true, message: PASSWORD_RESET_REQUEST_MESSAGE };
  }

  const allowed = await consumePasswordResetQuota(email, await getClientIp());
  if (!allowed) {
    return { success: true, message: PASSWORD_RESET_REQUEST_MESSAGE };
  }

  const anonClient = createAnonClient();
  if (!anonClient) {
    console.warn("Layanan reset kata sandi tidak terkonfigurasi.");
    return { success: true, message: PASSWORD_RESET_REQUEST_MESSAGE };
  }

  try {
    const { error } = await anonClient.auth.resetPasswordForEmail(email, {
      redirectTo: PASSWORD_RESET_REDIRECT_URL,
    });
    if (error) console.warn("Gagal meminta reset kata sandi:", error.code);
  } catch (err) {
    console.warn("Gagal meminta reset kata sandi:", err);
  }

  return { success: true, message: PASSWORD_RESET_REQUEST_MESSAGE };
}

/**
 * Menyelesaikan reset setelah browser menukar kode recovery Supabase menjadi
 * access token. Token dipverifikasi kembali di server sebelum password profil
 * dan sesi aplikasi diperbarui.
 */
export async function completePasswordResetAction(
  accessToken: string,
  newPassword: string
): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  const cleanPassword = (newPassword || "").trim();
  if (cleanPassword.length < 8) {
    return { success: false, error: "Kata sandi baru minimal harus 8 karakter." };
  }
  if (!accessToken || accessToken.length > 4096) {
    return { success: false, error: "Tautan pemulihan tidak valid atau sudah kedaluwarsa." };
  }

  const anonClient = createAnonClient();
  const supabaseAdmin = createAdminClient();
  if (!anonClient || !supabaseAdmin) {
    return { success: false, error: "Layanan pemulihan kata sandi sementara tidak tersedia." };
  }

  try {
    const { data: authData, error: authLookupError } = await anonClient.auth.getUser(accessToken);
    const authUser = authData.user;
    if (authLookupError || !authUser) {
      return { success: false, error: "Tautan pemulihan tidak valid atau sudah kedaluwarsa." };
    }

    const passwordHash = await bcrypt.hash(cleanPassword, 10);
    const passwordChangedAt = new Date().toISOString();
    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      password: cleanPassword,
    });
    if (authUpdateError) throw authUpdateError;

    const { data: updatedProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ password_hash: passwordHash, password_changed_at: passwordChangedAt })
      .eq("id", authUser.id)
      .select("*")
      .maybeSingle();
    if (profileError || !updatedProfile) {
      throw profileError || new Error("Profil tidak ditemukan.");
    }

    const profile = updatedProfile as Profile;
    bdcStore.registerProfile(profile);
    await setSessionCookie(profile);
    return { success: true, redirectTo: profile.role === "admin" || profile.role === "instructor" ? "/admin" : "/dashboard" };
  } catch (err) {
    console.warn("Gagal menyelesaikan reset kata sandi:", err);
    return { success: false, error: "Kata sandi belum diperbarui. Silakan minta tautan baru." };
  }
}
