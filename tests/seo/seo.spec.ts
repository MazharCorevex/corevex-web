import { expect, test } from "@playwright/test";
import { ROUTES } from "../routes";

type Head = {
  route: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  og: Record<string, string>;
  twitter: Record<string, string>;
  h1: number;
  ld: unknown[];
  ldErrors: string[];
};

const heads: Head[] = [];

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    heads.push(
      await page.evaluate((route) => {
        const meta = (sel: string) => document.querySelector<HTMLMetaElement>(sel)?.content || "";
        const group = (prefix: string, attr: "property" | "name") =>
          Object.fromEntries([...document.querySelectorAll<HTMLMetaElement>(`meta[${attr}^="${prefix}:"]`)].map((m) => [m.getAttribute(attr)!, m.content]));
        const ld: unknown[] = [];
        const ldErrors: string[] = [];
        document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
          try {
            const v = JSON.parse(s.textContent || "");
            (Array.isArray(v) ? v : [v]).forEach((x) => ld.push(x));
          } catch (e) {
            ldErrors.push(String(e));
          }
        });
        return {
          route,
          title: document.title,
          description: meta('meta[name="description"]'),
          canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || "",
          robots: meta('meta[name="robots"]'),
          og: group("og", "property"),
          twitter: group("twitter", "name"),
          h1: document.querySelectorAll("h1").length,
          ld,
          ldErrors,
        };
      }, route),
    );
  }
  await page.close();
});

test("every page has a unique title and description", () => {
  const dupe = (k: "title" | "description") => {
    const seen = new Map<string, string>();
    const out: string[] = [];
    for (const h of heads) {
      if (!h[k]) out.push(`${h.route} has no ${k}`);
      else if (seen.has(h[k])) out.push(`${h.route} repeats the ${k} of ${seen.get(h[k])}`);
      else seen.set(h[k], h.route);
    }
    return out;
  };
  expect(dupe("title")).toEqual([]);
  expect(dupe("description")).toEqual([]);
  for (const h of heads) {
    expect(h.title.length, `${h.route} title length`).toBeLessThanOrEqual(70);
    expect(h.description.length, `${h.route} description length`).toBeGreaterThanOrEqual(40);
    expect(h.description.length, `${h.route} description length`).toBeLessThanOrEqual(170);
  }
});

test("every page has a self canonical URL and is indexable", () => {
  const canon = new Set<string>();
  for (const h of heads) {
    const u = new URL(h.canonical);
    expect(u.pathname, `${h.route} canonical`).toBe(h.route);
    expect(u.protocol).toBe("https:");
    expect(canon.has(h.canonical), `${h.route} duplicate canonical`).toBe(false);
    canon.add(h.canonical);
    expect(h.robots, `${h.route} robots`).not.toMatch(/noindex/);
  }
});

test("Open Graph and Twitter tags on every page", () => {
  for (const h of heads) {
    for (const k of ["og:title", "og:description", "og:url", "og:type", "og:image", "og:site_name"]) expect(h.og[k], `${h.route} ${k}`).toBeTruthy();
    expect(new URL(h.og["og:url"]).pathname).toBe(h.route);
    expect(h.og["og:image"]).toMatch(/^https:\/\//);
    expect(h.twitter["twitter:card"], `${h.route} twitter:card`).toBe("summary_large_image");
  }
});

test("every page shares og-image.jpg with alt text", async ({ request }) => {
  for (const h of heads) {
    expect(new URL(h.og["og:image"]).pathname, h.route).toBe("/og-image.jpg");
    expect(h.og["og:image:alt"], h.route).toBe("Corevex Solutions, Engineered at the Core");
    expect(h.og["og:site_name"], h.route).toBe("Corevex Solutions");
  }
  const r = await request.get("/og-image.jpg");
  expect(r.status()).toBe(200);
  expect(r.headers()["content-type"]).toMatch(/image\/jpeg/);
});

test("exactly one h1 on every page", () => {
  expect(heads.filter((h) => h.h1 !== 1).map((h) => `${h.route}: ${h.h1}`)).toEqual([]);
});

test("JSON-LD is valid and complete", () => {
  const errs: string[] = [];
  const abs = (v: unknown) => typeof v === "string" && /^https:\/\//.test(v);
  for (const h of heads) {
    errs.push(...h.ldErrors.map((e) => `${h.route}: ${e}`));
    const types = h.ld.map((d) => (d as { "@type": string })["@type"]);
    if (!types.includes("Organization")) errs.push(`${h.route}: no Organization`);
    if (h.route !== "/" && !types.includes("BreadcrumbList")) errs.push(`${h.route}: no BreadcrumbList`);
    if (h.route.startsWith("/services/") && h.route !== "/services/" && !types.includes("Service")) errs.push(`${h.route}: no Service`);
    if (h.route.startsWith("/insights/") && h.route !== "/insights/" && !types.includes("Article")) errs.push(`${h.route}: no Article`);
    if (h.route === "/faq/" && !types.includes("FAQPage")) errs.push(`${h.route}: no FAQPage`);
    for (const raw of h.ld) {
      const d = raw as Record<string, unknown>;
      const t = d["@type"];
      if (d["@context"] !== "https://schema.org") errs.push(`${h.route} ${t}: @context`);
      const need = (k: string) => {
        if (d[k] === undefined || d[k] === "" || (Array.isArray(d[k]) && !(d[k] as unknown[]).length)) errs.push(`${h.route} ${t}: missing ${k}`);
      };
      if (t === "Organization") ["name", "url", "logo"].forEach(need);
      if (t === "Service") ["name", "provider", "description"].forEach(need);
      if (t === "Article") {
        ["headline", "datePublished", "author", "image", "publisher"].forEach(need);
        if (typeof d.datePublished === "string" && Number.isNaN(Date.parse(d.datePublished))) errs.push(`${h.route} Article: bad date`);
      }
      if (t === "Person") ["name", "jobTitle"].forEach(need);
      if (t === "FAQPage") {
        need("mainEntity");
        for (const q of (d.mainEntity as Record<string, unknown>[]) || [])
          if (q["@type"] !== "Question" || !q.name || !(q.acceptedAnswer as Record<string, unknown>)?.text) errs.push(`${h.route} FAQPage: bad question`);
      }
      if (t === "BreadcrumbList") {
        const items = (d.itemListElement as Record<string, unknown>[]) || [];
        items.forEach((it, i) => {
          if (it.position !== i + 1 || !it.name || !abs(it.item)) errs.push(`${h.route} BreadcrumbList item ${i + 1}`);
        });
      }
      const text = JSON.stringify(d);
      if (/—/.test(text)) errs.push(`${h.route} ${t}: em dash`);
      if (/corevexsolutions\.com\/assets\//.test(text)) errs.push(`${h.route} ${t}: prototype asset path`);
    }
  }
  expect(errs).toEqual([]);
});

test("sitemap.xml is valid and lists every page", async ({ page, request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toMatch(/xml/);
  const xml = await res.text();
  const parsed = await page.evaluate((x) => {
    const doc = new DOMParser().parseFromString(x, "application/xml");
    if (doc.querySelector("parsererror")) return { error: doc.querySelector("parsererror")!.textContent, locs: [], lastmods: [] };
    const ns = doc.documentElement.namespaceURI;
    return {
      error: ns === "http://www.sitemaps.org/schemas/sitemap/0.9" ? null : `namespace ${ns}`,
      locs: [...doc.getElementsByTagName("loc")].map((l) => l.textContent!),
      lastmods: [...doc.getElementsByTagName("lastmod")].map((l) => l.textContent!),
    };
  }, xml);
  expect(parsed.error).toBeNull();
  const paths = parsed.locs.map((l) => new URL(l).pathname);
  expect(ROUTES.filter((r) => !paths.includes(r))).toEqual([]);
  expect(new Set(paths).size).toBe(paths.length);
  for (const p of paths) expect((await request.get(p)).status(), p).toBe(200);
  for (const m of parsed.lastmods) expect(Number.isNaN(Date.parse(m)), m).toBe(false);
});

test("robots.txt is valid", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const txt = await res.text();
  expect(txt).toMatch(/^User-Agent: \*/im);
  expect(txt).toMatch(/^Allow: \/$/m);
  expect(txt).toMatch(/^Disallow: \/api\/$/m);
  expect(txt).not.toMatch(/^Disallow: \/$/m);
  expect(txt).toMatch(/^Sitemap: https:\/\/.+\/sitemap\.xml$/m);
  for (const line of txt.split("\n").filter(Boolean)) expect(line, line).toMatch(/^(User-Agent|Allow|Disallow|Sitemap|Host|Crawl-delay):\s/i);
});

test("llms.txt lists the main pages", async ({ request }) => {
  const txt = await (await request.get("/llms.txt")).text();
  expect(txt).toMatch(/^# Corevex Solutions/);
  for (const s of ["/services/code-rescue/", "/about/", "/contact/"]) expect(txt).toContain(s);
});

test("404 page is not indexable", async ({ page }) => {
  const res = await page.goto("/missing-page/");
  expect(res?.status()).toBe(404);
  expect(await page.locator('meta[name="robots"]').first().getAttribute("content")).toMatch(/noindex/);
});
