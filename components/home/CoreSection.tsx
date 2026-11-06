"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  [
    "01 / 03",
    "Strategy and engineering lock together.",
    "Every project starts with a solution architect, not a sales script.",
  ],
  [
    "02 / 03",
    "One team, every layer.",
    "UI/UX, front end, back end, mobile, AI, QA and project management in one place.",
  ],
  ["03 / 03", "Built to hand over.", "Clean code, documentation and full ownership transferred to you."],
];

// Pinned core
export default function CoreSection() {
  const ref = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const core = ref.current!;
    const upd = () => {
      const r = core.getBoundingClientRect();
      const p = Math.max(0, Math.min(0.999, -r.top / (r.height - innerHeight)));
      setK(Math.floor(p * STEPS.length));
    };
    addEventListener("scroll", upd, { passive: true });
    upd();

    // 3D only on desktop with a fine pointer
    const ok =
      matchMedia("(min-width: 861px) and (pointer: fine)").matches &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting || !ok) return;
        io.disconnect();
        import("./core-scene")
          .then(({ initCore }) => {
            if (cancelled || !canvas.current) return;
            dispose = initCore(canvas.current, core, 230);
            setLive(true);
          })
          .catch(() => {});
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(core);
    return () => {
      cancelled = true;
      removeEventListener("scroll", upd);
      io.disconnect();
      dispose?.();
    };
  }, []);

  return (
    <section className={`core${live ? " live" : ""}`} ref={ref} aria-label="How Corevex works">
      <div className="core-sticky">
        <Image
          src="/images/hero/hero-core-desktop.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="core-fallback"
          style={{ objectFit: "cover", opacity: 0.9 }}
        />
        <canvas ref={canvas} aria-hidden="true" />
        <div className="wrap">
          <div className="core-steps">
            {STEPS.map(([n, h, p], i) => (
              <div key={n} className={`core-step${i === k ? " on" : ""}`}>
                <b>{n}</b>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="core-progress" aria-hidden="true">
          {STEPS.map((s, i) => (
            <i key={s[0]} className={i <= k ? "on" : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
