import type { CSSProperties } from "react";
import Link from "next/link";
import Tabs from "@/components/interactive/Tabs";

// TechStack
export default function TechStack() {
  return (
    <section className="band" data-stx="">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="label">Tech stack</span>
            <h2 className="h2" data-reveal="">
              A tech stack that fits your product, not the other way round
            </h2>
          </div>
          <p className="lead" data-reveal="">
            Our engineers work across multiple stacks, so we choose the right tools for your product instead of forcing
            one framework onto every problem.
          </p>
        </div>
        <Tabs className="stx">
          <div className="stx-nav" role="tablist" aria-label="Technology categories">
            <button className="stx-tab" role="tab" aria-selected="true" aria-controls="stx-frontend">
              <span className="stx-ic">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 9h18M9 20V9" />
                </svg>
              </span>
              Frontend<span className="stx-ct">5</span>
            </button>
            <button className="stx-tab" role="tab" aria-selected="false" aria-controls="stx-backend">
              <span className="stx-ic">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="7" rx="1.5" />
                  <rect x="4" y="13" width="16" height="7" rx="1.5" />
                  <path d="M8 7.5h.01M8 16.5h.01" />
                </svg>
              </span>
              Backend<span className="stx-ct">3</span>
            </button>
            <button className="stx-tab" role="tab" aria-selected="false" aria-controls="stx-mobile">
              <span className="stx-ic">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="7" y="3" width="10" height="18" rx="2" />
                  <path d="M11 18h2" />
                </svg>
              </span>
              Mobile<span className="stx-ct">2</span>
            </button>
            <button className="stx-tab" role="tab" aria-selected="false" aria-controls="stx-ai">
              <span className="stx-ic">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4a3 3 0 0 0-3 3 3 3 0 0 0-3 5 3 3 0 0 0 3 5 3 3 0 0 0 6 0 3 3 0 0 0 3-5 3 3 0 0 0-3-5 3 3 0 0 0-3-3z" />
                  <path d="M12 4v16" />
                </svg>
              </span>
              AI and LLM<span className="stx-ct">3</span>
            </button>
            <button className="stx-tab" role="tab" aria-selected="false" aria-controls="stx-automation">
              <span className="stx-ic">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="6" cy="6" r="2.5" />
                  <circle cx="18" cy="12" r="2.5" />
                  <circle cx="6" cy="18" r="2.5" />
                  <path d="M8.5 6h4a3 3 0 0 1 3 3v.5M8.5 18h4a3 3 0 0 0 3-3v-.5" />
                </svg>
              </span>
              Automation<span className="stx-ct">3</span>
            </button>
          </div>
          <div className="stx-body">
            <div className="stx-panel on" id="stx-frontend" role="tabpanel">
              <div className="stx-grid">
                <div className="stx-card" style={{ "--brand": "#3178C6" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/typescript.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>TypeScript</h3>
                  <p>Typed, reliable product code</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#C9A400" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/javascript.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>JavaScript</h3>
                  <p>Interactive web experiences</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#149ECA" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/react.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>React</h3>
                  <p>Dashboards and customer portals</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#000000" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/nextdotjs.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>Next.js</h3>
                  <p>Fast, SEO-ready SaaS products</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#DD0031" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/angular.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>Angular</h3>
                  <p>Large enterprise web apps</p>
                </div>
              </div>
              <Link href="/work/vaultix-wealth-platform/" className="link stx-proof">
                {"See it in a design study: Vaultix wealth platform "}
                <span className="chev">»</span>
              </Link>
            </div>
            <div className="stx-panel" id="stx-backend" role="tabpanel">
              <div className="stx-grid">
                <div className="stx-card" style={{ "--brand": "#5FA04E" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/nodedotjs.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>Node.js</h3>
                  <p>APIs and real-time services</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#512BD4" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/dotnet.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>.NET</h3>
                  <p>Enterprise systems and integrations</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#3776AB" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/python.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>Python</h3>
                  <p>Data services and AI back ends</p>
                </div>
              </div>
              <Link href="/work/fleetline-logistics-platform/" className="link stx-proof">
                {"See it in a design study: Fleetline logistics platform "}
                <span className="chev">»</span>
              </Link>
            </div>
            <div className="stx-panel" id="stx-mobile" role="tabpanel">
              <div className="stx-grid">
                <div className="stx-card" style={{ "--brand": "#149ECA" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/react.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>React Native</h3>
                  <p>Apps that share code with web</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#02569B" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/flutter.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>Flutter</h3>
                  <p>Branded iOS and Android apps</p>
                </div>
              </div>
              <Link href="/work/pulse-fitness-app/" className="link stx-proof">
                {"See it in a design study: Pulse fitness app "}
                <span className="chev">»</span>
              </Link>
            </div>
            <div className="stx-panel" id="stx-ai" role="tabpanel">
              <div className="stx-grid">
                <div className="stx-card" style={{ "--brand": "#2E8579" } as CSSProperties}>
                  <span className="stx-logo">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 5h16v11H9l-5 4z" />
                      <path d="M8 10h8M8 13h5" />
                    </svg>
                  </span>
                  <h3>LLM APIs</h3>
                  <p>Assistants and copilots</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#2E8579" } as CSSProperties}>
                  <span className="stx-logo">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <ellipse cx="10" cy="6" rx="6" ry="2.5" />
                      <path d="M4 6v8c0 1.4 2.7 2.5 6 2.5" />
                      <path d="M16 6v4" />
                      <circle cx="17" cy="16" r="3" />
                      <path d="M19.2 18.2 21.5 20.5" />
                    </svg>
                  </span>
                  <h3>RAG</h3>
                  <p>Answers from your own data</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#3776AB" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/python.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>Python ML</h3>
                  <p>Forecasting and classification</p>
                </div>
              </div>
              <Link href="/work/ledgerly-ai-document-extraction/" className="link stx-proof">
                {"See it in a design study: Ledgerly AI document extraction "}
                <span className="chev">»</span>
              </Link>
            </div>
            <div className="stx-panel" id="stx-automation" role="tabpanel">
              <div className="stx-grid">
                <div className="stx-card" style={{ "--brand": "#EA4B71" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/n8n.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>n8n</h3>
                  <p>Self-hosted workflow automation</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#6D00CC" } as CSSProperties}>
                  <span
                    className="stx-logo stx-mask"
                    style={{ "--logo": "url(/images/tech/make.svg)" } as CSSProperties}
                    aria-hidden="true"
                  />
                  <h3>Make</h3>
                  <p>Visual multi-app scenarios</p>
                </div>
                <div className="stx-card" style={{ "--brand": "#2E8579" } as CSSProperties}>
                  <span className="stx-logo">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 5h18l-7 8v6l-4 2v-8z" />
                    </svg>
                  </span>
                  <h3>GoHighLevel</h3>
                  <p>CRM, funnels and follow-ups</p>
                </div>
              </div>
              <Link href="/work/relay-support-automation/" className="link stx-proof">
                {"See it in a design study: Relay support automation "}
                <span className="chev">»</span>
              </Link>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
