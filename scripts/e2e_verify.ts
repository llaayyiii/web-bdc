import { bdcStore } from "../src/lib/data/store";

export async function runE2ETests(iteration: number) {
  console.log(`\n======================================================`);
  console.log(`[E2E SUITE - VERIFIKASI KE-${iteration}] MEMULAI PENGUJIAN LENGKAP`);
  console.log(`======================================================`);

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, extraInfo: string = "") {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  [PASS] Test ${totalTests}: ${testName} ${extraInfo ? `(${extraInfo})` : ""}`);
    } else {
      console.error(`  [FAIL] Test ${totalTests}: ${testName} ${extraInfo ? `(${extraInfo})` : ""}`);
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  // 1. Verifikasi Data Store Bersih
  console.log("\n--- FASE 1: Verifikasi Integritas Data Store & Database ---");
  const quiz = bdcStore.getQuiz("quiz-bdc-eval-2026");
  assert(quiz === null, "Bank Soal Kuis Utama harus kosong (null)");

  const questions = bdcStore.getQuizQuestions("quiz-bdc-eval-2026");
  assert(questions.length === 0, "Daftar butir soal harus 0 butir");

  const sessions = bdcStore.getSessions();
  assert(sessions.length === 0, "Daftar sesi pertemuan harus 0 sesi");

  const liveSession = bdcStore.getLiveSession();
  assert(liveSession === null, "Tidak boleh ada live session aktif yang menggantung");

  const attendances = bdcStore.getAttendances();
  assert(attendances.length === 0, "Catatan presensi harus 0");

  const profiles = bdcStore.getProfiles();
  assert(profiles.length >= 2, "Profil resmi terdaftar di sistem", `Jumlah: ${profiles.length}`);

  const adminUser = profiles.find((p) => p.email === "nurul.layli25@students.utdi.ac.id");
  assert(adminUser !== undefined && adminUser.role === "admin", "Admin utama Nurul Layli harus aktif dengan role admin");

  const learnerUser = profiles.find((p) => p.email === "arrafi.nur24@students.utdi.ac.id");
  assert(learnerUser !== undefined && learnerUser.role === "learner", "Mahasiswa Arrafi Nur Hafiz harus aktif dengan role learner");

  // 2. Verifikasi Ketiadaan Data Dummy / Siti
  console.log("\n--- FASE 2: Verifikasi Bebas Data Dummy (Zero-Dummy Policy) ---");
  const dummyUser = profiles.find((p) => p.full_name.toLowerCase().includes("siti"));
  assert(dummyUser === undefined, "Tidak boleh ada user dengan nama Siti di database store");

  const budiUser = profiles.find((p) => p.full_name.toLowerCase().includes("budi"));
  assert(budiUser === undefined, "Tidak boleh ada user dengan nama Budi di database store");

  // 3. Verifikasi HTTP Endpoint Publik
  console.log("\n--- FASE 3: Verifikasi HTTP Endpoint Publik ---");
  const baseUrl = "http://localhost:3000";

  const homeRes = await fetch(`${baseUrl}/`);
  assert(homeRes.status === 200, "Landing page GET / harus merespons 200 OK");
  const homeHtml = await homeRes.text();
  assert(!homeHtml.includes("Siti Rahmawati"), "Landing page tidak boleh memuat teks 'Siti Rahmawati'");
  assert(!homeHtml.includes("Demo Akun Instan"), "Landing page tidak boleh memuat 'Demo Akun Instan'");

  const loginRes = await fetch(`${baseUrl}/login`);
  assert(loginRes.status === 200, "Login page GET /login harus merespons 200 OK");
  const loginHtml = await loginRes.text();
  assert(!loginHtml.includes("Demo Akun Instan"), "Halaman login tidak boleh memuat 'Demo Akun Instan'");
  assert(!loginHtml.includes("handleQuickLogin"), "Halaman login tidak boleh memuat bypass script");

  // 4. Verifikasi Kredensial Pengguna Resmi di Store
  console.log("\n--- FASE 4: Verifikasi Kredensial Pengguna Resmi di Store ---");
  const checkAdmin = bdcStore.getProfileByNimOrEmail("nurul.layli25@students.utdi.ac.id");
  assert(checkAdmin !== null && checkAdmin.password === "secretPassword123", "Kredensial Admin Nurul Layli tersimpan valid");

  const checkLearner = bdcStore.getProfileByNimOrEmail("arrafi.nur24@students.utdi.ac.id");
  assert(checkLearner !== null && checkLearner.password === "secretPassword123", "Kredensial Mahasiswa Arrafi Nur Hafiz tersimpan valid");

  const checkInstructor = bdcStore.getProfileByNimOrEmail("evelyn.vance@utdi.ac.id");
  assert(checkInstructor !== null && checkInstructor.password === "secretPassword123", "Kredensial Instruktur Dr. Evelyn Vance tersimpan valid");

  // 5. Verifikasi Proteksi & Aksi Manajemen Akun (Self-Deletion & Modifikasi)
  console.log("\n--- FASE 5: Verifikasi Fitur Manajemen Akun & Proteksi Keamanan ---");
  const tempUserId = `temp-test-${Date.now()}`;
  assert(bdcStore.getProfileById(tempUserId) === null, "Target user non-existent mengembalikan null");

  // Tambahkan user sementara ke store untuk ditest hapus
  (bdcStore as any).profiles.push({
    id: tempUserId,
    nim_id: "999999999",
    full_name: "Akun Pengujian Otomatis",
    email: "temp.testing@students.utdi.ac.id",
    role: "learner",
    role_title: "Temporary Test Learner",
    password: "secretPassword123",
  });
  assert(bdcStore.getProfileById(tempUserId) !== null, "Akun pengujian sementara berhasil dibuat di memory");

  // Hapus user sementara melalui store
  const deleteResult = bdcStore.deleteUser(tempUserId);
  assert(deleteResult === true, "Method deleteUser berhasil menghapus user sasaran");
  assert(bdcStore.getProfileById(tempUserId) === null, "User sementara telah terhapus sempurna dari store");

  // Verifikasi proteksi profil admin tidak terhapus
  const adminStillExists = bdcStore.getProfileById("71c1be75-7e15-407f-80c9-a525202e23da");
  assert(adminStillExists !== null && adminStillExists.role === "admin", "Admin aktif tetap ada dan berstatus admin");

  console.log(`\n======================================================`);
  console.log(`[E2E SUITE - HASIL VERIFIKASI KE-${iteration}]`);
  console.log(`TOTAL PENGUJIAN: ${totalTests} | LULUS: ${passedTests} | GAGAL: 0`);
  console.log(`STATUS: 100% SUKSES DAN MEMENUHI STANDAR PRODUCTION`);
  console.log(`======================================================\n`);
  return { passedTests, totalTests };
}

if (require.main === module) {
  runE2ETests(1)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
