import type { CSSProperties } from "react";
import Link from "next/link";
import Img from "@/components/ui/Img";

// ai-llm-development
export default function AiLlmDevelopmentBody() {
  return (
    <>
      <section className="band">
        <div className="wrap problem-split">
          <div>
            <span className="label">The challenge</span>
            <p className="big" data-reveal="">
              AI is only useful when it works inside your product.
            </p>
            <p data-reveal="">
              We connect large language models to your data, tools and users, with the guardrails, testing and
              monitoring that production needs.
            </p>
          </div>
          <div className="split-img" data-reveal="">
            <Img src="/images/photos/ai-assistant.webp" alt="" sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <span className="label">What we build</span>
          <h2 className="h2" style={{ marginBottom: "44px" } as CSSProperties}>
            AI features that earn their place
          </h2>
          <div className="bento-b" data-reveal-group="">
            <div className="tile">
              <div className="bg">
                <Img src="/images/photos/ai-ml.webp" alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
              </div>
              <Img src="/images/icons/ai-ml-on-dark.svg" alt="" className="ic" sizes="(max-width: 860px) 100vw, 33vw" />
              <h3>LLM integration</h3>
              <p>Add generative AI features to your existing web or mobile product.</p>
            </div>
            <div className="tile">
              <Img src="/images/icons/ai-ml-on-dark.svg" alt="" className="ic" sizes="(max-width: 860px) 100vw, 33vw" />
              <h3>AI assistants and chatbots</h3>
              <p>Assistants trained on your documents, policies and product data.</p>
            </div>
            <div className="tile">
              <Img
                src="/images/icons/full-stack-on-dark.svg"
                alt=""
                className="ic"
                sizes="(max-width: 860px) 100vw, 33vw"
              />
              <h3>RAG search</h3>
              <p>Search that answers questions from your own knowledge base, with sources.</p>
            </div>
            <div className="tile">
              <Img
                src="/images/icons/custom-software-on-dark.svg"
                alt=""
                className="ic"
                sizes="(max-width: 860px) 100vw, 33vw"
              />
              <h3>Document AI</h3>
              <p>Extract data from invoices, forms and contracts automatically.</p>
            </div>
            <div className="tile">
              <Img
                src="/images/icons/automation-on-dark.svg"
                alt=""
                className="ic"
                sizes="(max-width: 860px) 100vw, 33vw"
              />
              <h3>Machine learning models</h3>
              <p>Forecasting, classification and recommendation models built in Python.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="band mist">
        <div className="wrap">
          <span className="label">How we keep AI reliable</span>
          <div
            className="statements bento-4"
            data-reveal-group=""
            style={{ marginTop: "24px" } as CSSProperties}
          >
            <div>Grounded answers from your own data</div>
            <div>Testing against real examples before launch</div>
            <div>Access controls and data privacy by design</div>
            <div>Monitoring and improvement after release</div>
          </div>
        </div>
      </section>
      <section className="band dark" style={{ background: "var(--ink)" } as CSSProperties}>
        <div className="wrap case-band">
          <div className="shot" data-reveal="">
            <Img
              src="/images/portfolio/brightsmile-ai-receptionist-1600.webp"
              alt="Brightsmile conversation inbox, CRM leads, n8n workflow and website chat assistant"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
          <div>
            <span className="label">Featured design study · Dental</span>
            <h2 className="h2" data-reveal="">
              Brightsmile AI
            </h2>
            <p className="lead" style={{ marginTop: "16px" } as CSSProperties}>
              AI receptionist that answers, qualifies and books patients.
            </p>
            <ul>
              <li>Scoped with a solution architect</li>
              <li>Designed as a working product, web and mobile</li>
              <li>Structured for full code handover</li>
            </ul>
            <Link href="/work/brightsmile-ai-receptionist/" className="btn">
              {"See the design study "}
              <span className="chev">»</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
