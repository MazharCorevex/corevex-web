"use client";

import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useState } from "react";

// Before and after slider
export default function BeforeAfter({ className, children }: { className?: string; children: ReactNode }) {
  const [x, setX] = useState(50);
  const onInput = (e: FormEvent<HTMLDivElement>) => {
    const t = e.target as HTMLInputElement;
    if (t.type === "range") setX(Number(t.value));
  };
  return (
    <div className={className} style={{ "--x": `${x}%` } as CSSProperties} onInput={onInput}>
      {children}
    </div>
  );
}
