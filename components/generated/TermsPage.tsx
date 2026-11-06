import Link from "next/link";

// TermsPage
export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>Terms of Service</span>
          </nav>
          <h1 className="h1">Terms of Service</h1>
        </div>
      </section>
      <section className="band">
        <div className="wrap legal-page">
          <p>[Replace with the terms of service approved by your legal advisor.]</p>
          <h2>Who we are</h2>
          <p>Corevex Solutions is a software company registered with the Pakistan Software Export Board (PSEB).</p>
          <h2>Contact</h2>
          <p>Questions about this page can be sent through the contact page.</p>
        </div>
      </section>
    </>
  );
}
