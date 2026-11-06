import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";
import Words from "@/components/ui/Words";
import CareersForm from "@/components/forms/CareersForm";

// CareersPage
export default function CareersPage({ roles, blob }: { roles: string[]; blob: boolean }) {
  return (
    <>
      <section className="page-hero c-hero">
        <div className="wrap grid2">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>Careers</span>
            </nav>
            <Words as="h1" className="h1 words">
              {"Careers at Corevex Solutions"}
            </Words>
            <p className="lead" data-reveal="load">
              Join a team of 50+ engineers and specialists working across TypeScript, React, Node.js, .NET, Python,
              Flutter and AI, on real products for real clients.
            </p>
            <div className="btns" data-reveal="load" style={{ marginTop: "30px" } as CSSProperties}>
              <a href="#roles" className="btn">
                {"See open roles "}
                <span className="chev">»</span>
              </a>
            </div>
          </div>
          <div className="frame" data-reveal="load">
            <Img
              src="/images/photos/remote-engineer.webp"
              alt="Software engineer working remotely from a home office"
              sizes="(max-width: 860px) 100vw, 42vw"
              priority
            />
          </div>
        </div>
      </section>
      <section className="band mist">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Why join</span>
              <h2 className="h2" data-reveal="">
                Why engineers choose Corevex
              </h2>
            </div>
            <p className="lead" data-reveal="">
              Real products, senior mentors and the freedom to work across stacks.
            </p>
          </div>
          <div className="trust" data-reveal-group="">
            <div>
              <span className="ib">
                <Img src="/images/icons/full-stack.svg" alt="" />
              </span>
              <b>Multiple stacks</b>
              <p>Work across TypeScript, .NET, Python, Flutter and AI on diverse industries.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/custom-software.svg" alt="" />
              </span>
              <b>Senior mentors</b>
              <p>Learn every day from senior engineers and solution architects.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/web-mobile.svg" alt="" />
              </span>
              <b>Remote friendly</b>
              <p>Flexible, remote-friendly roles with a team that communicates clearly.</p>
            </div>
            <div>
              <span className="ib">
                <Img src="/images/icons/automation.svg" alt="" />
              </span>
              <b>Shipped, not shelved</b>
              <p>Projects that go to production and get used by real clients.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band" id="roles">
        <div className="wrap">
          <span className="label">Open roles</span>
          <h2 className="h2" style={{ marginBottom: "40px" } as CSSProperties}>
            Current openings
          </h2>
          <div className="roles">
            <a href="#apply">
              <b>AI Automation Engineer</b>
              <span>Project based</span>
              <span>Remote</span>
              <span className="go" aria-hidden="true">
                »
              </span>
            </a>
            <a href="#apply">
              <b>Business Development Intern</b>
              <span>Internship</span>
              <span>Remote</span>
              <span className="go" aria-hidden="true">
                »
              </span>
            </a>
          </div>
        </div>
      </section>
      <section className="band mist" id="apply">
        <div className="wrap split">
          <div>
            <span className="label">Apply</span>
            <h2 className="h2">Send your application</h2>
            <p className="lead" style={{ marginTop: "18px" } as CSSProperties}>
              Tell us about yourself and the work you are proud of. We read every application.
            </p>
          </div>
          <CareersForm roles={roles} blob={blob} />
        </div>
      </section>
    </>
  );
}
