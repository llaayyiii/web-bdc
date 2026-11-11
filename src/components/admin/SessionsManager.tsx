"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Video,
  QrCode,
  Plus,
  Play,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  User,
  Radio,
} from "lucide-react";
import { MeetSession } from "@/lib/types/database";
import {
  adminCreateMeetSessionAction,
  adminUpdateMeetSessionAction,
} from "@/lib/actions/sessions";

interface SessionsManagerProps {
  initialSessions: MeetSession[];
}

export function SessionsManager({ initialSessions }: SessionsManagerProps) {
  const [sessions, setSessions] = useState<MeetSession[]>(initialSessions);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New session form state
  const [title, setTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("Ngoding Bareng: Membangun Web App Interaktif dari Nol");
  const [instructor, setInstructor] = useState("Dr. Evelyn Vance");
  const [meetUrl, setMeetUrl] = useState("https://meet.google.com/bdc-utdi-web");
  const [status, setStatus] = useState<"scheduled" | "live" | "completed">("live");

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (sessionId: string, newStatus: "scheduled" | "live" | "completed") => {
    try {
      const res = await adminUpdateMeetSessionAction(sessionId, { status: newStatus });
      if (res.success) {
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !meetUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const res = await adminCreateMeetSessionAction({
        course_id: "ACT-01",
        course_title: courseTitle,
        title: title.trim(),
        instructor: instructor.trim(),
        meet_url: meetUrl.trim(),
        qr_token: `BDC-PRESENSI-LIVE-${randomSuffix}`,
        scheduled_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
        status,
      });

      if (res.success && res.session) {
        setSessions([res.session, ...sessions]);
        setShowModal(false);
        setTitle("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-bdc-midnight">
            Daftar Sesi Pertemuan &amp; Presensi Barcode
          </h2>
          <p className="text-xs text-slate-500">
            Kelola tautan Google Meet dan luncurkan layar proyektor presensi untuk kelas tatap muka
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4 text-bdc-yellow" />
          <span>Jadwalkan Sesi Baru</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 gap-4">
        {sessions.map((sess) => {
          const isLive = sess.status === "live";
          return (
            <div
              key={sess.id}
              className={`p-5 rounded-2xl border transition-all ${
                isLive
                  ? "bg-white border-bdc-blue shadow-md ring-1 ring-bdc-blue/20"
                  : "bg-white border-slate-200/80 shadow-sm"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Session Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                        Sesi Berlangsung (Live)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                        {sess.status === "scheduled" ? "Terjadwal" : "Selesai"}
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Token QR: <strong className="text-bdc-navy">{sess.qr_token}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-bdc-midnight leading-snug">
                      {sess.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {sess.course_title}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sess.instructor}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(sess.scheduled_at).toLocaleDateString("id-ID")}</span>
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* Status selector */}
                  <select
                    value={sess.status}
                    onChange={(e) =>
                      handleStatusChange(
                        sess.id,
                        e.target.value as "scheduled" | "live" | "completed"
                      )
                    }
                    className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-bdc-blue"
                  >
                    <option value="live">Live (Aktif)</option>
                    <option value="scheduled">Terjadwal</option>
                    <option value="completed">Selesai</option>
                  </select>

                  {/* Copy Meet Link */}
                  <button
                    type="button"
                    onClick={() => handleCopyLink(sess.meet_url, sess.id)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-bdc-navy hover:bg-slate-50 transition-all text-xs font-medium flex items-center gap-1.5"
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
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Video className="w-4 h-4 text-bdc-blue" />
                    <span>Meet</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {/* Open Presenter Screen */}
                  <Link
                    href={`/admin/sessions/${sess.id}/presenter`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-bdc-navy to-bdc-blue hover:from-bdc-midnight hover:to-blue-700 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <QrCode className="w-4 h-4 text-bdc-yellow" />
                    <span>Layar Proyektor QR</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Session */}
      {showModal && (
        <div className="fixed inset-0 bg-bdc-midnight/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-bdc-midnight">
                Jadwalkan Sesi Tatap Muka Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Sesi Pertemuan
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Sesi 4: Praktik Deployment Vercel & Supabase"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Modul / Course
                </label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Pemateri / Instruktur
                  </label>
                  <input
                    type="text"
                    required
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status Awal Sesi
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue font-semibold"
                  >
                    <option value="live">Live (Langsung Dibuka)</option>
                    <option value="scheduled">Terjadwal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tautan Google Meet / Zoom Resmi
                </label>
                <input
                  type="url"
                  required
                  value={meetUrl}
                  onChange={(e) => setMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan & Luncurkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
