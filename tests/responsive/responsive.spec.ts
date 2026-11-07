import { expect, test } from "@playwright/test";
import { ROUTES } from "../routes";
import { audit, layout, settle } from "./checks";
import { VIEWPORTS, isTouch } from "./viewports";

const slug = (r: string) => (r === "/" ? "home" : r.replace(/^\/|\/$/g, "").replace(/\//g, "__"));

for (const vp of VIEWPORTS) {
  test.describe(vp.name, () => {
    const touch = isTouch(vp);
    test.use({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: touch,
      isMobile: async ({ browserName }, use) => use(touch && browserName !== "firefox"),
    });

    for (const route of ROUTES) {
      test(route, async ({ page, browserName }, info) => {
        // WebKit full-page captures at 1920+ are slow
        test.slow(browserName === "webkit" && vp.width >= 1920);
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        const res = await page.goto(route, { waitUntil: "load" });
        expect(res?.status()).toBe(200);
        await settle(page);
        // Firefox cannot emulate a coarse pointer; touch sizing is checked where the touch layout applies
        const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
        const touchCheck = touch && (coarse || vp.width <= 1100 || browserName !== "firefox");
        const issues = [
          ...(await audit(page, { touch: touchCheck, desktop: vp.kind === "desktop", home: route === "/" })),
          ...(await layout(page, route, vp.width, vp.height)),
        ];
        const tall = await page.evaluate(() => document.documentElement.scrollHeight > 30000);
        const shot = `test-results/responsive/${info.project.name}/${vp.name}/${slug(route)}.png`;
        try {
          // 2x pixel density can push long pages past WebKit's 32767px capture limit
          const big = await page.evaluate(() => document.documentElement.scrollHeight * devicePixelRatio > 32000);
          await page.screenshot({ path: shot, fullPage: !tall, timeout: 60_000, ...(big ? { scale: "css" as const } : {}) });
        } catch (e) {
          if (!String(e).includes("32767")) throw e;
          // Canvas larger than the document: report what stretches it
          const why = await page.evaluate(() => {
            const all = [...document.querySelectorAll("body, body *")].map((el) => {
              const r = el.getBoundingClientRect();
              return { el, b: Math.round(r.bottom + scrollY), h: Math.round(r.height), sh: el.scrollHeight };
            });
            const name = (el: Element) => `${el.tagName.toLowerCase()}.${String((el as HTMLElement).className?.toString?.() || "").split(" ")[0]}`;
            const top = (k: "b" | "h" | "sh") => [...all].sort((a, b) => b[k] - a[k]).slice(0, 4).map((x) => `${name(x.el)}=${x[k]}`).join(" ");
            return `doc ${document.documentElement.scrollHeight}, body ${document.body.scrollHeight}; bottom: ${top("b")}; height: ${top("h")}; scrollHeight: ${top("sh")}`;
          });
          issues.push(`full-page capture over 32767px: ${why}`);
          await page.screenshot({ path: shot });
        }
        expect(issues, `${route} at ${vp.name} in ${browserName}`).toEqual([]);
        expect(errors, "page errors").toEqual([]);
      });
    }

    test("menus switch layout", async ({ page }) => {
      await page.goto("/");
      if (vp.width > 1100) {
        await page.getByRole("button", { name: "Services" }).first().click();
        const mega = page.locator(".has-mega.is-open .mega");
        await expect(mega).toBeVisible();
        const box = await mega.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(-1);
        expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1);
      } else {
        await page.getByRole("button", { name: "Open menu" }).click();
        const drawer = page.getByRole("dialog", { name: "Mobile menu" });
        await expect(drawer).toBeVisible();
        const last = drawer.getByRole("link", { name: "Contact", exact: true });
        await last.scrollIntoViewIfNeeded();
        await expect(last).toBeInViewport();
        await page.keyboard.press("Escape");
        await expect(drawer).toBeHidden();
      }
    });
  });
}
