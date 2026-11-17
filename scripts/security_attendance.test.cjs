const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

function load(role) {
  let reads = 0;
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync("src/lib/actions/attendance.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mocks = {
    "next/cache": {},
    "./auth": { getCurrentUser: async () => role ? { role } : null },
    "../data/store": { bdcStore: { getAttendancesBySession: () => { reads++; return [{ user_id: "dummy" }]; } } },
    "../data/db": { hydrateFromDb: async () => {} },
    "../supabase/admin": {},
  };
  vm.runInNewContext(code, { exports, require: (name) => mocks[name] });
  return { actions: exports, reads: () => reads };
}

test("attendance list is limited to admin and instructor", async () => {
  for (const role of [null, "learner"]) {
    const env = load(role);
    assert.equal((await env.actions.getSessionAttendees("dummy-session")).length, 0);
    assert.equal(env.reads(), 0);
  }
  for (const role of ["admin", "instructor"]) {
    const env = load(role);
    assert.equal((await env.actions.getSessionAttendees("dummy-session")).length, 1);
    assert.equal(env.reads(), 1);
  }
});
