import { describe, expect, it } from "vitest";
import { renderApp } from "../entry-server";
import { buildLandingSchemas } from "./seo-landing-schemas";
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

const groupSchemaSource = {
  path,
  targetKeyword: "Morocco group tours for travel agencies",
  metaDescription: "Plan Morocco group tours with a licensed local DMC: custom itineraries, hotels, coaches, guides, net agency rates and on-site support.",
  h1: "Morocco Group Tours for Travel Agencies and Tour Operators",
  faq: [
    { question: "What group sizes can you support in Morocco?", answer: "We support small private groups, leisure groups, corporate groups and larger series depending on route, hotels and season." },
    { question: "Can group tours be customized by market?", answer: "Yes. We adapt pacing, hotel category, guide language, meals and experiences according to the client market and agency brief." },
    { question: "Do group programs include guides and transport?", answer: "Yes. Group programs can include licensed guides, private transport, airport transfers, visits, hotels, meals and local experiences." },
    { question: "Can you manage Morocco series departures for tour operators?", answer: "Yes. We can coordinate repeat group departures with consistent routing, guides, transport, hotels and supplier follow-up, subject to dates and availability." },
    { question: "Can you accommodate dietary or mobility requirements?", answer: "Yes. Agencies should share dietary, accessibility and mobility requirements at the quotation stage so suitable services and realistic routing can be planned." },
    { question: "Are these private agency groups or shared departures?", answer: "This page is for private group programs arranged for travel agencies and tour operators. Published itineraries are planning examples, not a schedule of guaranteed shared departures. Dates, passenger numbers and services are agreed for each request." },
    { question: "What is included in a Morocco group net-rate proposal?", answer: "The written proposal should specify the requested accommodation, rooming basis, transport, guiding, meals and visits, together with exclusions and optional services. Inclusions depend on the brief; flights, tips, insurance and group-leader places should not be assumed included unless stated." },
    { question: "Can we request a proposal before the group size is final?", answer: "Yes. Send an estimated passenger count and mark it as provisional. Explain whether you are considering more than one group size so the proposal can be discussed on clear assumptions. Final services and rates remain subject to the agreed numbers, dates and availability." },
  ],
};

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
    const faq = buildLandingSchemas(groupSchemaSource)
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
