import { describe, expect, it } from "vitest";
import { getSeoMeta, isKnownStaticContentPath, renderSeoHtml } from "./seo-html";

describe("SEO HTML rendering", () => {
  it("injects crawlable metadata for a public page", () => {
    const html = renderSeoHtml(
      '<html><head><!-- SEO_META_START --><title>Old</title><!-- SEO_META_END --></head><body></body></html>',
      "/dmc-morocco",
    );

    expect(html).toContain("DMC Morocco for Travel Agencies | Local B2B Partner");
    expect(html).toContain('rel="canonical" href="https://www.morocco-incoming.com/dmc-morocco"');
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
});
