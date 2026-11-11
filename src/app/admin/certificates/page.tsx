"use client";

import React, { useState } from "react";
import { Award, Save, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SEED_CERTIFICATES } from "@/lib/data/store";
import { adminUpdateSignatoriesAction } from "@/lib/actions/admin";
import { useToast } from "@/components/ui/Toast";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Editor Data Sertifikat &amp; Penandatangan
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Sesuaikan informasi pejabat pengesah, lokasi Yogyakarta, dan periode akademik 2026/2027
        </p>
      </div>

      <div className="bg-[#141d33] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-md max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Signatory 1 */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-bdc-yellow uppercase tracking-wider">
              Pejabat Pengesah I (Kemahasiswaan Kampus)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  required
                  value={sig1Name}
                  onChange={(e) => setSig1Name(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141d33] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-bdc-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Jabatan / Unit Kerja
                </label>
                <input
                  type="text"
                  required
                  value={sig1Role}
                  onChange={(e) => setSig1Role(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141d33] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-bdc-blue"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Signatory 2 */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-bdc-yellow uppercase tracking-wider">
              Pejabat Pengesah II (Penanggung Jawab Komunitas BDC)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={sig2Name}
                  onChange={(e) => setSig2Name(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141d33] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-bdc-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Peran / Posisi
                </label>
                <input
                  type="text"
                  required
                  value={sig2Role}
                  onChange={(e) => setSig2Role(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141d33] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-bdc-blue"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Period & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Periode Akademik
              </label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 bg-[#141d33] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-bdc-blue font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lokasi Kota
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[#141d33] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-bdc-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tanggal Terbit Dokumen
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#141d33] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-bdc-blue"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-bdc-blue hover:bg-blue-600 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan..." : "Simpan Perubahan Penandatangan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
