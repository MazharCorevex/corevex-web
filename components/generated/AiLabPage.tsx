import type { CSSProperties } from "react";
import Link from "next/link";
import Words from "@/components/ui/Words";
import Demo from "@/components/interactive/Demo";

// AiLabPage
export default function AiLabPage() {
  return (
    <>
      <section
        className="page-hero"
        style={
          {
            background:
              "linear-gradient(90deg,rgba(13,16,34,.95),rgba(13,16,34,.4)),url(/images/photos/ai-abstract.webp) center/cover",
          } as CSSProperties
        }
      >
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>AI Lab</span>
          </nav>
          <Words as="h1" className="h1 words" style={{ maxWidth: "16ch" }}>
            {"AI Lab: working AI demos you can try"}
          </Words>
          <p className="lead" data-reveal="load">
            See what our AI and LLM engineers build, in real time. Every demo here can be tailored to your business.
          </p>
        </div>
      </section>
      <section className="band dark" style={{ background: "var(--ink)" } as CSSProperties}>
        <div className="wrap">
          <Demo kind="extract" className="console">
            <div className="screen">
              <div className="bar">
                <i />
                <i />
                <i />
              </div>
              <div className="body">
                <div className="extract">
                  <div className="doc">
                    <b>INVOICE INV-88213</b>
                    <br />
                    Atlas Industrial Supply Ltd.
                    <br />
                    Bill to: Northwind Foods Inc.
                    <br />
                    Date: 04 Nov 2026
                    <br />
                    <br />
                    Steel brackets, 40mm: $960.00
                    <br />
                    Hydraulic hose kit: $1,008.00
                    <br />
                    Safety gloves: $555.00
                    <br />
                    Freight: $140.00
                    <br />
                    <br />
                    <b>Total $3,195.60</b>
                  </div>
                  <div className="fields">
                    <div className="on">
                      <span>Supplier: Atlas Industrial Supply</span>
                      <em>99.1%</em>
                    </div>
                    <div className="on">
                      <span>Invoice no: INV-88213</span>
                      <em>99.8%</em>
                    </div>
                    <div className="on">
                      <span>Date: 2026-11-04</span>
                      <em>98.7%</em>
                    </div>
                    <div className="on">
                      <span>Customer: Northwind Foods</span>
                      <em>97.9%</em>
                    </div>
                    <div className="on">
                      <span>Total: $3,195.60</span>
                      <em>99.4%</em>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="label">Demo 1 · Document AI</span>
              <h2 className="h2">Turn invoices into clean data</h2>
              <p className="lead" style={{ margin: "18px 0 28px" } as CSSProperties}>
                Watch the fields get extracted with a confidence score, ready to sync to your ERP.
              </p>
              <button className="btn" type="button">
                {"Try document extraction "}
                <span className="chev">»</span>
              </button>
            </div>
          </Demo>
          <Demo kind="chat" className="console">
            <div className="screen">
              <div className="bar">
                <i />
                <i />
                <i />
              </div>
              <div className="body">
                <div className="chat" style={{ maxHeight: "280px", overflowY: "auto" } as CSSProperties}>
                  <div className="msg ai">
                    Hi, I am a sample support agent trained on a demo knowledge base. Ask about refunds, shipping or
                    pricing.
                  </div>
                </div>
                <form className="chat-in">
                  <label className="sr" htmlFor="chatq">
                    Your question
                  </label>
                  <input id="chatq" placeholder="How long does shipping take?" />
                  <button className="btn btn-sm" type="submit">
                    Ask
                  </button>
                </form>
              </div>
            </div>
            <div>
              <span className="label">Demo 2 · Support agent</span>
              <h2 className="h2">An assistant that answers with sources</h2>
              <p className="lead" style={{ marginTop: "18px" } as CSSProperties}>
                Ask a question and get an answer drawn from a sample knowledge base, with the source it used.
              </p>
            </div>
          </Demo>
          <Demo kind="flow" className="console">
            <div className="screen">
              <div className="bar">
                <i />
                <i />
                <i />
              </div>
              <div className="body">
                <div className="flow">
                  <div>
                    <i />
                    New support email received
                  </div>
                  <div>
                    <i />
                    AI classifies intent and urgency
                  </div>
                  <div>
                    <i />
                    Answer drafted from knowledge base
                  </div>
                  <div>
                    <i />
                    Ticket created and CRM updated
                  </div>
                  <div>
                    <i />
                    Customer receives a reply
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="label">Demo 3 · Workflow automation</span>
              <h2 className="h2">Watch a request run itself</h2>
              <p className="lead" style={{ margin: "18px 0 28px" } as CSSProperties}>
                Trigger a sample request and see it move through an automated workflow, step by step.
              </p>
              <button className="btn" type="button">
                {"Run the workflow "}
                <span className="chev">»</span>
              </button>
            </div>
          </Demo>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap">
          <div>
            <h2 className="h2">Want this in your product?</h2>
            <p>We tailor every demo to your data, tools and users.</p>
          </div>
          <Link href="/contact/" className="btn">
            {"Start a project "}
            <span className="chev">»</span>
          </Link>
        </div>
      </section>
    </>
  );
}
