type Gtag = (cmd: "event", name: string, params?: Record<string, unknown>) => void;

export function track(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag; __cvAnalytics?: boolean };
  // Only after the visitor accepts analytics
  if (w.__cvAnalytics && w.gtag) w.gtag("event", name, params);
}
