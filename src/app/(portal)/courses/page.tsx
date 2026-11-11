"use client";

import React, { useState } from "react";
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

const COURSES_DATA: Course[] = [
  {
    id: "ACT-01",
    title: "Ngoding Bareng: Membangun Web App Interaktif dari Nol",
    category: "Sesi Minggu Ini",
    session_type: "Live Session",
    instructor: "Dr. Evelyn Vance & Tim Web Dev",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Live Session (2 Jam)",
    level: "Pemula (Beginner)",
    learners_count: 340,
    rating: 4.9,
    icon: "Code",
    badge_color: "bg-rose-100 text-rose-700",
    description:
      "Sesi interaktif mingguan membedah struktur HTML5, styling Tailwind, dan logika JavaScript interaktif langsung dengan live coding bersama anggota.",
    syllabus: [
      "Struktur Dasar Web Modern & Best Practice HTML5",
      "Live Coding: Styling Responsive dengan Tailwind CSS",
      "Interaktivitas & DOM Manipulation JavaScript",
      "Tanya Jawab & Bedah Kode Bareng Anggota Komunitas",
    ],
  },
  {
    id: "ACT-02",
    title: "Workshop Hands-On: Audit Keamanan Akun & Pengujian Jaringan",
    category: "Workshop & Hands-On",
    session_type: "Workshop Lab",
    instructor: "Ir. Hendra Saputra, M.Kom",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Workshop Lab (3 Jam)",
    level: "Semua Tingkat (All Levels)",
    learners_count: 420,
    rating: 4.9,
    icon: "Terminal",
    badge_color: "bg-emerald-100 text-emerald-700",
    description:
      "Praktik langsung simulasi mendeteksi tautan phishing, analisis lalu lintas Wi-Fi rentan, serta konfigurasi 2FA hardware key.",
    syllabus: [
      "Simulasi Uji Coba Serangan Social Engineering & Phishing",
      "Inspeksi Jaringan Wi-Fi Publik dengan Wireshark Dasar",
      "Langkah Proteksi Password Manager & Multi-Factor Auth",
      "Checklist Keamanan Siber Mandiri untuk Laptop & Ponsel",
    ],
  },
  {
    id: "ACT-03",
    title: "Proyek Kolaborasi: UI/UX Open Source Design System Komunitas",
    category: "Proyek Bersama",
    session_type: "Project File",
    instructor: "Maya Kartika, S.Ds",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Project File",
    level: "Pemula (Beginner)",
    learners_count: 280,
    rating: 4.8,
    icon: "FolderArchive",
    badge_color: "bg-purple-100 text-purple-700",
    description:
      "Repositori aset desain, komponen Figma terbuka, dan panduan kontribusi bareng untuk membangun UI kit resmi komunitas kampus.",
    syllabus: [
      "Panduan Kontribusi & Tata Kelola Figma Team Workspace",
      "Penyusunan Desain Token: Palet Warna & Tipografi",
      "Pembuatan Komponen Tombol, Input & Dialog Reusable",
      "Review Bersama & Penggabungan Aset Kontributor",
    ],
  },
  {
    id: "ACT-04",
    title: "Rekaman Sharing: Memulai Startup Digital & Pitching ke Inkubator",
    category: "Arsip Recording",
    session_type: "Rekaman Web",
    instructor: "Rian Danuarta, MBA",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Rekaman Web (1.5 Jam)",
    level: "Pemula (Beginner)",
    learners_count: 510,
    rating: 4.9,
    icon: "PlayCircle",
    badge_color: "bg-blue-100 text-blue-700",
    description:
      "Arsip video sharing alumni mengenai langkah validasi ide produk teknologi, menyusun Business Model Canvas, dan kiat lolos seleksi pendanaan inkubator.",
    syllabus: [
      "Rekaman Bagian 1: Validasi Masalah & Customer Interview",
      "Rekaman Bagian 2: Menyusun Pitch Deck 10 Slide Efektif",
      "Template Dokumen Pitching & Lembar Evaluasi Bisnis",
      "Sesi Q&A Diskusi Pengalaman Founder Startup Mahasiswa",
    ],
  },
  {
    id: "ACT-05",
    title: "Deploy Bareng: Hosting Web & Domain Gratis Menggunakan Cloud VPS",
    category: "Workshop & Hands-On",
    session_type: "Workshop Lab",
    instructor: "Arya Pratama, S.Kom",
    instructor_role: "Inisiator / Pemateri Komunitas",
    duration: "Workshop Lab (2.5 Jam)",
    level: "Menengah (Intermediate)",
    learners_count: 390,
    rating: 4.8,
    icon: "Cloud",
    badge_color: "bg-amber-100 text-amber-700",
    description:
      "Panduan langkah demi langkah mem-publish aplikasi web ke server cloud Linux, konfigurasi DNS domain gratis, dan sertifikat SSL Let's Encrypt.",
    syllabus: [
      "Pengenalan Terminal Linux & SSH Key Authentication",
      "Instalasi Nginx Web Server & Konfigurasi Virtual Host",
      "Pemasangan Gratis SSL/TLS HTTPS dengan Certbot",
      "Otomasi Deploy Git Webhook Sederhana",
    ],
  },
];

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

  const filteredCourses = COURSES_DATA.filter((c) => {
    const matchCategory =
      selectedCategory === "Semua Modul" || c.category === selectedCategory;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-bdc-midnight tracking-tight">
            Pusat Belajar &amp; Modul Komunitas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Silabus kurikulum resmi Business Dev Club — Chapter UTDI Yogyakarta
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul atau pemateri..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-bdc-midnight placeholder:text-slate-400 focus:outline-none focus:border-bdc-blue focus:ring-1 focus:ring-bdc-blue shadow-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-bdc-midnight text-bdc-yellow shadow-sm border border-bdc-navy"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-bdc-blue transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${course.badge_color}`}>
                  {course.category}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {course.id}
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-sm font-extrabold text-bdc-midnight group-hover:text-bdc-blue transition-colors leading-snug line-clamp-2">
                {course.title}
              </h2>
              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {course.description}
              </p>

              {/* Instructor */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Pemateri:</span>
                  <span className="font-bold text-bdc-midnight text-xs truncate max-w-[180px] block">
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
            <div className="px-5 py-3.5 bg-bdc-surface/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
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
                className="px-3.5 py-1.5 rounded-xl bg-bdc-blue hover:bg-bdc-navy text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Buka Silabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-bdc-midnight">Tidak ada modul yang cocok</h3>
          <p className="text-xs text-slate-500 mt-1">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      )}
    </div>
  );
}
