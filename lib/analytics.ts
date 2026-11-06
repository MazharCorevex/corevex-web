type Gtag = (cmd: "event", name: string, params?: Record<string, unknown>) => void;

export function track(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  if (g) g("event", name, params);
}
