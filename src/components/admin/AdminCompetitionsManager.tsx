"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Trash2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  UploadCloud,
  X,
} from "lucide-react";
import { Competition } from "@/lib/types/database";
import {
  adminCreateCompetitionAction,
  adminDeleteCompetitionAction,
  fetchLinkMetadataAction,
  createGuidebookUploadAction,
  removeGuidebookFileAction,
} from "@/lib/actions/competitions";
import { createClient } from "@/lib/supabase/client";
import { BdcDots } from "@/components/ui/BdcDots";

const GUIDEBOOK_EXTENSIONS = ["pdf", "doc", "docx", "ppt", "pptx", "txt", "zip"];
const GUIDEBOOK_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

interface UploadedGuidebook {
  name: string;
  path: string;
}

/**
 * Status kadaluarsa diturunkan dari `expires_at` vs waktu render —
 * pola yang sama dengan `deriveCompetitionStatus` di store (server).
 */
function competitionStatus(c: Competition): "ongoing" | "expired" {
  if (!c.expires_at) return "ongoing";
  const end = new Date(c.expires_at).getTime();
  return isNaN(end) || Date.now() < end ? "ongoing" : "expired";
}

function guidebookUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${base}/storage/v1/object/public/guidebooks/${encodeURIComponent(path)}`;
}

interface AdminCompetitionsManagerProps {
  initialCompetitions: Competition[];
}

export function AdminCompetitionsManager({ initialCompetitions }: AdminCompetitionsManagerProps) {
  const [competitions, setCompetitions] = useState<Competition[]>(initialCompetitions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [guidebook, setGuidebook] = useState<UploadedGuidebook | null>(null);
  const [fileNotice, setFileNotice] = useState<{ success: boolean; message: string } | null>(null);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setDescription("");
    setImageUrl("");
    setDeadline("");
    setGuidebook(null);
    setFileNotice(null);
  };

  // 1) Ambil nama, deskripsi & gambar otomatis dari tautan (pratinjau share link)
  const handleFetchMetadata = async () => {
    if (!url.trim()) {
      setResult({ success: false, message: "Isi tautan lomba terlebih dahulu." });
      return;
    }
    setIsFetchingMeta(true);
    setResult(null);
    try {
      const res = await fetchLinkMetadataAction(url.trim());
      if (res.success) {
        if (res.title) setTitle(res.title);
        if (res.description) setDescription(res.description);
        if (res.image) setImageUrl(res.image);
        setResult({ success: true, message: res.message });
      } else {
        setResult({ success: false, message: res.message });
      }
    } catch (err) {
      console.error(err);
      setResult({ success: false, message: "Gagal mengambil data dari tautan." });
    } finally {
      setIsFetchingMeta(false);
    }
  };

  // 2) Unggah guidebook ke Supabase Storage via signed upload URL
  //    (langsung dari browser — melewati batas payload 4.5MB Vercel)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!GUIDEBOOK_EXTENSIONS.includes(ext)) {
      setFileNotice({
        success: false,
        message: `Format tidak didukung. Gunakan: ${GUIDEBOOK_EXTENSIONS.join(", ")}.`,
      });
      e.target.value = "";
      return;
    }
    if (file.size > GUIDEBOOK_MAX_BYTES) {
      setFileNotice({ success: false, message: "Ukuran file maksimal 10 MB." });
      e.target.value = "";
      return;
    }

    // Bersihkan unggahan lama bila file diganti
    if (guidebook) {
      await removeGuidebookFileAction(guidebook.path);
      setGuidebook(null);
    }

    setIsUploading(true);
    setFileNotice(null);
    try {
      const signed = await createGuidebookUploadAction(file.name);
      if (!signed.success || !signed.path || !signed.token) {
        setFileNotice({ success: false, message: signed.message });
        e.target.value = "";
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.storage
        .from("guidebooks")
        .uploadToSignedUrl(signed.path, signed.token, file, {
          contentType: file.type || "application/octet-stream",
        });

      if (error) {
        setFileNotice({ success: false, message: `Gagal mengunggah: ${error.message}` });
        e.target.value = "";
        return;
      }

      setGuidebook({ name: file.name, path: signed.path });
      setFileNotice({ success: true, message: `Guidebook "${file.name}" siap diunggah.` });
    } catch (err) {
      console.error(err);
      setFileNotice({ success: false, message: "Terjadi kesalahan jaringan saat mengunggah." });
      e.target.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveGuidebook = async () => {
    if (!guidebook) return;
    await removeGuidebookFileAction(guidebook.path);
    setGuidebook(null);
    setFileNotice(null);
  };

  // 3) Terbitkan info lomba
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await adminCreateCompetitionAction({
        title,
        description,
        url,
        image_url: imageUrl.trim() || null,
        guidebook_name: guidebook?.name || null,
        guidebook_path: guidebook?.path || null,
        expires_at: deadline ? new Date(deadline).toISOString() : null,
      });

      setResult({ success: res.success, message: res.message });
      if (res.success && res.competition) {
        setCompetitions((prev) => [res.competition!, ...prev]);
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setResult({ success: false, message: "Terjadi kesalahan jaringan saat menerbitkan lomba." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (competition: Competition) => {
    if (!deletingId) {
      setDeletingId(competition.id);
      return;
    }
    if (deletingId !== competition.id) {
      setDeletingId(competition.id);
      return;
    }

    try {
      const res = await adminDeleteCompetitionAction(competition.id);
      if (res.success) {
        setCompetitions((prev) => prev.filter((c) => c.id !== competition.id));
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm text-xs bg-white";

  return (
    <div className="space-y-6 font-sans">
      {/* Form Penerbitan Info Lomba */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#d9dfd7]">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-bdc-blue tracking-wider block">
              [ PENERBITAN INFO LOMBA &amp; EVENT ]
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                Terbitkan Info Lomba Baru untuk Mahasiswa
              </h3>
              <BdcDots size="sm" />
            </div>
          </div>
          <Megaphone className="w-6 h-6 text-bdc-yellow shrink-0 hidden sm:block" />
        </div>

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          {/* Tautan lomba + tombol ambil metadata */}
          <div>
            <label className="block font-space font-bold text-slate-800 mb-1">
              Tautan Lomba / Event
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://lombakampus.example.com/..."
                className={`${inputClass} font-mono`}
              />
              <button
                type="button"
                onClick={handleFetchMetadata}
                disabled={isFetchingMeta}
                className="retro-btn px-4 py-2.5 rounded-xl bg-[#fffefa] text-bdc-navy border border-bdc-midnight font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-retro-sm text-xs whitespace-nowrap"
              >
                {isFetchingMeta ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Membaca...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-bdc-yellow" />
                    <span>Ambil dari Tautan</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block font-mono">
              Nama, deskripsi &amp; gambar terisi otomatis dari halaman tautan (seperti pratinjau
              share WhatsApp). Bisa disalin manual bila situs memblokir bot.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-space font-bold text-slate-800 mb-1">
                Nama Lomba / Event
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Hackathon Nasional Mahasiswa 2026"
                className={`${inputClass} font-space font-bold text-sm`}
              />
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">
                Batas Waktu Pendaftaran (Opsional)
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`${inputClass} font-mono`}
              />
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                Lewat dari waktu ini, lomba otomatis ditandai Kadaluarsa di portal.
              </span>
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">
                Gambar Preview (Opsional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (terisi otomatis dari tautan)"
                  className={`${inputClass} font-mono`}
                />
                {imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imageUrl}
                    alt="Pratinjau"
                    className="w-11 h-11 rounded-lg border border-slate-300 object-cover shrink-0"
                  />
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-space font-bold text-slate-800 mb-1">
                Deskripsi Singkat (Opsional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Syarat, hadiah, dan info penting lomba..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-space font-bold text-slate-800 mb-1">
                Guidebook / Brosur (Opsional, maks 10 MB)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="retro-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fffefa] border border-bdc-midnight font-bold cursor-pointer transition-all shadow-retro-sm text-xs">
                  {isUploading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-bdc-blue" />
                  ) : (
                    <UploadCloud className="w-4 h-4 text-bdc-blue" />
                  )}
                  <span>{isUploading ? "Mengunggah..." : "Pilih File"}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                </label>
                {guidebook && (
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs">
                    <FileDown className="w-4 h-4" />
                    <span className="max-w-[220px] truncate">{guidebook.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveGuidebook}
                      className="text-emerald-600 hover:text-red-600"
                      title="Hapus file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
              {fileNotice && (
                <p
                  className={`text-[10px] mt-1.5 font-mono ${
                    fileNotice.success ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {fileNotice.message}
                </p>
              )}
            </div>
          </div>

          {result && (
            <div
              className={`p-3.5 rounded-2xl border-2 text-xs font-bold flex items-center gap-2 shadow-retro-sm ${
                result.success
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="retro-btn px-5 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-retro-sm border border-bdc-midnight text-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-bdc-yellow" />
                  <span>Menerbitkan...</span>
                </>
              ) : (
                <>
                  <Megaphone className="w-4 h-4 text-bdc-yellow" />
                  <span>Terbitkan Lomba</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Lomba Terbit */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro overflow-hidden">
        <div className="px-6 py-4 bg-[#f4f3ea] border-b border-[#d9dfd7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-bdc-blue" />
            <h3 className="font-space text-sm font-bold text-bdc-midnight">
              Lomba Terbit ({competitions.length})
            </h3>
          </div>
          <BdcDots size="sm" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold border-b border-[#d9dfd7]">
              <tr>
                <th className="py-3 px-4">Lomba / Event</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Batas Waktu</th>
                <th className="py-3 px-4 text-center">Tautan</th>
                <th className="py-3 px-4 text-center">Guidebook</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9dfd7]">
              {competitions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    Belum ada info lomba terbit. Mulai dengan mengisi formulir di atas.
                  </td>
                </tr>
              ) : (
                competitions.map((c) => {
                  const status = competitionStatus(c);
                  const deadlineText = c.expires_at
                    ? new Date(c.expires_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Jakarta",
                      }) + " WIB"
                    : "Tanpa batas";
                  return (
                    <tr key={c.id} className="hover:bg-[#fff8e6] transition-colors">
                      <td className="py-3.5 px-4 max-w-[300px]">
                        <p className="font-space font-bold text-sm text-bdc-midnight truncate">
                          {c.title}
                        </p>
                        {c.description && (
                          <p className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                            {c.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wide border ${
                            status === "ongoing"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                              : "bg-slate-100 border-slate-300 text-slate-500"
                          }`}
                        >
                          {status === "ongoing" ? "Masih Dibuka" : "Kadaluarsa"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        {deadlineText}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-bdc-blue hover:text-bdc-navy hover:underline font-mono text-[11px]"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span>Buka</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {c.guidebook_path ? (
                          <a
                            href={guidebookUrl(c.guidebook_path)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-bdc-blue hover:text-bdc-navy hover:underline font-mono text-[11px]"
                          >
                            <FileDown className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[110px]">
                              {c.guidebook_name || "Unduh"}
                            </span>
                          </a>
                        ) : (
                          <span className="font-mono text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          className={`retro-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-retro-sm border ${
                            deletingId === c.id
                              ? "bg-red-600 text-white border-red-700"
                              : "bg-[#fffefa] text-red-600 border-red-300 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{deletingId === c.id ? "Klik lagi untuk hapus" : "Hapus"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
