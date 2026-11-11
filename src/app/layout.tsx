import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Pixelify_Sans, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
  weight: ["400", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Business Dev Club (BDC) — Komunitas Teknologi & Sertifikasi UTDI",
  description:
    "Komunitas Mahasiswa Teknologi UTDI Yogyakarta: Belajar Coding, Cybersecurity, UI/UX, dan AI lewat sesi praktik, presensi barcode, dan sertifikasi digital terakreditasi.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${pixelify.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bdc-surface text-bdc-midnight antialiased flex flex-col font-sans selection:bg-bdc-yellow selection:text-bdc-midnight">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
