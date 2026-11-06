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
          <h2>Who we are</h2>
          <p>Corevex Solutions is a software company registered with the Pakistan Software Export Board (PSEB).</p>
          <h2>Using this site</h2>
          <p>
            This website gives general information about Corevex Solutions and our services. Nothing on it is a binding
            offer. Every engagement is covered by its own written agreement.
          </p>
          <h2>Content</h2>
          <p>
            Articles and design studies on this site are for information only. Projects marked Product design study show
            our capabilities and are not client work.
          </p>
          <h2>Intellectual property</h2>
          <p>
            The Corevex name, logo, text and images on this site belong to Corevex Solutions unless stated otherwise.
            Please do not reuse them without permission.
          </p>
          <h2>Links</h2>
          <p>We are not responsible for the content of other websites linked from this site.</p>
          <h2>Contact</h2>
          <p>
            Questions about this page can be sent through the <Link href="/contact/">contact page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
