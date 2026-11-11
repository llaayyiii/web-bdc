"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  QrCode,
  Trophy,
  FolderGit2,
  FileQuestion,
  Award,
  Settings,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { BdcDots } from "@/components/ui/BdcDots";

interface PortalSidebarProps {
  userRole?: string;
  userName?: string;
  userNim?: string;
}

export function PortalSidebar({ userRole, userName, userNim }: PortalSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Dasbor Utama",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Ringkasan Akademik & Capstone",
    },
    {
      name: "Materi & Silabus",
      href: "/courses",
      icon: BookOpen,
      description: "5 Modul Komunitas BDC",
    },
    {
      name: "Presensi Barcode",
      href: "/attendance",
      icon: QrCode,
      description: "Scan QR & Kehadiran Sesi",
    },
    {
      name: "Papan Peringkat",
      href: "/leaderboard",
      icon: Trophy,
      description: "Rank Kehadiran & Kontribusi",
    },
    {
      name: "Tugas & Proyek",
      href: "/assignments",
      icon: FolderGit2,
      description: "Pengumpulan Proyek & Kasus",
    },
    {
      name: "Ujian & Kuis",
      href: "/assessments",
      icon: FileQuestion,
      description: "Evaluasi Kompetensi Mandiri",
    },
    {
      name: "Sertifikat & Transkrip",
      href: "/certificates",
      icon: Award,
      description: "Kredensial & Cetak Resmi A4",
    },
    {
      name: "Pengaturan Akun",
      href: "/settings",
      icon: Settings,
      description: "Profil Mahasiswa & Password",
    },
  ];

  return (
    <>
      {/* Mobile Topbar Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-bdc-midnight text-white border-b border-bdc-navy sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-bdc-navy flex items-center justify-center p-1.5 border border-slate-700">
            <Image src="/logo.svg" alt="BDC Logo" width={20} height={20} className="w-5 h-5 object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">BDC Portal</span>
            <span className="text-[10px] text-bdc-yellow block leading-none font-medium">UTDI Yogyakarta</span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-bdc-navy text-slate-200 hover:text-white"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-bdc-midnight/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-bdc-midnight text-slate-300 flex flex-col border-r border-bdc-navy shadow-xl transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Area */}
        <div className="p-5 border-b border-bdc-navy/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bdc-navy flex items-center justify-center p-2 border border-slate-700 shadow-inner">
              <Image src="/logo.svg" alt="BDC Logo" width={24} height={24} className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">Business Dev Club</span>
                <BdcDots size="sm" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-bold text-bdc-midnight bg-bdc-yellow px-1.5 py-0.2 rounded font-mono">
                  UTDI
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Student Chapter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Pembelajaran
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                  isActive
                    ? "bg-bdc-navy text-white font-bold shadow-md shadow-bdc-navy/40 border border-bdc-blue/40"
                    : "text-slate-300 hover:bg-bdc-navy/50 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? "text-bdc-yellow" : "text-slate-400 group-hover:text-bdc-blue"
                  }`}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs truncate">{item.name}</span>
                  <span className="text-[10px] font-normal text-slate-400 truncate">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Admin shortcut if user is instructor or admin */}
          {(userRole === "admin" || userRole === "instructor") && (
            <div className="pt-4 mt-3 border-t border-bdc-navy">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-bdc-yellow">
                Panel Pengelola
              </div>
              <Link
                href="/admin"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-bdc-blue/20 hover:bg-bdc-blue/30 text-bdc-yellow border border-bdc-blue/30 text-xs font-bold transition-all"
              >
                <span>Buka Dasbor Admin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </nav>

        {/* User Mini Card on Bottom */}
        <div className="p-3 border-t border-bdc-navy/80 bg-bdc-midnight/50">
          <div className="p-2.5 rounded-xl bg-bdc-navy/60 border border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-bdc-blue text-white font-bold text-xs flex items-center justify-center shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate">{userName || "Siti Rahmawati"}</span>
              <span className="text-[10px] text-bdc-yellow truncate font-mono">NIM: {userNim || "255720056"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
