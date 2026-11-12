import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OFFERS, offer, priceText, fromText, startingText } from "@/lib/offers";
import OfferCard from "@/components/offers/OfferCard";
import { PriceBadge, PriceChip } from "@/components/offers/PriceTags";
import services from "@/content/services.json";

const APPROVED = new Set([199, 599, 1000, 2000, 2500, 5000]);

describe("offers", () => {
  it("hold only the five approved offers and prices", () => {
    expect(OFFERS.map((o) => o.slug)).toEqual(["landing-page", "website", "dedicated-developer", "saas-platform", "ai-agent"]);
    for (const o of OFFERS) {
      expect(APPROVED.has(o.price), o.slug).toBe(true);
      if (o.maxPrice) expect(APPROVED.has(o.maxPrice), o.slug).toBe(true);
    }
  });

  it("map slugs to offers and ignore unknown slugs", () => {
    expect(offer("website")?.price).toBe(599);
    expect(offer("dedicated-developer")?.maxPrice).toBe(2500);
    expect(offer("free-audit")).toBeUndefined();
    expect(offer(null)).toBeUndefined();
    expect(offer(undefined)).toBeUndefined();
  });

  it("format prices exactly", () => {
    const t = Object.fromEntries(OFFERS.map((o) => [o.slug, [priceText(o), fromText(o), startingText(o)]]));
    expect(t["landing-page"]).toEqual(["$199", "From $199", "Starting at $199"]);
    expect(t.website).toEqual(["$599", "From $599", "Starting at $599"]);
    expect(t["dedicated-developer"][0]).toBe("$2,000 to $2,500");
    expect(t["saas-platform"]).toEqual(["$5,000", "From $5,000", "Starting at $5,000"]);
    expect(t["ai-agent"]).toEqual(["$1,000", "From $1,000", "Starting at $1,000 per agent"]);
    expect(offer("dedicated-developer")?.label).toBe("Dedicated developer $2,000 to $2,500 per month");
  });

  it("point every offer at a real service page", () => {
    const slugs = new Set((services as { slug: string }[]).map((s) => s.slug));
    for (const o of OFFERS) expect(slugs.has(o.service), o.slug).toBe(true);
  });

  it("render cards that link to the contact form with the offer", () => {
    render(<OfferCard slug="saas-platform" popular />);
    expect(screen.getByRole("heading", { name: "SaaS platform" })).toBeTruthy();
    expect(screen.getByText("Popular")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Get started/ }).getAttribute("href")).toMatch(/^\/contact\/?\?offer=saas-platform$/);
    expect(screen.getByRole("article").textContent).toMatch(/From\$5,000/);
  });

  it("render the dedicated developer range per month", () => {
    render(<OfferCard slug="dedicated-developer" />);
    expect(screen.getByRole("article").textContent).toMatch(/\$2,000 to \$2,500per month/);
  });

  it("render nothing for an unknown slug", () => {
    const { container } = render(
      <>
        <OfferCard slug="nope" />
        <PriceBadge slug="nope" />
        <PriceChip slug="nope" />
      </>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("render badges and chips", () => {
    render(
      <>
        <PriceBadge slug="ai-agent" />
        <PriceChip slug="landing-page" />
        <PriceChip slug="dedicated-developer" text="$2,000/mo" />
      </>,
    );
    expect(screen.getByText("Starting at $1,000 per agent")).toBeTruthy();
    expect(screen.getByText("From $199")).toBeTruthy();
    expect(screen.getByText("$2,000/mo")).toBeTruthy();
  });
});
