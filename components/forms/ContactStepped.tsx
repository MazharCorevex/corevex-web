"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact } from "@/app/actions";
import { track } from "@/lib/analytics";
import { FieldError, FormError, Trap, initial, invalid, onSubmitWith } from "./shared";
import { OFFERS, offer } from "@/lib/offers";

const NEEDS = ["Custom software", "Web app", "Mobile app", "AI or LLM", "Automation", "Dedicated team", "Book a 30-minute call"];
const STEPS = ["need", "details", "contact"];
// The need that fits each offer
const OFFER_NEED: Record<string, string> = {
  "landing-page": "Web app",
  website: "Web app",
  "dedicated-developer": "Dedicated team",
  "saas-platform": "Custom software",
  "ai-agent": "Automation",
};

// Contact form in three steps
export default function ContactStepped() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLFormElement>(null);
  const sent = state.status === "ok";

  // Prefill the offer from ?offer= and tick the matching need
  useEffect(() => {
    const o = offer(new URLSearchParams(window.location.search).get("offer"));
    const form = ref.current;
    if (!o || !form) return;
    const sel = form.querySelector<HTMLSelectElement>("#c-offer");
    if (sel) sel.value = o.slug;
    const need = form.querySelector<HTMLInputElement>(`input[name="need"][value="${OFFER_NEED[o.slug]}"]`);
    if (need) need.checked = true;
  }, []);

  useEffect(() => {
    if (sent) track("form_submit", { form: "contact" });
  }, [sent]);

  const [lastErrors, setLastErrors] = useState(state.errors);
  if (state.errors !== lastErrors) {
    setLastErrors(state.errors);
    if (state.errors?.details) setStep(1);
    else if (state.errors) setStep(2);
  }

  function valid(i: number) {
    const box = ref.current?.querySelectorAll<HTMLElement>(".fstep")[i];
    if (!box) return true;
    const bad = Array.from(box.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input,textarea,select")).find(
      (f) => !f.checkValidity(),
    );
    if (bad) {
      bad.reportValidity();
      return false;
    }
    return true;
  }

  function go(n: number) {
    setStep(n);
    track("form_step", { form: "contact", step: STEPS[n] });
    requestAnimationFrame(() => {
      ref.current?.querySelectorAll<HTMLElement>(".fstep")[n]?.querySelector<HTMLElement>("input,textarea,button")?.focus();
    });
  }

  const submit = onSubmitWith(action);

  return (
    <form
      ref={ref}
      action={action}
      className={`form${sent ? " sent" : ""}`}
      style={{ background: "transparent", border: 0, padding: 0, backdropFilter: "none" }}
      onSubmit={(e) => {
        for (let k = 0; k < STEPS.length; k++) {
          if (!valid(k)) {
            e.preventDefault();
            setStep(k);
            requestAnimationFrame(() => valid(k));
            return;
          }
        }
        submit(e);
      }}
      noValidate
    >
      <input type="hidden" name="source" value="contact" />
      <div className="stepper hide-on-sent" aria-hidden="true">
        {STEPS.map((s, i) => (
          <i key={s} className={i <= step ? "on" : undefined} />
        ))}
      </div>
      <p className="sr" aria-live="polite">
        {sent ? "" : `Step ${step + 1} of 3`}
      </p>
      <fieldset className={`fstep${step === 0 ? " on" : ""} hide-on-sent`} style={{ border: 0, padding: 0, minWidth: 0 }}>
        <legend className="sr">What do you need?</legend>
        <h2 aria-hidden="true">What do you need?</h2>
        <div className="choice">
          {NEEDS.map((n, i) => (
            <label key={n}>
              <input type="radio" name="need" value={n} defaultChecked={i === 0} />
              <span>{n}</span>
            </label>
          ))}
        </div>
        <div className="field offer-field">
          <label htmlFor="c-offer">Offer</label>
          <select id="c-offer" name="offer" defaultValue="">
            <option value="">No specific offer</option>
            {OFFERS.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="fnav">
          <button className="btn" type="button" onClick={() => valid(0) && go(1)}>
            Next <span className="chev">»</span>
          </button>
        </div>
      </fieldset>
      <div className={`fstep${step === 1 ? " on" : ""} hide-on-sent`}>
        <h2>Tell us about the project</h2>
        <div className="field">
          <label htmlFor="c-goal">Goals, users and current tools</label>
          <textarea id="c-goal" name="details" required {...invalid(state, "details")} />
          <FieldError state={state} name="details" />
        </div>
        <div className="fnav">
          <button className="btn btn-ghost" type="button" onClick={() => go(0)}>
            Back
          </button>
          <button className="btn" type="button" onClick={() => valid(1) && go(2)}>
            Next <span className="chev">»</span>
          </button>
        </div>
      </div>
      <div className={`fstep${step === 2 ? " on" : ""} hide-on-sent`}>
        <h2>How can we reach you?</h2>
        <div className="row2">
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input id="c-name" name="name" required autoComplete="name" {...invalid(state, "name")} />
            <FieldError state={state} name="name" />
          </div>
          <div className="field">
            <label htmlFor="c-email">Work email</label>
            <input id="c-email" name="email" type="email" required autoComplete="email" {...invalid(state, "email")} />
            <FieldError state={state} name="email" />
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="c-co">Company</label>
            <input id="c-co" name="company" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="c-country">Country</label>
            <input id="c-country" name="country" autoComplete="country-name" />
          </div>
        </div>
        <Trap />
        {!sent && <FormError state={state} />}
        <div className="fnav">
          <button className="btn btn-ghost" type="button" onClick={() => go(1)}>
            Back
          </button>
          <button className="btn" type="submit" disabled={pending}>
            {pending ? "Sending" : "Send my project details"} <span className="chev">»</span>
          </button>
        </div>
      </div>
      <p className="form-ok" role="status">
        {sent ? "Thank you. Your details are with our team and a business manager will be in touch." : ""}
      </p>
    </form>
  );
}
