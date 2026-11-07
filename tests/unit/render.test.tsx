import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";
import type { PortableTextBlock } from "@portabletext/react";

// Async server sections are covered in content.test; stub them inside client renders
vi.mock("@/components/sections/ClientLogos", () => ({ default: () => null }));
vi.mock("@/components/sections/Testimonials", () => ({ default: () => null }));
const scene = vi.hoisted(() => ({ initCore: vi.fn(() => vi.fn()) }));
vi.mock("@/components/home/core-scene", () => scene);
vi.mock("@/app/actions", () => ({ submitContact: vi.fn(), subscribe: vi.fn(), apply: vi.fn() }));

import { media } from "./setup";
import services from "@/content/services.json";
import { getArticles, getCaseStudies, getJobs, getTeam } from "@/lib/content";
import ServiceTemplate, { type ServiceData } from "@/components/services/ServiceTemplate";
import AiAgentsAsAServiceBody from "@/components/services/bodies/AiAgentsAsAServiceBody";
import AiAutomationBody from "@/components/services/bodies/AiAutomationBody";
import AiLlmDevelopmentBody from "@/components/services/bodies/AiLlmDevelopmentBody";
import CodeRescueBody from "@/components/services/bodies/CodeRescueBody";
import CustomSoftwareDevelopmentBody from "@/components/services/bodies/CustomSoftwareDevelopmentBody";
import FullStackDevelopmentBody from "@/components/services/bodies/FullStackDevelopmentBody";
import MobileAppDevelopmentBody from "@/components/services/bodies/MobileAppDevelopmentBody";
import SaasAppDevelopmentBody from "@/components/services/bodies/SaasAppDevelopmentBody";
import AboutPage from "@/components/generated/AboutPage";
import AiLabPage from "@/components/generated/AiLabPage";
import CareersPage from "@/components/generated/CareersPage";
import ContactPage from "@/components/generated/ContactPage";
import FaqPage from "@/components/generated/FaqPage";
import NotFoundPage from "@/components/generated/NotFoundPage";
import PrivacyPage from "@/components/generated/PrivacyPage";
import ServicesHub from "@/components/generated/ServicesHub";
import TermsPage from "@/components/generated/TermsPage";
import Hero from "@/components/home/sections/Hero";
import ServicesBento from "@/components/home/sections/ServicesBento";
import CodeRescue from "@/components/home/sections/CodeRescue";
import Numbers from "@/components/home/sections/Numbers";
import Process from "@/components/home/sections/Process";
import WhyCorevex from "@/components/home/sections/WhyCorevex";
import TrustCards from "@/components/home/sections/TrustCards";
import ContactFinale from "@/components/home/sections/ContactFinale";
import WorkRail from "@/components/home/sections/WorkRail";
import InsightsBlock from "@/components/home/sections/InsightsBlock";
import CoreSection from "@/components/home/CoreSection";
import Footer from "@/components/layout/Footer";
import MegaPanel from "@/components/layout/MegaPanel";
import Motion from "@/components/layout/Motion";
import Analytics from "@/components/layout/Analytics";
import ArticleBody from "@/components/insights/ArticleBody";
import ArticleCard from "@/components/insights/ArticleCard";
import LeaderSheet from "@/components/about/LeaderSheet";
import Crumbs from "@/components/sections/Crumbs";
import CtaBand from "@/components/sections/CtaBand";
import ContactDetails from "@/components/sections/ContactDetails";
import JsonLd from "@/components/seo/JsonLd";
import Img from "@/components/ui/Img";
import Words from "@/components/ui/Words";

type IOClass = { instances: { fire: () => void }[] };
const IO = (globalThis as unknown as { __IO: IOClass }).__IO;

const BODIES: Record<string, () => ReactElement> = {
  "ai-agents-as-a-service": AiAgentsAsAServiceBody,
  "ai-automation": AiAutomationBody,
  "ai-llm-development": AiLlmDevelopmentBody,
  "code-rescue": CodeRescueBody,
  "custom-software-development": CustomSoftwareDevelopmentBody,
  "full-stack-development": FullStackDevelopmentBody,
  "mobile-app-development": MobileAppDevelopmentBody,
  "saas-app-development": SaasAppDevelopmentBody,
};

// Shared copy rules on every rendered block
function rules(el: HTMLElement) {
  const t = el.textContent || "";
  expect(t).not.toMatch(/—/);
  expect(t).not.toMatch(/\[[A-Za-z][^\]]{0,60}\]/);
  expect(t).not.toMatch(/20[- ]minute/i);
  expect(t).not.toMatch(/business day/i);
  el.querySelectorAll("img").forEach((i) => expect(i.hasAttribute("alt")).toBe(true));
  el.querySelectorAll("a").forEach((a) => {
    if (/book a .*call/i.test(a.textContent || "")) expect(a.textContent).toMatch(/Book a 30-minute call/);
  });
}

beforeEach(() => {
  IO.instances.length = 0;
  Object.assign(media, { fine: true, reduce: false, hover: true, desktop: true });
});

describe("service pages", () => {
  for (const s of services as unknown as ServiceData[]) {
    it(`renders ${s.slug}`, () => {
      const Body = BODIES[s.slug];
      const { container } = render(
        <ServiceTemplate data={s}>
          <Body />
        </ServiceTemplate>,
      );
      expect(container.querySelector("h1")).toBeInTheDocument();
      expect(container.querySelectorAll("h1")).toHaveLength(1);
      rules(container);
    });
  }
});

describe("pages and sections", () => {
  it("renders every static page", async () => {
    const team = await getTeam();
    const jobs = await getJobs();
    for (const el of [
      <AboutPage key="a" team={team} />,
      <AiLabPage key="b" />,
      <CareersPage key="c" jobs={jobs} blob={false} />,
      <ContactPage key="d" />,
      <FaqPage key="e" />,
      <NotFoundPage key="f" />,
      <PrivacyPage key="g" />,
      <ServicesHub key="h" />,
      <TermsPage key="i" />,
    ]) {
      const { container, unmount } = render(el);
      expect(container.querySelectorAll("h1").length).toBeLessThanOrEqual(1);
      rules(container);
      unmount();
    }
  });

  it("renders every home section", async () => {
    const work = await WorkRail();
    const insights = await InsightsBlock();
    const { container } = render(
      <>
        <Hero />
        <ServicesBento />
        <CodeRescue />
        <Numbers />
        {work}
        <Process />
        <WhyCorevex />
        <TrustCards />
        {insights}
        <ContactFinale />
      </>,
    );
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(screen.getAllByText("Product design study").length).toBeGreaterThan(0);
    rules(container);
  });

  it("renders the layout pieces", () => {
    const { container } = render(
      <>
        <MegaPanel />
        <Footer />
        <Crumbs items={[["Home", "/"], ["Work", "/work/"], ["Fleetline"]]} />
        <CtaBand />
        <ContactDetails />
        <JsonLd data={[{ "@type": "Thing" }]} />
        <JsonLd data={{ "@type": "Thing" }} />
        <Words as="h2" br={2}>
          One two three four
        </Words>
      </>,
    );
    expect(container.querySelectorAll("a[href*='/services/']").length).toBeGreaterThanOrEqual(8);
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(2);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("Fleetline");
    rules(container);
  });

  it("renders articles with tables and links", async () => {
    const [a] = await getArticles();
    const { container } = render(
      <>
        <ArticleCard a={a} />
        <ArticleCard a={a} feature />
        <ArticleBody
          value={
            [
            ...a.body,
            { _type: "block", _key: "l", style: "lead", children: [{ _type: "span", _key: "s", text: "Lead", marks: [] }], markDefs: [] },
            {
              _type: "block",
              _key: "k",
              style: "normal",
              markDefs: [
                { _key: "m1", _type: "link", href: "/contact/" },
                { _key: "m2", _type: "link", href: "https://example.com" },
              ],
              children: [
                { _type: "span", _key: "a", text: "inside", marks: ["m1"] },
                { _type: "span", _key: "b", text: "outside", marks: ["m2", "strong"] },
              ],
            },
            { _type: "table", _key: "t", hasHeader: true, rows: [{ _key: "r1", cells: ["A", "B"] }, { _key: "r2", cells: ["1", "2"] }] },
            { _type: "table", _key: "t2", rows: [{ _key: "r3", cells: ["x"] }] },
            { _type: "block", _key: "li", style: "normal", listItem: "number", level: 1, children: [{ _type: "span", _key: "s", text: "n", marks: [] }], markDefs: [] },
            ] as unknown as PortableTextBlock[]
          }
        />
      </>,
    );
    expect(Array.from(container.querySelectorAll("table th")).some((th) => th.textContent === "A")).toBe(true);
    expect(screen.getByText("outside").closest("a")).toHaveAttribute("rel", "noopener noreferrer");
    rules(container);
  });

  it("images always carry dimensions", () => {
    const { container } = render(
      <>
        <Img src="/images/photos/ai-ml.webp" alt="AI" sizes="100vw" priority />
        <Img src="/images/photos/ai-ml.webp" alt="AI fill" fill sizes="50vw" />
        <Img src="/images/logo/corevex-mark.svg" alt="Mark" height={40} />
        <Img src="/images/unknown.webp" alt="Fallback" width={10} height={5} />
      </>,
    );
    const [a, b, c, d] = Array.from(container.querySelectorAll("img"));
    expect(a).toHaveAttribute("width", "1536");
    expect(b).toHaveAttribute("data-nimg", "fill");
    expect(c).toHaveAttribute("height", "40");
    expect(c).toHaveAttribute("width", String(Math.round((272 / 205) * 40)));
    expect(d).toHaveAttribute("width", "10");
  });
});

describe("leadership sheet", () => {
  it("opens a bio dialog and returns focus on close", async () => {
    const team = (await getTeam()).filter((t) => t.leadership).map((t, i) => ({ ...t, linkedin: i === 0 ? "https://linkedin.com/in/x" : undefined }));
    render(<LeaderSheet team={team} />);
    const card = screen.getAllByRole("button", { name: /Mazhar H/ })[0];
    card.focus();
    fireEvent.click(card);
    const dialog = screen.getByRole("dialog", { name: /Mazhar H, CEO and Founder/ });
    expect(dialog).toHaveClass("is-open");
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(dialog).not.toHaveClass("is-open");
    fireEvent.click(screen.getAllByRole("button", { name: /M Azhar/ })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getAllByRole("button", { name: /M Azhar/ })[0]).toHaveFocus();
    fireEvent.click(screen.getAllByRole("button", { name: /Zafar H/ })[0]);
    fireEvent.click(screen.getByRole("dialog", { name: /Zafar H/ }));
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveClass("is-open");
  });
});

describe("motion and 3D", () => {
  it("reveals on scroll, counts up and moves the step fill", async () => {
    const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(performance.now() + 5000);
      return 0;
    });
    const { container } = render(
      <>
        <div data-reveal-group="">
          <p>a</p>
          <p data-reveal="">b</p>
        </div>
        <span data-count="50" data-suffix="+">
          0
        </span>
        <div className="steps">
          <i className="fill" />
        </div>
        <div className="split-img">
          <img alt="" />
        </div>
        <div className="bento">
          <div className="tile">t</div>
        </div>
        <Motion />
      </>,
    );
    act(() => IO.instances.forEach((i) => i.fire()));
    expect(container.querySelectorAll(".is-in").length).toBe(2);
    expect(screen.getByText("50+")).toBeInTheDocument();
    fireEvent.scroll(window);
    const tile = container.querySelector<HTMLElement>(".tile")!;
    fireEvent.pointerMove(tile, { clientX: 1, clientY: 1 });
    expect(tile).toHaveClass("tilting");
    fireEvent.pointerLeave(tile);
    expect(tile).not.toHaveClass("tilting");
    raf.mockRestore();
  });

  it("skips parallax and tilt with reduced motion", () => {
    media.reduce = true;
    const { container } = render(
      <>
        <div className="bento">
          <div className="tile">t</div>
        </div>
        <Motion />
      </>,
    );
    fireEvent.pointerMove(container.querySelector(".tile")!);
    expect(container.querySelector(".tile")).not.toHaveClass("tilting");
  });

  it("loads the 3D scene only on desktop with a fine pointer, when in view", async () => {
    scene.initCore.mockClear();
    const { container, unmount } = render(<CoreSection fallback={<img alt="Core" />} />);
    expect(scene.initCore).not.toHaveBeenCalled();
    await act(async () => IO.instances.forEach((i) => i.fire()));
    await act(async () => new Promise((r) => setTimeout(r, 0)));
    expect(scene.initCore).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".core")).toHaveClass("live");
    fireEvent.scroll(window);
    unmount();
  });

  it("never loads 3D on touch screens or with reduced motion", async () => {
    for (const m of [{ fine: false }, { reduce: true }, { desktop: false }]) {
      scene.initCore.mockClear();
      IO.instances.length = 0;
      Object.assign(media, { fine: true, reduce: false, desktop: true }, m);
      const { unmount, container } = render(<CoreSection fallback={<img alt="Core" />} />);
      await act(async () => IO.instances.forEach((i) => i.fire()));
      expect(scene.initCore).not.toHaveBeenCalled();
      expect(container.querySelector("img[alt=Core]")).toBeInTheDocument();
      unmount();
    }
  });

  it("tracks scroll depth and CTA clicks when GA is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST");
    const g = vi.fn();
    (window as unknown as { gtag: typeof g }).gtag = g;
    render(
      <>
        <a className="btn" href="/contact/">
          Start
        </a>
        <Analytics />
      </>,
    );
    Object.defineProperty(document.documentElement, "scrollHeight", { value: 2000, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 1500, configurable: true });
    fireEvent.scroll(window);
    expect(g).toHaveBeenCalledWith("event", "scroll_depth", expect.objectContaining({ percent: 75 }));
    fireEvent.click(screen.getByText("Start"));
    expect(g).toHaveBeenCalledWith("event", "cta_click", expect.objectContaining({ href: "/contact/" }));
    vi.unstubAllEnvs();
    delete (window as unknown as { gtag?: unknown }).gtag;
  });
});

describe("case studies", () => {
  it("are all labelled Product design study", async () => {
    for (const c of await getCaseStudies()) expect(c.isDesignStudy).toBe(true);
  });
});
