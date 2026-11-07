import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Img from "@/components/ui/Img";
import Crumbs from "@/components/sections/Crumbs";
import CtaBand from "@/components/sections/CtaBand";
import ArticleBody from "@/components/insights/ArticleBody";
import ArticleCard from "@/components/insights/ArticleCard";
import JsonLd from "@/components/seo/JsonLd";
import { getArticle, getArticles } from "@/lib/content";
import { abs, breadcrumbLd, faqLd, pageLd, pageMetadata, seoFor } from "@/lib/seo";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return pageMetadata(`/insights/${slug}/`, { title: a.seoTitle || a.title, description: a.description, type: "article", image: `/og/insights/${slug}.png` });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const all = await getArticles();
  const related = (a.related?.length ? a.related.map((s) => all.find((x) => x.slug === s)) : all.filter((x) => x.slug !== slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .slice(0, 3);
  const route = `/insights/${slug}/`;
  const ld = seoFor(route)
    ? pageLd(route)
    : [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.description,
          keywords: a.keywords,
          image: abs(a.image.startsWith("/") ? a.image : a.image),
          author: { "@type": "Person", name: a.author },
          publisher: { "@type": "Organization", name: "Corevex Solutions" },
          datePublished: a.publishedAt,
        },
        ...(a.faq.length ? [faqLd(a.faq)] : []),
        breadcrumbLd([["Home", "/"], ["Insights", "/insights/"], [a.title, route]]),
      ];
  const authorImg = a.authorImage || `/images/team/${a.author.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`;

  return (
    <>
      <section className="page-hero art-hero">
        <div className="wrap art-head">
          <div>
            <Crumbs items={[["Home", "/"], ["Insights", "/insights/"], [a.category]]} />
            <div className="meta-row" style={{ color: "var(--text-muted)" }}>
              <span className="chip">{a.category}</span>
              <span>{a.readTime} min read</span>
            </div>
            <h1 className="h1" style={{ marginTop: 18 }}>
              {a.title}
            </h1>
            <div className="author">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={authorImg} alt={a.author} width={48} height={48} />
              <div>
                <b>{a.author}</b>
                <br />
                <span className="muted">{a.authorRole}</span>
              </div>
            </div>
          </div>
          <div className="art-img">
            <Img src={a.image} alt={a.imageAlt || ""} sizes="(max-width: 860px) 100vw, 45vw" priority />
          </div>
        </div>
      </section>
      <section className="band" style={{ paddingTop: 56 }}>
        <div className="wrap article">
          {a.toc.length > 0 && (
            <nav className="toc" aria-label="Contents">
              <b>CONTENTS</b>
              {a.toc.map((t) => (
                <a key={t.anchor} href={`#${t.anchor}`}>
                  {t.label}
                </a>
              ))}
            </nav>
          )}
          <div className="prose">
            {a.takeaways.length > 0 && (
              <div className="takeaways">
                <b>Key takeaways</b>
                <ul>
                  {a.takeaways.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            <ArticleBody value={a.body} />
            {a.ctas.length > 0 && (
              <div className="btns" style={{ marginTop: 36 }}>
                {a.ctas.map((c) => (
                  <Link key={c.label} className={c.primary ? "btn" : "btn btn-ghost"} href={c.href}>
                    {c.label}
                    {c.primary && (
                      <>
                        {" "}
                        <span className="chev">»</span>
                      </>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="band" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="label">Keep reading</span>
            <h2 className="h2" style={{ marginBottom: 36 }}>
              More insights
            </h2>
            <div className="mag mag3">
              {related.map((r) => (
                <ArticleCard key={r.slug} a={r} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
      <JsonLd data={ld} />
    </>
  );
}
