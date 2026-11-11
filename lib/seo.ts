import type { Metadata } from "next";
import data from "./seo-data.json";
import { CONTACT_EMAIL, CONTACT_PHONE, LINKEDIN_URL, OFFICE_ADDRESS, SITE_URL } from "./site";
import { offer } from "./offers";

type PageSeo = { title: string; description: string; ogTitle: string; ogType: string; robots: string; ld: object[] };
const SEO = data as Record<string, PageSeo>;

// Link preview image for every page
export const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "Corevex Solutions, Engineered at the Core" };

export function seoFor(route: string): PageSeo | undefined {
  return SEO[route];
}

export function pageMetadata(route: string, fallback?: Partial<PageSeo> & { type?: "website" | "article" }): Metadata {
  const s = { ...fallback, ...SEO[route] } as PageSeo;
  const title = s.title || fallback?.title || "Corevex Solutions";
  const description = s.description || fallback?.description || "";
  const type = fallback?.type || (route.startsWith("/insights/") && route !== "/insights/" ? "article" : "website");
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: route },
    openGraph: { type, title, description, url: route, siteName: "Corevex Solutions", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}

// Stored JSON-LD plus the fields search engines expect
export function pageLd(route: string, extra: { image?: string } = {}): object[] {
  return (SEO[route]?.ld ?? []).map((raw) => {
    const d = withSite(raw) as Record<string, unknown>;
    const org = { "@type": "Organization", name: "Corevex Solutions", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo/corevex-logo-primary.svg` } };
    if (d["@type"] === "Service") {
      const offers = serviceOffers(route);
      return { ...d, name: d.name ?? d.serviceType, provider: org, url: abs(route), ...(offers.length ? { offers } : {}) };
    }
    if (d["@type"] === "Article")
      return { ...d, image: d.image ?? (extra.image ? abs(extra.image) : undefined), publisher: org, mainEntityOfPage: abs(route), dateModified: d.dateModified ?? d.datePublished };
    return d;
  });
}

export const abs = (p: string) => `${SITE_URL}${p}`;

// Approved starting prices for each service page
const SERVICE_OFFERS: Record<string, string[]> = {
  "full-stack-development": ["landing-page", "website", "dedicated-developer"],
  "custom-software-development": ["dedicated-developer"],
  "saas-app-development": ["saas-platform"],
  "ai-agents-as-a-service": ["ai-agent"],
  "ai-automation": ["ai-agent"],
};

function serviceOffers(route: string) {
  const slug = route.split("/").filter(Boolean)[1] ?? "";
  return (SERVICE_OFFERS[slug] ?? []).flatMap((s) => {
    const o = offer(s);
    if (!o) return [];
    const spec = o.maxPrice
      ? { priceSpecification: { "@type": "UnitPriceSpecification", minPrice: o.price, maxPrice: o.maxPrice, priceCurrency: "USD", unitText: "MONTH" } }
      : o.from
        ? { priceSpecification: { "@type": "PriceSpecification", minPrice: o.price, priceCurrency: "USD" } }
        : {};
    return [{ "@type": "Offer", name: o.title, description: o.promise, price: String(o.price), priceCurrency: "USD", url: abs(`/contact/?offer=${o.slug}`), ...spec }];
  });
}

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
    ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
    ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE.replace(/[^\d+]/g, "") } : {}),
    ...(OFFICE_ADDRESS
      ? { address: { "@type": "PostalAddress", streetAddress: "Sikander Plaza, Canal Bridge, Vehari Rd, Model Town", addressLocality: "Hasilpur", addressRegion: "Punjab", addressCountry: "PK" } }
      : {}),
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
