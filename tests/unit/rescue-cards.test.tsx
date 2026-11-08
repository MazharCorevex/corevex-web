import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import RescueCards from "@/components/services/RescueCards";
import { media } from "./setup";

type IOClass = { instances: { fire: () => void }[] };
const IO = (globalThis as unknown as { __IO: IOClass }).__IO;
const states = (c: HTMLElement) => Array.from(c.querySelectorAll(".rc")).map((el) => (el.classList.contains("at-risk") ? "R" : "F")).join("");

afterEach(() => {
  vi.useRealTimers();
  Object.assign(media, { fine: true, reduce: false, hover: true, desktop: true });
  IO.instances.length = 0;
});

describe("Code Rescue cards", () => {
  it("renders eight cards with icons, tags and fix notes", () => {
    const { container } = render(<RescueCards />);
    const cards = container.querySelectorAll(".rc");
    expect(cards).toHaveLength(8);
    expect(container.querySelectorAll(".rc svg")).toHaveLength(16);
    expect(container.querySelectorAll(".rc-risk")[0]).toHaveTextContent("At risk");
    expect(container.querySelectorAll(".rc-fixed")[0]).toHaveTextContent("Fixed ✓");
    expect(cards[2].querySelector(".rc-note")).toHaveTextContent("Stripe webhooks, retries and plan limits");
  });

  it("starts At risk and resolves with a 150 ms stagger once in view", async () => {
    vi.useFakeTimers();
    const { container } = render(<RescueCards />);
    expect(states(container)).toBe("RRRRRRRR");
    act(() => IO.instances.forEach((i) => i.fire()));
    await act(async () => vi.advanceTimersByTime(10));
    expect(states(container)).toBe("FRRRRRRR");
    await act(async () => vi.advanceTimersByTime(300));
    expect(states(container)).toBe("FFFRRRRR");
    await act(async () => vi.advanceTimersByTime(1200));
    expect(states(container)).toBe("FFFFFFFF");
  });

  it("resolves each card on its own on touch screens", () => {
    const mm = vi.spyOn(window, "matchMedia").mockImplementation(
      (q: string) => ({ matches: q.includes("max-width: 860px"), media: q, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
    );
    const { container } = render(<RescueCards />);
    expect(states(container)).toBe("RRRRRRRR");
    act(() => IO.instances.forEach((i) => i.fire()));
    expect(states(container)).toBe("FFFFFFFF");
    mm.mockRestore();
  });

  it("stays Fixed with reduced motion", () => {
    media.reduce = true;
    const { container } = render(<RescueCards />);
    expect(states(container)).toBe("FFFFFFFF");
  });
});
