import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const data = vi.hoisted(() => ({ testimonials: [] as unknown[], logos: [] as unknown[] }));
vi.mock("@/content/testimonials.json", () => ({ default: data.testimonials }));
vi.mock("@/content/client-logos.json", () => ({ default: data.logos }));

import * as content from "@/lib/content";
import Testimonials from "@/components/sections/Testimonials";
import ClientLogos from "@/components/sections/ClientLogos";
import { abs, breadcrumbLd, faqLd, organizationLd, pageLd, OG_IMAGE, pageMetadata, seoFor, withSite } from "@/lib/seo";
import { DRAWER_ORDER, SERVICES, svc } from "@/lib/site";
import { track } from "@/lib/analytics";

beforeEach(() => {
  data.testimonials.length = 0;
  data.logos.length = 0;
});

describe("content helpers", () => {
  it("load articles, case studies, team, jobs and categories", async () => {
    const articles = await content.getArticles();
    expect(articles.length).toBe(13);
    expect(await content.getArticle(articles[0].slug)).toEqual(articles[0]);
    expect(await content.getArticle("missing")).toBeNull();
    const cases = await content.getCaseStudies();
    expect(cases.length).toBe(12);
    expect(await content.getCaseStudy(cases[0].slug)).toEqual(cases[0]);
    // Every board exists and every project sits under a Work filter
    const { existsSync } = await import("node:fs");
    const filters = ["custom-software", "full-stack", "mobile", "saas", "ai", "automation"];
    for (const c of cases) {
      for (const src of [c.image, ...(c.gallery ?? []).map((g) => g.src)]) expect(existsSync(`public${src}`), src).toBe(true);
      expect(c.categories.length).toBeGreaterThan(0);
      for (const cat of c.categories) expect(filters, `${c.slug}: ${cat}`).toContain(cat);
      expect(c.isDesignStudy).toBe(true);
      expect(cases.some((x) => x.slug === c.next)).toBe(true);
    }
    expect(await content.getCaseStudy("missing")).toBeNull();
    const team = await content.getTeam();
    expect(team.filter((t) => t.leadership).map((t) => t.name)).toEqual(["Mazhar H", "M Azhar", "Zafar H"]);
    expect(await content.getJobs()).toEqual([]);
    expect(content.getInsightCategories().length).toBeGreaterThan(1);
  });

  it("every case study is labelled as a product design study and has no invented results", async () => {
    for (const c of await content.getCaseStudies()) {
      expect(c.isDesignStudy).toBe(true);
      expect(c.results).toEqual([]);
    }
  });
});

describe("empty states", () => {
  it("hides testimonials when there are none", async () => {
    expect(await content.getTestimonials()).toEqual([]);
    expect(await Testimonials({})).toBeNull();
    expect(await Testimonials({ caseStudy: "australian-direct-tutoring" })).toBeNull();
  });

  it("shows a testimonial once a real one exists", async () => {
    data.testimonials.push({ quote: "They shipped it.", name: "Hina", role: "COO", company: "Acme", caseStudy: "australian-direct-tutoring" });
    render((await Testimonials({ caseStudy: "australian-direct-tutoring" }))!);
    expect(screen.getByText("They shipped it.")).toBeInTheDocument();
    expect(screen.getByText("COO, Acme")).toBeInTheDocument();
    expect(await Testimonials({ caseStudy: "other" })).toBeNull();
  });

  it("hides client logos when there are none and shows them once added", async () => {
    expect(await ClientLogos({ variant: "marquee" })).toBeNull();
    data.logos.push({ name: "Acme", logo: "/images/clients/acme.svg", width: 120, height: 28 });
    const { unmount } = render((await ClientLogos({ variant: "marquee" }))!);
    expect(screen.getAllByAltText("Acme logo")).toHaveLength(2);
    unmount();
    render((await ClientLogos({ variant: "strip" }))!);
    expect(screen.getAllByAltText("Acme logo")).toHaveLength(1);
  });
});

describe("seo helpers", () => {
  it("builds metadata with canonical and Open Graph", () => {
    const m = pageMetadata("/services/code-rescue/");
    expect(m.alternates?.canonical).toBe("/services/code-rescue/");
    expect(m.openGraph).toMatchObject({ url: "/services/code-rescue/", siteName: "Corevex Solutions" });
    expect(String((m.title as { absolute: string }).absolute)).toMatch(/Code Rescue/i);
    const a = pageMetadata("/insights/what-is-rag/");
    expect((a.openGraph as { type: string }).type).toBe("article");
    expect((a.openGraph as { images: unknown[] }).images).toEqual([OG_IMAGE]);
    expect((a.twitter as { card: string; images: unknown[] })).toMatchObject({ card: "summary_large_image", images: [OG_IMAGE] });
    expect(OG_IMAGE).toMatchObject({ url: "/og-image.jpg", width: 1200, height: 630, alt: "Corevex Solutions, Engineered at the Core" });
    const f = pageMetadata("/unknown/", { title: "T", description: "D", type: "website" });
    expect(f.description).toBe("D");
    expect(pageMetadata("/nothing/").title).toEqual({ absolute: "Corevex Solutions" });
  });

  it("builds JSON-LD", () => {
    expect(seoFor("/")).toBeDefined();
    expect(pageLd("/faq/").map((d) => (d as { "@type": string })["@type"])).toEqual(["FAQPage", "BreadcrumbList"]);
    expect(pageLd("/missing/")).toEqual([]);
    expect(organizationLd()).toMatchObject({ "@type": "Organization", foundingDate: "2022" });
    const b = breadcrumbLd([
      ["Home", "/"],
      ["Work", "/work/"],
    ]);
    expect(b.itemListElement[1]).toMatchObject({ position: 2, item: abs("/work/") });
    expect(faqLd([{ q: "Q", a: "A" }]).mainEntity[0].acceptedAnswer.text).toBe("A");
    expect(withSite({ u: "https://www.corevexsolutions.com/assets/img/x.png" }).u).toMatch(/\/images\/x\.png$/);
  });

  it("lists all eight services", () => {
    expect(SERVICES).toHaveLength(8);
    expect(DRAWER_ORDER).toHaveLength(8);
    expect(svc("code-rescue").name).toBe("Code Rescue and Takeover");
  });

  it("tracks only when GA is present", () => {
    const g = vi.fn();
    track("x");
    Object.assign(window, { gtag: g, __cvAnalytics: true });
    track("cta_click", { a: 1 });
    expect(g).toHaveBeenCalledWith("event", "cta_click", { a: 1 });
    delete (window as unknown as { gtag?: unknown; __cvAnalytics?: unknown }).gtag;
    delete (window as unknown as { __cvAnalytics?: unknown }).__cvAnalytics;
  });
});
