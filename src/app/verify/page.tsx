"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Award,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  FileCheck2,
} from "lucide-react";
import { Certificate } from "@/lib/types/database";
import { verifyCertificateAction } from "@/lib/actions/certificates";
import { BdcDots } from "@/components/ui/BdcDots";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialCert = searchParams.get("cert") || searchParams.get("nim") || "";

  const [query, setQuery] = useState(initialCert);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);

  const handleSearch = async (searchVal: string) => {
    const clean = searchVal.trim().toUpperCase();
    if (!clean) return;

    setSearched(true);
    const found = await verifyCertificateAction(clean);
    setResult(found || null);
  };

  useEffect(() => {
    if (initialCert) {
      handleSearch(initialCert);
    }
  }, [initialCert]);

  return (
    <div className="min-h-screen bg-bdc-surface bg-voxel-grid flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-300">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.svg"
            alt="BDC Logo"
            width={54}
            height={30}
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-space font-extrabold text-sm text-bdc-midnight tracking-tight">
                Pangkalan Verifikasi Kredensial BDC
              </span>
              <BdcDots size="sm" />
            </div>
            <p className="font-mono text-[10px] text-slate-500 font-semibold uppercase">
              Universitas Teknologi Digital Indonesia (UTDI) — Yogyakarta
            </p>
          </div>
        </Link>

        <Link
          href="/login"
          className="retro-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-bdc-midnight shadow-retro-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Masuk Portal</span>
        </Link>
      </header>

      {/* Main Search & Result Card */}
      <main className="max-w-3xl w-full mx-auto my-8 space-y-6">
        {/* Search Input Box */}
        <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-7 shadow-retro-lg space-y-5">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-bdc-blue font-mono text-[11px] font-bold border border-blue-200 shadow-retro-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifikasi Resmi Kampus</span>
            </div>

            <h2 className="font-space font-extrabold text-2xl text-bdc-midnight">
              Pemeriksaan Keabsahan Sertifikat Digital
            </h2>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Masukkan Nomor Sertifikat, Nomor Transkrip, atau NIM Mahasiswa yang tertera pada dokumen fisik atau QR code:
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex flex-col sm:flex-row items-center gap-2.5 max-w-lg mx-auto"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masukkan Nomor Sertifikat atau NIM..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-bdc-midnight placeholder:text-slate-400 focus:outline-none focus:border-bdc-midnight focus:bg-white shadow-inner font-mono font-medium"
              />
            </div>
            <button
              type="submit"
              className="retro-btn w-full sm:w-auto px-6 py-2.5 rounded-xl bg-bdc-midnight hover:bg-bdc-navy text-white text-xs font-bold transition-all shadow-retro-sm shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Periksa Kredensial</span>
            </button>
          </form>
        </div>

        {/* Verification Result Area */}
        {searched && (
          <div>
            {result ? (
              <div className="bg-[#fffefa] rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 shadow-retro-lg space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-mono font-black uppercase px-4 py-1.5 rounded-bl-xl tracking-wider flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kredensial Terverifikasi Sah</span>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Penerima Dokumen Resmi
                  </span>
                  <h3 className="font-space text-2xl font-black text-bdc-midnight">
                    {result.recipient_name}
                  </h3>
                  <p className="font-mono text-xs font-bold text-bdc-blue">
                    NIM: {result.nim_id} | {result.cohort}
                  </p>
                </div>

                {/* Program Card with Inset Green Bar */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-[inset_0_3px_0_#34A853] space-y-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Program Akademik &amp; Kompetensi:
                  </span>
                  <h4 className="font-space text-base font-extrabold text-bdc-midnight">{result.program_title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-900 font-mono font-semibold pt-1">
                    <span>Durasi: {result.total_hours} Jam</span>
                    <span>•</span>
                    <span>Nilai Akhir: {result.avg_score} (A+)</span>
                    <span>•</span>
                    <span className="bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-950 font-bold">
                      Status: {result.completion_status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#EFF0F0] border border-slate-300">
                    <span className="font-mono text-[10px] text-slate-500 block font-semibold uppercase">
                      No. Sertifikat
                    </span>
                    <span className="font-mono font-bold text-bdc-midnight text-[11px] truncate block mt-0.5">
                      {result.certificate_number}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EFF0F0] border border-slate-300">
                    <span className="font-mono text-[10px] text-slate-500 block font-semibold uppercase">
                      No. Transkrip
                    </span>
                    <span className="font-mono font-bold text-bdc-midnight text-[11px] truncate block mt-0.5">
                      {result.transcript_number}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EFF0F0] border border-slate-300">
                    <span className="font-mono text-[10px] text-slate-500 block font-semibold uppercase">
                      Tanggal Terbit
                    </span>
                    <span className="font-mono font-bold text-bdc-midnight block mt-0.5">{result.issue_date}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EFF0F0] border border-slate-300">
                    <span className="font-mono text-[10px] text-slate-500 block font-semibold uppercase">
                      Lokasi Kampus
                    </span>
                    <span className="font-mono font-bold text-bdc-midnight block mt-0.5">{result.location}</span>
                  </div>
                </div>

                {/* Signatories Info */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 block">Pejabat Pengesah I:</span>
                    <strong className="text-bdc-midnight">{result.signatory_1_name}</strong> ({result.signatory_1_role} UTDI)
                  </div>
                  <div className="sm:text-right">
                    <span className="font-mono text-[10px] text-slate-400 block">Pejabat Pengesah II:</span>
                    <strong className="text-bdc-midnight">{result.signatory_2_name}</strong> ({result.signatory_2_role})
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#fffefa] rounded-3xl border-2 border-rose-400 p-8 text-center space-y-3 shadow-retro-lg">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-retro-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-space text-lg font-bold text-bdc-midnight">
                  Kredensial Tidak Ditemukan
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-sans">
                  Tidak ditemukan data sertifikat yang cocok dengan identitas &quot;{query}&quot; pada pangkalan data resmi BDC UTDI. Pastikan penulisan nomor sertifikat atau NIM sudah benar.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center pt-6 border-t border-slate-300 text-xs text-slate-500 font-mono">
        &copy; 2026 Business Dev Club (BDC) — Universitas Teknologi Digital Indonesia (UTDI), Yogyakarta.
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 font-mono">Memuat verifikasi...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
