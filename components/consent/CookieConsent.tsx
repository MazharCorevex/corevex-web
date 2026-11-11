"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONSENT_CHANGE, OPEN_SETTINGS, applyConsent, readConsent, writeConsent } from "@/lib/consent";

// Cookie banner and settings panel
export default function CookieConsent() {
  const [banner, setBanner] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const c = readConsent();
    if (c) applyConsent(c.analytics);
    // Deferred so the first paint stays the same as the server render
    const t = setTimeout(() => setBanner(!c), 0);
    const open = () => {
      opener.current = document.activeElement as HTMLElement | null;
      setAnalytics(readConsent()?.analytics ?? false);
      setSettings(true);
    };
    addEventListener(OPEN_SETTINGS, open);
    return () => {
      clearTimeout(t);
      removeEventListener(OPEN_SETTINGS, open);
    };
  }, []);

  // Keep the WhatsApp button above the banner
  useEffect(() => {
    const root = document.documentElement;
    if (!banner || !bar.current) {
      root.style.removeProperty("--cookie-h");
      return;
    }
    const ro = new ResizeObserver(([e]) => root.style.setProperty("--cookie-h", `${Math.ceil(e.borderBoxSize?.[0]?.blockSize ?? e.contentRect.height)}px`));
    ro.observe(bar.current);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--cookie-h");
    };
  }, [banner]);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (settings && !d.open) d.showModal?.();
    if (!settings && d.open) {
      d.close();
      opener.current?.focus?.();
    }
  }, [settings]);

  const choose = (value: boolean) => {
    writeConsent({ analytics: value });
    applyConsent(value);
    dispatchEvent(new CustomEvent(CONSENT_CHANGE, { detail: { analytics: value } }));
    setBanner(false);
    setSettings(false);
  };

  return (
    <>
      {banner && (
        <div ref={bar} className="cookie-bar" role="region" aria-label="Cookie consent">
          <p>
            We use cookies to keep the site working and, with your permission, to understand how it’s used.{" "}
            <Link href="/cookies/">Cookie Policy</Link>
          </p>
          <div className="cookie-actions">
            <button type="button" className="cookie-btn" onClick={() => choose(true)}>
              Accept all
            </button>
            <button type="button" className="cookie-btn" onClick={() => choose(false)}>
              Reject non-essential
            </button>
            <button
              type="button"
              className="cookie-btn"
              onClick={() => {
                opener.current = document.activeElement as HTMLElement | null;
                setAnalytics(false);
                setSettings(true);
              }}
            >
              Settings
            </button>
          </div>
        </div>
      )}
      <dialog
        ref={dlg}
        className="cookie-panel"
        aria-labelledby="cookie-title"
        onCancel={(e) => {
          e.preventDefault();
          setSettings(false);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSettings(false);
        }}
      >
        <form
          className="cookie-inner"
          onSubmit={(e) => {
            e.preventDefault();
            choose(analytics);
          }}
        >
          <div className="cookie-head">
            <h2 id="cookie-title">Cookie settings</h2>
            <button type="button" className="cookie-x" aria-label="Close cookie settings" onClick={() => setSettings(false)}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="cookie-sub">
            Choose which cookies we can use. You can change this at any time from the footer. Read our{" "}
            <Link href="/cookies/" onClick={() => setSettings(false)}>
              Cookie Policy
            </Link>
            .
          </p>
          <div className="cookie-cat">
            <div>
              <h3 id="ck-nec">Necessary</h3>
              <p id="ck-nec-d">Always on. Keeps the site secure and remembers your cookie choice.</p>
            </div>
            <input type="checkbox" role="switch" className="cookie-switch" checked disabled aria-labelledby="ck-nec" aria-describedby="ck-nec-d" />
          </div>
          <div className="cookie-cat">
            <div>
              <h3 id="ck-ana">Analytics</h3>
              <p id="ck-ana-d">Off by default. Google Analytics shows us which pages are useful, without telling us who you are.</p>
            </div>
            <input
              type="checkbox"
              role="switch"
              className="cookie-switch"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              aria-labelledby="ck-ana"
              aria-describedby="ck-ana-d"
            />
          </div>
          <button type="submit" className="btn cookie-save">
            Save choices
          </button>
        </form>
      </dialog>
    </>
  );
}
