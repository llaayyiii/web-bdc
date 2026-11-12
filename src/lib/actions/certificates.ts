"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { Certificate } from "../types/database";
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
 * Mengambil sertifikat mahasiswa berdasarkan User ID (dari Supabase / Store)
 */
export async function getCertificateByUserIdAction(userId: string): Promise<Certificate | null> {
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from("certificates")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        const cert = data as Certificate;
        bdcStore.updateCertificate(cert.id, cert);
        return cert;
      }
    } catch (err) {
      console.warn("Gagal mengambil sertifikat dari Supabase:", err);
    }
  }

  await hydrateFromDb();
  return bdcStore.getCertificateByUserId(userId);
}

/**
 * Mengambil seluruh sertifikat untuk panel Admin
 */
export async function getAllCertificatesAction(): Promise<Certificate[]> {
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        data.forEach((c) => bdcStore.updateCertificate(c.id, c as Certificate));
        return data as Certificate[];
      }
    } catch (err) {
      console.warn("Gagal mengambil daftar sertifikat dari Supabase:", err);
    }
  }

  await hydrateFromDb();
  return bdcStore.getCertificates();
}

/**
 * Verifikasi sertifikat publik via Nomor Sertifikat, Nomor Transkrip, atau NIM
 */
export async function verifyCertificateAction(searchQuery: string): Promise<Certificate | null> {
  const clean = searchQuery.trim().toUpperCase();
  if (!clean) return null;

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from("certificates")
        .select("*")
        .or(`certificate_number.ilike.${clean},nim_id.ilike.${clean},transcript_number.ilike.${clean}`)
        .maybeSingle();

      if (data) {
        return data as Certificate;
      }
    } catch (err) {
      console.warn("Gagal verifikasi sertifikat di Supabase:", err);
    }
  }

  await hydrateFromDb();
  return bdcStore.getCertificateByNimOrNumber(clean);
}

/**
 * Mengambil sertifikat berdasarkan ID (untuk halaman pratinjau & cetak)
 */
export async function getCertificateByIdAction(id: string): Promise<Certificate | null> {
  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from("certificates")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (data) {
        return data as Certificate;
      }
    } catch (err) {
      console.warn("Gagal mengambil sertifikat by ID dari Supabase:", err);
    }
  }

  await hydrateFromDb();
  return bdcStore.getCertificateById(id);
}

/**
 * Admin: Menerbitkan / Menarik kembali sertifikat mahasiswa
 * (Sertifikat hanya terbit karena admin menerbitkan, bukan otomatis karena tuntas)
 */
export async function adminToggleCertificateLockAction(certId: string, isLocked: boolean) {
  await requireAdmin();
  // Saat diterbitkan: status LULUS; saat ditarik: kembali menunggu penerbitan
  const completion_status = isLocked ? "MENUNGGU PENERBITAN" : "LULUS (KOMPETEN)";
  const cert = bdcStore.updateCertificate(certId, { is_locked: isLocked, completion_status });

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from("certificates")
        .update({ is_locked: isLocked, completion_status, updated_at: new Date().toISOString() })
        .eq("id", certId);
    } catch (err) {
      console.warn("Gagal update status penerbitan sertifikat di Supabase:", err);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/students");
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");

  return { success: true, cert };
}

/**
 * Admin: Perbarui data pejabat penandatangan dan tanggal sertifikat
 */
export async function adminUpdateSignatoriesAction(
  certId: string,
  payload: {
    signatory_1_name: string;
    signatory_1_role: string;
    signatory_2_name: string;
    signatory_2_role: string;
    issue_date: string;
    period: string;
    location: string;
  }
): Promise<{ success: boolean; cert?: Certificate | null; error?: string }> {
  await requireAdmin();
  const cert = bdcStore.updateCertificate(certId, payload);
  if (!cert) {
    return { success: false, error: "Gagal memperbarui data penandatangan." };
  }

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      const updateData = { ...payload, updated_at: new Date().toISOString() };
      if (certId) {
        await supabaseAdmin.from("certificates").update(updateData).eq("id", certId);
      }
      // Sinkronisasi pejabat penandatangan ke seluruh sertifikat di database
      await supabaseAdmin.from("certificates").update(updateData).neq("id", "00000000-0000-0000-0000-000000000000");
    } catch (err) {
      console.warn("Gagal update pejabat penandatangan ke Supabase:", err);
    }
  }

  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  revalidatePath("/verify");

  return { success: true, cert };
}

/**
 * Admin: Perbarui status kelulusan mahasiswa
 */
export async function adminUpdateStudentStatusAction(
  userId: string,
  completion_status: string
) {
  await requireAdmin();
  const cert = bdcStore.getCertificateByUserId(userId);
  if (cert) {
    bdcStore.updateCertificate(cert.id, { completion_status });
  }

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    try {
      if (cert) {
        await supabaseAdmin
          .from("certificates")
          .update({ completion_status, updated_at: new Date().toISOString() })
          .eq("id", cert.id);
      }
      await supabaseAdmin
        .from("profiles")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", userId);
    } catch (err) {
      console.warn("Gagal update status mahasiswa di Supabase:", err);
    }
  }

  revalidatePath("/admin/students");
  revalidatePath("/certificates");

  return { success: true };
}
