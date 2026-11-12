import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "../routes";
import { audit, layout, settle } from "./checks";
import { DEVICES, VIEWPORTS, isTouch, type VP } from "./viewports";

const slug = (r: string) => (r === "/" ? "home" : r.replace(/^\/|\/$/g, "").replace(/\//g, "__"));

// Console noise that is not from the site
const IGNORE = /Download the React DevTools|\[Fast Refresh\]|WebGL|GPU stall|willReadFrequently/i;

async function check(page: Page, vp: VP, route: string, browserName: string, project: string) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if ((m.type() === "error" || m.type() === "warning") && !IGNORE.test(m.text())) errors.push(`${m.type()}: ${m.text().slice(0, 200)}`);
  });
  const res = await page.goto(route, { waitUntil: "load" });
  expect(res?.status()).toBe(200);
  await settle(page);
  // Firefox cannot emulate a coarse pointer; touch sizing is checked where the touch layout applies
  const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
  const touch = isTouch(vp) && (coarse || vp.width <= 1100 || browserName !== "firefox");
  const issues = [
    ...(await audit(page, { touch, desktop: vp.kind === "desktop", home: route === "/", mobile: vp.width < 768 })),
    ...(await layout(page, route, vp.width, vp.height)),
  ];
  if (issues.length || errors.length) {
    const big = await page.evaluate(() => document.documentElement.scrollHeight * devicePixelRatio > 32000);
    await page
      .screenshot({ path: `test-results/responsive/${project}/${vp.name.replace(/\s+/g, "-")}/${slug(route)}.png`, fullPage: !big, timeout: 60_000 })
      .catch(() => null);
  }
  expect(issues, `${route} at ${vp.name} ${vp.width}x${vp.height} in ${browserName}`).toEqual([]);
  expect(errors, "console errors and warnings").toEqual([]);
}

function suite(list: VP[], engineOnly: boolean) {
  for (const vp of list) {
    test.describe(vp.name, () => {
      const touch = isTouch(vp);
      test.use({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr ?? (touch ? 2 : 1),
        hasTouch: touch,
        isMobile: async ({ browserName }, use) => use(touch && browserName !== "firefox"),
      });
      test.beforeEach(({ browserName }) => test.skip(engineOnly && vp.engine !== browserName, `${vp.name} runs in ${vp.engine}`));

      for (const route of ROUTES) {
        test(route, async ({ page, browserName }, info) => {
          test.slow(browserName === "webkit" && vp.width >= 1920);
          await check(page, vp, route, browserName, info.project.name);
        });
      }

      test("menus switch layout", async ({ page }) => {
        await page.goto("/");
        if (vp.width > 1100) {
          await page.getByRole("button", { name: "Services menu" }).first().click();
          const mega = page.locator(".has-mega.is-open .mega");
          await expect(mega).toBeVisible();
          const box = await mega.boundingBox();
          expect(box!.x).toBeGreaterThanOrEqual(-1);
          expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1);
        } else {
          await page.getByRole("button", { name: "Open menu" }).click();
          const drawer = page.getByRole("dialog", { name: "Mobile menu" });
          await expect(drawer).toBeVisible();
          await drawer.locator("summary").first().click();
          await expect(drawer.locator("details[open] a[href^='/services/']").first()).toBeVisible();
          const last = drawer.getByRole("link", { name: "Contact", exact: true });
          await last.scrollIntoViewIfNeeded();
          await expect(last).toBeInViewport();
          await page.keyboard.press("Escape");
          await expect(drawer).toBeHidden();
        }
      });
    });
  }
}

test.describe("widths", () => suite(VIEWPORTS, false));
test.describe("devices", () => suite(DEVICES, true));
