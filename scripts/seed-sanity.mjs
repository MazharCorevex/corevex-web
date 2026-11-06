// Seed Sanity with the current site content
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-10-01", useCdn: false });
const json = (f) => JSON.parse(readFileSync(new URL(`../content/${f}`, import.meta.url), "utf8"));
const ref = (id) => ({ _type: "reference", _ref: id });
const keyed = (arr, fn = (x) => x) => (arr || []).map((x, i) => ({ _key: `k${i}`, ...fn(x) }));

const team = json("team.json");
const articles = json("articles.json");
const cases = json("case-studies.json");
const jobs = json("jobs.json");

const tx = client.transaction();

for (const m of team) {
  tx.createOrReplace({
    _id: `teamMember.${m.slug}`,
    _type: "teamMember",
    name: m.name,
    slug: { _type: "slug", current: m.slug },
    role: m.role,
    short: m.short,
    bio: m.bio,
    imagePath: m.image,
    leadership: m.leadership,
    order: m.order,
  });
}

const authorId = (name) => {
  const m = team.find((t) => t.name === name);
  return m ? `teamMember.${m.slug}` : null;
};

for (const a of articles) {
  const author = authorId(a.author);
  tx.createOrReplace({
    _id: `article.${a.slug}`,
    _type: "article",
    title: a.title,
    slug: { _type: "slug", current: a.slug },
    category: a.category,
    categoryKey: a.categoryKey,
    readTime: a.readTime,
    ...(author ? { author: ref(author) } : {}),
    publishedAt: a.publishedAt,
    imagePath: a.image,
    imageAlt: a.imageAlt,
    cardAlt: a.cardAlt,
    takeaways: a.takeaways,
    toc: keyed(a.toc),
    body: a.body,
    faq: keyed(a.faq),
    ctas: keyed(a.ctas),
    related: keyed(a.related, (s) => ({ ...ref(`article.${s}`), _type: "reference" })),
    seoTitle: a.seoTitle,
    description: a.description,
    keywords: a.keywords,
    summary: a.summary,
    homeTeaser: a.homeTeaser,
    featured: Boolean(a.featured),
    order: a.order,
    ...(typeof a.homeOrder === "number" ? { homeOrder: a.homeOrder } : {}),
  });
}

for (const c of cases) {
  tx.createOrReplace({
    _id: `caseStudy.${c.slug}`,
    _type: "caseStudy",
    name: c.name,
    slug: { _type: "slug", current: c.slug },
    title: c.title,
    isDesignStudy: c.isDesignStudy,
    industry: c.industry,
    categories: c.categories,
    summary: c.summary,
    imagePath: c.image,
    imageAlt: c.imageAlt,
    railAlt: c.railAlt,
    heroAlt: c.heroAlt,
    snapshot: keyed(c.snapshot),
    challenge: c.challenge,
    approach: c.approach,
    delivered: keyed(c.delivered),
    results: [],
    ...(c.next ? { next: ref(`caseStudy.${c.next}`) } : {}),
    seoTitle: c.seoTitle,
    description: c.description,
    order: c.order,
  });
}

for (const j of jobs) {
  tx.createOrReplace({
    _id: `job.${j.slug}`,
    _type: "job",
    title: j.title,
    slug: { _type: "slug", current: j.slug },
    type: j.type,
    location: j.location,
    open: true,
    order: j.order,
  });
}

const res = await tx.commit({ visibility: "async" });
console.log(`Seeded ${res.results.length} documents: ${team.length} team, ${articles.length} articles, ${cases.length} case studies, ${jobs.length} jobs.`);
console.log("Testimonials and client logos are not seeded: add real, approved ones in the Studio.");
