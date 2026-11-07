import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Header from "@/components/layout/Header";
import { nav } from "./setup";

const mount = () => render(<Header megaPanel={<a href="/services/code-rescue/">Code Rescue</a>} />);

describe("header and mega menu", () => {
  it("renders brand, main links and the services trigger", () => {
    mount();
    expect(screen.getByRole("link", { name: "Corevex Solutions home" })).toHaveAttribute("href", "/");
    for (const l of ["Work", "AI Lab", "About", "Careers", "Insights"]) expect(screen.getAllByRole("link", { name: l }).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Services" })).toHaveAttribute("aria-expanded", "false");
  });

  it("opens on mouse hover and stays open on click", () => {
    mount();
    const btn = screen.getByRole("button", { name: "Services" });
    const li = btn.closest("li")!;
    fireEvent.pointerEnter(li, { pointerType: "mouse" });
    expect(btn).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(btn, { detail: 1 });
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(li).toHaveClass("is-open");
  });

  it("closes after the pointer leaves", async () => {
    vi.useFakeTimers();
    mount();
    const btn = screen.getByRole("button", { name: "Services" });
    const li = btn.closest("li")!;
    fireEvent.pointerEnter(li, { pointerType: "mouse" });
    fireEvent.pointerLeave(li, { pointerType: "mouse" });
    await act(async () => vi.advanceTimersByTime(200));
    expect(btn).toHaveAttribute("aria-expanded", "false");
    vi.useRealTimers();
  });

  it("ignores touch hover and toggles with keyboard or tap", async () => {
    mount();
    const btn = screen.getByRole("button", { name: "Services" });
    fireEvent.pointerEnter(btn.closest("li")!, { pointerType: "touch" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(btn, { detail: 0 });
    expect(btn).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(btn, { detail: 0 });
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and on a tap outside", () => {
    mount();
    const btn = screen.getByRole("button", { name: "Services" });
    fireEvent.click(btn, { detail: 0 });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(btn, { detail: 0 });
    fireEvent.pointerDown(document.body);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("marks the current page", () => {
    nav.path = "/work/";
    mount();
    expect(screen.getAllByRole("link", { name: "Work" })[0]).toHaveAttribute("aria-current", "page");
    nav.path = "/";
  });

  it("hides on scroll down and shows on scroll up", () => {
    const { container } = mount();
    const header = container.querySelector("header")!;
    Object.defineProperty(window, "scrollY", { value: 400, configurable: true });
    fireEvent.scroll(window);
    expect(header).toHaveClass("is-hidden");
    Object.defineProperty(window, "scrollY", { value: 100, configurable: true });
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("is-hidden");
    expect(document.body).toHaveClass("header-on");
  });
});

describe("mobile drawer", () => {
  it("opens, focuses close, traps focus and closes on Escape", async () => {
    const user = userEvent.setup();
    mount();
    const open = screen.getByRole("button", { name: "Open menu" });
    const drawer = screen.getByRole("dialog", { name: "Mobile menu", hidden: true });
    expect(drawer).toHaveAttribute("inert");
    await user.click(open);
    expect(drawer).toHaveClass("is-open");
    expect(drawer).not.toHaveAttribute("inert");
    expect(document.body).toHaveClass("menu-open");
    const close = screen.getByRole("button", { name: "Close menu" });
    expect(close).toHaveFocus();

    // jsdom has no layout, so every item counts as focusable
    const items = Array.from(drawer.querySelectorAll<HTMLElement>("a[href],button,summary"));
    items.forEach((el) => Object.defineProperty(el, "offsetParent", { value: drawer, configurable: true }));
    const last = items[items.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();
    fireEvent.keyDown(document, { key: "a" });
    expect(last).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(drawer).not.toHaveClass("is-open");
    expect(open).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes with the close button and lists every service", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const drawer = screen.getByRole("dialog", { name: "Mobile menu" });
    expect(drawer.querySelectorAll('details a[href^="/services"]').length).toBe(9);
    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(drawer).not.toHaveClass("is-open");
  });

  it("closes when the route changes", async () => {
    const user = userEvent.setup();
    const { rerender } = mount();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    nav.path = "/about/";
    rerender(<Header megaPanel={null} />);
    expect(screen.getByRole("dialog", { name: "Mobile menu", hidden: true })).not.toHaveClass("is-open");
    nav.path = "/";
  });
});
