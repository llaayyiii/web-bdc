"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { CertificatePageOne } from "@/components/certificate/CertificatePageOne";
import { TranscriptPageTwo } from "@/components/certificate/TranscriptPageTwo";
import { getCertificateByIdAction } from "@/lib/actions/certificates";
import { Certificate } from "@/lib/types/database";
import { Printer, ArrowLeft, Layers, FileText, Award } from "lucide-react";

export default function CertificatePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [printMode, setPrintMode] = useState<"bundle" | "page1" | "page2">("bundle");
  const [cert, setCert] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadCert() {
      try {
        const data = await getCertificateByIdAction(id);
        if (active) setCert(data);
      } catch {
        if (active) setCert(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadCert();
    return () => {
      active = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Award className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
          <p className="text-xs text-slate-500">
            Menyiapkan dokumen cetak dari pangkalan data...
          </p>
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Award className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">Sertifikat tidak ditemukan.</p>
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bdc-navy text-white text-xs font-bold border border-bdc-midnight"
          >
            <ArrowLeft className="w-4 h-4 text-bdc-yellow" />
            <span>Kembali ke Sertifikat</span>
          </Link>
        </div>
      </div>
    );
  }

  if (cert.is_locked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Award className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">Sertifikat ini belum diterbitkan oleh pengelola BDC.</p>
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bdc-navy text-white text-xs font-bold border border-bdc-midnight"
          >
            <ArrowLeft className="w-4 h-4 text-bdc-yellow" />
            <span>Kembali ke Sertifikat</span>
          </Link>
        </div>
      </div>
    );
  }

  const verifyUrl = `/verify?cert=${encodeURIComponent(cert.certificate_number)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4">
      {/* Floating Toolbar (Hidden during print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-300 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-4 z-50">
        <div className="flex items-center gap-3">
          <Link
            href={`/certificates/${cert.id}`}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-extrabold text-bdc-midnight">
              Mode Cetak Dokumen Resmi A4
            </h1>
            <span className="text-[10px] text-slate-500 font-mono">
              Terverifikasi BDC UTDI: {cert.certificate_number}
            </span>
          </div>
        </div>

        {/* Mode Selector & Print Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPrintMode("bundle")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                printMode === "bundle"
                  ? "bg-white text-bdc-midnight shadow-sm font-bold"
                  : "text-slate-600 hover:text-bdc-midnight"
              }`}
            >
              Bundel (2 Hal)
            </button>
            <button
              onClick={() => setPrintMode("page1")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                printMode === "page1"
                  ? "bg-white text-bdc-midnight shadow-sm font-bold"
                  : "text-slate-600 hover:text-bdc-midnight"
              }`}
            >
              Sertifikat Saja
            </button>
            <button
              onClick={() => setPrintMode("page2")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                printMode === "page2"
                  ? "bg-white text-bdc-midnight shadow-sm font-bold"
                  : "text-slate-600 hover:text-bdc-midnight"
              }`}
            >
              Transkrip Saja
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-bdc-blue hover:bg-bdc-navy active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Sekarang</span>
          </button>
        </div>
      </div>

      {/* Printable Canvas */}
      <div className="max-w-[840px] mx-auto space-y-8 print:space-y-0 print:m-0 print:p-0">
        {/* Page 1: Certificate */}
        {(printMode === "bundle" || printMode === "page1") && (
          <div className={printMode === "bundle" ? "page-break" : ""}>
            <CertificatePageOne cert={cert} verifyUrl={verifyUrl} />
          </div>
        )}

        {/* Page 2: Transcript */}
        {(printMode === "bundle" || printMode === "page2") && (
          <div>
            <TranscriptPageTwo cert={cert} verifyUrl={verifyUrl} />
          </div>
        )}
      </div>
    </div>
  );
}
