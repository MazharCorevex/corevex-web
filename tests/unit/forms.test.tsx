import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FormState } from "@/app/actions";

const actions = vi.hoisted(() => ({
  submitContact: vi.fn(),
  subscribe: vi.fn(),
  apply: vi.fn(),
}));
vi.mock("@/app/actions", () => actions);
const upload = vi.hoisted(() => vi.fn());
vi.mock("@vercel/blob/client", () => ({ upload }));

import ContactStepped from "@/components/forms/ContactStepped";
import CareersForm from "@/components/forms/CareersForm";
import Newsletter from "@/components/forms/Newsletter";
import QuickContact from "@/components/forms/QuickContact";

// jsdom leaves file inputs out of new FormData(form); copy them like a browser does
const NativeFD = globalThis.FormData;
class FD extends NativeFD {
  constructor(form?: HTMLFormElement) {
    super(form);
    form?.querySelectorAll<HTMLInputElement>("input[type=file][name]").forEach((i) => {
      if (i.files?.[0]) this.set(i.name, i.files[0]);
    });
  }
}
globalThis.FormData = FD as typeof FormData;

const ok: FormState = { status: "ok" };
const gtag = vi.fn();
beforeEach(() => {
  Object.values(actions).forEach((a) => a.mockReset());
  upload.mockReset();
  gtag.mockReset();
  (window as unknown as { gtag: typeof gtag }).gtag = gtag;
  window.requestAnimationFrame = ((cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)) as unknown as typeof requestAnimationFrame;
});

const pdf = (size = 1000, name = "cv.pdf", type = "application/pdf") => new File(["%PDF-1.4", new Uint8Array(Math.max(0, size - 8))], name, { type });

describe("contact stepper", () => {
  it("walks the three steps and validates each one", async () => {
    const user = userEvent.setup();
    actions.submitContact.mockResolvedValue(ok);
    render(<ContactStepped />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Book a 30-minute call")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Mobile app"));
    const steps = document.querySelectorAll(".fstep");
    await user.click(steps[0].querySelector("button")!);
    expect(await screen.findByText("Step 2 of 3")).toBeInTheDocument();
    expect(gtag).toHaveBeenCalledWith("event", "form_step", { form: "contact", step: "details" });

    // empty details blocks the next step
    await user.click(steps[1].querySelectorAll("button")[1]);
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Goals, users and current tools"), "A booking app for clinics");
    await user.click(steps[1].querySelectorAll("button")[1]);
    expect(await screen.findByText("Step 3 of 3")).toBeInTheDocument();
    await user.click(steps[2].querySelectorAll("button")[0]);
    expect(await screen.findByText("Step 2 of 3")).toBeInTheDocument();
    await user.click(steps[1].querySelectorAll("button")[0]);
    expect(await screen.findByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("stops on the first invalid step when submitted early", async () => {
    render(<ContactStepped />);
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(screen.getByText("Step 2 of 3")).toBeInTheDocument());
    expect(actions.submitContact).not.toHaveBeenCalled();
  });

  it("submits valid details and shows success", async () => {
    const user = userEvent.setup();
    actions.submitContact.mockResolvedValue(ok);
    render(<ContactStepped />);
    await user.type(screen.getByLabelText("Goals, users and current tools"), "Rebuild our portal");
    await user.type(screen.getByLabelText("Name"), "Sara Khan");
    await user.type(screen.getByLabelText("Work email"), "sara@example.com");
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(actions.submitContact).toHaveBeenCalled());
    const fd = actions.submitContact.mock.calls[0][1] as FormData;
    expect(fd.get("need")).toBe("Custom software");
    expect(fd.get("email")).toBe("sara@example.com");
    expect(fd.get("website")).toBe("");
    expect(await screen.findByRole("status")).toHaveTextContent("Thank you");
    await waitFor(() => expect(gtag).toHaveBeenCalledWith("event", "form_submit", { form: "contact" }));
  });

  it("shows server field errors and jumps to the right step", async () => {
    const user = userEvent.setup();
    actions.submitContact.mockResolvedValue({ status: "error", message: "Please check the highlighted fields.", errors: { email: "Please enter a valid email address." } });
    render(<ContactStepped />);
    await user.type(screen.getByLabelText("Goals, users and current tools"), "x");
    await user.type(screen.getByLabelText("Name"), "A");
    await user.type(screen.getByLabelText("Work email"), "a@b.co");
    fireEvent.submit(document.querySelector("form")!);
    expect(await screen.findByRole("alert")).toHaveTextContent("Please check the highlighted fields.");
    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByLabelText("Work email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Work email")).toHaveAttribute("aria-describedby", "email-err");
    expect(screen.getByText("Step 3 of 3")).toBeInTheDocument();
  });

  it("returns to the details step when the server rejects them", async () => {
    actions.submitContact.mockResolvedValue({ status: "error", errors: { details: "Tell us a little about the project." } });
    const user = userEvent.setup();
    render(<ContactStepped />);
    await user.type(screen.getByLabelText("Goals, users and current tools"), " ");
    await user.type(screen.getByLabelText("Name"), "A");
    await user.type(screen.getByLabelText("Work email"), "a@b.co");
    fireEvent.submit(document.querySelector("form")!);
    expect(await screen.findByText("Tell us a little about the project.")).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
  });

  it("fills the honeypot timestamp after mount", async () => {
    render(<ContactStepped />);
    await act(async () => new Promise((r) => setTimeout(r, 5)));
    expect(Number((document.querySelector('input[name="t"]') as HTMLInputElement).value)).toBeGreaterThan(0);
    expect(document.querySelector('input[name="website"]')).toHaveAttribute("tabindex", "-1");
  });
});

describe("careers form", () => {
  it("rejects a non-PDF CV in the browser", async () => {
    render(<CareersForm roles={["Senior engineer"]} blob={false} />);
    fireEvent.change(screen.getByLabelText("CV (PDF, up to 5 MB)"), { target: { files: [pdf(1000, "cv.docx", "application/msword")] } });
    expect(screen.getByText("Please upload your CV as a PDF.")).toBeInTheDocument();
    expect(screen.getByLabelText("CV (PDF, up to 5 MB)")).toHaveAttribute("aria-invalid", "true");
  });

  it("rejects a CV over 5 MB and blocks submit", async () => {
    const user = userEvent.setup();
    render(<CareersForm roles={[]} blob={false} />);
    await user.type(screen.getByLabelText("Name"), "Ali");
    await user.type(screen.getByLabelText("Email"), "ali@example.com");
    const big = pdf(6 * 1024 * 1024);
    await user.upload(screen.getByLabelText("CV (PDF, up to 5 MB)"), big);
    expect(screen.getByText("Your CV must be 5 MB or smaller.")).toBeInTheDocument();
    fireEvent.submit(document.querySelector("form")!);
    await act(async () => {});
    expect(actions.apply).not.toHaveBeenCalled();
  });

  it("sends an open application without a role picker when there are no roles", () => {
    render(<CareersForm roles={[]} blob={false} />);
    expect(screen.queryByLabelText("Role")).toBeNull();
    expect(document.querySelector<HTMLInputElement>('input[type="hidden"][name="role"]')?.value).toBe("Open application");
  });

  it("applies with a valid PDF and shows success", async () => {
    const user = userEvent.setup();
    actions.apply.mockResolvedValue(ok);
    render(<CareersForm roles={["Senior engineer"]} blob={false} />);
    expect(screen.getByRole("option", { name: "Open application" })).toBeInTheDocument();
    await user.type(screen.getByLabelText("Name"), "Ali");
    await user.type(screen.getByLabelText("Email"), "ali@example.com");
    await user.upload(screen.getByLabelText("CV (PDF, up to 5 MB)"), pdf());
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(actions.apply).toHaveBeenCalled());
    expect((actions.apply.mock.calls[0][1] as FormData).get("cv")).toBeInstanceOf(File);
    expect(await screen.findByRole("status")).toHaveTextContent("Application received");
  });

  it("uploads to Blob first when large uploads are enabled", async () => {
    const user = userEvent.setup();
    actions.apply.mockResolvedValue(ok);
    upload.mockResolvedValue({ url: "https://abc.public.blob.vercel-storage.com/cv/cv.pdf" });
    render(<CareersForm roles={[]} blob />);
    await user.type(screen.getByLabelText("Name"), "Ali");
    await user.type(screen.getByLabelText("Email"), "ali@example.com");
    await user.upload(screen.getByLabelText("CV (PDF, up to 5 MB)"), pdf());
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(actions.apply).toHaveBeenCalled());
    const fd = actions.apply.mock.calls[0][1] as FormData;
    expect(fd.get("cv")).toBeNull();
    expect(fd.get("cvUrl")).toMatch(/blob\.vercel-storage\.com/);
  });

  it("shows an error when the Blob upload fails", async () => {
    const user = userEvent.setup();
    upload.mockRejectedValue(new Error("down"));
    render(<CareersForm roles={[]} blob />);
    await user.type(screen.getByLabelText("Name"), "Ali");
    await user.type(screen.getByLabelText("Email"), "ali@example.com");
    await user.upload(screen.getByLabelText("CV (PDF, up to 5 MB)"), pdf());
    fireEvent.submit(document.querySelector("form")!);
    expect(await screen.findByText("We could not upload your CV. Please try again.")).toBeInTheDocument();
    expect(actions.apply).not.toHaveBeenCalled();
  });

  it("blocks submit when required fields are empty", async () => {
    render(<CareersForm roles={[]} blob={false} />);
    fireEvent.submit(document.querySelector("form")!);
    await act(async () => {});
    expect(actions.apply).not.toHaveBeenCalled();
  });

  it("shows server errors", async () => {
    const user = userEvent.setup();
    actions.apply.mockResolvedValue({ status: "error", message: "Please check the highlighted fields.", errors: { cv: "Please upload your CV as a PDF." } });
    render(<CareersForm roles={[]} blob={false} />);
    await user.type(screen.getByLabelText("Name"), "Ali");
    await user.type(screen.getByLabelText("Email"), "ali@example.com");
    fireEvent.submit(document.querySelector("form")!);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Please upload your CV as a PDF.")).toBeInTheDocument();
  });
});

describe("newsletter", () => {
  it("subscribes and confirms", async () => {
    const user = userEvent.setup();
    actions.subscribe.mockResolvedValue(ok);
    render(<Newsletter />);
    await user.type(screen.getByLabelText("Email"), "reader@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Subscribed. Thank you.");
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(gtag).toHaveBeenCalledWith("event", "newsletter_subscribe", {});
  });

  it("shows the server error", async () => {
    const user = userEvent.setup();
    actions.subscribe.mockResolvedValue({ status: "error", message: "Too many attempts. Please wait a few minutes and try again." });
    render(<Newsletter />);
    await user.type(screen.getByLabelText("Email"), "reader@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts");
  });
});

describe("quick contact", () => {
  it("sends and confirms", async () => {
    const user = userEvent.setup();
    actions.submitContact.mockResolvedValue(ok);
    render(<QuickContact />);
    const form = document.querySelector("form")!;
    for (const el of Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input:not([type=hidden]):not([name=website]),textarea")))
      await user.type(el, el.type === "email" ? "a@example.com" : "Hello");
    fireEvent.submit(form);
    await waitFor(() => expect(actions.submitContact).toHaveBeenCalled());
    expect(await screen.findByRole("status")).not.toBeEmptyDOMElement();
  });

  it("shows errors", async () => {
    actions.submitContact.mockResolvedValue({ status: "error", message: "Please check the highlighted fields.", errors: { name: "Please enter your name.", email: "Please enter a valid email address.", details: "Tell us a little about the project." } });
    render(<QuickContact />);
    fireEvent.submit(document.querySelector("form")!);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
