const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const { webcrypto } = require("node:crypto");

function load(filename, mocks, secret) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, require: (name) => {
      if (!(name in mocks)) throw new Error(`Unexpected dependency: ${name}`);
      return mocks[name];
    },
    crypto: webcrypto, TextEncoder, TextDecoder, btoa, atob, Date, JSON, Uint8Array,
    process: { env: { NODE_ENV: "production", SESSION_SECRET: secret } },
    console,
  });
  return exports;
}

function setup(secret = "dummy-test-secret-01234567890123456789") {
  const jar = new Map();
  const user = {
    id: "dummy-user", nim_id: "12345", full_name: "Dummy",
    email: "dummy@students.utdi.ac.id", role: "learner", password_hash: "dummy-hash",
  };
  let queries = 0;
  const query = {
    select() { return this; }, or() { return this; }, eq() { return this; },
    async maybeSingle() { queries++; return { data: user }; },
  };
  const session = load("src/lib/auth/session.ts", {}, secret);
  const mocks = {
    "next/headers": {
      cookies: async () => ({
        get: (name) => jar.has(name) ? { value: jar.get(name) } : undefined,
        set: (name, value) => jar.set(name, value),
        delete: (name) => jar.delete(name),
      }),
    },
    "next/navigation": {},
    bcryptjs: { default: { compare: async (pw) => pw === "dummy-password" } },
    "../data/store": { bdcStore: { registerProfile() {}, getProfileById() { throw Error("unexpected fallback"); } } },
    "../data/db": { hydrateFromDb: async () => {} },
    "../supabase/admin": { createAdminClient: () => ({ from: () => query }) },
    "../auth/session": session,
  };
  return { actions: load("src/lib/actions/auth.ts", mocks, secret), jar, queries: () => queries };
}

test("login issues a session that verifies against the real auth action", async () => {
  const env = setup();
  const form = new Map([["identifier", "dummy@students.utdi.ac.id"], ["password", "dummy-password"]]);
  assert.equal((await env.actions.loginAction(form)).success, true);
  assert.equal((await env.actions.getCurrentUser()).id, "dummy-user");
  env.jar.set("bdc_session", '{"userId":"dummy-user","role":"admin"}');
  const count = env.queries();
  assert.equal(await env.actions.getCurrentUser(), null);
  assert.equal(env.queries(), count);
});

test("missing session secret fails login and registration verification before writes", async () => {
  const env = setup("");
  const form = new Map([["identifier", "dummy@students.utdi.ac.id"], ["password", "dummy-password"]]);
  assert.equal((await env.actions.loginAction(form)).success, false);
  assert.equal(env.jar.has("bdc_session"), false);
  assert.equal((await env.actions.verifyRegistrationOtpAction("123456")).success, false);
  assert.equal((await env.actions.registerAction(new Map())).success, false);
});
