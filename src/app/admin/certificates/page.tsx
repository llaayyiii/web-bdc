"use client";

import React, { useState } from "react";
import { Award, Save, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SEED_CERTIFICATES } from "@/lib/data/store";
import { adminUpdateSignatoriesAction } from "@/lib/actions/admin";
import { useToast } from "@/components/ui/Toast";
import { BdcDots } from "@/components/ui/BdcDots";

export default function AdminCertificatesPage() {
  const { showToast } = useToast();
  const cert = SEED_CERTIFICATES[0];

  const [sig1Name, setSig1Name] = useState(cert.signatory_1_name);
  const [sig1Role, setSig1Role] = useState(cert.signatory_1_role);
  const [sig2Name, setSig2Name] = useState(cert.signatory_2_name);
  const [sig2Role, setSig2Role] = useState(cert.signatory_2_role);
  const [period, setPeriod] = useState(cert.period);
  const [location, setLocation] = useState(cert.location);
  const [issueDate, setIssueDate] = useState(cert.issue_date);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await adminUpdateSignatoriesAction(cert.id, {
        signatory_1_name: sig1Name,
        signatory_1_role: sig1Role,
        signatory_2_name: sig2Name,
        signatory_2_role: sig2Role,
        period,
        location,
        issue_date: issueDate,
      });

      if (res.success) {
        showToast("Perubahan data sertifikat dan penandatangan berhasil disimpan!", "success");
      } else {
        showToast(res.error || "Gagal menyimpan perubahan.", "error");
      }
    } catch {
      showToast("Gagal menyimpan perubahan.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 05 // KURASI KREDENSIAL &amp; PEJABAT PENGESAH ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Editor Sertifikat
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Sesuaikan informasi pejabat penandatangan kampus UTDI, kota lokasi Yogyakarta, dan masa berlaku periode akademik 2026/2027.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 sm:p-8 shadow-retro max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Signatory 1 */}
          <div className="p-5 rounded-2xl bg-[#EFF0F0] border border-slate-300 space-y-4 shadow-retro-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-space text-xs font-bold text-bdc-midnight uppercase tracking-wider">
                Pejabat Pengesah I (Kemahasiswaan Kampus UTDI)
              </h2>
              <BdcDots size="sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  required
                  value={sig1Name}
                  onChange={(e) => setSig1Name(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm"
                />
              </div>
              <div>
                <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                  Jabatan / Unit Kerja
                </label>
                <input
                  type="text"
                  required
                  value={sig1Role}
                  onChange={(e) => setSig1Role(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Signatory 2 */}
          <div className="p-5 rounded-2xl bg-[#EFF0F0] border border-slate-300 space-y-4 shadow-retro-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-space text-xs font-bold text-bdc-midnight uppercase tracking-wider">
                Pejabat Pengesah II (Penanggung Jawab Komunitas BDC)
              </h2>
              <BdcDots size="sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={sig2Name}
                  onChange={(e) => setSig2Name(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm"
                />
              </div>
              <div>
                <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                  Peran / Posisi
                </label>
                <input
                  type="text"
                  required
                  value={sig2Role}
                  onChange={(e) => setSig2Role(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Period & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                Periode Akademik
              </label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm font-mono"
              />
            </div>
            <div>
              <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                Lokasi Kota
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm"
              />
            </div>
            <div>
              <label className="block font-space text-xs font-bold text-slate-700 mb-1">
                Tanggal Terbit Dokumen
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-bdc-midnight focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#d9dfd7] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="retro-btn px-6 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm flex items-center gap-2 border border-bdc-midnight"
            >
              <Save className="w-4 h-4 text-bdc-yellow" />
              <span>{saving ? "Menyimpan..." : "Simpan Perubahan Penandatangan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
