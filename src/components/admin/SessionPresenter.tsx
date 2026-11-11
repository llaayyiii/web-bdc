"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import {
  QrCode,
  RefreshCw,
  Video,
  ExternalLink,
  Users,
  Clock,
  ArrowLeft,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { MeetSession, AttendanceRecord } from "@/lib/types/database";
import { adminRotateSessionTokenAction } from "@/lib/actions/sessions";
import { getSessionAttendees } from "@/lib/actions/attendance";

interface SessionPresenterProps {
  session: MeetSession;
  initialAttendees: AttendanceRecord[];
}

export function SessionPresenter({ session, initialAttendees }: SessionPresenterProps) {
  const [currentSession, setCurrentSession] = useState(session);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [attendees, setAttendees] = useState<AttendanceRecord[]>(initialAttendees);
  const [isRotating, setIsRotating] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Generate QR code when token changes
  useEffect(() => {
    QRCode.toDataURL(currentSession.qr_token, {
      width: 450,
      margin: 2,
      color: {
        dark: "#000741",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR:", err));
  }, [currentSession.qr_token]);

  // Rotate token countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRotateToken();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession.id]);

  // Poll attendees every 5 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const latest = await getSessionAttendees(currentSession.id);
        setAttendees(latest);
      } catch (err) {
        console.error("Error fetching attendees:", err);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [currentSession.id]);

  const handleRotateToken = async () => {
    setIsRotating(true);
    try {
      const res = await adminRotateSessionTokenAction(currentSession.id);
      if (res.success && res.token) {
        setCurrentSession((prev) => ({ ...prev, qr_token: res.token! }));
        setCountdown(30);
      }
    } catch (err) {
      console.error("Failed to rotate token:", err);
    } finally {
      setIsRotating(false);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#000741] text-white flex flex-col p-6 sm:p-10 font-sans">
      {/* Top Bar for Presenter */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/sessions"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Panel Sesi</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Mode Proyektor Aktif (Live Presentation)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              {currentSession.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={currentSession.meet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-blue text-white text-xs font-bold transition-all border border-bdc-blue/40 shadow-lg"
          >
            <Video className="w-4 h-4 text-bdc-yellow" />
            <span>Buka Google Meet</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all border border-white/10"
            title="Layar Penuh (F11)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stage: QR Code Projection & Real-time Attendee Ticker */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
        {/* Left 7 Cols: Massive QR Code Projection Box */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-bdc-navy/80 to-[#031542] border-2 border-bdc-blue/40 shadow-2xl relative overflow-hidden text-center">
          {/* Subtle Ambient Lighting */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-bdc-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-bdc-yellow/15 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bdc-yellow/10 border border-bdc-yellow/30 text-bdc-yellow text-xs font-black tracking-wider uppercase mb-6">
            <QrCode className="w-4 h-4" />
            <span>Pindai Barcode Presensi Ruang Kuliah</span>
          </div>

          {/* QR Container */}
          <div className="relative p-4 bg-white rounded-3xl shadow-[0_0_50px_rgba(238,221,85,0.25)] border-4 border-bdc-yellow">
            {qrDataUrl ? (
              <Image
                src={qrDataUrl}
                alt="QR Code Presensi"
                width={360}
                height={360}
                className="w-72 h-72 sm:w-80 sm:h-80 object-contain rounded-2xl"
                priority
              />
            ) : (
              <div className="w-72 h-72 flex items-center justify-center text-bdc-midnight">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            )}
          </div>

          {/* Dynamic Token Display & Rotation Countdown */}
          <div className="mt-8 space-y-3 w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Token Alternatif Mahasiswa
                </span>
                <span className="font-mono text-lg font-black text-bdc-yellow tracking-wider">
                  {currentSession.qr_token}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Rotasi Kode</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    {countdown}s
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRotateToken}
                  disabled={isRotating}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-all border border-white/10"
                  title="Putar Token Sekarang"
                >
                  <RefreshCw className={`w-4 h-4 ${isRotating ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Buka aplikasi mahasiswa BDC di smartphone / laptop &rarr; Pilih menu{" "}
              <strong className="text-white">Presensi Barcode</strong>.
            </p>
          </div>
        </div>

        {/* Right 5 Cols: Live Attendee Stream */}
        <div className="lg:col-span-5 h-full flex flex-col rounded-3xl bg-bdc-navy/50 border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bdc-blue/30 text-bdc-yellow flex items-center justify-center border border-bdc-blue/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">
                  Daftar Kehadiran Realtime
                </h2>
                <p className="text-xs text-slate-400">
                  {attendees.length} Mahasiswa Telah Terverifikasi
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {attendees.length} Hadir
            </span>
          </div>

          {/* Attendee List Feed */}
          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[500px] pr-2">
            {attendees.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">Menunggu peserta memindai...</p>
                <p className="text-[11px] text-slate-500 mt-1">Daftar mahasiswa akan ter-update otomatis.</p>
              </div>
            ) : (
              attendees.map((att, idx) => {
                const scanTime = new Date(att.scanned_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
                return (
                  <div
                    key={att.id || idx}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bdc-yellow text-bdc-midnight font-black text-xs flex items-center justify-center">
                        {att.user_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">
                          {att.user_name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          NIM: {att.nim_id} | {att.method === "qr_scanner" ? "Optical Scan" : "Manual Code"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {scanTime} WIB
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3 h-3" />
                        +100 XP
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Validasi Otentikasi Kampus UTDI</span>
            </span>
            <span className="font-mono text-[11px]">Sync: Otomatis (5s)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
