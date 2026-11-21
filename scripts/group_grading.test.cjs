// Regression: nilai tugas kelompok dibagikan ke anggota yang tidak submit.
// Store asli dijalankan terisolasi; tidak ada environment/produksi yang disentuh.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const { webcrypto } = require("node:crypto");

function loadTs(filename, mocks = {}) {
  const exports = {};
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(
    source,
    {
      exports,
      require: (name) => {
        if (Object.hasOwn(mocks, name)) return mocks[name];
        if (name.startsWith(".")) return loadTs(path.resolve(path.dirname(filename), `${name}.ts`), mocks);
        throw new Error(`Unexpected dependency: ${name}`);
      },
      Date,
      crypto: webcrypto,
      process: { env: { NODE_ENV: "production" } },
      console: { ...console, warn() {} },
    },
    { filename }
  );
  return exports;
}

function seedStore() {
  return loadTs(path.resolve("src/lib/data/store.ts")).bdcStore;
}

function makeLearner(store, id, nim, name) {
  const template = store.getProfiles().find((p) => p.role === "learner");
  return store.registerProfile({
    ...template,
    id,
    nim_id: nim,
    full_name: name,
    email: `${id}@students.utdi.ac.id`,
    score: 0,
    points: 0,
  });
}

test("nilai kelompok masuk ke anggota tanpa submit, tanpa EXP, tanpa menurunkan nilai lama", () => {
  const store = seedStore();
  const submitterId = "g-submitter";
  const anggotaA = makeLearner(store, "g-a", "GRP-001", "Anggota A");
  const anggotaB = makeLearner(store, "g-b", "GRP-002", "Anggota B");
  makeLearner(store, submitterId, "GRP-000", "Ketua Tim");

  const submitted = store.submitAssignment(
    "assign-01",
    submitterId,
    "https://drive.google.com/file/kelompok",
    "Karya tim"
  );
  assert.equal(submitted.success, true);
  const graded = store.gradeSubmission(submitted.submission.id, 85, "Baik");
  assert.equal(graded.success, true);

  const pointsBeforeA = store.getProfileById(anggotaA.id).points;
  assert.equal(store.getSubmission("assign-01", anggotaA.id), null);

  const sharedA = store.shareGradeToMember(submitted.submission.id, anggotaA.id, 80, "Baik");
  const sharedB = store.shareGradeToMember(submitted.submission.id, anggotaB.id, 90, "Baik");
  assert.equal(sharedA.success, true);
  assert.equal(sharedB.success, true);

  const rowA = store.getSubmission("assign-01", anggotaA.id);
  const rowB = store.getSubmission("assign-01", anggotaB.id);
  assert.equal(rowA.score, 80);
  assert.equal(rowA.status, "graded");
  assert.equal(rowA.submission_url, submitted.submission.submission_url);
  assert.match(rowA.notes, /Ketua Tim/);
  assert.equal(rowB.score, 90);

  // Skor profil mengikuti nilai tugas tertinggi, EXP tidak bertambah.
  assert.equal(store.getProfileById(anggotaA.id).score, 80);
  assert.equal(store.getProfileById(anggotaB.id).score, 90);
  assert.equal(store.getProfileById(anggotaA.id).points, pointsBeforeA);

  // Nilai lama yang lebih tinggi tidak diturunkan.
  const lower = store.shareGradeToMember(submitted.submission.id, anggotaB.id, 70, "Baik");
  assert.equal(lower.skipped, true);
  assert.equal(store.getSubmission("assign-01", anggotaB.id).score, 90);
  assert.equal(store.getProfileById(anggotaB.id).score, 90);

  // Pengumpul tidak boleh menerima "bagian" dirinya sendiri.
  const self = store.shareGradeToMember(submitted.submission.id, submitterId, 50, "Baik");
  assert.equal(self.success, false);
  assert.equal(store.getSubmission("assign-01", submitterId).score, 85);
});

test("pembagian nilai menimpa submission pending milik anggota", () => {
  const store = seedStore();
  makeLearner(store, "g-submitter-2", "GRP-010", "Ketua 2");
  const anggota = makeLearner(store, "g-c", "GRP-011", "Anggota C");

  const submitted = store.submitAssignment("assign-02", "g-submitter-2", "https://drive.google.com/a", "A");
  store.gradeSubmission(submitted.submission.id, 75, "OK");
  const own = store.submitAssignment("assign-02", anggota.id, "https://drive.google.com/own", "Catatan saya");

  const shared = store.shareGradeToMember(submitted.submission.id, anggota.id, 75, "OK");
  assert.equal(shared.success, true);
  const row = store.getSubmission("assign-02", anggota.id);
  assert.equal(row.id, own.submission.id, "id submission lama dipakai ulang, bukan duplikat");
  assert.equal(row.score, 75);
  assert.equal(row.status, "graded");
  assert.equal(row.submission_url, submitted.submission.submission_url);
  assert.equal(row.notes, "Catatan saya", "catatan milik anggota tetap dipertahankan");
  assert.equal(store.getSubmissions().filter((s) => s.user_id === anggota.id && s.assignment_id === "assign-02").length, 1);
});
