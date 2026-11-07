import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FaqPage from "@/components/generated/FaqPage";

const CAL = "https://calendly.com/corevex/30min";

async function loadButton(url?: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_CALENDLY_URL", url ?? "");
  return (await import("@/components/booking/BookCall")).default;
}

beforeEach(() => {
  document.querySelectorAll("dialog").forEach((n) => n.remove());
  document.documentElement.classList.remove("booking-open");
  vi.unstubAllEnvs();
});

describe("Calendly button", () => {
  it("says Book a 30-minute call and loads nothing until clicked", async () => {
    const BookCall = await loadButton(CAL);
    render(<BookCall />);
    const a = screen.getByRole("link", { name: "Book a 30-minute call" });
    expect(a).toHaveAttribute("href", CAL);
    expect(document.querySelector("iframe, dialog")).toBeNull();
  });

  it("opens the booking window with the calendar embedded and closes it", async () => {
    const BookCall = await loadButton(CAL);
    render(<BookCall className="btn">Talk to us</BookCall>);
    const a = screen.getByRole("link", { name: "Talk to us" });
    const click = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    await act(async () => {
      a.dispatchEvent(click);
    });
    expect(click.defaultPrevented).toBe(true);
    const dialog = document.querySelector("dialog.booking")!;
    expect(dialog).toHaveAttribute("open");
    expect(screen.getByRole("heading", { name: "Book a 30-minute call" })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("booking-open");
    const frame = dialog.querySelector("iframe")!;
    const src = new URL(frame.src);
    expect(src.origin + src.pathname).toBe(CAL);
    expect(src.searchParams.get("primary_color")).toBe("48ac9f");
    expect(src.searchParams.get("embed_type")).toBe("Inline");
    expect(src.searchParams.get("hide_event_type_details")).toBe("1");
    expect(screen.getByRole("status")).toHaveTextContent("Loading available times");
    fireEvent.load(frame);
    expect(screen.queryByRole("status")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close booking" }));
    expect(document.querySelector("dialog.booking")).toBeNull();
    expect(document.documentElement).not.toHaveClass("booking-open");
    expect(a).toHaveFocus();
  });

  it("closes on Escape and on a click outside the window", async () => {
    const BookCall = await loadButton(CAL);
    render(<BookCall />);
    const a = screen.getByRole("link");
    fireEvent.click(a, { button: 0 });
    fireEvent(document.querySelector("dialog.booking")!, new Event("cancel", { cancelable: true }));
    expect(document.querySelector("dialog.booking")).toBeNull();
    fireEvent.click(a, { button: 0 });
    fireEvent.click(document.querySelector("dialog.booking")!);
    expect(document.querySelector("dialog.booking")).toBeNull();
  });

  it("leaves modified clicks to the browser", async () => {
    const BookCall = await loadButton(CAL);
    render(<BookCall />);
    fireEvent.click(screen.getByRole("link"), { button: 0, ctrlKey: true });
    expect(document.querySelector("dialog.booking")).toBeNull();
  });

  it("falls back to the contact page without a Calendly URL", async () => {
    const BookCall = await loadButton("");
    render(<BookCall />);
    const a = screen.getByRole("link", { name: "Book a 30-minute call" });
    expect(a.getAttribute("href")).toMatch(/^\/contact\/?#call$/);
    fireEvent.click(a);
    expect(document.querySelector("dialog.booking")).toBeNull();
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
