import { bdcStore } from "../src/lib/data/store";
import { MeetSession } from "../src/lib/types/database";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

export async function runTestCycle(cycleNumber: number) {
  console.log(`\n======================================================`);
  console.log(`🚀 MEMULAI VERIFIKASI SIKLUS #${cycleNumber}`);
  console.log(`======================================================\n`);

  // -----------------------------------------------------------------
  // 1. TEST FITUR HAPUS SESI PERTEMUAN (DELETE SESI)
  // -----------------------------------------------------------------
  console.log(`[TEST 1] Hapus Sesi Pertemuan (Delete Session)...`);
  const testSession = bdcStore.setMeetSession({
    title: `Sesi Salah Ketik Siklus ${cycleNumber}`,
    course_title: "Ngoding Bareng Web App",
    instructor: "Dr. Evelyn Vance",
    meet_url: "https://meet.google.com/test-salah-ketik",
    qr_token: `BDC-TEST-TYPO-${cycleNumber}`,
    status: "scheduled",
  });
  assert(!!testSession.id, "Sesi salah ketik berhasil dibuat");
  const foundBefore = bdcStore.getSessionById(testSession.id);
  assert(foundBefore !== null, "Sesi ditemukan di pangkalan data store");

  const deleteSuccess = bdcStore.deleteMeetSession(testSession.id);
  assert(deleteSuccess === true, "deleteMeetSession mengembalikan true");

  const foundAfter = bdcStore.getSessionById(testSession.id);
  assert(foundAfter === null, "Sesi telah terhapus permanen dari store");

  // -----------------------------------------------------------------
  // 2. TEST FITUR BANK SOAL (TAMBAH & HAPUS BUTIR SOAL)
  // -----------------------------------------------------------------
  console.log(`\n[TEST 2] Tambah & Hapus Butir Soal Evaluasi...`);
  const initialQCount = bdcStore.getAllQuestions().length;

  const newQuestion = bdcStore.addQuizQuestion({
    quiz_id: "e2b4f9d0-1234-5678-90ab-cdef12345678",
    question_text: `Apa protokol enkripsi default untuk koneksi web aman (Siklus ${cycleNumber})?`,
    options: [
      { id: "A", text: "HTTP" },
      { id: "B", text: "HTTPS / TLS 1.3" },
      { id: "C", text: "FTP" },
      { id: "D", text: "Telnet" },
    ],
    correct_option: "B",
    weight: 2.0,
    explanation: "HTTPS mengamankan komunikasi data melalui protokol TLS.",
    order_index: initialQCount + 1,
  });
  assert(!!newQuestion.id, "Butir soal baru berhasil ditambahkan dengan ID unik");
  assert(bdcStore.getAllQuestions().length === initialQCount + 1, "Total butir soal bertambah 1");

  const quiz = bdcStore.getQuiz("e2b4f9d0-1234-5678-90ab-cdef12345678");
  assert(quiz?.total_questions === initialQCount + 1, "Total questions pada kuis ter-sinkronisasi");

  const deletedQ = bdcStore.deleteQuizQuestion(newQuestion.id);
  assert(deletedQ === true, "deleteQuizQuestion mengembalikan true");
  assert(bdcStore.getAllQuestions().length === initialQCount, "Total butir soal kembali normal setelah dihapus");

  // -----------------------------------------------------------------
  // 3. TEST FITUR ABSENSI QR & CERDAS FILTER
  // -----------------------------------------------------------------
  console.log(`\n[TEST 3] Presensi QR Cerdas & Validasi Status...`);
  const student = bdcStore.getProfileByNimOrEmail("245720024");
  assert(student !== null, "Profil mahasiswa Arrafi ditemukan");

  // Buat sesi live untuk uji scan
  const liveSess = bdcStore.setMeetSession({
    title: `Sesi Kuliah Live Siklus ${cycleNumber}`,
    course_title: "Ngoding Bareng Web App",
    instructor: "Dr. Evelyn Vance",
    meet_url: "https://meet.google.com/bdc-live",
    qr_token: `BDC-QR-LIVE-${cycleNumber}-${Date.now()}`,
    status: "live",
  });
  assert(liveSess.status === "live", "Sesi live aktif disiapkan");

  // Test scan dengan token mentah
  const scanResult1 = bdcStore.recordAttendance(student!.id, liveSess.qr_token, "qr_scanner");
  assert(scanResult1.success === true, "Presensi scan QR token mentah berhasil");

  // Test double scan ditolak
  const scanResultDup = bdcStore.recordAttendance(student!.id, liveSess.qr_token, "qr_scanner");
  assert(scanResultDup.success === false, "Presensi ganda pada sesi yang sama berhasil dicegah");

  // Buat sesi kedua untuk uji scan dari format full URL (pakai user berbeda agar tidak conflik duplicate)
  const student2 = bdcStore.getProfileByNimOrEmail("nurul.layli25@students.utdi.ac.id")
    ?? bdcStore.registerProfile({
      id: `usr-url-scan-${cycleNumber}`,
      nim_id: `URL-TEST-${cycleNumber}`,
      full_name: `Tester URL Siklus ${cycleNumber}`,
      email: `tester.url${cycleNumber}@students.utdi.ac.id`,
      role: "learner",
      role_title: "Junior Web Developer Cohort",
      division: "Academic College Community",
      period: "2026/2027",
      location: "Yogyakarta",
      avatar_url: null,
      password: "testpassword",
      score: 0.0,
      completed_modules: 0,
      total_hours: 0.0,
      points: 0,
      attendance_rate: 0,
      total_attendances: 0,
      total_sessions: 8,
    });
  const liveSess2Token = `BDC-QR-URL-${cycleNumber}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const liveSess2 = bdcStore.setMeetSession({
    title: `Sesi Kuliah Live URL Siklus ${cycleNumber}`,
    course_title: "Ngoding Bareng Web App",
    instructor: "Dr. Evelyn Vance",
    meet_url: "https://meet.google.com/bdc-live-url",
    qr_token: liveSess2Token,
    status: "live",
  });
  const urlScan = `https://bdcutdi.vercel.app/attendance?token=${liveSess2.qr_token}`;
  const scanResult2 = bdcStore.recordAttendance(student2.id, urlScan, "qr_scanner");
  if (!scanResult2.success) {
    console.error("DEBUG scanResult2 error:", scanResult2.error);
  }
  assert(scanResult2.success === true, "Presensi dengan QR format Full URL berhasil diekstrak");

  // Uji penolakan presensi sesi scheduled
  const schedSess = bdcStore.setMeetSession({
    title: "Sesi Terjadwal Belum Buka",
    course_title: "Ngoding Bareng Web App",
    instructor: "Dr. Evelyn Vance",
    meet_url: "https://meet.google.com/sched",
    qr_token: `BDC-SCHED-${Date.now()}`,
    status: "scheduled",
  });
  const scanSched = bdcStore.recordAttendance(student!.id, schedSess.qr_token, "token_code");
  assert(scanSched.success === false && (scanSched.error?.includes("Terjadwal") ?? false), "Sesi scheduled ditolak dengan pesan yang jelas");

  // -----------------------------------------------------------------
  // 4. TEST FITUR PENDAFTARAN AKUN MAHASISWA BARU (REGISTER)
  // -----------------------------------------------------------------
  console.log(`\n[TEST 4] Pendaftaran Mahasiswa Baru...`);
  const testNim = `2457299${cycleNumber}`;
  const testEmail = `mhs.baru${cycleNumber}@students.utdi.ac.id`;

  const newStudent = bdcStore.registerProfile({
    id: `usr-reg-${cycleNumber}`,
    nim_id: testNim,
    full_name: `Mahasiswa Baru Siklus ${cycleNumber}`,
    email: testEmail,
    role: "learner",
    role_title: "Junior Web Developer Cohort",
    division: "Academic College Community",
    period: "2026/2027",
    location: "Yogyakarta",
    avatar_url: null,
    password: "secretPassword123",
    score: 0.0,
    completed_modules: 0,
    total_hours: 0.0,
    points: 100,
    attendance_rate: 0,
    total_attendances: 0,
    total_sessions: 8,
  });

  assert(newStudent.id === `usr-reg-${cycleNumber}`, "Akun mahasiswa baru terdaftar");
  const foundByNim = bdcStore.getProfileByNimOrEmail(testNim);
  assert(foundByNim?.email === testEmail, "Akun mahasiswa baru dapat dicari via NIM");
  const foundByEmail = bdcStore.getProfileByNimOrEmail(testEmail);
  assert(foundByEmail?.nim_id === testNim, "Akun mahasiswa baru dapat dicari via Email Kampus");

  console.log(`\n✅ VERIFIKASI SIKLUS #${cycleNumber} LULUS 100% TANPA KESALAHAN!`);
}

async function main() {
  console.log("=====================================================");
  console.log("MEMULAI PROSEDUR VERIFIKASI GANDA (2x TEST VERIFICATION)");
  console.log("=====================================================");

  // VERIFIKASI 1
  await runTestCycle(1);

  // VERIFIKASI 2
  await runTestCycle(2);

  console.log("\n=====================================================");
  console.log("🎉 SEMUA PENGUJIAN 2x VERIFIKASI SELESAI & LULUS SEMPURNA!");
  console.log("=====================================================\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
