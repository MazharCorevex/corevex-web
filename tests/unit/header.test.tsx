import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import Header from "@/components/layout/Header";
import { media, nav } from "./setup";

const mount = () => render(<Header />);
const trigger = () => screen.getByRole("button", { name: "Services menu" });
const item = () => trigger().closest("li")!;
const hover = (el: Element) => fireEvent.pointerEnter(el, { pointerType: "mouse" });

afterEach(() => {
  vi.useRealTimers();
  Object.assign(media, { fine: true, hover: true, desktop: true });
});

describe("header", () => {
  it("renders brand, main links, the Services link and its menu button", () => {
    mount();
    expect(screen.getByRole("link", { name: "Corevex Solutions home" })).toHaveAttribute("href", "/");
    for (const l of ["Work", "AI Lab", "About", "Careers", "Insights"]) expect(screen.getAllByRole("link", { name: l }).length).toBeGreaterThan(0);
    expect(item().querySelector("a")?.getAttribute("href")).toMatch(/^\/services\/?$/);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveAttribute("aria-controls", "services-menu");
    expect(document.getElementById("services-menu")).toBeInTheDocument();
  });

  it("lists both groups and a link to all services", () => {
    mount();
    const panel = document.getElementById("services-menu")!;
    expect(panel.querySelectorAll("a.m")).toHaveLength(8);
    expect(panel.querySelector("a.all")?.getAttribute("href")).toMatch(/^\/services\/?$/);
    expect(panel.textContent).toContain("AI Agents as a Service");
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

describe("services mega menu", () => {
  it("opens 120 ms after hover and closes 250 ms after leaving", async () => {
    vi.useFakeTimers();
    mount();
    hover(item());
    await act(async () => vi.advanceTimersByTime(100));
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    await act(async () => vi.advanceTimersByTime(30));
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(item()).toHaveClass("is-open");
    fireEvent.pointerLeave(item(), { pointerType: "mouse" });
    await act(async () => vi.advanceTimersByTime(200));
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    hover(item());
    await act(async () => vi.advanceTimersByTime(300));
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    fireEvent.pointerLeave(item(), { pointerType: "mouse" });
    await act(async () => vi.advanceTimersByTime(260));
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("a quick pass over the trigger does not open it", async () => {
    vi.useFakeTimers();
    mount();
    hover(item());
    fireEvent.pointerLeave(item(), { pointerType: "mouse" });
    await act(async () => vi.advanceTimersByTime(400));
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("does not open on hover for touch, coarse pointers or narrow screens", async () => {
    vi.useFakeTimers();
    mount();
    fireEvent.pointerEnter(item(), { pointerType: "touch" });
    media.fine = false;
    hover(item());
    media.fine = true;
    media.desktop = false;
    hover(item());
    await act(async () => vi.advanceTimersByTime(300));
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("a mouse click keeps a hover-opened menu open", async () => {
    vi.useFakeTimers();
    mount();
    hover(item());
    await act(async () => vi.advanceTimersByTime(130));
    fireEvent.click(trigger(), { detail: 1 });
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles from the keyboard and closes on Escape with focus back on the trigger", async () => {
    const user = userEvent.setup();
    mount();
    trigger().focus();
    await user.keyboard("{Enter}");
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{Enter}");
    const first = document.querySelector<HTMLElement>("#services-menu a")!;
    first.focus();
    await user.keyboard("{Escape}");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveFocus();
  });

  it("closes on outside click, scroll, link click and route change", () => {
    const { rerender } = mount();
    const open = () => fireEvent.click(trigger(), { detail: 0 });
    const closed = () => expect(trigger()).toHaveAttribute("aria-expanded", "false");

    open();
    fireEvent.pointerDown(document.body);
    closed();

    open();
    fireEvent.pointerDown(document.getElementById("services-menu")!);
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    fireEvent.scroll(window);
    closed();

    open();
    fireEvent.click(document.querySelector("#services-menu a.m")!);
    closed();

    open();
    nav.path = "/about/";
    rerender(<Header />);
    closed();
    nav.path = "/";
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

  it("has a Services accordion with every service and closes with the close button", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const drawer = screen.getByRole("dialog", { name: "Mobile menu" });
    const acc = drawer.querySelector("details.drawer-acc")!;
    expect(acc.querySelectorAll('a[href^="/services"]').length).toBe(9);
    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(drawer).not.toHaveClass("is-open");
  });

  it("closes when the route changes", async () => {
    const user = userEvent.setup();
    const { rerender } = mount();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    nav.path = "/about/";
    rerender(<Header />);
    expect(screen.getByRole("dialog", { name: "Mobile menu", hidden: true })).not.toHaveClass("is-open");
    nav.path = "/";
  });
});
