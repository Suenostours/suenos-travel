import { describe, expect, it } from "vitest";
import { getSeoMeta, isKnownStaticContentPath, renderSeoHtml } from "./seo-html";

describe("SEO HTML rendering", () => {
  it("injects crawlable metadata for a public page", () => {
    const html = renderSeoHtml(
      '<html><head><!-- SEO_META_START --><title>Old</title><!-- SEO_META_END --></head><body></body></html>',
      "/dmc-morocco",
    );

    expect(html).toContain("DMC in Morocco for Travel Agencies | Licensed Local Partner");
    expect(html).toContain('rel="canonical" href="https://www.morocco-incoming.com/dmc-morocco"');
    expect(html).toContain('data-seo-path="/dmc-morocco"');
    expect(html).toContain('name="robots" content="index, follow"');
  });

  it("marks unknown and admin pages as noindex", () => {
    expect(getSeoMeta("/does-not-exist").noindex).toBe(true);
    expect(getSeoMeta("/admin/login").noindex).toBe(true);
  });

  it("normalizes trailing slashes in canonical URLs", () => {
    expect(getSeoMeta("/services/").canonical).toBe(
      "https://www.morocco-incoming.com/services",
    );
  });

  it("recognizes editorial and static destination detail pages", () => {
    expect(isKnownStaticContentPath("/blog/marrakech-hidden-gems")).toBe(true);
    expect(isKnownStaticContentPath("/destinations/tangier")).toBe(true);
    expect(isKnownStaticContentPath("/circuits/not-a-real-tour")).toBe(false);
  });

  it("emits safe server-rendered JSON-LD for articles", () => {
    const html = renderSeoHtml(
      "<html><head><title>Old</title></head><body></body></html>",
      "/blog/marrakech-hidden-gems",
    );

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('"@type":"BlogPosting"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html.match(/id="route-seo-graph"/g)).toHaveLength(1);
  });

  it("renders the same dynamic tour title used by the client resolver", () => {
    const html = renderSeoHtml(
      "<html><head><title>Old</title></head><body></body></html>",
      "/circuits/imperial-cities-morocco",
      {
        title: "Imperial Cities Morocco | Morocco DMC Tour for Agencies",
        description: "A classic route through Morocco's imperial cities.",
        noindex: false,
      },
    );

    expect(html).toContain("Imperial Cities Morocco | Morocco DMC Tour for Agencies");
    expect(html).toContain('name="robots" content="index, follow"');
  });

  it("does not emit structured data for a forced noindex response", () => {
    const html = renderSeoHtml(
      "<html><head><title>Old</title></head><body></body></html>",
      "/circuits/not-a-real-tour",
      { noindex: true },
    );

    expect(html).toContain('name="robots" content="noindex, nofollow"');
    expect(html).not.toContain('type="application/ld+json"');
  });

  it("keeps a dynamic tour indexable when its database lookup is temporarily unavailable", () => {
    const html = renderSeoHtml(
      "<html><head><title>Old</title></head><body></body></html>",
      "/circuits/imperial-cities-morocco",
    );

    expect(html).toContain("Imperial Cities Morocco | Morocco DMC Tour for Agencies");
    expect(html).toContain('name="robots" content="index, follow"');
    expect(html).toContain('id="route-seo-graph"');
  });

  it("renders reciprocal hreflang and additional safe tour schema", () => {
    const html = renderSeoHtml(
      "<html><head><title>Old</title></head><body></body></html>",
      "/fr/circuits/imperial-cities-morocco",
      {
        title: "Villes impériales du Maroc | Circuit au Maroc pour agences",
        description: "Circuit culturel.",
        noindex: false,
        alternates: {
          en: "https://www.morocco-incoming.com/circuits/imperial-cities-morocco",
          fr: "https://www.morocco-incoming.com/fr/circuits/imperial-cities-morocco",
          xDefault: "https://www.morocco-incoming.com/circuits/imperial-cities-morocco",
        },
      },
      [{ id: "tourist-trip-schema", value: { "@type": "TouristTrip", name: "</script>" } }],
    );

    expect(html).toContain('hreflang="en" href="https://www.morocco-incoming.com/circuits/imperial-cities-morocco"');
    expect(html).toContain('hreflang="fr" href="https://www.morocco-incoming.com/fr/circuits/imperial-cities-morocco"');
    expect(html).toContain('id="tourist-trip-schema"');
    expect(html).not.toContain("</script></script>");
  });
});
