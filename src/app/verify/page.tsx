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
import { SEED_CERTIFICATES } from "@/lib/data/store";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialCert = searchParams.get("cert") || searchParams.get("nim") || "BDC-CERT-2026-99482-SEC";

  const [query, setQuery] = useState(initialCert);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);

  const handleSearch = (searchVal: string) => {
    const clean = searchVal.trim().toUpperCase();
    if (!clean) return;

    setSearched(true);
    const found = SEED_CERTIFICATES.find(
      (c) =>
        c.certificate_number.toUpperCase() === clean ||
        c.nim_id.toUpperCase() === clean ||
        c.transcript_number.toUpperCase() === clean
    );
    setResult(found || null);
  };

  useEffect(() => {
    if (initialCert) {
      handleSearch(initialCert);
    }
  }, [initialCert]);

  return (
    <div className="min-h-screen bg-bdc-surface flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bdc-midnight p-2 flex items-center justify-center border border-bdc-navy shadow-md">
            <Image src="/logo.svg" alt="BDC Logo" width={24} height={24} className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-bdc-midnight uppercase tracking-wider">
              Pangkalan Verifikasi Kredensial BDC
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase">
              Universitas Teknologi Digital Indonesia (UTDI) — Yogyakarta
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-bdc-midnight hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Masuk Portal</span>
        </Link>
      </header>

      {/* Main Search & Result Card */}
      <main className="max-w-3xl w-full mx-auto my-8 space-y-6">
        {/* Search Input Box */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <div className="text-center max-w-md mx-auto mb-5">
            <span className="p-2 rounded-xl bg-blue-50 text-bdc-blue inline-block mb-2">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <h2 className="text-lg font-extrabold text-bdc-midnight">
              Verifikasi Keaslian Sertifikat Digital
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan Nomor Sertifikat, Nomor Transkrip, atau NIM Mahasiswa yang tertera pada dokumen fisik/digital:
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh: BDC-CERT-2026-99482-SEC atau 255720056"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-bdc-midnight placeholder:text-slate-400 focus:outline-none focus:border-bdc-blue focus:bg-white shadow-inner font-mono font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-bdc-blue hover:bg-bdc-navy active:scale-95 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Periksa</span>
            </button>
          </form>
        </div>

        {/* Verification Result Area */}
        {searched && (
          <div>
            {result ? (
              <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kredensial Terverifikasi Sah</span>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Penerima Dokumen Resmi
                  </span>
                  <h3 className="text-2xl font-extrabold text-bdc-midnight">
                    {result.recipient_name}
                  </h3>
                  <p className="text-xs font-mono font-bold text-bdc-blue">
                    NIM: {result.nim_id} | {result.cohort}
                  </p>
                </div>

                {/* Program Card */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Program Akademik &amp; Kompetensi:
                  </span>
                  <h4 className="text-sm font-extrabold text-bdc-navy">{result.program_title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-800 font-semibold pt-1">
                    <span>Durasi: {result.total_hours} Jam</span>
                    <span>•</span>
                    <span>Rata-Rata: {result.avg_score} (A+)</span>
                    <span>•</span>
                    <span className="bg-emerald-200/60 px-2 py-0.5 rounded">
                      Status: {result.completion_status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      No. Sertifikat
                    </span>
                    <span className="font-mono font-bold text-bdc-midnight text-[11px] truncate block">
                      {result.certificate_number}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      No. Transkrip
                    </span>
                    <span className="font-mono font-bold text-bdc-midnight text-[11px] truncate block">
                      {result.transcript_number}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      Tanggal Terbit
                    </span>
                    <span className="font-bold text-bdc-midnight block">{result.issue_date}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      Lokasi Kampus
                    </span>
                    <span className="font-bold text-bdc-midnight block">{result.location}</span>
                  </div>
                </div>

                {/* Signatories Info */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pejabat Pengesah I:</span>
                    <strong>{result.signatory_1_name}</strong> ({result.signatory_1_role} UTDI)
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] text-slate-400 block">Pejabat Pengesah II:</span>
                    <strong>{result.signatory_2_name}</strong> ({result.signatory_2_role})
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-rose-300 p-8 text-center space-y-3 shadow-md">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-bdc-midnight">
                  Kredensial Tidak Ditemukan
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Tidak ditemukan data sertifikat yang cocok dengan identitas &quot;{query}&quot; pada pangkalan data resmi BDC UTDI. Pastikan penulisan nomor sertifikat atau NIM sudah benar.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center pt-6 border-t border-slate-200 text-xs text-slate-400">
        &copy; 2026 Business Dev Club (BDC) — Universitas Teknologi Digital Indonesia (UTDI), Yogyakarta. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat verifikasi...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
