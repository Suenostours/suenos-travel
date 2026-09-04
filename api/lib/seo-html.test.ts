import { describe, expect, it } from "vitest";
import { getSeoMeta, renderSeoHtml } from "./seo-html";

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
});
