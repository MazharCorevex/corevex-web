import "server-only";
import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId, sanityEnabled } from "@/sanity/env";
import localArticles from "@/content/articles.json";
import localCases from "@/content/case-studies.json";
import localTeam from "@/content/team.json";
import localJobs from "@/content/jobs.json";
import categories from "@/content/insight-categories.json";
import type { Article, CaseStudy, ClientLogo, Job, TeamMember, Testimonial } from "./types";

export const REVALIDATE = 3600;

const client = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published", token: process.env.SANITY_API_READ_TOKEN || undefined })
  : null;

async function fetchSanity<T>(query: string, tags: string[], params: QueryParams = {}): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: REVALIDATE, tags } });
  } catch (e) {
    console.error("[sanity]", (e as Error).message);
    return null;
  }
}

const IMG = `"image": coalesce(image.asset->url, imagePath), "imageW": image.asset->metadata.dimensions.width, "imageH": image.asset->metadata.dimensions.height`;

// Articles
const ARTICLE_FIELDS = `"slug": slug.current, title, cardAlt, seoTitle, description, summary, homeTeaser, category, categoryKey, readTime,
  "author": author->name, "authorRole": author->role, "authorImage": coalesce(author->image.asset->url, author->imagePath),
  ${IMG}, imageAlt, keywords, publishedAt, takeaways, toc, body, faq, ctas, "related": related[]->slug.current, featured, order, homeOrder`;

export async function getArticles(): Promise<Article[]> {
  const data = await fetchSanity<Article[]>(`*[_type == "article" && defined(slug.current)] | order(order asc, publishedAt desc){${ARTICLE_FIELDS}}`, ["article"]);
  if (data && data.length) return data;
  return localArticles as unknown as Article[];
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug) ?? null;
}

export function getInsightCategories() {
  return categories as { key: string; label: string }[];
}

// Case studies
const CASE_FIELDS = `"slug": slug.current, order, name, title, seoTitle, description, summary, industry, categories, ${IMG}, imageAlt, railAlt, heroAlt,
  snapshot, challenge, approach, delivered, "results": coalesce(results, []), "next": next->slug.current, isDesignStudy`;

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const data = await fetchSanity<CaseStudy[]>(`*[_type == "caseStudy" && defined(slug.current)] | order(order asc){${CASE_FIELDS}}`, ["caseStudy"]);
  if (data && data.length) return data;
  return localCases as unknown as CaseStudy[];
}

export async function getCaseStudy(slug: string) {
  return (await getCaseStudies()).find((c) => c.slug === slug) ?? null;
}

// Team
export async function getTeam(): Promise<TeamMember[]> {
  const data = await fetchSanity<TeamMember[]>(
    `*[_type == "teamMember"] | order(order asc){"slug": slug.current, order, name, role, short, bio, "image": coalesce(image.asset->url, imagePath), linkedin, leadership}`,
    ["teamMember"],
  );
  if (data && data.length) return data;
  return localTeam as TeamMember[];
}

// Jobs
export async function getJobs(): Promise<Job[]> {
  const data = await fetchSanity<Job[]>(`*[_type == "job" && open != false] | order(order asc){"slug": slug.current, order, title, type, location}`, ["job"]);
  if (data) return data;
  return localJobs as Job[];
}

// Testimonials, empty until real ones are approved
export async function getTestimonials(): Promise<Testimonial[]> {
  return (await fetchSanity<Testimonial[]>(`*[_type == "testimonial" && approved == true] | order(order asc){quote, name, role, company, "caseStudy": caseStudy->slug.current}`, ["testimonial"])) ?? [];
}

// Client logos, empty until real ones are approved
export async function getClientLogos(): Promise<ClientLogo[]> {
  return (
    (await fetchSanity<ClientLogo[]>(
      `*[_type == "clientLogo" && approved == true] | order(order asc){name, "logo": logo.asset->url, "width": logo.asset->metadata.dimensions.width, "height": logo.asset->metadata.dimensions.height}`,
      ["clientLogo"],
    )) ?? []
  );
}
