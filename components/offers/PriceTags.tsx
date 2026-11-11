import { fromText, offer, startingText } from "@/lib/offers";

// Hero pill, for example "Starting at $5,000"
export function PriceBadge({ slug }: { slug: string }) {
  const o = offer(slug);
  if (!o) return null;
  return <span className="price-badge">{startingText(o)}</span>;
}

// Small chip for tiles and the menu, for example "From $199"
export function PriceChip({ slug, text }: { slug: string; text?: string }) {
  const o = offer(slug);
  if (!o) return null;
  return <span className="price-chip">{text ?? fromText(o)}</span>;
}
