import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";

// mobile-app-development
export default function MobileAppDevelopmentBody() {
  return (
    <>
      <section className="band">
        <div className="wrap">
          <span className="label">What we build</span>
          <h2 className="h2" style={{ marginBottom: "44px" } as CSSProperties}>
            Apps for customers, teams and connected products
          </h2>
        </div>
        <div className="swipe" tabIndex={0} role="region" aria-label="App screens, scroll sideways for more">
          <figure>
            <div className="shot">
              <Img
                src="/images/portfolio/orbit-money-finance-app-1600.webp"
                alt="Orbit Money personal finance app screens"
                style={{ objectPosition: "85% 50%" } as CSSProperties}
                sizes="(max-width: 860px) 85vw, 400px"
              />
            </div>
            <figcaption>
              <b>Customer apps</b>
              <span>Booking, ordering, loyalty and account apps your customers open every day.</span>
            </figcaption>
          </figure>
          <figure>
            <div className="shot">
              <Img
                src="/images/portfolio/lumen-learning-app-2-1600.webp"
                alt="Lumen teacher class dashboard and student progress screens"
                style={{ objectPosition: "85% 50%" } as CSSProperties}
                sizes="(max-width: 860px) 85vw, 400px"
              />
            </div>
            <figcaption>
              <b>Business apps</b>
              <span>Field service, sales and operations apps for teams on the move.</span>
            </figcaption>
          </figure>
          <figure>
            <div className="shot">
              <Img
                src="/images/portfolio/aura-home-smart-home-app-1600.webp"
                alt="Aura Home app controlling connected devices"
                style={{ objectPosition: "85% 50%" } as CSSProperties}
                sizes="(max-width: 860px) 85vw, 400px"
              />
            </div>
            <figcaption>
              <b>Connected apps</b>
              <span>Apps that work with your web platform, payments, maps and devices.</span>
            </figcaption>
          </figure>
          <figure>
            <div className="shot">
              <Img
                src="/images/photos/mobile-in-hand.webp"
                alt="Hand holding a smartphone showing a fitness mobile app"
                sizes="(max-width: 860px) 85vw, 400px"
              />
            </div>
            <figcaption>
              <b>MVP apps</b>
              <span>A focused first version to validate your idea with real users.</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="band light">
        <div className="wrap">
          <span className="label">React Native or Flutter</span>
          <h2 className="h2" data-reveal="" style={{ marginBottom: "40px" } as CSSProperties}>
            The right framework for your app
          </h2>
          <div className="compare">
            <div>
              <h3>React Native</h3>
              <p>
                Best when your team already uses React and JavaScript or TypeScript, and the app shares logic with a web
                product.
              </p>
            </div>
            <div>
              <h3>Flutter</h3>
              <p>Best for highly custom interfaces and consistent visuals across platforms.</p>
            </div>
          </div>
          <p className="note" style={{ fontSize: "16px", marginTop: "30px" } as CSSProperties}>
            Not sure which fits? Our solution architect will recommend the right one for your product.
          </p>
        </div>
      </section>
      <section className="band mist">
        <div className="wrap">
          <span className="label">From idea to app store</span>
          <h2 className="h2" style={{ marginBottom: "56px" } as CSSProperties}>
            Five stages, one team
          </h2>
          <div className="timeline">
            <div>
              <b>Discovery</b>
              <span>Goals, users and features.</span>
            </div>
            <div>
              <b>UI/UX design</b>
              <span>Screens you can click through.</span>
            </div>
            <div>
              <b>Development</b>
              <span>iOS and Android from one codebase.</span>
            </div>
            <div>
              <b>QA on real devices</b>
              <span>Tested before release.</span>
            </div>
            <div>
              <b>Store launch and updates</b>
              <span>Published and maintained.</span>
            </div>
          </div>
        </div>
      </section>
      <section className="band dark" style={{ background: "var(--ink)" } as CSSProperties}>
        <div className="wrap case-band">
          <div className="shot" data-reveal="">
            <Img
              src="/images/portfolio/voltway-ev-charging-app-1600.webp"
              alt="Voltway onboarding, charger map, charger details, wallet and live charging session screens"
              sizes="(max-width: 860px) 85vw, 400px"
            />
          </div>
          <div>
            <span className="label">Featured design study · EV charging</span>
            <h2 className="h2" data-reveal="">
              Voltway
            </h2>
            <p className="lead" style={{ marginTop: "16px" } as CSSProperties}>
              EV charging app to find fast chargers, start a session and pay in one tap.
            </p>
            <ul>
              <li>Scoped with a solution architect</li>
              <li>Designed as a working product, web and mobile</li>
              <li>Structured for full code handover</li>
            </ul>
            <Link href="/work/voltway-ev-charging-app/" className="btn">
              {"See the design study "}
              <span className="chev">»</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
