import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "../routes";

type Mail = { kind: string; to?: string | string[]; subject?: string; email?: string; attachments?: number };
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

// Each journey has its own address so the rate limit and outbox stay separate
async function asVisitor(page: Page) {
  const id = uid();
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}` });
  return { id, email: `visitor-${id}@example.com` };
}
async function mail(page: Page, address: string): Promise<Mail[]> {
  const all = (await (await page.request.get("/api/test/outbox/")).json()) as Mail[];
  return all.filter((m) => m.email === address || m.to === address || (m.kind === "email" && m.subject?.includes(address)) || JSON.stringify(m).includes(address));
}
// Forms ignore submissions faster than a human could type
const human = (page: Page) => page.waitForTimeout(2100);

const desktop = (name: string) => name === "desktop";

test.describe("navigation", () => {
  test("header and mega menu reach every main page", async ({ page }, info) => {
    test.skip(!desktop(info.project.name), "desktop header");
    await page.goto("/");
    for (const label of ["Work", "AI Lab", "About", "Careers", "Insights", "Contact"]) {
      await page.locator("header .nav").getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase().replace(" ", "-")}/$`));
      await expect(page.locator("main h1")).toBeVisible();
    }
    await page.getByRole("button", { name: "Services menu" }).click();
    const services = (await page.locator(".mega a[href^='/services/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!))).filter((h, i, all) => /^\/services\/[a-z-]+\/$/.test(h) && all.indexOf(h) === i);
    expect(new Set(services).size).toBe(8);
    for (const href of services) {
      await page.goto("/");
      await page.getByRole("button", { name: "Services menu" }).click();
      await page.locator(`.mega a[href='${href}']`).first().click();
      await expect(page).toHaveURL(new RegExp(href.replace(/\//g, "\\/") + "$"));
      await expect(page.locator("main h1")).toBeVisible();
    }
    await page.locator("header .brand").click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("footer links all open", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator("footer a[href^='/']").evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    expect(hrefs.length).toBeGreaterThan(15);
    for (const href of hrefs) {
      await page.goto("/");
      const link = page.locator(`footer a[href='${href}']`).first();
      await link.scrollIntoViewIfNeeded();
      await link.click();
      await expect(page).toHaveURL(new RegExp(href.split("#")[0].replace(/\//g, "\\/") + "(#.*)?$"));
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("every page is reachable from Home through links", async ({ page }) => {
    const seen = new Set<string>(["/"]);
    const queue = ["/"];
    while (queue.length) {
      const r = queue.shift()!;
      await page.goto(r, { waitUntil: "domcontentloaded" });
      const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!.split("#")[0]));
      for (const h of hrefs) if (h && !seen.has(h) && !h.startsWith("/api/") && !/\.(png|xml|txt|webp|svg)$/.test(h)) {
        seen.add(h);
        queue.push(h);
      }
    }
    expect(ROUTES.filter((r) => !seen.has(r))).toEqual([]);
  });

  test("broken URL shows the 404 page", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("no longer exists");
    await page.getByRole("link", { name: /home/i }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("mobile menu", () => {
  test("opens, navigates and closes", async ({ page }, info) => {
    test.skip(desktop(info.project.name), "mobile drawer");
    await page.goto("/");
    const drawer = page.getByRole("dialog", { name: "Mobile menu" });
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(drawer).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
    await drawer.getByRole("button", { name: "Close menu" }).click();
    await expect(drawer).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    await page.getByRole("button", { name: "Open menu" }).click();
    await drawer.locator("summary").click();
    await drawer.getByRole("link", { name: "Code Rescue and Takeover" }).click();
    await expect(page).toHaveURL(/\/services\/code-rescue\/$/);
    await expect(drawer).toBeHidden();
  });
});

test.describe("forms", () => {
  test("contact: three steps, errors on bad input, then success", async ({ page }) => {
    const v = await asVisitor(page);
    await page.goto("/contact/");
    await expect(page.getByText("Step 1 of 3")).toBeAttached();
    await page.getByLabel("Web app").check({ force: true });
    await page.locator(".fstep.on").getByRole("button", { name: /Next/ }).click();
    // empty details are blocked in the browser
    await page.locator(".fstep.on").getByRole("button", { name: /Next/ }).click();
    await expect(page.getByText("Step 2 of 3")).toBeAttached();
    await page.getByLabel("Goals, users and current tools").fill("A partner portal with billing.");
    await page.locator(".fstep.on").getByRole("button", { name: /Next/ }).click();
    await expect(page.getByText("Step 3 of 3")).toBeAttached();
    await page.getByLabel("Name").fill("Test Visitor");
    await page.getByLabel("Work email").fill("not-an-email@x");
    await human(page);
    await page.getByRole("button", { name: /Send my project details/ }).click();
    await expect(page.locator("#email-err")).toHaveText("Please enter a valid email address.");
    await expect(page.locator("main form").getByRole("alert")).toContainText("Please check the highlighted fields.");
    await expect(page.getByLabel("Work email")).toHaveAttribute("aria-invalid", "true");
    await page.getByLabel("Work email").fill(v.email);
    await page.getByRole("button", { name: /Send my project details/ }).click();
    await expect(page.getByRole("status").filter({ hasText: "Thank you" })).toBeVisible();
    await expect.poll(async () => (await mail(page, v.email)).length).toBe(2);
    const [note] = await mail(page, v.email);
    expect(note.subject).toBe("New enquiry: Web app from Test Visitor");
  });

  test("careers: apply with a PDF CV", async ({ page }) => {
    const v = await asVisitor(page);
    await page.goto("/careers/");
    await page.getByLabel("Name").fill("Test Applicant");
    await page.locator("main form.form").getByLabel("Email", { exact: true }).fill(v.email);
    await page.getByLabel("LinkedIn or portfolio").fill("https://example.com/me");
    await page.getByLabel("CV (PDF, up to 5 MB)").setInputFiles({ name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.7\n%test cv\n") });
    await human(page);
    await page.getByRole("button", { name: /Submit application/ }).click();
    await expect(page.getByRole("status").filter({ hasText: "Application received" })).toBeVisible();
    await expect.poll(async () => (await mail(page, v.email)).length).toBe(2);
    expect((await mail(page, v.email))[0].attachments).toBe(1);
  });

  test("careers: wrong file type and oversized CV are refused", async ({ page }) => {
    await asVisitor(page);
    await page.goto("/careers/");
    const cv = page.getByLabel("CV (PDF, up to 5 MB)");
    await cv.setInputFiles({ name: "cv.docx", mimeType: "application/msword", buffer: Buffer.from("x") });
    await expect(page.locator("#cv-err")).toHaveText("Please upload your CV as a PDF.");
    await cv.setInputFiles({ name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(5 * 1024 * 1024 + 10, 1) });
    await expect(page.locator("#cv-err")).toHaveText("Your CV must be 5 MB or smaller.");
  });

  test("newsletter: subscribe", async ({ page }) => {
    const v = await asVisitor(page);
    await page.goto("/insights/");
    const news = page.locator("form.news");
    await news.scrollIntoViewIfNeeded();
    await news.getByLabel("Email").fill(v.email);
    await human(page);
    await news.getByRole("button", { name: "Subscribe" }).click();
    await expect(news.getByRole("status")).toHaveText("Subscribed. Thank you.");
    await expect.poll(async () => (await mail(page, v.email)).some((m) => m.kind === "contact")).toBe(true);
  });
});

test.describe("booking", () => {
  test("Book a 30-minute call opens the booking window with Calendly inside", async ({ page }) => {
    // Stand-in for Calendly so tests never reach it
    const calls: string[] = [];
    await page.route(/https:\/\/([a-z0-9-]+\.)?calendly\.com\//, (route) => {
      calls.push(route.request().url());
      return route.fulfill({ contentType: "text/html", body: "<title>Calendly stub</title><p>Pick a time</p>" });
    });
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(calls).toEqual([]);
    const btn = page.getByRole("link", { name: "Book a 30-minute call" }).first();
    const href = await btn.getAttribute("href");
    test.skip(!href?.startsWith("https://calendly.com"), "NEXT_PUBLIC_CALENDLY_URL not set for this build");
    await btn.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await btn.click();
    const dialog = page.getByRole("dialog", { name: "Book a 30-minute call" });
    await expect(dialog).toBeVisible();
    const frame = dialog.locator("iframe");
    expect(await frame.getAttribute("src")).toContain("primary_color=48ac9f");
    await expect(frame.contentFrame().getByText("Pick a time")).toBeVisible();
    await expect(dialog.getByRole("status")).toHaveCount(0);
    // A window on the page, not a full-screen takeover
    const box = (await dialog.boundingBox())!;
    const vp = page.viewportSize()!;
    if (vp.width > 860) {
      expect(box.width).toBeLessThan(vp.width - 40);
      expect(box.height).toBeLessThan(vp.height - 40);
    }
    // Page behind does not scroll
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => scrollY)).toBe(before);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(btn).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.classList.contains("booking-open"))).toBe(false);
    // every booking button uses the same wording
    const texts = await page.locator("a[href^='https://calendly.com']").allInnerTexts();
    for (const t of texts) expect(t.trim()).toMatch(/^Book a 30-minute call/);
  });
});

test.describe("insights and content", () => {
  test("filter Insights by each category", async ({ page }) => {
    await page.goto("/insights/");
    const buttons = page.locator("[data-ifilter]");
    const keys = await buttons.evaluateAll((bs) => bs.map((b) => b.getAttribute("data-ifilter")!));
    expect(keys.length).toBeGreaterThan(2);
    for (const k of keys) {
      await page.locator(`[data-ifilter='${k}']`).click();
      await expect(page.locator(`[data-ifilter='${k}']`)).toHaveAttribute("aria-pressed", "true");
      const shown = await page.locator(".mag-feat[data-cat], .mag > a[data-cat]").evaluateAll((cs) =>
        cs.filter((c) => !(c as HTMLElement).hidden).map((c) => (c as HTMLElement).dataset.cat),
      );
      if (k === "all") expect(shown.length).toBeGreaterThan(5);
      else {
        expect(shown.every((c) => c === k)).toBe(true);
        if (!shown.length) await expect(page.locator(".empty-note")).toBeVisible();
      }
    }
  });

  test("open every service, article and case study from their index pages", async ({ page }) => {
    for (const [index, pattern] of [
      ["/services/", /^\/services\/[a-z-]+\/$/],
      ["/insights/", /^\/insights\/[a-z-]+\/$/],
      ["/work/", /^\/work\/[a-z-]+\/$/],
    ] as const) {
      await page.goto(index);
      const hrefs = [...new Set(await page.locator("main a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))].filter((h) => pattern.test(h));
      expect(hrefs.length, index).toBeGreaterThan(5);
      for (const h of hrefs) {
        await page.goto(index);
        await page.locator(`main a[href='${h}']`).first().click();
        await expect(page).toHaveURL(new RegExp(h.replace(/\//g, "\\/") + "$"));
        await expect(page.locator("main h1")).toHaveCount(1);
      }
    }
    await page.goto("/work/");
    await expect(page.getByText("Product design study").first()).toBeVisible();
  });
});

test.describe("keyboard only", () => {
  test("skip link, menu and the contact form without a mouse", async ({ page }, info) => {
    test.skip(!desktop(info.project.name), "keyboard journey on desktop");
    const v = await asVisitor(page);
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);

    // Services menu by keyboard
    await page.getByRole("button", { name: "Services menu" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Services menu" })).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Services menu" })).toHaveAttribute("aria-expanded", "false");

    // Reach Contact by tabbing through the header
    let found = false;
    for (let i = 0; i < 20 && !found; i++) {
      await page.keyboard.press("Tab");
      found = await page.evaluate(() => document.activeElement?.textContent?.trim() === "Contact");
    }
    expect(found).toBe(true);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/contact\/$/);

    // Fill the stepper
    const focusOn = async (label: RegExp | string, max = 40) => {
      for (let i = 0; i < max; i++) {
        await page.keyboard.press("Tab");
        const hit = await page.evaluate(
          (l) => {
            const a = document.activeElement as HTMLElement | null;
            const text = (a?.getAttribute("aria-label") || (a as HTMLInputElement | null)?.labels?.[0]?.textContent || a?.textContent || "").trim();
            return new RegExp(l).test(text);
          },
          typeof label === "string" ? `^${label}$` : label.source,
        );
        if (hit) return;
      }
      throw new Error(`could not tab to ${label}`);
    };
    await focusOn(/^Next/);
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Goals, users and current tools")).toBeFocused();
    await page.keyboard.type("Keyboard only enquiry about a web app.");
    await focusOn(/^Next/);
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Name")).toBeFocused();
    await page.keyboard.type("Key Board");
    await page.keyboard.press("Tab");
    await page.keyboard.type(v.email);
    await human(page);
    await focusOn(/Send my project details/);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status").filter({ hasText: "Thank you" })).toBeVisible();
  });

  test("focus is always visible", async ({ page }, info) => {
    test.skip(!desktop(info.project.name), "desktop");
    await page.goto("/");
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const ring = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement;
        if (!a || a === document.body) return "none";
        const s = getComputedStyle(a);
        const visible = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none";
        return visible ? "ok" : `${a.tagName} ${a.textContent?.trim().slice(0, 30)}`;
      });
      expect(ring).toBe("ok");
    }
  });
});
