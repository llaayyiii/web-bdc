"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificatePageOne } from "@/components/certificate/CertificatePageOne";
import { TranscriptPageTwo } from "@/components/certificate/TranscriptPageTwo";
import { SEED_CERTIFICATES } from "@/lib/data/store";
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
    <div className="space-y-6">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/certificates"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-extrabold text-bdc-midnight">
              Pratinjau Kredensial Resmi
            </h1>
            <span className="text-[10px] text-slate-500 font-mono">
              {cert.certificate_number}
            </span>
          </div>
        </div>

        {/* Tab Switcher & Print Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab("page1")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === "page1"
                  ? "bg-white text-bdc-midnight shadow-sm"
                  : "text-slate-600 hover:text-bdc-midnight"
              }`}
            >
              Halaman 1 (Sertifikat)
            </button>
            <button
              onClick={() => setActiveTab("page2")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === "page2"
                  ? "bg-white text-bdc-midnight shadow-sm"
                  : "text-slate-600 hover:text-bdc-midnight"
              }`}
            >
              Halaman 2 (Transkrip)
            </button>
          </div>

          <Link
            href={`/certificates/${cert.id}/print`}
            className="px-3.5 py-1.5 rounded-xl bg-bdc-blue hover:bg-bdc-navy text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak A4</span>
          </Link>
        </div>
      </div>

      {/* Document Canvas Display */}
      <div className="p-4 sm:p-8 bg-slate-200/60 rounded-3xl overflow-x-auto flex justify-center border border-slate-300/80">
        {activeTab === "page1" ? (
          <CertificatePageOne cert={cert} verifyUrl={verifyUrl} />
        ) : (
          <TranscriptPageTwo cert={cert} verifyUrl={verifyUrl} />
        )}
      </div>
    </div>
  );
}
