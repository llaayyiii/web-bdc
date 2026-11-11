"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  QrCode,
  FolderGit2,
  Video,
  Clock,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Radio,
  Calendar,
  AlertCircle,
  UploadCloud,
} from "lucide-react";
import { SyllabusChecklist } from "./SyllabusChecklist";
import { Course, MeetSession, Assignment, AssignmentSubmission } from "@/lib/types/database";

interface CourseTabsProps {
  course: Course;
  initialCompletedTopics: number[];
  courseSessions: MeetSession[];
  courseAssignments: Assignment[];
  userSubmissions: AssignmentSubmission[];
}

export function CourseTabs({
  course,
  initialCompletedTopics,
  courseSessions,
  courseAssignments,
  userSubmissions,
}: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState<"syllabus" | "attendance" | "assignments" | "meet">("syllabus");
  const [copiedLink, setCopiedLink] = useState(false);

  const activeSession = courseSessions.find((s) => s.status === "live") || courseSessions[0];

  const handleCopyMeet = () => {
    if (activeSession) {
      navigator.clipboard.writeText(activeSession.meet_url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("syllabus")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "syllabus"
              ? "bg-bdc-navy text-white shadow-md shadow-bdc-navy/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4 text-bdc-yellow" />
          <span>Silabus &amp; Capstone Checklist</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("attendance")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "attendance"
              ? "bg-bdc-navy text-white shadow-md shadow-bdc-navy/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <QrCode className="w-4 h-4 text-bdc-yellow" />
          <span>Sesi Presensi Barcode ({courseSessions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assignments")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "assignments"
              ? "bg-bdc-navy text-white shadow-md shadow-bdc-navy/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FolderGit2 className="w-4 h-4 text-bdc-yellow" />
          <span>Tugas Proyek ({courseAssignments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("meet")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "meet"
              ? "bg-bdc-navy text-white shadow-md shadow-bdc-navy/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Video className="w-4 h-4 text-bdc-yellow" />
          <span>Link Meet Tatap Muka</span>
          {activeSession?.status === "live" && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>
      </div>

      {/* Tab 1: Syllabus Checklist */}
      {activeTab === "syllabus" && (
        <SyllabusChecklist
          courseId={course.id}
          syllabus={course.syllabus}
          initialCompletedTopics={initialCompletedTopics}
        />
      )}

      {/* Tab 2: Sessions & Barcode Attendance */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-bdc-midnight">
                Sesi Kuliah &amp; Presensi Barcode Modul Ini
              </h3>
              <p className="text-xs text-slate-500">
                Pindai barcode saat sesi dibuka atau masukkan token yang ditampilkan oleh instruktur
              </p>
            </div>

            <Link
              href="/attendance"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4 text-bdc-yellow" />
              <span>Buka Pemindai Barcode</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {courseSessions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">Belum ada sesi presensi untuk modul ini.</p>
              </div>
            ) : (
              courseSessions.map((sess) => {
                const isLive = sess.status === "live";
                return (
                  <div
                    key={sess.id}
                    className={`p-5 rounded-2xl border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      isLive ? "border-bdc-blue shadow-md" : "border-slate-200/80 shadow-sm"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                            Live Sekarang
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                            Terjadwal
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-slate-400">
                          Token: <strong className="text-bdc-navy">{sess.qr_token}</strong>
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-bdc-midnight">{sess.title}</h4>
                      <p className="text-xs text-slate-500">
                        Instruktur: {sess.instructor} | Platform: Google Meet
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/attendance"
                        className="px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-bdc-yellow" />
                        <span>Presensi Sekarang</span>
                      </Link>
                      <a
                        href={sess.meet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                        title="Buka Google Meet"
                      >
                        <Video className="w-4 h-4 text-bdc-blue" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Assignments */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-bdc-midnight">
                Penugasan Proyek &amp; Studi Kasus Modul
              </h3>
              <p className="text-xs text-slate-500">
                Kumpulkan proyek Anda untuk mendapatkan nilai dan membuka sertifikat kompetensi
              </p>
            </div>

            <Link
              href="/assignments"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-sm"
            >
              <FolderGit2 className="w-4 h-4 text-bdc-yellow" />
              <span>Semua Tugas BDC</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {courseAssignments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
                <FolderGit2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">Belum ada penugasan khusus untuk modul ini.</p>
              </div>
            ) : (
              courseAssignments.map((assign) => {
                const sub = userSubmissions.find((s) => s.assignment_id === assign.id);
                const isGraded = sub?.status === "graded";
                return (
                  <div
                    key={assign.id}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-bdc-midnight">{assign.title}</h4>
                      {isGraded ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Nilai: {sub?.score}/100
                        </span>
                      ) : sub ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" />
                          Menunggu Penilaian
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          Batas: {assign.deadline}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">{assign.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="font-mono text-slate-400">Maksimal: {assign.max_score} Poin</span>
                      <Link
                        href="/assignments"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-bdc-navy text-white text-xs font-bold hover:bg-bdc-midnight"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-bdc-yellow" />
                        <span>{sub ? "Lihat Pengumpulan" : "Kumpulkan Sekarang"}</span>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Meet Link */}
      {activeTab === "meet" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-bdc-midnight">
                Ruang Tatap Muka Virtual Google Meet
              </h3>
              <p className="text-xs text-slate-500">
                Tautan resmi Google Meet kampus untuk sesi diskusi &amp; asistensi langsung dengan pemateri
              </p>
            </div>

            {activeSession?.status === "live" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                Sesi Aktif
              </span>
            )}
          </div>

          {activeSession ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-bdc-midnight via-bdc-navy to-[#0c3c86] text-white space-y-4">
              <div>
                <span className="text-[11px] font-mono text-bdc-yellow uppercase tracking-wider block">
                  Sesi Terjadwal
                </span>
                <h4 className="text-lg font-black text-white mt-1">
                  {activeSession.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Instruktur Pendamping: <strong>{activeSession.instructor}</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <div className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-200 truncate flex items-center justify-between">
                  <span className="truncate">{activeSession.meet_url}</span>
                  <button
                    type="button"
                    onClick={handleCopyMeet}
                    className="p-1 hover:text-bdc-yellow ml-2"
                    title="Salin Tautan"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <a
                  href={activeSession.meet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-bdc-yellow hover:bg-amber-400 text-bdc-midnight text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Video className="w-4 h-4 text-bdc-midnight" />
                  <span>Masuk Google Meet</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">Belum ada tautan meet aktif untuk modul ini.</p>
            </div>
          )}

          {/* Etika Meet */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-bdc-midnight block">
              Ketentuan Partisipasi Sesi Daring:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px]">
              <li>Gunakan akun email kampus <strong>@students.utdi.ac.id</strong> saat bergabung.</li>
              <li>Pastikan mikrofon dalam keadaan mute saat instruktur sedang memaparkan materi.</li>
              <li>Presensi kehadiran hanya akan dicatat melalui kode barcode / token resmi BDC.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
