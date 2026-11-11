"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribe } from "@/app/actions";
import { track } from "@/lib/analytics";
import { Trap, initial, onSubmitWith } from "./shared";
import s from "./forms.module.css";

export default function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, initial);
  const sent = state.status === "ok";
  const [dismissed, setDismissed] = useState(false);
  const toast = sent && !dismissed;

  // Success popup, closes on its own after a few seconds
  useEffect(() => {
    if (!sent) return;
    track("newsletter_subscribe");
    const t = setTimeout(() => setDismissed(true), 6000);
    return () => clearTimeout(t);
  }, [sent]);

  return (
    <>
      <form className={`news${sent ? " sent" : ""}`} action={action} onSubmit={onSubmitWith(action)}>
        <div className="news-copy">
          <b>Practical notes on software and AI</b>
          <p>One short email a month from our engineers. No spam.</p>
        </div>
        {!sent && (
          <>
            <label className="sr" htmlFor="nl">
              Email
            </label>
            <input id="nl" name="email" type="email" required placeholder="Your work email" autoComplete="email" />
            <Trap />
            <button className="btn btn-sm" type="submit" disabled={pending}>
              {pending ? "Subscribing" : "Subscribe"}
            </button>
          </>
        )}
        <span className="form-ok" role="status" style={sent ? { display: "block" } : undefined}>
          {sent ? "Subscribed. Thank you." : ""}
        </span>
        {state.status === "error" && (
          <span className={s.newsErr} role="alert">
            {state.message}
          </span>
        )}
      </form>
      <div className={`news-toast${toast ? " on" : ""}`} aria-hidden={!toast}>
        <span className="news-toast-ic" aria-hidden="true">
          ✓
        </span>
        <div>
          <b>You are subscribed. Thank you.</b>
          <span>Look out for practical notes from our engineers in your inbox.</span>
        </div>
        <button type="button" className="news-toast-x" aria-label="Close" tabIndex={toast ? 0 : -1} onClick={() => setDismissed(true)}>
          ×
        </button>
      </div>
    </>
  );
}
