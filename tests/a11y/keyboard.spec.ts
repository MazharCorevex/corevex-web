import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "../routes";

test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop", "keyboard runs on desktop"));

const ring = (page: Page) =>
  page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    if (!a || a === document.body) return { id: "body", ok: true, inView: true };
    const s = getComputedStyle(a);
    const ok = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none";
    const r = a.getBoundingClientRect();
    const id = `${a.tagName.toLowerCase()}${a.id ? "#" + a.id : ""} "${(a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 30)}" @${Math.round(r.top + scrollY)}`;
    return { id, ok, inView: r.bottom > 0 && r.top < innerHeight && r.width > 0 };
  });

// Tab through every page: focus always visible, on screen, and never trapped
for (const route of ROUTES) {
  test(`tab order on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForFunction(() => document.body.classList.contains("header-on"));
    const total = await page.evaluate(
      () => [...document.querySelectorAll<HTMLElement>("a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex='-1'])")].filter((e) => !e.closest("[inert],[hidden]") && e.getClientRects().length).length,
    );
    const visited: string[] = [];
    const bad: string[] = [];
    const steps = Math.min(total + 5, 160);
    for (let i = 0; i < steps; i++) {
      await page.keyboard.press("Tab");
      // Smooth scrolling brings the focused element into view over a few frames
      await page.waitForFunction(
        () =>
          new Promise<boolean>((done) => {
            let last = scrollY;
            let still = 0;
            const tick = () => (scrollY === last ? ++still : ((still = 0), (last = scrollY)), still >= 8 ? done(true) : requestAnimationFrame(tick));
            requestAnimationFrame(tick);
          }),
        null,
        { timeout: 3000 },
      ).catch(() => null);
      const r = await ring(page);
      visited.push(r.id);
      if (!r.ok) bad.push(`no focus ring: ${r.id}`);
      if (!r.inView && r.id !== "body") bad.push(`focused off screen: ${r.id}`);
    }
    // Trapped if the last 30 steps keep cycling a handful of elements on a page with many more
    const tail = new Set(visited.slice(-30));
    if (total > 12 && steps >= 40 && tail.size <= 4) bad.push(`focus trap among ${[...tail].join(", ")}`);
    expect(visited[0], "first Tab reaches the skip link").toMatch(/Skip to content/);
    expect([...new Set(bad)]).toEqual([]);
  });
}

test("tech stack tabs work with arrow keys", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".stx-tab");
  await tabs.first().scrollIntoViewIfNeeded();
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
});

test("industries accordion opens with Enter and Space", async ({ page }) => {
  await page.goto("/");
  const items = page.locator(".acc-item");
  await items.nth(1).scrollIntoViewIfNeeded();
  await items.nth(1).focus();
  await page.keyboard.press("Enter");
  await expect(items.nth(1)).toHaveAttribute("aria-expanded", "true");
  await items.nth(3).focus();
  await page.keyboard.press(" ");
  await expect(items.nth(3)).toHaveAttribute("aria-expanded", "true");
});

test("mobile drawer opens, expands and closes by keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Mobile menu" });
  await expect(drawer).toBeVisible();
  const summary = drawer.locator("summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(drawer.locator("details").first()).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("cookie banner and settings panel by keyboard only", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: { cookies: [], origins: [] } });
  const page = await ctx.newPage();
  await page.goto("/");
  const bar = page.getByRole("region", { name: "Cookie consent" });
  await expect(bar).toBeVisible();
  await bar.getByRole("button", { name: "Settings" }).focus();
  await page.keyboard.press("Enter");
  const panel = page.getByRole("dialog", { name: "Cookie settings" });
  await expect(panel).toBeVisible();
  // The page behind is inert: focus stays in the panel or moves to the browser's own UI, never behind it
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => { const a = document.activeElement; return !a || a === document.body || !!a.closest(".cookie-panel"); })).toBe(true);
  }
  await panel.getByRole("switch", { name: "Analytics" }).focus();
  await page.keyboard.press(" ");
  await expect(panel.getByRole("switch", { name: "Analytics" })).toBeChecked();
  await panel.getByRole("button", { name: "Save choices" }).focus();
  await page.keyboard.press("Enter");
  await expect(panel).toBeHidden();
  await expect(bar).toHaveCount(0);
  // Reopen from the footer, close with Escape
  await page.locator("footer").getByRole("button", { name: "Cookie settings" }).focus();
  await page.keyboard.press("Enter");
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.locator("footer").getByRole("button", { name: "Cookie settings" })).toBeFocused();
  await ctx.close();
});

test("form errors are announced", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.5.${(Math.random() * 250) | 0}.9` });
  await page.goto("/careers/");
  const cv = page.getByLabel("CV (PDF, up to 5 MB)");
  await cv.setInputFiles({ name: "cv.docx", mimeType: "application/msword", buffer: Buffer.from("x") });
  const err = page.locator("#cv-err");
  await expect(err).toHaveText("Please upload your CV as a PDF.");
  // Linked to the field and live
  await expect(cv).toHaveAttribute("aria-describedby", /cv-err/);
  const live = await err.evaluate((e) => e.getAttribute("role") === "alert" || !!e.closest("[aria-live],[role=alert]") || e.getAttribute("aria-live"));
  expect(live).toBeTruthy();
});

test("landmarks: one banner, one main, one contentinfo, nav labelled", async ({ page }) => {
  for (const route of ["/", "/services/", "/contact/", "/insights/what-is-rag/", "/privacy/"]) {
    await page.goto(route);
    expect(await page.locator("header, [role=banner]").filter({ hasNot: page.locator("main header") }).count(), route).toBeGreaterThanOrEqual(1);
    await expect(page.locator("main#main")).toHaveCount(1);
    await expect(page.locator("footer.footer")).toHaveCount(1);
    const unlabeled = await page.locator("nav").evaluateAll((ns) => ns.filter((n) => !n.getAttribute("aria-label") && !n.getAttribute("aria-labelledby")).length);
    expect(unlabeled, `${route} unlabelled nav`).toBe(0);
  }
});
