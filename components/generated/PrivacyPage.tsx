import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

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
          <h2>Who we are</h2>
          <p>Corevex Solutions is a software company registered with the Pakistan Software Export Board (PSEB).</p>
          <h2>What we collect</h2>
          <p>
            When you contact us, apply for a role or subscribe to our newsletter, we collect the details you enter in the
            form: for example your name, email address, company, country, your message and, for job applications, your CV.
          </p>
          <p>
            If analytics are enabled, we collect anonymous usage data such as pages visited and how far you scroll, so we
            can improve the site.
          </p>
          <h2>How we use it</h2>
          <p>
            We use your details only to reply to your enquiry, assess your application or send the newsletter you asked
            for. We do not sell your data.
          </p>
          <h2>Services we use</h2>
          <p>
            We use trusted providers to run this site: Vercel for hosting, Resend to send email, Sanity to manage site
            content, Calendly when you book a call and, if enabled, Google Analytics. Each provider processes data only
            to deliver its service to us.
          </p>
          <h2>How long we keep it</h2>
          <p>
            We keep enquiries and applications only as long as needed for the purpose they were sent for. You can
            unsubscribe from the newsletter at any time using the link in every email.
          </p>
          <h2>Your choices</h2>
          <p>You can ask us to see, correct or delete the personal data we hold about you.</p>
          <h2>Contact</h2>
          <p>
            Questions about this page can be sent through the <Link href="/contact/">contact page</Link>
            {CONTACT_EMAIL ? (
              <>
                {" "}
                or to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </>
            ) : null}
            .
          </p>
        </div>
      </section>
    </>
  );
}
