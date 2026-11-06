import type { Metadata } from "next";
import Words from "@/components/ui/Words";
import Crumbs from "@/components/sections/Crumbs";
import CtaBand from "@/components/sections/CtaBand";
import Filter from "@/components/interactive/Filter";
import ArticleCard from "@/components/insights/ArticleCard";
import JsonLd from "@/components/seo/JsonLd";
import { getArticles, getInsightCategories } from "@/lib/content";
import { pageLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const metadata: Metadata = pageMetadata("/insights/");

export default async function InsightsIndex() {
  const articles = await getArticles();
  const cats = getInsightCategories();
  const feat = articles.find((a) => a.featured) || articles[0];
  const rest = articles.filter((a) => a !== feat);
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Crumbs items={[["Home", "/"], ["Insights"]]} />
          <Words as="h1" className="h1 words">
            Insights on software, AI and product engineering
          </Words>
          <p className="lead" data-reveal="load">
            Practical writing from the Corevex engineering team on building software that works in production.
          </p>
        </div>
      </section>
      <Filter mode="insights">
        <div className="filters" role="toolbar" aria-label="Filter insights">
          <div className="wrap">
            {cats.map((c, i) => (
              <button key={c.key} data-ifilter={c.key} aria-pressed={i === 0}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <section className="band">
          <div className="wrap">
            {feat && <ArticleCard a={feat} feature />}
            <div className="mag">
              {rest.map((a) => (
                <ArticleCard key={a.slug} a={a} />
              ))}
            </div>
            <p className="empty-note" hidden>
              No articles in this category yet.
            </p>
          </div>
        </section>
      </Filter>
      <CtaBand
        title="Have a question for our engineers?"
        text="Send it over. We may even turn it into the next article."
      />
      <JsonLd data={pageLd("/insights/")} />
    </>
  );
}
