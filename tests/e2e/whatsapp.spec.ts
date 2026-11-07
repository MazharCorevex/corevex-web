import { expect, test } from "@playwright/test";

const START = encodeURIComponent("Hi Corevex, can you help me with ");

test("WhatsApp button opens the chat with a start message", async ({ page }, info) => {
  await page.goto("/");
  const wa = page.getByRole("link", { name: /Chat with us on WhatsApp/ });
  await expect(wa).toBeVisible();
  // Desktop: WhatsApp Web is the link fallback; phones open the app
  const want = info.project.name === "desktop" ? `https://web.whatsapp.com/send?phone=923332031151&text=${START}` : `https://wa.me/923332031151?text=${START}`;
  await expect(wa).toHaveAttribute("href", want);
  await expect(wa).toHaveAttribute("target", "_blank");
  await expect(wa).toHaveAttribute("rel", /noopener/);
  // Measure after the pop-in animation settles
  await page.waitForFunction(() => document.querySelector(".wa-chat")!.getAnimations().every((a) => (a as CSSAnimation).animationName !== "wa-in" || a.playState === "finished"));
  const box = (await wa.boundingBox())!;
  const vp = page.viewportSize()!;
  // Bottom right corner, at least 44px to tap
  expect(box.x + box.width).toBeGreaterThan(vp.width - 40);
  expect(box.y + box.height).toBeGreaterThan(vp.height - 40);
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
});

test("WhatsApp button never hides the last footer links", async ({ page }) => {
  await page.goto("/privacy/");
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  const wa = (await page.locator(".wa-chat").boundingBox())!;
  for (const a of await page.locator("footer .legal a").all()) {
    const b = (await a.boundingBox())!;
    const overlap = b.x < wa.x + wa.width && b.x + b.width > wa.x && b.y < wa.y + wa.height && b.y + b.height > wa.y;
    expect(overlap, (await a.textContent()) ?? "").toBe(false);
  }
});

test.describe("WhatsApp on desktop", () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop only");
    // Never reach the real WhatsApp sites from tests
    await page.context().route(/https:\/\/(web\.whatsapp\.com|wa\.me)\//, (r) => r.fulfill({ contentType: "text/html", body: "<title>WhatsApp stub</title>" }));
    await page.goto("/");
  });

  test("tries the installed app first and opens WhatsApp Web when it is missing", async ({ page }) => {
    const popup = page.waitForEvent("popup", { timeout: 5000 });
    await page.locator(".wa-chat").click();
    const web = await popup;
    expect(web.url()).toBe(`https://web.whatsapp.com/send?phone=923332031151&text=${START}`);
    // The site stays where it was
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("does not open WhatsApp Web when the app takes focus", async ({ page }) => {
    let popups = 0;
    page.on("popup", () => popups++);
    await page.locator(".wa-chat").click();
    // The desktop app taking focus blurs this window
    await page.evaluate(() => window.dispatchEvent(new Event("blur")));
    await page.waitForTimeout(2200);
    expect(popups).toBe(0);
  });
});

test("WhatsApp on phones opens the app link", async ({ page }, info) => {
  test.skip(info.project.name === "desktop", "phone only");
  await page.context().route(/https:\/\/(web\.whatsapp\.com|wa\.me)\//, (r) => r.fulfill({ contentType: "text/html", body: "<title>WhatsApp stub</title>" }));
  await page.goto("/");
  const popup = page.waitForEvent("popup");
  await page.locator(".wa-chat").click();
  expect((await popup).url()).toBe(`https://wa.me/923332031151?text=${START}`);
});
