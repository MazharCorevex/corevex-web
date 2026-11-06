"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DRAWER_ORDER, SERVICES, svc } from "@/lib/site";

const NAV = [
  { href: "/work/", label: "Work" },
  { href: "/ai-lab/", label: "AI Lab" },
  { href: "/about/", label: "About" },
  { href: "/careers/", label: "Careers" },
  { href: "/insights/", label: "Insights" },
  { href: "/contact/", label: "Contact" },
];

const ENGAGE = [
  { t: "Dedicated Team", d: "A full team that works as part of yours." },
  { t: "Fixed-Scope Project", d: "An agreed scope delivered in full." },
  { t: "MVP Build", d: "A focused first version to test your idea." },
];

export default function Header() {
  const path = usePathname();
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [hidden, setHidden] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [lastPath, setLastPath] = useState(path);

  if (path !== lastPath) {
    setLastPath(path);
    setMega(false);
    setDrawer(false);
  }

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const h = y > last && y > 160 && !document.body.classList.contains("menu-open");
      setHidden(h);
      document.body.classList.toggle("header-on", !h);
      last = y;
    };
    document.body.classList.add("header-on");
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setDrawer(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", drawer);
    document.body.style.overflow = drawer ? "hidden" : "";
    if (drawer) drawerRef.current?.querySelector<HTMLElement>(".close")?.focus();
  }, [drawer]);

  const enter = () => {
    clearTimeout(timer.current);
    setMega(true);
  };
  const leave = () => {
    timer.current = setTimeout(() => setMega(false), 160);
  };
  const cur = (href: string) => (path?.startsWith(href) ? "page" : undefined);
  const group = (g: "build" | "intel") =>
    SERVICES.filter((s) => s.group === g).map((s) => (
      <Link key={s.slug} className="m" href={`/services/${s.slug}/`}>
        <Image src={`/images/icons/${s.icon}.svg`} alt="" width={28} height={28} unoptimized />
        <div>
          <b>{s.name}</b>
          <span>{s.blurb}</span>
        </div>
      </Link>
    ));

  return (
    <>
      <header className={`header${hidden && !drawer ? " is-hidden" : ""}`}>
        <div className="wrap">
          <Link className="brand" href="/" aria-label="Corevex Solutions home">
            <Image
              src="/images/logo/corevex-logo-primary.svg"
              alt="Corevex Solutions"
              width={945}
              height={213}
              priority
              unoptimized
            />
          </Link>
          <nav aria-label="Main">
            <ul className="nav">
              <li className={`has-mega${mega ? " is-open" : ""}`} onMouseEnter={enter} onMouseLeave={leave}>
                <button aria-expanded={mega} aria-haspopup="true" onClick={() => setMega((o) => !o)}>
                  Services
                </button>
                <div className="mega" role="region" aria-label="Services">
                  <div className="wrap">
                    <div>
                      <h4>Build</h4>
                      {group("build")}
                    </div>
                    <div>
                      <h4>Intelligence</h4>
                      {group("intel")}
                    </div>
                    <div>
                      <h4>How we engage</h4>
                      {ENGAGE.map((e) => (
                        <Link key={e.t} className="m" href="/services/#models">
                          <div>
                            <b>{e.t}</b>
                            <span>{e.d}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link className="feat" href="/work/fleetline-logistics-platform/">
                      <Image
                        src="/images/portfolio/fleetline-logistics-platform-1600.webp"
                        alt="Fleetline logistics dashboard and driver app concept"
                        width={1600}
                        height={1000}
                        sizes="340px"
                      />
                      <div>
                        <span className="concept">Featured work</span>
                        <br />
                        <b>Live operations on one custom platform</b>
                      </div>
                    </Link>
                  </div>
                </div>
              </li>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={cur(n.href)}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link className="btn btn-sm nav-cta" href="/contact/">
            Start a project <span className="chev">»</span>
          </Link>
          <button className="menu-btn" aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <div
        ref={drawerRef}
        className={`drawer${drawer ? " is-open" : ""}`}
        aria-label="Mobile menu"
        role="dialog"
        aria-modal={drawer || undefined}
        inert={!drawer}
      >
        <button className="close" aria-label="Close menu" onClick={() => setDrawer(false)}>
          ×
        </button>
        <details>
          <summary>Services</summary>
          <Link href="/services/">All services</Link>
          {DRAWER_ORDER.map((slug) => (
            <Link key={slug} href={`/services/${slug}/`}>
              {svc(slug).name}
            </Link>
          ))}
        </details>
        <Link href="/work/">Work</Link>
        <Link href="/ai-lab/">AI Lab</Link>
        <Link href="/about/">About</Link>
        <Link href="/careers/">Careers</Link>
        <Link href="/insights/">Insights</Link>
        <Link href="/faq/">FAQ</Link>
        <Link href="/contact/">Contact</Link>
        <Link className="btn" href="/contact/">
          Start a project <span className="chev">»</span>
        </Link>
      </div>
    </>
  );
}
