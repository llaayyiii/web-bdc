"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Pencil,
  X,
  User,
  GraduationCap,
} from "lucide-react";
import {
  adminGetAllProfilesAction,
  adminUpdateStudentIdentityAction,
} from "@/lib/actions/admin";
import {
  adminToggleCertificateLockAction,
  adminUpdateStudentStatusAction,
} from "@/lib/actions/certificates";
import { getAllCertificatesAction } from "@/lib/actions/certificates";
import { Profile, Certificate } from "@/lib/types/database";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";

export default function AdminStudentsPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Profile[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certLockState, setCertLockState] = useState<Record<string, boolean>>({});

  // State Edit Mahasiswa Modal
  const [editingStudent, setEditingStudent] = useState<Profile | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editNimId, setEditNimId] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [allUsers, allCerts] = await Promise.all([
        adminGetAllProfilesAction(),
        getAllCertificatesAction(),
      ]);
      setStudents(allUsers.filter((p) => p.role === "learner"));
      setCertificates(allCerts);
    }
    loadData();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.nim_id.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleLock = async (certId: string, currentlyLocked: boolean) => {
    const nextLocked = !currentlyLocked;
    try {
      const res = await adminToggleCertificateLockAction(certId, nextLocked);
      if (res.success) {
        setCertLockState((prev) => ({ ...prev, [certId]: nextLocked }));
        showToast(
          nextLocked
            ? "Sertifikat ditarik kembali (belum terbit)."
            : "Sertifikat berhasil diterbitkan dan siap dicetak.",
          "success"
        );
      }
    } catch {
      showToast("Gagal memperbarui status penerbitan sertifikat.", "error");
    }
  };

  const handleOpenEdit = (student: Profile) => {
    setEditingStudent(student);
    setEditFullName(student.full_name);
    setEditNimId(student.nim_id);
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setEditError(null);

    if (!editFullName.trim() || editFullName.trim().length < 2) {
      setEditError("Nama lengkap minimal harus 2 karakter.");
      return;
    }

    if (!editNimId.trim() || editNimId.trim().length < 3) {
      setEditError("NIM resmi kampus minimal harus 3 karakter.");
      return;
    }

    setIsEditLoading(true);
    try {
      const res = await adminUpdateStudentIdentityAction(
        editingStudent.id,
        editFullName.trim(),
        editNimId.trim()
      );

      if (!res.success) {
        setEditError(res.error || "Gagal memperbarui data mahasiswa.");
        setIsEditLoading(false);
        return;
      }

      // Update state lokal
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingStudent.id
            ? { ...s, full_name: editFullName.trim(), nim_id: editNimId.trim() }
            : s
        )
      );

      // Update data sertifikat lokal jika ada
      setCertificates((prev) =>
        prev.map((c) =>
          c.user_id === editingStudent.id
            ? { ...c, recipient_name: editFullName.trim(), nim_id: editNimId.trim() }
            : c
        )
      );

      showToast(`Data ${editFullName.trim()} (${editNimId.trim()}) berhasil diperbarui!`, "success");
      setEditingStudent(null);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsEditLoading(false);
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
              Kelola data mahasiswa cohort 2026/2027, terbitkan sertifikat secara manual setelah mahasiswa tuntas, dan rekapitulasi jam belajar.
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
                <th className="px-4 py-3 text-center">Status Sertifikat</th>
                <th className="px-4 py-3 text-right">Aksi Mahasiswa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9dfd7]">
              {filtered.map((st) => {
                const cert = certificates.find((c) => c.user_id === st.id);
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
                        <span>{isLocked ? "Belum Terbit" : "Terbit (Siap Cetak)"}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Tombol Edit Nama & NIM */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(st)}
                          className="retro-btn p-2 rounded-xl border border-slate-300 text-slate-700 hover:text-bdc-midnight hover:bg-slate-100 transition-all text-xs font-medium flex items-center gap-1 shadow-retro-sm bg-white"
                          title="Koreksi Nama atau NIM"
                        >
                          <Pencil className="w-3.5 h-3.5 text-bdc-blue" />
                          <span className="font-mono text-[11px] font-bold">Edit</span>
                        </button>

                        {/* Tombol Penerbitan Sertifikat */}
                        {cert && (
                          <button
                            type="button"
                            onClick={() => handleToggleLock(cert.id, isLocked)}
                            className={`retro-btn px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-retro-sm border cursor-pointer ${
                              isLocked
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800"
                                : "bg-[#EFF0F0] hover:bg-slate-200 text-slate-800 border-slate-300"
                            }`}
                          >
                            {isLocked ? "Terbitkan" : "Tarik"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Nama & NIM Mahasiswa */}
      {editingStudent && (
        <div className="fixed inset-0 bg-[#000741]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fffefa] rounded-3xl border-2 border-bdc-midnight shadow-retro-lg w-full max-w-md p-6 space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9dfd7]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-bdc-navy text-bdc-yellow flex items-center justify-center border border-bdc-midnight shadow-retro-sm">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-space text-base font-bold text-bdc-midnight">
                    Koreksi Data Mahasiswa
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Perbarui Nama Resmi &amp; NIM Kampus
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-bdc-midnight font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-space font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Nama Lengkap Mahasiswa</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Contoh: Arrafi Nur Hafiz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm bg-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block font-space font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>NIM Resmi Kampus (Nomor Induk)</span>
                </label>
                <input
                  type="text"
                  required
                  value={editNimId}
                  onChange={(e) => setEditNimId(e.target.value)}
                  placeholder="Contoh: 245720024"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm bg-white font-mono text-xs font-bold text-bdc-blue"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#EFF0F0] border border-slate-300 text-[11px] text-slate-600 leading-relaxed">
                ℹ️ <strong>Sinkronisasi Otomatis:</strong> Perubahan nama &amp; NIM akan langsung diterapkan ke <strong>sertifikat kelulusan</strong>, <strong>rekapitulasi presensi</strong>, dan <strong>pengumpulan tugas</strong> mahasiswa ini.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#d9dfd7]">
                <button
                  type="button"
                  disabled={isEditLoading}
                  onClick={() => setEditingStudent(null)}
                  className="retro-btn px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-all text-xs shadow-retro-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isEditLoading}
                  className="retro-btn px-5 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white font-bold transition-all text-xs disabled:opacity-50 shadow-retro-sm border border-bdc-midnight flex items-center gap-1.5"
                >
                  {isEditLoading ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-bdc-yellow" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
