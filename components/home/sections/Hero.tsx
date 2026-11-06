import Link from "next/link";
import BookCall from "@/components/booking/BookCall";
import Words from "@/components/ui/Words";
import HeroArt from "@/components/home/HeroArt";

// Hero
export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-copy">
          <span className="label">Custom software · SaaS · AI agents</span>
          <Words as="p" className="display words" br={2} aria-hidden="true">
            {"Engineered at the Core."}
          </Words>
          <h1 className="seo-h1">Custom software, AI and mobile app development for growing businesses</h1>
          <p className="lead" data-reveal="load">
            We design, build and hand over the software your business runs on: web platforms, SaaS products, mobile apps
            and AI agents that do real work.
          </p>
          <div className="btns" data-reveal="load">
            <Link href="/contact/" className="btn">
              {"Start a project "}
              <span className="chev">»</span>
            </Link>
            <BookCall className="btn btn-ghost">Book a 30-minute call</BookCall>
          </div>
          <div className="proof" data-reveal="load">
            <span>PSEB registered</span>
            <span>Founded 2022</span>
            <span>50+ engineers</span>
          </div>
        </div>
        <HeroArt />
      </div>
    </section>
  );
}
