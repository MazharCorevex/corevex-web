import Link from "next/link";
import { offer as find, type Offer } from "@/lib/offers";

const usd = (n: number) => n.toLocaleString("en-US");

// Promotional offer card
export default function OfferCard({ slug, popular = false }: { slug: string; popular?: boolean }) {
  const o: Offer | undefined = find(slug);
  if (!o) return null;
  return (
    <article className={`offer-card${popular ? " is-popular" : ""}`} aria-labelledby={`offer-${o.slug}`}>
      {popular && <span className="offer-ribbon">Popular</span>}
      <h3 id={`offer-${o.slug}`}>{o.title}</h3>
      <p className="offer-price">
        {o.from && <span className="offer-from">From</span>}
        <span className="offer-amount">
          <span className="offer-cur">$</span>
          {usd(o.price)}
          {o.maxPrice && (
            <>
              <span className="offer-to"> to </span>
              <span className="offer-cur">$</span>
              {usd(o.maxPrice)}
            </>
          )}
        </span>
        {o.per && <span className="offer-per">{o.per}</span>}
      </p>
      <p className="offer-promise">{o.promise}</p>
      <ul className="offer-points">
        {o.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <Link className="btn offer-btn" href={`/contact/?offer=${o.slug}`}>
        {"Get started "}
        <span className="chev">»</span>
      </Link>
    </article>
  );
}
