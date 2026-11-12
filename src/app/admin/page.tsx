import Link from "next/link";
import { bdcStore } from "@/lib/data/store";
import { hydrateFromDb } from "@/lib/data/db";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  Users,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default async function AdminDashboardPage() {
  await hydrateFromDb();
  const profiles = bdcStore.getProfiles();
  const students = profiles.filter((p) => p.role === "learner");
  const certificates = bdcStore.getCertificates();
  const courses = bdcStore.getCourses();

  const graduationRate =
    students.length > 0
      ? `${((certificates.length / students.length) * 100).toFixed(1)}%`
      : "0.0%";

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 00 // RINGKASAN ANALITIK AKADEMIK ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Dasbor Kurator &amp; Admin
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Pusat kendali operasional komunitas, audit presensi barcode, penilaian tugas, dan tata kelola sertifikasi — UTDI Yogyakarta.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/users"
              className="retro-btn px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-bdc-midnight text-xs font-bold transition-all shadow-retro-sm flex items-center gap-2 border border-slate-300"
            >
              <ShieldCheck className="w-4 h-4 text-bdc-blue" />
              <span>Manajemen User</span>
            </Link>
            <Link
              href="/admin/certificates"
              className="retro-btn px-4 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm flex items-center gap-2 border border-bdc-midnight"
            >
              <Award className="w-4 h-4 text-bdc-yellow" />
              <span>Editor Sertifikat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 4 Metric Stat Cards with Colored Top Inset Shadows (GDGoC dash-stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Mahasiswa (Blue Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#095BAF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Mahasiswa
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-bdc-blue flex items-center justify-center border border-blue-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl sm:text-4xl text-bdc-midnight">{students.length}</span>
              <span className="font-mono text-xs text-slate-500">Mahasiswa</span>
            </div>
            <p className="font-mono text-[10px] text-slate-500 mt-1">Cohort 2026/2027 Aktif</p>
          </div>
        </div>

        {/* Metric 2: Tingkat Kelulusan (Green Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#34A853] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Tingkat Kelulusan
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl sm:text-4xl text-emerald-600">{graduationRate}</span>
            </div>
            <p className="font-mono text-[10px] text-slate-500 mt-1">Memenuhi 3 Kriteria Standar</p>
          </div>
        </div>

        {/* Metric 3: Modul Aktif (Yellow Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#E9AD17] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Modul Aktif
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl sm:text-4xl text-bdc-midnight">{courses.length}</span>
              <span className="font-mono text-xs text-slate-500">Modul Belajar</span>
            </div>
            <p className="font-mono text-[10px] text-slate-500 mt-1">Tersinkronisasi Silabus</p>
          </div>
        </div>

        {/* Metric 4: Sertifikat Terbit (Red Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#EA4335] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Sertifikat Terbit
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl sm:text-4xl text-bdc-midnight">{certificates.length}</span>
              <span className="font-mono text-xs text-slate-500">Kredensial</span>
            </div>
            <p className="font-mono text-[10px] text-slate-500 mt-1">Terverifikasi Digital</p>
          </div>
        </div>
      </div>

      {/* 3. Students Table (GDGoC dash-table) */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                Daftar Mahasiswa Terdaftar
              </h2>
              <BdcDots size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Ringkasan capaian akademik cohort 2026/2027</p>
          </div>
          <Link
            href="/admin/students"
            className="retro-btn text-xs font-mono font-bold text-bdc-blue hover:text-bdc-midnight flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white shadow-retro-sm"
          >
            <span>Kelola Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold border-b border-[#d9dfd7]">
              <tr>
                <th className="px-4 py-3">Nama Mahasiswa</th>
                <th className="px-4 py-3">NIM Kampus</th>
                <th className="px-4 py-3">Email Resmi</th>
                <th className="px-4 py-3">Nilai Rata-rata</th>
                <th className="px-4 py-3">Status Kredensial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9dfd7]">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-mono text-xs">
                    Belum ada mahasiswa terdaftar pada sistem.
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr key={st.id} className="hover:bg-[#fff8e6] transition-colors">
                    <td className="px-4 py-3.5 font-bold text-bdc-midnight">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-bdc-midnight text-bdc-yellow font-pixel text-xs flex items-center justify-center shrink-0 border border-bdc-midnight shadow-retro-sm">
                          {st.full_name.charAt(0)}
                        </div>
                        <span className="font-space text-sm">{st.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-bdc-blue font-bold">{st.nim_id}</td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">{st.email}</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-700">
                      <span className="font-pixel text-lg">{st.score}</span>{" "}
                      <span className="font-mono text-[10px] text-slate-400 font-normal">/ 100</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-retro-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kompeten Paripurna</span>
                      </span>
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
