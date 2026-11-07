import type { Metadata } from "next";
import Link from "next/link";
import Img from "@/components/ui/Img";
import Words from "@/components/ui/Words";
import Crumbs from "@/components/sections/Crumbs";
import CtaBand from "@/components/sections/CtaBand";
import Filter from "@/components/interactive/Filter";
import JsonLd from "@/components/seo/JsonLd";
import { getCaseStudies } from "@/lib/content";
import { pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/work/");

const FILTERS = [
  ["all", "All"],
  ["custom-software", "Custom Software"],
  ["full-stack", "Full-Stack"],
  ["mobile", "Mobile"],
  ["ai", "AI and LLM"],
  ["automation", "Automation"],
];

export default async function WorkIndex() {
  const cases = await getCaseStudies();
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Crumbs items={[["Home", "/"], ["Work"]]} />
          <Words as="h1" className="h1 words">
            Our work: software, SaaS and AI products
          </Words>
          <p className="lead" data-reveal="load">
            Product design studies that show how we approach platforms, apps and AI systems. Client case studies are
            added as they are approved for publication.
          </p>
        </div>
      </section>
      <Filter mode="work">
        <div className="filters" role="toolbar" aria-label="Filter work">
          <div className="wrap">
            {FILTERS.map(([v, l], i) => (
              <button key={v} data-filter={v} aria-pressed={i === 0}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <section className="band" aria-labelledby="work-list">
          <div className="wrap">
            <h2 className="sr" id="work-list">
              Projects
            </h2>
            <div className="masonry">
              {cases.map((c) => (
                <Link key={c.slug} className="m-card" data-cat={c.categories.join(" ")} href={`/work/${c.slug}/`}>
                  <div className="img">
                    <Img src={c.image} alt={c.imageAlt || ""} sizes="(max-width: 860px) 100vw, 50vw" />
                  </div>
                  <div className="meta">
                    <span className="chip">{c.industry}</span>{" "}
                    {c.isDesignStudy && <span className="concept">Product design study</span>}
                    <h3>{c.name}</h3>
                    <p>{c.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
            <p className="note">
              Projects marked Product design study are design studies that show our capabilities. Client case studies
              are added as they are approved for publication.
            </p>
          </div>
        </section>
      </Filter>
      <CtaBand />
      <JsonLd data={pageLd("/work/")} />
    </>
  );
}
