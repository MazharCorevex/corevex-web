"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const CHIPS = [
  {
    a: -90,
    d: 500,
    slug: "custom-software-development",
    img: "svc-custom-team",
    t: "Custom Software",
    icon: "custom-software",
  },
  {
    a: -39,
    d: 590,
    slug: "full-stack-development",
    img: "svc-fullstack-standing",
    t: "Full-Stack",
    icon: "full-stack",
  },
  { a: 12, d: 680, slug: "mobile-app-development", img: "svc-mobile-flatlay", t: "Mobile Apps", icon: "web-mobile" },
  { a: 64, d: 770, slug: "saas-app-development", img: "svc-saas-team", t: "SaaS", icon: "saas" },
  { a: 115, d: 860, slug: "ai-llm-development", img: "svc-ai-support", t: "AI and LLM", icon: "ai-ml" },
  { a: 167, d: 950, slug: "ai-automation", img: "svc-automation-desk", t: "Automation", icon: "automation" },
  { a: 218, d: 1040, slug: "ai-agents-as-a-service", img: "svc-aaas-ops", t: "AI Agents", icon: "aaas" },
];

// Hero mark and service orbit
export default function HeroArt({ mark }: { mark: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [r, setR] = useState<number | null>(null);
  const [inView, setIn] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const hideT = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const art = ref.current!;
    const size = () => setR(Math.round(art.offsetWidth * 0.5));
    size();
    const ro = new ResizeObserver(size);
    ro.observe(art);
    const t = setTimeout(() => setIn(true), 300);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = art.closest<HTMLElement>(".hero");
    let off = () => {};
    if (hero && !reduce && matchMedia("(pointer: fine)").matches) {
      const move = (e: PointerEvent) => {
        const b = hero.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5;
        const y = (e.clientY - b.top) / b.height - 0.5;
        art.style.transform = `perspective(1200px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg) translateX(${(x * 14).toFixed(1)}px)`;
      };
      const leave = () => (art.style.transform = "");
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", leave);
      off = () => {
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", leave);
      };
    }
    return () => {
      ro.disconnect();
      clearTimeout(t);
      off();
    };
  }, []);

  const show = (i: number) => {
    clearTimeout(hideT.current);
    setActive(i);
  };
  const hide = () => {
    hideT.current = setTimeout(() => setActive(null), 220);
  };
  const cur = active !== null ? CHIPS[active] : null;
  const rVar = r ? ({ "--orb-r": `${r}px` } as CSSProperties) : undefined;
  // Too small for the circle: chips become a swipe row
  const row = r !== null && r < 170;

  return (
    <div className={`hero-art${row ? " is-row" : ""}`} ref={ref}>
      <span className="hero-disc" aria-hidden="true" />
      <span className="hero-ring r1" aria-hidden="true" />
      <span className="hero-ring r2" aria-hidden="true" />
      <span className="hero-glow" aria-hidden="true" />
      {mark}
      <nav className={`orbit${inView ? " in" : ""}${row ? " row" : ""}`} aria-label="Our services" style={rVar}>
        {CHIPS.map((c, i) => (
          <Link
            key={c.slug}
            className="orb-chip"
            href={`/services/${c.slug}/`}
            style={{ "--a": `${c.a}deg`, "--d": `${c.d}ms`, ...rVar } as CSSProperties}
            onMouseEnter={() => show(i)}
            onFocus={() => show(i)}
            onMouseLeave={hide}
            onBlur={hide}
          >
            <span className="orb-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/icons/${c.icon}.svg`} alt="" width={20} height={20} />
              {c.t}
            </span>
          </Link>
        ))}
      </nav>
      <Link
        className={`orb-card${cur ? " on" : ""}`}
        href={cur ? `/services/${cur.slug}/` : "/services/"}
        tabIndex={-1}
        aria-hidden="true"
        onMouseEnter={() => clearTimeout(hideT.current)}
        onMouseLeave={hide}
      >
        <span className="orb-photo">
          {cur && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/images/photos/${cur.img}-800.webp`} alt="" width={800} height={533} decoding="async" />
          )}
        </span>
        <b>{cur?.t}</b>
      </Link>
    </div>
  );
}
