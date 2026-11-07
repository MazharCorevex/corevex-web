import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "../routes";

const THREE = /WebGLRenderer|THREE\.WebGL|three\.module/;

async function scripts(page: Page) {
  const list: { url: string; body: string }[] = [];
  page.on("response", async (r) => {
    if (r.request().resourceType() === "script" && r.url().includes("/_next/")) list.push({ url: r.url(), body: await r.text().catch(() => "") });
  });
  return list;
}

test.describe("three.js", () => {
  test("is not in the home page's initial bundle", async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const list = await scripts(page);
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const initial = list.filter((s) => THREE.test(s.body)).map((s) => s.url);
    expect(initial, "three.js before scrolling").toEqual([]);
    await page.locator(".core").scrollIntoViewIfNeeded();
    await expect(page.locator(".core")).toHaveClass(/live/, { timeout: 15_000 });
    expect(list.some((s) => THREE.test(s.body)), "three.js loads once the section is near").toBe(true);
    await page.close();
  });

  for (const [name, opts] of [
    ["phone", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
    ["tablet", { viewport: { width: 1024, height: 1366 }, isMobile: true, hasTouch: true }],
    ["reduced motion", { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" as const }],
  ] as const) {
    test(`never loads on ${name}`, async ({ browser }) => {
      const page = await browser.newPage(opts);
      const list = await scripts(page);
      await page.goto("/");
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
          scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      await page.waitForTimeout(1500);
      expect(list.filter((s) => THREE.test(s.body)).map((s) => s.url)).toEqual([]);
      await expect(page.locator(".core")).not.toHaveClass(/live/);
      await page.close();
    });
  }
});

test("no image over 250 KB on any page", async ({ browser }) => {
  test.setTimeout(300_000);
  const big: string[] = [];
  for (const vp of [
    { width: 390, height: 844, deviceScaleFactor: 3 },
    { width: 1920, height: 1080, deviceScaleFactor: 1 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor });
    page.on("response", async (r) => {
      if (r.request().resourceType() !== "image") return;
      const len = Number(r.headers()["content-length"] || (await r.body().catch(() => Buffer.alloc(0))).length);
      if (len > 250 * 1024) big.push(`${Math.round(len / 1024)} KB ${r.url()}`);
    });
    for (const route of ROUTES) {
      await page.goto(route);
      await page.evaluate(async () => {
        document.querySelectorAll<HTMLImageElement>("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 30));
        }
      });
      await page.waitForLoadState("networkidle").catch(() => {});
    }
    await page.close();
  }
  expect([...new Set(big)]).toEqual([]);
});

test("Calendly and analytics load nothing up front", async ({ page }) => {
  const third: string[] = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (!["localhost", "127.0.0.1"].includes(u.hostname)) third.push(u.hostname);
  });
  await page.goto("/");
  await page.waitForTimeout(2000);
  expect(third.filter((h) => !/googletagmanager|google-analytics/.test(h) || !process.env.NEXT_PUBLIC_GA_ID)).toEqual([]);
});
