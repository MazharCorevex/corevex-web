import type { Page } from "@playwright/test";

// Scroll through so lazy images and reveals settle
export async function settle(page: Page) {
  await page.waitForFunction(() => document.body.classList.contains("header-on"));
  await page.evaluate(async () => {
    document.querySelectorAll<HTMLImageElement>("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
    const step = Math.max(200, innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 70));
    }
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal=load]):not(.is-in)")) {
      el.scrollIntoView({ block: "start", behavior: "instant" });
      await frame();
      await new Promise((r) => setTimeout(r, 30));
    }
    // let one-off animations finish
    const hc = document.querySelector(".hc");
    if (hc) for (let i = 0; i < 60 && document.querySelectorAll(".hc-row.fixed").length < 6; i++) await new Promise((r) => setTimeout(r, 100));
    scrollTo({ top: 0, behavior: "instant" });
    await Promise.all(
      [...document.images].map((i) =>
        i.complete ? null : new Promise((r) => ((i.onload = r), (i.onerror = r), setTimeout(r, 4000))),
      ),
    );
  });
  await page.waitForTimeout(1200);
}

export type Opts = { touch: boolean; desktop: boolean; home: boolean };

// Layout audit, runs in the page
export async function audit(page: Page, opts: Opts) {
  return page.evaluate((o) => {
    const issues: string[] = [];
    const vw = document.documentElement.clientWidth;
    const vh = innerHeight;
    const cs = (el: Element) => getComputedStyle(el);
    const label = (el: Element) => {
      const c = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
      const t = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 30);
      return `${el.tagName.toLowerCase()}${c}${t ? ` "${t}"` : ""}`;
    };
    const hidden = (el: Element): boolean => {
      if (el.closest("[inert],[hidden],[aria-hidden=true],.drawer:not(.is-open),.mega,.sheet:not(.is-open),noscript,.skip,.sr")) return true;
      const d = el.closest("details:not([open])");
      if (d && !el.closest("summary")) return true;
      for (let n: Element | null = el; n; n = n.parentElement) {
        const s = cs(n);
        if (s.display === "none" || s.visibility === "hidden" || +s.opacity < 0.05) return true;
      }
      const r = el.getBoundingClientRect();
      return r.width < 1 || r.height < 1;
    };
    // Visible part of an element after clipping ancestors
    const clipRect = (el: Element) => {
      const r = el.getBoundingClientRect();
      let l = r.left, t = r.top, rt = r.right, b = r.bottom;
      for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
        const s = cs(n);
        const cx = s.overflowX !== "visible", cy = s.overflowY !== "visible";
        if (cx || cy) {
          const p = n.getBoundingClientRect();
          if (cx) { l = Math.max(l, p.left); rt = Math.min(rt, p.right); }
          if (cy) { t = Math.max(t, p.top); b = Math.min(b, p.bottom); }
        }
        if (s.position === "fixed") break;
      }
      return { l, t, r: rt, b, w: rt - l, h: b - t };
    };

    // Overflow
    const sw = document.documentElement.scrollWidth;
    if (sw > vw) issues.push(`horizontal scroll: scrollWidth ${sw} > ${vw}`);
    const all = [...document.body.querySelectorAll<HTMLElement>("body *")];
    let past = 0;
    for (const el of all) {
      if (past > 6) break;
      if (["SCRIPT", "STYLE", "BR", "svg", "path", "g"].includes(el.tagName) || hidden(el)) continue;
      const v = clipRect(el);
      if (v.w <= 0 || v.h <= 0) continue;
      if (v.r > vw + 1 || v.l < -1) {
        issues.push(`past viewport edge: ${label(el)} visible ${Math.round(v.l)}..${Math.round(v.r)} of ${vw}`);
        past++;
      }
    }

    // Text boxes
    type Box = { el: Element; l: number; t: number; r: number; b: number };
    const boxes: Box[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent || !n.textContent.trim()) continue;
      const el = n.parentElement!;
      if (el.closest("script,style,noscript,.marquee,.sr-only,.visually-hidden,.skip,title") || hidden(el)) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const rr of range.getClientRects()) {
        if (rr.width < 2 || rr.height < 2) continue;
        const v = clipRect(el);
        const l = Math.max(rr.left, v.l), r = Math.min(rr.right, v.r), t = Math.max(rr.top, v.t), b = Math.min(rr.bottom, v.b);
        if (r - l > 2 && b - t > 2) boxes.push({ el, l, t, r, b });
      }
    }
    // Text on text
    const seen = new Set<string>();
    for (let i = 0; i < boxes.length; i++) {
      const a = boxes[i];
      for (let j = i + 1; j < boxes.length; j++) {
        const c = boxes[j];
        if (a.el === c.el || a.el.contains(c.el) || c.el.contains(a.el)) continue;
        const ix = Math.min(a.r, c.r) - Math.max(a.l, c.l);
        const iy = Math.min(a.b, c.b) - Math.max(a.t, c.t);
        const minH = Math.min(a.b - a.t, c.b - c.t);
        if (ix > 4 && iy > Math.max(4, minH * 0.35)) {
          // stacked layers inside one positioned card are compared by paint order only when both are visible
          const key = label(a.el) + "|" + label(c.el);
          if (!seen.has(key)) {
            seen.add(key);
            issues.push(`text overlap: ${label(a.el)} with ${label(c.el)}`);
          }
        }
      }
      if (seen.size > 6) break;
    }

    // Headings clipped
    for (const h of document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6")) {
      if (hidden(h)) continue;
      const s = cs(h);
      const clipsX = s.overflowX !== "visible" && h.scrollWidth > h.clientWidth + 1;
      const clipsY = s.overflowY !== "visible" && h.scrollHeight > h.clientHeight + 2;
      const ell = s.textOverflow === "ellipsis" && h.scrollWidth > h.clientWidth;
      const clamp = s.webkitLineClamp && s.webkitLineClamp !== "none" && h.scrollHeight > h.clientHeight + 2;
      const r = h.getBoundingClientRect();
      const v = clipRect(h);
      const cut = r.width > 0 && v.w > 0 && v.w < r.width - 2 && !h.closest(".rail,.orbit,.stx-nav,.filters,.table-scroll,.swipe");
      if (clipsX || clipsY || ell || clamp || cut) issues.push(`heading clipped: ${label(h)}`);
    }

    // Hero headline against art
    if (o.home) {
      const h1 = document.querySelector(".hero h1");
      const art = [...document.querySelectorAll(".hero .hero-art .orb-in, .hero .hero-art .mark, .hero .hero-art img")].filter((e) => !hidden(e));
      if (h1) {
        const hb = boxes.filter((b) => h1.contains(b.el));
        for (const a of art) {
          const ar = a.getBoundingClientRect();
          if (hb.some((b) => Math.min(b.r, ar.right) - Math.max(b.l, ar.left) > 2 && Math.min(b.b, ar.bottom) - Math.max(b.t, ar.top) > 2))
            issues.push(`hero headline overlaps art: ${label(a)}`);
        }
      }
    }

    // Touch targets and input size
    if (o.touch) {
      let n = 0;
      for (const el of document.querySelectorAll<HTMLElement>("a[href],button,input:not([type=hidden]),select,textarea,summary,[role=tab],[role=button]")) {
        if (n > 8) break;
        if (hidden(el) || el.closest(".hp,[aria-hidden=true]") || el.classList.contains("skip")) continue;
        if (el.matches("input[type=checkbox],input[type=radio]") && el.closest("label")) continue;
        const s = cs(el);
        const inline = el.tagName === "A" && s.display === "inline" && el.closest("p,li,td,dd,figcaption,.prose,.legal-page");
        if (inline) continue;
        let r = el.getBoundingClientRect();
        if (el.matches("input[type=file]")) r = (el.closest("label,.field,.drop") || el).getBoundingClientRect();
        if (r.width < 43.5 || r.height < 43.5) {
          issues.push(`tap target ${Math.round(r.width)}x${Math.round(r.height)}: ${label(el)}`);
          n++;
        }
      }
      for (const el of document.querySelectorAll<HTMLElement>("input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea")) {
        if (hidden(el) || el.closest(".hp")) continue;
        const fs = parseFloat(cs(el).fontSize);
        if (fs < 16) issues.push(`input font ${fs}px: ${label(el)} ${el.getAttribute("name") || ""}`);
      }
    }

    // Images
    for (const img of document.images) {
      if (img.closest("noscript")) continue;
      const src = img.currentSrc || img.src;
      if (img.complete && img.naturalWidth === 0 && src) issues.push(`image failed: ${src}`);
      const fill = img.dataset.nimg === "fill";
      if (!fill && (!img.getAttribute("width") || !img.getAttribute("height"))) issues.push(`image without width/height: ${src}`);
      if (hidden(img) || !img.naturalWidth || /\.svg/.test(src)) continue;
      const s = cs(img);
      if (s.objectFit === "fill") {
        const r = img.getBoundingClientRect();
        const ratio = r.width / r.height / (img.naturalWidth / img.naturalHeight);
        if (Math.abs(ratio - 1) > 0.03) issues.push(`image distorted ${ratio.toFixed(2)}: ${src}`);
      }
    }

    // Hero height on desktop
    if (o.desktop) {
      if (o.home) {
        const hero = document.querySelector(".hero");
        if (hero && hero.getBoundingClientRect().bottom > vh + 2) issues.push(`home hero taller than screen: ${Math.round(hero.getBoundingClientRect().bottom)} > ${vh}`);
      }
      const h1 = document.querySelector("main h1");
      if (h1 && h1.getBoundingClientRect().bottom > vh) issues.push(`h1 below the first screen`);
    }
    // Content left hidden after scrolling
    const stuck = [...document.querySelectorAll("[data-reveal]:not([data-reveal=load])")].filter((e) => !e.classList.contains("is-in") && !e.closest("[hidden],.drawer,.mega,.sheet,details:not([open])"));
    if (stuck.length) issues.push(`${stuck.length} block(s) never revealed: ${stuck.slice(0, 3).map(label).join(", ")}`);
    return issues;
  }, opts);
}

// Component layout per size
export async function layout(page: Page, route: string, w: number, h: number) {
  return page.evaluate(
    ({ route, w, h }) => {
      const issues: string[] = [];
      const s = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el) : null;
      };
      const shown = (sel: string) => {
        const st = s(sel);
        return !!st && st.display !== "none" && st.visibility !== "hidden";
      };
      const mobileNav = w <= 1100;
      if (shown(".header .nav") === mobileNav) issues.push(`main nav ${mobileNav ? "visible" : "hidden"} at ${w}`);
      if (shown(".menu-btn") !== mobileNav) issues.push(`menu button ${mobileNav ? "hidden" : "visible"} at ${w}`);
      const cols = (sel: string) => (s(sel)?.gridTemplateColumns || "").split(" ").filter(Boolean).length;
      const ft = cols(".foot-top");
      const wantFt = w > 1100 ? 6 : w > 860 ? 3 : 2;
      if (ft && ft !== wantFt) issues.push(`footer has ${ft} columns, expected ${wantFt}`);
      if (route === "/") {
        const narrow = w <= 860;
        const orbit = s(".orbit");
        if (orbit) {
          const row = orbit.display === "flex" && orbit.overflowX === "auto";
          const rowWanted = narrow || h <= 520;
          if (row !== rowWanted) issues.push(`orbit ${rowWanted ? "should be a swipe row" : "should orbit"} at ${w}`);
        }
        const nav = s(".stx-nav");
        if (nav) {
          const row = nav.display === "flex" && nav.overflowX === "auto";
          if (row !== narrow) issues.push(`tech tabs ${narrow ? "should scroll in a row" : "should be a column"} at ${w}`);
        }
        const acc = s(".acc");
        if (acc && (acc.flexDirection === "column") !== narrow) issues.push(`industries accordion direction ${acc.flexDirection} at ${w}`);
      }
      if (route === "/insights/") {
        const f = s(".filters");
        if (!f || f.position !== "sticky") issues.push(`insights filter bar not sticky at ${w}`);
        const fw = document.querySelector(".filters .wrap");
        if (fw && fw.scrollWidth > fw.clientWidth && getComputedStyle(fw).overflowX !== "auto") issues.push("filter chips overflow without scrolling");
      }
      return issues;
    },
    { route, w, h },
  );
}
