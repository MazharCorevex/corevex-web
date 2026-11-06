"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Scroll depth and CTA clicks
export default function Analytics() {
  const path = usePathname();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GA_ID) return;
    const marks = [25, 50, 75, 90];
    const hit = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (h <= 0) return;
      const p = (scrollY / h) * 100;
      for (const m of marks)
        if (p >= m && !hit.has(m)) {
          hit.add(m);
          track("scroll_depth", { percent: m, page: path });
        }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a.btn, .nav-cta, a.link");
      if (a) track("cta_click", { label: a.textContent?.trim().slice(0, 60), href: a.getAttribute("href"), page: path });
    };
    addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, [path]);

  return null;
}
