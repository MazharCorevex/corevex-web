import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";
import Words from "@/components/ui/Words";
import ContactStepped from "@/components/forms/ContactStepped";

import ContactDetails from "@/components/sections/ContactDetails";

// ContactPage
export default function ContactPage() {
  return (
    <>
      <section className="contact">
        <div className="left">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>Contact</span>
          </nav>
          <Words as="h1" className="h1 words">
            {"Start a software project with Corevex"}
          </Words>
          <p className="lead" style={{ marginTop: "22px" } as CSSProperties} data-reveal="load">
            Tell us what you want to build. A senior engineer reviews every enquiry and replies personally.
          </p>
          <div className="team-avs">
            <div>
              <Img src="/images/team/mazhar-h.webp" alt="Mazhar H" />
              <Img src="/images/team/m-azhar.svg" alt="M Azhar" />
              <Img src="/images/team/zafar-h.webp" alt="Zafar H" />
            </div>
            <span>You will speak with our team</span>
          </div>
          <ul className="c-trust" id="call">
            <li>A senior engineer replies personally</li>
            <li>NDA on request</li>
            <li>You own the code</li>
            <li>{'Prefer to talk? Choose "Book a call" below and we will send a time'}</li>
          </ul>
          <ContactDetails />
        </div>
        <div className="right">
          <ContactStepped />
        </div>
      </section>
    </>
  );
}
