"use client";

import React, { useState, useEffect } from "react";
import { LogOut, PanelTop } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { BdcDots } from "@/components/ui/BdcDots";

interface PortalHeaderProps {
  userName?: string;
  userRole?: string;
  userEmail?: string;
}

export function PortalHeader({ userName, userRole, userEmail }: PortalHeaderProps) {
  const [isHidden, setIsHidden] = useState(false);

  // Pulihkan preferensi sembunyikan header (disimpan di browser)
  useEffect(() => {
    if (localStorage.getItem("bdc_portal_header_hide") === "1") {
      setIsHidden(true);
    }
  }, []);

  const toggleHidden = () => {
    setIsHidden((prev) => {
      const next = !prev;
      localStorage.setItem("bdc_portal_header_hide", next ? "1" : "0");
      return next;
    });
  };

  if (isHidden) {
    return (
      <button
        type="button"
        onClick={toggleHidden}
        aria-label="Tampilkan header"
        title="Tampilkan header"
        className="fixed top-2 right-3 z-40 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-bdc-midnight text-bdc-yellow border border-bdc-midnight text-[10px] font-mono font-bold shadow-retro hover:bg-bdc-blue transition-colors"
      >
        <PanelTop className="w-3.5 h-3.5" />
        <span>Header</span>
      </button>
    );
  }

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
        <button
          type="button"
          onClick={toggleHidden}
          aria-label="Sembunyikan header"
          title="Sembunyikan header"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-bdc-midnight hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
        >
          <PanelTop className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sembunyikan</span>
        </button>

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
