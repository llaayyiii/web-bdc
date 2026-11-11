import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  Trophy,
  Medal,
  Award,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  UserCheck,
} from "lucide-react";

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const leaderboard = bdcStore.getLeaderboard();

  // Find user rank
  const userRankIndex = leaderboard.findIndex((p) => p.id === user.id);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : leaderboard.length + 1;

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  // Average attendance rate
  const avgAttendance = Math.round(
    leaderboard.reduce((acc, curr) => acc + (curr.attendance_rate || 0), 0) / (leaderboard.length || 1)
  );

  return (
    <div className="space-y-8 font-sans">
      {/* 1. INTRO HEADER (GDGoC IPB Papan Skor app-intro design) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 01 // PAPAN SKOR BDC UTDI ]
              </span>
              <BdcDots size="sm" />
            </div>

            <div className="flex items-center gap-3">
              <h1 className="font-pixel text-4xl sm:text-6xl text-bdc-midnight tracking-tight">
                Papan Skor
              </h1>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-bdc-gold border border-amber-300 flex items-center justify-center shadow-retro-sm">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Peringkat mahasiswa Business Dev Club UTDI sepanjang masa dan per sesi: dihitung otomatis
              dari validasi presensi barcode (+100 XP), pengumpulan tugas proyek (+150 XP), dan evaluasi kuis mandiri.
            </p>
          </div>

          {/* User Rank Sticky Summary Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#d9dfd7] shadow-retro-sm flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 font-pixel bg-[#095BAF] text-white flex items-center justify-center text-sm font-black rounded-xl shadow-retro-sm">
              #{userRank}
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Peringkatmu Sendiri
              </span>
              <span className="text-xs font-bold text-bdc-midnight">
                {user.points || 0} XP <span className="text-slate-400 font-normal">({user.attendance_rate || 0}% Hadir)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP 3 STATS CARDS WITH COLORED INSET TOP BARS (GDGoC dash-stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Top 1 Leader (Blue Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#095BAF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Peringkat Teratas (#1)
            </span>
            <Trophy className="w-4 h-4 text-bdc-gold" />
          </div>
          <div className="mt-3">
            <span className="font-space font-extrabold text-base text-bdc-midnight block leading-tight">
              {top1?.full_name || "Siti Rahmawati"}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-pixel text-2xl font-black text-bdc-blue">
                {top1?.points || 1450} XP
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                ({top1?.attendance_rate || 100}% Hadir)
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Attendance Average (Yellow Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#E9AD17] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Rata-Rata Kehadiran Cohort
            </span>
            <CalendarCheck className="w-4 h-4 text-bdc-gold" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl font-black text-bdc-midnight">
                {avgAttendance}%
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">Presensi Barcode</span>
            </div>
            <p className="font-mono text-[11px] text-slate-500 mt-1">
              Batas kelulusan sertifikat minimal 80%
            </p>
          </div>
        </div>

        {/* Card 3: User Status (Green Inset) */}
        <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#d9dfd7] shadow-[inset_0_4px_0_#34A853] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Status Capaian Anda
            </span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-3xl font-black text-emerald-700">
                Posisi #{userRank}
              </span>
              <span className="font-mono text-xs text-slate-500">/ {leaderboard.length}</span>
            </div>
            <p className="font-mono text-[11px] text-slate-500 mt-1">
              {user.attendance_rate && user.attendance_rate >= 80 ? "Syarat sertifikat terpenuhi" : "Tingkatkan presensi barcode"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. ASYMMETRIC TOP 3 PODIUM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-2">
        {/* Top 2: Silver (Left) */}
        {top2 && (
          <div className="order-2 md:order-1 bg-[#fffefa] rounded-2xl border border-slate-300 p-6 shadow-retro-sm flex flex-col items-center text-center justify-between h-72">
            <div className="w-full flex justify-between items-center text-slate-500 text-xs font-mono font-bold">
              <span className="flex items-center gap-1">
                <Medal className="w-4 h-4 text-slate-400" />
                #2 RUNNER UP
              </span>
              <span>{top2.attendance_rate}% Hadir</span>
            </div>

            <div className="relative my-2">
              <div className="w-16 h-16 rounded-xl font-pixel bg-[#e6eddc] border-2 border-slate-300 text-slate-700 text-2xl font-bold flex items-center justify-center shadow-retro-sm">
                {top2.full_name.charAt(0)}
              </div>
              <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-md bg-slate-300 text-slate-800 text-[11px] font-pixel font-bold flex items-center justify-center border border-slate-400">
                2
              </span>
            </div>

            <div>
              <h3 className="font-space font-bold text-sm text-bdc-midnight line-clamp-1">
                {top2.full_name}
              </h3>
              <p className="font-mono text-[10px] text-slate-500">NIM: {top2.nim_id}</p>
              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{top2.role_title}</p>
            </div>

            <div className="w-full pt-3 border-t border-slate-200 font-mono text-xs flex justify-between">
              <span className="text-slate-500">Akumulasi:</span>
              <span className="font-black text-bdc-navy">{top2.points} XP</span>
            </div>
          </div>
        )}

        {/* Top 1: Gold Champion (Center, Elevated) */}
        {top1 && (
          <div className="order-1 md:order-2 bg-bdc-midnight text-white rounded-2xl border-2 border-bdc-midnight p-7 shadow-retro-lg flex flex-col items-center text-center justify-between h-84 -mt-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bdc-blue via-bdc-yellow to-emerald-400" />

            <div className="w-full flex justify-between items-center text-bdc-yellow text-xs font-mono font-black uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-bdc-yellow" />
                #1 JUARA PERTAMA
              </span>
              <span className="bg-bdc-yellow text-bdc-midnight px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                {top1.attendance_rate}% Hadir
              </span>
            </div>

            <div className="relative my-3">
              <div className="w-20 h-20 rounded-2xl font-pixel bg-gradient-to-tr from-bdc-gold to-bdc-yellow text-bdc-midnight text-3xl font-black flex items-center justify-center shadow-retro border-2 border-white/20">
                {top1.full_name.charAt(0)}
              </div>
              <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-md bg-bdc-gold text-bdc-midnight text-xs font-pixel font-bold flex items-center justify-center border border-bdc-midnight shadow-retro-sm">
                1
              </span>
            </div>

            <div>
              <h3 className="font-space font-black text-base text-white tracking-tight line-clamp-1">
                {top1.full_name}
              </h3>
              <p className="font-mono text-[11px] text-bdc-yellow">NIM: {top1.nim_id}</p>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{top1.role_title}</p>
            </div>

            <div className="w-full pt-3 border-t border-white/10 font-mono text-xs flex justify-between">
              <span className="text-slate-300">Skor Tertinggi:</span>
              <span className="font-pixel text-base text-bdc-yellow">{top1.points} XP</span>
            </div>
          </div>
        )}

        {/* Top 3: Bronze (Right) */}
        {top3 && (
          <div className="order-3 bg-[#fffefa] rounded-2xl border border-slate-300 p-6 shadow-retro-sm flex flex-col items-center text-center justify-between h-68">
            <div className="w-full flex justify-between items-center text-amber-800 text-xs font-mono font-bold">
              <span className="flex items-center gap-1">
                <Medal className="w-4 h-4 text-amber-600" />
                #3 JUARA KETIGA
              </span>
              <span>{top3.attendance_rate}% Hadir</span>
            </div>

            <div className="relative my-2">
              <div className="w-16 h-16 rounded-xl font-pixel bg-[#e6eddc] border-2 border-amber-300 text-amber-800 text-2xl font-bold flex items-center justify-center shadow-retro-sm">
                {top3.full_name.charAt(0)}
              </div>
              <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-md bg-amber-400 text-bdc-midnight text-[11px] font-pixel font-bold flex items-center justify-center border border-amber-500">
                3
              </span>
            </div>

            <div>
              <h3 className="font-space font-bold text-sm text-bdc-midnight line-clamp-1">
                {top3.full_name}
              </h3>
              <p className="font-mono text-[10px] text-slate-500">NIM: {top3.nim_id}</p>
              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{top3.role_title}</p>
            </div>

            <div className="w-full pt-3 border-t border-slate-200 font-mono text-xs flex justify-between">
              <span className="text-slate-500">Akumulasi:</span>
              <span className="font-black text-bdc-navy">{top3.points} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. FULL PAPAN SKOR TABLE (Styled like GDGoC IPB dash-table) */}
      <div className="bg-[#fffefa] rounded-2xl border border-[#d9dfd7] shadow-retro-sm p-6 overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-space font-bold text-base text-bdc-midnight">
                Klasemen Lengkap Seluruh Mahasiswa
              </h2>
              <BdcDots size="sm" />
            </div>
            <p className="text-xs text-slate-500">
              Pembaruan live otomatis setiap kali presensi barcode diverifikasi
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            {leaderboard.length} Mahasiswa Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f3ea] text-slate-600 uppercase text-[10px] font-mono font-bold tracking-wider border-y border-[#d9dfd7]">
              <tr>
                <th className="py-3 px-4 text-center w-14">Rank</th>
                <th className="py-3 px-4">Nama Mahasiswa &amp; NIM</th>
                <th className="py-3 px-4">Peminatan Cohort</th>
                <th className="py-3 px-4 text-center">Tingkat Kehadiran</th>
                <th className="py-3 px-4 text-center">Modul Tuntas</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9dfd7] font-medium">
              {leaderboard.map((student, idx) => {
                const rankNum = idx + 1;
                const isCurrentUser = student.id === user.id;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? "bg-[#fff8e6] shadow-[inset_4px_0_0_#095BAF] font-bold"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`w-7 h-7 rounded-lg font-pixel text-xs font-black inline-flex items-center justify-center border ${
                          rankNum === 1
                            ? "bg-bdc-gold text-bdc-midnight border-amber-600 shadow-retro-sm"
                            : rankNum === 2
                            ? "bg-slate-200 text-slate-800 border-slate-300"
                            : rankNum === 3
                            ? "bg-amber-400 text-bdc-midnight border-amber-600"
                            : "font-mono text-slate-500 border-transparent"
                        }`}
                      >
                        {rankNum <= 3 ? rankNum : `#${rankNum}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 font-pixel bg-[#e6eddc] border border-[#c9d7bc] text-bdc-midnight text-xs font-bold flex items-center justify-center shrink-0">
                          {student.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-bdc-midnight">
                              {student.full_name}
                            </span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-bdc-navy text-bdc-yellow uppercase">
                                Anda
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-slate-500">
                            NIM: {student.nim_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {student.role_title}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-bdc-midnight">
                          {student.attendance_rate}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({student.total_attendances || 0}/{student.total_sessions || 8})
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      {student.completed_modules} / 5
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-white border border-slate-300 text-bdc-navy font-mono shadow-retro-sm">
                        <Zap className="w-3.5 h-3.5 text-bdc-gold" />
                        {student.points} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
