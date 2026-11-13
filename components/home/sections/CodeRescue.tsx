import type { CSSProperties } from "react";
import Link from "next/link";
import BookCall from "@/components/booking/BookCall";
import HealthCheck from "@/components/home/HealthCheck";

// CodeRescue
export default function CodeRescue() {
  return (
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
              <BookCall className="btn" />
              <Link href="/services/code-rescue/" className="btn btn-ghost">
                See how it works
              </Link>
            </div>
          </div>
          <HealthCheck />
        </div>
        <div className="stuck" data-reveal-group="">
          <div>
            <span className="stuck-tag" aria-hidden="true">
              <i className="r">At risk</i>
              <i className="f">Fixed</i>
            </span>
            <b>Bugs and broken flows</b>
            <p>Features that worked in the demo fail with real users.</p>
          </div>
          <div>
            <span className="stuck-tag" aria-hidden="true">
              <i className="r">At risk</i>
              <i className="f">Fixed</i>
            </span>
            <b>UI/UX that does not convert</b>
            <p>Confusing screens, layout bugs and drop-offs.</p>
          </div>
          <div>
            <span className="stuck-tag" aria-hidden="true">
              <i className="r">At risk</i>
              <i className="f">Fixed</i>
            </span>
            <b>Billing and subscriptions</b>
            <p>Stripe plans, trials and failed payments done properly.</p>
          </div>
          <div>
            <span className="stuck-tag" aria-hidden="true">
              <i className="r">At risk</i>
              <i className="f">Fixed</i>
            </span>
            <b>Security gaps</b>
            <p>Exposed keys, missing database rules and open endpoints.</p>
          </div>
          <div>
            <span className="stuck-tag" aria-hidden="true">
              <i className="r">At risk</i>
              <i className="f">Fixed</i>
            </span>
            <b>Roles and permissions</b>
            <p>RBAC so each user sees only what they should.</p>
          </div>
          <div>
            <span className="stuck-tag" aria-hidden="true">
              <i className="r">At risk</i>
              <i className="f">Fixed</i>
            </span>
            <b>Performance and scaling</b>
            <p>Slow queries and pages fixed before traffic grows.</p>
          </div>
          <div>
            <span className="stuck-tag" aria-hidden="true">
              <i className="r">At risk</i>
              <i className="f">Fixed</i>
            </span>
            <b>Deployment and hosting</b>
            <p>Reliable releases, environments and monitoring.</p>
          </div>
          <div>
            <span className="stuck-tag" aria-hidden="true">
              <i className="r">At risk</i>
              <i className="f">Fixed</i>
            </span>
            <b>Code nobody can maintain</b>
            <p>Structure, tests and docs your next hire can follow.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
