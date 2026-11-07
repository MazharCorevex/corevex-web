"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { track } from "@/lib/analytics";

const URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

// Calendly inline embed, details shown in our own side panel
export function embedUrl(base: string, host: string) {
  const u = new window.URL(base);
  u.searchParams.set("embed_domain", host);
  u.searchParams.set("embed_type", "Inline");
  u.searchParams.set("hide_event_type_details", "1");
  u.searchParams.set("hide_gdpr_banner", "1");
  u.searchParams.set("primary_color", "48ac9f");
  return u.toString();
}

const fromCalendly = (origin: string) => /^https:\/\/([a-z0-9-]+\.)?calendly\.com$/.test(origin);

// Booking window
function BookingDialog({ url, onClose }: { url: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);

  // Offer a way out if the calendar is slow
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const d = ref.current!;
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
    // Lock the page without a jump where the scrollbar was
    const root = document.documentElement;
    root.style.setProperty("--sbw", `${window.innerWidth - root.clientWidth}px`);
    root.classList.add("booking-open");
    const onMessage = (e: MessageEvent) => {
      if (!fromCalendly(e.origin)) return;
      const ev = (e.data as { event?: string } | null)?.event;
      if (ev === "calendly.event_scheduled") track("booking_scheduled", { page: location.pathname });
    };
    window.addEventListener("message", onMessage);
    return () => {
      if (d.open && typeof d.close === "function") d.close();
      root.classList.remove("booking-open");
      root.style.removeProperty("--sbw");
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="booking"
      aria-labelledby="booking-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="booking-panel">
        <aside className="booking-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/corevex-logo-primary-white.svg" alt="" width={945} height={213} />
          <h2 id="booking-title">Book a 30-minute call</h2>
          <p className="booking-lead">Pick a time that suits you. You will speak with a senior engineer about what you want to build.</p>
          <ul>
            <li>30-minute video call</li>
            <li>Talk directly to a senior engineer</li>
            <li>NDA on request</li>
          </ul>
          <div className="booking-alt">
            <p>
              Prefer to write?{" "}
              <Link href="/contact/" onClick={onClose}>
                Send us a brief <span className="chev">»</span>
              </Link>
            </p>
            <p>
              Calendar not loading?{" "}
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open it in a new tab <span className="chev">»</span>
              </a>
            </p>
          </div>
        </aside>
        <div className="booking-cal">
          <div className="booking-bar">
            <span className="booking-step">Choose a time for your call</span>
            <button type="button" className="booking-close" aria-label="Close booking" onClick={onClose}>
              ×
            </button>
          </div>
          {!ready && (
            <div className="booking-loading" role="status">
              <span className="booking-spin" aria-hidden="true" />
              Loading available times
              {slow && (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Taking a while? Open the calendar in a new tab <span className="chev">»</span>
                </a>
              )}
            </div>
          )}
          <iframe title="Choose a time with Corevex on Calendly" src={embedUrl(url, window.location.host)} onLoad={() => setReady(true)} />
        </div>
      </div>
    </dialog>
  );
}

export default function BookCall({ className = "btn btn-ghost", children }: { className?: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLAnchorElement>(null);

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    track("cta_click", { cta: "book_call" });
    if (!URL || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    track("booking_open", { page: location.pathname });
    setOpen(true);
  }
  const close = () => setOpen(false);

  // Focus goes back to the button once the window has closed
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) opener.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <a ref={opener} className={className} href={URL || "/contact/#call"} onClick={onClick}>
        {children ?? "Book a 30-minute call"}
      </a>
      {open && URL && createPortal(<BookingDialog url={URL} onClose={close} />, document.body)}
    </>
  );
}
