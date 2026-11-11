import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import CookieConsent from "@/components/consent/CookieConsent";
import CookieSettingsLink from "@/components/consent/CookieSettingsLink";
import { CONSENT_DEFAULTS, applyConsent, deleteGaCookies, readConsent, writeConsent } from "@/lib/consent";
import { legalDoc, parseLegal } from "@/lib/legal";

const clear = () => {
  for (const c of document.cookie.split(/;\s*/)) if (c) document.cookie = `${c.split("=")[0]}=; Max-Age=0; Path=/`;
};
afterEach(clear);

describe("legal pages", () => {
  it("parses title, effective date, headings, lists and paragraphs", () => {
    const d = parseLegal("# Title\n\nEffective date: 1 May 2026\n\nIntro.\n\n## Part\n\n- one\n- two\n\nEnd.");
    expect(d.title).toBe("Title");
    expect(d.effective).toBe("1 May 2026");
    expect(d.blocks).toEqual([
      { t: "p", text: "Intro." },
      { t: "h2", text: "Part" },
      { t: "ul", items: ["one", "two"] },
      { t: "p", text: "End." },
    ]);
  });

  it("keeps LEGAL.md text with every field filled", () => {
    for (const name of ["privacy", "terms", "cookies"] as const) {
      const src = readFileSync(`content/legal/${name}.md`, "utf8");
      expect(src).not.toMatch(/\{\{|\}\}|—/);
      const d = legalDoc(name);
      expect(d.effective).toBe("11 November 2026");
      expect(d.blocks.length).toBeGreaterThan(2);
    }
    expect(legalDoc("terms").blocks.some((b) => b.t === "p" && b.text.includes("courts of Lahore"))).toBe(true);
  });
});

describe("consent cookie", () => {
  it("round-trips and ignores unknown values", () => {
    expect(readConsent("")).toBeNull();
    expect(readConsent("cv_consent=zz")).toBeNull();
    writeConsent({ analytics: true });
    expect(readConsent()?.analytics).toBe(true);
    writeConsent({ analytics: false });
    expect(readConsent()?.analytics).toBe(false);
  });

  it("deletes _ga cookies", () => {
    document.cookie = "_ga=GA1; Path=/";
    document.cookie = "_ga_ABC=GS1; Path=/";
    document.cookie = "keep=1; Path=/";
    deleteGaCookies();
    expect(document.cookie).not.toMatch(/_ga/);
    expect(document.cookie).toMatch(/keep=1/);
  });

  it("defaults every consent type to denied", () => {
    for (const k of ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"]) expect(CONSENT_DEFAULTS).toContain(`${k}:'denied'`);
    expect(CONSENT_DEFAULTS).not.toContain("granted");
  });

  it("loads gtag.js only when analytics is accepted", () => {
    applyConsent(false, "G-TEST");
    expect(document.getElementById("ga-js")).toBeNull();
    applyConsent(true, "G-TEST");
    expect(document.getElementById("ga-js")?.getAttribute("src")).toContain("id=G-TEST");
    document.getElementById("ga-js")?.remove();
  });
});

describe("cookie banner", () => {
  it("shows on a first visit, then remembers Accept all", async () => {
    render(<CookieConsent />);
    await act(() => new Promise((r) => setTimeout(r, 0)));
    expect(screen.getByRole("region", { name: "Cookie consent" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Accept all" }));
    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
    expect(readConsent()?.analytics).toBe(true);
  });

  it("stays hidden when a choice is stored, and the footer link opens settings", async () => {
    writeConsent({ analytics: false });
    render(
      <>
        <CookieConsent />
        <CookieSettingsLink />
      </>,
    );
    await act(() => new Promise((r) => setTimeout(r, 0)));
    expect(screen.queryByRole("region", { name: "Cookie consent" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Cookie settings" }));
    const ana = screen.getByRole("switch", { name: "Analytics", hidden: true }) as HTMLInputElement;
    expect(ana.checked).toBe(false);
    fireEvent.click(ana);
    fireEvent.click(screen.getByRole("button", { name: "Save choices", hidden: true }));
    expect(readConsent()?.analytics).toBe(true);
  });
});
