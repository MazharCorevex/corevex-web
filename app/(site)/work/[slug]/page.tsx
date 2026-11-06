import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Img from "@/components/ui/Img";
import Words from "@/components/ui/Words";
import Crumbs from "@/components/sections/Crumbs";
import CtaBand from "@/components/sections/CtaBand";
import Testimonials from "@/components/sections/Testimonials";
import JsonLd from "@/components/seo/JsonLd";
import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { breadcrumbLd, pageLd, pageMetadata, seoFor } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) return {};
  return pageMetadata(`/work/${slug}/`, { title: c.seoTitle || `${c.name}: Case Study, Corevex`, description: c.description, image: `/og/work/${slug}.png` });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) notFound();
  const all = await getCaseStudies();
  const next = all.find((x) => x.slug === c.next) || all[(all.findIndex((x) => x.slug === c.slug) + 1) % all.length];
  const route = `/work/${slug}/`;
  const ld = seoFor(route)
    ? pageLd(route)
    : [breadcrumbLd([["Home", "/"], ["Work", "/work/"], [c.name, route]])];

  return (
    <>
      <section className="cs-hero">
        <div className="wrap">
          <Crumbs items={[["Home", "/"], ["Work", "/work/"], [c.name]]} />
          <span className="label">
            {c.name}
            {c.isDesignStudy ? " · Product design study" : ""}
          </span>
          <Words as="h1" className="h1 words" style={{ maxWidth: "20ch" }}>
            {c.title}
          </Words>
          <div className="shot" data-reveal="load">
            <Img src={c.image} alt={c.heroAlt || c.imageAlt || ""} sizes="(max-width: 1280px) 100vw, 1200px" priority />
          </div>
        </div>
      </section>
      <div className="wrap">
        <div className="snap">
          {c.snapshot.map((s) => (
            <div key={s.label}>
              <span>{s.label}</span>
              <b>{s.value}</b>
            </div>
          ))}
        </div>
        {c.challenge && (
          <div className="cs-block">
            <h2 className="h2">The challenge</h2>
            <div>
              <p>{c.challenge}</p>
            </div>
          </div>
        )}
        {c.approach.length > 0 && (
          <div className="cs-block">
            <h2 className="h2">How we approached it</h2>
            <ol>
              {c.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </div>
        )}
        {c.delivered.length > 0 && (
          <div className="cs-block">
            <h2 className="h2">What we delivered</h2>
            <div className="delivered">
              {c.delivered.map((d) => (
                <div key={d.title}>
                  <b>{d.title}</b>
                  <span>{d.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {c.results.length > 0 && (
          <div className="cs-block">
            <h2 className="h2">Results</h2>
            <div className="delivered">
              {c.results.map((r) => (
                <div key={r.label}>
                  <b>{r.value}</b>
                  <span>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <Testimonials caseStudy={c.slug} />
        {next && next.slug !== c.slug && (
          <div className="cs-block" style={{ border: 0 }}>
            <span className="label">Next project</span>
            <Link className="m-card" href={`/work/${next.slug}/`} style={{ maxWidth: 560 }}>
              <div className="img" style={{ aspectRatio: "16/10" }}>
                <Img src={next.image} alt={`${next.name} concept`} sizes="(max-width: 600px) 100vw, 560px" />
              </div>
              <div className="meta">
                <h3>{next.name}</h3>
                <span className="link">
                  View case study <span className="chev">»</span>
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
      <CtaBand />
      <JsonLd data={ld} />
    </>
  );
}
