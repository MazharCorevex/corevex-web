import type { CSSProperties } from "react";
import Link from "next/link";

// Process
export default function Process() {
  return (
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
  );
}
