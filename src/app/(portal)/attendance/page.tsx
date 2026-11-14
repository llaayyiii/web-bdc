import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { hydrateFromDb } from "@/lib/data/db";
import { AttendanceScanner } from "@/components/attendance/AttendanceScanner";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  QrCode,
  CalendarCheck,
  TrendingUp,
  Award,
  Video,
  Clock,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default async function AttendancePage() {
  await hydrateFromDb();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const liveSession = bdcStore.getLiveSession();
  const attendances = bdcStore.getAttendancesByUser(user.id);
  const attendedCount = user.total_attendances || attendances.length;
  const attendanceRate = user.attendance_rate || 0;
  const isEligible = attendanceRate >= 80;

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Page Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 02 // VALIDASI PRESENSI MAHASISWA ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Presensi Barcode
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Validasi kehadiran real-time berbasis barcode token proyektor kelas dan sesi virtual Google Meet.
              Setiap presensi sah mencatat +100 XP ke leaderboard Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {liveSession && (
              <a
                href={liveSession.meet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm"
              >
                <Video className="w-4 h-4 text-bdc-yellow" />
                <span>Buka Google Meet</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. 4 Metric Cards with Inset Colors (GDGoC dash-stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Attendance Rate (Blue Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#095BAF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Tingkat Kehadiran
            </span>
            <CalendarCheck className="w-4 h-4 text-bdc-blue" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl font-black text-bdc-midnight">{attendanceRate}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isEligible ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(100, attendanceRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Total Sessions (Yellow Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#E9AD17] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Sesi Tervalidasi
            </span>
            <TrendingUp className="w-4 h-4 text-bdc-gold" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl font-black text-bdc-midnight">{attendedCount}</span>
            </div>
            <p className="font-mono text-[11px] text-slate-500 mt-1">Dihitung otomatis oleh server</p>
          </div>
        </div>

        {/* Metric 3: XP Presensi (Green Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#34A853] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              XP Kehadiran
            </span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl font-black text-emerald-700">
                +{attendedCount * 100}
              </span>
              <span className="font-mono text-xs font-bold text-bdc-gold">XP</span>
            </div>
            <p className="font-mono text-[11px] text-slate-500 mt-1">+100 XP setiap kehadiran terkonfirmasi</p>
          </div>
        </div>

        {/* Metric 4: Syarat Sertifikat (Red/Midnight Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#EA4335] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Syarat Kelulusan
            </span>
            {isEligible ? <Award className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-red-600" />}
          </div>
          <div className="mt-3">
            <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-md inline-block ${
              isEligible ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-red-100 text-red-800 border border-red-300"
            }`}>
              {isEligible ? "Memenuhi Syarat (>= 80%)" : "Belum Memenuhi (< 80%)"}
            </span>
            <p className="font-mono text-[10px] text-slate-500 mt-1.5">
              Minimal kehadiran 80% untuk menerbitkan sertifikat
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Scanner Left + Session Detail Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceScanner liveSession={liveSession} />
        </div>

        {/* Right Info: Live Session Card */}
        <div className="space-y-4">
          <div className="bg-[#fffefa] rounded-2xl border border-[#d9dfd7] p-5 shadow-retro-sm">
            <h3 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Informasi Sesi Hari Ini
            </h3>

            {liveSession ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#EFF0F0] border border-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-mono text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                      Sedang Berlangsung
                    </span>
                  </div>
                  <h4 className="font-space text-sm font-bold text-bdc-midnight mt-1">
                    {liveSession.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instruktur: <span className="font-semibold text-slate-700">{liveSession.instructor}</span>
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-400">Token QR:</span>
                    <span className="font-bold text-bdc-navy">{liveSession.qr_token}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-400">Jadwal:</span>
                    <span className="font-semibold">
                      {new Date(liveSession.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}{" "}
                      &ndash;{" "}
                      {new Date(liveSession.expires_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Batas Expired QR:</span>
                    <span className="font-semibold text-red-600">
                      {new Date(liveSession.expires_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {new Date(liveSession.expires_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                    </span>
                  </div>
                </div>

                <a
                  href={liveSession.meet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="retro-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-retro-sm"
                >
                  <Video className="w-4 h-4 text-bdc-yellow" />
                  <span>Gabung Ruang Google Meet</span>
                </a>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 font-mono">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Tidak ada sesi aktif saat ini.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Sesi berikutnya akan dijadwalkan oleh instruktur.</p>
              </div>
            )}
          </div>

          {/* Quick Guide Card */}
          <div className="bg-[#fffefa] rounded-2xl border border-[#d9dfd7] p-5 shadow-retro-sm">
            <h4 className="font-mono text-xs font-bold text-bdc-midnight uppercase tracking-wider mb-2">
              Tata Cara Presensi Barcode
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 font-mono">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-bdc-blue text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Perhatikan kode QR yang ditampilkan instruktur di layar proyektor kelas atau share screen Meet.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-bdc-blue text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Gunakan tombol scan kamera atau masukkan token manual sebelum waktu sesi kadaluarsa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-bdc-blue text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Setiap presensi sah otomatis mencatat +100 XP ke leaderboard Anda.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Attendance History Table (dash-table design) */}
      <div className="bg-[#fffefa] rounded-2xl border border-[#d9dfd7] shadow-retro-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-space font-bold text-base text-bdc-midnight">
                Histori Kehadiran Mahasiswa
              </h2>
              <BdcDots size="sm" />
            </div>
            <p className="text-xs text-slate-500">
              Catatan lengkap log scan barcode dan token kuliah yang terverifikasi
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            Total {attendances.length} Rekaman
          </span>
        </div>

        {attendances.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-mono">
            <QrCode className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">Belum ada riwayat kehadiran tercatat.</p>
            <p className="text-xs text-slate-400 mt-1">Lakukan scan barcode saat sesi dibuka oleh pemateri.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold tracking-wider border-y border-[#d9dfd7]">
                <tr>
                  <th className="py-3 px-4">Waktu Pindai</th>
                  <th className="py-3 px-4">Nama Sesi Pertemuan</th>
                  <th className="py-3 px-4">Metode Validasi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Poin XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9dfd7] font-medium">
                {attendances.map((record) => {
                  const date = new Date(record.scanned_at);
                  const formattedDate = date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const formattedTime = date.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {formattedDate} {formattedTime} WIB
                      </td>
                      <td className="py-3.5 px-4 font-space font-bold text-bdc-midnight">
                        {record.session_title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {record.method === "qr_scanner" ? "Optical QR Scanner" : "Token Manual"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Tervalidasi Hadir
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-bdc-navy">
                        +{record.points_earned} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
