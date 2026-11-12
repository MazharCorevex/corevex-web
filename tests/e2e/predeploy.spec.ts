import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "../routes";
import { OFFERS } from "../../lib/offers";

const ip = () => `10.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}`;
const human = (page: Page) => page.waitForTimeout(2100);
const desktopOnly = (name: string) => test.skip(name !== "desktop", "runs once, on desktop");

test.describe("contact form", () => {
  test("rate limit: the sixth enquiry from one address in ten minutes is refused", async ({ request }, info) => {
    desktopOnly(info.project.name);
    const from = ip();
    const send = () =>
      request.post("/api/forms/contact/", {
        headers: { "x-forwarded-for": from },
        form: { name: "Rate Test", email: `rate-${Date.now()}@example.com`, details: "Testing the limit.", need: "Web app", t: String(Date.now() - 10_000) },
      });
    const codes: number[] = [];
    for (let i = 0; i < 6; i++) codes.push((await send()).status());
    expect(codes.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(codes[5]).toBe(429);
    const body = await (await send()).json();
    expect(body.message).toMatch(/Too many attempts/);
  });

  test("every validation error is shown by the server", async ({ request }, info) => {
    desktopOnly(info.project.name);
    const r = await request.post("/api/forms/contact/", { headers: { "x-forwarded-for": ip() }, form: { name: "", email: "not-an-email", details: "", t: String(Date.now() - 10_000) } });
    expect(r.status()).toBe(400);
    const j = await r.json();
    expect(j.errors).toMatchObject({ details: expect.any(String), name: expect.any(String), email: expect.any(String) });
  });

  for (const o of OFFERS) {
    test(`?offer=${o.slug} prefills the Offer field`, async ({ page }) => {
      await page.goto(`/contact/?offer=${o.slug}`);
      await expect(page.locator("#c-offer")).toHaveValue(o.slug);
    });
  }

  test("an unknown offer leaves the field on No specific offer", async ({ page }) => {
    await page.goto("/contact/?offer=free-audit");
    await expect(page.locator("#c-offer")).toHaveValue("");
  });
});

test.describe("newsletter", () => {
  test("the same address can subscribe twice and still sees success", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-for": ip() });
    const email = `dup-${Date.now()}@example.com`;
    for (let i = 0; i < 2; i++) {
      await page.goto("/insights/");
      const news = page.locator("form.news");
      await news.scrollIntoViewIfNeeded();
      await news.getByLabel("Email").fill(email);
      await human(page);
      await news.getByRole("button", { name: "Subscribe" }).click();
      await expect(news.getByRole("status")).toHaveText("Subscribed. Thank you.");
    }
  });

  test("an invalid address is refused with a message", async ({ request }, info) => {
    desktopOnly(info.project.name);
    const r = await request.post("/api/forms/newsletter/", { headers: { "x-forwarded-for": ip() }, form: { email: "nobody@", t: String(Date.now() - 10_000) } });
    expect(r.status()).toBe(400);
    expect((await r.json()).message).toMatch(/valid email/);
  });
});

test.describe("navigation", () => {
  test("the browser back button returns to the previous page", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer a[href='/about/']").first().click();
    await expect(page).toHaveURL(/\/about\/$/);
    await page.locator("footer a[href='/faq/']").first().click();
    await expect(page).toHaveURL(/\/faq\/$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator("h1")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/about\/$/);
  });

  test("breadcrumbs point to real parent pages", async ({ page, request }, info) => {
    desktopOnly(info.project.name);
    const bad: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      const links = await page.locator("nav.crumbs a").evaluateAll((as) => as.map((a) => a.getAttribute("href") || ""));
      for (const href of links) {
        if (!route.startsWith(href)) bad.push(`${route}: crumb ${href} is not a parent`);
        const s = (await request.get(href)).status();
        if (s !== 200) bad.push(`${route}: crumb ${href} answered ${s}`);
      }
    }
    expect(bad).toEqual([]);
  });

  test("every call to action leads to a working page", async ({ page, request }, info) => {
    desktopOnly(info.project.name);
    test.setTimeout(300_000);
    const seen = new Map<string, number>();
    const bad: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      const hrefs = await page.locator("main a.btn[href], main a.link[href], .nav-cta[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") || ""));
      for (const h of hrefs) {
        if (!h.startsWith("/") || h.startsWith("//")) continue;
        const path = h.split("#")[0];
        if (!seen.has(path)) seen.set(path, (await request.get(path)).status());
        if (seen.get(path) !== 200) bad.push(`${route} -> ${h} (${seen.get(path)})`);
      }
    }
    expect(bad).toEqual([]);
  });
});

test.describe("pricing", () => {
  test("only the approved prices appear anywhere, and each shows as approved", async ({ page }, info) => {
    desktopOnly(info.project.name);
    test.setTimeout(300_000);
    const found = new Map<string, string>();
    let all = "";
    for (const route of ROUTES) {
      await page.goto(route);
      // The AI Lab demo reads a sample supplier invoice; those amounts are not Corevex prices
      // Text of every section, painted or not, without scripts
      let text = await page.evaluate(() => {
        const c = document.body.cloneNode(true) as HTMLElement;
        c.querySelectorAll("script,style,template").forEach((x) => x.remove());
        return c.textContent + " " + [...document.querySelectorAll("meta[content]")].map((m) => m.getAttribute("content")).join(" ");
      });
      if (route === "/ai-lab/") text = text.replace(/\$[\d,]+\.\d{2}/g, "");
      all += ` ${text}`;
      for (const m of text.matchAll(/\$\s?[\d,]+(?:\.\d+)?/g)) found.set(m[0].replace(/\s/, ""), route);
    }
    const approved = new Set(["$199", "$599", "$2,000", "$2,500", "$5,000", "$1,000"]);
    expect([...found.keys()].filter((p) => !approved.has(p)).map((p) => `${p} on ${found.get(p)}`)).toEqual([]);
    // Adjacent elements join without spaces in textContent, so check for "no further digit" rather than a word boundary
    for (const shown of [/\$199(?![\d,])/, /\$599(?![\d,])/, /\$2,000 to \$2,500\s*per month/i, /from \$5,000(?![\d,])/i, /from \$1,000(?![\d,])/i]) expect(all).toMatch(shown);
    // No other currency or hourly rates
    expect(all).not.toMatch(/(?:USD|EUR|GBP|PKR|£|€)\s?\d|per hour|\/hr\b/i);
  });
});

test("legal pages show the company, address, email, court city and date", async ({ page }, info) => {
  desktopOnly(info.project.name);
  for (const route of ["/privacy/", "/terms/", "/cookies/"]) {
    await page.goto(route);
    const t = await page.locator("main").innerText();
    expect(t, route).toContain("11 November 2026");
    expect(t, route).toContain("business@corevex-solutions.com");
    if (route !== "/cookies/") {
      expect(t, route).toContain("Corevex Solutions");
      expect(t, route).toMatch(/Sikander Plaza, Canal Bridge, Vehari Road, Model Town, Hasilpur/);
    }
  }
  await page.goto("/terms/");
  await expect(page.locator("main")).toContainText("courts of Lahore");
});
