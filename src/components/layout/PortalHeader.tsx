"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Search, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

interface PortalHeaderProps {
  userName?: string;
  userRole?: string;
  userEmail?: string;
}

export function PortalHeader({ userName, userRole, userEmail }: PortalHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Campus Badge & Context */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-bdc-surface border border-slate-200 text-xs font-semibold text-bdc-midnight">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Portal Akademik BDC UTDI</span>
          <span className="text-slate-400">|</span>
          <span className="text-bdc-blue font-bold">2026/2027</span>
        </div>
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Verification Quick Link */}
        <Link
          href="/verify"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-bdc-blue hover:text-bdc-navy hover:bg-blue-50 border border-blue-200 transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Cek Keaslian Sertifikat</span>
          <span className="md:hidden">Verifikasi</span>
        </Link>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-bdc-midnight leading-tight">
              {userName || "Siti Rahmawati"}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {userEmail || "255720056@students.utdi.ac.id"}
            </span>
          </div>

          <div className="w-9 h-9 rounded-xl bg-bdc-navy text-bdc-yellow font-bold text-xs flex items-center justify-center shadow-sm">
            {userName ? userName.charAt(0).toUpperCase() : "S"}
          </div>

          {/* Logout Action */}
          <form action={logoutAction}>
            <button
              type="submit"
              title="Keluar dari Akun"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
