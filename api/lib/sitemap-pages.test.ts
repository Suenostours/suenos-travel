import { describe, expect, it } from "vitest";
import { PRIORITY_SEO_LAST_MODIFIED, STATIC_BLOG_PAGES, STATIC_SITEMAP_PAGES } from "./sitemap-pages";

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
    const priorityPaths = ["/blog", "/dmc-morocco", "/morocco-group-tours", "/mice-morocco"];

    for (const path of priorityPaths) {
      expect(STATIC_SITEMAP_PAGES.find((page) => page.path === path)?.lastmod).toBe(PRIORITY_SEO_LAST_MODIFIED);
    }
  });

  it("includes every editorial article once", () => {
    expect(STATIC_BLOG_PAGES).toHaveLength(7);
    expect(new Set(STATIC_BLOG_PAGES).size).toBe(STATIC_BLOG_PAGES.length);
  });
});
