import Link from "next/link";
import type { ReactNode } from "react";
import type { Block, LegalDoc } from "@/lib/legal";

// Bold, email and page links inside legal copy
function inline(text: string, self = ""): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|([\w.+-]+@[\w-]+\.[\w.]+\w)|\b(Privacy Policy|Cookie Policy)\b/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = m.index;
    if (m[1]) out.push(<strong key={k}>{m[1]}</strong>);
    else if (m[2]) out.push(<a key={k} href={`mailto:${m[2]}`}>{m[2]}</a>);
    else {
      const href = m[3] === "Privacy Policy" ? "/privacy/" : "/cookies/";
      out.push(href === self ? m[3] : <Link key={k} href={href}>{m[3]}</Link>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Headings, paragraphs and lists
export function LegalBlocks({ blocks, self }: { blocks: Block[]; self?: string }) {
  return blocks.map((b, i) =>
    b.t === "h2" ? (
      <h2 key={i}>{b.text}</h2>
    ) : b.t === "ul" ? (
      <ul key={i}>
        {b.items.map((it) => (
          <li key={it}>{inline(it, self)}</li>
        ))}
      </ul>
    ) : (
      <p key={i}>{inline(b.text, self)}</p>
    ),
  );
}

// Legal page layout
export default function LegalPage({ doc, self, children }: { doc: LegalDoc; self?: string; children?: ReactNode }) {
  return (
    <>
      <section className="page-hero legal-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>{doc.title}</span>
          </nav>
          <h1 className="h1">{doc.title}</h1>
          {doc.effective && (
            <p className="legal-date">
              Effective date: <time>{doc.effective}</time>
            </p>
          )}
        </div>
      </section>
      <section className="band legal-band">
        <div className="wrap">
          <article className="legal-doc">
            <LegalBlocks blocks={doc.blocks} self={self} />
            {children}
          </article>
        </div>
      </section>
    </>
  );
}
