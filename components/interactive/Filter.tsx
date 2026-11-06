"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "@/lib/analytics";

// Work and insights filters
export default function Filter({ className, children, mode }: { className?: string; children: ReactNode; mode: "work" | "insights" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current!;
    const attr = mode === "work" ? "data-filter" : "data-ifilter";
    const btns = Array.from(box.querySelectorAll<HTMLButtonElement>(`[${attr}]`));
    const bar = box.querySelector<HTMLElement>(".filters");
    const offs = btns.map((b) => {
      const f = () => {
        btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        const v = b.getAttribute(attr)!;
        track("filter", { list: mode, value: v });
        if (mode === "work") {
          box.querySelectorAll<HTMLElement>(".m-card").forEach((c) =>
            c.classList.toggle("hide", v !== "all" && (c.dataset.cat || "").indexOf(v) < 0),
          );
        } else {
          let shown = 0;
          box.querySelectorAll<HTMLElement>(".mag-feat[data-cat], .mag > a[data-cat]").forEach((c) => {
            const on = v === "all" || c.dataset.cat === v;
            c.hidden = !on;
            if (on) shown++;
          });
          const n = box.querySelector<HTMLElement>(".empty-note");
          if (n) n.hidden = shown > 0;
        }
      };
      b.addEventListener("click", f);
      return () => b.removeEventListener("click", f);
    });
    const onScroll = () => {
      if (!bar) return;
      bar.classList.toggle("is-stuck", bar.getBoundingClientRect().top <= (document.body.classList.contains("header-on") ? 77 : 1));
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      offs.forEach((f) => f());
      removeEventListener("scroll", onScroll);
    };
  }, [mode]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
