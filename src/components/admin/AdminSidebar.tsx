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
import { BdcDots } from "@/components/ui/BdcDots";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Ringkasan Analitik",
      href: "/admin",
      icon: LayoutDashboard,
      code: "01",
    },
    {
      name: "Sesi Pertemuan & QR",
      href: "/admin/sessions",
      icon: QrCode,
      code: "02",
    },
    {
      name: "Penilaian Tugas",
      href: "/admin/assignments",
      icon: FolderGit2,
      code: "03",
    },
    {
      name: "Manajemen Mahasiswa",
      href: "/admin/students",
      icon: Users,
      code: "04",
    },
    {
      name: "Editor Sertifikat",
      href: "/admin/certificates",
      icon: Award,
      code: "05",
    },
    {
      name: "Bank Soal Evaluasi",
      href: "/admin/assessments",
      icon: FileQuestion,
      code: "06",
    },
    {
      name: "Manajemen Pengguna",
      href: "/admin/users",
      icon: Shield,
      code: "07",
    },
  ];

  return (
    <>
      {/* Mobile Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#f4f3ea] text-bdc-midnight border-b border-[#d9dfd7] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-bdc-midnight text-bdc-yellow flex items-center justify-center font-pixel text-xs border border-bdc-midnight shadow-retro-sm">
            ADM
          </div>
          <span className="font-space font-bold text-sm text-bdc-midnight">Admin Panel BDC</span>
          <BdcDots size="sm" />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="retro-btn p-1.5 rounded-xl bg-white border border-[#d9dfd7] text-bdc-midnight shadow-retro-sm"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#f4f3ea] text-slate-700 flex flex-col border-r border-[#d9dfd7] transition-transform duration-200 font-sans ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-[#d9dfd7]">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="BDC Logo"
              width={48}
              height={27}
              className="h-8 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-space font-bold text-sm text-bdc-midnight tracking-tight">Admin BDC</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-bdc-yellow text-bdc-midnight border border-bdc-midnight shadow-retro-sm uppercase">
                  Curator
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 font-medium block">
                Biro Kemahasiswaan UTDI
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#d9dfd7] flex items-center justify-between">
            <span className="font-mono text-[10px] text-bdc-blue font-bold tracking-wider">
              [ ADMIN CONSOLE ]
            </span>
            <BdcDots size="sm" />
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            [ ADMINISTRASI AKADEMIK ]
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`retro-btn flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-bdc-navy text-white shadow-[3px_3px_0_#000741] border border-bdc-midnight"
                    : "text-slate-700 hover:bg-[#fffefa] hover:text-bdc-midnight hover:shadow-retro-sm border border-transparent hover:border-[#d9dfd7]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-bdc-yellow" : "text-slate-500"}`} />
                <span className="flex-1">{item.name}</span>
                <span
                  className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                    isActive ? "bg-white/20 text-white" : "text-slate-400 bg-black/5"
                  }`}
                >
                  {item.code}
                </span>
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-[#d9dfd7]">
            <Link
              href="/dashboard"
              className="retro-btn flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-bold text-bdc-midnight bg-[#fffefa] hover:bg-white border border-[#d9dfd7] shadow-retro-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-bdc-blue" />
              <span>Buka Portal Mahasiswa</span>
            </Link>
          </div>
        </nav>

        {/* Footer info card */}
        <div className="p-3 border-t border-[#d9dfd7]">
          <div className="p-3 rounded-2xl bg-[#fffefa] border border-[#d9dfd7] shadow-retro-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-bdc-midnight text-bdc-yellow font-pixel text-xs flex items-center justify-center shrink-0 border border-bdc-midnight shadow-retro-sm">
              SA
            </div>
            <div className="min-w-0">
              <p className="font-space text-xs font-bold text-bdc-midnight truncate">Super Admin BDC</p>
              <p className="font-mono text-[10px] text-slate-500 truncate">admin@utdi.ac.id</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
