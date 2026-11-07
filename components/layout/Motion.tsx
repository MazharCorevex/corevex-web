"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Page motion
export default function Motion() {
  const path = usePathname();

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s) as NodeListOf<T>);
    const off: Array<() => void> = [];

    // Reveal
    $$("[data-reveal-group]").forEach((g) =>
      Array.from(g.children).forEach((c, i) => {
        (c as HTMLElement).style.setProperty("--i", String(i));
        if (!c.hasAttribute("data-reveal")) c.setAttribute("data-reveal", "");
      }),
    );
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    $$('[data-reveal]:not([data-reveal="load"]), .layers, .timeline, .wordmark, .ed-photo, .art-img').forEach((el) => io.observe(el));
    off.push(() => io.disconnect());

    // Count up
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const end = parseFloat(el.dataset.count || "0");
          const suf = el.dataset.suffix || "";
          const t0 = performance.now();
          const d = reduce ? 1 : 1400;
          const tick = (n: number) => {
            const p = Math.min(1, (n - t0) / d);
            el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          cio.unobserve(el);
        }),
      { threshold: 0.6 },
    );
    $$("[data-count]").forEach((el) => cio.observe(el));
    off.push(() => cio.disconnect());

    // Steps progress
    const steps = $$(".steps");
    if (steps.length) {
      const upd = () =>
        steps.forEach((s) => {
          const fill = s.querySelector<HTMLElement>(".fill");
          if (!fill) return;
          const r = s.getBoundingClientRect();
          const p = (innerHeight * 0.6 - r.top) / r.height;
          fill.style.setProperty("--p", Math.max(0, Math.min(1, p)) * 100 + "%");
        });
      addEventListener("scroll", upd, { passive: true });
      upd();
      off.push(() => removeEventListener("scroll", upd));
    }

    // Photo parallax
    if (!reduce) {
      const imgs = $$(".split-img img, .svc-photo img, .case-band .shot img, .art-img img");
      let ticking = false;
      const para = () => {
        const vh = innerHeight;
        imgs.forEach((im) => {
          const r = im.parentElement!.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          const p = (r.top + r.height / 2 - vh / 2) / vh;
          im.style.setProperty("--py", (p * -24).toFixed(1) + "px");
        });
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(para);
        }
      };
      if (imgs.length) {
        addEventListener("scroll", onScroll, { passive: true });
        para();
        off.push(() => removeEventListener("scroll", onScroll));
      }
    }

    // Tile tilt
    if (!reduce && fine) {
      $$(".bento .tile").forEach((t) => {
        const move = (e: PointerEvent) => {
          const r = t.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          t.classList.add("tilting");
          t.style.transform = `perspective(1000px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg) translateY(-3px)`;
        };
        const leave = () => {
          t.classList.remove("tilting");
          t.style.transform = "";
        };
        t.addEventListener("pointermove", move);
        t.addEventListener("pointerleave", leave);
        off.push(() => {
          t.removeEventListener("pointermove", move);
          t.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => off.forEach((f) => f());
  }, [path]);

  return null;
}
