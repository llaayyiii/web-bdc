"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";
import { bdcStore } from "../data/store";
import { hydrateFromDb } from "../data/db";
import { createAdminClient } from "../supabase/admin";
import { Competition } from "../types/database";

export interface CompetitionResult {
  success: boolean;
  message: string;
  competition?: Competition;
}

export interface LinkMetadataResult {
  success: boolean;
  message: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface SignedUploadResult {
  success: boolean;
  message: string;
  path?: string;
  token?: string;
  publicUrl?: string;
}

/** Hanya admin / instruktur yang boleh mengelola info lomba. */
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    throw new Error("Akses ditolak: Hanya admin atau instruktur yang diizinkan.");
  }
  await hydrateFromDb();
  return user;
}

/** Ekstensi file guidebook yang diizinkan diunggah. */
const GUIDEBOOK_EXTENSIONS = ["pdf", "doc", "docx", "ppt", "pptx", "txt", "zip"];
const GUIDEBOOK_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function validateUrl(raw: string): string | null {
  const clean = (raw || "").trim();
  if (!clean) return "Tautan lomba wajib diisi.";
  try {
    const parsed = new URL(clean);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "Tautan harus diawali https:// atau http://.";
    }
  } catch {
    return "Format tautan tidak valid. Gunakan URL lengkap (https://...).";
  }
  return null;
}

/**
 * Mengambil seluruh info lomba dari database (dipakai halaman admin).
 */
export async function adminGetAllCompetitionsAction(): Promise<Competition[]> {
  await requireAdmin();
  return bdcStore.getCompetitions();
}

/**
 * Menerbitkan info lomba / event baru ke portal mahasiswa.
 * Menyimpan ke store lalu meng-upsert ke tabel `competitions`.
 */
export async function adminCreateCompetitionAction(input: {
  title: string;
  description: string;
  url: string;
  image_url?: string | null;
  guidebook_name?: string | null;
  guidebook_path?: string | null;
  expires_at?: string | null;
}): Promise<CompetitionResult> {
  await requireAdmin();

  const title = (input.title || "").trim();
  if (!title) {
    return { success: false, message: "Nama lomba / event wajib diisi." };
  }

  const urlError = validateUrl(input.url);
  if (urlError) {
    return { success: false, message: urlError };
  }

  let expiresAt: string | null = null;
  if ((input.expires_at || "").trim()) {
    const parsed = new Date(input.expires_at!);
    if (isNaN(parsed.getTime())) {
      return { success: false, message: "Tanggal batas waktu tidak valid." };
    }
    expiresAt = parsed.toISOString();
  }

  // Validasi file guidebook bila diunggah (path sudah dibuat lewat signed upload)
  if (input.guidebook_path) {
    const ext = input.guidebook_path.split(".").pop()?.toLowerCase() || "";
    if (!GUIDEBOOK_EXTENSIONS.includes(ext)) {
      return {
        success: false,
        message: `Format guidebook tidak didukung. Gunakan: ${GUIDEBOOK_EXTENSIONS.join(", ")}.`,
      };
    }
  }

  const newCompetition = bdcStore.createCompetition({
    title,
    description: (input.description || "").trim(),
    url: input.url.trim(),
    image_url: (input.image_url || "").trim() || null,
    guidebook_name: (input.guidebook_name || "").trim() || null,
    guidebook_path: (input.guidebook_path || "").trim() || null,
    expires_at: expiresAt,
  });

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.from("competitions").upsert({
      id: newCompetition.id,
      title: newCompetition.title,
      description: newCompetition.description,
      url: newCompetition.url,
      image_url: newCompetition.image_url,
      guidebook_name: newCompetition.guidebook_name,
      guidebook_path: newCompetition.guidebook_path,
      expires_at: newCompetition.expires_at,
      created_at: newCompetition.created_at,
    });
    if (error) {
      console.warn("Sinkronisasi lomba ke Supabase:", error.message);
      return {
        success: false,
        message: `Gagal menyimpan ke database: ${error.message}`,
      };
    }
  }

  revalidatePath("/admin/competitions");
  revalidatePath("/competitions");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: `Info lomba "${title}" berhasil diterbitkan ke portal.`,
    competition: newCompetition,
  };
}

/**
 * Menghapus info lomba beserta file guidebook-nya (bila ada).
 */
export async function adminDeleteCompetitionAction(id: string): Promise<CompetitionResult> {
  await requireAdmin();

  const existing = bdcStore.getCompetitionById(id);
  if (!existing) {
    return { success: false, message: "Info lomba tidak ditemukan." };
  }

  const supabaseAdmin = createAdminClient();
  if (supabaseAdmin) {
    // Hapus file guidebook dari Storage (best-effort, bukan blokir)
    if (existing.guidebook_path) {
      try {
        await supabaseAdmin.storage.from("guidebooks").remove([existing.guidebook_path]);
      } catch (err) {
        console.warn("Gagal menghapus file guidebook:", err);
      }
    }

    const { error } = await supabaseAdmin.from("competitions").delete().eq("id", id);
    if (error) {
      console.warn("Penghapusan lomba di Supabase:", error.message);
      return { success: false, message: `Gagal menghapus dari database: ${error.message}` };
    }
  }

  bdcStore.deleteCompetition(id);

  revalidatePath("/admin/competitions");
  revalidatePath("/competitions");
  revalidatePath("/dashboard");

  return { success: true, message: `Info lomba "${existing.title}" dihapus.` };
}

/**
 * Membaca metadata Open Graph (nama, deskripsi, gambar) dari sebuah tautan
 * di server — sama seperti pratinjau share WhatsApp. Dipakai form admin
 * untuk mengisi otomatis nama & gambar lomba dari URL yang ditempel.
 */
export async function fetchLinkMetadataAction(url: string): Promise<LinkMetadataResult> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    return { success: false, message: "Akses ditolak." };
  }

  const urlError = validateUrl(url);
  if (urlError) {
    return { success: false, message: urlError };
  }

  try {
    const res = await fetch(url.trim(), {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return {
        success: false,
        message: `Halaman target merespons HTTP ${res.status}. Isi nama & gambar secara manual.`,
      };
    }

    // Baca maksimal 512 KB pertama — cukup untuk <head> berisi tag OG
    const html = await readHtmlHead(res, 512 * 1024);
    const base = new URL(url.trim());

    const title =
      getMetaContent(html, "og:title") ||
      getMetaContent(html, "twitter:title") ||
      extractTitle(html);
    const description =
      getMetaContent(html, "og:description") ||
      getMetaContent(html, "description") ||
      getMetaContent(html, "twitter:description");
    const rawImage =
      getMetaContent(html, "og:image") ||
      getMetaContent(html, "og:image:url") ||
      getMetaContent(html, "twitter:image");

    let image: string | undefined;
    if (rawImage) {
      try {
        image = new URL(decodeEntities(rawImage), base).toString();
      } catch {
        image = undefined;
      }
    }

    if (!title && !image) {
      return {
        success: false,
        message:
          "Situs tersebut tidak menyediakan pratinjau (mungkin memblokir bot). Isi nama & gambar secara manual.",
      };
    }

    return {
      success: true,
      message: "Metadata berhasil dibaca dari tautan.",
      title: title || undefined,
      description: description || undefined,
      image,
    };
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    return {
      success: false,
      message: timedOut
        ? "Situs tidak merespons dalam 8 detik. Isi nama & gambar secara manual."
        : "Gagal membaca halaman tautan. Isi nama & gambar secara manual.",
    };
  }
}

/**
 * Membuat signed upload URL untuk file guidebook. File diunggah langsung
 * dari browser ke Supabase Storage (melewati batas payload 4.5MB Vercel);
 * server hanya menerima metadata nama file.
 */
export async function createGuidebookUploadAction(
  filename: string
): Promise<SignedUploadResult> {
  await requireAdmin();

  const cleanName = (filename || "").trim().replace(/[/\\]/g, "_");
  const ext = cleanName.split(".").pop()?.toLowerCase() || "";
  if (!GUIDEBOOK_EXTENSIONS.includes(ext)) {
    return {
      success: false,
      message: `Format file tidak didukung. Gunakan: ${GUIDEBOOK_EXTENSIONS.join(", ")}.`,
    };
  }

  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin) {
    return { success: false, message: "Storage tidak terkonfigurasi." };
  }

  const path = `comp-${Date.now()}-${cleanName.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { data, error } = await supabaseAdmin.storage.from("guidebooks").createSignedUploadUrl(path);
  if (error || !data?.token) {
    return { success: false, message: `Gagal menyiapkan unggahan: ${error?.message || "tidak diketahui"}` };
  }

  const { data: pub } = supabaseAdmin.storage.from("guidebooks").getPublicUrl(path);

  return {
    success: true,
    message: "Signed upload URL siap.",
    path,
    token: data.token,
    publicUrl: pub.publicUrl,
  };
}

/** Membersihkan file guidebook yang diunggah tapi batal dipakai. */
export async function removeGuidebookFileAction(path: string): Promise<{ success: boolean }> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    return { success: false };
  }
  if (!path || path.includes("..")) return { success: false };

  const supabaseAdmin = createAdminClient();
  if (!supabaseAdmin) return { success: false };
  try {
    await supabaseAdmin.storage.from("guidebooks").remove([path]);
    return { success: true };
  } catch {
    return { success: false };
  }
}

/** Membaca ≤ maxBytes pertama dari respons sebagai teks HTML. */
async function readHtmlHead(res: Response, maxBytes: number): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) {
    const text = await res.text();
    return text.slice(0, maxBytes);
  }

  const chunks: Uint8Array[] = [];
  let received = 0;
  while (received < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      received += value.length;
    }
  }
  try {
    await reader.cancel();
  } catch {
    /* diabaikan */
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(merged);
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/** Cari konten meta berdasarkan property/name (dua arah urutan atribut). */
function getMetaContent(html: string, key: string): string | null {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`,
      "i"
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1].trim());
  }
  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeEntities(match[1].trim()) : null;
}
