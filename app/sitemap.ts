import type { MetadataRoute } from "next";
import seo from "@/lib/seo-data.json";
import { getArticles, getCaseStudies } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = new Set(Object.keys(seo).filter((r) => r !== "/404/"));
  for (const a of await getArticles()) routes.add(`/insights/${a.slug}/`);
  for (const c of await getCaseStudies()) routes.add(`/work/${c.slug}/`);
  const now = new Date();
  return [...routes].sort().map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified: now,
    changeFrequency: r === "/" || r === "/insights/" ? "weekly" : "monthly",
    priority: r === "/" ? 1 : r.startsWith("/services/") ? 0.9 : r.split("/").length > 3 ? 0.6 : 0.8,
  }));
}
