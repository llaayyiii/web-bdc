import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { CourseTabs } from "@/components/courses/CourseTabs";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const course = bdcStore.getCourseById(id);

  if (!course) {
    notFound();
  }

  const enrollment = user ? bdcStore.getEnrollment(user.id, course.id) : null;
  const initialCompletedTopics = enrollment?.completed_topics || [];

  // Filter sessions and assignments related to this course
  const allSessions = bdcStore.getSessions();
  const courseSessions = allSessions.filter(
    (s) => s.course_id === course.id || s.course_title.toLowerCase().includes(course.title.toLowerCase())
  );

  const allAssignments = bdcStore.getAssignments();
  const courseAssignments = allAssignments.filter(
    (a) => a.course_id === course.id || a.course_title.toLowerCase().includes(course.title.toLowerCase())
  );

  const userSubmissions = user ? bdcStore.getSubmissionsByUser(user.id) : [];

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Back button & Eyebrow */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex items-center justify-between">
          <Link
            href="/courses"
            className="retro-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#fffefa] text-bdc-midnight text-xs font-bold border border-[#d9dfd7] shadow-retro-sm hover:bg-[#EFF0F0] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog Modul</span>
          </Link>
          <BdcDots size="sm" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
              [ 03 // DETAIL MODUL &amp; SILABUS ]
            </span>
          </div>
          <h1 className="font-pixel text-3xl sm:text-5xl text-bdc-midnight tracking-tight">
            {course.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {course.description}
          </p>
        </div>
      </div>

      {/* 2. Course Hero & Metadata Card */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-bdc-midnight text-bdc-yellow border border-bdc-midnight shadow-retro-sm">
                {course.category}
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 bg-[#EFF0F0] px-2.5 py-1 rounded-xl border border-slate-300">
                KODE: {course.id}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standar BDC UTDI</span>
              </span>
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-retro-sm">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                  Durasi Modul
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-bdc-midnight flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-bdc-blue" />
                  <span>{course.duration}</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-retro-sm">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                  Peserta Terdaftar
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-bdc-midnight flex items-center gap-1.5 mt-0.5">
                  <Users className="w-4 h-4 text-bdc-blue" />
                  <span>{course.learners_count} Siswa</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-retro-sm col-span-2 sm:col-span-1">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                  Rating Materi
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-bdc-midnight flex items-center gap-1.5 mt-0.5">
                  <Star className="w-4 h-4 text-bdc-gold fill-bdc-gold" />
                  <span>{course.rating} / 5.0</span>
                </span>
              </div>
            </div>
          </div>

          {/* Instructor Bio Card */}
          <div className="lg:w-80 bg-[#f4f3ea] p-5 rounded-2xl border border-[#d9dfd7] shadow-retro-sm shrink-0">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              [ INSTRUKTUR / KURATOR ]
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-bdc-midnight text-bdc-yellow font-pixel text-lg flex items-center justify-center shrink-0 border-2 border-bdc-midnight shadow-retro-sm">
                {course.instructor.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-space text-sm font-bold text-bdc-midnight truncate">{course.instructor}</h3>
                <p className="text-xs text-slate-500 truncate font-sans">{course.instructor_role}</p>
                <span className="font-mono text-[10px] text-bdc-blue font-bold block mt-0.5">UTDI Yogyakarta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4 Interactive Course Tabs (Silabus, Presensi, Tugas, Link Meet) */}
      <CourseTabs
        course={course}
        initialCompletedTopics={initialCompletedTopics}
        courseSessions={courseSessions}
        courseAssignments={courseAssignments}
        userSubmissions={userSubmissions}
      />
    </div>
  );
}
