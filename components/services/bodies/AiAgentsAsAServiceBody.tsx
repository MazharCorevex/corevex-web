import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";

// ai-agents-as-a-service
export default function AiAgentsAsAServiceBody() {
  return (
    <>
      <section className="band">
        <div className="wrap problem-split">
          <div>
            <span className="label">The challenge</span>
            <p className="big" data-reveal="">
              Your team should not spend the day on repetitive tasks.
            </p>
            <p data-reveal="">
              With Agent as a Service you subscribe to AI agents that do the work across your existing tools, while we
              build, host, monitor and improve them for you.
            </p>
          </div>
          <div className="split-img" data-reveal="">
            <Img src="/images/photos/aaas-console.webp" alt="" sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <span className="label">Agents we deliver</span>
          <h2 className="h2" style={{ marginBottom: "44px" } as CSSProperties}>
            Ready-to-work AI agents
          </h2>
          <div className="trust" data-reveal-group="">
            <div>
              <span className="ib">
                <Img src="/images/icons/aaas.svg" alt="" />
              </span>
              <b>Support agent</b>
              <p>Answers common tickets from your knowledge base and escalates the rest with context.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/automation.svg" alt="" />
              </span>
              <b>Sales agent</b>
              <p>Qualifies leads, updates the CRM and books meetings for your team.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/custom-software.svg" alt="" />
              </span>
              <b>Operations agent</b>
              <p>Keeps orders, inventory and schedules in sync across systems.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/ai-ml.svg" alt="" />
              </span>
              <b>Finance agent</b>
              <p>Captures invoices, matches orders and prepares reports for approval.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band mist">
        <div className="wrap">
          <span className="label">How AaaS works</span>
          <h2 className="h2" style={{ marginBottom: "40px" } as CSSProperties}>
            A managed service, not another tool to run
          </h2>
          <div className="compare">
            <div>
              <h3>What we handle</h3>
              <p>
                Agent design, tool connections, hosting, monitoring, weekly accuracy reports and continuous improvement.
              </p>
            </div>
            <div>
              <h3>What you control</h3>
              <p>Which tasks the agent may do alone, which need approval, and full logs of every action it takes.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band dark" style={{ background: "var(--ink)" } as CSSProperties}>
        <div className="wrap case-band">
          <div className="shot" data-reveal="">
            <Img
              src="/images/portfolio/relay-support-automation-1600.webp"
              alt="Relay ecommerce product on laptop and phone"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
          <div>
            <span className="label">Featured design study · eCommerce</span>
            <h2 className="h2" data-reveal="">
              Relay
            </h2>
            <p className="lead" style={{ marginTop: "16px" } as CSSProperties}>
              An AI support workflow that answers, routes and escalates.
            </p>
            <ul>
              <li>Scoped with a solution architect</li>
              <li>Designed as a working product, web and mobile</li>
              <li>Structured for full code handover</li>
            </ul>
            <Link href="/work/relay-support-automation/" className="btn">
              {"See the design study "}
              <span className="chev">»</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
