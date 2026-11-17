const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

function load(user) {
  let reads = 0;
  let seenVerifyQuery = null;
  const cert = { id: "cert-b", user_id: "user-b" };
  const store = {
    getCertificateById: () => { reads++; return cert; },
    getCertificateByUserId: () => { reads++; return cert; },
    getCertificates: () => { reads++; return [cert]; },
    getCertificateByNimOrNumber: (query) => { reads++; seenVerifyQuery = query; return cert; },
  };
  const mocks = {
    "next/cache": {},
    "./auth": { getCurrentUser: async () => user },
    "../data/store": { bdcStore: store },
    "../data/db": { hydrateFromDb: async () => {} },
    "../supabase/admin": { createAdminClient: () => null },
  };
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync("src/lib/actions/certificates.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports, require: (name) => mocks[name] });
  return { actions: exports, reads: () => reads, verifyQuery: () => seenVerifyQuery };
}

test("certificate lookup enforces owner or manager", async () => {
  for (const user of [null, { id: "user-a", role: "learner" }]) {
    const env = load(user);
    assert.equal(await env.actions.getCertificateByIdAction("cert-b"), null);
    assert.equal(await env.actions.getCertificateByUserIdAction("user-b"), null);
    await assert.rejects(env.actions.getAllCertificatesAction());
  }
  for (const user of [{ id: "user-b", role: "learner" }, { id: "user-a", role: "admin" }]) {
    const env = load(user);
    assert.equal((await env.actions.getCertificateByIdAction("cert-b")).id, "cert-b");
    assert.equal((await env.actions.getCertificateByUserIdAction("user-b")).id, "cert-b");
  }
});

test("public verification strips PostgREST filter syntax from user input", async () => {
  const env = load(null);
  assert.equal((await env.actions.verifyCertificateAction("abc%,)(=")).id, "cert-b");
  assert.equal(env.verifyQuery(), "ABC%");
});
