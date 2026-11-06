"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Tech stack tabs
export default function Tabs({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current!;
    const tabs = Array.from(box.querySelectorAll<HTMLButtonElement>(".stx-tab"));
    const panels = Array.from(box.querySelectorAll<HTMLElement>(".stx-panel"));
    const timers: ReturnType<typeof setTimeout>[] = [];
    tabs.forEach((t, i) => {
      t.id = t.id || `stx-tab-${i}`;
      panels[i]?.setAttribute("aria-labelledby", t.id);
    });
    const show = (i: number, focus = false) => {
      tabs.forEach((t, j) => {
        t.setAttribute("aria-selected", String(j === i));
        t.tabIndex = j === i ? 0 : -1;
      });
      if (focus) tabs[i].focus();
      panels.forEach((p, j) => {
        p.classList.toggle("on", j === i);
        p.hidden = j !== i;
        p.querySelectorAll<HTMLElement>(".stx-card").forEach((c, k) => {
          c.style.setProperty("--i", String(k));
          c.classList.remove("in");
          if (j === i) timers.push(setTimeout(() => c.classList.add("in"), 20));
        });
      });
    };
    const handlers = tabs.map((t, i) => {
      const click = () => show(i);
      const key = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          show((i + 1) % tabs.length, true);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          show((i - 1 + tabs.length) % tabs.length, true);
        }
      };
      t.addEventListener("click", click);
      t.addEventListener("keydown", key);
      return () => {
        t.removeEventListener("click", click);
        t.removeEventListener("keydown", key);
      };
    });
    tabs.forEach((t, j) => (t.tabIndex = j === 0 ? 0 : -1));
    panels.forEach((p, j) => (p.hidden = j !== 0));
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          show(0);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(box);
    return () => {
      handlers.forEach((h) => h());
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
