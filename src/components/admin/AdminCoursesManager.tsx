"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FilePlus2,
  ListPlus,
  X,
} from "lucide-react";
import { Course, COURSE_CATEGORIES, COURSE_LEVELS } from "@/lib/types/database";
import { adminCreateCourseAction, adminDeleteCourseAction } from "@/lib/actions/courses";
import { BdcDots } from "@/components/ui/BdcDots";

interface AdminCoursesManagerProps {
  initialCourses: Course[];
}

export function AdminCoursesManager({ initialCourses }: AdminCoursesManagerProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(COURSE_CATEGORIES[0]);
  const [level, setLevel] = useState<string>(COURSE_LEVELS[0]);
  const [sessionType, setSessionType] = useState("");
  const [instructor, setInstructor] = useState("");
  const [instructorRole, setInstructorRole] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [syllabus, setSyllabus] = useState<string[]>([""]);

  const resetForm = () => {
    setTitle("");
    setCategory(COURSE_CATEGORIES[0]);
    setLevel(COURSE_LEVELS[0]);
    setSessionType("");
    setInstructor("");
    setInstructorRole("");
    setDuration("");
    setDescription("");
    setSyllabus([""]);
  };

  const setTopic = (index: number, value: string) => {
    setSyllabus((prev) => prev.map((t, i) => (i === index ? value : t)));
  };

  const addTopic = () => setSyllabus((prev) => [...prev, ""]);
  const removeTopic = (index: number) =>
    setSyllabus((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await adminCreateCourseAction({
        title,
        category,
        session_type: sessionType,
        instructor,
        instructor_role: instructorRole,
        duration,
        level,
        description,
        syllabus,
      });

      setResult({ success: res.success, message: res.message });
      if (res.success && res.course) {
        setCourses((prev) => [res.course!, ...prev]);
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setResult({ success: false, message: "Terjadi kesalahan jaringan saat menerbitkan materi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!deletingId) {
      setDeletingId(course.id);
      return;
    }
    if (deletingId !== course.id) {
      setDeletingId(course.id);
      return;
    }

    try {
      const res = await adminDeleteCourseAction(course.id);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== course.id));
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
      {/* Form Penerbitan Materi */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#d9dfd7]">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-bdc-blue tracking-wider block">
              [ PENERBITAN MATERI &amp; SILABUS ]
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                Tambah Materi / Modul Baru
              </h3>
              <BdcDots size="sm" />
            </div>
          </div>
          <BookOpen className="w-6 h-6 text-bdc-yellow shrink-0 hidden sm:block" />
        </div>

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-space font-bold text-slate-800 mb-1">
                Judul Materi
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Ngoding Bareng: Membangun Web App Interaktif dari Nol"
                className={`${inputClass} font-space font-bold text-sm`}
              />
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {COURSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">Tingkat</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={inputClass}
              >
                {COURSE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">Jenis Sesi</label>
              <input
                type="text"
                required
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                placeholder="Contoh: Live Session / Workshop Lab"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">Durasi</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Contoh: Live Session (2 Jam)"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">Pemateri</label>
              <input
                type="text"
                required
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Contoh: Dr. Evelyn Vance & Tim Web Dev"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-space font-bold text-slate-800 mb-1">
                Jabatan Pemateri (Opsional)
              </label>
              <input
                type="text"
                value={instructorRole}
                onChange={(e) => setInstructorRole(e.target.value)}
                placeholder="Default: Inisiator / Pemateri Komunitas"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-space font-bold text-slate-800 mb-1">
                Deskripsi Materi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Ringkasan singkat tentang isi materi ini..."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>

          {/* Silabus dinamis */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-space font-bold text-slate-800">
                Topik Silabus ({syllabus.filter((t) => t.trim()).length} topik)
              </label>
              <button
                type="button"
                onClick={addTopic}
                className="retro-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffefa] text-bdc-navy border border-bdc-midnight font-bold transition-all shadow-retro-sm text-[11px]"
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span>Tambah Topik</span>
              </button>
            </div>
            <div className="space-y-2">
              {syllabus.map((topic, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 w-6 shrink-0 text-center">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(index, e.target.value)}
                    placeholder={`Topik ${index + 1}: Contoh — Dasar HTML5 & Best Practice`}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    disabled={syllabus.length === 1}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    title="Hapus topik"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">
              Checklist topik inilah yang diikuti mahasiswa untuk melacak progres materi mereka.
            </span>
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
              disabled={isSubmitting}
              className="retro-btn px-5 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-retro-sm border border-bdc-midnight text-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-bdc-yellow" />
                  <span>Menerbitkan...</span>
                </>
              ) : (
                <>
                  <FilePlus2 className="w-4 h-4 text-bdc-yellow" />
                  <span>Terbitkan Materi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Materi Terbit */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro overflow-hidden">
        <div className="px-6 py-4 bg-[#f4f3ea] border-b border-[#d9dfd7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-bdc-blue" />
            <h3 className="font-space text-sm font-bold text-bdc-midnight">
              Materi Terbit ({courses.length})
            </h3>
          </div>
          <BdcDots size="sm" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold border-b border-[#d9dfd7]">
              <tr>
                <th className="py-3 px-4">Materi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Tingkat</th>
                <th className="py-3 px-4">Pemateri</th>
                <th className="py-3 px-4 text-center">Topik</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9dfd7]">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    Belum ada materi terbit. Mulai dengan mengisi formulir di atas.
                  </td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="hover:bg-[#fff8e6] transition-colors">
                    <td className="py-3.5 px-4 max-w-[300px]">
                      <p className="font-space font-bold text-sm text-bdc-midnight truncate">
                        {c.title}
                      </p>
                      <p className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                        {c.session_type} — {c.duration}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {c.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{c.level}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 max-w-[160px] truncate">
                      {c.instructor}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-pixel text-base text-bdc-midnight font-bold">
                        {c.syllabus.length}
                      </span>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
