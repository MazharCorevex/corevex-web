import Link from "next/link";
import Img from "@/components/ui/Img";
import type { Article } from "@/lib/types";

// Article card
export default function ArticleCard({ a, feature = false }: { a: Article; feature?: boolean }) {
  if (feature) {
    return (
      <Link className="mag-feat" data-cat={a.categoryKey} href={`/insights/${a.slug}/`}>
        <div className="img">
          <Img src={a.image} alt="" sizes="(max-width: 860px) 100vw, 60vw" priority />
        </div>
        <div className="t">
          <div className="meta-row">
            <span className="chip">{a.category}</span>
            <span>{a.readTime} min read</span>
          </div>
          <h2>{a.title}</h2>
          <p className="muted">{a.summary || a.description}</p>
          <span className="link" style={{ marginTop: 20 }}>
            Read the article <span className="chev">»</span>
          </span>
        </div>
      </Link>
    );
  }
  return (
    <Link className="" data-cat={a.categoryKey} href={`/insights/${a.slug}/`}>
      <div className="img">
        <Img src={a.image} alt="" sizes="(max-width: 860px) 100vw, 33vw" />
      </div>
      <div className="t">
        <div className="meta-row">
          <span className="chip">{a.category}</span>
          <span>{a.readTime} min read</span>
        </div>
        <h3>{a.title}</h3>
        <p>{a.summary || a.description}</p>
      </div>
    </Link>
  );
}
