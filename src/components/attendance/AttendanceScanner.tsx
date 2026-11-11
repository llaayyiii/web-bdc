"use client";

import React, { useState } from "react";
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  RefreshCw,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { scanAttendanceAction } from "@/lib/actions/attendance";
import { MeetSession } from "@/lib/types/database";

interface AttendanceScannerProps {
  liveSession: MeetSession | null;
  onSuccess?: () => void;
}

export function AttendanceScanner({ liveSession }: AttendanceScannerProps) {
  const [tokenInput, setTokenInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    points?: number;
    newRate?: number;
  } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleSubmitToken = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await scanAttendanceAction(tokenInput.trim(), "token_code");
      setResult({
        success: res.success,
        message: res.message,
        points: res.pointsEarned,
        newRate: res.newAttendanceRate,
      });

      if (res.success) {
        setTokenInput("");
      }
    } catch {
      setResult({
        success: false,
        message: "Terjadi gangguan jaringan saat memverifikasi token presensi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateQuickScan = async () => {
    if (!liveSession) {
      setResult({
        success: false,
        message: "Tidak ada sesi kuliah/workshop BDC yang sedang aktif saat ini.",
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await scanAttendanceAction(liveSession.qr_token, "qr_scanner");
      setResult({
        success: res.success,
        message: res.message,
        points: res.pointsEarned,
        newRate: res.newAttendanceRate,
      });
    } catch {
      setResult({
        success: false,
        message: "Gagal memproses pindaian barcode.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-hidden relative">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bdc-navy text-bdc-yellow flex items-center justify-center shadow-inner">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-bdc-midnight">
              Pemindai Barcode Presensi Mandiri
            </h2>
            <p className="text-xs text-slate-500">
              Arahkan kamera ke layar proyektor ruang kelas atau masukkan kode sesi aktif
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Validasi Geolocation Kampus
        </span>
      </div>

      {/* Viewfinder Scanner Canvas */}
      <div className="relative rounded-2xl bg-bdc-midnight text-white p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
        {/* Animated Scanner Laser */}
        <div className="absolute inset-x-8 top-1/4 h-0.5 bg-gradient-to-r from-transparent via-bdc-yellow to-transparent animate-pulse shadow-[0_0_15px_#EEDD55]" />

        {/* Viewfinder Corners */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-bdc-blue/40 rounded-3xl flex flex-col items-center justify-center p-4 bg-bdc-navy/30 backdrop-blur-sm">
          {/* Top-left corner */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-bdc-yellow rounded-tl-xl" />
          {/* Top-right corner */}
          <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-bdc-yellow rounded-tr-xl" />
          {/* Bottom-left corner */}
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-bdc-yellow rounded-bl-xl" />
          {/* Bottom-right corner */}
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-bdc-yellow rounded-br-xl" />

          {isCameraActive ? (
            <div className="text-center space-y-2">
              <Camera className="w-10 h-10 text-bdc-yellow mx-auto animate-bounce" />
              <p className="text-xs text-slate-300 font-mono">
                Mencari Kode QR Aktif...
              </p>
              <button
                type="button"
                onClick={handleSimulateQuickScan}
                disabled={isSubmitting}
                className="mt-2 px-3 py-1.5 rounded-lg bg-bdc-yellow text-bdc-midnight text-[11px] font-black hover:bg-amber-400 transition-all flex items-center gap-1.5 mx-auto"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Tangkap Barcode Otomatis</span>
              </button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-bdc-yellow border border-white/10">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Optical QR Scanner</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Siap memindai kode proyektor
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCameraActive(true)}
                className="px-4 py-2 rounded-xl bg-bdc-blue hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center gap-2 mx-auto shadow-md"
              >
                <Camera className="w-4 h-4" />
                <span>Aktifkan Pemindai</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick simulation button if live session is present */}
        {liveSession && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={handleSimulateQuickScan}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-bdc-yellow border border-bdc-yellow/30 text-xs font-bold transition-all"
            >
              <Sparkles className="w-4 h-4 text-bdc-yellow" />
              <span>
                {isSubmitting ? "Memproses Verifikasi..." : "Pindai Langsung QR Sesi Aktif"}
              </span>
            </button>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Token Aktif Ruangan: <span className="text-white font-bold">{liveSession.qr_token}</span>
            </p>
          </div>
        )}
      </div>

      {/* Manual Input Form */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <form onSubmit={handleSubmitToken} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Alternatif: Input Token Presensi Sesi Manual
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Contoh: BDC-PRESENSI-LIVE-994"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bdc-blue focus:border-transparent text-xs font-mono uppercase tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !tokenInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validasi...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-bdc-yellow" />
                  <span>Kirim Token</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Feedback Alert Notification */}
      {result && (
        <div
          className={`mt-4 p-4 rounded-xl border flex items-start gap-3 transition-all ${
            result.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="text-xs font-bold">{result.message}</p>
            {result.success && result.points && (
              <p className="text-[11px] text-emerald-700">
                Poin XP Keaktifan: <strong>+{result.points} XP</strong> | Kehadiran saat ini:{" "}
                <strong>{result.newRate}%</strong>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
