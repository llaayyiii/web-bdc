"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Camera,
  CameraOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { scanAttendanceAction } from "@/lib/actions/attendance";
import { MeetSession } from "@/lib/types/database";
import { BdcDots } from "@/components/ui/BdcDots";

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
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<any>(null);
  const readerElementId = "bdc-qr-reader-container";

  // Process a scanned / inputted token
  const processToken = async (rawToken: string, method: "qr_scanner" | "token_code" = "qr_scanner") => {
    let clean = (rawToken || "").trim();
    if (!clean) return;

    // Handle full URL QR code (mis. https://.../attendance?token=BDC-PRESENSI-LIVE-xxx)
    if (clean.includes("token=")) {
      const match = clean.match(/token=([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        clean = match[1];
      }
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await scanAttendanceAction(clean, method);
      setResult({
        success: res.success,
        message: res.message,
        points: res.pointsEarned,
        newRate: res.newAttendanceRate,
      });

      if (res.success) {
        setTokenInput("");
        // Matikan kamera jika berhasil scan
        if (isCameraActive) {
          stopScanner();
        }
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

  const handleSubmitToken = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;
    await processToken(tokenInput.trim(), "token_code");
  };

  const handleSimulateQuickScan = async () => {
    if (!liveSession) {
      setResult({
        success: false,
        message: "Tidak ada sesi kuliah/workshop BDC yang sedang aktif (live) saat ini.",
      });
      return;
    }
    await processToken(liveSession.qr_token, "qr_scanner");
  };

  // Start HTML5 QR Code Scanner
  const startScanner = async () => {
    setCameraError(null);
    setResult(null);
    setIsCameraActive(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      
      // Tunggu elemen DOM siap
      setTimeout(async () => {
        try {
          if (scannerRef.current) {
            try {
              await scannerRef.current.stop();
            } catch {}
          }

          const html5QrCode = new Html5Qrcode(readerElementId);
          scannerRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              processToken(decodedText, "qr_scanner");
            },
            () => {
              // Frame scan error biasa saat belum menemukan QR, abaikan
            }
          );
        } catch (err: unknown) {
          console.error("Camera start error:", err);
          setCameraError(
            "Tidak dapat mengakses kamera perangkat. Pastikan izin kamera aktif atau gunakan tombol tangkap sesi / input token di bawah."
          );
          setIsCameraActive(false);
        }
      }, 100);
    } catch (err: unknown) {
      console.error("Scanner load error:", err);
      setCameraError("Gagal memuat pustaka optical scanner.");
      setIsCameraActive(false);
    }
  };

  // Stop HTML5 QR Code Scanner
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.warn("Stop scanner warning:", err);
      }
      scannerRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Scan from image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("bdc-file-scan-temp");
      const decoded = await html5QrCode.scanFile(file, true);
      if (decoded) {
        processToken(decoded, "qr_scanner");
      }
    } catch (err) {
      setResult({
        success: false,
        message: "Tidak ditemukan kode QR valid pada gambar yang diunggah.",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] shadow-retro p-6 sm:p-7 overflow-hidden relative font-sans">
      <div id="bdc-file-scan-temp" className="hidden" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#d9dfd7] mb-5 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-bdc-midnight text-bdc-yellow flex items-center justify-center border-2 border-bdc-midnight shadow-retro-sm shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                Pemindai Barcode Presensi Mandiri
              </h2>
              <BdcDots size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-sans">
              Arahkan kamera ke layar proyektor kelas atau masukkan token sesi aktif
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#EFF0F0] text-emerald-800 border border-slate-300 self-start sm:self-auto shadow-retro-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Geolocation Kampus</span>
        </span>
      </div>

      {cameraError && (
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 shadow-retro-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Info Izin Kamera: </span>
            {cameraError}
          </div>
        </div>
      )}

      {/* Viewfinder Scanner Canvas */}
      <div className="relative rounded-2xl bg-[#EFF0F0] text-slate-700 p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden border border-[#d9dfd7] min-h-[300px]">
        {/* Animated Scanner Laser */}
        {isCameraActive && (
          <div className="absolute inset-x-8 top-1/3 h-0.5 bg-gradient-to-r from-transparent via-bdc-yellow to-transparent animate-pulse shadow-[0_0_15px_#EEDD55] z-10 pointer-events-none" />
        )}

        {/* Viewfinder Corners */}
        <div className="relative w-64 h-64 border-2 border-bdc-blue/40 rounded-3xl flex flex-col items-center justify-center p-2 bg-white overflow-hidden">
          {/* Top-left corner */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-bdc-yellow rounded-tl-xl pointer-events-none z-20" />
          {/* Top-right corner */}
          <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-bdc-yellow rounded-tr-xl pointer-events-none z-20" />
          {/* Bottom-left corner */}
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-bdc-yellow rounded-bl-xl pointer-events-none z-20" />
          {/* Bottom-right corner */}
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-bdc-yellow rounded-br-xl pointer-events-none z-20" />

          {/* HTML5 QR Code Mount Element */}
          <div
            id={readerElementId}
            className={`w-full h-full rounded-2xl overflow-hidden ${
              isCameraActive ? "block" : "hidden"
            }`}
          />

          {!isCameraActive && (
            <div className="text-center space-y-3 p-3">
              <div className="w-12 h-12 rounded-2xl bg-bdc-midnight flex items-center justify-center mx-auto text-bdc-yellow border border-bdc-midnight">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <p className="font-space text-sm font-bold text-bdc-midnight tracking-tight">
                  Optical QR Scanner
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
                  Siap memindai barcode proyektor
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={startScanner}
                  disabled={isSubmitting}
                  className="retro-btn px-4 py-2 rounded-xl bg-bdc-blue hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto shadow-retro-sm"
                >
                  <Camera className="w-4 h-4 text-bdc-yellow" />
                  <span>Aktifkan Kamera</span>
                </button>

                <label className="retro-btn px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-mono cursor-pointer flex items-center justify-center gap-1.5 transition-all">
                  <Upload className="w-3.5 h-3.5 text-bdc-gold" />
                  <span>Upload Foto Barcode</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Camera Stop Control */}
        {isCameraActive && (
          <div className="mt-4 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={stopScanner}
              className="retro-btn px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-retro-sm"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>Matikan Kamera</span>
            </button>
          </div>
        )}

        {/* Quick simulation button if live session is present */}
        {liveSession && (
          <div className="mt-5 text-center space-y-1.5">
            <button
              type="button"
              onClick={handleSimulateQuickScan}
              disabled={isSubmitting}
              className="retro-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-bdc-navy border border-slate-300 text-xs font-bold transition-all shadow-retro-sm"
            >
              <Sparkles className="w-4 h-4 text-bdc-gold" />
              <span>
                {isSubmitting ? "Memproses Verifikasi..." : "Pindai Langsung QR Sesi Aktif"}
              </span>
            </button>
            <p className="text-[11px] text-slate-500 font-mono">
              Token Aktif Ruangan: <span className="text-bdc-navy font-bold">{liveSession.qr_token}</span>
            </p>
          </div>
        )}
      </div>

      {/* Manual Input Form */}
      <div className="mt-6 pt-5 border-t border-[#d9dfd7]">
        <form onSubmit={handleSubmitToken} className="space-y-3">
          <label className="block text-xs font-bold text-bdc-midnight font-space uppercase tracking-wider">
            Alternatif: Input Token Presensi Sesi Manual
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Contoh: BDC-PRESENSI-LIVE-994"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-bdc-midnight focus:shadow-retro-sm text-xs font-mono uppercase tracking-wider bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !tokenInput.trim()}
              className="retro-btn px-5 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-retro-sm"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-bdc-yellow" />
                  <span>Validasi...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-bdc-yellow" />
                  <span>Kirim Token (+100 XP)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Feedback Alert Notification */}
      {result && (
        <div
          className={`mt-4 p-4 rounded-2xl border-2 flex items-start gap-3 transition-all shadow-retro-sm ${
            result.success
              ? "bg-[#fffefa] border-emerald-600 text-emerald-950"
              : "bg-[#fffefa] border-rose-600 text-rose-950"
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 font-sans">
            <p className="text-xs font-bold">{result.message}</p>
            {result.success && result.points && (
              <p className="text-[11px] text-slate-600 font-mono">
                Poin XP Keaktifan: <strong className="text-emerald-700">+{result.points} XP</strong> | Kehadiran saat ini:{" "}
                <strong className="text-bdc-midnight">{result.newRate}%</strong>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
