import { describe, expect, it } from "vitest";
import type { Manifest } from "vite";
import { addRoutePreloads } from "./route-preloads";

const template = '<html><head><link rel="stylesheet" href="/assets/base-123.css"></head><body><h1>DMC Morocco</h1></body></html>';
const manifest: Manifest = {
  "src/pages/SEOLandingPage.tsx": {
    file: "assets/SEOLandingPage-123.js",
    imports: ["_SEO.js", "index.html"],
    css: ["assets/base-123.css"],
    dynamicImports: ["src/pages/AdminDashboard.tsx"],
  },
  "_SEO.js": { file: "assets/SEO-123.js", imports: ["index.html"] },
  "index.html": {
    file: "assets/index-123.js",
    imports: ["_SEO.js"],
    dynamicImports: ["src/pages/AdminDashboard.tsx"],
  },
  "src/pages/AdminDashboard.tsx": { file: "assets/admin-123.js" },
};

describe("DMC route preloading", () => {
  it("discovers hashed route and static dependency chunks from the first HTML response", () => {
    const html = addRoutePreloads(template, "/dmc-morocco", manifest);
    for (const asset of ["SEOLandingPage", "SEO", "index"]) {
      expect(html).toContain(`rel="modulepreload" href="/assets/${asset}-123.js" crossorigin`);
    }
    expect(html).toContain("<h1>DMC Morocco</h1>");
    expect(html).not.toContain("admin-123.js");
    expect(html.match(/base-123.css/g)).toHaveLength(1);
    expect(html.match(/href="\/assets\/SEO-123.js"/g)).toHaveLength(1);
    expect(addRoutePreloads(html, "/dmc-morocco", manifest)).toBe(html);
  });

  it.each(["/", "/admin", "/quote", "/b2b", "/fr/services", "/api/trpc/anything"])(
    "does not change unrelated route %s", (pathname) => {
      expect(addRoutePreloads(template, pathname, manifest)).toBe(template);
    },
  );

  it("fails safely for a missing manifest, incomplete dependencies or invalid assets", () => {
    expect(addRoutePreloads(template, "/dmc-morocco", {})).toBe(template);
    expect(addRoutePreloads(template, "/dmc-morocco", {
      "src/pages/SEOLandingPage.tsx": {
        file: 'https://untrusted.example/x.js',
        css: ['assets/../escape.css', 'assets/"bad.css'],
        imports: ["missing"],
      },
    })).toBe(template);
  });
});
