"use client";

import Image from "next/image";
import { useState, type MouseEvent, type ReactNode } from "react";

// Service rows with hover image
export default function SvcRows({ className, children, ...rest }: { className?: string; children: ReactNode; "data-reveal-group"?: boolean }) {
  const [img, setImg] = useState<string | null>(null);
  const [on, setOn] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const row = (e: MouseEvent) => (e.target as HTMLElement).closest<HTMLElement>(".svc-row");
  const fine = () => typeof window !== "undefined" && matchMedia("(pointer: fine)").matches;

  return (
    <>
      <div
        className={className}
        data-reveal-group={rest["data-reveal-group"] ? "" : undefined}
        onMouseOver={(e) => {
          const r = row(e);
          if (!r || !fine()) return;
          setImg(r.dataset.img || null);
          setOn(true);
        }}
        onMouseOut={(e) => {
          const r = row(e);
          if (r && !r.contains(e.relatedTarget as Node)) setOn(false);
        }}
        onMouseMove={(e) => setPos({ x: e.clientX + 180, y: e.clientY })}
      >
        {children}
      </div>
      <div className={`hover-img${on ? " on" : ""}`} style={{ left: pos.x, top: pos.y }} aria-hidden="true">
        {img && <Image src={img} alt="" width={800} height={533} sizes="320px" />}
      </div>
    </>
  );
}
