import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";

// Slower machines need more than the default 1 s for async UI
configure({ asyncUtilTimeout: 3000 });
import { afterEach, vi } from "vitest";
import { createElement } from "react";

afterEach(() => cleanup());

// Next mocks
export const nav = { path: "/" };
vi.mock("next/navigation", () => ({
  usePathname: () => nav.path,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
vi.mock("next/image", () => ({
  default: ({ src, alt, fill, priority, sizes, quality, ...rest }: Record<string, unknown>) => {
    void priority;
    void quality;
    return createElement("img", { src, alt, sizes, "data-nimg": fill ? "fill" : "1", ...rest });
  },
}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "203.0.113.9" }),
}));

// Browser APIs jsdom lacks
class IO {
  static instances: IO[] = [];
  constructor(public cb: IntersectionObserverCallback) {
    IO.instances.push(this);
  }
  els: Element[] = [];
  observe(el: Element) {
    this.els.push(el);
  }
  unobserve(el: Element) {
    this.els = this.els.filter((e) => e !== el);
  }
  disconnect() {
    this.els = [];
  }
  takeRecords() {
    return [];
  }
  // Trigger every observed element
  fire() {
    this.cb(
      this.els.map((target) => ({ target, isIntersecting: true, intersectionRatio: 1 }) as unknown as IntersectionObserverEntry),
      this as unknown as IntersectionObserver,
    );
  }
}
(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO;
(globalThis as unknown as { __IO: typeof IO }).__IO = IO;
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

export const media = { fine: true, reduce: false, hover: true, desktop: true };
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (q: string) => ({
    // each "and" part must match
    matches: q.split(/\s+and\s+/).every(
      (p) =>
        (p.includes("pointer: fine") && media.fine) ||
        (p.includes("pointer: coarse") && !media.fine) ||
        (p.includes("reduce") && media.reduce) ||
        (p.includes("hover: hover") && media.hover) ||
        (p.includes("min-width") && media.desktop),
    ),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }),
});
window.scrollTo = (() => {}) as typeof window.scrollTo;
Element.prototype.scrollIntoView = function () {};
Element.prototype.scrollTo = function () {} as typeof Element.prototype.scrollTo;
