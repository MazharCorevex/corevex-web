import { test } from "@playwright/test";
import { ROUTES } from "../routes";
import { settle } from "../responsive/checks";

const slug = (r: string) => (r === "/" ? "home" : r.replace(/^\/|\/$/g, "").replace(/\//g, "__"));

for (const [w, h] of [
  [390, 844],
  [768, 1024],
  [1440, 900],
] as const) {
  test.describe(`${w}`, () => {
    test.use({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    for (const route of ROUTES) {
      test(route, async ({ page }, info) => {
        await page.goto(route, { waitUntil: "load" });
        await settle(page);
        await page.screenshot({ path: `tests/screenshots/${info.project.name}/${w}/${slug(route)}.jpg`, fullPage: true, type: "jpeg", quality: 70, animations: "disabled", timeout: 120_000 });
      });
    }
  });
}
