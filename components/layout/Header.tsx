"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DRAWER_ORDER, svc } from "@/lib/site";

const NAV = [
  { href: "/work/", label: "Work" },
  { href: "/ai-lab/", label: "AI Lab" },
  { href: "/about/", label: "About" },
  { href: "/careers/", label: "Careers" },
  { href: "/insights/", label: "Insights" },
  { href: "/contact/", label: "Contact" },
];

export default function Header({ megaPanel }: { megaPanel: ReactNode }) {
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

  return (
    <>
      <header className={`header${hidden && !drawer ? " is-hidden" : ""}`}>
        <div className="wrap">
          <Link className="brand" href="/" aria-label="Corevex Solutions home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/corevex-logo-primary.svg" alt="Corevex Solutions" width={945} height={213} />
          </Link>
          <nav aria-label="Main">
            <ul className="nav">
              <li className={`has-mega${mega ? " is-open" : ""}`} onMouseEnter={enter} onMouseLeave={leave}>
                <button aria-expanded={mega} aria-haspopup="true" onClick={() => setMega((o) => !o)}>
                  Services
                </button>
                <div className="mega" role="region" aria-label="Services">
                  {megaPanel}
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
