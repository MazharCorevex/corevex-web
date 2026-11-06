"use client";

import type { MouseEvent, ReactNode } from "react";
import { track } from "@/lib/analytics";

const URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

type Calendly = { initPopupWidget: (o: { url: string }) => void };
let loading: Promise<void> | null = null;

function loadCalendly() {
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("calendly"));
    };
    document.body.appendChild(s);
  });
  return loading;
}

function popupUrl(base: string) {
  const u = new window.URL(base);
  u.searchParams.set("primary_color", "48ac9f");
  u.searchParams.set("hide_gdpr_banner", "1");
  return u.toString();
}

export default function BookCall({ className = "btn btn-ghost", children }: { className?: string; children?: ReactNode }) {
  async function onClick(e: MouseEvent<HTMLAnchorElement>) {
    track("cta_click", { cta: "book_call" });
    if (!URL) return;
    e.preventDefault();
    try {
      await loadCalendly();
      (window as unknown as { Calendly: Calendly }).Calendly.initPopupWidget({ url: popupUrl(URL) });
    } catch {
      window.open(URL, "_blank", "noopener");
    }
  }
  return (
    <a className={className} href={URL || "/contact/#call"} onClick={onClick}>
      {children ?? "Book a 30-minute call"}
    </a>
  );
}
