import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";
import BeforeAfter from "@/components/interactive/BeforeAfter";

// ai-automation
export default function AiAutomationBody() {
  return (
    <>
      <section className="band light">
        <div className="wrap">
          <span className="label">Before and after</span>
          <h2 className="h2" data-reveal="" style={{ marginBottom: "40px" } as CSSProperties}>
            Drag to see the difference
          </h2>
          <BeforeAfter className="ba">
            <div className="side before">
              <div>
                <h3>Before</h3>
                <ul>
                  <li>Emails sorted by hand</li>
                  <li>Data typed between tools</li>
                  <li>Reports built every Friday</li>
                </ul>
              </div>
            </div>
            <div className="side after">
              <div>
                <h3>After</h3>
                <ul>
                  <li>Requests classified and answered</li>
                  <li>Data synced automatically</li>
                  <li>Reports ready every morning</li>
                </ul>
              </div>
            </div>
            <div className="handle" aria-hidden="true" />
            <input type="range" min="5" max="95" defaultValue="50" aria-label="Compare before and after automation" />
          </BeforeAfter>
        </div>
      </section>
      <section className="band">
        <div className="wrap split">
          <div>
            <span className="label">What we automate</span>
            <h2 className="h2" data-reveal="" style={{ marginBottom: "30px" } as CSSProperties}>
              Work that runs itself
            </h2>
            <ul className="cols2" style={{ columns: "1" } as CSSProperties}>
              <li>
                <b>Customer support</b>
                <span>AI agents that answer, route and escalate.</span>
              </li>
              <li>
                <b>Sales and CRM</b>
                <span>Lead capture, enrichment and follow-up reminders.</span>
              </li>
              <li>
                <b>Operations</b>
                <span>Order processing, scheduling and inventory updates.</span>
              </li>
              <li>
                <b>Finance</b>
                <span>Invoice capture, reconciliation and reporting.</span>
              </li>
              <li>
                <b>Internal workflows</b>
                <span>Approvals, onboarding and document handling.</span>
              </li>
            </ul>
          </div>
          <div className="split-img" data-reveal="">
            <Img
              src="/images/photos/automation.webp"
              alt="Business owner relaxing while an automated workflow runs on a laptop"
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
      <section className="band dark" style={{ background: "var(--ink)" } as CSSProperties}>
        <div className="wrap case-band">
          <div className="shot" data-reveal="">
            <Img
              src="/images/portfolio/northgate-ap-autopilot-1600.webp"
              alt="Northgate AP inbox, automation workflow, invoice review and accounts payable dashboard"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
          <div>
            <span className="label">Featured design study · Finance</span>
            <h2 className="h2" data-reveal="">
              Northgate AP Autopilot
            </h2>
            <p className="lead" style={{ marginTop: "16px" } as CSSProperties}>
              AI invoice processing from inbox to accounting, with approvals and a full audit trail.
            </p>
            <ul>
              <li>Scoped with a solution architect</li>
              <li>Designed as a working product, web and mobile</li>
              <li>Structured for full code handover</li>
            </ul>
            <Link href="/work/northgate-ap-autopilot/" className="btn">
              {"See the design study "}
              <span className="chev">»</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
