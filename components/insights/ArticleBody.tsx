import Link from "next/link";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";

type TableValue = { rows: { _key: string; cells: string[] }[]; hasHeader?: boolean };

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    lead: ({ children }) => <p className="intro">{children}</p>,
    h2: ({ children, value }) => <h2 id={(value as { anchor?: string }).anchor}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={(value as { anchor?: string }).anchor}>{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <b>{children}</b>,
    link: ({ children, value }) => {
      const href = (value as { href?: string }).href || "#";
      return href.startsWith("/") ? (
        <Link href={href}>{children}</Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
  types: {
    table: ({ value }: { value: TableValue }) => {
      const [head, ...rows] = value.hasHeader ? value.rows : [null, ...value.rows];
      return (
        <div className="table-scroll">
          <table>
            {head && (
              <thead>
                <tr>
                  {head.cells.map((c, i) => (
                    <th key={i} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((r) => (
                <tr key={r!._key}>
                  {r!.cells.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

// Article body
export default function ArticleBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
