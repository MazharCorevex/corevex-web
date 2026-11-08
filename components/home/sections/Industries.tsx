import Img from "@/components/ui/Img";
import Accordion from "@/components/interactive/Accordion";

// Industries
export default function Industries() {
  return (
    <section className="band">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="label">Industries</span>
            <h2 className="h2" data-reveal="">
              Built for the way your industry works
            </h2>
          </div>
          <p className="lead" data-reveal="">
            The same engineering standard, shaped around the rules, users and systems of each sector.
          </p>
        </div>
        <Accordion className="acc">
          <button className="acc-item on" aria-expanded="true">
            <span className="bg">
              <Img src="/images/photos/ind-fintech.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
            </span>
            <span className="in">
              <h3>Fintech</h3>
              <p>Payments, wealth dashboards and secure customer portals.</p>
            </span>
          </button>
          <button className="acc-item" aria-expanded="false">
            <span className="bg">
              <Img src="/images/photos/ind-healthcare-clinic.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
            </span>
            <span className="in">
              <h3>Healthcare</h3>
              <p>Booking, patient apps and clinic management systems.</p>
            </span>
          </button>
          <button className="acc-item" aria-expanded="false">
            <span className="bg">
              <Img src="/images/photos/ind-realestate.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
            </span>
            <span className="in">
              <h3>Real estate</h3>
              <p>Listings, CRMs and property management platforms.</p>
            </span>
          </button>
          <button className="acc-item" aria-expanded="false">
            <span className="bg">
              <Img src="/images/photos/ind-education.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
            </span>
            <span className="in">
              <h3>Education</h3>
              <p>Learning platforms, portals and student apps.</p>
            </span>
          </button>
          <button className="acc-item" aria-expanded="false">
            <span className="bg">
              <Img src="/images/photos/ind-logistics.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
            </span>
            <span className="in">
              <h3>Logistics</h3>
              <p>Dispatch, tracking and fleet operations software.</p>
            </span>
          </button>
          <button className="acc-item" aria-expanded="false">
            <span className="bg">
              <Img src="/images/photos/ind-retail.webp" alt="" fill sizes="(max-width: 860px) 100vw, 40vw" />
            </span>
            <span className="in">
              <h3>Retail and eCommerce</h3>
              <p>Stores, inventory and customer support automation.</p>
            </span>
          </button>
        </Accordion>
      </div>
    </section>
  );
}
