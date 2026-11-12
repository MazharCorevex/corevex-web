import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { get } from "node:http";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { ROUTES } from "../routes";

// Timing tests run one at a time so numbers are comparable
test.describe.configure({ mode: "serial" });

const OUT = "test-results/perf";
const save = (name: string, data: unknown) => {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data, null, 2));
};
const VITALS = readFileSync("node_modules/web-vitals/dist/web-vitals.attribution.iife.js", "utf8");
const THIRD = /^https?:\/\/(?!localhost|127\.0\.0\.1)/;

async function throttleCpu(page: Page, rate: number) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate });
  return cdp;
}

// INP over real interactions, 4x CPU slowdown
test.describe("INP", () => {
  const cases: [string, string, (p: Page) => Promise<void>][] = [
    [
      "open the Services menu",
      "/",
      async (p) => {
        await p.getByRole("button", { name: "Services menu" }).click();
        await expect(p.locator(".mega")).toBeVisible();
        await p.keyboard.press("Escape");
      },
    ],
    [
      "switch tech stack tabs",
      "/",
      async (p) => {
        const tabs = p.locator(".stx-tab");
        await tabs.nth(1).scrollIntoViewIfNeeded();
        for (let i = 1; i < 5; i++) await tabs.nth(i).click();
      },
    ],
    [
      "open the industries accordion",
      "/",
      async (p) => {
        const items = p.locator(".acc-item");
        await items.nth(2).scrollIntoViewIfNeeded();
        await items.nth(2).click();
        await items.nth(4).click();
      },
    ],
    [
      "submit the newsletter form",
      "/insights/",
      async (p) => {
        const news = p.locator("form.news");
        await news.scrollIntoViewIfNeeded();
        await news.getByLabel("Email").fill(`inp-${Date.now()}@example.com`);
        await p.waitForTimeout(2100);
        await news.getByRole("button", { name: "Subscribe" }).click();
        await expect(news.getByRole("status")).toHaveText("Subscribed. Thank you.");
      },
    ],
    [
      "step through the contact form",
      "/contact/",
      async (p) => {
        await p.getByLabel("Web app").check({ force: true });
        await p.locator(".fstep.on").getByRole("button", { name: /Next/ }).click();
        await p.getByLabel("Goals, users and current tools").fill("A partner portal.");
        await p.locator(".fstep.on").getByRole("button", { name: /Next/ }).click();
      },
    ],
  ];
  const results: Record<string, number> = {};

  for (const [name, route, act] of cases) {
    test(name, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.9.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}` });
      await page.addInitScript(`${VITALS};window.__inp=0;webVitals.onINP(function(m){window.__inp=Math.max(window.__inp,m.value)},{reportAllChanges:true,durationThreshold:0});`);
      await page.goto(route, { waitUntil: "load" });
      await page.waitForFunction(() => document.body.classList.contains("header-on"));
      await throttleCpu(page, 4);
      await act(page);
      await page.waitForTimeout(500);
      // Hidden page flushes the final INP value
      await page.evaluate(() => {
        Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      const inp = await page.evaluate(() => (window as unknown as { __inp: number }).__inp);
      results[name] = Math.round(inp);
      save("inp", results);
      expect(inp, `${name} INP`).toBeLessThan(200);
    });
  }
});

// Network profiles: first content and a usable hero
// Chrome DevTools Fast 3G, Lighthouse Slow 4G, and a typical 4G link
const kbps = (n: number) => (n * 1024) / 8;
const PROFILES = {
  "Fast 3G": { latency: 562.5, downloadThroughput: kbps(1474.6), uploadThroughput: kbps(675) },
  "Slow 4G": { latency: 150, downloadThroughput: kbps(1638.4), uploadThroughput: kbps(750) },
  "4G": { latency: 60, downloadThroughput: kbps(9216), uploadThroughput: kbps(1536) },
};

test.describe("network profiles", () => {
  const rows: Record<string, unknown>[] = [];
  for (const route of ["/", "/services/custom-software-development/"])
    for (const [profile, cond] of Object.entries(PROFILES)) {
      test(`${route} on ${profile}`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, storageState: "tests/consent-state.json" });
        const page = await ctx.newPage();
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.enable");
        await cdp.send("Network.emulateNetworkConditions", { offline: false, ...cond });
        const t0 = Date.now();
        await page.goto(route, { waitUntil: "commit", timeout: 90_000 });
        await page.waitForFunction(() => performance.getEntriesByName("first-contentful-paint").length > 0, null, { timeout: 90_000 });
        const fcp = await page.evaluate(() => performance.getEntriesByName("first-contentful-paint")[0].startTime);
        // Usable: hydrated and the hero call to action can be clicked
        await page.waitForFunction(() => document.body.classList.contains("header-on"), null, { timeout: 90_000 });
        await page.locator("main a.btn, main button.btn").first().waitFor({ state: "visible", timeout: 90_000 });
        const usable = await page.evaluate(() => performance.now());
        const lcp = await page.evaluate(
          () =>
            new Promise<number>((r) => {
              new PerformanceObserver((l) => r(l.getEntries().at(-1)!.startTime)).observe({ type: "largest-contentful-paint", buffered: true });
              setTimeout(() => r(-1), 3000);
            }),
        );
        rows.push({ route, profile, fcp: Math.round(fcp), lcp: Math.round(lcp), usable: Math.round(usable), wall: Date.now() - t0 });
        save("network", rows);
        await ctx.close();
      });
    }
});

// Cold and warm loads
test("first visit vs repeat visit", async ({ browser }) => {
  const out: Record<string, unknown>[] = [];
  for (const route of ["/", "/services/code-rescue/", "/insights/what-is-rag/"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: "tests/consent-state.json" });
    const page = await ctx.newPage();
    const measure = async () => {
      await page.goto(route, { waitUntil: "load" });
      return page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
        const bytes = res.reduce((n, r) => n + r.transferSize, nav.transferSize);
        const cached = res.filter((r) => r.transferSize === 0 && r.decodedBodySize > 0).length;
        return { load: Math.round(nav.loadEventEnd), bytes, requests: res.length + 1, fromCache: cached };
      });
    };
    const cold = await measure();
    const warm = await measure();
    out.push({ route, cold, warm });
    expect(warm.bytes, `${route} repeat visit should use the cache`).toBeLessThan(cold.bytes * 0.5);
    await ctx.close();
  }
  save("cold-warm", out);
});

// Everything requested before the visitor does anything
test("requests before any interaction", async ({ browser }) => {
  const report: Record<string, string[]> = {};
  for (const fresh of [true, false]) {
    const ctx: BrowserContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...(fresh ? {} : { storageState: "tests/consent-state.json" }) });
    const page = await ctx.newPage();
    const urls: string[] = [];
    page.on("request", (r) => urls.push(r.url().replace(/^http:\/\/localhost:\d+/, "")));
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    report[fresh ? "first visit" : "returning visitor"] = urls;
    expect(urls.filter((u) => THIRD.test(u)), "third-party requests before interaction").toEqual([]);
    await ctx.close();
  }
  save("requests-before-interaction", report);
});

// Fonts
test("fonts are self-hosted, preloaded and swap without layout shift", async ({ page }) => {
  const hosts: string[] = [];
  page.on("request", (r) => /fonts\.(googleapis|gstatic)\.com/.test(r.url()) && hosts.push(r.url()));
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  expect(hosts).toEqual([]);
  const preloads = await page.locator('link[rel="preload"][as="font"]').evaluateAll((ls) => ls.map((l) => l.getAttribute("href")));
  expect(preloads.length).toBeGreaterThan(0);
  // next/font's metric-matched fallbacks are local() faces and download nothing
  const faces = await page.evaluate(() => [...document.fonts].filter((f) => !/ Fallback$/.test(f.family)).map((f) => `${f.family}:${f.display}`));
  expect(faces.length).toBeGreaterThan(0);
  expect(faces.filter((f) => !f.endsWith(":swap"))).toEqual([]);
  expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.02);
});

// Caching and compression
test("long cache for static assets, revalidated HTML, compression on", async ({ page, baseURL }) => {
  await page.goto("/");
  const js = await page.evaluate(() => (performance.getEntriesByType("resource") as PerformanceResourceTiming[]).map((r) => r.name).filter((n) => n.includes("/_next/static/") && n.endsWith(".js")));
  expect(js.length).toBeGreaterThan(0);
  // Raw HTTP, so the encoding header is seen as the browser sees it
  const head = (path: string, accept = "") =>
    new Promise<Record<string, string | string[] | undefined>>((resolve, reject) => {
      const u = new URL(path, baseURL);
      get({ host: u.hostname, port: u.port, path: u.pathname + u.search, headers: { "accept-encoding": "gzip, deflate, br", ...(accept ? { accept } : {}) } }, (res) => {
        res.resume();
        resolve({ ...res.headers, status: String(res.statusCode) });
      }).on("error", reject);
    });
  const asset = await head(new URL(js[0]).pathname);
  expect(asset["cache-control"]).toMatch(/max-age=31536000.*immutable|immutable.*max-age=31536000/);
  expect(asset["content-encoding"]).toMatch(/gzip|br/);
  const img = await head("/_next/image/?url=%2Fimages%2Fphotos%2Fworkshop.webp&w=768&q=75", "image/avif,image/webp");
  expect(img.status).toBe("200");
  expect(img["cache-control"]).toMatch(/max-age=\d{6,}/);
  for (const r of ["/", "/services/", "/contact/"]) {
    const html = await head(r);
    // Browsers must check back: no long browser max-age on HTML
    expect(String(html["cache-control"] || ""), r).not.toMatch(/(^|[ ,])max-age=(?!0\b)\d+/);
    expect(html["content-encoding"], r).toMatch(/gzip|br/);
  }
});

// Images on every page
test("images: next/image, modern formats, lazy below the fold, sizes, weight", async ({ browser }) => {
  test.setTimeout(600_000);
  const issues: string[] = [];
  const weights: Record<string, number> = {};
  for (const [w, h] of [
    [390, 844],
    [1440, 900],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 3 : 1, storageState: "tests/consent-state.json" });
    const page = await ctx.newPage();
    page.on("response", async (r) => {
      if (r.request().resourceType() !== "image") return;
      const len = Number(r.headers()["content-length"] || (await r.body().catch(() => Buffer.alloc(0))).length);
      weights[r.url().replace(/^http:\/\/localhost:\d+/, "")] = len;
    });
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: "load" });
      // Before scrolling: what loads up front
      const first = await page.evaluate(() =>
        [...document.images].map((i) => {
          const r = i.getBoundingClientRect();
          return { src: i.getAttribute("src") || "", top: r.top + scrollY, loading: i.loading, prio: i.getAttribute("fetchpriority"), srcset: !!i.srcset, sizes: i.getAttribute("sizes"), hero: !!i.closest(".hero, .page-hero, .cs-hero, .art-hero, .svc-hero, .ed-hero, .mag-feat") };
        }),
      );
      const fold = h;
      for (const i of first) {
        const raster = !/\.svg($|\?)/.test(i.src) && !i.src.startsWith("data:");
        if (raster && !i.src.startsWith("/_next/image")) issues.push(`${w} ${route}: raster image not through next/image: ${i.src}`);
        if (raster && i.srcset && !i.sizes) issues.push(`${w} ${route}: missing sizes: ${i.src}`);
        if (i.top > fold * 1.5 && i.loading !== "lazy") issues.push(`${w} ${route}: below the fold but not lazy: ${i.src}`);
        if (i.prio === "high" && !i.hero) issues.push(`${w} ${route}: priority outside the hero: ${i.src}`);
      }
      // After scrolling: served size against displayed size
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
          scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      await page.waitForTimeout(600);
      const shown = await page.evaluate(() =>
        [...document.images]
          // Accordion images are sized for the open panel
          .filter((i) => i.complete && i.naturalWidth > 0 && !/\.svg/.test(i.currentSrc) && !i.closest(".acc-item"))
          .map((i) => {
            const r = i.getBoundingClientRect();
            const fit = getComputedStyle(i).objectFit;
            return { src: i.currentSrc.replace(/^http:\/\/localhost:\d+/, ""), nw: i.naturalWidth, nh: i.naturalHeight, w: r.width, h: r.height, fit, dpr: devicePixelRatio };
          }),
      );
      for (const i of shown) {
        if (i.w < 2) continue;
        if (i.nw > 2 * i.w * i.dpr + 1 && i.nw > 256) issues.push(`${w} ${route}: served ${i.nw}px for ${Math.round(i.w)}px at ${i.dpr}x: ${i.src}`);
        if (/\/_next\/image/.test(i.src) && !/[?&]w=/.test(i.src)) issues.push(`${w} ${route}: image without width: ${i.src}`);
      }
    }
    await ctx.close();
  }
  const heavy = Object.entries(weights).filter(([, n]) => n > 200 * 1024).map(([u, n]) => `${(n / 1024).toFixed(0)} KB ${u}`);
  const formats = Object.keys(weights).filter((u) => u.startsWith("/_next/image"));
  save("images", { issues, heavy, imageRequests: Object.keys(weights).length, optimised: formats.length });
  expect(heavy, "images over 200 KB").toEqual([]);
  expect(issues).toEqual([]);
});

// Next/image serves WebP or AVIF
test("optimised images come back as AVIF or WebP", async ({ request }) => {
  const r = await request.get("/_next/image/?url=%2Fimages%2Fphotos%2Fworkshop.webp&w=768&q=75", { headers: { accept: "image/avif,image/webp,*/*" } });
  expect(r.headers()["content-type"]).toMatch(/image\/(avif|webp)/);
});

// Gears video
test.describe("gears video", () => {
  const isGears = (u: string) => /gears-loop\.(mp4|webm)/.test(u);
  test("loads only when its section is in view", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: "tests/consent-state.json" });
    const page = await ctx.newPage();
    const hits: string[] = [];
    page.on("request", (r) => isGears(r.url()) && hits.push(r.url()));
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(2500);
    expect(hits, "no video request on page load").toEqual([]);
    await page.locator(".t-gears").scrollIntoViewIfNeeded();
    await expect.poll(() => hits.length, { timeout: 10_000 }).toBeGreaterThan(0);
    await ctx.close();
  });
  for (const [name, opts] of [
    ["reduced motion", { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" as const }],
    ["phone with reduced motion", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" as const }],
  ] as const) {
    test(`never loads with ${name}`, async ({ browser }) => {
      const ctx = await browser.newContext({ ...opts, storageState: "tests/consent-state.json" });
      const page = await ctx.newPage();
      const hits: string[] = [];
      page.on("request", (r) => isGears(r.url()) && hits.push(r.url()));
      await page.goto("/");
      await page.locator(".t-gears").scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);
      expect(hits).toEqual([]);
      await ctx.close();
    });
  }
});
