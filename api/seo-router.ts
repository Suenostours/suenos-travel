import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { seoSettings, tours, cities, blogPosts } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { STATIC_BLOG_PAGES, STATIC_SITEMAP_PAGES, SITE_CONTENT_LAST_MODIFIED } from "./lib/sitemap-pages";

const seoPath = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .regex(/^\/[a-z0-9\-_/]*$/i)
  .refine((path) => path === "/" || !path.endsWith("/"), "Use the canonical path without a trailing slash");
const relativeUrl = z.string().regex(/^\/[a-z0-9\-_/?.=&%]*$/i);
const optionalImageUrl = z.union([z.literal(""), z.string().url(), relativeUrl]).optional();
const optionalCanonicalUrl = z
  .union([z.literal(""), z.string().url(), relativeUrl])
  .refine((value) => {
    if (!value || value.startsWith("/")) return true;
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname === "morocco-incoming.com" || hostname === "www.morocco-incoming.com";
  }, "Canonical URL must use morocco-incoming.com")
  .optional();

function formatSitemapDate(value?: Date | string | null) {
  const fallback = new Date();
  const date = value ? new Date(value) : fallback;

  if (Number.isNaN(date.getTime())) {
    return fallback.toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

export const seoRouter = createRouter({
  getByPath: publicQuery.input(z.object({ path: seoPath })).query(async ({ input }) => {
    const db = getDb();
    const rows = await db.select().from(seoSettings).where(eq(seoSettings.path, input.path)).limit(1);
    return rows[0] ?? null;
  }),

  set: adminQuery
    .input(
      z.object({
        path: seoPath,
        metaTitle: z.string().trim().max(100).optional(),
        metaDescription: z.string().trim().max(320).optional(),
        ogImage: optionalImageUrl,
        canonical: optionalCanonicalUrl,
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(seoSettings).where(eq(seoSettings.path, input.path)).limit(1);
      if (existing.length > 0) {
        await db.update(seoSettings).set({ ...input, updatedAt: new Date() }).where(eq(seoSettings.id, existing[0].id));
      } else {
        await db.insert(seoSettings).values({ ...input });
      }
      return { success: true };
    }),

  sitemap: publicQuery.query(async () => {
    const db = getDb();
    const baseUrl = "https://www.morocco-incoming.com";
    const pages = STATIC_SITEMAP_PAGES.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastmod: page.lastmod,
      changefreq: page.changefreq,
      priority: page.priority,
    }));
    const legacyBlogSlugs = ["what-does-a-morocco-dmc-do-for-travel-agencies"];
    for (const slug of STATIC_BLOG_PAGES) {
      pages.push({ url: `${baseUrl}/blog/${slug}`, lastmod: SITE_CONTENT_LAST_MODIFIED, changefreq: "monthly", priority: 0.6 });
    }

    const tourRows = await db.select({ slug: tours.slug, updatedAt: tours.updatedAt }).from(tours).where(eq(tours.active, 1));
    for (const t of tourRows) {
      pages.push({ url: `${baseUrl}/circuits/${t.slug}`, lastmod: formatSitemapDate(t.updatedAt), changefreq: "monthly", priority: 0.8 });
    }

    const cityRows = await db.select({ slug: cities.slug, updatedAt: cities.updatedAt }).from(cities).where(eq(cities.active, 1));
    for (const c of cityRows) {
      pages.push({ url: `${baseUrl}/destinations/${c.slug}`, lastmod: formatSitemapDate(c.updatedAt), changefreq: "monthly", priority: 0.7 });
    }

    const blogRows = await db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), eq(blogPosts.active, 1)));
    for (const b of blogRows) {
      if (STATIC_BLOG_PAGES.includes(b.slug as (typeof STATIC_BLOG_PAGES)[number]) || legacyBlogSlugs.includes(b.slug)) continue;
      pages.push({ url: `${baseUrl}/blog/${b.slug}`, lastmod: formatSitemapDate(b.updatedAt), changefreq: "monthly", priority: 0.6 });
    }

    return pages;
  }),
});
