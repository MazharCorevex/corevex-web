import Link from "next/link";
import Img from "@/components/ui/Img";
import { getArticles } from "@/lib/content";

// Insights
export default async function InsightsBlock() {
  const all = await getArticles();
  const picks = all.filter((a) => typeof a.homeOrder === "number").sort((a, b) => a.homeOrder! - b.homeOrder!);
  const list = picks.length >= 4 ? picks : all.slice(0, 4);
  if (!list.length) return null;
  const [feat, ...rest] = list;
  return (
    <section className="band mist">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="label">Insights</span>
            <h2 className="h2" data-reveal="">
              Practical guides from our engineers
            </h2>
          </div>
          <Link href="/insights/" className="link">
            {"All insights "}
            <span className="chev">»</span>
          </Link>
        </div>
        <div className="ins">
          <Link href={`/insights/${feat.slug}/`} className="ins-feat">
            <div className="img">
              <Img src={feat.image} alt={feat.cardAlt || feat.imageAlt || ""} sizes="(max-width: 860px) 100vw, 55vw" />
            </div>
            <div className="t">
              <div className="meta-row">
                <span className="chip">{feat.category}</span>
                <span>{feat.readTime} min read</span>
              </div>
              <h3>{feat.title}</h3>
              <p className="muted">{feat.homeTeaser || feat.summary}</p>
            </div>
          </Link>
          <div className="ins-list">
            {rest.slice(0, 3).map((a) => (
              <Link key={a.slug} href={`/insights/${a.slug}/`}>
                <div className="meta-row">
                  <span className="chip">{a.category}</span>
                  <span>{a.readTime} min read</span>
                </div>
                <h3>{a.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
