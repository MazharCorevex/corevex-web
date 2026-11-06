"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Feature list with sticky media
export default function FeatList({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = ref.current!;
    const items = Array.from(w.querySelectorAll<HTMLElement>(".feat-item"));
    const imgs = Array.from(w.querySelectorAll<HTMLElement>(".feat-media img"));
    const offs = items.map((it, i) => {
      const on = () => {
        items.forEach((x, j) => x.classList.toggle("on", i === j));
        imgs.forEach((im, j) => im.classList.toggle("on", j === Math.min(i, imgs.length - 1)));
      };
      it.addEventListener("mouseenter", on);
      it.addEventListener("focusin", on);
      it.addEventListener("click", on);
      return () => {
        it.removeEventListener("mouseenter", on);
        it.removeEventListener("focusin", on);
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
