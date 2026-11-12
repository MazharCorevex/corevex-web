import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "../routes";

// Bring lazy content and reveals into their final state
async function ready(page: Page) {
  await page.waitForFunction(() => document.body.classList.contains("header-on"));
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 50));
    }
    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")) {
      el.scrollIntoView({ behavior: "instant" });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    if (document.querySelector(".hc")) for (let i = 0; i < 60 && document.querySelectorAll(".hc-row.fixed").length < 6; i++) await new Promise((r) => setTimeout(r, 100));
    scrollTo({ top: 0, behavior: "instant" });
  });
  // Steady state: pause the quote slider like a reader would, then let finite animations end
  const slider = page.locator(".quotes, .quote-slider").first();
  if (await slider.count()) await slider.hover().catch(() => null);
  await page.waitForTimeout(800);
  await page.evaluate(() => Promise.all(document.getAnimations().filter((x) => x.effect?.getComputedTiming().iterations !== Infinity).map((x) => x.finished.catch(() => null))));
}

for (const route of [...ROUTES, "/this-page-does-not-exist/"]) {
  test(`axe ${route}`, async ({ page }) => {
    await page.goto(route);
    await ready(page);
    const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
    const bad = res.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.impact} ${v.id}: ${v.help} -> ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    expect(bad, route).toEqual([]);
  });

  test(`structure ${route}`, async ({ page }) => {
    await page.goto(route);
    const s = await page.evaluate(() => {
      const hs = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6")].filter((h) => !h.closest("[hidden],[aria-hidden=true]"));
      const levels = hs.map((h) => Number(h.tagName[1]));
      const skips: string[] = [];
      for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) skips.push(`h${levels[i - 1]} -> h${levels[i]} "${hs[i].textContent?.trim().slice(0, 40)}"`);
      const noAlt = [...document.images].filter((i) => !i.hasAttribute("alt")).map((i) => i.src);
      const unlabeled = [...document.querySelectorAll<HTMLInputElement>("input:not([type=hidden]),select,textarea")]
        .filter((f) => !f.closest("[aria-hidden=true]"))
        .filter((f) => !(f.labels?.length || f.getAttribute("aria-label") || f.getAttribute("aria-labelledby")))
        .map((f) => f.name || f.id);
      return { h1: document.querySelectorAll("h1").length, first: levels[0], skips, noAlt, unlabeled };
    });
    expect(s.h1, "exactly one h1").toBe(1);
    expect(s.first, "main starts with h1").toBe(1);
    expect(s.skips, "heading order").toEqual([]);
    expect(s.noAlt, "images without alt").toEqual([]);
    expect(s.unlabeled, "form fields without labels").toEqual([]);
  });
}

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/about/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  const box = await skip.boundingBox();
  expect(box && box.x >= 0 && box.y >= 0).toBe(true);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  const inMain = await page.evaluate(() => !!document.activeElement?.closest("main"));
  expect(inMain).toBe(true);
});

test("focus outline is visible on links, buttons and fields", async ({ page }) => {
  await page.goto("/contact/");
  const missing: string[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a || a === document.body) return null;
      const s = getComputedStyle(a);
      const ok = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 1) || (s.boxShadow && s.boxShadow !== "none");
      return ok ? null : `${a.tagName.toLowerCase()} ${(a.textContent || a.getAttribute("name") || "").trim().slice(0, 30)}`;
    });
    if (r) missing.push(r);
  }
  expect(missing).toEqual([]);
});

test("form errors are announced and tied to fields", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.9.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}` });
  await page.goto("/careers/");
  await page.locator("main form.form").getByLabel("Name").fill("A");
  await page.locator("main form.form").getByLabel("Email", { exact: true }).fill("a@b.co");
  await page.locator("main form.form").getByLabel("LinkedIn or portfolio").fill("https://x.co");
  await page.evaluate(() => {
    const i = document.querySelector<HTMLInputElement>("#a-link")!;
    i.type = "text";
    i.value = "ftp://bad";
  });
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: /Submit application/ }).click();
  const link = page.locator("#a-link");
  await expect(link).toHaveAttribute("aria-invalid", "true");
  await expect(link).toHaveAttribute("aria-describedby", "link-err");
  await expect(page.locator("#link-err")).toBeVisible();
  await expect(page.locator("main form").getByRole("alert")).toBeVisible();
});
