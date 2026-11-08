import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "../routes";
import { audit, settle } from "./checks";

const KEY = ["/", "/services/", "/services/code-rescue/", "/work/", "/work/australian-direct-tutoring/", "/insights/", "/insights/what-is-rag/", "/about/", "/careers/", "/contact/", "/faq/", "/ai-lab/"];

test.describe("200% browser zoom", () => {
  // 1280 x 800 at 200% is a 640 x 400 CSS viewport at double density
  test.use({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 });
  for (const route of KEY) {
    test(route, async ({ page }) => {
      await page.goto(route);
      await settle(page);
      const issues = (await audit(page, { touch: false, desktop: false, home: route === "/" })).filter((i) => !i.startsWith("tap target"));
      expect(issues).toEqual([]);
    });
  }
});

async function textZoom(page: Page, factor = 2) {
  await page.evaluate((f) => {
    const els = [...document.querySelectorAll<HTMLElement>("body *")];
    const sizes = els.map((e) => parseFloat(getComputedStyle(e).fontSize));
    els.forEach((e, i) => {
      if (sizes[i]) e.style.fontSize = `${sizes[i] * f}px`;
    });
  }, factor);
  await page.waitForTimeout(400);
}

test.describe("text-only zoom 200%", () => {
  for (const [w, h] of [
    [1280, 800],
    [390, 844],
  ]) {
    test.describe(`${w}x${h}`, () => {
      test.use({ viewport: { width: w, height: h } });
      for (const route of KEY) {
        test(route, async ({ page }) => {
          await page.goto(route);
          await settle(page);
          await textZoom(page);
          const r = await page.evaluate(() => {
            const vw = document.documentElement.clientWidth;
            const cut: string[] = [];
            for (const hd of document.querySelectorAll<HTMLElement>("main h1, main h2, main h3")) {
              const s = getComputedStyle(hd);
              if (s.display === "none" || hd.closest(".sr,[hidden],[aria-hidden=true],.rail,.orbit,.stx-nav,.swipe,.acc-item:not(.on)")) continue;
              if ((s.overflowX !== "visible" && hd.scrollWidth > hd.clientWidth + 1) || hd.getBoundingClientRect().right > vw + 1) cut.push(hd.textContent!.trim().slice(0, 40));
            }
            return { sw: document.documentElement.scrollWidth, vw, cut };
          });
          expect(r.sw, "no horizontal scroll").toBeLessThanOrEqual(r.vw);
          expect(r.cut, "headings stay readable").toEqual([]);
        });
      }
    });
  }
});

test.describe("prefers-reduced-motion", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  test("no motion, no 3D, content still shown", async ({ page }) => {
    const three: string[] = [];
    page.on("request", (r) => /three|core-scene/.test(r.url()) && three.push(r.url()));
    await page.goto("/");
    await settle(page);
    await page.locator(".core").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && (a.effect?.getComputedTiming().duration as number) > 50)
        .map((a) => (a.effect as KeyframeEffect)?.target?.className || "anim"),
    );
    expect(running, "running animations").toEqual([]);
    expect(three, "three.js must not load").toEqual([]);
    const hidden = await page.evaluate(
      () => [...document.querySelectorAll("[data-reveal]")].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length,
    );
    expect(hidden).toBe(0);
    await expect(page.locator(".core img").first()).toBeVisible();
  });

  test("interactive pieces still work", async ({ page }) => {
    await page.goto("/");
    const tab = page.locator(".stx-tab").nth(2);
    await tab.scrollIntoViewIfNeeded();
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
  });
});

test.describe("slow 4G", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  for (const route of ["/", "/services/code-rescue/", "/insights/what-is-rag/", "/contact/"]) {
    test(route, async ({ page, browserName }) => {
      test.skip(browserName !== "chromium", "network throttling needs Chromium");
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      const t0 = Date.now();
      await page.goto(route, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await expect(page.locator("main h1")).toBeVisible({ timeout: 10_000 });
      const lcp = await page.evaluate(
        () =>
          new Promise<number>((res) => {
            let v = 0;
            new PerformanceObserver((l) => l.getEntries().forEach((e) => (v = e.startTime))).observe({ type: "largest-contentful-paint", buffered: true });
            setTimeout(() => res(v), 3000);
          }),
      );
      const cls = await page.evaluate(
        () =>
          new Promise<number>((res) => {
            let v = 0;
            new PerformanceObserver((l) => l.getEntries().forEach((e) => (v += (e as unknown as { value: number; hadRecentInput: boolean }).hadRecentInput ? 0 : (e as unknown as { value: number }).value))).observe({ type: "layout-shift", buffered: true });
            setTimeout(() => res(v), 500);
          }),
      );
      test.info().annotations.push({ type: "slow-4g", description: `${route} LCP ${Math.round(lcp)} ms, CLS ${cls.toFixed(3)}, h1 after ${Date.now() - t0} ms` });
      expect(lcp, "LCP on slow 4G").toBeLessThan(4000);
      expect(cls, "CLS").toBeLessThan(0.05);
    });
  }
});

test.describe("JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  for (const route of [...ROUTES, "/missing-page/"]) {
    test(route, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(route === "/missing-page/" ? 404 : 200);
      await expect(page.locator("h1").first()).toBeVisible();
      const r = await page.evaluate(() => {
        const main = document.querySelector("main") || document.body;
        const faded = [...main.querySelectorAll<HTMLElement>("*")].filter((e) => {
          if (!e.textContent?.trim() || e.closest("[hidden],[aria-hidden=true],details:not([open]),.sr,.hover-img,.orb-card,.stx-panel:not(.on),.hc-tag,.acc-item:not(.on) p,.drawer,.mega,.sheet,.empty-note,.tile .reveal")) return false;
          const s = getComputedStyle(e);
          return parseFloat(s.opacity) < 0.5 && s.display !== "none" && s.visibility !== "hidden";
        });
        return { words: (main.textContent || "").trim().split(/\s+/).length, faded: faded.slice(0, 5).map((e) => e.tagName + " " + e.textContent!.trim().slice(0, 30)) };
      });
      expect(r.words, "readable text").toBeGreaterThan(route === "/missing-page/" ? 10 : 40);
      expect(r.faded, "content hidden without JavaScript").toEqual([]);
    });
  }
});

test.describe("iPhone safe area", () => {
  test.use({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  for (const route of ["/", "/services/code-rescue/", "/insights/what-is-rag/", "/contact/", "/about/"]) {
    test(route, async ({ page, browserName }) => {
      test.skip(browserName !== "chromium", "safe area emulation needs Chromium");
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: { top: 0, left: 47, right: 47, bottom: 21 } });
      await page.goto(route);
      await settle(page);
      const hits = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const out: string[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n && out.length < 6; n = walker.nextNode()) {
          const el = n.parentElement!;
          if (!n.textContent?.trim() || el.closest("script,style,noscript,.sr,.skip,[aria-hidden=true],[inert],.sheet:not(.is-open),.drawer:not(.is-open),.mega,.marquee,.rail,.swipe,.orbit,.stx-nav,.filters,.table-scroll")) continue;
          const s = getComputedStyle(el);
          if (s.visibility === "hidden" || s.display === "none" || parseFloat(s.opacity) < 0.1) continue;
          const range = document.createRange();
          range.selectNodeContents(n);
          for (const r of range.getClientRects()) if (r.width > 1 && (r.left < 47 || r.right > vw - 47)) out.push(`${el.tagName.toLowerCase()} "${n.textContent.trim().slice(0, 30)}" ${Math.round(r.left)}..${Math.round(r.right)}`);
        }
        for (const el of document.querySelectorAll<HTMLElement>("header a, header button, .drawer.is-open a")) {
          const r = el.getBoundingClientRect();
          if (r.width && (r.left < 47 || r.right > vw - 47)) out.push(`control ${el.textContent?.trim().slice(0, 20) || el.getAttribute("aria-label")}`);
        }
        return out;
      });
      expect(hits, "text or controls under the notch").toEqual([]);
    });
  }
});
