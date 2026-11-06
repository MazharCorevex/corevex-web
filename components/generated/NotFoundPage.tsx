import type { CSSProperties } from "react";
import Link from "next/link";

// NotFoundPage
export default function NotFoundPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{ minHeight: "80svh", display: "flex", alignItems: "center" } as CSSProperties}
      >
        <div className="wrap">
          <span className="label">404</span>
          <h1 className="h1">This page has moved or no longer exists.</h1>
          <div className="btns" style={{ marginTop: "30px" } as CSSProperties}>
            <Link href="/" className="btn">
              {"Go to the homepage "}
              <span className="chev">»</span>
            </Link>
            <Link href="/contact/" className="btn btn-ghost">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
