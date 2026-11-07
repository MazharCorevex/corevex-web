import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FaqPage from "@/components/generated/FaqPage";

const CAL = "https://calendly.com/corevex/30min";

async function loadButton(url?: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_CALENDLY_URL", url ?? "");
  return (await import("@/components/booking/BookCall")).default;
}

beforeEach(() => {
  document.head.querySelectorAll("link[href*=calendly]").forEach((n) => n.remove());
  document.body.querySelectorAll("script[src*=calendly]").forEach((n) => n.remove());
  vi.unstubAllEnvs();
});

describe("Calendly button", () => {
  it("says Book a 30-minute call and loads nothing until clicked", async () => {
    const BookCall = await loadButton(CAL);
    render(<BookCall />);
    const a = screen.getByRole("link", { name: "Book a 30-minute call" });
    expect(a).toHaveAttribute("href", CAL);
    expect(document.querySelector("script[src*=calendly]")).toBeNull();
  });

  it("loads the script once on first click and opens the teal popup", async () => {
    const BookCall = await loadButton(CAL);
    const init = vi.fn();
    (window as unknown as { Calendly: unknown }).Calendly = { initPopupWidget: init };
    render(<BookCall className="btn">Talk to us</BookCall>);
    const a = screen.getByRole("link", { name: "Talk to us" });
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    a.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    const script = document.querySelector<HTMLScriptElement>("script[src*=calendly]")!;
    expect(script.src).toBe("https://assets.calendly.com/assets/external/widget.js");
    expect(document.querySelector("link[href*='calendly.com/assets/external/widget.css']")).not.toBeNull();
    script.onload!(new Event("load"));
    await waitFor(() => expect(init).toHaveBeenCalled());
    const url = new URL(init.mock.calls[0][0].url);
    expect(url.searchParams.get("primary_color")).toBe("48ac9f");
    fireEvent.click(a);
    await waitFor(() => expect(init).toHaveBeenCalledTimes(2));
    expect(document.querySelectorAll("script[src*=calendly]")).toHaveLength(1);
  });

  it("opens Calendly in a new tab if the script fails", async () => {
    const BookCall = await loadButton(CAL);
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<BookCall />);
    fireEvent.click(screen.getByRole("link"));
    const script = document.querySelector<HTMLScriptElement>("script[src*=calendly]")!;
    script.onerror!(new Event("error"));
    await waitFor(() => expect(open).toHaveBeenCalledWith(CAL, "_blank", "noopener"));
  });

  it("falls back to the contact page without a Calendly URL", async () => {
    const BookCall = await loadButton("");
    render(<BookCall />);
    const a = screen.getByRole("link", { name: "Book a 30-minute call" });
    expect(a.getAttribute("href")).toMatch(/^\/contact\/?#call$/);
    fireEvent.click(a);
    expect(document.querySelector("script[src*=calendly]")).toBeNull();
  });
});

describe("FAQ accordion", () => {
  it("renders native disclosure items that open and close", () => {
    render(<FaqPage />);
    const items = document.querySelectorAll("details");
    expect(items.length).toBeGreaterThan(5);
    const first = items[0];
    const summary = first.querySelector("summary")!;
    expect(first.open).toBe(false);
    fireEvent.click(summary);
    first.open = true;
    expect(first.open).toBe(true);
    expect(first.querySelector("p,div")).toBeInTheDocument();
    first.open = false;
    expect(first.open).toBe(false);
  });

  it("has no booking button with the old wording", () => {
    render(<FaqPage />);
    expect(document.body.textContent).not.toMatch(/20[- ]minute/i);
  });
});
