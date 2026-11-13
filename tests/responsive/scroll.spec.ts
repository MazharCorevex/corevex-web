import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "../routes";

// Pinned elements over text and words split across lines, checked while scrolling
const SIZES = [
  [360, 780],
  [390, 844],
  [768, 1024],
  [1440, 900],
] as const;

async function scan(page: Page) {
  return page.evaluate(async () => {
    const issues = new Set<string>();
    const label = (el: Element) => {
      const c = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
      return `${el.tagName.toLowerCase()}${c} "${(el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28)}"`;
    };
    const shown = (el: Element) => {
      for (let n: Element | null = el; n; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (s.display === "none" || s.visibility === "hidden" || +s.opacity < 0.05) return false;
      }
      return !el.closest("[inert],[hidden],[aria-hidden=true],.sr,.skip");
    };
    const alpha = (el: Element) => {
      const m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (!m) return 0;
      const p = m[1].split(/[ ,/]+/).filter(Boolean);
      return p.length > 3 ? parseFloat(p[3]) : 1;
    };
    const textRects = (root: Element) => {
      const out: { el: Element; r: DOMRect }[] = [];
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (!n.textContent?.trim()) continue;
        const el = n.parentElement!;
        if (el.closest("script,style,noscript,.marquee") || !shown(el)) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) if (r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight) out.push({ el, r });
      }
      return out;
    };

    // Headings never break inside a word
    for (const h of document.querySelectorAll("h1, h2, h3, .h1, .h2, .display, .tile h3, .numbers b")) {
      if (!shown(h)) continue;
      const w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const t = n.textContent || "";
        // A break after a hyphen is fine; check each hyphen part on its own
        for (const m of t.matchAll(/[^\s\-\u2010-\u2014]{4,}/g)) {
          const range = document.createRange();
          range.setStart(n, m.index!);
          range.setEnd(n, m.index! + m[0].length);
          const tops = new Set([...range.getClientRects()].filter((r) => r.width > 1).map((r) => Math.round(r.top)));
          if (tops.size > 1) issues.add(`word split across lines: "${m[0]}" in ${label(h)}`);
        }
      }
    }

    // Breadcrumb items sit on one line
    const crumbs = [...document.querySelectorAll(".crumbs > a, .crumbs > span")].filter(shown).map((e) => { const r = e.getBoundingClientRect(); return { top: r.top + scrollY, mid: r.top + r.height / 2 }; });
    const firstRow = crumbs.filter((c) => Math.abs(c.top - (crumbs[0]?.top ?? 0)) < 30);
    if (firstRow.length > 1 && Math.max(...firstRow.map((c) => c.mid)) - Math.min(...firstRow.map((c) => c.mid)) > 2) issues.add("breadcrumb items are not aligned");

    // Buttons are never cut off by a clipping container
    for (const b of document.querySelectorAll<HTMLElement>("main button, main .btn")) {
      if (!shown(b) || b.closest(".rail, .swipe, .filters, .marquee, .orbit, .stx-nav, .mq-projects, .table-scroll")) continue;
      const r = b.getBoundingClientRect();
      if (r.width < 1) continue;
      for (let n = b.parentElement; n && n !== document.body; n = n.parentElement) {
        if (getComputedStyle(n).overflowX === "visible") continue;
        const c = n.getBoundingClientRect();
        if (r.right > c.right + 1 || r.left < c.left - 1) issues.add(`button cut off: ${label(b)} in ${label(n)}`);
        break;
      }
    }

    // Absolutely placed images stay within their own frame
    for (const img of document.querySelectorAll("main img")) {
      if (getComputedStyle(img).position !== "absolute" || !shown(img)) continue;
      const box = img.parentElement!.getBoundingClientRect();
      const r = img.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) continue;
      if (r.width > box.width * 1.15 + 2 || r.height > box.height * 1.15 + 2) issues.add(`image larger than its frame: ${label(img.parentElement!)} ${Math.round(r.width)}x${Math.round(r.height)} in ${Math.round(box.width)}x${Math.round(box.height)}`);
    }

    // Pinned elements may cover text only with a solid background
    const pinned = [...document.querySelectorAll<HTMLElement>("body *")].filter((el) => {
      const p = getComputedStyle(el).position;
      return (p === "sticky" || p === "fixed") && shown(el) && !el.closest("dialog") && el.getBoundingClientRect().height > 0;
    });
    const step = Math.max(200, innerHeight * 0.5);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const all = textRects(document.body);
      for (const p of pinned) {
        const pr = p.getBoundingClientRect();
        if (pr.bottom <= 0 || pr.top >= innerHeight) continue;
        // Only the pinned element's own background hides what scrolls under it
        const glass = innerWidth > 860 && getComputedStyle(p).backdropFilter !== "none" && alpha(p) >= 0.6;
        if (alpha(p) >= 0.9 || glass) continue;
        const mine = textRects(p);
        for (const a of mine)
          for (const b of all) {
            if (p.contains(b.el) || b.el.contains(p)) continue;
            const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
            const iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
            if (ix > 4 && iy > 4) issues.add(`pinned ${label(p)} covers ${label(b.el)} at scroll ${Math.round(y)}`);
          }
      }
    }
    scrollTo({ top: 0, behavior: "instant" });
    return [...issues].slice(0, 12);
  });
}

for (const [w, h] of SIZES) {
  test.describe(`${w}x${h}`, () => {
    const touch = w < 1100;
    test.use({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: async ({ browserName }, use) => use(touch && browserName !== "firefox") });

    test("header is solid on phones and tablets", async ({ page }) => {
      test.skip(w > 860, "glass header on desktop");
      await page.goto("/about/");
      const a = await page.locator(".header").evaluate((el) => {
        const m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/)!;
        const p = m[1].split(/[ ,/]+/).filter(Boolean);
        return p.length > 3 ? parseFloat(p[3]) : 1;
      });
      expect(a).toBeGreaterThanOrEqual(0.95);
    });

    test("glass header blurs on desktop", async ({ page }) => {
      test.skip(w <= 860, "solid header on phones and tablets");
      await page.goto("/");
      expect(await page.locator(".header").evaluate((el) => getComputedStyle(el).backdropFilter)).toMatch(/blur/);
    });

    for (const route of ROUTES) {
      test(`scroll ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: "load" });
        await page.waitForFunction(() => document.body.classList.contains("header-on"));
        expect(await scan(page), `${route} at ${w}x${h}`).toEqual([]);
      });
    }
  });
}
