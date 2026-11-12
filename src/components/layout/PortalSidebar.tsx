"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  QrCode,
  Trophy,
  FolderGit2,
  Award,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { BdcDots } from "@/components/ui/BdcDots";

interface PortalSidebarProps {
  userRole?: string;
  userName?: string;
  userNim?: string;
}

export function PortalSidebar({ userRole, userName, userNim }: PortalSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Pulihkan preferensi sembunyikan sidebar (disimpan di browser)
  useEffect(() => {
    if (localStorage.getItem("bdc_portal_sidebar_hide") === "1") {
      setIsHidden(true);
    }
  }, []);

  const toggleHidden = () => {
    setIsHidden((prev) => {
      const next = !prev;
      localStorage.setItem("bdc_portal_sidebar_hide", next ? "1" : "0");
      return next;
    });
  };

  const showSidebar = () => {
    setIsHidden(false);
    localStorage.setItem("bdc_portal_sidebar_hide", "0");
  };

  const navItems = [
    {
      name: "Dasbor Utama",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Ringkasan Akademik & Capstone",
    },
    {
      name: "Papan Skor & Rank",
      href: "/leaderboard",
      icon: Trophy,
      description: "Rank Kehadiran & Kontribusi",
    },
    {
      name: "Presensi Barcode",
      href: "/attendance",
      icon: QrCode,
      description: "Scan QR & Kehadiran Sesi",
    },
    {
      name: "Materi & Silabus",
      href: "/courses",
      icon: BookOpen,
      description: "Modul Praktik Komunitas BDC",
    },
    {
      name: "Tugas & Essay",
      href: "/assignments",
      icon: FolderGit2,
      description: "Soal Essay, Proyek & Pengumpulan",
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
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#f4f3ea] text-bdc-midnight border-b border-slate-300 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="BDC Logo"
            width={40}
            height={22}
            className="h-7 w-auto object-contain"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-space font-extrabold text-sm tracking-tight text-bdc-midnight">
                BDC Portal
              </span>
              <BdcDots size="sm" />
            </div>
            <span className="font-mono text-[10px] text-slate-500 block leading-none font-medium">
              UTDI Yogyakarta
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            if (isHidden) showSidebar();
            setIsOpen(!isOpen);
          }}
          className="p-2 rounded-xl bg-white text-bdc-midnight border border-slate-300 hover:bg-slate-100 shadow-retro-sm"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-bdc-midnight/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Shell (Styled like GDGoC IPB dash-sidebar) */}
      <aside
        className={`top-0 left-0 z-50 h-screen w-68 bg-[#f4f3ea] text-bdc-midnight flex flex-col border-r border-[#d9dfd7] shadow-sm transition-transform duration-200 ease-in-out ${
          isHidden
            ? "fixed -translate-x-full"
            : `fixed lg:sticky ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`
        }`}
      >
        {/* Brand Area */}
        <div className="p-5 border-b border-[#d9dfd7] bg-[#f4f3ea] flex items-start justify-between gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.svg"
              alt="BDC Logo"
              width={48}
              height={27}
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-space font-extrabold text-sm tracking-tight text-bdc-midnight">
                  Business Dev Club
                </span>
                <BdcDots size="sm" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-bold text-bdc-midnight bg-bdc-yellow px-1.5 py-0.2 rounded font-mono border border-slate-800">
                  UTDI
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-medium">Student Chapter</span>
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={toggleHidden}
            aria-label="Sembunyikan menu navigasi"
            title="Sembunyikan menu"
            className="p-1.5 rounded-lg text-slate-400 hover:text-bdc-midnight hover:bg-[#eae9dc] border border-transparent hover:border-[#d9dfd7] transition-colors shrink-0"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#6b7880]">
            Menu Pembelajaran
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                  isActive
                    ? "bg-bdc-blue text-white font-bold shadow-retro border border-bdc-midnight"
                    : "text-slate-700 hover:bg-[#eae9dc] hover:text-bdc-midnight"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-bdc-yellow" : "text-slate-500 group-hover:text-bdc-blue"
                  }`}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs truncate">{item.name}</span>
                  <span
                    className={`text-[10px] font-normal truncate ${
                      isActive ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Admin shortcut if user is instructor or admin */}
          {(userRole === "admin" || userRole === "instructor") && (
            <div className="pt-4 mt-3 border-t border-[#d9dfd7]">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#6b7880]">
                Panel Pengelola
              </div>
              <Link
                href="/admin"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-bdc-midnight border border-slate-300 text-xs font-bold transition-all shadow-retro-sm"
              >
                <span className="font-space">Dasbor Kurator Admin</span>
                <ExternalLink className="w-3.5 h-3.5 text-bdc-blue" />
              </Link>
            </div>
          )}
        </nav>

        {/* User Mini Card on Bottom (Styled like GDGoC IPB dash-account) */}
        <div className="p-3 border-t border-[#d9dfd7] bg-[#f4f3ea]">
          <div className="p-2.5 rounded-xl bg-white border border-[#d5dcd0] flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 font-pixel bg-[#e6eddc] border border-[#c9d7bc] text-bdc-midnight font-bold text-sm flex items-center justify-center shrink-0 shadow-retro-sm">
              {userName ? userName.charAt(0).toUpperCase() : "M"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-bdc-midnight truncate leading-tight">
                {userName || "Mahasiswa"}
              </span>
              <span className="text-[10px] text-slate-500 truncate font-mono">
                NIM: {userNim || "-"}
              </span>
              <span className="inline-block mt-0.5 text-[9px] font-mono font-bold text-bdc-blue bg-blue-50 border border-blue-200 px-1 rounded w-fit">
                {userRole === "admin" ? "Curator Admin" : "Active Learner"}
              </span>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Keluar dari Akun"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Tombol tampilkan menu saat sidebar disembunyikan */}
      {isHidden && (
        <button
          type="button"
          onClick={toggleHidden}
          aria-label="Tampilkan menu navigasi"
          title="Tampilkan menu"
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-r-xl bg-bdc-midnight text-bdc-yellow border border-bdc-midnight shadow-retro hover:bg-bdc-blue transition-colors"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}
    </>
  );
}
