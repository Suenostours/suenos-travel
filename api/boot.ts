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
  cities,
  seoSettings,
} from "@db/schema";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { getCanonicalRedirect } from "./lib/canonical-url";
import { getStaticBlogLastModified, STATIC_BLOG_PAGES, STATIC_SITEMAP_PAGES } from "./lib/sitemap-pages";
import { isKnownStaticContentPath, renderSeoHtml } from "./lib/seo-html";
import { buildTourSeoMeta, type SeoOverrides } from "../src/lib/seo-meta";
import { getSeoResponseStatus, type DynamicContentState } from "./lib/seo-response";
import { getPublicTour, type PublicLocale } from "./queries/public-tour";
import { listPublicTours } from "./queries/public-tours";
import { hasReviewedFrenchEquivalent, splitLocalePath } from "../src/lib/locale-routes";
import { renderApp } from "../src/entry-server";
import {
  serializeSsrData,
  setHtmlDocumentLocale,
  SSR_DATA_ELEMENT_ID,
} from "../src/lib/ssr-payload";
import type { SsrData } from "../src/providers/ssr-data";
import { buildTouristTripSchema } from "../src/lib/tour-schema";
import { getRequestedTourSlug } from "../src/lib/quote-tour-context";
import {
  buildFrenchCommercialSchemas,
  frenchCommercialPages,
  type FrenchCommercialPageKey,
} from "../src/lib/french-commercial-content";
import {
  getStaticSitemapAlternates,
  getTourSitemapAlternates,
  type SitemapAlternates,
} from "./lib/sitemap-locales";
import { shouldPublishDatabaseDestination } from "./lib/sitemap-content";

type SeoOverride = SeoOverrides;

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
  } else if (pathname.startsWith("/images/") || pathname.startsWith("/favicon")) {
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

function sitemapEntry(
  loc: string,
  lastmod: string | undefined,
  changefreq: string,
  priority: string,
  alternates?: SitemapAlternates,
) {
  return `<url>
  <loc>${loc}</loc>
  ${alternates ? `<xhtml:link rel="alternate" hreflang="en" href="${alternates.en}" />
  <xhtml:link rel="alternate" hreflang="fr" href="${alternates.fr}" />
  <xhtml:link rel="alternate" hreflang="x-default" href="${alternates.xDefault}" />` : ""}
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>`;
}

function detailSlug(pathname: string, section: string) {
  const prefix = `/${section}/`;
  if (!pathname.startsWith(prefix)) return null;
  const slug = pathname.slice(prefix.length);
  return /^[a-z0-9-]+$/i.test(slug) ? slug : null;
}

async function loadDynamicTour(pathname: string, slug: string, locale: PublicLocale) {
  const data = await getPublicTour(slug, locale);
  const translation = data?.tour_translations;
  const tour = data?.tours;
  const override = tour && translation
    ? buildTourSeoMeta({
        pathname,
        title: translation.title,
        description: translation.description,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
        image: tour.mainImage,
        dateModified: tour.updatedAt?.toISOString(),
        hasFrenchEquivalent: data.hasFrenchTranslation,
      })
    : undefined;

  return { data, override };
}

function isSsrRoute(pathname: string) {
  return hasReviewedFrenchEquivalent(pathname);
}

const FRENCH_LANDING_KEYS: Partial<Record<string, FrenchCommercialPageKey>> = {
  "/incoming-agency-morocco": "incomingAgency",
  "/morocco-tours-for-travel-agencies": "toursForAgencies",
  "/mice-morocco": "miceMorocco",
};

function getLandingStructuredData(pathname: string) {
  const { locale, basePath } = splitLocalePath(pathname);
  if (locale === "fr") {
    const key = FRENCH_LANDING_KEYS[basePath];
    return key ? buildFrenchCommercialSchemas(frenchCommercialPages[key]) : undefined;
  }
  return undefined;
}

function injectSsrHtml(template: string, appHtml: string, ssrData: SsrData) {
  const payload = serializeSsrData(ssrData);
  const root = `<div id="root">${appHtml}</div>`;
  const dataScript = `<script id="${SSR_DATA_ELEMENT_ID}" type="application/json">${payload}</script>`;

  return setHtmlDocumentLocale(template, ssrData.locale)
    .replace('<div id="root"></div>', `${root}\n    ${dataScript}`);
}

// Upload routes
registerUploadRoutes(app);

// Sitemap.xml
app.get("/sitemap.xml", async (c) => {
  const baseUrl = "https://www.morocco-incoming.com";
  const urls = STATIC_SITEMAP_PAGES.flatMap((page) => {
    const alternates = getStaticSitemapAlternates(page.path);
    const entries = [sitemapEntry(
      `${baseUrl}${page.path}`,
      page.lastmod,
      page.changefreq,
      page.priority.toFixed(1),
      alternates,
    )];
    if (alternates) {
      entries.push(sitemapEntry(
        alternates.fr,
        page.lastmod,
        page.changefreq,
        page.priority.toFixed(1),
        alternates,
      ));
    }
    return entries;
  });
  for (const slug of STATIC_BLOG_PAGES) {
    urls.push(sitemapEntry(`${baseUrl}/blog/${slug}`, getStaticBlogLastModified(slug), "monthly", "0.6"));
  }

  try {
    const db = getDb();
    const englishCatalogue = await listPublicTours({ locale: "en" });
    const frenchCatalogue = await listPublicTours({ locale: "fr" });
    const englishTourSlugs = new Set(englishCatalogue.map((tour) => tour.slug));
    const frenchEligibleSlugs = new Set(frenchCatalogue.map((tour) => tour.slug));
    const tourRows = await db
      .select({
        slug: tours.slug,
        updatedAt: tours.updatedAt,
      })
      .from(tours)
      .where(eq(tours.active, 1));
    for (const t of tourRows) {
      if (!englishTourSlugs.has(t.slug)) continue;
      const en = `${baseUrl}/circuits/${t.slug}`;
      const fr = `${baseUrl}/fr/circuits/${t.slug}`;
      const alternates = getTourSitemapAlternates(t.slug, frenchEligibleSlugs.has(t.slug));
      urls.push(sitemapEntry(en, formatSitemapDate(t.updatedAt), "monthly", "0.8", alternates));
      if (alternates) {
        urls.push(sitemapEntry(fr, formatSitemapDate(t.updatedAt), "monthly", "0.8", alternates));
      }
    }
    const cityRows = await db.select({ slug: cities.slug, updatedAt: cities.updatedAt }).from(cities).where(eq(cities.active, 1));
    for (const c of cityRows) {
      const route = `/destinations/${c.slug}`;
      if (!shouldPublishDatabaseDestination(c.slug)) continue;
      urls.push(sitemapEntry(`${baseUrl}${route}`, formatSitemapDate(c.updatedAt), "monthly", "0.7"));
    }
  } catch {
    console.warn("[sitemap] Database unavailable; serving static URLs only.");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
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
    const requestUrl = new URL(c.req.url);
    const pathname = requestUrl.pathname;
    const { locale, basePath } = splitLocalePath(pathname);
    const isKnownStaticPath = isKnownStaticContentPath(pathname);
    const tourSlug = detailSlug(basePath, "circuits");
    const isDynamicTourDetail = Boolean(tourSlug) && !isKnownStaticPath;
    let override: SeoOverride | undefined;
    let dynamicContentState: DynamicContentState = "not-required";
    let catalogUnavailable = false;
    let ssrData: SsrData = { pathname, locale, routeData: { kind: "none" } };
    let extraStructuredData: Array<{ id: string; value: unknown }> | undefined;
    extraStructuredData = getLandingStructuredData(pathname);

    if (basePath === "/circuits") {
      try {
        const catalog = await listPublicTours({ locale });
        ssrData = {
          pathname,
          locale,
          routeData: {
            kind: "tour-catalog",
            locale,
            state: catalog.length > 0 ? "found" : "empty",
            data: catalog,
          },
        };
      } catch {
        catalogUnavailable = true;
        ssrData = {
          pathname,
          locale,
          routeData: { kind: "tour-catalog", locale, state: "unavailable" },
        };
        console.warn("[seo] Tour catalogue lookup unavailable; returning a temporary error.");
      }
    }

    if (basePath === "/quote") {
      const quoteTourSlug = getRequestedTourSlug(requestUrl.search);
      if (quoteTourSlug) {
        try {
          const quoteTour = await getPublicTour(quoteTourSlug, locale);
          ssrData = {
            pathname,
            locale,
            routeData: {
              kind: "quote-tour",
              slug: quoteTourSlug,
              locale,
              state: quoteTour ? "found" : "missing",
              data: quoteTour ?? undefined,
            },
          };
        } catch {
          ssrData = {
            pathname,
            locale,
            routeData: {
              kind: "quote-tour",
              slug: quoteTourSlug,
              locale,
              state: "unavailable",
            },
          };
          console.warn("[quote] Selected programme lookup unavailable; rendering a custom-request fallback.");
        }
      }
    }

    if (isDynamicTourDetail && tourSlug) {
      try {
        const loaded = await loadDynamicTour(pathname, tourSlug, locale);
        override = loaded.override;
        dynamicContentState = override ? "found" : "missing";
        if (loaded.data && override) {
          extraStructuredData = [{
            id: "tourist-trip-schema",
            value: buildTouristTripSchema({
              title: loaded.data.tour_translations!.title ?? loaded.data.tours.slug,
              description: override.description ?? "",
              image: override.image,
              canonical: override.canonical ?? `https://www.morocco-incoming.com${pathname}`,
              locale,
            }),
          }];
        }
        ssrData = {
          pathname,
          locale,
          routeData: {
            kind: "tour",
            slug: tourSlug,
            locale,
            state: loaded.data ? "found" : "missing",
            data: loaded.data ?? undefined,
          },
        };
      } catch {
        dynamicContentState = "unavailable";
        ssrData = {
          pathname,
          locale,
          routeData: { kind: "tour", slug: tourSlug, locale, state: "unavailable" },
        };
        console.warn("[seo] Dynamic tour lookup unavailable; returning a temporary error.");
      }
    }

    if (dynamicContentState !== "unavailable" && !catalogUnavailable) {
      try {
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
        console.warn("[seo] Saved metadata unavailable; using route metadata.");
      }
    }

    const isClientStaticDetail = Boolean(
      detailSlug(pathname, "destinations") || detailSlug(pathname, "blog"),
    );
    const status = catalogUnavailable ? 503 : getSeoResponseStatus({
      isKnownStaticPath,
      isClientStaticDetail,
      dynamicContentState,
    });
    if (status === 404) {
      override = {
        title: "Page Not Found | Suenos Travel DMC Morocco",
        description: "The requested page could not be found.",
        noindex: true,
      };
    }

    const seoContent = renderSeoHtml(template, pathname, override, extraStructuredData);
    const content = isSsrRoute(pathname)
      ? injectSsrHtml(
          seoContent,
          renderApp(`${pathname}${requestUrl.search}`, ssrData),
          ssrData,
        )
      : seoContent;
    if (status === 503) c.header("Retry-After", "300");
    return c.html(content, status);
  } catch (error) {
    console.error("[render] Failed to serve the application shell.", error);
    return c.json({ error: "index.html not found" }, 500);
  }
}

// Public SEO pages
app.get("/", serveIndexHtml);
app.get("/circuits", serveIndexHtml);
app.get("/circuits/:slug", serveIndexHtml);
app.get("/fr/circuits", serveIndexHtml);
app.get("/destinations", serveIndexHtml);
app.get("/destinations/:slug", serveIndexHtml);
app.get("/services", serveIndexHtml);
app.get("/fr", serveIndexHtml);
app.get("/fr/services", serveIndexHtml);
app.get("/fr/incoming-agency-morocco", serveIndexHtml);
app.get("/fr/morocco-tours-for-travel-agencies", serveIndexHtml);
app.get("/fr/mice-morocco", serveIndexHtml);
app.get("/fr/circuits/:slug", serveIndexHtml);
app.get("/about", serveIndexHtml);
app.get("/fr/about", serveIndexHtml);
app.get("/mice", serveIndexHtml);
app.get("/b2b", serveIndexHtml);
app.get("/blog", serveIndexHtml);
app.get("/blog/:slug", serveIndexHtml);
app.get("/contact", serveIndexHtml);
app.get("/quote", serveIndexHtml);
app.get("/fr/quote", serveIndexHtml);
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
