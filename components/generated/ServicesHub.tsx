import type { CSSProperties } from "react";
import Link from "next/link";
import Words from "@/components/ui/Words";

// ServicesHub
export default function ServicesHub() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>Services</span>
          </nav>
          <Words as="h1" className="h1 words" style={{ maxWidth: "18ch" }}>
            {"Software development services from one senior team"}
          </Words>
          <p className="lead" data-reveal="load">
            Eight services, one senior team. From custom platforms and SaaS products to mobile apps and AI agents, we
            cover every layer with dedicated designers, engineers, QA and project managers.
          </p>
        </div>
      </section>
      <section className="band" style={{ paddingTop: "0" } as CSSProperties}>
        <div className="wrap">
          <div className="svc-rows" data-reveal-group="">
            <Link
              href="/services/custom-software-development/"
              className="svc-row"
            >
              <div>
                <h2>Custom Software Development</h2>
              </div>
              <div>
                <p>Software shaped around how your business actually works.</p>
                <div className="chips">
                  <span className="chip">Internal tools</span>
                  <span className="chip">Client portals</span>
                  <span className="chip">SaaS platforms</span>
                </div>
              </div>
              <span className="go" aria-hidden="true">
                »
              </span>
            </Link>
            <Link
              href="/services/full-stack-development/"
              className="svc-row"
            >
              <div>
                <h2>Full-Stack Development</h2>
              </div>
              <div>
                <p>Web products built to scale from day one.</p>
                <div className="chips">
                  <span className="chip">React and Next.js</span>
                  <span className="chip">Node.js and .NET</span>
                  <span className="chip">APIs</span>
                </div>
              </div>
              <span className="go" aria-hidden="true">
                »
              </span>
            </Link>
            <Link
              href="/services/mobile-app-development/"
              className="svc-row"
            >
              <div>
                <h2>Mobile App Development</h2>
              </div>
              <div>
                <p>iOS and Android apps people keep using.</p>
                <div className="chips">
                  <span className="chip">React Native</span>
                  <span className="chip">Flutter</span>
                  <span className="chip">App store launch</span>
                </div>
              </div>
              <span className="go" aria-hidden="true">
                »
              </span>
            </Link>
            <Link
              href="/services/ai-llm-development/"
              className="svc-row"
            >
              <div>
                <h2>AI and LLM Development</h2>
              </div>
              <div>
                <p>AI that does real work inside your product.</p>
                <div className="chips">
                  <span className="chip">LLM features</span>
                  <span className="chip">AI assistants</span>
                  <span className="chip">RAG search</span>
                </div>
              </div>
              <span className="go" aria-hidden="true">
                »
              </span>
            </Link>
            <Link href="/services/ai-automation/" className="svc-row">
              <div>
                <h2>AI Automation and Agents</h2>
              </div>
              <div>
                <p>Remove the manual work from your operations.</p>
                <div className="chips">
                  <span className="chip">AI agents</span>
                  <span className="chip">Workflow automation</span>
                  <span className="chip">Integrations</span>
                </div>
              </div>
              <span className="go" aria-hidden="true">
                »
              </span>
            </Link>
            <Link
              href="/services/saas-app-development/"
              className="svc-row"
            >
              <div>
                <h2>SaaS App Development</h2>
              </div>
              <div>
                <p>Subscription products built to launch, sell and scale.</p>
                <div className="chips">
                  <span className="chip">Multi-tenant</span>
                  <span className="chip">Subscriptions and billing</span>
                  <span className="chip">Admin panels</span>
                </div>
              </div>
              <span className="go" aria-hidden="true">
                »
              </span>
            </Link>
            <Link
              href="/services/ai-agents-as-a-service/"
              className="svc-row"
            >
              <div>
                <h2>AI Agents as a Service</h2>
              </div>
              <div>
                <p>Managed AI agents that do real work for your team.</p>
                <div className="chips">
                  <span className="chip">Support agents</span>
                  <span className="chip">Sales agents</span>
                  <span className="chip">Operations agents</span>
                </div>
              </div>
              <span className="go" aria-hidden="true">
                »
              </span>
            </Link>
            <Link
              href="/services/code-rescue/"
              className="svc-row"
            >
              <div>
                <h2>Code Rescue and Takeover</h2>
              </div>
              <div>
                <p>Take over and fix apps built with AI tools.</p>
                <div className="chips">
                  <span className="chip">Bug fixing</span>
                  <span className="chip">Security and RBAC</span>
                  <span className="chip">Billing</span>
                </div>
              </div>
              <span className="go" aria-hidden="true">
                »
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="band light" id="models">
        <div className="wrap">
          <span className="label">Engagement models</span>
          <h2 className="h2" data-reveal="" style={{ marginBottom: "48px" } as CSSProperties}>
            Work with us the way that suits you
          </h2>
          <div className="models" data-reveal-group="">
            <div>
              <h3>Dedicated Team</h3>
              <p>A full team that works as part of yours, scaled up or down as you need.</p>
            </div>
            <div>
              <h3>Fixed-Scope Project</h3>
              <p>An agreed scope delivered and handed over in full.</p>
            </div>
            <div>
              <h3>MVP Build</h3>
              <p>A focused first version to test your idea with real users.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap">
          <div>
            <h2 className="h2">Have something to build?</h2>
            <p>Tell us what you need. A senior engineer reads every enquiry and replies personally.</p>
          </div>
          <Link href="/contact/" className="btn">
            {"Start a project "}
            <span className="chev">»</span>
          </Link>
        </div>
      </section>
    </>
  );
}
