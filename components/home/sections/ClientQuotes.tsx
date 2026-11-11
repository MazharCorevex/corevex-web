import QuoteSlider from "@/components/home/QuoteSlider";
import { getTestimonials } from "@/lib/content";

// What clients say, hidden until there are quotes
export default async function ClientQuotes() {
  const items = (await getTestimonials()).filter((t) => !t.caseStudy);
  if (!items.length) return null;
  return (
    <section className="band" aria-labelledby="client-quotes">
      <div className="wrap">
        <span className="label">Client feedback</span>
        <h2 className="h2" id="client-quotes" data-reveal="" style={{ marginBottom: 40 }}>
          What clients say
        </h2>
        <QuoteSlider items={items} />
      </div>
    </section>
  );
}
