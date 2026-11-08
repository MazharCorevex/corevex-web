import { expect, test } from "@playwright/test";

// One page per template; layout breaks show up here first
const PAGES = [
  "/",
  "/services/",
  "/services/code-rescue/",
  "/work/",
  "/work/australian-direct-tutoring/",
  "/insights/",
  "/insights/what-is-rag/",
  "/about/",
  "/careers/",
  "/contact/",
  "/faq/",
  "/ai-lab/",
  "/privacy/",
  "/missing-page/",
];
const SIZES = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1366", width: 1366, height: 768 },
];

for (const size of SIZES) {
  test.describe(size.name, () => {
    test.use({ viewport: { width: size.width, height: size.height }, reducedMotion: "reduce", deviceScaleFactor: 1 });
    for (const route of PAGES) {
      test(route, async ({ page }) => {
        await page.goto(route);
        await page.waitForFunction(() => document.body.classList.contains("header-on"));
        await page.evaluate(async () => {
          document.querySelectorAll<HTMLImageElement>("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
          for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
            scrollTo({ top: y, behavior: "instant" });
            await new Promise((r) => setTimeout(r, 60));
          }
          scrollTo({ top: 0, behavior: "instant" });
          await document.fonts.ready;
          await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => ((i.onload = r), (i.onerror = r))))));
        });
        await page.waitForTimeout(600);
        const name = (route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "__")) + ".png";
        await expect(page).toHaveScreenshot(name, {
          fullPage: true,
          animations: "disabled",
          caret: "hide",
          timeout: 30_000,
          scale: "css",
          maxDiffPixelRatio: 0.01,
          mask: [page.locator(".core canvas"), page.locator("[data-count]")],
        });
      });
    }
  });
}
