// Runs real session actions/store with isolated auth, cache and database boundaries.
// No environment files or production services are accessed.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

function loadTs(filename, mocks = {}) {
  const exports = {};
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, {
    exports,
    require: (name) => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name.startsWith(".")) return loadTs(path.resolve(path.dirname(filename), `${name}.ts`), mocks);
      throw new Error(`Unexpected dependency: ${name}`);
    },
    Date,
    process: { env: { NODE_ENV: "production" } },
    console: { ...console, warn() {} },
  }, { filename });
  return exports;
}

function setup(mode = "success", role = "admin") {
  const store = loadTs(path.resolve("src/lib/data/store.ts"));
  let row = {
    id: "session-regression",
    course_id: "ACT-01", course_title: "Bisnis", title: "Pertemuan",
    instructor: "Mentor", meet_url: "https://meet.google.com/test",
    qr_token: "BDC-TEST", status: "live",
    scheduled_at: new Date(Date.now() - 3600000).toISOString(),
    expires_at: new Date(Date.now() + 3600000).toISOString(),
  };
  const revalidated = [];
  const hydrateFromDb = async () => store.bdcStore.hydrate({ sessions: [{ ...row }] });
  const client = {
    from(table) {
      assert.equal(table, "meet_sessions");
      return {
        update(updates) {
          const query = {
            eq(column, value) {
              assert.equal(column, "id");
              assert.equal(value, row.id);
              return query;
            },
            select() { return query; },
            single() { return query; },
            then(resolve, reject) {
              if (mode === "throw") return Promise.reject(new Error("Network down")).then(resolve, reject);
              if (mode === "error") return Promise.resolve({
                data: null, error: { code: "42501", message: "Permission denied" },
              }).then(resolve, reject);
              if (mode === "missing") return Promise.resolve({
                data: null, error: null,
              }).then(resolve, reject);
              // Cache must still reflect persisted data until the write succeeds.
              assert.equal(store.bdcStore.getSessionById(row.id).expires_at, row.expires_at);
              row = { ...row, ...updates };
              return Promise.resolve({ data: { ...row }, error: null }).then(resolve, reject);
            },
          };
          return query;
        },
      };
    },
  };
  const actions = loadTs(path.resolve("src/lib/actions/sessions.ts"), {
    "next/cache": { revalidatePath: (route) => revalidated.push(route) },
    "./auth": { getCurrentUser: async () => ({ role }) },
    "../data/store": store,
    "../data/db": { hydrateFromDb },
    "../supabase/admin": { createAdminClient: () => mode === "unconfigured" ? null : client },
  });
  return { actions, store: store.bdcStore, revalidated, row: () => row };
}

test("failed end-session write never reports completed then returns to live after refresh", async () => {
  const env = setup("error");
  const result = await env.actions.adminEndSessionNowAction(env.row().id);
  assert.equal(result.success, false, "A rejected database write must not report success");
  assert.equal(env.store.getSessionById(env.row().id).status, "live");
  assert.equal(result.session, undefined);
  assert.equal(env.revalidated.length, 0);
});

for (const mode of ["throw", "missing", "unconfigured"]) {
  test(`end-session does not claim success when storage is ${mode}`, async () => {
    const env = setup(mode);
    const result = await env.actions.adminEndSessionNowAction(env.row().id);
    assert.equal(result.success, false);
    assert.equal(env.store.getSessionById(env.row().id).status, "live");
    assert.equal(env.revalidated.length, 0);
  });
}

test("ended session remains completed after repeated database refreshes", async () => {
  const env = setup();
  const result = await env.actions.adminEndSessionNowAction(env.row().id);
  assert.equal(result.success, true);
  assert.equal(result.session.status, "completed");
  assert.equal(env.row().status, "completed");
  assert.ok(new Date(env.row().expires_at).getTime() <= Date.now());
  for (let i = 0; i < 3; i++) {
    const sessions = await env.actions.getAllMeetSessionsAction();
    assert.equal(sessions[0].status, "completed");
    assert.equal(await env.actions.getLiveMeetSessionAction(), null);
  }
  assert.ok(env.revalidated.includes("/attendance"));
  assert.ok(env.revalidated.includes("/admin/sessions"));
});

test("an ended session can only become live again via an explicit start", async () => {
  const env = setup();
  await env.actions.adminEndSessionNowAction(env.row().id);
  const result = await env.actions.adminStartSessionNowAction(env.row().id);
  assert.equal(result.success, true);
  assert.equal(result.session.status, "live");
  assert.equal(
    new Date(env.row().expires_at) - new Date(env.row().scheduled_at),
    3 * 3600000,
  );
});

test("learner cannot change a session", async () => {
  const env = setup("success", "learner");
  const result = await env.actions.adminEndSessionNowAction(env.row().id);
  assert.equal(result.success, false);
  assert.equal(env.row().status, "live");
  assert.equal(env.revalidated.length, 0);
});
