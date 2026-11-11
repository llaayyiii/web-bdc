"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    throw new Error("Akses ditolak: Hanya admin atau instruktur yang diizinkan.");
  }
  return user;
}

export async function adminToggleCertificateLockAction(certId: string, isLocked: boolean) {
  await requireAdmin();
  const cert = bdcStore.updateCertificate(certId, { is_locked: isLocked });
  if (!cert) {
    return { success: false, error: "Sertifikat tidak ditemukan." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/students");
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");

  return { success: true, cert };
}

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
) {
  await requireAdmin();
  const cert = bdcStore.updateCertificate(certId, payload);
  if (!cert) {
    return { success: false, error: "Gagal memperbarui data penandatangan." };
  }

  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  revalidatePath("/verify");

  return { success: true, cert };
}

export async function adminUpdateStudentStatusAction(
  userId: string,
  completion_status: string
) {
  await requireAdmin();
  const cert = bdcStore.getCertificateByUserId(userId);
  if (cert) {
    bdcStore.updateCertificate(cert.id, { completion_status });
  }

  revalidatePath("/admin/students");
  revalidatePath("/certificates");

  return { success: true };
}
