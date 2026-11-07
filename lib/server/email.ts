import "server-only";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";

// Test mode never sends real email
export const TEST_MODE = process.env.TEST_MODE === "true";
type Sent = { kind: "email" | "contact"; to?: string | string[]; subject?: string; html?: string; email?: string; attachments?: number };
const g = globalThis as unknown as { __outbox?: Sent[] };
export const outbox = () => (g.__outbox ??= []);
const mock = {
  emails: {
    send: async (m: { to: string | string[]; subject: string; html: string; attachments?: unknown[] }) => {
      outbox().push({ kind: "email", to: m.to, subject: m.subject, html: m.html, attachments: m.attachments?.length ?? 0 });
      return { data: { id: "test" }, error: null };
    },
  },
  contacts: {
    create: async (c: { email: string }) => {
      outbox().push({ kind: "contact", email: c.email });
      return { data: { id: "test" }, error: null };
    },
  },
} as unknown as Resend;

const key = process.env.RESEND_API_KEY;
const resend = TEST_MODE ? mock : key ? new Resend(key) : null;
const FROM = process.env.CONTACT_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "Corevex Solutions <onboarding@resend.dev>";
const TO = TEST_MODE ? "team@test.local" : process.env.CONTACT_TO_EMAIL;

export const emailConfigured = () => Boolean(resend && TO);

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Branded layout
export function branded(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#F6F7F9;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1C2133">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F7F9;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #E3E6EC">
<tr><td style="background:#262B47;padding:28px 32px"><img src="${SITE_URL}/images/logo/corevex-logo-email.png" alt="Corevex Solutions" width="180" style="display:block;height:auto;border:0"></td></tr>
<tr><td style="height:4px;background:#48AC9F;line-height:4px;font-size:0">&nbsp;</td></tr>
<tr><td style="padding:32px">
<h1 style="font-family:Montserrat,Segoe UI,Arial,sans-serif;font-weight:600;font-size:24px;line-height:1.25;color:#262B47;margin:0 0 16px">${title}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid #E3E6EC;font-size:13px;color:#6B7285">Corevex Solutions · Engineered at the Core.<br><a href="${SITE_URL}" style="color:#2E8579;text-decoration:none">${SITE_URL.replace(/^https?:\/\//, "")}</a></td></tr>
</table></td></tr></table></body></html>`;
}

export const p = (t: string) => `<p style="font-size:16px;line-height:1.6;margin:0 0 14px;color:#4B5163">${t}</p>`;

export function rows(fields: Record<string, string | undefined>) {
  const r = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;font-size:14px;color:#6B7285;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;font-size:15px;color:#1C2133;white-space:pre-wrap">${esc(v!)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${r}</table>`;
}

type Attachment = { filename: string; content?: Buffer; path?: string };

export async function sendNotification(subject: string, html: string, replyTo?: string, attachments?: Attachment[]) {
  if (!resend || !TO) throw new Error("email-not-configured");
  const { error } = await resend.emails.send({ from: FROM, to: TO.split(",").map((s) => s.trim()), subject, html, replyTo, attachments });
  if (error) throw new Error(error.message);
}

export async function sendConfirmation(to: string, subject: string, html: string) {
  if (!resend) throw new Error("email-not-configured");
  const { error } = await resend.emails.send({ from: FROM, to, subject, html, replyTo: TO?.split(",")[0]?.trim() });
  if (error) throw new Error(error.message);
}

export async function addToAudience(email: string, firstName?: string) {
  const audienceId = TEST_MODE ? "test-audience" : process.env.RESEND_AUDIENCE_ID;
  if (!resend || !audienceId) throw new Error("audience-not-configured");
  const { error } = await resend.contacts.create({ email, firstName, unsubscribed: false, audienceId });
  if (error && !/already exists/i.test(error.message)) throw new Error(error.message);
}
