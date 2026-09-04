import { Hono, type Context } from "hono";
import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { registerUploadRoutes } from "./upload-handler";
import { getDb } from "./queries/connection";
import { tours, cities, blogPosts, seoSettings } from "@db/schema";
import { eq, and } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { getCanonicalRedirect } from "./lib/canonical-url";
import { STATIC_SITEMAP_PAGES } from "./lib/sitemap-pages";
import { renderSeoHtml } from "./lib/seo-html";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use("*", compress());

app.use("*", async (c, next) => {
  await next();

  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net; frame-src https://www.googletagmanager.com https://td.doubleclick.net; font-src 'self' data:",
  );

  if (env.isProduction) {
    c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  const pathname = new URL(c.req.url).pathname;
  if (pathname.startsWith("/assets/")) {
    c.header("Cache-Control", "public, max-age=31536000, immutable");
  } else if (pathname.startsWith("/images/") || pathname === "/favicon.svg") {
    c.header("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
  } else if (c.res.headers.get("Content-Type")?.includes("text/html")) {
    c.header("Cache-Control", "no-cache");
  }
});

app.use("*", async (c, next) => {
  const redirectUrl = getCanonicalRedirect({
    requestUrl: c.req.url,
    method: c.req.method,
    forwardedHost: c.req.header("x-forwarded-host") ?? c.req.header("host"),
    forwardedProto: c.req.header("x-forwarded-proto"),
  });

  if (redirectUrl) return c.redirect(redirectUrl, 308);
  return next();
});

app.use("/api/upload", bodyLimit({ maxSize: 15 * 1024 * 1024 }));
app.use("/api/trpc/*", bodyLimit({ maxSize: 1 * 1024 * 1024 }));

function formatSitemapDate(value?: Date | string | null) {
  const fallback = new Date();
  const date = value ? new Date(value) : fallback;

  if (Number.isNaN(date.getTime())) {
    return fallback.toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function sitemapEntry(loc: string, lastmod: string, changefreq: string, priority: string) {
  return `<url>
  <loc>${loc}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>`;
}

// Upload routes
registerUploadRoutes(app);

// Sitemap.xml
app.get("/sitemap.xml", async (c) => {
  const baseUrl = "https://www.morocco-incoming.com";
  const today = formatSitemapDate();
  const urls = STATIC_SITEMAP_PAGES.map((page) =>
    sitemapEntry(
      `${baseUrl}${page.path}`,
      today,
      page.changefreq,
      page.priority.toFixed(1),
    ),
  );
  const staticBlogSlugs = [
    "what-does-a-dmc-in-morocco-do-for-travel-agencies",
    "how-to-choose-a-morocco-incoming-agency",
    "mice-morocco-best-destinations-for-incentive-groups",
  ];
  const legacyBlogSlugs = ["what-does-a-morocco-dmc-do-for-travel-agencies"];
  for (const slug of staticBlogSlugs) {
    urls.push(sitemapEntry(`${baseUrl}/blog/${slug}`, today, "monthly", "0.6"));
  }

  try {
    const db = getDb();
    const tourRows = await db.select({ slug: tours.slug, updatedAt: tours.updatedAt }).from(tours).where(eq(tours.active, 1));
    for (const t of tourRows) {
      urls.push(sitemapEntry(`${baseUrl}/circuits/${t.slug}`, formatSitemapDate(t.updatedAt), "monthly", "0.8"));
    }
    const cityRows = await db.select({ slug: cities.slug, updatedAt: cities.updatedAt }).from(cities).where(eq(cities.active, 1));
    for (const c of cityRows) {
      urls.push(sitemapEntry(`${baseUrl}/destinations/${c.slug}`, formatSitemapDate(c.updatedAt), "monthly", "0.7"));
    }
    const blogRows = await db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts).where(and(eq(blogPosts.status, "published"), eq(blogPosts.active, 1)));
    for (const b of blogRows) {
      if (staticBlogSlugs.includes(b.slug) || legacyBlogSlugs.includes(b.slug)) continue;
      urls.push(sitemapEntry(`${baseUrl}/blog/${b.slug}`, formatSitemapDate(b.updatedAt), "monthly", "0.6"));
    }
  } catch {
    console.warn("[sitemap] Database unavailable; serving static URLs only.");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  return c.text(xml, 200, { "Content-Type": "application/xml" });
});

// robots.txt
app.get("/robots.txt", (c) => {
  const baseUrl = "https://www.morocco-incoming.com";
  return c.text(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${baseUrl}/sitemap.xml\n`,
    200,
    { "Content-Type": "text/plain" },
  );
});

// ─── SEO: Explicit frontend routes (serve index.html) ───
async function serveIndexHtml(c: Context<{ Bindings: HttpBindings }>) {
  try {
    const filePath = path.resolve(import.meta.dirname, "../dist/public/index.html");
    const template = fs.readFileSync(filePath, "utf-8");
    const pathname = new URL(c.req.url).pathname;
    let override: {
      title?: string | null;
      description?: string | null;
      canonical?: string | null;
      image?: string | null;
    } | undefined;

    try {
      const rows = await getDb()
        .select()
        .from(seoSettings)
        .where(eq(seoSettings.path, pathname))
        .limit(1);
      const saved = rows[0];
      if (saved) {
        override = {
          title: saved.metaTitle,
          description: saved.metaDescription,
          canonical: saved.canonical,
          image: saved.ogImage,
        };
      }
    } catch {
      console.warn("[seo] Database unavailable; using page defaults.");
    }

    const content = renderSeoHtml(template, pathname, override);
    return c.html(content, 200);
  } catch {
    return c.json({ error: "index.html not found" }, 500);
  }
}

// Public SEO pages
app.get("/", serveIndexHtml);
app.get("/circuits", serveIndexHtml);
app.get("/circuits/:slug", serveIndexHtml);
app.get("/destinations", serveIndexHtml);
app.get("/destinations/:slug", serveIndexHtml);
app.get("/services", serveIndexHtml);
app.get("/about", serveIndexHtml);
app.get("/mice", serveIndexHtml);
app.get("/b2b", serveIndexHtml);
app.get("/blog", serveIndexHtml);
app.get("/blog/:slug", serveIndexHtml);
app.get("/contact", serveIndexHtml);
app.get("/quote", serveIndexHtml);
app.get("/privacy", serveIndexHtml);
app.get("/terms", serveIndexHtml);
app.get("/dmc-morocco", serveIndexHtml);
app.get("/incoming-agency-morocco", serveIndexHtml);
app.get("/morocco-tours-for-travel-agencies", serveIndexHtml);
app.get("/morocco-group-tours", serveIndexHtml);
app.get("/mice-morocco", serveIndexHtml);
app.get("/admin", serveIndexHtml);
app.get("/admin/:path", serveIndexHtml);
app.get("/admin/*", serveIndexHtml);

// tRPC endpoint
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
