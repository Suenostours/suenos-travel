import { describe, expect, it } from "vitest";
import { getSeoMeta } from "../../src/lib/seo-meta";
import {
  DESTINATION_CONTENT_LAST_MODIFIED,
  getStaticBlogLastModified,
  PRIORITY_SEO_LAST_MODIFIED,
  SITE_CONTENT_LAST_MODIFIED,
  STATIC_BLOG_PAGES,
  STATIC_DESTINATION_PAGES,
  STATIC_SITEMAP_PAGES,
} from "./sitemap-pages";

describe("STATIC_SITEMAP_PAGES", () => {
  it("includes every targeted B2B landing page once", () => {
    const paths = STATIC_SITEMAP_PAGES.map((page) => page.path);
    const targetPaths = [
      "/dmc-morocco",
      "/incoming-agency-morocco",
      "/circuits",
      "/morocco-group-tours",
      "/morocco-tours-for-travel-agencies",
      "/mice-morocco",
    ];

    for (const path of targetPaths) {
      expect(paths.filter((item) => item === path)).toHaveLength(1);
    }
  });

  it("uses unique, slash-normalized paths", () => {
    const paths = STATIC_SITEMAP_PAGES.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.filter((path) => path !== "/" && path.endsWith("/"))).toEqual([]);
  });

  it("marks the freshly optimized SEO pages with their real update date", () => {
    const priorityPaths = ["/blog", "/dmc-morocco", "/mice-morocco"];

    for (const path of priorityPaths) {
      expect(STATIC_SITEMAP_PAGES.find((page) => page.path === path)?.lastmod).toBe(PRIORITY_SEO_LAST_MODIFIED);
    }
  });

  it("dates the group planning refresh without changing unrelated landing pages", () => {
    expect(STATIC_SITEMAP_PAGES.find((page) => page.path === "/morocco-group-tours")?.lastmod).toBe("2026-10-11");
    expect(STATIC_SITEMAP_PAGES.find((page) => page.path === "/incoming-agency-morocco")?.lastmod).toBe(SITE_CONTENT_LAST_MODIFIED);
  });

  it("includes every editorial article once", () => {
    expect(STATIC_BLOG_PAGES).toHaveLength(7);
    expect(new Set(STATIC_BLOG_PAGES).size).toBe(STATIC_BLOG_PAGES.length);
  });

  it("publishes every static destination with its verified content date", () => {
    const paths = STATIC_DESTINATION_PAGES.map((destination) => destination.path);

    expect(paths).toHaveLength(10);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain("/destinations/fes");
    expect(paths).toContain("/destinations/merzouga");
    expect(STATIC_DESTINATION_PAGES.filter((page) => page.path !== "/destinations/fes").every((page) => page.lastmod === DESTINATION_CONTENT_LAST_MODIFIED)).toBe(true);
    expect(STATIC_DESTINATION_PAGES.find((page) => page.path === "/destinations/fes")?.lastmod).toBe("2026-10-11");
    expect(DESTINATION_CONTENT_LAST_MODIFIED).toBe("2026-10-03");
  });

  it("marks the refreshed DMC selection guide with its real update date", () => {
    expect(getStaticBlogLastModified("what-does-a-dmc-in-morocco-do-for-travel-agencies")).toBe(PRIORITY_SEO_LAST_MODIFIED);
    expect(getStaticBlogLastModified("morocco-travel-guide-2026")).toBe(SITE_CONTENT_LAST_MODIFIED);
  });

  it("updates only the refreshed B2B article and landing page dates", () => {
    const slug = "morocco-tours-for-travel-agencies-b2b-programs";
    expect(getStaticBlogLastModified(slug)).toBe("2026-10-11");
    expect(getStaticBlogLastModified(slug)).toBe(getSeoMeta(`/blog/${slug}`).dateModified);
    expect(STATIC_SITEMAP_PAGES.find((page) => page.path === "/morocco-tours-for-travel-agencies")?.lastmod).toBe("2026-10-11");
    expect(getStaticBlogLastModified("how-to-choose-a-morocco-incoming-agency")).toBe(SITE_CONTENT_LAST_MODIFIED);
    expect(STATIC_SITEMAP_PAGES.find((page) => page.path === "/dmc-morocco")?.lastmod).toBe(PRIORITY_SEO_LAST_MODIFIED);
  });
});
