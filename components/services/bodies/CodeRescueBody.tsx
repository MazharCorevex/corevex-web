import type { CSSProperties } from "react";
import Img from "@/components/ui/Img";

// code-rescue
export default function CodeRescueBody() {
  return (
    <>
      <section className="band">
        <div className="wrap problem-split">
          <div>
            <span className="label">The challenge</span>
            <p className="big" data-reveal="">
              Your app works in the demo. Real users are another story.
            </p>
            <p data-reveal="">
              AI coding tools are brilliant for getting started. As soon as you add payments, user roles and real
              traffic, hidden problems surface. We step in, find the root causes and make your app ready for launch.
            </p>
          </div>
          <div className="split-img" data-reveal="">
            <Img src="/images/photos/rescue-health-check.webp" alt="" sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <span className="label">Where founders get stuck</span>
          <h2 className="h2" style={{ marginBottom: "44px" } as CSSProperties}>
            What we fix
          </h2>
          <div className="trust rescue-grid" data-reveal-group="">
            <div>
              <span className="ib">
                <Img src="/images/icons/rescue.svg" alt="" />
              </span>
              <b>Bugs and broken flows</b>
              <p>Features that worked in the demo fail with real users.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/web-mobile.svg" alt="" />
              </span>
              <b>UI/UX that converts</b>
              <p>Clear screens, fixed layouts and fewer drop-offs.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/saas.svg" alt="" />
              </span>
              <b>Billing and subscriptions</b>
              <p>Plans, trials and failed payments handled properly.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/custom-software.svg" alt="" />
              </span>
              <b>Security hardening</b>
              <p>Secrets, database rules and endpoints locked down.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/full-stack.svg" alt="" />
              </span>
              <b>Roles and permissions</b>
              <p>RBAC so each user sees only what they should.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/ai-ml.svg" alt="" />
              </span>
              <b>Performance and scaling</b>
              <p>Slow queries and pages fixed before traffic grows.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/automation.svg" alt="" />
              </span>
              <b>Deployment and hosting</b>
              <p>Reliable releases, environments and monitoring.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/aaas.svg" alt="" />
              </span>
              <b>Maintainable code</b>
              <p>Structure, tests and docs your next hire can follow.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band mist">
        <div className="wrap split">
          <div className="split-img" data-reveal="">
            <Img
              src="/images/photos/rescue-refactor.webp"
              alt="Engineer refactoring messy code into clean, tested code on two monitors"
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
          <div>
            <span className="label">Tools we take over from</span>
            <h2 className="h2" data-reveal="">
              Whatever you built it with
            </h2>
            <p className="lead" style={{ margin: "18px 0 24px" } as CSSProperties}>
              We work with apps started in popular AI builders and coding assistants, and with the code they generate in
              React, Next.js, Node.js, Python and Supabase.
            </p>
            <div className="rescue-tools">
              <span>Lovable</span>
              <span>Bolt</span>
              <span>Replit</span>
              <span>Cursor</span>
              <span>v0</span>
              <span>Base44</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
