import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";
import FeatList from "@/components/interactive/FeatList";

// custom-software-development
export default function CustomSoftwareDevelopmentBody() {
  return (
    <>
      <section className="band">
        <div className="wrap problem-split">
          <div>
            <span className="label">The challenge</span>
            <p className="big" data-reveal="">
              Your business is unique. Your software should be too.
            </p>
            <p data-reveal="">
              Spreadsheets, disconnected tools and workarounds slow teams down. Custom software brings your processes,
              data and people into one system built for you.
            </p>
          </div>
          <div className="split-img" data-reveal="">
            <Img src="/images/photos/custom-software.webp" alt="" sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <span className="label">What we build</span>
          <h2 className="h2" style={{ marginBottom: "48px" } as CSSProperties}>
            Systems built around your workflow
          </h2>
          <FeatList className="feat-wrap">
            <div className="feat-media">
              <Img
                src="/images/portfolio/fleetline-logistics-platform-1600.webp"
                alt="Custom operations dashboard concept on laptop and phone"
                className="on"
                sizes="(max-width: 860px) 100vw, 50vw"
              />
              <Img
                src="/images/portfolio/medora-clinic-booking-1600.webp"
                alt="Client booking portal concept"
                sizes="(max-width: 860px) 100vw, 50vw"
              />
              <Img
                src="/images/portfolio/vaultix-wealth-platform-1600.webp"
                alt="SaaS dashboard concept"
                sizes="(max-width: 860px) 100vw, 50vw"
              />
              <Img
                src="/images/photos/ins-custom-vs-shelf.webp"
                alt="Legacy boxed software replaced by a modern custom dashboard"
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            </div>
            <div className="feat-list">
              <div className="feat-item on">
                <h3>Internal tools and ERPs</h3>
                <p>Replace manual processes with one system your team actually enjoys using.</p>
              </div>
              <div className="feat-item">
                <h3>Client and partner portals</h3>
                <p>Give customers secure self-service access to orders, documents and support.</p>
              </div>
              <div className="feat-item">
                <h3>SaaS platforms</h3>
                <p>Multi-tenant products with subscriptions, roles and admin panels.</p>
              </div>
              <div className="feat-item">
                <h3>Legacy system modernization</h3>
                <p>Rebuild old software on a modern stack without losing your data.</p>
              </div>
            </div>
          </FeatList>
        </div>
      </section>
      <section className="band mist">
        <div className="wrap">
          <span className="label">Why build custom with Corevex</span>
          <div className="statements" data-reveal-group="" style={{ marginTop: "24px" } as CSSProperties}>
            <div>Solution architect on every project</div>
            <div>Built around your workflow, not a template</div>
            <div>Full code and documentation handover</div>
          </div>
        </div>
      </section>
      <section className="band dark" style={{ background: "var(--ink)" } as CSSProperties}>
        <div className="wrap case-band">
          <div className="shot" data-reveal="">
            <Img
              src="/images/portfolio/fleetline-logistics-platform-1600.webp"
              alt="Fleetline logistics product on laptop and phone"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
          <div>
            <span className="label">Featured design study · Logistics</span>
            <h2 className="h2" data-reveal="">
              Fleetline
            </h2>
            <p className="lead" style={{ marginTop: "16px" } as CSSProperties}>
              Live operations dashboard and driver app on one shared backend.
            </p>
            <ul>
              <li>Scoped with a solution architect</li>
              <li>Designed as a working product, web and mobile</li>
              <li>Structured for full code handover</li>
            </ul>
            <Link href="/work/fleetline-logistics-platform/" className="btn">
              {"See the design study "}
              <span className="chev">»</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
