import { expect, test } from "@playwright/test";
import { ROUTES } from "../routes";

const SIZES = [
  [320, 568],
  [390, 844],
  [768, 1024],
  [1440, 900],
] as const;

for (const [w, h] of SIZES) {
  test.describe(`${w}x${h}`, () => {
    const touch = w < 1100;
    test.use({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: async ({ browserName }, use) => use(touch && browserName !== "firefox") });

    test("cookie banner on a first visit", async ({ browser, browserName }) => {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch && browserName !== "firefox", storageState: { cookies: [], origins: [] } });
      const page = await ctx.newPage();
      await page.goto("/");
      const bar = page.getByRole("region", { name: "Cookie consent" });
      await expect(bar).toBeVisible();
      const box = (await bar.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(w + 0.5);
      if (w <= 860) expect(Math.round(box.width)).toBe(w);
      const btns = await bar.getByRole("button").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => [Math.round(r.width), Math.round(r.height)]));
      expect(new Set(btns.map((b) => b.join())).size, "buttons are the same size").toBe(1);
      if (w <= 860) expect(btns[0][1]).toBeGreaterThanOrEqual(44);
      // WhatsApp sits above the banner, never under it
      const wa = (await page.locator(".wa-chat").boundingBox())!;
      const overlap = Math.min(wa.x + wa.width, box.x + box.width) - Math.max(wa.x, box.x) > 0 && Math.min(wa.y + wa.height, box.y + box.height) - Math.max(wa.y, box.y) > 0;
      expect(overlap, "WhatsApp button overlaps the banner").toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      // Settings panel fits the screen
      await bar.getByRole("button", { name: "Settings" }).click();
      const panel = page.getByRole("dialog", { name: "Cookie settings" });
      const pb = (await panel.boundingBox())!;
      expect(pb.x).toBeGreaterThanOrEqual(0);
      expect(pb.x + pb.width).toBeLessThanOrEqual(w);
      await expect(panel.getByRole("button", { name: "Save choices" })).toBeInViewport();
      await ctx.close();
    });

    test("booking window fits the screen", async ({ page }) => {
      await page.route(/calendly\.com/, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Calendly</title><p>Calendar" }));
      await page.goto("/");
      await page.locator(".hero").getByRole("link", { name: "Book a 30-minute call" }).click();
      const dlg = page.locator("dialog.booking[open]");
      await expect(dlg).toBeVisible();
      const b = (await dlg.boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(w + 0.5);
      await page.keyboard.press("Escape");
      await expect(dlg).toBeHidden();
    });

    test("offer and price cards stay inside the screen", async ({ page }) => {
      for (const route of ["/services/full-stack-development/", "/services/custom-software-development/", "/services/saas-app-development/", "/services/ai-agents-as-a-service/", "/"]) {
        await page.goto(route);
        const boxes = await page.locator(".offer-card, .price-badge, .price-chip").evaluateAll((els) =>
          els
            .filter((e) => getComputedStyle(e).visibility !== "hidden" && e.getBoundingClientRect().width > 0 && !e.closest(".mega"))
            .map((e) => {
              const r = e.getBoundingClientRect();
              return { l: r.left, r: r.right, text: (e.textContent || "").trim().slice(0, 30), clipped: e.scrollWidth > e.clientWidth + 1 };
            }),
        );
        for (const b of boxes) {
          expect(b.l, `${route} ${b.text}`).toBeGreaterThanOrEqual(-0.5);
          expect(b.r, `${route} ${b.text}`).toBeLessThanOrEqual(w + 0.5);
          expect(b.clipped, `${route} ${b.text} clipped`).toBe(false);
        }
      }
    });

    test("code rescue cards reach the fixed state", async ({ page }) => {
      await page.goto("/");
      const hc = page.locator(".hc");
      await hc.scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator(".hc-row.fixed").count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(6);
    });
  });
}

// Jumping to an anchor never hides the heading under the sticky header
for (const [w, h] of [
  [390, 844],
  [1440, 900],
] as const) {
  test(`anchor targets clear the header at ${w}`, async ({ page }) => {
    test.setTimeout(300_000);
    await page.setViewportSize({ width: w, height: h });
    const bad: string[] = [];
    let checked = 0;
    for (const route of ROUTES) {
      await page.goto(route);
      const ids = await page
        .locator('main a[href^="#"]:not([href="#"]):not(.skip)')
        .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!.slice(1)))].filter((id) => document.getElementById(id)));
      for (const id of ids.slice(0, 6)) {
        await page.evaluate((i) => {
          location.hash = "";
          location.hash = i;
        }, id);
        await page.waitForTimeout(700);
        const r = await page.evaluate((i) => {
          const t = document.getElementById(i)!;
          const head = document.querySelector(".header") as HTMLElement | null;
          const hb = head && getComputedStyle(head).position.match(/fixed|sticky/) ? head.getBoundingClientRect().bottom : 0;
          return { top: t.getBoundingClientRect().top, header: hb, end: Math.abs(innerHeight + scrollY - document.documentElement.scrollHeight) < 2 };
        }, id);
        checked++;
        if (!r.end && r.top < r.header - 1) bad.push(`${route}#${id}: top ${Math.round(r.top)} under header ${Math.round(r.header)}`);
      }
    }
    expect(bad).toEqual([]);
    test.info().annotations.push({ type: "anchors checked", description: String(checked) });
  });
}
