import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";
import Words from "@/components/ui/Words";
import LayerStack from "@/components/about/LayerStack";

import LeaderSheet from "@/components/about/LeaderSheet";
import type { TeamMember } from "@/lib/types";
import { PSEB_NUMBER } from "@/lib/site";

// AboutPage
export default function AboutPage({ team }: { team: TeamMember[] }) {
  return (
    <>
      <section className="ed-hero">
        <div className="wrap">
          <div className="ed-head">
            <div>
              <nav className="crumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>About</span>
              </nav>
              <span className="label">About Corevex</span>
              <Words as="h1" className="h1 words">
                {"A software development company built by engineers"}
              </Words>
              <p className="lead" data-reveal="load">
                Corevex Solutions is a PSEB registered software company founded in 2022. Our team of 50+ engineers and
                specialists builds custom software, web and mobile apps, AI and automation for businesses across diverse
                industries.
              </p>
            </div>
            <LayerStack />
          </div>
          <div className="ed-photo">
            <Img
              src="/images/photos/team-night.webp"
              alt="Corevex software engineers collaborating at their desks in the evening"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>
      <section className="band light">
        <div className="wrap story">
          <p className="pull">
            {"Engineered "}
            <em>at the Core.</em>
          </p>
          <div>
            <span className="label">Our story</span>
            <h2 className="h2" style={{ marginBottom: "28px" } as CSSProperties}>
              Why we started Corevex
            </h2>
            <p data-reveal="">
              Corevex began in 2022 with a simple belief: great software comes from teams where engineering, design and
              business understanding sit at the same table. What started as a small group of engineers has grown into a
              team of more than 50 people working across multiple technology stacks.
            </p>
            <p data-reveal="">
              Today we work as a long-term technology partner for our clients. We help them plan, design, build and
              scale products, and we hand over everything we build so they stay in full control.
            </p>
            <div className="pseb" data-reveal="">
              <strong>PSEB</strong>
              <p>
                Corevex Solutions is registered with the Pakistan Software Export Board (PSEB), the government body that
                certifies and supports IT and software export companies.
                {PSEB_NUMBER ? ` Registration no. ${PSEB_NUMBER}.` : ""}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="band cloud" style={{ padding: "clamp(56px,7vw,90px) 0" } as CSSProperties}>
        <div className="wrap">
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
              <b>PSEB</b>
              <span>Registered software company</span>
            </div>
            <div>
              <b data-count="10" data-suffix="+">
                10+
              </b>
              <span>Technologies across web, mobile and AI</span>
            </div>
          </div>
        </div>
      </section>
      <section className="band values-band">
        <div className="wrap">
          <span className="label">What we believe</span>
          <h2 className="h2" data-reveal="" style={{ marginBottom: "24px" } as CSSProperties}>
            Four principles behind every build
          </h2>
          <div className="values" data-reveal-group="">
            <div>
              <span className="ib" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/icons/full-stack.svg" alt="" width={24} height={24} />
              </span>
              <h3>Engineering first</h3>
              <p>Every decision is grounded in what will work in production.</p>
            </div>
            <div>
              <span className="ib" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/icons/automation.svg" alt="" width={24} height={24} />
              </span>
              <h3>Clear communication</h3>
              <p>You always know what is done, what is next and why.</p>
            </div>
            <div>
              <span className="ib" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/icons/custom-software.svg" alt="" width={24} height={24} />
              </span>
              <h3>Ownership for clients</h3>
              <p>Code, documentation and access are yours.</p>
            </div>
            <div>
              <span className="ib" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/icons/rescue.svg" alt="" width={24} height={24} />
              </span>
              <h3>Built to last</h3>
              <p>Clean architecture that your next team can understand.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band light">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Our team</span>
              <h2 className="h2" data-reveal="">
                One dedicated team, every discipline
              </h2>
            </div>
            <p className="lead" data-reveal="">
              Every Corevex project is staffed by a dedicated team that works across multiple stacks on diverse
              industries and solutions.
            </p>
          </div>
          <div className="team-map" data-reveal-group="">
            <div className="disc">
              <div className="av">
                <i />
                <i />
                <i />
              </div>
              <b>Solution Architects</b>
            </div>
            <div className="disc">
              <div className="av">
                <i />
                <i />
                <i />
              </div>
              <b>Software Engineers</b>
            </div>
            <div className="disc">
              <div className="av">
                <i />
                <i />
                <i />
              </div>
              <b>Full-Stack Developers</b>
            </div>
            <div className="disc">
              <div className="av">
                <i />
                <i />
                <i />
              </div>
              <b>Mobile Developers</b>
            </div>
            <div className="disc">
              <div className="av">
                <i />
                <i />
                <i />
              </div>
              <b>AI and LLM Engineers</b>
            </div>
            <div className="disc">
              <div className="av">
                <i />
                <i />
                <i />
              </div>
              <b>UI/UX Designers</b>
            </div>
            <div className="disc">
              <div className="av">
                <i />
                <i />
                <i />
              </div>
              <b>QA Engineers</b>
            </div>
            <div className="disc">
              <div className="av">
                <i />
                <i />
                <i />
              </div>
              <b>Project Managers</b>
            </div>
          </div>
        </div>
      </section>
      <section className="band mist">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Expertise</span>
              <h2 className="h2" data-reveal="">
                Expertise across the full stack
              </h2>
            </div>
            <p className="lead" data-reveal="">
              Four practice areas, one team, and a tech stack chosen for each product.
            </p>
          </div>
          <div className="trust xp" data-reveal-group="">
            <Link href="/services/full-stack-development/">
              <span className="ib">
                <Img src="/images/icons/full-stack.svg" alt="" />
              </span>
              <b>Full stack development</b>
              <p>Web platforms, APIs and dashboards built end to end.</p>
              <span className="link">
                {"Learn more "}
                <span className="chev">»</span>
              </span>
            </Link>
            <Link href="/services/custom-software-development/">
              <span className="ib">
                <Img src="/images/icons/custom-software.svg" alt="" />
              </span>
              <b>Custom software development</b>
              <p>Internal tools, portals and SaaS shaped around your business.</p>
              <span className="link">
                {"Learn more "}
                <span className="chev">»</span>
              </span>
            </Link>
            <Link href="/services/mobile-app-development/">
              <span className="ib">
                <Img src="/images/icons/web-mobile.svg" alt="" />
              </span>
              <b>Mobile app development</b>
              <p>iOS and Android apps with React Native and Flutter.</p>
              <span className="link">
                {"Learn more "}
                <span className="chev">»</span>
              </span>
            </Link>
            <Link href="/services/ai-llm-development/">
              <span className="ib">
                <Img src="/images/icons/ai-ml.svg" alt="" />
              </span>
              <b>AI and LLM solutions</b>
              <p>Assistants, RAG search and models wired into your systems.</p>
              <span className="link">
                {"Learn more "}
                <span className="chev">»</span>
              </span>
            </Link>
          </div>
          <div className="stack-grid" data-reveal-group="">
            <div>
              <h3>Frontend</h3>
              <div className="techs">
                <span>TypeScript</span>
                <span>JavaScript</span>
                <span>React</span>
                <span>Next.js</span>
                <span>Angular</span>
              </div>
            </div>
            <div>
              <h3>Backend</h3>
              <div className="techs">
                <span>Node.js</span>
                <span>.NET</span>
                <span>Python</span>
              </div>
            </div>
            <div>
              <h3>Mobile</h3>
              <div className="techs">
                <span>React Native</span>
                <span>Flutter</span>
              </div>
            </div>
            <div>
              <h3>AI and LLM</h3>
              <div className="techs">
                <span>LLM APIs</span>
                <span>RAG</span>
                <span>Python ML</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="band" id="leadership">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Leadership</span>
              <h2 className="h2" data-reveal="">
                Leadership
              </h2>
            </div>
            <p className="lead" data-reveal="">
              Led by engineers and operators who stay close to every client and every build.
            </p>
          </div>
          <LeaderSheet team={team} />
        </div>
      </section>

      <section className="band light">
        <div className="wrap split">
          <div className="split-img" data-reveal="">
            <Img
              src="/images/photos/remote-engineer.webp"
              alt="Software engineer working remotely from a home office"
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
          <div>
            <span className="label">Join us</span>
            <h2 className="h2" data-reveal="">
              Join the team or start a project
            </h2>
            <p className="lead" style={{ margin: "18px 0 30px" } as CSSProperties} data-reveal="">
              Whether you want to join the team or start a project, we would like to hear from you.
            </p>
            <div className="btns">
              <Link href="/careers/" className="btn">
                {"See open roles "}
                <span className="chev">»</span>
              </Link>
              <Link href="/contact/" className="btn btn-ghost">
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
