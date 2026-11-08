import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";

// saas-app-development
export default function SaasAppDevelopmentBody() {
  return (
    <>
      <section className="band">
        <div className="wrap problem-split">
          <div>
            <span className="label">The challenge</span>
            <p className="big" data-reveal="">
              A SaaS product has to sell, scale and stay online.
            </p>
            <p data-reveal="">
              Multi-tenant data, subscriptions, onboarding and uptime all need to be right from day one. We build SaaS
              products with those foundations in place, so you can launch fast and grow without a rebuild.
            </p>
          </div>
          <div className="split-img" data-reveal="">
            <Img src="/images/photos/saas-dashboard.webp" alt="" sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <span className="label">What we build</span>
          <h2 className="h2" style={{ marginBottom: "44px" } as CSSProperties}>
            Everything a SaaS product needs
          </h2>
          <div className="trust" data-reveal-group="">
            <div>
              <span className="ib">
                <Img src="/images/icons/saas.svg" alt="" />
              </span>
              <b>Multi-tenant architecture</b>
              <p>One platform, many customer accounts, with data kept strictly separate.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/custom-software.svg" alt="" />
              </span>
              <b>Subscriptions and billing</b>
              <p>Plans, trials, seats and usage billing connected to your payment provider.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/full-stack.svg" alt="" />
              </span>
              <b>Admin and customer portals</b>
              <p>Roles, invitations, onboarding flows and a super admin panel.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/ai-ml.svg" alt="" />
              </span>
              <b>AI features built in</b>
              <p>Assistants, search and automation that make your product stand out.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band mist">
        <div className="wrap">
          <span className="label">SaaS stack</span>
          <h2 className="h2" style={{ marginBottom: "40px" } as CSSProperties}>
            Proven tools for products that scale
          </h2>
          <div className="stack-grid" data-reveal-group="">
            <div>
              <h3>Web app</h3>
              <div className="techs">
                <span>Next.js</span>
                <span>React</span>
                <span>Angular</span>
                <span>TypeScript</span>
              </div>
            </div>
            <div>
              <h3>API</h3>
              <div className="techs">
                <span>Node.js</span>
                <span>.NET</span>
                <span>Python</span>
              </div>
            </div>
            <div>
              <h3>Data and billing</h3>
              <div className="techs">
                <span>PostgreSQL</span>
                <span>Subscriptions</span>
                <span>Usage metering</span>
              </div>
            </div>
            <div>
              <h3>Cloud</h3>
              <div className="techs">
                <span>Cloud hosting</span>
                <span>CI/CD</span>
                <span>Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="band dark" style={{ background: "var(--ink)" } as CSSProperties}>
        <div className="wrap case-band">
          <div className="shot" data-reveal="">
            <Img
              src="/images/portfolio/highstreet-content-planning-1600.webp"
              alt="Highstreet content plan, comparable businesses, performance and dashboard screens"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
          <div>
            <span className="label">Featured design study · Local retail</span>
            <h2 className="h2" data-reveal="">
              Highstreet
            </h2>
            <p className="lead" style={{ marginTop: "16px" } as CSSProperties}>
              Content planning and publishing for multi-branch local businesses.
            </p>
            <ul>
              <li>Scoped with a solution architect</li>
              <li>Designed as a working product, web and mobile</li>
              <li>Structured for full code handover</li>
            </ul>
            <Link href="/work/highstreet-content-planning/" className="btn">
              {"See the design study "}
              <span className="chev">»</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
