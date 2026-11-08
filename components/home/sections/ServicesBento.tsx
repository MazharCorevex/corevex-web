import Link from "next/link";
import Img from "@/components/ui/Img";
import GearsVideo from "@/components/home/GearsVideo";

// ServicesBento
export default function ServicesBento() {
  return (
    <section className="band dark svc-band">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="label">Services</span>
            <h2 className="h2" data-reveal="">
              Software, SaaS, mobile and AI agents under one roof
            </h2>
          </div>
          <p className="lead" data-reveal="">
            One senior team takes you from idea to launch, so nothing gets lost between vendors, handoffs or time zones.
          </p>
        </div>
        <div className="bento" data-reveal-group="">
          <Link href="/services/custom-software-development/" className="tile t-wide">
            <div className="bg">
              <Img src="/images/photos/custom-software.webp" alt="" fill sizes="(max-width: 860px) 100vw, 66vw" />
            </div>
            <Img
              src="/images/icons/custom-software-on-dark.svg"
              alt=""
              className="ic"
              sizes="(max-width: 860px) 100vw, 66vw"
            />
            <h3>Custom Software Development</h3>
            <p>Software shaped around how your business actually works.</p>
            <div className="reveal">
              <span className="chip">Internal tools</span>
              <span className="chip">Client portals</span>
              <span className="chip">SaaS platforms</span>
            </div>
          </Link>
          <Link href="/services/full-stack-development/" className="tile ">
            <div className="bg">
              <Img src="/images/photos/pair-programming.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
            </div>
            <Img
              src="/images/icons/full-stack-on-dark.svg"
              alt=""
              className="ic"
              sizes="(max-width: 860px) 100vw, 33vw"
            />
            <h3>Full-Stack Development</h3>
            <p>Web products built to scale from day one.</p>
            <div className="reveal">
              <span className="chip">React and Next.js</span>
              <span className="chip">Node.js and .NET</span>
              <span className="chip">APIs</span>
            </div>
          </Link>
          <Link href="/services/mobile-app-development/" className="tile ">
            <div className="bg">
              <Img src="/images/photos/mobile-in-hand.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
            </div>
            <Img
              src="/images/icons/web-mobile-on-dark.svg"
              alt=""
              className="ic"
              sizes="(max-width: 860px) 100vw, 33vw"
            />
            <h3>Mobile App Development</h3>
            <p>iOS and Android apps people keep using.</p>
            <div className="reveal">
              <span className="chip">React Native</span>
              <span className="chip">Flutter</span>
              <span className="chip">App store launch</span>
            </div>
          </Link>
          <Link href="/services/ai-llm-development/" className="tile t-ai">
            <div className="bg">
              <Img src="/images/photos/ai-assistant.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
            </div>
            <Img src="/images/icons/ai-ml-on-dark.svg" alt="" className="ic" sizes="(max-width: 860px) 100vw, 33vw" />
            <h3>AI and LLM Development</h3>
            <p>AI that does real work inside your product.</p>
            <div className="reveal">
              <span className="chip">LLM features</span>
              <span className="chip">AI assistants</span>
              <span className="chip">RAG search</span>
            </div>
          </Link>
          <Link href="/services/ai-automation/" className="tile t-strip t-gears">
            <div className="bg bg-gears">
              <GearsVideo />
            </div>
            <Img
              src="/images/icons/automation-on-dark.svg"
              alt=""
              className="ic"
              sizes="(max-width: 860px) 100vw, 33vw"
            />
            <h3>AI Automation and Agents</h3>
            <p>Remove the manual work from your operations.</p>
            <div className="reveal">
              <span className="chip">AI agents</span>
              <span className="chip">Workflow automation</span>
              <span className="chip">Integrations</span>
            </div>
          </Link>
          <Link href="/services/saas-app-development/" className="tile t-half">
            <div className="bg">
              <Img src="/images/photos/saas-dashboard.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
            </div>
            <Img src="/images/icons/saas-on-dark.svg" alt="" className="ic" sizes="(max-width: 860px) 100vw, 33vw" />
            <h3>SaaS App Development</h3>
            <p>Subscription products built to launch, sell and scale.</p>
            <div className="reveal">
              <span className="chip">Multi-tenant</span>
              <span className="chip">Subscriptions and billing</span>
              <span className="chip">Admin panels</span>
            </div>
          </Link>
          <Link href="/services/ai-agents-as-a-service/" className="tile t-half">
            <div className="bg">
              <Img src="/images/photos/aaas-console.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
            </div>
            <Img src="/images/icons/aaas-on-dark.svg" alt="" className="ic" sizes="(max-width: 860px) 100vw, 33vw" />
            <h3>AI Agents as a Service</h3>
            <p>Managed AI agents that do real work for your team.</p>
            <div className="reveal">
              <span className="chip">Support agents</span>
              <span className="chip">Sales agents</span>
              <span className="chip">Operations agents</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
