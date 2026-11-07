import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { careers, contact, newsletter } from "@/lib/server/forms";
import { outbox, esc, rows, branded } from "@/lib/server/email";
import * as email from "@/lib/server/email";
import { rateLimit } from "@/lib/server/rate-limit";
import { submitContact, subscribe, apply } from "@/app/actions";
import { POST } from "@/app/api/forms/[form]/route";
import { GET as outboxGet, DELETE as outboxDel } from "@/app/api/test/outbox/route";

let n = 0;
const ip = () => `198.51.100.${++n}`;
const fd = (v: Record<string, string | File>) => {
  const f = new FormData();
  for (const [k, x] of Object.entries(v)) f.set(k, x);
  return f;
};
const good = { name: "Sara Khan", email: "sara@example.com", details: "We need a clinic booking app", need: "Mobile app", t: String(Date.now() - 10_000) };
const pdf = (bytes = "%PDF-1.7 test", name = "cv.pdf", type = "application/pdf") => new File([bytes], name, { type });

beforeEach(() => {
  outbox().length = 0;
  vi.restoreAllMocks();
});

describe("contact action", () => {
  it("sends a notification and a branded confirmation", async () => {
    const r = await contact(fd(good), ip());
    expect(r).toEqual({ state: { status: "ok" }, code: 200 });
    const mails = outbox().filter((m) => m.kind === "email");
    expect(mails).toHaveLength(2);
    expect(mails[0].to).toEqual(["team@test.local"]);
    expect(mails[0].subject).toBe("New enquiry: Mobile app from Sara Khan");
    expect(mails[1].to).toBe("sara@example.com");
    expect(mails[1].html).toContain("Thank you, Sara");
    expect(mails[1].html).toContain("#48AC9F");
    expect(mails[1].html).not.toMatch(/business day/);
  });

  it("returns field errors for bad input", async () => {
    const r = await contact(fd({ name: "", email: "nope", details: "" }), ip());
    expect(r.code).toBe(400);
    expect(r.state.errors).toEqual({
      details: "Tell us a little about the project.",
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
    });
    expect(outbox()).toHaveLength(0);
  });

  it("silently drops honeypot and too-fast submissions", async () => {
    expect((await contact(fd({ ...good, website: "http://spam" }), ip())).state.status).toBe("ok");
    expect((await contact(fd({ ...good, t: String(Date.now()) }), ip())).state.status).toBe("ok");
    expect(outbox()).toHaveLength(0);
  });

  it("rate limits after five submissions per address", async () => {
    const who = ip();
    for (let i = 0; i < 5; i++) expect((await contact(fd(good), who)).code).toBe(200);
    const r = await contact(fd(good), who);
    expect(r.code).toBe(429);
    expect(r.state.message).toMatch(/Too many attempts/);
    expect((await contact(fd(good), ip())).code).toBe(200);
  });

  it("escapes script injection and strips line breaks from subjects", async () => {
    await contact(fd({ ...good, name: "<script>alert(1)</script>\r\nBcc: x@y.z", details: '<img src=x onerror="alert(1)">' }), ip());
    const [note, conf] = outbox();
    expect(note.subject).not.toMatch(/[\r\n]/);
    expect(note.html).not.toContain("<script>");
    expect(note.html).toContain("&lt;script&gt;");
    expect(note.html).not.toContain("<img src=x");
    expect(conf.html).not.toContain("<script>");
  });

  it("truncates oversized fields", async () => {
    await contact(fd({ ...good, details: "a".repeat(50_000), name: "b".repeat(500) }), ip());
    expect(outbox()[0].html!.length).toBeLessThan(20_000);
  });

  it("reports a send failure without leaking details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(email, "sendNotification").mockRejectedValueOnce(new Error("resend down"));
    const r = await contact(fd(good), ip());
    expect(r.code).toBe(502);
    expect(r.state.message).not.toContain("resend");
  });

  it("succeeds when only the visitor confirmation fails, and logs it", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(email, "sendConfirmation").mockRejectedValueOnce(new Error("You can only send testing emails to your own email address"));
    const r = await contact(fd(good), ip());
    expect(r.code).toBe(200);
    expect(outbox()[0].subject).toMatch(/^New enquiry/);
    expect(log.mock.calls.flat().join(" ")).toMatch(/contact confirmation to the visitor not sent.*testing emails/);
  });
});

describe("newsletter action", () => {
  it("adds the address to the audience and confirms", async () => {
    const r = await newsletter(fd({ email: "reader@example.com" }), ip());
    expect(r.code).toBe(200);
    expect(outbox().find((m) => m.kind === "contact")?.email).toBe("reader@example.com");
    expect(outbox().filter((m) => m.kind === "email")).toHaveLength(2);
  });

  it("rejects a bad address", async () => {
    const r = await newsletter(fd({ email: "reader@" }), ip());
    expect(r.code).toBe(400);
    expect(r.state.errors?.email).toBeDefined();
  });

  it("still succeeds and logs when the audience update fails", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(email, "addToAudience").mockRejectedValueOnce(new Error("audience-not-configured"));
    expect((await newsletter(fd({ email: "reader@example.com" }), ip())).code).toBe(200);
    expect(outbox().filter((m) => m.kind === "email")).toHaveLength(2);
    expect(log.mock.calls.flat().join(" ")).toMatch(/audience not updated.*audience-not-configured/);
  });

  it("fails when the team notification fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(email, "sendNotification").mockRejectedValueOnce(new Error("x"));
    expect((await newsletter(fd({ email: "reader@example.com" }), ip())).code).toBe(502);
  });
});

describe("careers action", () => {
  const base = { name: "Ali Raza", email: "ali@example.com", role: "Senior engineer", t: String(Date.now() - 10_000) };

  it("accepts a PDF and attaches it", async () => {
    const r = await careers(fd({ ...base, cv: pdf() }), ip());
    expect(r.code).toBe(200);
    expect(outbox()[0].attachments).toBe(1);
    expect(outbox()[0].subject).toBe("Application: Senior engineer from Ali Raza");
    expect(outbox()[1].html).toContain("<b>Senior engineer</b>");
  });

  it("rejects a CV over 5 MB with 413", async () => {
    const big = new File(["%PDF-", new Uint8Array(5 * 1024 * 1024 + 1)], "cv.pdf", { type: "application/pdf" });
    const r = await careers(fd({ ...base, cv: big }), ip());
    expect(r.code).toBe(413);
    expect(r.state.errors?.cv).toBe("Your CV must be 5 MB or smaller.");
  });

  it("rejects wrong file types and fake PDFs with 415", async () => {
    expect((await careers(fd({ ...base, cv: pdf("hello", "cv.exe", "application/x-msdownload") }), ip())).code).toBe(415);
    const fake = await careers(fd({ ...base, cv: pdf("MZ not a pdf", "cv.pdf") }), ip());
    expect(fake.code).toBe(415);
    expect(fake.state.errors?.cv).toBe("Please upload your CV as a PDF.");
  });

  it("accepts a Vercel Blob CV link and rejects other links", async () => {
    expect((await careers(fd({ ...base, cvUrl: "https://abc.public.blob.vercel-storage.com/cv/a.pdf" }), ip())).code).toBe(200);
    expect((await careers(fd({ ...base, cvUrl: "https://evil.example.com/a.pdf" }), ip())).code).toBe(400);
  });

  it("validates name, email and portfolio link", async () => {
    const r = await careers(fd({ name: "", email: "x", link: "javascript:alert(1)" }), ip());
    expect(Object.keys(r.state.errors!)).toEqual(["name", "email", "link"]);
    expect(r.code).toBe(400);
  });

  it("applies without a CV", async () => {
    expect((await careers(fd(base), ip())).code).toBe(200);
    expect(outbox()[0].attachments).toBe(0);
  });

  it("fails only when the team notification fails", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(email, "sendConfirmation").mockRejectedValueOnce(new Error("visitor blocked"));
    expect((await careers(fd(base), ip())).code).toBe(200);
    expect(log.mock.calls.flat().join(" ")).toMatch(/careers confirmation to the visitor not sent.*visitor blocked/);
    vi.spyOn(email, "sendNotification").mockRejectedValueOnce(new Error("x"));
    expect((await careers(fd(base), ip())).code).toBe(502);
  });
});

describe("server actions", () => {
  it("wrap the handlers and return form state", async () => {
    expect(await submitContact({ status: "idle" }, fd(good))).toEqual({ status: "ok" });
    expect(await subscribe({ status: "idle" }, fd({ email: "bad" }))).toMatchObject({ status: "error" });
    expect(await apply({ status: "idle" }, fd({ name: "A", email: "a@b.co" }))).toEqual({ status: "ok" });
  });
});

describe("form endpoint", () => {
  const req = (form: string, body: BodyInit, headers: Record<string, string> = {}) =>
    POST(new NextRequest(`http://localhost/api/forms/${form}/`, { method: "POST", body, headers: { "x-forwarded-for": ip(), ...headers } }), {
      params: Promise.resolve({ form }),
    });

  it("returns status codes", async () => {
    expect((await req("contact", fd(good))).status).toBe(200);
    expect((await req("contact", fd({ name: "" }))).status).toBe(400);
    expect((await req("nope", fd(good))).status).toBe(404);
    expect((await req("contact", "{}", { "content-type": "application/json" })).status).toBe(415);
    expect((await req("contact", "x", { "content-type": "multipart/form-data; boundary=zz" })).status).toBe(400);
    expect((await req("contact", fd(good), { "content-length": String(7 * 1024 * 1024) })).status).toBe(413);
  });

  it("returns 429 after the limit", async () => {
    const h = { "x-forwarded-for": "192.0.2.77" };
    const codes = [];
    for (let i = 0; i < 7; i++) codes.push((await req("newsletter", fd({ email: "a@example.com" }), h)).status);
    expect(codes).toEqual([200, 200, 200, 200, 200, 429, 429]);
  });
});

describe("test outbox endpoint", () => {
  it("lists and clears mail in test mode", async () => {
    await contact(fd(good), ip());
    expect(((await (await outboxGet()).json()) as unknown[]).length).toBe(2);
    await outboxDel();
    expect(outbox()).toHaveLength(0);
  });
});

describe("helpers", () => {
  it("rate limit resets after the window", () => {
    vi.useFakeTimers();
    const k = "t:" + Math.random();
    expect(rateLimit(k, 1, 1000)).toBe(true);
    expect(rateLimit(k, 1, 1000)).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rateLimit(k, 1, 1000)).toBe(true);
    vi.useRealTimers();
  });

  it("rate limit prunes old keys when the store grows", () => {
    vi.useFakeTimers();
    for (let i = 0; i < 5005; i++) rateLimit("p" + i, 5, 10);
    vi.advanceTimersByTime(20);
    expect(rateLimit("fresh", 5, 10)).toBe(true);
    vi.useRealTimers();
  });

  it("escapes HTML and builds rows", () => {
    expect(esc(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
    expect(rows({ A: "1", B: "" })).toContain(">A<");
    expect(rows({ A: "1", B: "" })).not.toContain(">B<");
    expect(branded("T", "<p>x</p>")).toContain("<h1");
  });
});
