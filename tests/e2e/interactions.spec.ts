import { expect, test } from "@playwright/test";

test.describe("desktop interactions", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop", "desktop only"));

  test("mega menu lists all eight services", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Services" }).click();
    const mega = page.locator(".mega");
    await expect(mega).toBeVisible();
    await expect(mega.locator("a.m[href^='/services/']:not([href*='#'])")).toHaveCount(8);
  });

  test("tech stack tabs switch panels", async ({ page }) => {
    await page.goto("/");
    const tabs = page.locator(".stx-tab");
    await tabs.nth(1).scrollIntoViewIfNeeded();
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#stx-backend")).toBeVisible();
    await expect(page.locator("#stx-frontend")).toBeHidden();
  });

  test("industries accordion opens on click", async ({ page }) => {
    await page.goto("/");
    const items = page.locator(".acc-item");
    await items.nth(2).scrollIntoViewIfNeeded();
    await items.nth(2).click();
    await expect(items.nth(2)).toHaveAttribute("aria-expanded", "true");
    await expect(items.nth(0)).toHaveAttribute("aria-expanded", "false");
  });

  test("3D core is not loaded until scrolled into view", async ({ page }) => {
    const three: string[] = [];
    page.on("request", (r) => {
      if (/three|core-scene/.test(r.url())) three.push(r.url());
    });
    await page.goto("/", { waitUntil: "networkidle" });
    const early = three.length;
    await page.locator(".core").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    expect(early).toBe(0);
    await expect(page.locator(".core")).toHaveClass(/live/, { timeout: 10000 });
  });

  test("contact form steps and server validation", async ({ page }) => {
    await page.goto("/contact/");
    await page.getByRole("button", { name: "Next" }).first().click();
    await page.locator("#c-goal").fill("A customer portal for our clinics.");
    await page.getByRole("button", { name: "Next" }).first().click();
    await page.locator("#c-name").fill("Test Person");
    await page.locator("#c-email").fill("test@example");
    await page.waitForTimeout(2100);
    await page.getByRole("button", { name: /Send my project details/ }).click();
    await expect(page.locator("#email-err")).toContainText("valid email");
    await expect(page.locator("#c-name")).toHaveValue("Test Person");
  });

  test("careers form rejects non PDF CV", async ({ page }) => {
    await page.goto("/careers/");
    await page.locator("#a-cv").setInputFiles({ name: "cv.docx", mimeType: "application/msword", buffer: Buffer.from("hello") });
    await expect(page.locator("#cv-err")).toContainText("PDF");
  });

  test("newsletter shows server error for invalid email", async ({ page }) => {
    await page.goto("/about/");
    await page.locator("#nl").fill("a@b");
    await page.waitForTimeout(2100);
    await page.getByRole("button", { name: "Subscribe" }).click();
    await expect(page.locator(".news [role=alert]")).toContainText("valid email");
  });

  test("honeypot submissions are accepted silently", async ({ page }) => {
    await page.goto("/about/");
    await page.locator("#nl").fill("bot@example.com");
    await page.locator('.news input[name="website"]').fill("spam", { force: true });
    await page.getByRole("button", { name: "Subscribe" }).click();
    await expect(page.locator(".news .form-ok")).toContainText("Subscribed");
  });
});

test.describe("mobile interactions", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "mobile", "mobile only"));

  test("drawer opens and lists services", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const drawer = page.locator(".drawer");
    await expect(drawer).toHaveClass(/is-open/);
    await drawer.locator("summary").click();
    await expect(drawer.locator("details a")).toHaveCount(9);
    await drawer.getByRole("button", { name: "Close menu" }).click();
    await expect(drawer).not.toHaveClass(/is-open/);
  });

  test("tap targets are at least 44px", async ({ page }) => {
    await page.goto("/");
    const small = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("a.btn, button, .orb-chip, .stx-tab, .menu-btn"))
        .filter((el) => el.offsetParent !== null)
        .map((el) => ({ t: el.textContent?.trim().slice(0, 30), h: el.getBoundingClientRect().height }))
        .filter((x) => x.h < 44),
    );
    expect(small).toEqual([]);
  });

  test("3D core never loads on mobile", async ({ page }) => {
    const three: string[] = [];
    page.on("request", (r) => {
      if (/three|core-scene/.test(r.url())) three.push(r.url());
    });
    await page.goto("/");
    await page.locator(".core").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    expect(three).toEqual([]);
  });
});
