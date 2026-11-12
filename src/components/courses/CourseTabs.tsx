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
import { BdcDots } from "@/components/ui/BdcDots";

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
    <div className="space-y-6 font-sans">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 border-b border-[#d9dfd7] pb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("syllabus")}
          className={`retro-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "syllabus"
              ? "bg-bdc-midnight text-white shadow-retro-sm border-2 border-bdc-midnight"
              : "bg-[#fffefa] text-slate-700 hover:bg-[#EFF0F0] border border-[#d9dfd7]"
          }`}
        >
          <BookOpen className="w-4 h-4 text-bdc-yellow" />
          <span>Silabus &amp; Capstone Checklist</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("attendance")}
          className={`retro-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "attendance"
              ? "bg-bdc-midnight text-white shadow-retro-sm border-2 border-bdc-midnight"
              : "bg-[#fffefa] text-slate-700 hover:bg-[#EFF0F0] border border-[#d9dfd7]"
          }`}
        >
          <QrCode className="w-4 h-4 text-bdc-yellow" />
          <span>Sesi Presensi ({courseSessions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assignments")}
          className={`retro-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "assignments"
              ? "bg-bdc-midnight text-white shadow-retro-sm border-2 border-bdc-midnight"
              : "bg-[#fffefa] text-slate-700 hover:bg-[#EFF0F0] border border-[#d9dfd7]"
          }`}
        >
          <FolderGit2 className="w-4 h-4 text-bdc-yellow" />
          <span>Tugas Proyek ({courseAssignments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("meet")}
          className={`retro-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "meet"
              ? "bg-bdc-midnight text-white shadow-retro-sm border-2 border-bdc-midnight"
              : "bg-[#fffefa] text-slate-700 hover:bg-[#EFF0F0] border border-[#d9dfd7]"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#fffefa] p-5 sm:p-6 rounded-3xl border border-[#d9dfd7] shadow-retro gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                  Sesi Kuliah &amp; Presensi Barcode Modul Ini
                </h3>
                <BdcDots size="sm" />
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Pindai barcode saat sesi dibuka atau masukkan token yang ditampilkan oleh instruktur di kelas
              </p>
            </div>

            <Link
              href="/attendance"
              className="retro-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm shrink-0"
            >
              <QrCode className="w-4 h-4 text-bdc-yellow" />
              <span>Buka Pemindai Barcode</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {courseSessions.length === 0 ? (
              <div className="bg-[#fffefa] p-8 rounded-3xl border border-[#d9dfd7] text-center text-slate-400 font-mono shadow-retro-sm">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">Belum ada sesi presensi untuk modul ini.</p>
              </div>
            ) : (
              courseSessions.map((sess) => {
                const isLive = sess.status === "live";
                return (
                  <div
                    key={sess.id}
                    className={`p-5 rounded-2xl border bg-[#fffefa] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-retro-sm ${
                      isLive ? "border-bdc-blue shadow-[inset_0_4px_0_#095BAF]" : "border-[#d9dfd7]"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                            Live Sekarang
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-[#EFF0F0] text-slate-600 border border-slate-300">
                            Terjadwal
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-slate-500">
                          Token: <strong className="text-bdc-navy font-bold">{sess.qr_token}</strong>
                        </span>
                      </div>
                      <h4 className="font-space text-sm font-bold text-bdc-midnight">{sess.title}</h4>
                      <p className="text-xs text-slate-500 font-sans">
                        Instruktur: {sess.instructor} | Platform: Google Meet UTDI
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/attendance"
                        className="retro-btn px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-retro-sm"
                      >
                        <QrCode className="w-3.5 h-3.5 text-bdc-yellow" />
                        <span>Presensi Sekarang</span>
                      </Link>
                      <a
                        href={sess.meet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="retro-btn p-2 rounded-xl bg-[#EFF0F0] hover:bg-slate-200 text-slate-700 transition-all border border-slate-300 shadow-retro-sm"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#fffefa] p-5 sm:p-6 rounded-3xl border border-[#d9dfd7] shadow-retro gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                  Penugasan Proyek &amp; Studi Kasus Modul
                </h3>
                <BdcDots size="sm" />
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Kumpulkan proyek Anda untuk mendapatkan nilai dan membuka sertifikat kompetensi
              </p>
            </div>

            <Link
              href="/assignments"
              className="retro-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm shrink-0"
            >
              <FolderGit2 className="w-4 h-4 text-bdc-yellow" />
              <span>Semua Tugas BDC</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {courseAssignments.length === 0 ? (
              <div className="bg-[#fffefa] p-8 rounded-3xl border border-[#d9dfd7] text-center text-slate-400 font-mono shadow-retro-sm">
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
                    className="p-5 rounded-2xl border border-[#d9dfd7] bg-[#fffefa] shadow-retro-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-space text-sm font-bold text-bdc-midnight">{assign.title}</h4>
                      {isGraded ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Nilai: {sub?.score}/100
                        </span>
                      ) : sub ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Menunggu Penilaian
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-bold uppercase bg-[#EFF0F0] text-slate-600 border border-slate-300">
                          Batas: {assign.deadline}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed">{assign.description}</p>

                    {assign.material_url && (
                      <a
                        href={assign.material_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="retro-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EFF0F0] hover:bg-[#e4e6e6] border border-slate-300 text-bdc-midnight text-xs font-bold transition-all shadow-retro-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-bdc-blue" />
                        <span>Buka Soal / Materi (Google Drive)</span>
                      </a>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-[#d9dfd7] text-xs">
                      <span className="font-mono text-slate-500 text-[11px]">Maksimal: {assign.max_score} Poin</span>
                      <Link
                        href="/assignments"
                        className="retro-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-bdc-navy text-white text-xs font-bold hover:bg-bdc-midnight shadow-retro-sm"
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
        <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 sm:p-7 shadow-retro space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#d9dfd7] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                  Ruang Tatap Muka Virtual Google Meet
                </h3>
                <BdcDots size="sm" />
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Tautan resmi Google Meet kampus untuk sesi diskusi &amp; asistensi langsung dengan pemateri
              </p>
            </div>

            {activeSession?.status === "live" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-retro-sm self-start sm:self-auto">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                Sesi Aktif
              </span>
            )}
          </div>

          {activeSession ? (
            <div className="p-6 rounded-2xl bg-[#000741] text-white border-2 border-bdc-midnight shadow-retro space-y-4">
              <div>
                <span className="text-[10px] font-mono text-bdc-yellow uppercase tracking-wider block">
                  [ SESI TERJADWAL KAMPUS ]
                </span>
                <h4 className="font-space text-lg sm:text-xl font-bold text-white mt-1">
                  {activeSession.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  Instruktur Pendamping: <strong className="text-bdc-yellow">{activeSession.instructor}</strong>
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
                  className="retro-btn px-6 py-2.5 rounded-xl bg-bdc-yellow hover:bg-amber-400 text-bdc-midnight text-xs font-black transition-all flex items-center justify-center gap-2 shadow-retro-sm"
                >
                  <Video className="w-4 h-4 text-bdc-midnight" />
                  <span>Masuk Google Meet</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 font-mono">
              <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">Belum ada tautan meet aktif untuk modul ini.</p>
            </div>
          )}

          {/* Etika Meet */}
          <div className="p-4 rounded-2xl bg-[#EFF0F0] border border-slate-300 text-xs text-slate-700 space-y-1.5 shadow-retro-sm">
            <span className="font-space font-bold text-bdc-midnight block">
              Ketentuan Partisipasi Sesi Daring:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] font-sans">
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
