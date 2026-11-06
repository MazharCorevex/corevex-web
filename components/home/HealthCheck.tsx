"use client";

import { useEffect, useRef, useState } from "react";

const ROWS = [
  ["Security", "Exposed keys, open database rules"],
  ["Billing", "Failed payments, broken plans"],
  ["Roles and permissions", "Everyone can see everything"],
  ["UI/UX", "Screens that confuse users"],
  ["Performance", "Slow pages under real traffic"],
  ["Deployment", "Manual, fragile releases"],
];

// App health check
export default function HealthCheck() {
  const ref = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState(0);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(42);

  useEffect(() => {
    const el = ref.current!;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const step = reduce ? 0 : 420;
        ROWS.forEach((_, i) => timers.push(setTimeout(() => setFixed(i + 1), 500 + i * step)));
        timers.push(setTimeout(() => setDone(true), 400));
        const t0 = performance.now();
        const d = reduce ? 1 : 500 + ROWS.length * step;
        const tick = (n: number) => {
          const p = Math.min(1, (n - t0) / d);
          setScore(Math.round(42 + 50 * p));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`hc${done ? " done" : ""}`} ref={ref}>
      <div className="hc-head">
        <div>
          <b>App health check</b>
          <span>Your codebase, before and after</span>
        </div>
        <div className="hc-score">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="52" className="hc-track" />
            <circle cx="60" cy="60" r="52" className="hc-bar" />
          </svg>
          <strong aria-label={`Health score ${score}`}>{score}</strong>
        </div>
      </div>
      {ROWS.map(([t, d], i) => (
        <div key={t} className={`hc-row${i < fixed ? " fixed" : ""}`}>
          <span className="hc-dot" />
          <div>
            <b>{t}</b>
            <span>{d}</span>
          </div>
          <em className="hc-tag">
            <i className="bad">At risk</i>
            <i className="good">Fixed</i>
          </em>
        </div>
      ))}
    </div>
  );
}
