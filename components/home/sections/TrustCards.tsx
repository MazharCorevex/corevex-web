import Img from "@/components/ui/Img";

// TrustCards
export default function TrustCards() {
  return (
    <section className="band">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="label">Working with Corevex</span>
            <h2 className="h2" data-reveal="">
              What you can count on
            </h2>
          </div>
          <p className="lead" data-reveal="">
            Four commitments that come with every engagement, from the first call to the final handover.
          </p>
        </div>
        <div className="trust" data-reveal-group="">
          <div>
            <span className="ib">
              <Img src="/images/icons/custom-software.svg" alt="" />
            </span>
            <b>PSEB registered</b>
            <p>A registered software company with the Pakistan Software Export Board.</p>
          </div>
          <div>
            <span className="ib">
              <Img src="/images/icons/full-stack.svg" alt="" />
            </span>
            <b>You own the code</b>
            <p>Source code, documentation and access are handed over in full.</p>
          </div>
          <div>
            <span className="ib">
              <Img src="/images/icons/automation.svg" alt="" />
            </span>
            <b>NDA on request</b>
            <p>Share your idea safely. We sign an NDA before details are discussed.</p>
          </div>
          <div>
            <span className="ib">
              <Img src="/images/icons/web-mobile.svg" alt="" />
            </span>
            <b>Reply in one business day</b>
            <p>A senior engineer reviews every enquiry and replies personally.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
