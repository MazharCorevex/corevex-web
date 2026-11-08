import Img from "@/components/ui/Img";

// WhyCorevex
export default function WhyCorevex() {
  return (
    <section className="band light">
      <div className="wrap split">
        <div className="split-img" data-reveal="">
          <Img
            src="/images/photos/senior-team-board.webp"
            alt="Corevex team planning a project together at a task board"
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
  );
}
