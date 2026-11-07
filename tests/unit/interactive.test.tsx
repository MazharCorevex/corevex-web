import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HeroArt from "@/components/home/HeroArt";
import HealthCheck from "@/components/home/HealthCheck";
import Tabs from "@/components/interactive/Tabs";
import Accordion from "@/components/interactive/Accordion";
import Filter from "@/components/interactive/Filter";
import Rail from "@/components/interactive/Rail";
import FeatList from "@/components/interactive/FeatList";
import SvcRows from "@/components/interactive/SvcRows";
import BeforeAfter from "@/components/interactive/BeforeAfter";
import Demo from "@/components/interactive/Demo";
import TechStack from "@/components/home/sections/TechStack";
import Industries from "@/components/home/sections/Industries";
import { media } from "./setup";

type IOClass = { instances: { fire: () => void }[] };
const IO = (globalThis as unknown as { __IO: IOClass }).__IO;
const fireAll = () => act(() => IO.instances.forEach((i) => i.fire()));

beforeEach(() => {
  IO.instances.length = 0;
  Object.assign(media, { fine: true, reduce: false, hover: true, desktop: true });
});
afterEach(() => vi.useRealTimers());

describe("hero orbit and core preview", () => {
  it("renders seven service chips that link to their pages", () => {
    render(<HeroArt mark={<span data-testid="mark" />} />);
    const chips = screen.getByRole("navigation", { name: "Our services" }).querySelectorAll("a");
    expect(chips).toHaveLength(7);
    expect(chips[0].getAttribute("href")).toMatch(/^\/services\/custom-software-development/);
    expect(screen.getByTestId("mark")).toBeInTheDocument();
  });

  it("animates the orbit in and shows the circular preview on hover and focus", async () => {
    vi.useFakeTimers();
    const { container } = render(<HeroArt mark={null} />);
    await act(async () => vi.advanceTimersByTime(400));
    expect(container.querySelector(".orbit")).toHaveClass("in");
    const chips = container.querySelectorAll(".orb-chip");
    fireEvent.mouseEnter(chips[2]);
    const card = container.querySelector(".orb-card")!;
    expect(card).toHaveClass("on");
    expect(card).toHaveTextContent("Mobile Apps");
    expect(card.querySelector("img")!.getAttribute("src")).toBe("/images/photos/svc-mobile-flatlay-800.webp");
    expect(card.getAttribute("href")).toMatch(/mobile-app-development/);
    fireEvent.mouseLeave(chips[2]);
    fireEvent.mouseEnter(card);
    await act(async () => vi.advanceTimersByTime(300));
    expect(card).toHaveClass("on");
    fireEvent.mouseLeave(card);
    await act(async () => vi.advanceTimersByTime(300));
    expect(card).not.toHaveClass("on");
    fireEvent.focus(chips[6]);
    expect(card).toHaveTextContent("AI Agents");
    fireEvent.blur(chips[6]);
  });

  it("tilts with the pointer on desktop only", () => {
    const { container } = render(
      <section className="hero">
        <HeroArt mark={null} />
      </section>,
    );
    const hero = container.querySelector(".hero")!;
    hero.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1000, height: 600 }) as DOMRect;
    const art = container.querySelector<HTMLElement>(".hero-art")!;
    fireEvent.pointerMove(hero, { clientX: 10, clientY: 10 });
    expect(art.style.transform).toContain("perspective");
    fireEvent.pointerLeave(hero);
    expect(art.style.transform).toBe("");
  });

  it("does not tilt with reduced motion", () => {
    media.reduce = true;
    const { container } = render(
      <section className="hero">
        <HeroArt mark={null} />
      </section>,
    );
    fireEvent.pointerMove(container.querySelector(".hero")!, { clientX: 10, clientY: 10 });
    expect(container.querySelector<HTMLElement>(".hero-art")!.style.transform).toBe("");
  });
});

describe("tech stack tabs", () => {
  it("has five categories and switches with click and arrow keys", async () => {
    vi.useFakeTimers();
    render(<TechStack />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent?.trim())).toEqual(
      expect.arrayContaining([expect.stringMatching(/Frontend/), expect.stringMatching(/Backend/), expect.stringMatching(/Mobile/), expect.stringMatching(/AI/), expect.stringMatching(/Automation/)]),
    );
    expect(tabs).toHaveLength(5);
    fireAll();
    await act(async () => vi.advanceTimersByTime(50));
    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    const panels = document.querySelectorAll<HTMLElement>(".stx-panel");
    expect(panels[1].hidden).toBe(false);
    expect(panels[0].hidden).toBe(true);
    fireEvent.keyDown(tabs[1], { key: "ArrowRight" });
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(tabs[2]).toHaveFocus();
    fireEvent.keyDown(tabs[2], { key: "ArrowLeft" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs[0], { key: "ArrowUp" });
    expect(tabs[4]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs[4], { key: "ArrowDown" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabs[0], { key: "Enter" });
    await act(async () => vi.advanceTimersByTime(50));
    expect(panels[0].querySelector(".stx-card")).toHaveClass("in");
  });

  it("works for any tab markup", () => {
    render(
      <Tabs className="stx">
        <button className="stx-tab">A</button>
        <button className="stx-tab">B</button>
        <div className="stx-panel">a</div>
        <div className="stx-panel">b</div>
      </Tabs>,
    );
    fireEvent.click(screen.getByText("B"));
    expect(screen.getByText("b")).toHaveClass("on");
  });
});

describe("industries accordion", () => {
  it("opens one item at a time on click, hover and focus", () => {
    render(<Industries />);
    const items = document.querySelectorAll<HTMLElement>(".acc-item");
    expect(items).toHaveLength(6);
    fireEvent.click(items[2]);
    expect(items[2]).toHaveClass("on");
    expect(items[2]).toHaveAttribute("aria-expanded", "true");
    expect(items[0]).not.toHaveClass("on");
    fireEvent.mouseEnter(items[3]);
    expect(items[3]).toHaveClass("on");
    fireEvent.focus(items[4]);
    expect(items[4]).toHaveClass("on");
  });

  it("does not open on hover on touch screens", () => {
    media.hover = false;
    render(
      <Accordion className="acc">
        <button className="acc-item on">A</button>
        <button className="acc-item">B</button>
      </Accordion>,
    );
    fireEvent.mouseEnter(screen.getByText("B"));
    expect(screen.getByText("B")).not.toHaveClass("on");
    fireEvent.click(screen.getByText("B"));
    expect(screen.getByText("B")).toHaveClass("on");
  });
});

describe("filters", () => {
  const insights = (
    <Filter mode="insights">
      <div className="filters">
        <button data-ifilter="all" aria-pressed="true">All</button>
        <button data-ifilter="ai">AI</button>
        <button data-ifilter="saas">SaaS</button>
        <button data-ifilter="none">Empty</button>
      </div>
      <div className="mag-feat" data-cat="ai">Feature</div>
      <div className="mag">
        <a data-cat="ai" href="/a/">One</a>
        <a data-cat="saas" href="/b/">Two</a>
      </div>
      <p className="empty-note" hidden>
        Nothing here yet
      </p>
    </Filter>
  );

  it("filters Insights by each category and shows the empty note", () => {
    render(insights);
    fireEvent.click(screen.getByText("AI"));
    expect(screen.getByText("AI")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Two").hidden).toBe(true);
    expect(screen.getByText("One").hidden).toBe(false);
    fireEvent.click(screen.getByText("SaaS"));
    expect(screen.getByText("One").hidden).toBe(true);
    expect(screen.getByText("Feature").hidden).toBe(true);
    fireEvent.click(screen.getByText("Empty"));
    expect(screen.getByText("Nothing here yet").hidden).toBe(false);
    fireEvent.click(screen.getByText("All"));
    expect(screen.getByText("Two").hidden).toBe(false);
    expect(screen.getByText("Nothing here yet").hidden).toBe(true);
  });

  it("marks the bar as stuck when it reaches the header", () => {
    render(insights);
    const bar = document.querySelector<HTMLElement>(".filters")!;
    bar.getBoundingClientRect = () => ({ top: 0 }) as DOMRect;
    fireEvent.scroll(window);
    expect(bar).toHaveClass("is-stuck");
    document.body.classList.add("header-on");
    bar.getBoundingClientRect = () => ({ top: 200 }) as DOMRect;
    fireEvent.scroll(window);
    expect(bar).not.toHaveClass("is-stuck");
  });

  it("filters work cards", () => {
    render(
      <Filter mode="work">
        <button data-filter="all">All</button>
        <button data-filter="mobile">Mobile</button>
        <a className="m-card" data-cat="web mobile">A</a>
        <a className="m-card" data-cat="ai">B</a>
      </Filter>,
    );
    fireEvent.click(screen.getByText("Mobile"));
    expect(screen.getByText("B")).toHaveClass("hide");
    expect(screen.getByText("A")).not.toHaveClass("hide");
    fireEvent.click(screen.getByText("All"));
    expect(screen.getByText("B")).not.toHaveClass("hide");
  });
});

describe("Code Rescue health check", () => {
  it("fixes each row and counts the score up when in view", async () => {
    vi.useFakeTimers();
    const { container } = render(<HealthCheck />);
    expect(screen.getByLabelText("Health score 42")).toBeInTheDocument();
    expect(container.querySelectorAll(".hc-row.fixed")).toHaveLength(0);
    fireAll();
    await act(async () => vi.advanceTimersByTime(4000));
    expect(container.querySelector(".hc")).toHaveClass("done");
    expect(container.querySelectorAll(".hc-row.fixed")).toHaveLength(6);
    expect(screen.getByLabelText("Health score 92")).toBeInTheDocument();
  });

  it("finishes at once with reduced motion", async () => {
    vi.useFakeTimers();
    media.reduce = true;
    const { container } = render(<HealthCheck />);
    fireAll();
    await act(async () => vi.advanceTimersByTime(600));
    expect(container.querySelectorAll(".hc-row.fixed")).toHaveLength(6);
  });
});

describe("other interactive pieces", () => {
  it("rail scrolls with buttons and drag without following links", () => {
    render(
      <Rail>
        <button data-dir="-1">Prev</button>
        <button data-dir="1">Next</button>
        <div className="rail">
          <a href="/x/">Card</a>
        </div>
      </Rail>,
    );
    const rail = document.querySelector<HTMLElement>(".rail")!;
    rail.scrollBy = vi.fn();
    fireEvent.click(screen.getByText("Next"));
    expect(rail.scrollBy).toHaveBeenCalled();
    fireEvent.pointerDown(rail, { pointerType: "mouse", clientX: 100 });
    fireEvent.pointerMove(rail, { clientX: 40 });
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    screen.getByText("Card").dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    fireEvent.pointerUp(window);
    fireEvent.pointerDown(rail, { pointerType: "touch" });
    const drag = new Event("dragstart", { cancelable: true });
    rail.dispatchEvent(drag);
    expect(drag.defaultPrevented).toBe(true);
  });

  it("feature list swaps the active image", () => {
    render(
      <FeatList>
        <div className="feat-media">
          <img alt="" className="on" />
          <img alt="" />
        </div>
        <div className="feat-item">One</div>
        <div className="feat-item">Two</div>
      </FeatList>,
    );
    fireEvent.mouseEnter(screen.getByText("Two"));
    expect(screen.getByText("Two")).toHaveClass("on");
    expect(document.querySelectorAll(".feat-media img")[1]).toHaveClass("on");
    fireEvent.click(screen.getByText("One"));
    expect(screen.getByText("One")).toHaveClass("on");
  });

  it("service rows show a hover image with a fine pointer", () => {
    const { container } = render(
      <SvcRows data-reveal-group>
        <a className="svc-row" data-img="/images/photos/ai-ml-800.webp">
          Row
        </a>
      </SvcRows>,
    );
    fireEvent.mouseOver(screen.getByText("Row"));
    fireEvent.mouseMove(screen.getByText("Row"), { clientX: 10, clientY: 20 });
    expect(container.querySelector(".hover-img")).toHaveClass("on");
    expect(container.querySelector(".hover-img img")).toHaveAttribute("src", "/images/photos/ai-ml-800.webp");
    fireEvent.mouseOut(screen.getByText("Row"), { relatedTarget: document.body });
    expect(container.querySelector(".hover-img")).not.toHaveClass("on");
    media.fine = false;
    fireEvent.mouseOver(screen.getByText("Row"));
    expect(container.querySelector(".hover-img")).not.toHaveClass("on");
  });

  it("before and after slider follows the range input", () => {
    const { container } = render(
      <BeforeAfter className="ba">
        <input type="range" aria-label="Compare" defaultValue={50} />
        <input type="text" aria-label="Other" />
      </BeforeAfter>,
    );
    fireEvent.input(screen.getByLabelText("Compare"), { target: { value: "20" } });
    expect((container.firstChild as HTMLElement).style.getPropertyValue("--x")).toBe("20%");
    fireEvent.input(screen.getByLabelText("Other"), { target: { value: "x" } });
    expect((container.firstChild as HTMLElement).style.getPropertyValue("--x")).toBe("20%");
  });

  it("chat demo answers from the knowledge base", async () => {
    vi.useFakeTimers();
    render(
      <Demo kind="chat">
        <div className="chat" />
        <form>
          <input aria-label="Ask" />
          <button>Send</button>
        </form>
      </Demo>,
    );
    const input = screen.getByLabelText("Ask") as HTMLInputElement;
    fireEvent.submit(input.form!);
    expect(document.querySelectorAll(".msg")).toHaveLength(0);
    input.value = "How do refunds work?";
    fireEvent.submit(input.form!);
    await act(async () => vi.advanceTimersByTime(800));
    expect(document.querySelector(".msg.me")).toHaveTextContent("refunds");
    expect(document.querySelector(".msg.ai")).toHaveTextContent("Refund policy");
    input.value = "hello";
    fireEvent.submit(input.form!);
    await act(async () => vi.advanceTimersByTime(800));
    expect(document.querySelectorAll(".msg.ai")[1]).toHaveTextContent("Support handbook");
  });

  it("extraction and flow demos light up step by step", async () => {
    vi.useFakeTimers();
    render(
      <>
        <Demo kind="extract">
          <button>Extract</button>
          <div className="fields">
            <div>a</div>
            <div>b</div>
          </div>
        </Demo>
        <Demo kind="flow">
          <button>Run</button>
          <div className="flow">
            <div>c</div>
          </div>
        </Demo>
      </>,
    );
    fireEvent.click(screen.getByText("Extract"));
    fireEvent.click(screen.getByText("Run"));
    await act(async () => vi.advanceTimersByTime(1500));
    expect(screen.getByText("b")).toHaveClass("on");
    expect(screen.getByText("c")).toHaveClass("on");
  });
});

describe("user interaction smoke", () => {
  it("tabs are reachable by keyboard", async () => {
    const user = userEvent.setup();
    render(<TechStack />);
    await user.tab();
    expect(screen.getAllByRole("tab")[0]).toHaveFocus();
  });
});
