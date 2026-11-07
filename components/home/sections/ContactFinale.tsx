import QuickContact from "@/components/forms/QuickContact";

// ContactFinale
export default function ContactFinale() {
  return (
    <section className="finale" id="start">
      <div className="wrap">
        <div>
          <span className="label">Contact</span>
          <h2 className="h2">Have something to build?</h2>
          <p className="lead">
            Tell us about your idea, product or problem. A senior engineer reads every enquiry and replies personally.
          </p>
        </div>
        <QuickContact />
      </div>
    </section>
  );
}
