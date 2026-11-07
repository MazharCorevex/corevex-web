"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
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
  const menuBtn = useRef<HTMLButtonElement>(null);
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

  // Tap outside closes the mega menu
  useEffect(() => {
    if (!mega) return;
    const out = (e: globalThis.PointerEvent) => {
      if (!(e.target as Element).closest?.(".has-mega")) setMega(false);
    };
    document.addEventListener("pointerdown", out);
    return () => document.removeEventListener("pointerdown", out);
  }, [mega]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", drawer);
    document.body.style.overflow = drawer ? "hidden" : "";
    const box = drawerRef.current;
    if (!drawer || !box) return;
    box.querySelector<HTMLElement>(".close")?.focus();
    // Focus trap
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const f = Array.from(box.querySelectorAll<HTMLElement>("a[href],button,summary")).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !box.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    const opener = menuBtn.current;
    return () => {
      document.removeEventListener("keydown", trap);
      opener?.focus();
    };
  }, [drawer]);

  const hovered = useRef(false);
  const enter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(timer.current);
    hovered.current = true;
    setMega(true);
  };
  const leave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hovered.current = false;
    timer.current = setTimeout(() => setMega(false), 160);
  };
  // Mouse click keeps a hover-opened menu open; keyboard and touch toggle
  const toggle = (e: MouseEvent) => setMega((o) => (e.detail > 0 && hovered.current ? true : !o));
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
              <li className={`has-mega${mega ? " is-open" : ""}`} onPointerEnter={enter} onPointerLeave={leave}>
                <button aria-expanded={mega} aria-haspopup="true" onClick={toggle}>
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
          <button ref={menuBtn} className="menu-btn" aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)}>
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
