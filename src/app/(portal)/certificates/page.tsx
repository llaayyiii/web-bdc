import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
import { BdcDots } from "@/components/ui/BdcDots";
import {
  Award,
  Printer,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  ArrowRight,
  CalendarCheck,
  FolderGit2,
  AlertCircle,
} from "lucide-react";

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  const cert = user ? bdcStore.getCertificateByUserId(user.id) : null;
  const userSubmissions = user ? bdcStore.getSubmissionsByUser(user.id) : [];

  // Criteria calculations
  const attendanceRate = user?.attendance_rate || 0;
  const isAttendanceEligible = attendanceRate >= 80;

  const examScore = user?.score || 0;
  const isExamEligible = examScore >= 75;

  const gradedAssignments = userSubmissions.filter((s) => s.status === "graded");
  const isAssignmentEligible = gradedAssignments.length >= 1;

  const allCriteriaMet = isAttendanceEligible && isExamEligible && isAssignmentEligible;

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header (GDGoC dash-intro style) */}
      <div className="space-y-3 pb-4 border-b border-[#d9dfd7]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-bdc-blue uppercase tracking-widest">
                [ 06 // KREDENSIAL AKADEMIK RESMI ]
              </span>
              <BdcDots size="sm" />
            </div>

            <h1 className="font-pixel text-4xl sm:text-5xl text-bdc-midnight tracking-tight">
              Sertifikat &amp; Transkrip
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Kredensial akademik sah dan transkrip modul kompetensi resmi dari Business Dev Club — Universitas Teknologi Digital Indonesia (UTDI), Yogyakarta.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Auto-Unlock Criteria Card */}
      <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 shadow-retro space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d9dfd7]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                Prasyarat Kelulusan &amp; Penerbitan Sertifikat
              </h3>
              <BdcDots size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Sertifikat diterbitkan otomatis oleh sistem apabila 3 kriteria standar dipenuhi
            </p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-1.5 border shadow-retro-sm self-start sm:self-auto ${
              allCriteriaMet
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : "bg-amber-100 text-amber-800 border-amber-300"
            }`}
          >
            {allCriteriaMet ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kriteria Lengkap (Eligible)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Belum Memenuhi Seluruh Syarat</span>
              </>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Requirement 1: Attendance */}
          <div className="p-4 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-[inset_0_3px_0_#095BAF] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                1. Presensi Barcode
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-pixel text-2xl text-bdc-midnight">{attendanceRate}%</span>
                <span className="font-mono text-[10px] text-slate-500">(Min. 80%)</span>
              </div>
            </div>
            {isAttendanceEligible ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-500" />
            )}
          </div>

          {/* Requirement 2: Exam */}
          <div className="p-4 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-[inset_0_3px_0_#34A853] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                2. Ujian Mandiri
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-pixel text-2xl text-bdc-midnight">{examScore} Pts</span>
                <span className="font-mono text-[10px] text-slate-500">(Min. 75)</span>
              </div>
            </div>
            {isExamEligible ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-500" />
            )}
          </div>

          {/* Requirement 3: Assignment */}
          <div className="p-4 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-[inset_0_3px_0_#E9AD17] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block">
                3. Tugas Dinilai
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-pixel text-2xl text-bdc-midnight">{gradedAssignments.length} Tugas</span>
                <span className="font-mono text-[10px] text-slate-500">(Min. 1)</span>
              </div>
            </div>
            {isAssignmentEligible ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-500" />
            )}
          </div>
        </div>
      </div>

      {!cert || cert.is_locked ? (
        <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-8 sm:p-12 text-center space-y-4 shadow-retro">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF0F0] text-slate-500 border border-slate-300 flex items-center justify-center mx-auto shadow-retro-sm">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-space text-lg font-bold text-bdc-midnight">Sertifikat Masih Terkunci</h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto font-sans leading-relaxed">
            Selesaikan seluruh sesi presensi barcode (min. 80%), ikuti evaluasi ujian mandiri, dan kumpulkan tugas proyek untuk membuka sertifikat resmi.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/attendance"
              className="retro-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bdc-navy text-white text-xs font-bold shadow-retro-sm"
            >
              <span>Presensi Barcode</span>
            </Link>
            <Link
              href="/assignments"
              className="retro-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bdc-blue text-white text-xs font-bold shadow-retro-sm"
            >
              <span>Kumpulkan Tugas</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Certificate Card (2 Cols) */}
          <div className="lg:col-span-2 bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 sm:p-8 shadow-retro flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d9dfd7] gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-bdc-gold border border-amber-300 flex items-center justify-center shadow-retro-sm">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      [ KREDENSIAL RESMI SAH ]
                    </span>
                    <h2 className="font-space text-base sm:text-lg font-bold text-bdc-midnight">
                      Sertifikat Kelulusan &amp; Kompetensi
                    </h2>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-retro-sm self-start sm:self-auto">
                  {cert.completion_status}
                </span>
              </div>

              {/* Certificate Details */}
              <div className="space-y-2">
                <h3 className="font-space text-lg font-bold text-bdc-navy">{cert.program_title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Diterbitkan untuk <strong>{cert.recipient_name}</strong> (NIM:{" "}
                  <span className="font-mono font-bold text-bdc-midnight">{cert.nim_id}</span>) atas penyelesaian{" "}
                  <strong>{cert.total_hours} Jam Pelatihan Akademik</strong>.
                </p>
              </div>

              {/* Metadata Badge Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#EFF0F0] border border-slate-300 text-xs shadow-retro-sm">
                <div>
                  <span className="font-mono text-[10px] text-slate-500 block font-bold uppercase">
                    No. Sertifikat
                  </span>
                  <span className="font-mono font-bold text-bdc-midnight text-[11px] truncate block mt-0.5">
                    {cert.certificate_number}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-slate-500 block font-bold uppercase">
                    No. Transkrip
                  </span>
                  <span className="font-mono font-bold text-bdc-blue text-[11px] truncate block mt-0.5">
                    {cert.transcript_number}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-slate-500 block font-bold uppercase">
                    Tanggal Terbit
                  </span>
                  <span className="font-mono font-bold text-bdc-midnight block mt-0.5">{cert.issue_date}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#d9dfd7] flex flex-wrap items-center gap-3">
              <Link
                href={`/certificates/${cert.id}`}
                className="retro-btn px-4 py-2.5 rounded-xl bg-bdc-midnight hover:bg-bdc-navy text-white text-xs font-bold transition-all shadow-retro-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-bdc-yellow" />
                <span>Pratinjau Digital</span>
              </Link>

              <Link
                href={`/certificates/${cert.id}/print`}
                className="retro-btn px-4 py-2.5 rounded-xl bg-bdc-blue hover:bg-bdc-navy text-white text-xs font-bold transition-all shadow-retro-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Versi A4 / PDF</span>
              </Link>

              <Link
                href={`/verify?cert=${encodeURIComponent(cert.certificate_number)}`}
                className="retro-btn px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 hover:bg-[#EFF0F0] text-xs font-bold transition-all flex items-center gap-2 shadow-retro-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tautan Verifikasi</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="bg-[#fffefa] rounded-3xl border border-[#d9dfd7] p-6 shadow-retro flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                  [ INFORMASI PENANDATANGAN ]
                </h3>
                <BdcDots size="sm" />
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-retro-sm">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block uppercase">
                    Penandatangan I:
                  </span>
                  <strong className="text-bdc-midnight block font-space text-sm mt-0.5">{cert.signatory_1_name}</strong>
                  <span className="text-[11px] text-slate-600 block">
                    {cert.signatory_1_role} UTDI, {cert.location}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EFF0F0] border border-slate-300 shadow-retro-sm">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block uppercase">
                    Penandatangan II:
                  </span>
                  <strong className="text-bdc-midnight block font-space text-sm mt-0.5">{cert.signatory_2_name}</strong>
                  <span className="text-[11px] text-slate-600 block">{cert.signatory_2_role}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-semibold flex items-center gap-2 shadow-retro-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Dokumen sah terdaftar resmi di pangkalan data BDC UTDI.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
