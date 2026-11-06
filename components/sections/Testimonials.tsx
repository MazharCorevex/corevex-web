import { getTestimonials } from "@/lib/content";

// Testimonials, hidden until approved ones exist
export default async function Testimonials({ caseStudy }: { caseStudy?: string }) {
  const all = await getTestimonials();
  const list = caseStudy ? all.filter((t) => t.caseStudy === caseStudy) : all;
  if (!list.length) return null;
  return (
    <div className="cs-block" style={{ border: 0 }}>
      <span className="label">What the client said</span>
      <div className="quotes">
        {list.slice(0, 1).map((t) => (
          <figure key={t.name} className="quote on">
            <blockquote>{t.quote}</blockquote>
            <figcaption className="who">
              <i aria-hidden="true" />
              <div>
                <b>{t.name}</b>
                <span>{[t.role, t.company].filter(Boolean).join(", ")}</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
