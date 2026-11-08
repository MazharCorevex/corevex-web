import type { ReactNode } from "react";
import Img from "@/components/ui/Img";
import { getClientLogos } from "@/lib/content";

// Client logos; until real logos are published, the fallback shows instead
export default async function ClientLogos({ variant, fallback = null }: { variant: "marquee" | "strip"; fallback?: ReactNode }) {
  const logos = await getClientLogos();
  if (!logos.length) return fallback;
  const img = (l: (typeof logos)[number], k: string) => (
    <Img key={k} src={l.logo} alt={`${l.name} logo`} width={l.width} height={28} />
  );
  if (variant === "marquee") {
    return (
      <section className="marquee" aria-label="Clients">
        <p className="marquee-title">Trusted by founders, product teams and enterprises across industries</p>
        <div className="marquee-track">
          {logos.map((l, i) => img(l, `a${i}`))}
          {logos.map((l, i) => img(l, `b${i}`))}
        </div>
      </section>
    );
  }
  return (
    <section className="logo-strip">
      <div className="wrap">
        <p>Trusted by founders, product teams and enterprises</p>
        {logos.slice(0, 6).map((l, i) => img(l, `s${i}`))}
      </div>
    </section>
  );
}
