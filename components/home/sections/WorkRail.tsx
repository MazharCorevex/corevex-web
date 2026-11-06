import Link from "next/link";
import Img from "@/components/ui/Img";
import Rail from "@/components/interactive/Rail";
import { getCaseStudies } from "@/lib/content";

// Work rail
export default async function WorkRail() {
  const cases = await getCaseStudies();
  if (!cases.length) return null;
  return (
    <Rail className="band mist">
      <div className="wrap rail-head">
        <div>
          <span className="label">Work</span>
          <h2 className="h2" data-reveal="">
            How we design and build products
          </h2>
        </div>
        <div className="rail-ctrl">
          <button data-dir="-1" aria-label="Previous">
            ‹
          </button>
          <button data-dir="1" aria-label="Next">
            ›
          </button>
        </div>
      </div>
      <div className="rail">
        {cases.map((c) => (
          <Link key={c.slug} href={`/work/${c.slug}/`} className="rail-card">
            <div className="img">
              <Img src={c.image} alt={c.railAlt || c.imageAlt || ""} sizes="(max-width: 600px) 85vw, 560px" />
            </div>
            <div className="meta">
              <span className="chip">{c.industry}</span>{" "}
              {c.isDesignStudy && <span className="concept">Product design study</span>}
              <h3>{c.name}</h3>
              <p>{c.summary}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="wrap" style={{ marginTop: 36 }}>
        <Link href="/work/" className="link">
          {"View all work "}
          <span className="chev">»</span>
        </Link>
      </div>
    </Rail>
  );
}
