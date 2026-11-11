"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { CertificatePageOne } from "@/components/certificate/CertificatePageOne";
import { TranscriptPageTwo } from "@/components/certificate/TranscriptPageTwo";
import { SEED_CERTIFICATES } from "@/lib/data/store";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  FileText,
  Award,
} from "lucide-react";

export default function CertificatePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<"page1" | "page2">("page1");

  const cert = SEED_CERTIFICATES.find((c) => c.id === id) || SEED_CERTIFICATES[0];
  const verifyUrl = `/verify?cert=${encodeURIComponent(cert.certificate_number)}`;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-5 shadow-retro">
        <div className="flex items-center gap-3">
          <Link
            href="/certificates"
            className="retro-btn p-2.5 rounded-2xl bg-[#EFF0F0] text-slate-700 hover:text-bdc-midnight hover:bg-slate-200 border border-slate-300 shadow-retro-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-space text-sm sm:text-base font-bold text-bdc-midnight">
                Pratinjau Kredensial Resmi
              </h1>
              <BdcDots size="sm" />
            </div>
            <span className="font-mono text-[10px] text-slate-500 font-bold">
              NO: {cert.certificate_number}
            </span>
          </div>
        </div>

        {/* Tab Switcher & Print Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#EFF0F0] p-1 rounded-2xl border border-slate-300 text-xs shadow-retro-sm">
            <button
              onClick={() => setActiveTab("page1")}
              className={`retro-btn px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === "page1"
                  ? "bg-bdc-midnight text-white shadow-retro-sm border border-bdc-midnight"
                  : "text-slate-700 hover:text-bdc-midnight"
              }`}
            >
              Halaman 1 (Sertifikat)
            </button>
            <button
              onClick={() => setActiveTab("page2")}
              className={`retro-btn px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === "page2"
                  ? "bg-bdc-midnight text-white shadow-retro-sm border border-bdc-midnight"
                  : "text-slate-700 hover:text-bdc-midnight"
              }`}
            >
              Halaman 2 (Transkrip)
            </button>
          </div>

          <Link
            href={`/certificates/${cert.id}/print`}
            className="retro-btn px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm flex items-center gap-1.5 border border-bdc-midnight"
          >
            <Printer className="w-4 h-4 text-bdc-yellow" />
            <span>Cetak A4 / PDF</span>
          </Link>
        </div>
      </div>

      {/* Document Canvas Display */}
      <div className="p-4 sm:p-8 bg-[#f4f3ea] rounded-3xl overflow-x-auto flex justify-center border border-[#d9dfd7] shadow-inner">
        {activeTab === "page1" ? (
          <CertificatePageOne cert={cert} verifyUrl={verifyUrl} />
        ) : (
          <TranscriptPageTwo cert={cert} verifyUrl={verifyUrl} />
        )}
      </div>
    </div>
  );
}
