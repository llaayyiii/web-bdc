"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Wrapper <main> admin: pada halaman presenter (Mode Proyektor),
 * konten tampil full-bleed tanpa padding/batas lebar agar layar penuh.
 */
export function AdminMain({ children }: { children: ReactNode }) {
  const isPresenter = usePathname().includes("/presenter");

  return (
    <main
      className={`flex-1 w-full ${
        isPresenter ? "" : "p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      }`}
    >
      {children}
    </main>
  );
}
