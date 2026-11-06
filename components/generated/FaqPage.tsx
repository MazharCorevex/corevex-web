import Link from "next/link";
import Words from "@/components/ui/Words";

// FaqPage
export default function FaqPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>FAQ</span>
          </nav>
          <Words as="h1" className="h1 words">
            {"Working with Corevex Solutions"}
          </Words>
          <p className="lead" data-reveal="load">
            Answers on services, tech stack, engagement models, code ownership and how to start a project.
          </p>
        </div>
      </section>
      <section className="band light">
        <div className="wrap faq-wrap">
          <nav className="faq-cats" aria-label="FAQ categories">
            <a href="#g0">About Corevex</a>
            <a href="#g1">Technology</a>
            <a href="#g2">Working together</a>
          </nav>
          <div>
            <div className="faq-group" id="g0">
              <h2>About Corevex</h2>
              <div className="faq">
                <details>
                  <summary>What does Corevex Solutions do?</summary>
                  <p>
                    We are a PSEB registered software company that builds custom software, full stack web applications,
                    mobile apps, AI and LLM solutions, and AI automation.
                  </p>
                </details>
                <details>
                  <summary>When was Corevex founded?</summary>
                  <p>Corevex Solutions was founded in 2022.</p>
                </details>
                <details>
                  <summary>How big is the team?</summary>
                  <p>
                    We have 50+ engineers and specialists, including solution architects, software engineers, UI/UX
                    designers, QA engineers and project managers.
                  </p>
                </details>
                <details>
                  <summary>Do you work with clients outside Pakistan?</summary>
                  <p>Yes. We work with clients worldwide.</p>
                </details>
              </div>
            </div>
            <div className="faq-group" id="g1">
              <h2>Technology</h2>
              <div className="faq">
                <details>
                  <summary>Which technologies do you use?</summary>
                  <p>
                    TypeScript, JavaScript, React, Next.js, Node.js, .NET, Angular, React Native, Python and Flutter,
                    plus LLM and AI tooling.
                  </p>
                </details>
              </div>
            </div>
            <div className="faq-group" id="g2">
              <h2>Working together</h2>
              <div className="faq">
                <details>
                  <summary>How do engagements work?</summary>
                  <p>We offer dedicated teams, fixed-scope projects and MVP builds.</p>
                </details>
                <details>
                  <summary>Who owns the code?</summary>
                  <p>You do. We hand over source code, documentation and access at the end of the project.</p>
                </details>
                <details>
                  <summary>Do you sign NDAs?</summary>
                  <p>Yes. We are happy to sign an NDA before you share project details.</p>
                </details>
                <details>
                  <summary>Do you offer support after launch?</summary>
                  <p>Yes. We provide maintenance, updates and continued development.</p>
                </details>
                <details>
                  <summary>How do I start?</summary>
                  <p>Use the contact form and our team will arrange a call with a solution architect.</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap">
          <div>
            <h2 className="h2">Have something to build?</h2>
            <p>Tell us what you need. A senior engineer replies within one business day.</p>
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
