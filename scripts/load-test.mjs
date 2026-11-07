// Load, burst and abuse tests; local production build only
import autocannon from "autocannon";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.env.LOAD_BASE || "http://localhost:3100";
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE)) {
  console.error("Refusing to load test anything but a local server");
  process.exit(2);
}
const which = process.argv[2] || "all";
const results = {};
const pct = (arr, p) => {
  const s = [...arr].sort((a, b) => a - b);
  return s.length ? s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)] : 0;
};

function run(opts) {
  return new Promise((resolve, reject) => {
    const times = [];
    const codes = {};
    const inst = autocannon({ url: BASE, ...opts }, (err, res) => (err ? reject(err) : resolve({ res, times, codes })));
    inst.on("response", (_c, status, _b, ms) => {
      times.push(ms);
      codes[status] = (codes[status] || 0) + 1;
    });
  });
}

// Page load: ramp to 200 connections, then hold for three minutes
async function pages() {
  const paths = ["/", "/services/", "/services/code-rescue/", "/services/ai-automation/", "/insights/", "/insights/what-is-rag/"];
  const requests = paths.map((p) => ({ method: "GET", path: p }));
  const stages = [
    { connections: 50, duration: 10 },
    { connections: 100, duration: 10 },
    { connections: 150, duration: 10 },
    { connections: 200, duration: Number(process.env.LOAD_SECONDS || 180) },
  ];
  const all = { times: [], codes: {}, errors: 0, timeouts: 0, requests: 0, bytes: 0, seconds: 0 };
  for (const s of stages) {
    const { res, times, codes } = await run({ ...s, requests, timeout: 10, pipelining: 1 });
    for (const t of times) all.times.push(t);
    for (const [k, v] of Object.entries(codes)) all.codes[k] = (all.codes[k] || 0) + v;
    all.errors += res.errors + res.non2xx;
    all.timeouts += res.timeouts;
    all.requests += res.requests.total;
    all.bytes += res.throughput.total;
    all.seconds += s.duration;
    console.log(`  ${s.connections} connections, ${s.duration}s: ${res.requests.average} req/s, p95 ${pct(times, 95)} ms, errors ${res.errors + res.non2xx}`);
  }
  const hold = all.times.slice(-Math.floor(all.times.length * 0.85));
  const out = {
    requests: all.requests,
    avgRps: Math.round(all.requests / all.seconds),
    p50: pct(all.times, 50),
    p95: pct(all.times, 95),
    p99: pct(all.times, 99),
    p95AtPeak: pct(hold, 95),
    errors: all.errors,
    timeouts: all.timeouts,
    codes: all.codes,
    mb: Math.round(all.bytes / 1e6),
  };
  out.pass = out.errors === 0 && out.timeouts === 0 && out.p95 < 500;
  return out;
}

const form = (fields) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};
const post = (path, body, headers = {}) => fetch(BASE + path, { method: "POST", body, headers });

// 50 contact submissions in 10 seconds from one address
async function burst() {
  await fetch(BASE + "/api/test/outbox/", { method: "DELETE" });
  const ip = `203.0.113.${(Math.random() * 250) | 0}`;
  const codes = [];
  const t0 = Date.now();
  await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      new Promise((r) => setTimeout(r, i * 200)).then(async () => {
        const res = await post("/api/forms/contact/", form({ name: "Burst", email: `burst${i}@example.com`, details: "load test", t: String(Date.now() - 10_000) }), { "x-forwarded-for": ip });
        codes[i] = res.status;
      }),
    ),
  );
  const seconds = (Date.now() - t0) / 1000;
  const up = (await fetch(BASE + "/")).status;
  const outbox = await (await fetch(BASE + "/api/test/outbox/")).json();
  const first429 = codes.indexOf(429);
  const out = {
    seconds: Number(seconds.toFixed(1)),
    accepted: codes.filter((c) => c === 200).length,
    limited: codes.filter((c) => c === 429).length,
    other: codes.filter((c) => c !== 200 && c !== 429).length,
    first429,
    serverUp: up === 200,
    mockMails: outbox.length,
    realMails: 0,
  };
  out.pass = out.accepted === 5 && out.limited === 45 && first429 === 5 && out.serverUp && out.other === 0;
  return out;
}

// Large payloads, bad files and injection
async function abuse() {
  const ip = () => `198.18.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}`;
  const cases = [];
  const check = async (name, fn, expectCode) => {
    const res = await fn();
    const body = await res.text();
    cases.push({ name, status: res.status, expected: expectCode, ok: res.status === expectCode && !body.includes("<script>") });
  };
  const now = String(Date.now() - 10_000);
  await check("7 MB body", () => post("/api/forms/contact/", "x".repeat(7 * 1024 * 1024), { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": ip() }), 413);
  await check("6 MB CV", () => post("/api/forms/careers/", form({ name: "A", email: "a@example.com", t: now, cv: new File(["%PDF-", new Uint8Array(6 * 1024 * 1024)], "cv.pdf", { type: "application/pdf" }) }), { "x-forwarded-for": ip() }), 413);
  await check("exe as CV", () => post("/api/forms/careers/", form({ name: "A", email: "a@example.com", t: now, cv: new File(["MZ"], "cv.exe", { type: "application/x-msdownload" }) }), { "x-forwarded-for": ip() }), 415);
  await check("fake PDF", () => post("/api/forms/careers/", form({ name: "A", email: "a@example.com", t: now, cv: new File(["<html>"], "cv.pdf", { type: "application/pdf" }) }), { "x-forwarded-for": ip() }), 415);
  await check("JSON body", () => post("/api/forms/contact/", JSON.stringify({ name: "x" }), { "content-type": "application/json", "x-forwarded-for": ip() }), 415);
  await check("broken multipart", () => post("/api/forms/contact/", "--zz\r\nbroken", { "content-type": "multipart/form-data; boundary=zz", "x-forwarded-for": ip() }), 400);
  await check("script injection", () => post("/api/forms/contact/", form({ name: "<script>alert(1)</script>", email: "x@example.com", details: "<img src=x onerror=alert(1)>", t: now }), { "x-forwarded-for": ip() }), 200);
  await check("50 KB field", () => post("/api/forms/contact/", form({ name: "A", email: "x@example.com", details: "a".repeat(50_000), t: now }), { "x-forwarded-for": ip() }), 200);
  await check("bad email", () => post("/api/forms/newsletter/", form({ email: "<script>@x", t: now }), { "x-forwarded-for": ip() }), 400);
  await check("javascript: link", () => post("/api/forms/careers/", form({ name: "A", email: "a@example.com", link: "javascript:alert(1)", t: now }), { "x-forwarded-for": ip() }), 400);
  await check("unknown form", () => post("/api/forms/admin/", form({ a: "1" })), 404);
  const outbox = await (await fetch(BASE + "/api/test/outbox/")).json();
  const leaked = outbox.some((m) => /<script>alert|<img src=x/.test(m.html || ""));
  const up = (await fetch(BASE + "/")).status === 200;
  return { cases, escapedInEmail: !leaked, serverUp: up, pass: cases.every((c) => c.ok) && !leaked && up };
}

if (which === "pages" || which === "all") {
  console.log("page load");
  results.pages = await pages();
  console.log(results.pages);
}
if (which === "burst" || which === "all") {
  console.log("form burst");
  results.burst = await burst();
  console.log(results.burst);
}
if (which === "abuse" || which === "all") {
  console.log("abuse inputs");
  results.abuse = await abuse();
  console.table(results.abuse.cases);
  console.log({ escapedInEmail: results.abuse.escapedInEmail, serverUp: results.abuse.serverUp });
}
mkdirSync("test-results", { recursive: true });
writeFileSync(`test-results/load-${which}.json`, JSON.stringify(results, null, 2));
const ok = Object.values(results).every((r) => r.pass);
console.log(ok ? "OK: load tests passed" : "FAIL: load tests");
process.exit(ok ? 0 : 1);
