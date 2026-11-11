import { expect, test, type Page } from "@playwright/test";

const trigger = (page: Page) => page.getByRole("button", { name: "Services menu" });
const panel = (page: Page) => page.locator("#services-menu");
const label = (page: Page) => page.locator("header .has-mega > a");
const dim = (page: Page) => page.evaluate(() => getComputedStyle(document.body, "::after").opacity);

async function hoverOpen(page: Page) {
  await page.mouse.move(5, 400);
  await label(page).hover();
  await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
  await expect(panel(page)).toBeVisible();
}

test.describe("services mega menu, desktop", () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop only");
    await page.goto("/");
  });

  test("opens on hover and closes when the pointer leaves", async ({ page }) => {
    await hoverOpen(page);
    await expect.poll(() => dim(page)).toBe("1");
    // Moving into the panel keeps it open
    const box = (await panel(page).boundingBox())!;
    // One hop through the header gap, well inside the 250 ms grace period
    await page.mouse.move(box.x + 40, box.y + 40, { steps: 2 });
    await page.waitForTimeout(400);
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height + 120, { steps: 5 });
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
    await expect(panel(page)).toBeHidden();
    await expect.poll(() => dim(page)).toBe("0");
  });

  test("closes on Escape and returns focus to the trigger", async ({ page }) => {
    await trigger(page).focus();
    await page.keyboard.press("Enter");
    await expect(panel(page)).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(panel(page).getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(panel(page).getByRole("link").nth(1)).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel(page)).toBeHidden();
    await expect(trigger(page)).toBeFocused();
    await page.keyboard.press("Space");
    await expect(panel(page)).toBeVisible();
    await page.keyboard.press("Space");
    await expect(panel(page)).toBeHidden();
  });

  test("closes on a click outside", async ({ page }) => {
    await hoverOpen(page);
    await page.mouse.click(700, 760);
    await expect(panel(page)).toBeHidden();
  });

  test("closes on scroll", async ({ page }) => {
    await trigger(page).click();
    await expect(panel(page)).toBeVisible();
    await page.mouse.wheel(0, 300);
    await expect(panel(page)).toBeHidden();
  });

  test("closes when a link inside is clicked", async ({ page }) => {
    await hoverOpen(page);
    await panel(page).getByRole("link", { name: /Code Rescue/ }).click();
    await expect(page).toHaveURL(/\/services\/code-rescue\/$/);
    await expect(panel(page)).toBeHidden();
  });

  test("the Services label goes to the services page", async ({ page }) => {
    await label(page).click();
    await expect(page).toHaveURL(/\/services\/$/);
    await expect(panel(page)).toBeHidden();
  });

  test("lists the two groups and a link to all services", async ({ page }) => {
    await trigger(page).click();
    await expect(panel(page).getByRole("heading", { name: "Build" })).toBeVisible();
    await expect(panel(page).getByRole("heading", { name: "Intelligence" })).toBeVisible();
    for (const name of ["Custom Software", "Full-Stack", "Mobile Apps", "SaaS", "Code Rescue", "AI and LLM", "AI Automation", "AI Agents as a Service"]) {
      await expect(panel(page).locator("a.m b", { hasText: new RegExp(`^${name}(\\s*from \\$[\\d,]+)?$`, "i") })).toBeVisible();
    }
    await expect(panel(page).getByRole("link", { name: /View all services/ })).toHaveAttribute("href", "/services/");
  });

  for (const [w, h] of [[1366, 768], [1280, 600], [1440, 900], [1920, 1080], [1280, 520]]) {
    test(`never covers more than 70% of a ${w}x${h} screen`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await trigger(page).click();
      await expect(panel(page)).toBeVisible();
      await page.waitForTimeout(300);
      const box = (await panel(page).boundingBox())!;
      expect(box.height).toBeLessThanOrEqual(h * 0.7 + 1);
      expect(box.height).toBeLessThanOrEqual(601);
      expect(box.width).toBeLessThan(w);
      const pos = await panel(page).evaluate((el) => getComputedStyle(el).position);
      expect(pos).not.toBe("fixed");
      // The page stays visible below
      expect(box.y + box.height).toBeLessThan(h);
    });
  }
});

test.describe("services menu on touch and small screens", () => {
  test("no hover menu below 1024px", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop pointer");
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto("/");
    await expect(trigger(page)).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  test("the drawer Services accordion expands in place at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Mobile menu" });
    await expect(drawer).toBeVisible();
    const work = drawer.getByRole("link", { name: "Work", exact: true });
    const before = (await work.boundingBox())!.y;
    const summary = drawer.locator("summary", { hasText: "Services" });
    await summary.click();
    const svc = drawer.getByRole("link", { name: "Code Rescue and Takeover" });
    await expect(svc).toBeVisible();
    await expect(drawer.getByRole("link", { name: "All services" })).toBeVisible();
    // Links push the rest of the drawer down rather than overlaying it
    expect((await work.boundingBox())!.y).toBeGreaterThan(before + 200);
    await summary.click();
    await expect(svc).toBeHidden();
    expect(Math.abs((await work.boundingBox())!.y - before)).toBeLessThan(2);
    await summary.click();
    await svc.click();
    await expect(page).toHaveURL(/\/services\/code-rescue\/$/);
    await expect(drawer).toBeHidden();
  });
});
