const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const net = require("node:net");

function setup(resolveHost, responses = []) {
  const calls = [];
  const exports = {};
  const mocks = {
    "node:dns/promises": { lookup: resolveHost },
    "node:net": net,
    "node:http": { request },
    "node:https": { request },
  };
  function request(url, options, done) {
    calls.push({ url: url.toString(), options });
    const data = responses.shift();
    return {
      on() { return this; },
      end() {
        done({
          statusCode: data.status,
          headers: data.headers || {},
          destroy() {},
          async *[Symbol.asyncIterator]() { yield Buffer.from(data.body || ""); },
        });
      },
    };
  }
  const code = ts.transpileModule(fs.readFileSync("src/lib/security/public-html.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports, require: (name) => mocks[name], URL, AbortSignal, Buffer });
  return { actions: exports, calls };
}

test("blocks private and special addresses and pins public DNS results", async () => {
  const env = setup(async () => [{ address: "8.8.8.8" }], [{ status: 200, body: "<title>dummy</title>" }]);
  for (const address of ["127.0.0.1", "10.0.0.1", "169.254.169.254", "192.168.1.1", "100.64.0.1", "::1"]) {
    assert.equal(env.actions.isPublicIpv4(address), false);
  }
  const result = await env.actions.fetchPublicHtml("https://example.test/");
  assert.equal(result.html, "<title>dummy</title>");
  env.calls[0].options.lookup("example.test", {}, (err, address) => {
    assert.equal(err, null);
    assert.equal(address, "8.8.8.8");
  });
});

test("rejects redirects to a private address before making the next request", async () => {
  const env = setup(async (host) => [{ address: host === "public.test" ? "8.8.8.8" : "127.0.0.1" }], [
    { status: 302, headers: { location: "http://internal.test/" } },
  ]);
  await assert.rejects(env.actions.fetchPublicHtml("https://public.test/"));
  assert.equal(env.calls.length, 1);
});

test("rejects mixed public/private DNS answers and credentialed URLs", async () => {
  const env = setup(async () => [{ address: "8.8.8.8" }, { address: "10.0.0.1" }]);
  await assert.rejects(env.actions.fetchPublicHtml("https://example.test/"));
  await assert.rejects(env.actions.fetchPublicHtml("https://user:pass@example.test/"));
  assert.equal(env.calls.length, 0);
});

test("supports public redirects and limits returned content", async () => {
  const env = setup(async () => [{ address: "8.8.4.4" }], [
    { status: 302, headers: { location: "https://other.test/page" } },
    { status: 200, body: "x".repeat(600000) },
  ]);
  const result = await env.actions.fetchPublicHtml("https://public.test/");
  assert.equal(result.url, "https://other.test/page");
  assert.equal(result.html.length, 512 * 1024);
  assert.equal(env.calls.length, 2);
});
