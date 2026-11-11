import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { SyllabusChecklist } from "@/components/courses/SyllabusChecklist";
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Award,
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

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-bdc-blue hover:text-bdc-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Modul</span>
        </Link>
      </div>

      {/* Course Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${course.badge_color}`}>
                {course.category}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Kode: {course.id}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-bdc-midnight tracking-tight leading-snug">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {course.description}
            </p>

            {/* Quick Metadata */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-bdc-blue" />
                <span>{course.duration}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-bdc-blue" />
                <span>{course.learners_count} Mahasiswa Terdaftar</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Star className="w-4 h-4 text-bdc-gold fill-bdc-gold" />
                <span>{course.rating} / 5.0</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <ShieldCheck className="w-4 h-4" />
                <span>Standar BDC UTDI</span>
              </span>
            </div>
          </div>

          {/* Instructor Bio Card */}
          <div className="lg:w-72 bg-bdc-surface p-4 rounded-xl border border-slate-200/70 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Instruktur / Kurator
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bdc-midnight text-bdc-yellow font-bold text-sm flex items-center justify-center shrink-0">
                {course.instructor.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-bdc-midnight truncate">{course.instructor}</h3>
                <p className="text-[10px] text-slate-500 truncate">{course.instructor_role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Syllabus Checklist */}
      <SyllabusChecklist
        courseId={course.id}
        syllabus={course.syllabus}
        initialCompletedTopics={initialCompletedTopics}
      />
    </div>
  );
}
