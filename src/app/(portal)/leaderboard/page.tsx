import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import {
  Trophy,
  Medal,
  Award,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-bdc-navy text-bdc-yellow mb-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Papan Peringkat Keaktifan BDC</span>
          </div>
          <h1 className="text-2xl font-black text-bdc-midnight tracking-tight">
            Peringkat Berdasarkan Kehadiran &amp; Kontribusi
          </h1>
          <p className="text-xs text-slate-500">
            Dihitung dari rasio presensi barcode, penyelesaian modul, penugasan proyek, dan perolehan XP
          </p>
        </div>

        {/* Current User Quick Badge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-bdc-navy text-bdc-yellow flex items-center justify-center font-black text-sm">
            #{userRank}
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Posisi Anda
            </span>
            <span className="text-xs font-black text-bdc-midnight">
              {user.points || 0} XP <span className="text-slate-400 font-normal">({user.attendance_rate || 0}% Hadir)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Asymmetric Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4 pb-2">
        {/* Top 2: Silver (Left) */}
        {top2 && (
          <div className="order-2 md:order-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden h-72 justify-between">
            <div className="w-full flex justify-between items-center text-slate-400 text-xs font-bold">
              <span className="flex items-center gap-1 font-mono">
                <Medal className="w-4 h-4 text-slate-400" />
                #2 Runner Up
              </span>
              <span className="text-[11px] text-slate-500">{top2.attendance_rate}% Hadir</span>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-700 font-black text-xl flex items-center justify-center shadow-inner">
                {top2.full_name.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-[11px] font-black flex items-center justify-center border-2 border-white">
                2
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-bdc-midnight line-clamp-1">
                {top2.full_name}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">NIM: {top2.nim_id}</p>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{top2.role_title}</p>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Total Akumulasi</span>
              <span className="font-black text-bdc-navy">{top2.points} XP</span>
            </div>
          </div>
        )}

        {/* Top 1: Gold Champion (Center, Elevated) */}
        {top1 && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-[#000741] via-bdc-navy to-[#062A78] text-white rounded-3xl border-2 border-bdc-gold p-7 shadow-2xl flex flex-col items-center text-center relative overflow-hidden h-84 justify-between -mt-2">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-bdc-yellow/15 rounded-full blur-2xl pointer-events-none" />

            <div className="w-full flex justify-between items-center text-bdc-yellow text-xs font-black uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-bdc-yellow" />
                #1 Peringkat Utama
              </span>
              <span className="bg-bdc-gold/20 px-2 py-0.5 rounded text-[10px] text-bdc-yellow border border-bdc-gold/30">
                {top1.attendance_rate}% Hadir
              </span>
            </div>

            <div className="relative mt-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-bdc-gold to-bdc-yellow text-bdc-midnight font-black text-2xl flex items-center justify-center shadow-[0_0_30px_rgba(238,221,85,0.4)] border-4 border-white/20">
                {top1.full_name.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-bdc-gold text-bdc-midnight text-xs font-black flex items-center justify-center border-2 border-bdc-midnight shadow-md">
                1
              </span>
            </div>

            <div className="mt-1">
              <h3 className="font-black text-base text-white tracking-tight line-clamp-1">
                {top1.full_name}
              </h3>
              <p className="text-[11px] font-mono text-bdc-yellow/80">NIM: {top1.nim_id}</p>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{top1.role_title}</p>
            </div>

            <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Skor Sempurna</span>
              <span className="font-black text-bdc-yellow text-sm font-mono">{top1.points} XP</span>
            </div>
          </div>
        )}

        {/* Top 3: Bronze (Right) */}
        {top3 && (
          <div className="order-3 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden h-68 justify-between">
            <div className="w-full flex justify-between items-center text-amber-700 text-xs font-bold">
              <span className="flex items-center gap-1 font-mono">
                <Medal className="w-4 h-4 text-amber-600" />
                #3 Juara Ketiga
              </span>
              <span className="text-[11px] text-slate-500">{top3.attendance_rate}% Hadir</span>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-800 font-black text-xl flex items-center justify-center shadow-inner">
                {top3.full_name.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-bdc-midnight text-[11px] font-black flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-bdc-midnight line-clamp-1">
                {top3.full_name}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">NIM: {top3.nim_id}</p>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{top3.role_title}</p>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Total Akumulasi</span>
              <span className="font-black text-bdc-navy">{top3.points} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-bdc-midnight">
              Klasemen Seluruh Mahasiswa Anggota BDC
            </h2>
            <p className="text-xs text-slate-500">
              Pembaruan live otomatis setiap kali presensi barcode diverifikasi
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {leaderboard.length} Peserta Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4 text-center w-14">Rank</th>
                <th className="py-3 px-4">Nama Mahasiswa &amp; NIM</th>
                <th className="py-3 px-4">Fokus Cohort</th>
                <th className="py-3 px-4 text-center">Tingkat Kehadiran</th>
                <th className="py-3 px-4 text-center">Modul Tuntas</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {leaderboard.map((student, idx) => {
                const rankNum = idx + 1;
                const isCurrentUser = student.id === user.id;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? "bg-bdc-yellow/10 font-bold hover:bg-bdc-yellow/15"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      {rankNum === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-bdc-gold text-bdc-midnight font-black text-xs inline-flex items-center justify-center">
                          1
                        </span>
                      ) : rankNum === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-xs inline-flex items-center justify-center">
                          2
                        </span>
                      ) : rankNum === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-bdc-midnight font-bold text-xs inline-flex items-center justify-center">
                          3
                        </span>
                      ) : (
                        <span className="font-mono text-slate-400 font-semibold">
                          #{rankNum}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bdc-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {student.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-bdc-midnight">
                              {student.full_name}
                            </span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-bdc-navy text-bdc-yellow uppercase">
                                Anda
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-slate-400">
                            NIM: {student.nim_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {student.role_title}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="font-mono font-bold text-bdc-midnight">
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-bdc-navy font-mono">
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
