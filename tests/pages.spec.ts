import { expect, test, type Page } from "@playwright/test";
import { EXTRA_WIDTHS, LANDSCAPE, ROUTES } from "./routes";

const IGNORE = [/Download the React DevTools/, /favicon/];

function watch(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !IGNORE.some((r) => r.test(m.text()))) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
}

async function overflow(page: Page) {
  return page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const offenders: string[] = [];
    if (sw > w) {
      document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > w + 1 && getComputedStyle(el).position !== "fixed" && !el.closest(".rail,.marquee,.orbit,.stx-nav,.filters,.table-scroll,.drawer,.sheet,.mega"))
          offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ${Math.round(r.right)}`);
      });
    }
    return { w, sw, offenders: offenders.slice(0, 8) };
  });
}

for (const route of ROUTES) {
  const name = route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "__");

  test(`page ${route}`, async ({ page }, info) => {
    const errors = watch(page);
    const res = await page.goto(route, { waitUntil: "networkidle" });
    expect(res?.status(), "status").toBe(200);
    await settle(page);
    const o = await overflow(page);
    expect(o.sw, `horizontal overflow at ${o.w}px: ${o.offenders.join(", ")}`).toBeLessThanOrEqual(o.w);
    await page.screenshot({ path: `test-results/screens/${info.project.name}/${name}.png`, fullPage: true });
    expect(errors, "console errors").toEqual([]);
  });
}

test.describe("other widths and landscape", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "1366", "runs once"));
  for (const route of ROUTES) {
    test(`overflow ${route}`, async ({ page }) => {
      const sizes = [...EXTRA_WIDTHS.map((w) => ({ width: w, height: 900 })), ...LANDSCAPE];
      for (const s of sizes) {
        await page.setViewportSize(s);
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(150);
        const o = await overflow(page);
        expect(o.sw, `overflow at ${s.width}x${s.height}: ${o.offenders.join(", ")}`).toBeLessThanOrEqual(o.w);
      }
    });
  }
});

test("404 returns branded page", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("no longer exists");
});
