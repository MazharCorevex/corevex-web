import { expect, test, type Page } from "@playwright/test";

// Photos from /images/photos/ visible anywhere on screen
const visiblePhotos = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLImageElement>("img")]
      .filter((i) => {
        const r = i.getBoundingClientRect();
        const s = getComputedStyle(i);
        return /\/images\/photos\//.test(i.currentSrc || i.src) && r.width > 0 && r.bottom > 0 && r.top < innerHeight && s.visibility !== "hidden" && +s.opacity > 0.05;
      })
      .map((i) => i.getAttribute("src")),
  );

test.describe("services page stands on its own", () => {
  test("lists all eight services with no photos", async ({ page }) => {
    await page.goto("/services/");
    const rows = page.locator(".svc-rows .svc-row");
    await expect(rows).toHaveCount(8);
    await expect(page.locator(".svc-rows img")).toHaveCount(0);
    await expect(page.locator(".hover-img, .orbit, .orb-card")).toHaveCount(0);
  });

  test("scrolling or hovering over the list never brings up a photo", async ({ page }) => {
    await page.goto("/services/");
    const first = page.locator(".svc-row").first();
    await first.scrollIntoViewIfNeeded();
    const box = (await first.boundingBox())!;
    await page.mouse.move(box.x + 300, box.y + box.height / 2);
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 160);
      await page.waitForTimeout(150);
      expect(await visiblePhotos(page), `after scroll step ${i + 1}`).toEqual([]);
    }
    for (const row of await page.locator(".svc-row").all()) {
      await row.hover();
      expect(await visiblePhotos(page)).toEqual([]);
    }
  });

  test("arriving from the home page brings nothing with it", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop header link");
    await page.goto("/");
    await page.locator(".orbit a").first().hover({ force: true });
    await page.locator("header .has-mega > a").click();
    await expect(page).toHaveURL(/\/services\/$/);
    await expect(page.locator(".orbit, .orb-card, .hero, .core")).toHaveCount(0);
    expect(await visiblePhotos(page)).toEqual([]);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });
});
