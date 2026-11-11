import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Fresh visitor, no stored choice
test.use({ storageState: { cookies: [], origins: [] } });

const analyticsHost = /google-analytics\.com|googletagmanager\.com|analytics\.google\.com|doubleclick\.net/;
const choice = async (page: import("@playwright/test").Page) => (await page.context().cookies()).find((c) => c.name === "cv_consent");

test("banner shows on a first visit and sends no analytics request", async ({ page }) => {
  const hits: string[] = [];
  page.on("request", (r) => {
    if (analyticsHost.test(r.url()) || /calendly\.com/.test(r.url())) hits.push(r.url());
  });
  await page.goto("/");
  const bar = page.getByRole("region", { name: "Cookie consent" });
  await expect(bar).toBeVisible();
  await expect(bar).toContainText("We use cookies to keep the site working and, with your permission, to understand how it’s used.");
  const buttons = bar.getByRole("button");
  await expect(buttons).toHaveText(["Accept all", "Reject non-essential", "Settings"]);
  const sizes = await buttons.evaluateAll((els) => els.map((e) => [Math.round(e.getBoundingClientRect().height), getComputedStyle(e).fontWeight]));
  expect(new Set(sizes.map((s) => s.join())).size).toBe(1);
  // Phones: full width with 44px buttons
  const vp = page.viewportSize()!;
  if (vp.width <= 860) {
    const box = (await bar.boundingBox())!;
    expect(Math.round(box.width)).toBe(vp.width);
    expect(sizes[0][0]).toBeGreaterThanOrEqual(44);
  }
  await page.evaluate(() => scrollTo({ top: 3000, behavior: "instant" }));
  await page.waitForTimeout(1500);
  expect(hits).toEqual([]);
  expect(await choice(page)).toBeUndefined();
});

test("Reject non-essential stores the choice for 6 months and hides the banner", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Reject non-essential" }).click();
  await expect(page.getByRole("region", { name: "Cookie consent" })).toHaveCount(0);
  const c = (await choice(page))!;
  expect(c.value).toMatch(/^a0\.\d+$/);
  const days = (c.expires - Date.now() / 1000) / 86400;
  expect(days).toBeGreaterThan(178);
  expect(days).toBeLessThan(186);
  await page.reload();
  await expect(page.getByRole("region", { name: "Cookie consent" })).toHaveCount(0);
});

test("settings panel: necessary is locked on, analytics off by default, Save choices", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("region", { name: "Cookie consent" }).getByRole("button", { name: "Settings" }).click();
  const panel = page.getByRole("dialog", { name: "Cookie settings" });
  await expect(panel).toBeVisible();
  const nec = panel.getByRole("switch", { name: "Necessary" });
  const ana = panel.getByRole("switch", { name: "Analytics" });
  await expect(nec).toBeChecked();
  await expect(nec).toBeDisabled();
  await expect(ana).not.toBeChecked();
  await ana.check();
  await panel.getByRole("button", { name: "Save choices" }).click();
  await expect(panel).toBeHidden();
  expect((await choice(page))!.value).toMatch(/^a1\./);
});

test("footer Cookie settings reopens the panel, turning analytics off deletes _ga cookies", async ({ page, context }) => {
  await context.addCookies([
    { name: "cv_consent", value: `a1.${Date.now()}`, domain: "localhost", path: "/" },
    { name: "_ga", value: "GA1.1.1.1", domain: "localhost", path: "/" },
    { name: "_ga_TEST", value: "GS1.1.1", domain: "localhost", path: "/" },
  ]);
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Cookie consent" })).toHaveCount(0);
  await page.locator("footer").getByRole("button", { name: "Cookie settings" }).click();
  const panel = page.getByRole("dialog", { name: "Cookie settings" });
  const ana = panel.getByRole("switch", { name: "Analytics" });
  await expect(ana).toBeChecked();
  await ana.uncheck();
  await panel.getByRole("button", { name: "Save choices" }).click();
  const names = (await context.cookies()).map((c) => c.name);
  expect(names).not.toContain("_ga");
  expect(names).not.toContain("_ga_TEST");
  expect((await choice(page))!.value).toMatch(/^a0\./);
});

test("legal pages are linked in the footer", async ({ page }) => {
  await page.goto("/");
  const foot = page.locator("footer");
  await expect(foot.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy/");
  await expect(foot.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/terms/");
  await expect(foot.getByRole("link", { name: "Cookie Policy" })).toHaveAttribute("href", "/cookies/");
});

test("banner and panel pass axe", async ({ page }) => {
  await page.goto("/cookies/");
  await expect(page.getByRole("region", { name: "Cookie consent" })).toBeVisible();
  const a = await new AxeBuilder({ page }).include(".cookie-bar").analyze();
  expect(a.violations.map((v) => v.id)).toEqual([]);
  await page.getByRole("region", { name: "Cookie consent" }).getByRole("button", { name: "Settings" }).click();
  const b = await new AxeBuilder({ page }).include(".cookie-panel").analyze();
  expect(b.violations.map((v) => v.id)).toEqual([]);
});
