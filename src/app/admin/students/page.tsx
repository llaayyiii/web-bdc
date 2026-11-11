"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { SEED_PROFILES, SEED_CERTIFICATES } from "@/lib/data/store";
import {
  adminToggleCertificateLockAction,
  adminUpdateStudentStatusAction,
} from "@/lib/actions/admin";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";

export default function AdminStudentsPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(
    SEED_PROFILES.filter((p) => p.role === "learner")
  );
  const [certLockState, setCertLockState] = useState<Record<string, boolean>>({
    "cert-siti-001": false,
  });

  const filtered = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.nim_id.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleLock = async (certId: string) => {
    const nextLocked = !certLockState[certId];
    try {
      const res = await adminToggleCertificateLockAction(certId, nextLocked);
      if (res.success) {
        setCertLockState((prev) => ({ ...prev, [certId]: nextLocked }));
        showToast(
          nextLocked
            ? "Sertifikat mahasiswa berhasil dikunci."
            : "Sertifikat mahasiswa berhasil dibuka (unlocked).",
          "success"
        );
      }
    } catch {
      showToast("Gagal memperbarui status gembok sertifikat.", "error");
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 04 // MANAJEMEN MAHASISWA &amp; GEMBOK SERTIFIKAT ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Manajemen Mahasiswa
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Kelola data mahasiswa cohort 2026/2027, kontrol manual pembukaan kunci sertifikat, dan rekapitulasi jam belajar.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari NIM atau nama mahasiswa..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#fffefa] border border-slate-300 rounded-2xl text-xs text-bdc-midnight placeholder:text-slate-400 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm shadow-retro-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. Students Table Card (GDGoC dash-table) */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] overflow-hidden shadow-retro">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold border-b border-[#d9dfd7]">
              <tr>
                <th className="px-4 py-3">Nama Mahasiswa</th>
                <th className="px-4 py-3">NIM Kampus</th>
                <th className="px-4 py-3">Email Domain</th>
                <th className="px-4 py-3">Nilai Rata-rata</th>
                <th className="px-4 py-3">Jam Belajar</th>
                <th className="px-4 py-3 text-center">Status Kredensial</th>
                <th className="px-4 py-3 text-right">Aksi Gembok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9dfd7]">
              {filtered.map((st) => {
                const cert = SEED_CERTIFICATES.find((c) => c.user_id === st.id);
                const isLocked = cert ? certLockState[cert.id] ?? cert.is_locked : true;

                return (
                  <tr key={st.id} className="hover:bg-[#fff8e6] transition-colors">
                    <td className="px-4 py-3.5 font-bold text-bdc-midnight">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-bdc-midnight text-bdc-yellow font-pixel text-xs flex items-center justify-center shrink-0 border border-bdc-midnight shadow-retro-sm">
                          {st.full_name.charAt(0)}
                        </div>
                        <span className="font-space text-sm">{st.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-bdc-blue font-bold text-[11px]">{st.nim_id}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-600 text-[11px]">{st.email}</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-700">
                      <span className="font-pixel text-lg">{st.score}</span>{" "}
                      <span className="font-mono text-[10px] text-slate-400 font-normal">/ 100</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{st.total_hours} Jam</td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold border shadow-retro-sm ${
                          isLocked
                            ? "bg-rose-50 text-rose-700 border-rose-300"
                            : "bg-emerald-50 text-emerald-700 border-emerald-300"
                        }`}
                      >
                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{isLocked ? "Terkunci" : "Terbuka (Siap Cetak)"}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {cert && (
                        <button
                          type="button"
                          onClick={() => handleToggleLock(cert.id)}
                          className={`retro-btn px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-retro-sm border cursor-pointer ${
                            isLocked
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800"
                              : "bg-[#EFF0F0] hover:bg-slate-200 text-slate-800 border-slate-300"
                          }`}
                        >
                          {isLocked ? "Buka Kunci" : "Kunci Kembali"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
