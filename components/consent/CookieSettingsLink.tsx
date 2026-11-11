"use client";

import type { ReactNode } from "react";
import { OPEN_SETTINGS } from "@/lib/consent";

// Reopens the cookie settings panel
export default function CookieSettingsLink({ className = "cookie-link", children = "Cookie settings" }: { className?: string; children?: ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => dispatchEvent(new Event(OPEN_SETTINGS))}>
      {children}
    </button>
  );
}
