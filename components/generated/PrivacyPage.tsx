import Link from "next/link";

// PrivacyPage
export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>Privacy Policy</span>
          </nav>
          <h1 className="h1">Privacy Policy</h1>
        </div>
      </section>
      <section className="band">
        <div className="wrap legal-page">
          <p>[Replace with the privacy policy approved by your legal advisor.]</p>
          <h2>Who we are</h2>
          <p>Corevex Solutions is a software company registered with the Pakistan Software Export Board (PSEB).</p>
          <h2>Contact</h2>
          <p>Questions about this page can be sent through the contact page.</p>
        </div>
      </section>
    </>
  );
}
