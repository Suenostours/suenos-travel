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
import {
  tours,
  tourTranslations,
  cities,
  cityTranslations,
  blogPosts,
  blogTranslations,
  seoSettings,
} from "@db/schema";
import { eq, and } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { getCanonicalRedirect } from "./lib/canonical-url";
import { STATIC_BLOG_PAGES, STATIC_SITEMAP_PAGES, SITE_CONTENT_LAST_MODIFIED } from "./lib/sitemap-pages";
import { isKnownStaticContentPath, renderSeoHtml } from "./lib/seo-html";

type SeoOverride = {
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  image?: string | null;
  type?: "website" | "article";
  datePublished?: string | null;
  dateModified?: string | null;
  noindex?: boolean;
};

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

function sitemapEntry(loc: string, lastmod: string | undefined, changefreq: string, priority: string) {
  return `<url>
  <loc>${loc}</loc>
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>`;
}

function cleanMetaDescription(value?: string | null) {
  if (!value) return undefined;
  const plain = value
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_>`~()]/g, " ")
    .replaceAll("[", " ")
    .replaceAll("]", " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= 160) return plain;
  return `${plain.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

function detailSlug(pathname: string, section: string) {
  const prefix = `/${section}/`;
  if (!pathname.startsWith(prefix)) return null;
  const slug = pathname.slice(prefix.length);
  return /^[a-z0-9-]+$/i.test(slug) ? slug : null;
}

function capitalizeLabel(value: string | null | undefined) {
  if (!value) return undefined;
  return value.charAt(0).toLocaleUpperCase("en") + value.slice(1);
}

async function loadDynamicSeo(pathname: string): Promise<SeoOverride | undefined> {
  const db = getDb();
  const tourSlug = detailSlug(pathname, "circuits");
  if (tourSlug) {
    const rows = await db
      .select({
        title: tourTranslations.title,
        description: tourTranslations.description,
        metaTitle: tourTranslations.metaTitle,
        metaDescription: tourTranslations.metaDescription,
        image: tours.mainImage,
        updatedAt: tours.updatedAt,
      })
      .from(tours)
      .leftJoin(
        tourTranslations,
        and(eq(tourTranslations.tourId, tours.id), eq(tourTranslations.locale, "en")),
      )
      .where(and(eq(tours.slug, tourSlug), eq(tours.active, 1)))
      .limit(1);
    const tour = rows[0];
    if (tour) {
      return {
        title: tour.metaTitle || (tour.title ? `${tour.title} | Morocco Circuit` : undefined),
        description: tour.metaDescription || cleanMetaDescription(tour.description),
        image: tour.image,
        dateModified: tour.updatedAt?.toISOString(),
      };
    }
  }

  const citySlug = detailSlug(pathname, "destinations");
  if (citySlug) {
    const rows = await db
      .select({
        name: cityTranslations.name,
        description: cityTranslations.description,
        metaTitle: cityTranslations.metaTitle,
        metaDescription: cityTranslations.metaDescription,
        image: cities.mainImage,
        updatedAt: cities.updatedAt,
      })
      .from(cities)
      .leftJoin(
        cityTranslations,
        and(eq(cityTranslations.cityId, cities.id), eq(cityTranslations.locale, "en")),
      )
      .where(and(eq(cities.slug, citySlug), eq(cities.active, 1)))
      .limit(1);
    const city = rows[0];
    if (city) {
      const cityName = capitalizeLabel(city.name);
      return {
        title: city.metaTitle || (cityName ? `${cityName} Morocco Programs | Local DMC` : undefined),
        description: city.metaDescription || cleanMetaDescription(city.description),
        image: city.image,
        dateModified: city.updatedAt?.toISOString(),
      };
    }
  }

  const blogSlug = detailSlug(pathname, "blog");
  if (blogSlug) {
    const rows = await db
      .select({
        title: blogTranslations.title,
        content: blogTranslations.content,
        metaTitle: blogTranslations.metaTitle,
        metaDescription: blogTranslations.metaDescription,
        image: blogPosts.mainImage,
        publishedAt: blogPosts.publishedAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .leftJoin(
        blogTranslations,
        and(eq(blogTranslations.postId, blogPosts.id), eq(blogTranslations.locale, "en")),
      )
      .where(
        and(
          eq(blogPosts.slug, blogSlug),
          eq(blogPosts.status, "published"),
          eq(blogPosts.active, 1),
        ),
      )
      .limit(1);
    const post = rows[0];
    if (post) {
      return {
        title: post.metaTitle || (post.title ? `${post.title} | Suenos Travel Blog` : undefined),
        description: post.metaDescription || cleanMetaDescription(post.content),
        image: post.image,
        type: "article",
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt?.toISOString(),
      };
    }
  }

  return undefined;
}

// Upload routes
registerUploadRoutes(app);

// Sitemap.xml
app.get("/sitemap.xml", async (c) => {
  const baseUrl = "https://www.morocco-incoming.com";
  const urls = STATIC_SITEMAP_PAGES.map((page) =>
    sitemapEntry(
      `${baseUrl}${page.path}`,
      page.lastmod,
      page.changefreq,
      page.priority.toFixed(1),
    ),
  );
  const legacyBlogSlugs = ["what-does-a-morocco-dmc-do-for-travel-agencies"];
  for (const slug of STATIC_BLOG_PAGES) {
    urls.push(sitemapEntry(`${baseUrl}/blog/${slug}`, SITE_CONTENT_LAST_MODIFIED, "monthly", "0.6"));
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
      if (STATIC_BLOG_PAGES.includes(b.slug as (typeof STATIC_BLOG_PAGES)[number]) || legacyBlogSlugs.includes(b.slug)) continue;
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
    let override: SeoOverride | undefined;
    let databaseAvailable = true;
    let dynamicContentFound = false;

    try {
      override = await loadDynamicSeo(pathname);
      dynamicContentFound = Boolean(override);
      const rows = await getDb()
        .select()
        .from(seoSettings)
        .where(eq(seoSettings.path, pathname))
        .limit(1);
      const saved = rows[0];
      if (saved) {
        override = {
          ...override,
          ...(saved.metaTitle?.trim() ? { title: saved.metaTitle } : {}),
          ...(saved.metaDescription?.trim() ? { description: saved.metaDescription } : {}),
          ...(saved.canonical?.trim() ? { canonical: saved.canonical } : {}),
          ...(saved.ogImage?.trim() ? { image: saved.ogImage } : {}),
        };
      }
    } catch {
      databaseAvailable = false;
      console.warn("[seo] Database unavailable; using page defaults.");
    }

    const isDetailPath = Boolean(
      detailSlug(pathname, "circuits") ||
      detailSlug(pathname, "destinations") ||
      detailSlug(pathname, "blog"),
    );
    const isMissingDynamicContent =
      databaseAvailable &&
      isDetailPath &&
      !dynamicContentFound &&
      !isKnownStaticContentPath(pathname);
    if (isMissingDynamicContent) {
      override = {
        title: "Page Not Found | Suenos Travel DMC Morocco",
        description: "The requested page could not be found.",
        noindex: true,
      };
    }

    const content = renderSeoHtml(template, pathname, override);
    return c.html(content, isMissingDynamicContent ? 404 : 200);
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
