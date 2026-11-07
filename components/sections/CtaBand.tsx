import Link from "next/link";

type Props = { title?: string; text?: string; label?: string; href?: string };

// CTA band
export default function CtaBand({
  title = "Have something to build?",
  text = "Tell us what you need. A senior engineer reads every enquiry and replies personally.",
  label = "Start a project",
  href = "/contact/",
}: Props) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div>
          <h2 className="h2">{title}</h2>
          <p>{text}</p>
        </div>
        <Link href={href} className="btn">
          {label} <span className="chev">»</span>
        </Link>
      </div>
    </section>
  );
}
