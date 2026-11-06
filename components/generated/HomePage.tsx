import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";
import BookCall from "@/components/booking/BookCall";
import Words from "@/components/ui/Words";
import HeroArt from "@/components/home/HeroArt";
import ClientLogos from "@/components/sections/ClientLogos";
import HealthCheck from "@/components/home/HealthCheck";
import CoreSection from "@/components/home/CoreSection";
import Rail from "@/components/interactive/Rail";
import Tabs from "@/components/interactive/Tabs";
import Accordion from "@/components/interactive/Accordion";
import QuickContact from "@/components/forms/QuickContact";

// HomePage
export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <span className="label">Custom software · SaaS · AI agents</span>
            <Words as="p" className="display words" br={2} aria-hidden="true">
              {"Engineered at the Core."}
            </Words>
            <h1 className="seo-h1">Custom software, AI and mobile app development for growing businesses</h1>
            <p className="lead" data-reveal="load">
              We design, build and hand over the software your business runs on: web platforms, SaaS products, mobile
              apps and AI agents that do real work.
            </p>
            <div className="btns" data-reveal="load">
              <Link href="/contact/" className="btn">
                {"Start a project "}
                <span className="chev">»</span>
              </Link>
              <BookCall className="btn btn-ghost">Book a 30-minute call</BookCall>
            </div>
            <div className="proof" data-reveal="load">
              <span>PSEB registered</span>
              <span>Founded 2022</span>
              <span>50+ engineers</span>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>
      <ClientLogos variant="marquee" />
      <section className="band dark svc-band">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Services</span>
              <h2 className="h2" data-reveal="">
                Software, SaaS, mobile and AI agents under one roof
              </h2>
            </div>
            <p className="lead" data-reveal="">
              One senior team takes you from idea to launch, so nothing gets lost between vendors, handoffs or time
              zones.
            </p>
          </div>
          <div className="bento" data-reveal-group="">
            <Link href="/services/custom-software-development/" className="tile t-wide">
              <div className="bg">
                <Img src="/images/photos/custom-software.webp" alt="" fill sizes="(max-width: 860px) 100vw, 66vw" />
              </div>
              <Img
                src="/images/icons/custom-software-on-dark.svg"
                alt=""
                className="ic"
                sizes="(max-width: 860px) 100vw, 66vw"
              />
              <h3>Custom Software Development</h3>
              <p>Software shaped around how your business actually works.</p>
              <div className="reveal">
                <span className="chip">Internal tools</span>
                <span className="chip">Client portals</span>
                <span className="chip">SaaS platforms</span>
              </div>
            </Link>
            <Link href="/services/full-stack-development/" className="tile ">
              <div className="bg">
                <Img src="/images/photos/pair-programming.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
              </div>
              <Img
                src="/images/icons/full-stack-on-dark.svg"
                alt=""
                className="ic"
                sizes="(max-width: 860px) 100vw, 33vw"
              />
              <h3>Full-Stack Development</h3>
              <p>Web products built to scale from day one.</p>
              <div className="reveal">
                <span className="chip">React and Next.js</span>
                <span className="chip">Node.js and .NET</span>
                <span className="chip">APIs</span>
              </div>
            </Link>
            <Link href="/services/mobile-app-development/" className="tile ">
              <div className="bg">
                <Img src="/images/photos/mobile-in-hand.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
              </div>
              <Img
                src="/images/icons/web-mobile-on-dark.svg"
                alt=""
                className="ic"
                sizes="(max-width: 860px) 100vw, 33vw"
              />
              <h3>Mobile App Development</h3>
              <p>iOS and Android apps people keep using.</p>
              <div className="reveal">
                <span className="chip">React Native</span>
                <span className="chip">Flutter</span>
                <span className="chip">App store launch</span>
              </div>
            </Link>
            <Link href="/services/ai-llm-development/" className="tile t-ai">
              <div className="bg">
                <Img src="/images/photos/ai-assistant.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
              </div>
              <Img src="/images/icons/ai-ml-on-dark.svg" alt="" className="ic" sizes="(max-width: 860px) 100vw, 33vw" />
              <h3>AI and LLM Development</h3>
              <p>AI that does real work inside your product.</p>
              <div className="reveal">
                <span className="chip">LLM features</span>
                <span className="chip">AI assistants</span>
                <span className="chip">RAG search</span>
              </div>
            </Link>
            <Link href="/services/ai-automation/" className="tile t-strip">
              <div className="bg">
                <Img src="/images/photos/automation.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
              </div>
              <Img
                src="/images/icons/automation-on-dark.svg"
                alt=""
                className="ic"
                sizes="(max-width: 860px) 100vw, 33vw"
              />
              <h3>AI Automation and Agents</h3>
              <p>Remove the manual work from your operations.</p>
              <div className="reveal">
                <span className="chip">AI agents</span>
                <span className="chip">Workflow automation</span>
                <span className="chip">Integrations</span>
              </div>
            </Link>
            <Link href="/services/saas-app-development/" className="tile t-half">
              <div className="bg">
                <Img src="/images/photos/saas-dashboard.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
              </div>
              <Img src="/images/icons/saas-on-dark.svg" alt="" className="ic" sizes="(max-width: 860px) 100vw, 33vw" />
              <h3>SaaS App Development</h3>
              <p>Subscription products built to launch, sell and scale.</p>
              <div className="reveal">
                <span className="chip">Multi-tenant</span>
                <span className="chip">Subscriptions and billing</span>
                <span className="chip">Admin panels</span>
              </div>
            </Link>
            <Link href="/services/ai-agents-as-a-service/" className="tile t-half">
              <div className="bg">
                <Img src="/images/photos/aaas-console.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
              </div>
              <Img src="/images/icons/aaas-on-dark.svg" alt="" className="ic" sizes="(max-width: 860px) 100vw, 33vw" />
              <h3>AI Agents as a Service</h3>
              <p>Managed AI agents that do real work for your team.</p>
              <div className="reveal">
                <span className="chip">Support agents</span>
                <span className="chip">Sales agents</span>
                <span className="chip">Operations agents</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section className="band mist rescue" id="code-rescue">
        <div className="wrap">
          <div className="rescue-top">
            <div>
              <span className="label">Code rescue</span>
              <h2 className="h2" data-reveal="">
                {"Built it with AI? We'll make it production-ready."}
              </h2>
              <p className="lead" data-reveal="">
                {
                  "Lovable, Bolt, Replit and Cursor get you to a demo fast. Real users, payments and security are where things break. We take over your codebase, fix what's stuck and get you to launch."
                }
              </p>
              <div className="rescue-tools" data-reveal="">
                <small>We take over apps built with</small>
                <span>Lovable</span>
                <span>Bolt</span>
                <span>Replit</span>
                <span>Cursor</span>
                <span>v0</span>
                <span>Base44</span>
              </div>
              <div className="btns" data-reveal="" style={{ marginTop: "28px" } as CSSProperties}>
                <Link href="/contact/" className="btn">
                  {"Book a code rescue call "}
                  <span className="chev">»</span>
                </Link>
                <Link href="/services/code-rescue/" className="btn btn-ghost">
                  See how it works
                </Link>
              </div>
            </div>
            <HealthCheck />
          </div>
          <div className="stuck" data-reveal-group="">
            <div>
              <b>Bugs and broken flows</b>
              <p>Features that worked in the demo fail with real users.</p>
            </div>
            <div>
              <b>UI/UX that does not convert</b>
              <p>Confusing screens, layout bugs and drop-offs.</p>
            </div>
            <div>
              <b>Billing and subscriptions</b>
              <p>Stripe plans, trials and failed payments done properly.</p>
            </div>
            <div>
              <b>Security gaps</b>
              <p>Exposed keys, missing database rules and open endpoints.</p>
            </div>
            <div>
              <b>Roles and permissions</b>
              <p>RBAC so each user sees only what they should.</p>
            </div>
            <div>
              <b>Performance and scaling</b>
              <p>Slow queries and pages fixed before traffic grows.</p>
            </div>
            <div>
              <b>Deployment and hosting</b>
              <p>Reliable releases, environments and monitoring.</p>
            </div>
            <div>
              <b>Code nobody can maintain</b>
              <p>Structure, tests and docs your next hire can follow.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band light">
        <div className="wrap">
          <span className="label">Corevex in numbers</span>
          <div className="numbers" data-reveal-group="">
            <div>
              <b data-count="2022">2022</b>
              <span>Founded</span>
            </div>
            <div>
              <b data-count="50" data-suffix="+">
                50+
              </b>
              <span>Engineers and specialists</span>
            </div>
            <div>
              <b data-count="10" data-suffix="+">
                10+
              </b>
              <span>Core technologies</span>
            </div>
            <div>
              <b>PSEB</b>
              <span>Registered software company</span>
            </div>
          </div>
        </div>
      </section>
      <CoreSection />
      <Rail className="band mist">
        <div className="wrap rail-head">
          <div>
            <span className="label">Work</span>
            <h2 className="h2" data-reveal="">
              How we design and build products
            </h2>
          </div>
          <div className="rail-ctrl">
            <button data-dir="-1" aria-label="Previous">
              ‹
            </button>
            <button data-dir="1" aria-label="Next">
              ›
            </button>
          </div>
        </div>
        <div className="rail">
          <Link href="/work/fleetline-logistics-platform/" className="rail-card">
            <div className="img">
              <Img
                src="/images/portfolio/fleetline-logistics-platform-1600.webp"
                alt="Fleetline logistics product shown on laptop and phone"
                sizes="(max-width: 600px) 85vw, 440px"
              />
            </div>
            <div className="meta">
              <span className="chip">Logistics</span> <span className="concept">Design study</span>
              <h3>Fleetline</h3>
              <p>Live operations dashboard and driver app on one shared backend.</p>
            </div>
          </Link>
          <Link href="/work/medora-clinic-booking/" className="rail-card">
            <div className="img">
              <Img
                src="/images/portfolio/medora-clinic-booking-1600.webp"
                alt="Medora healthcare product shown on laptop and phone"
                sizes="(max-width: 600px) 85vw, 440px"
              />
            </div>
            <div className="meta">
              <span className="chip">Healthcare</span> <span className="concept">Design study</span>
              <h3>Medora</h3>
              <p>Clinic scheduling and patient booking across web and mobile.</p>
            </div>
          </Link>
          <Link href="/work/pulse-fitness-app/" className="rail-card">
            <div className="img">
              <Img
                src="/images/portfolio/pulse-fitness-app-1600.webp"
                alt="Pulse health and fitness product shown on laptop and phone"
                sizes="(max-width: 600px) 85vw, 440px"
              />
            </div>
            <div className="meta">
              <span className="chip">Health and fitness</span> <span className="concept">Design study</span>
              <h3>Pulse</h3>
              <p>A cross-platform fitness app with workouts, progress and rest timers.</p>
            </div>
          </Link>
          <Link href="/work/ledgerly-ai-document-extraction/" className="rail-card">
            <div className="img">
              <Img
                src="/images/portfolio/ledgerly-ai-document-extraction-1600.webp"
                alt="Ledgerly AI finance product shown on laptop and phone"
                sizes="(max-width: 600px) 85vw, 440px"
              />
            </div>
            <div className="meta">
              <span className="chip">Finance</span> <span className="concept">Design study</span>
              <h3>Ledgerly AI</h3>
              <p>Invoice data extraction with confidence scores and ERP sync.</p>
            </div>
          </Link>
          <Link href="/work/relay-support-automation/" className="rail-card">
            <div className="img">
              <Img
                src="/images/portfolio/relay-support-automation-1600.webp"
                alt="Relay ecommerce product shown on laptop and phone"
                sizes="(max-width: 600px) 85vw, 440px"
              />
            </div>
            <div className="meta">
              <span className="chip">eCommerce</span> <span className="concept">Design study</span>
              <h3>Relay</h3>
              <p>An AI support workflow that answers, routes and escalates.</p>
            </div>
          </Link>
          <Link href="/work/vaultix-wealth-platform/" className="rail-card">
            <div className="img">
              <Img
                src="/images/portfolio/vaultix-wealth-platform-1600.webp"
                alt="Vaultix fintech product shown on laptop and phone"
                sizes="(max-width: 600px) 85vw, 440px"
              />
            </div>
            <div className="meta">
              <span className="chip">Fintech</span> <span className="concept">Design study</span>
              <h3>Vaultix</h3>
              <p>A wealth dashboard with portfolio tracking and a companion app.</p>
            </div>
          </Link>
        </div>
        <div className="wrap" style={{ marginTop: "36px" } as CSSProperties}>
          <Link href="/work/" className="link">
            {"View all work "}
            <span className="chev">»</span>
          </Link>
        </div>
      </Rail>
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
              Our engineers work across multiple stacks, so we choose the right tools for your product instead of
              forcing one framework onto every problem.
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
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
                      </svg>
                    </span>
                    <h3>TypeScript</h3>
                    <p>Typed, reliable product code</p>
                  </div>
                  <div className="stx-card" style={{ "--brand": "#C9A400" } as CSSProperties}>
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
                      </svg>
                    </span>
                    <h3>JavaScript</h3>
                    <p>Interactive web experiences</p>
                  </div>
                  <div className="stx-card" style={{ "--brand": "#149ECA" } as CSSProperties}>
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
                      </svg>
                    </span>
                    <h3>React</h3>
                    <p>Dashboards and customer portals</p>
                  </div>
                  <div className="stx-card" style={{ "--brand": "#000000" } as CSSProperties}>
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
                      </svg>
                    </span>
                    <h3>Next.js</h3>
                    <p>Fast, SEO-ready SaaS products</p>
                  </div>
                  <div className="stx-card" style={{ "--brand": "#DD0031" } as CSSProperties}>
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M16.712 17.711H7.288l-1.204 2.916L12 24l5.916-3.373-1.204-2.916ZM14.692 0l7.832 16.855.814-12.856L14.692 0ZM9.308 0 .662 3.999l.814 12.856L9.308 0Zm-.405 13.93h6.198L12 6.396 8.903 13.93Z" />
                      </svg>
                    </span>
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
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" />
                      </svg>
                    </span>
                    <h3>Node.js</h3>
                    <p>APIs and real-time services</p>
                  </div>
                  <div className="stx-card" style={{ "--brand": "#512BD4" } as CSSProperties}>
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L4.78 9.863a2.896 2.896 0 0 1-.258-.51h-.036c.032.189.048.592.048 1.21v5.772H3.157V7.53h1.659l3.965 6.32c.167.261.275.442.323.54h.024c-.04-.233-.06-.629-.06-1.185V7.529h1.372zm-8.703-.693a.868.829 0 0 1-.869.829.868.829 0 0 1-.868-.83.868.829 0 0 1 .868-.828.868.829 0 0 1 .869.829Z" />
                      </svg>
                    </span>
                    <h3>.NET</h3>
                    <p>Enterprise systems and integrations</p>
                  </div>
                  <div className="stx-card" style={{ "--brand": "#3776AB" } as CSSProperties}>
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M11.858 0c-.978.005-1.913.088-2.736.234C6.7.662 6.26 1.558 6.26 3.21v2.182h5.725v.727H4.111c-1.664 0-3.121 1-3.577 2.903-.526 2.181-.549 3.542 0 5.82.407 1.694 1.379 2.902 3.043 2.902h1.969v-2.616c0-1.89 1.635-3.557 3.576-3.557h5.72c1.591 0 2.862-1.31 2.862-2.91v-5.45c0-1.553-1.309-2.718-2.863-2.977A18 18 0 0 0 11.858 0M8.762 1.755c.591 0 1.074.491 1.074 1.095 0 .601-.483 1.087-1.074 1.087A1.08 1.08 0 0 1 7.688 2.85c0-.604.48-1.095 1.074-1.095m9.656 4.364v2.543c0 1.971-1.671 3.63-3.577 3.63H9.122c-1.566 0-2.862 1.34-2.862 2.91v5.452c0 1.551 1.349 2.464 2.862 2.91 1.813.532 3.55.628 5.72 0 1.44-.418 2.862-1.258 2.862-2.91V18.47h-5.719v-.727h8.582c1.664 0 2.284-1.16 2.862-2.903.598-1.793.573-3.518 0-5.819-.41-1.656-1.196-2.903-2.862-2.903zm-3.216 13.807a1.08 1.08 0 0 1 1.074 1.088c0 .604-.48 1.094-1.074 1.094-.592 0-1.075-.49-1.075-1.094 0-.601.483-1.088 1.075-1.088" />
                      </svg>
                    </span>
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
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
                      </svg>
                    </span>
                    <h3>React Native</h3>
                    <p>Apps that share code with web</p>
                  </div>
                  <div className="stx-card" style={{ "--brand": "#02569B" } as CSSProperties}>
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" />
                      </svg>
                    </span>
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
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M11.858 0c-.978.005-1.913.088-2.736.234C6.7.662 6.26 1.558 6.26 3.21v2.182h5.725v.727H4.111c-1.664 0-3.121 1-3.577 2.903-.526 2.181-.549 3.542 0 5.82.407 1.694 1.379 2.902 3.043 2.902h1.969v-2.616c0-1.89 1.635-3.557 3.576-3.557h5.72c1.591 0 2.862-1.31 2.862-2.91v-5.45c0-1.553-1.309-2.718-2.863-2.977A18 18 0 0 0 11.858 0M8.762 1.755c.591 0 1.074.491 1.074 1.095 0 .601-.483 1.087-1.074 1.087A1.08 1.08 0 0 1 7.688 2.85c0-.604.48-1.095 1.074-1.095m9.656 4.364v2.543c0 1.971-1.671 3.63-3.577 3.63H9.122c-1.566 0-2.862 1.34-2.862 2.91v5.452c0 1.551 1.349 2.464 2.862 2.91 1.813.532 3.55.628 5.72 0 1.44-.418 2.862-1.258 2.862-2.91V18.47h-5.719v-.727h8.582c1.664 0 2.284-1.16 2.862-2.903.598-1.793.573-3.518 0-5.819-.41-1.656-1.196-2.903-2.862-2.903zm-3.216 13.807a1.08 1.08 0 0 1 1.074 1.088c0 .604-.48 1.094-1.074 1.094-.592 0-1.075-.49-1.075-1.094 0-.601.483-1.088 1.075-1.088" />
                      </svg>
                    </span>
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
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4.8 16.8c.45 0 .6-.15.6-.6V15c0-1.8.6-2.4 2.4-2.4H9c1.8 0 2.4.6 2.4 2.4v1.2c0 .45.15.6.6.6s.6-.15.6-.6V15c0-1.8.6-2.4 2.4-2.4h1.2c1.8 0 2.4.6 2.4 2.4v1.2c0 .45.15.6.6.6s.6-.15.6-.6V15c0-1.8.6-2.4 2.4-2.4h1.2c.45 0 .6-.15.6-.6s-.15-.6-.6-.6h-1.2c-1.8 0-2.4-.6-2.4-2.4V7.8c0-.45-.15-.6-.6-.6s-.6.15-.6.6V9c0 1.8-.6 2.4-2.4 2.4H15c-1.8 0-2.4-.6-2.4-2.4V7.8c0-.45-.15-.6-.6-.6s-.6.15-.6.6V9c0 1.8-.6 2.4-2.4 2.4H7.8c-1.8 0-2.4-.6-2.4-2.4V7.8c0-.45-.15-.6-.6-.6s-.6.15-.6.6V9c0 1.8-.6 2.4-2.4 2.4H.6c-.45 0-.6.15-.6.6s.15.6.6.6h1.2c1.8 0 2.4.6 2.4 2.4v1.2c0 .45.15.6.6.6" />
                      </svg>
                    </span>
                    <h3>n8n</h3>
                    <p>Self-hosted workflow automation</p>
                  </div>
                  <div className="stx-card" style={{ "--brand": "#6D00CC" } as CSSProperties}>
                    <span className="stx-logo">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M13.38 3.498c-.27 0-.511.19-.566.465L9.85 18.986a.578.578 0 0 0 .453.678l4.095.826a.58.58 0 0 0 .682-.455l2.963-15.021a.578.578 0 0 0-.453-.678l-4.096-.826a.589.589 0 0 0-.113-.012zm-5.876.098a.576.576 0 0 0-.516.318L.062 17.697a.575.575 0 0 0 .256.774l3.733 1.877a.578.578 0 0 0 .775-.258l6.926-13.781a.577.577 0 0 0-.256-.776L7.762 3.658a.571.571 0 0 0-.258-.062zm11.74.115a.576.576 0 0 0-.576.576v15.426c0 .318.258.578.576.578h4.178a.58.58 0 0 0 .578-.578V4.287a.578.578 0 0 0-.578-.576Z" />
                      </svg>
                    </span>
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
      <section className="band mist">
        <div className="wrap steps-wrap">
          <div className="sticky">
            <span className="label">How we work</span>
            <h2 className="h2">A clear process from first call to handover</h2>
            <p className="lead" style={{ marginTop: "18px" } as CSSProperties}>
              Five clear steps, one accountable team, and progress you can see every week.
            </p>
            <div className="btns" style={{ marginTop: "30px" } as CSSProperties}>
              <Link href="/contact/" className="btn">
                {"Start a project "}
                <span className="chev">»</span>
              </Link>
            </div>
          </div>
          <div className="steps">
            <div className="fill" />
            <div className="step">
              <b>Step 1</b>
              <h3>Discover</h3>
              <p>We learn your goals, users and constraints, and map the solution with a solution architect.</p>
            </div>
            <div className="step">
              <b>Step 2</b>
              <h3>Design</h3>
              <p>Our UI/UX team turns the plan into flows and interfaces you can click through.</p>
            </div>
            <div className="step">
              <b>Step 3</b>
              <h3>Build</h3>
              <p>Senior engineers build in short cycles with regular demos, so you see progress as it happens.</p>
            </div>
            <div className="step">
              <b>Step 4</b>
              <h3>Test and launch</h3>
              <p>Dedicated QA tests every release before it reaches your users.</p>
            </div>
            <div className="step">
              <b>Step 5</b>
              <h3>Hand over and scale</h3>
              <p>You get the code, documentation and access, plus support as the product grows.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band light">
        <div className="wrap split">
          <div className="split-img" data-reveal="">
            <Img
              src="/images/photos/handover.webp"
              alt="Senior engineer handing over a completed software project to a client"
              sizes="(max-width: 860px) 100vw, 50vw"
            />
            <div className="float-chip">
              <b>50+</b>
              <span>engineers and specialists</span>
            </div>
          </div>
          <div>
            <span className="label">Why Corevex</span>
            <h2 className="h2" data-reveal="">
              A senior team that stays with you
            </h2>
            <ul className="icon-list" data-reveal-group="">
              <li>
                <span className="ib">
                  <Img src="/images/icons/custom-software.svg" alt="" />
                </span>
                <div>
                  <b>Dedicated teams</b>
                  <p>
                    UI/UX designers, developers, QA, project managers and solution architects assigned to your project.
                  </p>
                </div>
              </li>
              <li>
                <span className="ib">
                  <Img src="/images/icons/full-stack.svg" alt="" />
                </span>
                <div>
                  <b>Senior-led delivery</b>
                  <p>Experienced software engineers lead every build.</p>
                </div>
              </li>
              <li>
                <span className="ib">
                  <Img src="/images/icons/web-mobile.svg" alt="" />
                </span>
                <div>
                  <b>Multi-stack expertise</b>
                  <p>One partner for web, mobile, backend and AI.</p>
                </div>
              </li>
              <li>
                <span className="ib">
                  <Img src="/images/icons/automation.svg" alt="" />
                </span>
                <div>
                  <b>Full ownership</b>
                  <p>Code, documentation and accounts handed over to you.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Industries</span>
              <h2 className="h2" data-reveal="">
                Built for the way your industry works
              </h2>
            </div>
            <p className="lead" data-reveal="">
              The same engineering standard, shaped around the rules, users and systems of each sector.
            </p>
          </div>
          <Accordion className="acc">
            <button className="acc-item on" aria-expanded="true">
              <span className="bg">
                <Img src="/images/photos/ind-fintech.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
              </span>
              <span className="in">
                <h3>Fintech</h3>
                <p>Payments, wealth dashboards and secure customer portals.</p>
              </span>
            </button>
            <button className="acc-item" aria-expanded="false">
              <span className="bg">
                <Img src="/images/photos/ind-healthcare.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
              </span>
              <span className="in">
                <h3>Healthcare</h3>
                <p>Booking, patient apps and clinic management systems.</p>
              </span>
            </button>
            <button className="acc-item" aria-expanded="false">
              <span className="bg">
                <Img src="/images/photos/ind-realestate.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
              </span>
              <span className="in">
                <h3>Real estate</h3>
                <p>Listings, CRMs and property management platforms.</p>
              </span>
            </button>
            <button className="acc-item" aria-expanded="false">
              <span className="bg">
                <Img src="/images/photos/ind-education.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
              </span>
              <span className="in">
                <h3>Education</h3>
                <p>Learning platforms, portals and student apps.</p>
              </span>
            </button>
            <button className="acc-item" aria-expanded="false">
              <span className="bg">
                <Img src="/images/photos/ind-logistics.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
              </span>
              <span className="in">
                <h3>Logistics</h3>
                <p>Dispatch, tracking and fleet operations software.</p>
              </span>
            </button>
            <button className="acc-item" aria-expanded="false">
              <span className="bg">
                <Img src="/images/photos/ind-retail.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
              </span>
              <span className="in">
                <h3>Retail and eCommerce</h3>
                <p>Stores, inventory and customer support automation.</p>
              </span>
            </button>
          </Accordion>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Working with Corevex</span>
              <h2 className="h2" data-reveal="">
                What you can count on
              </h2>
            </div>
            <p className="lead" data-reveal="">
              Four commitments that come with every engagement, from the first call to the final handover.
            </p>
          </div>
          <div className="trust" data-reveal-group="">
            <div>
              <span className="ib">
                <Img src="/images/icons/custom-software.svg" alt="" />
              </span>
              <b>PSEB registered</b>
              <p>A registered software company with the Pakistan Software Export Board.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/full-stack.svg" alt="" />
              </span>
              <b>You own the code</b>
              <p>Source code, documentation and access are handed over in full.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/automation.svg" alt="" />
              </span>
              <b>NDA on request</b>
              <p>Share your idea safely. We sign an NDA before details are discussed.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/web-mobile.svg" alt="" />
              </span>
              <b>Reply in one business day</b>
              <p>A senior engineer reviews every enquiry and replies personally.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band mist">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Insights</span>
              <h2 className="h2" data-reveal="">
                Practical guides from our engineers
              </h2>
            </div>
            <Link href="/insights/" className="link">
              {"All insights "}
              <span className="chev">»</span>
            </Link>
          </div>
          <div className="ins">
            <Link href="/insights/what-is-agent-as-a-service/" className="ins-feat">
              <div className="img">
                <Img
                  src="/images/photos/ins-aaas.webp"
                  alt="Business owner choosing AI agents from an Agent as a Service marketplace"
                  sizes="(max-width: 860px) 100vw, 55vw"
                />
              </div>
              <div className="t">
                <div className="meta-row">
                  <span className="chip">AI Agents</span>
                  <span>8 min read</span>
                </div>
                <h3>What is Agent as a Service (AaaS)? A practical guide for 2026</h3>
                <p className="muted">
                  How businesses subscribe to AI agents that do real work, and how to start safely.
                </p>
              </div>
            </Link>
            <div className="ins-list">
              <Link href="/insights/agentic-ai-explained/">
                <div className="meta-row">
                  <span className="chip">AI Agents</span>
                  <span>7 min read</span>
                </div>
                <h3>Agentic AI explained: how AI agents plan, act and use tools</h3>
              </Link>
              <Link href="/insights/how-to-build-a-saas-application/">
                <div className="meta-row">
                  <span className="chip">SaaS</span>
                  <span>9 min read</span>
                </div>
                <h3>How to build a SaaS application: architecture, multi-tenancy and billing</h3>
              </Link>
              <Link href="/insights/what-is-mcp-model-context-protocol/">
                <div className="meta-row">
                  <span className="chip">AI and LLM</span>
                  <span>6 min read</span>
                </div>
                <h3>What is MCP (Model Context Protocol) and why it matters</h3>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="finale" id="start">
        <div className="wrap">
          <div>
            <span className="label">Contact</span>
            <h2 className="h2">Have something to build?</h2>
            <p className="lead">
              Tell us about your idea, product or problem. A senior engineer reads every enquiry and replies within one
              business day.
            </p>
          </div>
          <QuickContact />
        </div>
      </section>
    </>
  );
}
