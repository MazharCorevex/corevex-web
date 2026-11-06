import "server-only";

// Rate limit
type Hit = { count: number; reset: number };
const store = new Map<string, Hit>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  if (store.size > 5000) {
    for (const [k, v] of store) if (v.reset < now) store.delete(k);
  }
  const hit = store.get(key);
  if (!hit || hit.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  hit.count++;
  return hit.count <= limit;
}
