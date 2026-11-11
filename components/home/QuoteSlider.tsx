"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/types";

const EVERY = 8000;

// Client quotes, one at a time
export default function QuoteSlider({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const go = (n: number) => setI((n + items.length) % items.length);

  // Advance on a timer unless paused or reduced motion
  useEffect(() => {
    if (paused || items.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % items.length), EVERY);
    return () => clearTimeout(t);
  }, [i, paused, items.length]);

  return (
    <div
      ref={box}
      className="quotes"
      role="region"
      aria-roledescription="carousel"
      aria-label="What clients say"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !box.current?.contains(e.relatedTarget as Node) && setPaused(false)}
    >
      {items.map((t, n) => (
        <figure key={n} className={`quote${n === i ? " on" : ""}`} aria-hidden={n !== i} aria-roledescription="slide" aria-label={`${n + 1} of ${items.length}`}>
          <blockquote>{t.quote}</blockquote>
          <figcaption className="who">
            <i aria-hidden="true" />
            <div>
              <b>{t.name}</b>
              <span>{[t.role, t.company].filter(Boolean).join(", ")}</span>
            </div>
          </figcaption>
        </figure>
      ))}
      {items.length > 1 && (
        <div className="q-ctrl">
          <button type="button" aria-label="Previous quote" onClick={() => go(i - 1)}>
            ‹
          </button>
          <button type="button" aria-label="Next quote" onClick={() => go(i + 1)}>
            ›
          </button>
          <div className="q-dots" aria-hidden="true">
            {items.map((_, n) => (
              <i key={n} className={n === i ? "on" : undefined} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
