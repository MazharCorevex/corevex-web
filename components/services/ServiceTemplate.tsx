import Link from "next/link";
import type { ReactNode } from "react";
import Img from "@/components/ui/Img";
import Words from "@/components/ui/Words";
import BookCall from "@/components/booking/BookCall";
import Crumbs from "@/components/sections/Crumbs";
import CtaBand from "@/components/sections/CtaBand";
import ClientLogos from "@/components/sections/ClientLogos";
import { svc } from "@/lib/site";
import OfferCard from "@/components/offers/OfferCard";
import { PriceBadge } from "@/components/offers/PriceTags";

export type ServiceData = {
  slug: string;
  name: string;
  h1: string;
  lead: string;
  buttons: { label: string; href: string; primary: boolean }[];
  proof: string[];
  photo: string;
  photoAlt: string;
  chip: { value: string; label: string };
  deliver: { label: string; title: string; steps: { title: string; text: string }[] };
  faq: { q: string; a: string }[];
  faqTitle: string;
  related: string[];
  relatedTitle: string;
  cta: { title: string; text: string; label: string; href: string };
  price?: string;
  offers?: { label: string; title: string; slugs: string[]; popular?: string };
};

// Service page template
export default function ServiceTemplate({ data, children }: { data: ServiceData; children: ReactNode }) {
  return (
    <>
      <section className="page-hero svc-hero">
        <div className="wrap grid2">
          <div>
            <Crumbs items={[["Home", "/"], ["Services", "/services/"], [data.name, `/services/${data.slug}/`]]} />
            <Words as="h1" className="h1 words">
              {data.h1}
            </Words>
            <p className="lead" data-reveal="load">
              {data.lead}
            </p>
            <div className="btns" data-reveal="load">
              {data.buttons.map((b) =>
                /-minute call/.test(b.label) ? (
                  <BookCall key={b.label} className={b.primary ? "btn" : "btn btn-ghost"} />
                ) : (
                  <Link key={b.label} href={b.href} className={b.primary ? "btn" : "btn btn-ghost"}>
                    {b.label}
                    {b.primary && (
                      <>
                        {" "}
                        <span className="chev">»</span>
                      </>
                    )}
                  </Link>
                ),
              )}
            </div>
            {data.price && (
              <div data-reveal="load">
                <PriceBadge slug={data.price} />
              </div>
            )}
            <div className="proof-chips" data-reveal="load">
              {data.proof.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
          </div>
          <div className="svc-photo" data-reveal="load">
            <Img src={data.photo} alt={data.photoAlt} sizes="(max-width: 860px) 100vw, 42vw" priority />
            <div className="float-chip">
              <b>{data.chip.value}</b>
              <span>{data.chip.label}</span>
            </div>
          </div>
        </div>
      </section>
      <ClientLogos variant="strip" />
      {children}
      <section className="band mist">
        <div className="wrap">
          <span className="label">{data.deliver.label}</span>
          <h2 className="h2" data-reveal="" style={{ marginBottom: 40 }}>
            {data.deliver.title}
          </h2>
          <div className="deliver" data-reveal-group="">
            {data.deliver.steps.map((s) => (
              <div key={s.title}>
                <b>{s.title}</b>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {data.offers && (
        <section className="band offers-band" aria-labelledby="offers-title">
          <div className="wrap">
            <span className="label">{data.offers.label}</span>
            <h2 className="h2" id="offers-title" data-reveal="" style={{ marginBottom: 36 }}>
              {data.offers.title}
            </h2>
            <div className="offer-grid">
              {data.offers.slugs.map((slug) => (
                <OfferCard key={slug} slug={slug} popular={slug === data.offers?.popular} />
              ))}
            </div>
          </div>
        </section>
      )}
      {data.faq.length > 0 && (
        <section className="band light">
          <div className="wrap faq-wrap">
            <div>
              <span className="label">FAQ</span>
              <h2 className="h2">{data.faqTitle}</h2>
            </div>
            <div className="faq">
              {data.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
      {data.related.length > 0 && (
        <section className="band mist">
          <div className="wrap">
            <span className="label">Related services</span>
            <h2 className="h2" style={{ marginBottom: 40 }}>
              {data.relatedTitle}
            </h2>
            <div className="bento bento-2">
              {data.related.map((slug) => {
                const s = svc(slug);
                return (
                  <Link key={slug} href={`/services/${slug}/`} className="tile">
                    <div className="bg">
                      <Img src={`/images/photos/${s.tile}.webp`} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" />
                    </div>
                    <Img className="ic" src={`/images/icons/${s.icon}-on-dark.svg`} alt="" />
                    <h3>{s.name}</h3>
                    <p>{s.blurb}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
      <CtaBand title={data.cta.title} text={data.cta.text} label={data.cta.label} href={data.cta.href} />
    </>
  );
}
