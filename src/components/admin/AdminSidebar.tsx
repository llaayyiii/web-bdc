"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Award,
  FileQuestion,
  ArrowLeft,
  Menu,
  X,
  Shield,
  QrCode,
  FolderGit2,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Ringkasan Analitik",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Sesi Pertemuan & QR",
      href: "/admin/sessions",
      icon: QrCode,
    },
    {
      name: "Penilaian Tugas",
      href: "/admin/assignments",
      icon: FolderGit2,
    },
    {
      name: "Manajemen Mahasiswa",
      href: "/admin/students",
      icon: Users,
    },
    {
      name: "Editor Sertifikat",
      href: "/admin/certificates",
      icon: Award,
    },
    {
      name: "Bank Soal Evaluasi",
      href: "/admin/assessments",
      icon: FileQuestion,
    },
  ];

  return (
    <>
      {/* Mobile Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0a0f1d] text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-bdc-yellow" />
          <span className="font-extrabold text-xs tracking-wider uppercase">Dasbor Admin BDC</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0a0f1d] text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bdc-navy flex items-center justify-center p-2 border border-slate-700 shadow-md">
              <Image src="/logo.svg" alt="BDC Logo" width={24} height={24} className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight">Admin BDC</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-bdc-yellow text-bdc-midnight uppercase">
                  Curator
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">
                Biro Kemahasiswaan UTDI
              </span>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Administrasi Akademik
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-bdc-blue text-white shadow-md shadow-bdc-blue/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-bdc-yellow" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-800">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Buka Portal Mahasiswa</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
