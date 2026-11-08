"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// Line icon shapes, 24px grid
type Shape = { p: string } | { r: [number, number, number, number, number] } | { c: [number, number, number] } | { l: [number, number, number, number] };

const ICONS: Record<string, Shape[]> = {
  bug: [
    { p: "m8 2 1.88 1.88" },
    { p: "M14.12 3.88 16 2" },
    { p: "M9 7.13v-1a3 3 0 1 1 6 0v1" },
    { p: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" },
    { p: "M12 20v-9" },
    { p: "M6.53 9C4.6 8.8 3 7.1 3 5" },
    { p: "M6 13H2" },
    { p: "M3 21c0-2.1 1.7-3.9 3.8-4" },
    { p: "M20.97 5c0 2.1-1.6 3.8-3.5 4" },
    { p: "M22 13h-4" },
    { p: "M17.2 17c2.1.1 3.8 1.9 3.8 4" },
  ],
  layout: [{ r: [3, 3, 7, 9, 1] }, { r: [14, 3, 7, 5, 1] }, { r: [14, 12, 7, 9, 1] }, { r: [3, 16, 7, 5, 1] }],
  card: [{ r: [2, 5, 20, 14, 2] }, { l: [2, 10, 22, 10] }, { l: [6, 15, 10, 15] }],
  shield: [{ p: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }, { p: "m9 12 2 2 4-4" }],
  users: [{ p: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }, { c: [9, 7, 4] }, { p: "M22 21v-2a4 4 0 0 0-3-3.87" }, { p: "M16 3.13a4 4 0 0 1 0 7.75" }],
  gauge: [{ p: "m12 14 4-4" }, { p: "M3.34 19a10 10 0 1 1 17.32 0" }],
  cloud: [{ p: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" }],
  code: [{ p: "m16 18 6-6-6-6" }, { p: "m8 6-6 6 6 6" }],
};

function Icon({ name, className }: { name: string; className: string }) {
  const shapes: ReactNode[] = ICONS[name].map((s, i) => {
    if ("p" in s) return <path key={i} d={s.p} pathLength={1} />;
    if ("r" in s) return <rect key={i} x={s.r[0]} y={s.r[1]} width={s.r[2]} height={s.r[3]} rx={s.r[4]} pathLength={1} />;
    if ("c" in s) return <circle key={i} cx={s.c[0]} cy={s.c[1]} r={s.c[2]} pathLength={1} />;
    return <line key={i} x1={s.l[0]} y1={s.l[1]} x2={s.l[2]} y2={s.l[3]} pathLength={1} />;
  });
  return (
    <svg className={className} viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shapes}
    </svg>
  );
}

const CARDS = [
  { icon: "bug", title: "Bugs and broken flows", text: "Features that worked in the demo fail with real users.", fix: "Error tracking, tests and a root-cause fix" },
  { icon: "layout", title: "UI/UX that converts", text: "Clear screens, fixed layouts and fewer drop-offs.", fix: "Usability review and redesigned key flows" },
  { icon: "card", title: "Billing and subscriptions", text: "Plans, trials and failed payments handled properly.", fix: "Stripe webhooks, retries and plan limits" },
  { icon: "shield", title: "Security hardening", text: "Secrets, database rules and endpoints locked down.", fix: "Secrets moved server-side and database rules" },
  { icon: "users", title: "Roles and permissions", text: "RBAC so each user sees only what they should.", fix: "Role-based access enforced on every route" },
  { icon: "gauge", title: "Performance and scaling", text: "Slow queries and pages fixed before traffic grows.", fix: "Query tuning, caching and lazy loading" },
  { icon: "cloud", title: "Deployment and hosting", text: "Reliable releases, environments and monitoring.", fix: "CI/CD, preview environments and monitoring" },
  { icon: "code", title: "Maintainable code", text: "Structure, tests and docs your next hire can follow.", fix: "Refactor, tests and documentation" },
];

// Where founders get stuck: each card resolves from At risk to Fixed
export default function RescueCards() {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".rc"));
    cards.forEach((c) => c.classList.add("at-risk"));
    const fix = (c: HTMLElement) => c.classList.remove("at-risk");
    const single = matchMedia("(max-width: 860px), (hover: none)").matches;

    // Phones: each card on its own; wider screens: the whole set with a stagger
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (single) fix(e.target as HTMLElement);
          else cards.forEach((c, i) => setTimeout(() => fix(c), i * 150));
          io.unobserve(e.target);
          if (!single) io.disconnect();
        }
      },
      { threshold: single ? 0.6 : 0.3 },
    );
    if (single) cards.forEach((c) => io.observe(c));
    else io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={grid} className="trust rescue-grid rc-grid" data-reveal-group="">
      {CARDS.map((c, i) => (
        <div key={c.icon} className="rc" style={{ "--i": i } as CSSProperties}>
          <span className="rc-tag" aria-hidden="true">
            <span className="rc-risk">At risk</span>
            <span className="rc-fixed">Fixed ✓</span>
          </span>
          <span className="ib">
            <Icon name={c.icon} className="rc-ic rc-ic-risk" />
            <Icon name={c.icon} className="rc-ic rc-ic-fixed" />
          </span>
          <b>{c.title}</b>
          <p>{c.text}</p>
          <p className="rc-note">
            <span>How we fix it:</span> {c.fix}
          </p>
        </div>
      ))}
    </div>
  );
}
