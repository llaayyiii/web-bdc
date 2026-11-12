"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { BdcDots } from "@/components/ui/BdcDots";

interface PortalHeaderProps {
  userName?: string;
  userRole?: string;
  userEmail?: string;
}

export function PortalHeader({ userName, userRole, userEmail }: PortalHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-300 px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Campus Badge & Context */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-bdc-surface border border-slate-300 text-xs font-semibold text-bdc-midnight shadow-retro-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-space font-bold">Portal Akademik BDC UTDI</span>
          <BdcDots size="sm" />
          <span className="text-slate-400 font-mono">|</span>
          <span className="text-bdc-blue font-bold font-mono">2026/2027</span>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Logout Action */}
        <form action={logoutAction}>
          <button
            type="submit"
            title="Keluar dari Akun"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </header>
  );
}
