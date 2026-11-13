import type { CSSProperties } from "react";
import RescueCards from "@/components/services/RescueCards";
import Scene from "@/components/ui/Scene";

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
          <div className="split-img has-scene" data-reveal="">
            <Scene kind="rescue" />
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <span className="label">Where founders get stuck</span>
          <h2 className="h2" style={{ marginBottom: "44px" } as CSSProperties}>
            What we fix
          </h2>
          <RescueCards />
        </div>
      </section>
      <section className="band mist">
        <div className="wrap split">
          <div className="split-img has-scene" data-reveal="">
            <Scene kind="refactor" />
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
