import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { ROUTES } from "../routes";

test("rendered pages follow every copy rule", () => {
  const out = execFileSync("node", ["scripts/content-check.mjs", "http://localhost:3100"], { encoding: "utf8" });
  expect(out).toMatch(/OK: \d+ pages clean/);
});

test("every booking button says Book a 30-minute call", async ({ page }) => {
  const wrong: string[] = [];
  for (const r of ROUTES) {
    await page.goto(r, { waitUntil: "domcontentloaded" });
    const links = await page.locator("a").evaluateAll((as) =>
      as.map((a) => ({ text: (a.textContent || "").replace(/\s+/g, " ").replace("»", "").trim(), href: a.getAttribute("href") || "" })),
    );
    for (const l of links) {
      const booking = /calendly\.com/.test(l.href) || /#call$/.test(l.href) || /\bbook\b.*\bcall\b/i.test(l.text);
      if (booking && l.text !== "Book a 30-minute call") wrong.push(`${r}: "${l.text}" -> ${l.href}`);
    }
  }
  expect(wrong).toEqual([]);
});

test("design studies are labelled and never shown as client work", async ({ page }) => {
  for (const r of ["/", "/work/", ...ROUTES.filter((x) => x.startsWith("/work/") && x !== "/work/")]) {
    await page.goto(r, { waitUntil: "domcontentloaded" });
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    expect(text, r).toContain("Product design study");
    expect(text, r).not.toMatch(/\b(Design study|Concept)\b(?! study)/);
    expect(text, r).not.toMatch(/\b(our client|client said|case study results)\b/i);
  }
});

test("company facts match CLAUDE.md", async ({ page }) => {
  await page.goto("/about/", { waitUntil: "domcontentloaded" });
  const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
  for (const fact of ["PSEB", "50+", "Mazhar H", "M Azhar", "Zafar H", "CEO and Founder", "Solution Architect", "Chief Operating Officer"]) expect(text).toContain(fact);
  expect(await page.locator("[data-count]").evaluateAll((els) => els.map((e) => e.getAttribute("data-count")))).toContain("2022");
});

test("no em dash, bracket placeholder or 20-minute wording in source copy", () => {
  const bad: string[] = [];
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx|ts|json|css)$/.test(p)) {
        const t = readFileSync(p, "utf8");
        if (/—/.test(t)) bad.push(`${p}: em dash`);
        if (/20[- ]minute/i.test(t)) bad.push(`${p}: 20-minute`);
        if (/free (audit|blueprint)/i.test(t)) bad.push(`${p}: free offer`);
        if (/\b(business days?|same[- ]day)\b/i.test(t) && !p.endsWith("Demo.tsx")) bad.push(`${p}: availability promise`);
      }
    }
  };
  ["app", "components", "content", "lib"].forEach(walk);
  expect(bad).toEqual([]);
});

test("code comments stay short labels", () => {
  const long: string[] = [];
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|css)$/.test(p))
        readFileSync(p, "utf8")
          .split("\n")
          .forEach((l, i) => {
            const m = l.match(/^\s*(?:\/\/|\/\*)\s?(.*?)(?:\*\/)?\s*$/);
            if (m && !/eslint|@ts-|prettier/.test(m[1]) && m[1].length > 90) long.push(`${p}:${i + 1}`);
          });
    }
  };
  ["app", "components", "lib", "styles"].forEach(walk);
  expect(long).toEqual([]);
});
