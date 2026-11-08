"use client";

import { useEffect, useRef } from "react";

// Gears loop for the automation tile
export default function GearsVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Load and play only while the tile is on screen
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== "auto") {
            v.preload = "auto";
            v.load();
          }
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video ref={ref} className="gears-video" muted loop playsInline preload="none" poster="/media/gears-poster-navy.webp" aria-hidden="true" tabIndex={-1}>
      <source src="/media/gears-loop.mp4" type="video/mp4" />
      <source src="/media/gears-loop.webm" type="video/webm" />
    </video>
  );
}
