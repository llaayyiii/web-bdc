"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  QrCode,
  Plus,
  Play,
  Square,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Clock,
  User,
  Radio,
  Trash2,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { MeetSession } from "@/lib/types/database";
import {
  adminCreateMeetSessionAction,
  adminUpdateMeetSessionAction,
  adminDeleteMeetSessionAction,
  adminStartSessionNowAction,
  adminEndSessionNowAction,
  getAllMeetSessionsAction,
} from "@/lib/actions/sessions";
import { BdcDots } from "@/components/ui/BdcDots";

interface SessionsManagerProps {
  initialSessions: MeetSession[];
}

/** Format Date object ke string input type datetime-local (YYYY-MM-DDTHH:mm) */
function toDatetimeLocalString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function SessionsManager({ initialSessions }: SessionsManagerProps) {
  const [sessions, setSessions] = useState<MeetSession[]>(initialSessions);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<MeetSession | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // New session form state
  const [title, setTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("Ngoding Bareng: Membangun Web App Interaktif dari Nol");
  const [instructor, setInstructor] = useState("Dr. Evelyn Vance");
  const [meetUrl, setMeetUrl] = useState("https://meet.google.com/bdc-utdi-web");

  // Default jadwal: mulai sekarang s/d 3 jam ke depan
  const now = new Date();
  const defaultEnd = new Date(now.getTime() + 3 * 3600 * 1000);
  const [scheduledAtStr, setScheduledAtStr] = useState<string>(toDatetimeLocalString(now));
  const [expiresAtStr, setExpiresAtStr] = useState<string>(toDatetimeLocalString(defaultEnd));

  // Polling data sesi setiap 30 detik agar perubahan waktu otomatis berganti live/selesai
  useEffect(() => {
    if (actionLoadingId) return;
    let active = true;
    const timer = setInterval(async () => {
      try {
        const fresh = await getAllMeetSessionsAction();
        if (active && fresh && Array.isArray(fresh)) {
          setSessions(fresh);
        }
      } catch (err) {
        console.warn("Gagal auto-refresh sesi:", err);
      }
    }, 30000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [actionLoadingId]);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartNow = async (sessionId: string) => {
    setActionLoadingId(sessionId);
    setActionError(null);
    try {
      const res = await adminStartSessionNowAction(sessionId);
      if (res.success && res.session) {
        setSessions((prev) => prev.map((s) => (s.id === sessionId ? res.session! : s)));
      } else {
        setActionError(res.message);
      }
    } catch (err) {
      console.error(err);
      setActionError("Gagal memulai sesi. Silakan coba lagi.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEndNow = async (sessionId: string) => {
    setActionLoadingId(sessionId);
    setActionError(null);
    try {
      const res = await adminEndSessionNowAction(sessionId);
      if (res.success && res.session) {
        setSessions((prev) => prev.map((s) => (s.id === sessionId ? res.session! : s)));
      } else {
        setActionError(res.message);
      }
    } catch (err) {
      console.error(err);
      setActionError("Gagal mengakhiri sesi. Silakan coba lagi.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !meetUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const startDate = new Date(scheduledAtStr);
      const endDate = new Date(expiresAtStr);

      if (endDate.getTime() <= startDate.getTime()) {
        alert("Waktu selesai harus lebih lambat dari waktu mulai pertemuan.");
        setIsSubmitting(false);
        return;
      }

      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const res = await adminCreateMeetSessionAction({
        course_id: "ACT-01",
        course_title: courseTitle,
        title: title.trim(),
        instructor: instructor.trim(),
        meet_url: meetUrl.trim(),
        qr_token: `BDC-${randomSuffix}`,
        scheduled_at: startDate.toISOString(),
        expires_at: endDate.toISOString(),
        status: "scheduled", // status sesungguhnya akan dihitung otomatis oleh store
      });

      if (res.success && res.session) {
        setSessions([res.session, ...sessions]);
        setShowModal(false);
        setTitle("");
        // Reset jadwal ke default
        const freshNow = new Date();
        const freshEnd = new Date(freshNow.getTime() + 3 * 3600 * 1000);
        setScheduledAtStr(toDatetimeLocalString(freshNow));
        setExpiresAtStr(toDatetimeLocalString(freshEnd));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await adminDeleteMeetSessionAction(sessionToDelete.id);
      if (!res.success) {
        setDeleteError(res.message || "Gagal menghapus sesi.");
        return;
      }

      setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete.id));
      setSessionToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus sesi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
              Daftar Sesi Kuliah &amp; Presensi Barcode
            </h2>
            <BdcDots size="sm" />
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Kelola tautan Google Meet dan luncurkan layar proyektor presensi untuk kelas tatap muka
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="retro-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm border border-bdc-midnight shrink-0"
        >
          <Plus className="w-4 h-4 text-bdc-yellow" />
          <span>Jadwalkan Sesi Baru</span>
        </button>
      </div>

      {actionError && (
        <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {actionError}
        </p>
      )}

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 gap-4">
        {sessions.length === 0 ? (
          <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-8 sm:p-12 text-center shadow-retro space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EFF0F0] border border-slate-300 flex items-center justify-center text-slate-400 shadow-retro-sm">
              <Video className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-space text-lg font-bold text-bdc-midnight">
                Belum Ada Sesi Pertemuan
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-sans">
                Pangkalan data sesi pertemuan telah dibersihkan. Klik tombol &quot;Jadwalkan Sesi Baru&quot; di atas untuk membuka kelas kuliah tatap muka atau Google Meet baru.
              </p>
            </div>
          </div>
        ) : (
          sessions.map((sess) => {
          const isLive = sess.status === "live";
          return (
            <div
              key={sess.id}
              className={`p-6 rounded-3xl border transition-all bg-[#fffefa] shadow-retro hover:shadow-retro-lg ${
                isLive ? "border-bdc-blue shadow-[inset_0_4px_0_#095BAF]" : "border-[#d9dfd7]"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Session Info */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-retro-sm">
                        <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                        Live Sesi Berlangsung
                      </span>
                    ) : sess.status === "scheduled" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300 shadow-retro-sm">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Terjadwal (Otomatis Live)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase bg-[#EFF0F0] text-slate-600 border border-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-slate-500" />
                        Selesai
                      </span>
                    )}

                    <span className="font-mono text-xs text-slate-600 bg-[#EFF0F0] px-2.5 py-1 rounded-xl border border-slate-300">
                      Token QR: <strong className="text-bdc-midnight font-bold">{sess.qr_token}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight leading-snug">
                      {sess.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 font-sans">
                      {sess.course_title}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-mono">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sess.instructor}</span>
                    </span>
                    <span className="flex items-center gap-1.5" title="Jadwal otomatis sesi">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(sess.scheduled_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                      <Clock className="w-3 h-3 text-bdc-blue" />
                      <span>
                        {new Date(sess.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} &ndash; {new Date(sess.expires_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#d9dfd7]">
                  {/* Tombol Override Mulai / Akhiri Sekarang */}
                  {isLive ? (
                    <button
                      type="button"
                      disabled={actionLoadingId === sess.id}
                      onClick={() => handleEndNow(sess.id)}
                      className="retro-btn px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-retro-sm disabled:opacity-50"
                      title="Akhiri sesi sekarang (tutup presensi)"
                    >
                      <Square className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                      <span>{actionLoadingId === sess.id ? "..." : "Akhiri Sesi"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={actionLoadingId === sess.id}
                      onClick={() => handleStartNow(sess.id)}
                      className="retro-btn px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-retro-sm disabled:opacity-50"
                      title="Mulai sesi sekarang (jadikan live & buka presensi)"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                      <span>{actionLoadingId === sess.id ? "..." : "Mulai Sekarang"}</span>
                    </button>
                  )}

                  {/* Copy Meet Link */}
                  <button
                    type="button"
                    onClick={() => handleCopyLink(sess.meet_url, sess.id)}
                    className="retro-btn p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-bdc-midnight hover:bg-slate-100 transition-all text-xs font-medium flex items-center gap-1.5 shadow-retro-sm bg-white"
                    title="Salin Link Google Meet"
                  >
                    {copiedId === sess.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Open Meet */}
                  <a
                    href={sess.meet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retro-btn px-3.5 py-2 rounded-xl bg-[#EFF0F0] hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-300 shadow-retro-sm"
                  >
                    <Video className="w-4 h-4 text-bdc-blue" />
                    <span>Meet</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>

                  {/* Open Presenter Screen */}
                  <Link
                    href={`/admin/sessions/${sess.id}/presenter`}
                    onClick={() => {
                      // Minta layar penuh dalam gestur klik (Mode Proyektor otomatis fullscreen)
                      document.documentElement.requestFullscreen().catch(() => {});
                    }}
                    className="retro-btn px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all flex items-center gap-2 shadow-retro-sm border border-bdc-midnight"
                  >
                    <QrCode className="w-4 h-4 text-bdc-yellow" />
                    <span>Layar Proyektor QR</span>
                  </Link>

                  {/* Tombol Hapus Sesi */}
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError(null);
                      setSessionToDelete(sess);
                    }}
                    className="retro-btn p-2.5 rounded-xl border border-rose-300 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all text-xs font-medium flex items-center gap-1.5 shadow-retro-sm bg-white"
                    title="Hapus Sesi Pertemuan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Modal Add Session */}
      {showModal && (
        <div className="fixed inset-0 bg-[#000741]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fffefa] rounded-3xl border-2 border-bdc-midnight shadow-retro-lg w-full max-w-lg p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-bdc-blue tracking-wider block">
                  [ KURATOR SESSION BUILDER ]
                </span>
                <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                  Jadwalkan Sesi Tatap Muka Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-bdc-midnight font-bold text-sm px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-space font-bold text-slate-800 mb-1">
                  Judul Sesi Pertemuan
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Sesi 4: Praktik Deployment Vercel & Supabase"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm bg-white"
                />
              </div>

              <div>
                <label className="block font-space font-bold text-slate-800 mb-1">
                  Nama Modul / Course
                </label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm bg-white"
                />
              </div>

              <div>
                <label className="block font-space font-bold text-slate-800 mb-1">
                  Nama Pemateri / Instruktur
                </label>
                <input
                  type="text"
                  required
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300">
                <div>
                  <label className="block font-space font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-bdc-blue" />
                    <span>Waktu Mulai</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAtStr}
                    onChange={(e) => setScheduledAtStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight bg-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-space font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Waktu Selesai (Tutup)</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={expiresAtStr}
                    onChange={(e) => setExpiresAtStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight bg-white font-mono text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[11px] text-slate-600 font-sans leading-tight">
                    ⚡ <strong>Otomatis Tanpa Klik Manual:</strong> Sesi otomatis <em>Live & Buka Presensi</em> saat waktu mulai tiba, dan otomatis <em>Selesai & Tutup</em> saat waktu selesai.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-space font-bold text-slate-800 mb-1">
                  Tautan Google Meet Kampus Resmi
                </label>
                <input
                  type="url"
                  required
                  value={meetUrl}
                  onChange={(e) => setMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm font-mono text-xs bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#d9dfd7]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="retro-btn px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-all shadow-retro-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="retro-btn px-5 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all disabled:opacity-50 shadow-retro-sm border border-bdc-midnight"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan & Luncurkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Sesi */}
      {sessionToDelete && (
        <div className="fixed inset-0 bg-[#000741]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fffefa] rounded-3xl border-2 border-rose-600 shadow-retro-lg w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#d9dfd7]">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-300 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-space text-base font-bold text-bdc-midnight">
                  Hapus Sesi Pertemuan?
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Konfirmasi pembatalan atau hapus data sesi salah ketik
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans">
                {deleteError}
              </div>
            )}

            <div className="space-y-2 text-xs font-sans text-slate-700 bg-[#EFF0F0] p-4 rounded-2xl border border-slate-300">
              <p>
                Sesi berikut akan dihapus secara permanen dari pangkalan data:
              </p>
              <p className="font-bold font-space text-sm text-bdc-midnight">
                &ldquo;{sessionToDelete.title}&rdquo;
              </p>
              <p className="font-mono text-[11px] text-slate-500">
                Token QR: <span className="font-bold text-rose-700">{sessionToDelete.qr_token}</span>
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#d9dfd7]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setSessionToDelete(null)}
                className="retro-btn px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-all text-xs shadow-retro-sm"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="retro-btn px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all text-xs disabled:opacity-50 flex items-center gap-2 shadow-retro-sm border border-rose-700"
              >
                {isDeleting ? (
                  <span>Menghapus...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Sesi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
