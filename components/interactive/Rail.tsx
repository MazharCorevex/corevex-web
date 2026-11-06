"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Work rail
export default function Rail({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrap = ref.current!;
    const rail = wrap.querySelector<HTMLElement>(".rail");
    if (!rail) return;
    const btns = Array.from(wrap.querySelectorAll<HTMLButtonElement>("[data-dir]"));
    const clicks = btns.map((b) => {
      const f = () => rail.scrollBy({ left: +(b.dataset.dir || 1) * rail.clientWidth * 0.7, behavior: "smooth" });
      b.addEventListener("click", f);
      return () => b.removeEventListener("click", f);
    });
    let down = false;
    let moved = false;
    let sx = 0;
    let sl = 0;
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      sx = e.clientX;
      sl = rail.scrollLeft;
      rail.style.scrollSnapType = "none";
    };
    const pu = () => {
      if (down) {
        down = false;
        rail.style.scrollSnapType = "";
      }
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      if (Math.abs(e.clientX - sx) > 4) moved = true;
      rail.scrollLeft = sl - (e.clientX - sx);
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        moved = false;
      }
    };
    const drag = (e: DragEvent) => e.preventDefault();
    rail.addEventListener("pointerdown", pd);
    rail.addEventListener("pointermove", pm);
    rail.addEventListener("click", click, true);
    rail.addEventListener("dragstart", drag);
    addEventListener("pointerup", pu);
    return () => {
      clicks.forEach((f) => f());
      rail.removeEventListener("pointerdown", pd);
      rail.removeEventListener("pointermove", pm);
      rail.removeEventListener("click", click, true);
      rail.removeEventListener("dragstart", drag);
      removeEventListener("pointerup", pu);
    };
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
