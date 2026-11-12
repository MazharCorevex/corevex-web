"use client";

import { useActionState, useEffect } from "react";
import { submitContact } from "@/app/actions";
import { track } from "@/lib/analytics";
import { FieldError, FormError, Trap, initial, invalid, onSubmitWith } from "./shared";

// Contact finale form
export default function QuickContact({ source = "home" }: { source?: string }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const sent = state.status === "ok";
  useEffect(() => {
    if (sent) track("form_submit", { form: source });
  }, [sent, source]);
  return (
    <form className={`form${sent ? " sent" : ""}`} action={action} onSubmit={onSubmitWith(action)}>
      <input type="hidden" name="source" value={source} />
      <div className="hide-on-sent row2">
        <div className="field">
          <label htmlFor="f-name">Name</label>
          <input id="f-name" name="name" required autoComplete="name" {...invalid(state, "name")} />
          <FieldError state={state} name="name" />
        </div>
        <div className="field">
          <label htmlFor="f-email">Work email</label>
          <input id="f-email" name="email" type="email" required autoComplete="email" {...invalid(state, "email")} />
          <FieldError state={state} name="email" />
        </div>
      </div>
      <div className="field hide-on-sent">
        <label htmlFor="f-co">Company</label>
        <input id="f-co" name="company" autoComplete="organization" />
      </div>
      <div className="field hide-on-sent">
        <label htmlFor="f-need">What do you need?</label>
        <select id="f-need" name="need">
          <option>Custom software</option>
          <option>Web app</option>
          <option>Mobile app</option>
          <option>AI or LLM</option>
          <option>Automation</option>
          <option>Dedicated team</option>
        </select>
      </div>
      <div className="field hide-on-sent">
        <label htmlFor="f-msg">Project details</label>
        <textarea id="f-msg" name="details" required {...invalid(state, "details")} />
        <FieldError state={state} name="details" />
      </div>
      <Trap />
      {!sent && <FormError state={state} />}
      <button className="btn hide-on-sent" type="submit" disabled={pending}>
        {pending ? "Sending" : "Send my project details"} <span className="chev">»</span>
      </button>
      <p className="form-ok" role="status">
        {sent ? "Thank you. Your details are with our team and a business manager will be in touch." : ""}
      </p>
    </form>
  );
}
