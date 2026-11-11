// Cookie consent, stored in a first-party cookie
export const CONSENT_COOKIE = "cv_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 182;
export const OPEN_SETTINGS = "cv:cookie-settings";
export const CONSENT_CHANGE = "cv:consent";

export type Consent = { analytics: boolean; at: number };

type Gtag = (...args: unknown[]) => void;
type Win = Window & { gtag?: Gtag; dataLayer?: unknown[]; __cvAnalytics?: boolean } & Record<string, unknown>;

export function readConsent(cookie = typeof document === "undefined" ? "" : document.cookie): Consent | null {
  const raw = cookie.split(/;\s*/).find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!raw) return null;
  const [v, at] = decodeURIComponent(raw.slice(CONSENT_COOKIE.length + 1)).split(".");
  if (v !== "a1" && v !== "a0") return null;
  return { analytics: v === "a1", at: Number(at) || 0 };
}

export function writeConsent(c: Pick<Consent, "analytics">) {
  const value = `${c.analytics ? "a1" : "a0"}.${Date.now()}`;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

// Removes _ga and _ga_* on this host and its parent domains
export function deleteGaCookies() {
  const names = document.cookie
    .split(/;\s*/)
    .map((c) => c.split("=")[0])
    .filter((n) => n === "_ga" || n.startsWith("_ga_"));
  const parts = location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; Domain=.${parts.slice(i).join(".")}`);
  for (const n of names) for (const d of domains) document.cookie = `${n}=; Max-Age=0; Path=/${d}`;
}

// Loads gtag.js once analytics is accepted
export function applyConsent(analytics: boolean, gaId = process.env.NEXT_PUBLIC_GA_ID) {
  const w = window as unknown as Win;
  w.__cvAnalytics = analytics;
  if (!analytics) deleteGaCookies();
  if (!gaId) return;
  w[`ga-disable-${gaId}`] = !analytics;
  w.gtag?.("consent", "update", { analytics_storage: analytics ? "granted" : "denied" });
  if (!analytics) return;
  if (document.getElementById("ga-js")) return;
  const s = document.createElement("script");
  s.id = "ga-js";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(s);
  w.gtag?.("js", new Date());
  w.gtag?.("config", gaId, { anonymize_ip: true });
}

// Consent Mode v2 defaults, run before anything else
export const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'denied',personalization_storage:'denied',security_storage:'denied',wait_for_update:500});`;
