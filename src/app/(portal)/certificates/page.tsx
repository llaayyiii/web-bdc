import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth";
import { bdcStore } from "@/lib/data/store";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-bdc-midnight tracking-tight">
          Sertifikasi &amp; Transkrip Kelulusan
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kredensial akademik sah dan transkrip modul kompetensi resmi — UTDI Yogyakarta
        </p>
      </div>

      {/* Auto-Unlock Criteria Progress Bar / Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-bdc-midnight">
              Prasyarat Kelulusan &amp; Penerbitan Sertifikat
            </h3>
            <p className="text-xs text-slate-500">
              Sertifikat diterbitkan otomatis oleh sistem apabila 3 kriteria standar dipenuhi
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
              allCriteriaMet
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-amber-100 text-amber-800 border border-amber-200"
            }`}
          >
            {allCriteriaMet ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kriteria Lengkap (Eligible)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Belum Memenuhi Seluruh Syarat</span>
              </>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Requirement 1: Attendance */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                1. Presensi Barcode
              </span>
              <span className="text-xs font-bold text-bdc-midnight">
                {attendanceRate}% <span className="text-slate-400 font-normal">(Min. 80%)</span>
              </span>
            </div>
            {isAttendanceEligible ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
          </div>

          {/* Requirement 2: Exam */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                2. Ujian Mandiri
              </span>
              <span className="text-xs font-bold text-bdc-midnight">
                {examScore} Pts <span className="text-slate-400 font-normal">(Min. 75)</span>
              </span>
            </div>
            {isExamEligible ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
          </div>

          {/* Requirement 3: Assignment */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                3. Tugas Dinilai
              </span>
              <span className="text-xs font-bold text-bdc-midnight">
                {gradedAssignments.length} Tugas <span className="text-slate-400 font-normal">(Min. 1)</span>
              </span>
            </div>
            {isAssignmentEligible ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
          </div>
        </div>
      </div>

      {!cert || cert.is_locked ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-bdc-midnight">Sertifikat Masih Terkunci</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Selesaikan seluruh sesi presensi barcode (min. 80%), ikuti evaluasi ujian, dan kumpulkan tugas proyek untuk membuka sertifikat resmi.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/attendance"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bdc-navy text-white text-xs font-bold"
            >
              <span>Presensi Barcode</span>
            </Link>
            <Link
              href="/assignments"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bdc-blue text-white text-xs font-bold"
            >
              <span>Kumpulkan Tugas</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Certificate Card (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-bdc-gold border border-amber-200">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Kredensial Resmi Sah
                    </span>
                    <h2 className="text-base font-extrabold text-bdc-midnight">
                      Sertifikat Kelulusan &amp; Kompetensi
                    </h2>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {cert.completion_status}
                </span>
              </div>

              {/* Certificate Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-bdc-navy">{cert.program_title}</h3>
                <p className="text-xs text-slate-500">
                  Diterbitkan untuk <strong>{cert.recipient_name}</strong> (NIM:{" "}
                  <span className="font-mono">{cert.nim_id}</span>) atas penyelesaian{" "}
                  {cert.total_hours} Jam Pelatihan Akademik.
                </p>
              </div>

              {/* Metadata Badge Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-bdc-surface border border-slate-200/70 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                    No. Sertifikat
                  </span>
                  <span className="font-mono font-bold text-bdc-midnight text-[11px] truncate block">
                    {cert.certificate_number}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                    No. Transkrip
                  </span>
                  <span className="font-mono font-bold text-bdc-blue text-[11px] truncate block">
                    {cert.transcript_number}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                    Tanggal Terbit
                  </span>
                  <span className="font-bold text-bdc-midnight block">{cert.issue_date}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <Link
                href={`/certificates/${cert.id}`}
                className="px-4 py-2.5 rounded-xl bg-bdc-midnight hover:bg-bdc-navy text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-bdc-yellow" />
                <span>Pratinjau Digital</span>
              </Link>

              <Link
                href={`/certificates/${cert.id}/print`}
                className="px-4 py-2.5 rounded-xl bg-bdc-blue hover:bg-bdc-navy text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Versi A4 / Unduh PDF</span>
              </Link>

              <Link
                href={`/verify?cert=${encodeURIComponent(cert.certificate_number)}`}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tautan Verifikasi</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Informasi Penandatangan
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Penandatangan I:
                  </span>
                  <strong className="text-bdc-midnight block">{cert.signatory_1_name}</strong>
                  <span className="text-[11px] text-slate-500">
                    {cert.signatory_1_role} UTDI, {cert.location}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-bdc-surface border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Penandatangan II:
                  </span>
                  <strong className="text-bdc-midnight block">{cert.signatory_2_name}</strong>
                  <span className="text-[11px] text-slate-500">{cert.signatory_2_role}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Dokumen sah terdaftar resmi di pangkalan data BDC UTDI.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
