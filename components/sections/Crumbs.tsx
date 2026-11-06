import Link from "next/link";

// Breadcrumb
export default function Crumbs({ items }: { items: Array<[string, string?]> }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map(([label, href], i) =>
        i === 0 ? (
          <Link key={label} href={href || "/"}>
            {label}
          </Link>
        ) : (
          <span key={label}>{href ? <Link href={href}>{label}</Link> : label}</span>
        ),
      )}
    </nav>
  );
}
