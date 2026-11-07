import "server-only";
import { rateLimit } from "./rate-limit";
import { addToAudience, branded, emailConfigured, esc, p, rows, sendConfirmation, sendNotification } from "./email";

export type FormState = {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: Record<string, string>;
};
export type FormResult = { state: FormState; code: number };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MAX_CV = 5 * 1024 * 1024;
const GENERIC = "Something went wrong and your message was not sent. Please try again in a few minutes.";
const ok = (): FormResult => ({ state: { status: "ok" }, code: 200 });
const invalid = (errors: Record<string, string>, message = "Please check the highlighted fields."): FormResult => ({
  state: { status: "error", errors, message },
  code: 400,
});

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
const line = (s: string) => s.replace(/[\r\n\t]+/g, " ");

// Spam and rate guard
function guard(fd: FormData, form: string, ip: string): FormResult | null {
  if (str(fd, "website")) return ok();
  const t = Number(fd.get("t") || 0);
  if (t && Date.now() - t < 2000) return ok();
  if (!rateLimit(`${form}:${ip}`))
    return { state: { status: "error", message: "Too many attempts. Please wait a few minutes and try again." }, code: 429 };
  return null;
}

function notConfigured(): FormResult {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[forms] RESEND_API_KEY or CONTACT_TO_EMAIL missing, skipping email in development");
    return ok();
  }
  return { state: { status: "error", message: GENERIC }, code: 503 };
}

const failed = (form: string, e: unknown): FormResult => {
  console.error(`[forms] ${form}`, e);
  return { state: { status: "error", message: GENERIC }, code: 502 };
};

// Contact
export async function contact(fd: FormData, ip: string): Promise<FormResult> {
  const blocked = guard(fd, "contact", ip);
  if (blocked) return blocked;
  const v = {
    need: line(str(fd, "need", 80)),
    details: str(fd, "details", 5000),
    name: line(str(fd, "name", 120)),
    email: str(fd, "email", 200),
    company: line(str(fd, "company", 160)),
    country: line(str(fd, "country", 120)),
    source: line(str(fd, "source", 40)),
  };
  const errors: Record<string, string> = {};
  if (!v.details) errors.details = "Tell us a little about the project.";
  if (!v.name) errors.name = "Please enter your name.";
  if (!EMAIL.test(v.email)) errors.email = "Please enter a valid email address.";
  if (Object.keys(errors).length) return invalid(errors);
  if (!emailConfigured()) return notConfigured();
  try {
    await sendNotification(
      `New enquiry: ${v.need || "Project"} from ${v.name}`,
      branded(
        "New project enquiry",
        rows({ Need: v.need, Name: v.name, Email: v.email, Company: v.company, Country: v.country, Form: v.source, Details: v.details }),
      ),
      v.email,
    );
    await sendConfirmation(
      v.email,
      "We have your project details",
      branded(
        `Thank you, ${esc(v.name.split(" ")[0])}`,
        p("Your project details are with our team. A senior engineer reads every enquiry and replies personally.") +
          p("If you would like to add anything, simply reply to this email.") +
          rows({ "What you need": v.need, "Your message": v.details }),
      ),
    );
    return ok();
  } catch (e) {
    return failed("contact", e);
  }
}

// Newsletter
export async function newsletter(fd: FormData, ip: string): Promise<FormResult> {
  const blocked = guard(fd, "news", ip);
  if (blocked) return blocked;
  const email = str(fd, "email", 200);
  if (!EMAIL.test(email)) return invalid({ email: "Please enter a valid email address." }, "Please enter a valid email address.");
  if (!emailConfigured()) return notConfigured();
  try {
    await addToAudience(email);
    await sendNotification("New newsletter subscriber", branded("New newsletter subscriber", rows({ Email: email })), email);
    await sendConfirmation(
      email,
      "You are subscribed to Corevex notes",
      branded(
        "You are subscribed",
        p("Thank you for subscribing. Once a month our engineers send one short email with practical notes on software and AI.") +
          p("No spam, and you can unsubscribe at any time."),
      ),
    );
    return ok();
  } catch (e) {
    return failed("newsletter", e);
  }
}

// Careers
export async function careers(fd: FormData, ip: string): Promise<FormResult> {
  const blocked = guard(fd, "careers", ip);
  if (blocked) return blocked;
  const v = {
    name: line(str(fd, "name", 120)),
    email: str(fd, "email", 200),
    role: line(str(fd, "role", 160)),
    link: str(fd, "link", 400),
    message: str(fd, "message", 5000),
    cvUrl: str(fd, "cvUrl", 600),
  };
  const errors: Record<string, string> = {};
  if (!v.name) errors.name = "Please enter your name.";
  if (!EMAIL.test(v.email)) errors.email = "Please enter a valid email address.";
  if (v.link && !/^https?:\/\/\S+$/.test(v.link)) errors.link = "Please enter a full link starting with https://";

  const file = fd.get("cv");
  let code = 400;
  let attachment: { filename: string; content?: Buffer; path?: string } | undefined;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_CV) {
      errors.cv = "Your CV must be 5 MB or smaller.";
      code = 413;
    } else if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      errors.cv = "Please upload your CV as a PDF.";
      code = 415;
    } else {
      const buf = Buffer.from(await file.arrayBuffer());
      if (buf.subarray(0, 5).toString() !== "%PDF-") {
        errors.cv = "Please upload your CV as a PDF.";
        code = 415;
      } else attachment = { filename: file.name.replace(/[^\w.-]+/g, "_"), content: buf };
    }
  } else if (v.cvUrl) {
    if (!/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/\S+\.pdf$/i.test(v.cvUrl)) errors.cv = "Please upload your CV as a PDF.";
    else attachment = { filename: v.cvUrl.split("/").pop() || "cv.pdf", path: v.cvUrl };
  }
  if (Object.keys(errors).length) return { ...invalid(errors), code: errors.cv && Object.keys(errors).length === 1 ? code : 400 };
  if (!emailConfigured()) return notConfigured();
  try {
    await sendNotification(
      `Application: ${v.role || "Open application"} from ${v.name}`,
      branded(
        "New job application",
        rows({ Role: v.role, Name: v.name, Email: v.email, Link: v.link, CV: attachment ? attachment.filename : "Not attached", Message: v.message }),
      ),
      v.email,
      attachment ? [attachment] : undefined,
    );
    await sendConfirmation(
      v.email,
      "We received your application",
      branded(
        `Thank you, ${esc(v.name.split(" ")[0])}`,
        p(`Your application${v.role ? ` for <b>${esc(v.role)}</b>` : ""} is with our team. We read every application and will contact you if there is a fit.`) +
          p("Thank you for your interest in Corevex."),
      ),
    );
    return ok();
  } catch (e) {
    return failed("careers", e);
  }
}

export const HANDLERS = { contact, newsletter, careers } as const;
export type FormName = keyof typeof HANDLERS;

export const clientIp = (h: Headers) => (h.get("x-forwarded-for") || h.get("x-real-ip") || "local").split(",")[0].trim();
