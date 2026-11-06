import type { Metadata } from "next";
import data from "./seo-data.json";
import { LINKEDIN_URL, SITE_URL } from "./site";

type PageSeo = { title: string; description: string; ogTitle: string; ogType: string; robots: string; ld: object[] };
const SEO = data as Record<string, PageSeo>;

const OG = "/images/social/og-image-1200x630.png";

export function seoFor(route: string): PageSeo | undefined {
  return SEO[route];
}

export function pageMetadata(route: string, fallback?: Partial<PageSeo> & { image?: string; type?: "website" | "article"; ogFile?: boolean }): Metadata {
  const s = { ...fallback, ...SEO[route] } as PageSeo;
  const title = s.title || fallback?.title || "Corevex Solutions";
  const description = s.description || fallback?.description || "";
  const image = fallback?.image || OG;
  const type = fallback?.type || (route.startsWith("/insights/") && route !== "/insights/" ? "article" : "website");
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: route },
    openGraph: { type, title: s.ogTitle || title, description, url: route, siteName: "Corevex Solutions", ...(fallback?.ogFile ? {} : { images: [{ url: image, width: 1200, height: 630 }] }) },
    twitter: { card: "summary_large_image", title: s.ogTitle || title, description, ...(fallback?.ogFile ? {} : { images: [image] }) },
  };
}

export function pageLd(route: string): object[] {
  return (SEO[route]?.ld ?? []).map((d) => withSite(d));
}

export const abs = (p: string) => `${SITE_URL}${p}`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Corevex Solutions",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/corevex-logo-primary.svg`,
    foundingDate: "2022",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 50 },
    slogan: "Engineered at the Core.",
    founder: { "@type": "Person", name: "Mazhar H", jobTitle: "CEO and Founder" },
    sameAs: [LINKEDIN_URL].filter(Boolean),
  };
}

export function breadcrumbLd(items: Array<[string, string]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}

export function faqLd(faq: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

// Rewrites reference domain in stored JSON-LD
export function withSite<T>(ld: T): T {
  return JSON.parse(JSON.stringify(ld).replaceAll("https://www.corevexsolutions.com", SITE_URL).replaceAll("/assets/img/", "/images/"));
}
