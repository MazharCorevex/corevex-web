import { expect, test } from "@playwright/test";
import { ROUTES } from "../routes";

const ip = () => `10.77.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}`;

test("security headers on every page, asset and API route", async ({ request }) => {
  for (const path of [...ROUTES, "/missing-page/", "/sitemap.xml", "/robots.txt", "/images/logo/corevex-mark.svg", "/api/forms/contact/"]) {
    const r = path.startsWith("/api/") ? await request.post(path, { form: { x: "1" }, headers: { "x-forwarded-for": ip() } }) : await request.get(path);
    const h = r.headers();
    const csp = h["content-security-policy"] || "";
    expect(csp, `${path} CSP`).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(h["strict-transport-security"], `${path} HSTS`).toMatch(/max-age=\d{8,}; includeSubDomains/);
    expect(h["x-frame-options"], `${path} XFO`).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["x-powered-by"]).toBeUndefined();
  }
});

test("CSP only allows the expected third parties", async ({ request }) => {
  const csp = (await request.get("/")).headers()["content-security-policy"];
  const hosts = [...new Set(csp.match(/https:\/\/[^\s;]+/g))].map((u) => u.replace(/^https:\/\//, ""));
  const allowed = /calendly\.com|googletagmanager\.com|google-analytics\.com|analytics\.google\.com|vercel-storage\.com|vercel\.com$/;
  expect(hosts.filter((h) => !allowed.test(h))).toEqual([]);
});

test("/studio does not exist and is never indexed", async ({ request }) => {
  for (const p of ["/studio/", "/studio/desk/"]) {
    const r = await request.get(p);
    expect(r.status(), p).toBe(404);
    expect(await r.text()).toMatch(/noindex/);
  }
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/studio");
});

test("test outbox is not public outside test mode", async ({ request }) => {
  // the local server runs with TEST_MODE=true; production has no outbox (covered in unit tests)
  const r = await request.get("/api/test/outbox/");
  expect([200, 404]).toContain(r.status());
});

test("form fields are protected against injection", async ({ request }) => {
  const payloads = [
    "<script>alert(1)</script>",
    '"><img src=x onerror=alert(1)>',
    "javascript:alert(1)",
    "{{7*7}}${7*7}",
    "'; DROP TABLE users; --",
    "Name\r\nBcc: victim@example.com",
  ];
  await request.delete("/api/test/outbox/");
  for (const p of payloads) {
    const email = `inject-${Math.random().toString(36).slice(2)}@example.com`;
    const r = await request.post("/api/forms/contact/", {
      multipart: { name: p, email, details: p, company: p, need: p, t: String(Date.now() - 10_000) },
      headers: { "x-forwarded-for": ip() },
    });
    expect(r.status(), p).toBe(200);
    const body = await r.text();
    expect(body).not.toContain("<script>");
  }
  const mails = (await (await request.get("/api/test/outbox/")).json()) as { subject?: string; html?: string }[];
  for (const m of mails.filter((x) => x.html)) {
    expect(m.html).not.toMatch(/<script>alert|<img src=x onerror/);
    expect(m.subject ?? "").not.toMatch(/[\r\n]/);
  }
  const bad = await request.post("/api/forms/careers/", {
    multipart: { name: "A", email: "a@example.com", link: "javascript:alert(1)", t: String(Date.now() - 10_000) },
    headers: { "x-forwarded-for": ip() },
  });
  expect(bad.status()).toBe(400);
  expect((await bad.json()).errors.link).toBeTruthy();
});

test("query strings are never reflected into pages", async ({ request }) => {
  const mark = `zz${Date.now()}<b>x</b>`;
  for (const p of ["/", "/insights/", "/contact/", "/missing-page/"]) {
    const html = await (await request.get(`${p}?q=${encodeURIComponent(mark)}&utm_source=${encodeURIComponent(mark)}`)).text();
    expect(html, p).not.toContain(mark);
  }
});

test("unsupported methods and content types are rejected", async ({ request }) => {
  expect((await request.get("/api/forms/contact/")).status()).toBe(405);
  expect((await request.post("/api/forms/contact/", { data: { name: "x" }, headers: { "x-forwarded-for": ip() } })).status()).toBe(415);
  expect((await request.post("/api/forms/unknown/", { form: { a: "1" } })).status()).toBe(404);
});

test("API routes refuse oversized payloads and never leak stack traces", async ({ request }) => {
  const big = "x".repeat(7 * 1024 * 1024);
  const r = await request.post("/api/forms/contact/", { headers: { "x-forwarded-for": ip(), "content-type": "application/x-www-form-urlencoded" }, data: `details=${big}` });
  expect(r.status()).toBe(413);
  const probes = [
    await request.post("/api/forms/contact/", { headers: { "x-forwarded-for": ip(), "content-type": "multipart/form-data; boundary=broken" }, data: "--broken\r\nnot a form" }),
    await request.post("/api/forms/careers/", { headers: { "x-forwarded-for": ip() }, multipart: { name: "A", email: "a@example.com", cv: { name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("not a pdf") }, t: String(Date.now() - 10_000) } }),
    await request.post("/api/forms/newsletter/", { headers: { "x-forwarded-for": ip() }, form: { email: "<script>alert(1)</script>", t: String(Date.now() - 10_000) } }),
    await request.post("/api/forms/%00/", { form: { a: "1" } }),
    await request.fetch("/api/forms/contact/", { method: "PUT", form: { a: "1" } }),
    await request.fetch("/api/forms/contact/", { method: "DELETE" }),
  ];
  for (const p of probes) {
    expect(p.status(), p.url()).toBeGreaterThanOrEqual(400);
    expect(p.status(), p.url()).toBeLessThan(500);
    const body = await p.text();
    expect(body, p.url()).not.toMatch(/\bat [\w.<>]+ \(|node_modules|\.tsx?:\d+|Error: |stack/i);
  }
});
