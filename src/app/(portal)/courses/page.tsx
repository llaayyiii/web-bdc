"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Star,
  Users,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Course } from "@/lib/types/database";
import { getAllCoursesAction } from "@/lib/actions/courses";
import { BdcDots } from "@/components/ui/BdcDots";

const CATEGORIES = [
  "Semua Modul",
  "Sesi Minggu Ini",
  "Workshop & Hands-On",
  "Proyek Bersama",
  "Arsip Recording",
];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua Modul");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getAllCoursesAction();
        setCourses(data);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchCategory =
      selectedCategory === "Semua Modul" || c.category === selectedCategory;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Page Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 03 // KURIKULUM &amp; SILABUS ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Pusat Modul &amp; Silabus
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Silabus kurikulum resmi Business Dev Club Chapter UTDI: pelajari modul hands-on, selesaikan
              checklist kompetensi, dan kumpulkan tugas proyek.
            </p>
          </div>

          {/* Search Bar with Retro Offset Shadow */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi atau pemateri..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#fffefa] border border-slate-300 rounded-xl text-xs text-bdc-midnight placeholder:text-slate-400 focus:outline-none focus:border-bdc-midnight shadow-retro-sm font-sans"
            />
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-bdc-midnight text-bdc-yellow shadow-retro-sm border border-bdc-midnight"
                  : "bg-[#fffefa] text-slate-700 hover:bg-slate-100 border border-slate-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Courses Cards Grid (Neo-Retro Tactile Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="retro-card rounded-2xl flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-6 space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${course.badge_color}`}>
                  {course.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {course.id}
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="font-space text-base font-bold text-bdc-midnight group-hover:text-bdc-blue transition-colors leading-snug line-clamp-2">
                {course.title}
              </h2>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                {course.description}
              </p>

              {/* Instructor */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Pemateri:</span>
                  <span className="font-bold text-bdc-midnight text-xs truncate max-w-[170px] block">
                    {course.instructor}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Tingkat:</span>
                  <span className="font-semibold text-slate-700 text-xs">{course.level.split(" ")[0]}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-3.5 bg-[#f4f3ea] border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] text-slate-600 font-mono font-semibold">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-bdc-gold fill-bdc-gold" />
                  <span>{course.rating}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{course.learners_count}</span>
                </span>
              </div>

              <Link
                href={`/courses/${course.id}`}
                className="retro-btn px-3.5 py-1.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm flex items-center gap-1.5 font-space"
              >
                <span>Buka Silabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="bg-[#fffefa] rounded-2xl border border-slate-300 p-12 text-center shadow-retro-sm">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3 animate-pulse" />
          <h3 className="font-space text-base font-bold text-bdc-midnight">Memuat modul dari database...</h3>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Menarik kurikulum terbaru BDC UTDI.
          </p>
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
        <div className="bg-[#fffefa] rounded-2xl border border-slate-300 p-12 text-center shadow-retro-sm">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-space text-base font-bold text-bdc-midnight">Tidak ada modul yang cocok</h3>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      )}
    </div>
  );
}
