import "server-only";
import localArticles from "@/content/articles.json";
import localCases from "@/content/case-studies.json";
import localTeam from "@/content/team.json";
import localJobs from "@/content/jobs.json";
import localTestimonials from "@/content/testimonials.json";
import localLogos from "@/content/client-logos.json";
import categories from "@/content/insight-categories.json";
import type { Article, CaseStudy, ClientLogo, Job, TeamMember, Testimonial } from "./types";

// Articles
export async function getArticles(): Promise<Article[]> {
  return localArticles as unknown as Article[];
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug) ?? null;
}

export function getInsightCategories() {
  return categories as { key: string; label: string }[];
}

// Case studies
export async function getCaseStudies(): Promise<CaseStudy[]> {
  return localCases as unknown as CaseStudy[];
}

export async function getCaseStudy(slug: string) {
  return (await getCaseStudies()).find((c) => c.slug === slug) ?? null;
}

// Team
export async function getTeam(): Promise<TeamMember[]> {
  return localTeam as TeamMember[];
}

// Jobs
export async function getJobs(): Promise<Job[]> {
  return localJobs as Job[];
}

// Testimonials, empty until real ones exist
export async function getTestimonials(): Promise<Testimonial[]> {
  return localTestimonials as Testimonial[];
}

// Client logos, empty until real ones exist
export async function getClientLogos(): Promise<ClientLogo[]> {
  return localLogos as ClientLogo[];
}
