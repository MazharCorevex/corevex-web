"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Industries accordion
export default function Accordion({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = Array.from(ref.current!.querySelectorAll<HTMLElement>(".acc-item"));
    const hover = matchMedia("(hover: hover)").matches;
    const offs = items.map((it) => {
      const on = () =>
        items.forEach((x) => {
          x.classList.toggle("on", x === it);
          x.setAttribute("aria-expanded", String(x === it));
        });
      if (hover) it.addEventListener("mouseenter", on);
      it.addEventListener("focus", on);
      it.addEventListener("click", on);
      return () => {
        it.removeEventListener("mouseenter", on);
        it.removeEventListener("focus", on);
        it.removeEventListener("click", on);
      };
    });
    return () => offs.forEach((f) => f());
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
