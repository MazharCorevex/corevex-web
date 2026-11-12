"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { apply } from "@/app/actions";
import { track } from "@/lib/analytics";
import { FieldError, FormError, Trap, initial, invalid } from "./shared";
import s from "./forms.module.css";

const MAX = 5 * 1024 * 1024;

// Careers application
export default function CareersForm({ roles, blob }: { roles: string[]; blob: boolean }) {
  const [state, action, pending] = useActionState(apply, initial);
  const [fileErr, setFileErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const sent = state.status === "ok";

  useEffect(() => {
    if (sent) track("form_submit", { form: "careers" });
  }, [sent]);

  function check(f: File | undefined) {
    if (!f) return "";
    if (f.size > MAX) return "Your CV must be 5 MB or smaller.";
    if (f.type !== "application/pdf" && !/\.pdf$/i.test(f.name)) return "Please upload your CV as a PDF.";
    return "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const fd = new FormData(form);
    const file = fd.get("cv") as File | null;
    const err = check(file && file.size ? file : undefined);
    setFileErr(err);
    if (err) return;
    if (blob && file && file.size) {
      try {
        setUploading(true);
        const { upload } = await import("@vercel/blob/client");
        const res = await upload(`cv/${file.name.replace(/[^\w.-]+/g, "_")}`, file, {
          access: "public",
          handleUploadUrl: "/api/cv-upload",
          contentType: "application/pdf",
        });
        fd.delete("cv");
        fd.set("cvUrl", res.url);
      } catch {
        setFileErr("We could not upload your CV. Please try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    startTransition(() => action(fd));
  }

  const busy = pending || uploading;
  const cvErr = fileErr || state.errors?.cv;

  return (
    <form className={`form${sent ? " sent" : ""}`} action={action} onSubmit={onSubmit}>
      <div className="row2 hide-on-sent">
        <div className="field">
          <label htmlFor="a-name">Name</label>
          <input id="a-name" name="name" required autoComplete="name" {...invalid(state, "name")} />
          <FieldError state={state} name="name" />
        </div>
        <div className="field">
          <label htmlFor="a-email">Email</label>
          <input id="a-email" name="email" type="email" required autoComplete="email" {...invalid(state, "email")} />
          <FieldError state={state} name="email" />
        </div>
      </div>
      {roles.length > 0 ? (
        <div className="field hide-on-sent">
          <label htmlFor="a-role">Role</label>
          <select id="a-role" name="role">
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
            <option>Open application</option>
          </select>
        </div>
      ) : (
        <input type="hidden" name="role" value="Open application" />
      )}
      <div className="field hide-on-sent">
        <label htmlFor="a-link">LinkedIn or portfolio</label>
        <input id="a-link" name="link" type="url" placeholder="https://" {...invalid(state, "link")} />
        <FieldError state={state} name="link" />
      </div>
      <div className="field hide-on-sent">
        <label htmlFor="a-cv">CV (PDF, up to 5 MB)</label>
        <input
          id="a-cv"
          name="cv"
          type="file"
          accept="application/pdf,.pdf"
          aria-invalid={cvErr ? true : undefined}
          aria-describedby={cvErr ? "cv-err" : undefined}
          onChange={(e) => setFileErr(check(e.currentTarget.files?.[0]))}
        />
        <span className={cvErr ? s.err : undefined} id="cv-err" aria-live="polite">
          {cvErr}
        </span>
      </div>
      <div className="field hide-on-sent">
        <label htmlFor="a-msg">Message</label>
        <textarea id="a-msg" name="message" />
      </div>
      <Trap />
      {!sent && <FormError state={state} />}
      <button className="btn hide-on-sent" type="submit" disabled={busy}>
        {uploading ? "Uploading CV" : pending ? "Sending" : "Submit application"} <span className="chev">»</span>
      </button>
      <p className="form-ok" role="status">
        {sent ? "Application received. Thank you for your interest in Corevex." : ""}
      </p>
    </form>
  );
}
