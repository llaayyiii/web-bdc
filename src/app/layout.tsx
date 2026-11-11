import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Business Dev Club (BDC) - Academic College Community & Certification",
  description:
    "Portal Resmi Pembelajaran, Uji Kompetensi, dan Verifikasi Sertifikat Digital Mahasiswa - UTDI Yogyakarta.",
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
    <html lang="id" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-bdc-surface text-bdc-midnight antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
