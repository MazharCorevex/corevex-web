"use client";

import { useActionState, useEffect } from "react";
import { subscribe } from "@/app/actions";
import { track } from "@/lib/analytics";
import { Trap, initial, onSubmitWith } from "./shared";
import s from "./forms.module.css";

export default function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, initial);
  useEffect(() => {
    if (state.status === "ok") track("newsletter_subscribe");
  }, [state.status]);
  const sent = state.status === "ok";
  return (
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
  );
}
