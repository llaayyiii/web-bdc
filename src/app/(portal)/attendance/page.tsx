import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { AttendanceScanner } from "@/components/attendance/AttendanceScanner";
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
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const liveSession = bdcStore.getLiveSession();
  const attendances = bdcStore.getAttendancesByUser(user.id);
  const totalSessions = user.total_sessions || 8;
  const attendedCount = user.total_attendances || attendances.length;
  const attendanceRate = user.attendance_rate || 0;
  const isEligible = attendanceRate >= 80;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-bdc-navy text-bdc-yellow mb-1.5">
            <QrCode className="w-3.5 h-3.5" />
            <span>Sistem Presensi Dinamis BDC</span>
          </div>
          <h1 className="text-2xl font-black text-bdc-midnight tracking-tight">
            Presensi Kuliah &amp; Workshop
          </h1>
          <p className="text-xs text-slate-500">
            Validasi kehadiran real-time berbasis barcode token proyektor kelas &amp; tatap muka virtual
          </p>
        </div>

        <div className="flex items-center gap-2">
          {liveSession && (
            <a
              href={liveSession.meet_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-md"
            >
              <Video className="w-4 h-4 text-bdc-yellow" />
              <span>Buka Google Meet</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Tingkat Kehadiran
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-bdc-blue">
              <CalendarCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-bdc-midnight">{attendanceRate}%</span>
              <span className="text-xs font-semibold text-slate-400">/ 100%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isEligible ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(100, attendanceRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Total Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Sesi Tervalidasi
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-bdc-gold">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black text-bdc-midnight">{attendedCount}</span>
            <span className="text-xs font-semibold text-slate-400 ml-1">/ {totalSessions} Pertemuan</span>
            <p className="text-[10px] text-slate-500 mt-1">Presensi dihitung otomatis oleh server</p>
          </div>
        </div>

        {/* Metric 3: XP Presensi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              XP Kehadiran
            </span>
            <span className="p-1.5 rounded-lg bg-yellow-50 text-bdc-yellow">
              <Award className="w-4 h-4 text-amber-600" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black text-bdc-midnight">
              +{attendedCount * 100}
            </span>
            <span className="text-xs font-bold text-bdc-gold ml-1">XP</span>
            <p className="text-[10px] text-slate-500 mt-1">+100 XP setiap kehadiran terkonfirmasi</p>
          </div>
        </div>

        {/* Metric 4: Syarat Sertifikat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Syarat Sertifikat
            </span>
            <span className={`p-1.5 rounded-lg ${isEligible ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              {isEligible ? <Award className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            </span>
          </div>
          <div className="mt-2">
            <span className={`text-xs font-black px-2 py-1 rounded-md inline-block ${
              isEligible ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}>
              {isEligible ? "Memenuhi Syarat (>= 80%)" : "Belum Memenuhi (< 80%)"}
            </span>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Minimum kehadiran 80% diperlukan untuk menerbitkan sertifikat
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Scanner Left + Session Detail Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceScanner liveSession={liveSession} />
        </div>

        {/* Right Info: Live Session Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Informasi Sesi Hari Ini
            </h3>

            {liveSession ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-bdc-surface border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                      Sedang Berlangsung
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-bdc-midnight mt-1">
                    {liveSession.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instruktur: <span className="font-semibold text-slate-700">{liveSession.instructor}</span>
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Kode Sesi:</span>
                    <span className="font-mono font-bold text-bdc-navy">{liveSession.id}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Jadwal:</span>
                    <span className="font-semibold">08:00 - 11:00 WIB</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Batas Expired QR:</span>
                    <span className="font-semibold text-red-600">30 Menit Sejak Dibuka</span>
                  </div>
                </div>

                <a
                  href={liveSession.meet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bdc-navy hover:bg-bdc-midnight text-white text-xs font-bold transition-all shadow-md"
                >
                  <Video className="w-4 h-4 text-bdc-yellow" />
                  <span>Gabung Ruang Google Meet</span>
                </a>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Tidak ada sesi aktif saat ini.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Sesi berikutnya akan dijadwalkan oleh instruktur.</p>
              </div>
            )}
          </div>

          {/* Quick Guide Card */}
          <div className="bg-gradient-to-br from-bdc-midnight to-bdc-navy text-white rounded-2xl p-5 border border-bdc-navy shadow-sm">
            <h4 className="text-xs font-bold text-bdc-yellow uppercase tracking-wider mb-2">
              Tata Cara Presensi Barcode
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
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

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-bdc-midnight">
              Histori Kehadiran Mahasiswa
            </h2>
            <p className="text-xs text-slate-500">
              Catatan lengkap log scan barcode dan token kuliah yang terverifikasi
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Total {attendances.length} Rekaman
          </span>
        </div>

        {attendances.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <QrCode className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">Belum ada riwayat kehadiran tercatat.</p>
            <p className="text-xs text-slate-400 mt-1">Lakukan scan barcode saat sesi dibuka oleh pemateri.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Waktu Pindai</th>
                  <th className="py-3 px-4">Nama Sesi Pertemuan</th>
                  <th className="py-3 px-4">Metode Validasi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Poin XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
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
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {formattedDate} {formattedTime} WIB
                      </td>
                      <td className="py-3.5 px-4 font-bold text-bdc-midnight">
                        {record.session_title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                          {record.method === "qr_scanner" ? "Optical QR Scanner" : "Token Manual"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Tervalidasi Hadir
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-bdc-gold">
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
