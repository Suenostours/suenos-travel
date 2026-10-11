import { describe, expect, it } from "vitest";
import { renderApp } from "../entry-server";
import { buildLandingSchemas } from "../pages/SEOLandingPage";
import { getSeoMeta } from "./seo-meta";

const path = "/morocco-group-tours";
const render = (pathname = path) => renderApp(pathname, {
  pathname,
  locale: "en",
  routeData: { kind: "none" },
});
const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#x27;");

describe("agency group planning content", () => {
  it("renders useful planning guidance and direct published itinerary links without JavaScript", () => {
    const html = render();
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Morocco Group Tours for Travel Agencies and Tour Operators");
    expect(html).toContain("How to choose a workable route for your group");
    expect(html).toContain("Request a group quote without a finished itinerary");
    expect(html).toContain("not guaranteed shared departures");
    expect(html).not.toContain("15 to 45 passengers");
    for (const slug of [
      "imperial-cities-morocco",
      "marrakech-atlas-mountains",
      "sahara-desert-experience",
      "north-morocco-tour",
      "agadir-south-morocco-discovery",
    ]) {
      expect(html).toContain(`href="/circuits/${slug}"`);
    }
    expect(html).toContain('href="/quote"');
    expect(html).toContain('href="/dmc-morocco"');
  });

  it("keeps every question and answer in the client FAQ schema identical to visible content", () => {
    const html = render();
    const faq = buildLandingSchemas("moroccoGroupTours")
      .find((schema) => schema.id === "landing-faq-schema")?.value;
    expect(faq?.["@type"]).toBe("FAQPage");
    if (!faq || !("mainEntity" in faq) || !faq.mainEntity) throw new Error("Missing group FAQ");
    expect(faq.mainEntity).toHaveLength(8);
    for (const item of faq.mainEntity) {
      expect(html).toContain(escapeHtml(item.name));
      expect(html).toContain(escapeHtml(item.acceptedAnswer.text));
    }
  });

  it("preserves the existing title, canonical and separate DMC page intent", () => {
    const meta = getSeoMeta(path);
    expect(meta.title).toBe("Morocco Group Tours for Travel Agencies | B2B DMC");
    expect(meta.canonical).toBe(`https://www.morocco-incoming.com${path}`);
    expect(meta.noindex).not.toBe(true);
    const dmc = render("/dmc-morocco");
    expect(dmc).toContain("DMC in Morocco for Travel Agencies and Tour Operators");
    expect(dmc).not.toContain("Request a group quote without a finished itinerary");
  });
});
