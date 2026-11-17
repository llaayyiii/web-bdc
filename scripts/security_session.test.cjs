const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const { webcrypto } = require("node:crypto");

function loadSession(secret = "local-test-secret-01234567890123456789") {
  const source = fs.readFileSync("src/lib/auth/session.ts", "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, crypto: webcrypto, TextEncoder, TextDecoder, btoa, atob,
    process: { env: { SESSION_SECRET: secret } }, Date, JSON, Uint8Array,
  });
  return exports;
}

test("signed sessions reject forged, modified, expired and legacy cookies", async () => {
  const { signSession, verifySession } = loadSession();
  const token = await signSession({ userId: "dummy-user", role: "learner" });
  assert.equal((await verifySession(token)).userId, "dummy-user");
  assert.equal(await verifySession('{"userId":"admin","role":"admin"}'), null);
  const [payload, signature] = token.split(".");
  const flipped = (signature[0] === "A" ? "B" : "A") + signature.slice(1);
  assert.equal(await verifySession(`${payload}.${flipped}`), null);
  assert.equal(await loadSession("other-local-secret-01234567890123456789").verifySession(token), null);
  const expired = await signSession({ userId: "dummy-user", role: "learner" }, Date.now() - 1);
  assert.equal(await verifySession(expired), null);
});

test("missing secret fails closed", async () => {
  const { signSession, verifySession } = loadSession("");
  assert.equal(await verifySession("anything.anything"), null);
  await assert.rejects(signSession({ userId: "dummy", role: "learner" }));
});
