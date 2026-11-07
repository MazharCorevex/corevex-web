import services from "@/content/services.json";
import { getArticle, getArticles, getCaseStudies, getCaseStudy } from "@/lib/content";
import { ogCard } from "@/lib/og";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const a = (await getArticles()).map((x) => ({ kind: "insights", file: `${x.slug}.png` }));
  const c = (await getCaseStudies()).map((x) => ({ kind: "work", file: `${x.slug}.png` }));
  const s = services.map((x) => ({ kind: "services", file: `${x.slug}.png` }));
  return [...a, ...c, ...s];
}

// Open Graph images
export async function GET(_: Request, { params }: { params: Promise<{ kind: string; file: string }> }) {
  const { kind, file } = await params;
  const slug = file.replace(/\.png$/, "");
  if (kind === "insights") {
    const a = await getArticle(slug);
    if (a) return ogCard(`Insights · ${a.category}`, a.title);
  } else if (kind === "work") {
    const c = await getCaseStudy(slug);
    if (c) return ogCard(`${c.name} · Product design study`, c.title);
  } else if (kind === "services") {
    const s = services.find((x) => x.slug === slug);
    if (s) return ogCard(s.name, s.h1);
  }
  return new Response("Not found", { status: 404 });
}
