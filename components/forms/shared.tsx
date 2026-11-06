"use client";

import { startTransition, useEffect, useState } from "react";
import type { FormState } from "@/app/actions";
import s from "./forms.module.css";

export const initial: FormState = { status: "idle" };

// Spam trap
export function Trap() {
  const [t, setT] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setT(String(Date.now())), 0);
    return () => clearTimeout(id);
  }, []);
  return (
    <>
      <div className={s.trap} aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="t" value={t} />
    </>
  );
}

export function FieldError({ state, name }: { state: FormState; name: string }) {
  const msg = state.errors?.[name];
  if (!msg) return null;
  return (
    <span className={s.err} id={`${name}-err`}>
      {msg}
    </span>
  );
}

export function FormError({ state }: { state: FormState }) {
  if (state.status !== "error" || !state.message) return null;
  return (
    <p className={s.alert} role="alert">
      {state.message}
    </p>
  );
}

export const invalid = (state: FormState, name: string) =>
  state.errors?.[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-err` } : {};

// Submit without auto reset
export function onSubmitWith(dispatch: (fd: FormData) => void) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}
