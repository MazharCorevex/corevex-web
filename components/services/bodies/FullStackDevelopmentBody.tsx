import type { CSSProperties } from "react";
import OfferCard from "@/components/offers/OfferCard";
import Link from "next/link";
import Img from "@/components/ui/Img";

// full-stack-development
export default function FullStackDevelopmentBody() {
  return (
    <>
      <section className="band">
        <div className="wrap problem-split">
          <div>
            <span className="label">The challenge</span>
            <p className="big" data-reveal="">
              Front end and back end, built by the same team.
            </p>
            <p data-reveal="">
              When one team owns the whole stack, features ship faster, bugs get fixed at the source, and nothing is
              lost in handoffs.
            </p>
          </div>
          <div className="split-img" data-reveal="">
            <Img src="/images/photos/pair-programming.webp" alt="" sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <span className="label">What we build</span>
          <h2 className="h2" style={{ marginBottom: "48px" } as CSSProperties}>
            Every layer of your web product
          </h2>
          <div className="layers">
            <div className="layer" style={{ "--i": "0" } as CSSProperties}>
              <b>Interface</b>
              <span>Responsive web apps and admin dashboards</span>
              <em>React · Next.js · Angular · TypeScript</em>
            </div>
            <div className="layer" style={{ "--i": "1" } as CSSProperties}>
              <b>Logic and APIs</b>
              <span>REST and GraphQL APIs, integrations, business logic</span>
              <em>Node.js · .NET · Python</em>
            </div>
            <div className="layer" style={{ "--i": "2" } as CSSProperties}>
              <b>Data</b>
              <span>Database design, reporting, data migration</span>
              <em>SQL and NoSQL databases</em>
            </div>
            <div className="layer" style={{ "--i": "3" } as CSSProperties}>
              <b>Cloud and DevOps</b>
              <span>Deployment, monitoring, scaling</span>
              <em>Cloud hosting · CI/CD pipelines</em>
            </div>
          </div>
        </div>
      </section>
      <section className="band light">
        <div className="wrap split">
          <div>
            <span className="label">Dedicated developers</span>
            <h2 className="h2" data-reveal="">
              Hire dedicated full stack developers
            </h2>
            <p className="lead" data-reveal="" style={{ margin: "20px 0 30px" } as CSSProperties}>
              Add experienced full stack developers to your team, supported by our project managers and QA engineers,
              without the cost and time of hiring in-house.
            </p>
          </div>
          <div data-reveal="">
            <OfferCard slug="dedicated-developer" />
          </div>
        </div>
      </section>
      <section className="band dark" style={{ background: "var(--ink)" } as CSSProperties}>
        <div className="wrap case-band">
          <div className="shot" data-reveal="">
            <Img
              src="/images/portfolio/mary-properties-1600.webp"
              alt="Mary Properties website, properties admin, enquiries inbox and overview dashboard"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
          <div>
            <span className="label">Featured design study · Real estate</span>
            <h2 className="h2" data-reveal="">
              Mary Properties
            </h2>
            <p className="lead" style={{ marginTop: "16px" } as CSSProperties}>
              Real estate website with a members area and an admin panel for listings and enquiries.
            </p>
            <ul>
              <li>Scoped with a solution architect</li>
              <li>Designed as a working product, web and mobile</li>
              <li>Structured for full code handover</li>
            </ul>
            <Link href="/work/mary-properties/" className="btn">
              {"See the design study "}
              <span className="chev">»</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
