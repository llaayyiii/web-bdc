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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Manajemen Mahasiswa &amp; Kredensial
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola data mahasiswa cohort, pembukaan kunci sertifikat, dan kelulusan akademik
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari NIM atau nama..."
            className="w-full pl-9 pr-3 py-2 bg-[#141d33] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-bdc-blue"
          />
        </div>
      </div>

      {/* Students Table Card */}
      <div className="bg-[#141d33] rounded-2xl border border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Nama Mahasiswa</th>
                <th className="px-4 py-3">NIM Kampus</th>
                <th className="px-4 py-3">Email Domain</th>
                <th className="px-4 py-3">Nilai Akhir</th>
                <th className="px-4 py-3">Jam Belajar</th>
                <th className="px-4 py-3 text-center">Status Gembok Sertifikat</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((st) => {
                const cert = SEED_CERTIFICATES.find((c) => c.user_id === st.id);
                const isLocked = cert ? certLockState[cert.id] ?? cert.is_locked : true;

                return (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">{st.full_name}</td>
                    <td className="px-4 py-3 font-mono text-bdc-yellow text-[11px]">{st.nim_id}</td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{st.email}</td>
                    <td className="px-4 py-3 font-extrabold text-emerald-400">{st.score}</td>
                    <td className="px-4 py-3 text-slate-400">{st.total_hours} Jam</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isLocked
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        <span>{isLocked ? "Terkunci" : "Terbuka (Siap Cetak)"}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {cert && (
                        <button
                          type="button"
                          onClick={() => handleToggleLock(cert.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isLocked
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-slate-700 hover:bg-slate-600 text-slate-200"
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
