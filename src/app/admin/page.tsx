import Link from "next/link";
import { bdcStore } from "@/lib/data/store";
import {
  Users,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function AdminDashboardPage() {
  const profiles = bdcStore.getProfiles();
  const students = profiles.filter((p) => p.role === "learner");
  const certificates = bdcStore.getCertificates();
  const courses = bdcStore.getCourses();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Ringkasan Analitik Akademik
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dasbor Pusat Kendali Komunitas &amp; Sertifikasi — UTDI Yogyakarta
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/certificates"
            className="px-3.5 py-2 rounded-xl bg-bdc-blue hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-bdc-yellow" />
            <span>Editor Sertifikat</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards in Dark Navy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141d33] p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-bdc-blue flex items-center justify-center shrink-0 border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Mahasiswa
            </span>
            <span className="text-2xl font-extrabold text-white">760</span>
          </div>
        </div>

        <div className="bg-[#141d33] p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tingkat Kelulusan
            </span>
            <span className="text-2xl font-extrabold text-white">94.8%</span>
          </div>
        </div>

        <div className="bg-[#141d33] p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Modul Aktif
            </span>
            <span className="text-2xl font-extrabold text-white">{courses.length} Modul</span>
          </div>
        </div>

        <div className="bg-[#141d33] p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-bdc-gold flex items-center justify-center shrink-0 border border-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Sertifikat Terbit
            </span>
            <span className="text-2xl font-extrabold text-white">340</span>
          </div>
        </div>
      </div>

      {/* Recent Submissions & Action Table */}
      <div className="bg-[#141d33] rounded-2xl border border-slate-800 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white">Daftar Mahasiswa Terdaftar</h2>
            <p className="text-[11px] text-slate-400">Ringkasan capaian akademik cohort 2026/2027</p>
          </div>
          <Link
            href="/admin/students"
            className="text-xs font-bold text-bdc-yellow hover:underline flex items-center gap-1"
          >
            <span>Kelola Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Nama Mahasiswa</th>
                <th className="px-4 py-3">NIM Kampus</th>
                <th className="px-4 py-3">Email Resmi</th>
                <th className="px-4 py-3">Nilai Rata-rata</th>
                <th className="px-4 py-3">Status Kredensial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{st.full_name}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-bdc-yellow">{st.nim_id}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{st.email}</td>
                  <td className="px-4 py-3 font-extrabold text-emerald-400">
                    {st.score} <span className="text-[10px] font-normal text-slate-400">/ 100</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Kompeten Paripurna</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
