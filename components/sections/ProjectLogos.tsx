import Link from "next/link";
import type { CSSProperties } from "react";
import { getCaseStudies } from "@/lib/content";

// Brand marks taken from each project board
const BRAND: Record<string, { mark: string; color: string; ink?: string }> = {
  "australian-direct-tutoring": { mark: "ADT", color: "#2453D5" },
  "northgate-ap-autopilot": { mark: "NG", color: "#2F6FEB" },
  "apex-voice-receptionist": { mark: "AV", color: "#6A4CF5" },
  "highstreet-content-planning": { mark: "H", color: "#1E5B3A" },
  "brightsmile-ai-receptionist": { mark: "B", color: "#F26B4F", ink: "#2B0F08" },
  "mary-properties": { mark: "MP", color: "#1F4D3A" },
  "voltway-ev-charging-app": { mark: "V", color: "#B8E62E", ink: "#1A2B12" },
  "orbit-money-finance-app": { mark: "O", color: "#5B5BF0" },
  "lumen-learning-app": { mark: "L", color: "#3D5AFE" },
  "dose-medication-app": { mark: "D", color: "#2AA59A", ink: "#062824" },
  "nimbus-flight-companion-app": { mark: "N", color: "#1570D6" },
  "aura-home-smart-home-app": { mark: "A", color: "#F39C12", ink: "#2B1A02" },
};

// Portfolio logo marquee
export default async function ProjectLogos() {
  const cases = await getCaseStudies();
  if (!cases.length) return null;
  const set = (copy: boolean) =>
    cases.map((c) => {
      const b = BRAND[c.slug] ?? { mark: c.name.charAt(0), color: "#262B47" };
      return (
        <Link
          key={`${copy ? "b" : "a"}-${c.slug}`}
          href={`/work/${c.slug}/`}
          className="mq-logo"
          style={{ "--brand": b.color, "--ink": b.ink ?? "#fff" } as CSSProperties}
          tabIndex={copy ? -1 : undefined}
          aria-hidden={copy || undefined}
        >
          <span className="mq-mark" aria-hidden="true">
            {b.mark}
          </span>
          <span className="mq-name">{c.name}</span>
        </Link>
      );
    });
  return (
    <section className="marquee mq-projects" aria-label="Selected work from our portfolio">
      <p className="marquee-title">Selected work from our portfolio</p>
      <div className="marquee-track">
        {set(false)}
        <span className="mq-copy">{set(true)}</span>
      </div>
    </section>
  );
}
