import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { seoSettings, tours, cities, blogPosts } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { STATIC_SITEMAP_PAGES } from "./lib/sitemap-pages";

const seoPath = z.string().trim().min(1).max(255).regex(/^\/[a-z0-9\-_/]*$/i);
const optionalUrl = z.union([z.literal(""), z.string().url(), z.string().regex(/^\/[a-z0-9\-_/?.=&%]*$/i)]).optional();

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
        ogImage: optionalUrl,
        canonical: optionalUrl,
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
    const today = formatSitemapDate();

    const pages = STATIC_SITEMAP_PAGES.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    }));
    const staticBlogSlugs = [
      "what-does-a-dmc-in-morocco-do-for-travel-agencies",
      "how-to-choose-a-morocco-incoming-agency",
      "mice-morocco-best-destinations-for-incentive-groups",
    ];
    const legacyBlogSlugs = ["what-does-a-morocco-dmc-do-for-travel-agencies"];
    for (const slug of staticBlogSlugs) {
      pages.push({ url: `${baseUrl}/blog/${slug}`, lastmod: today, changefreq: "monthly", priority: 0.6 });
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
      if (staticBlogSlugs.includes(b.slug) || legacyBlogSlugs.includes(b.slug)) continue;
      pages.push({ url: `${baseUrl}/blog/${b.slug}`, lastmod: formatSitemapDate(b.updatedAt), changefreq: "monthly", priority: 0.6 });
    }

    return pages;
  }),
});
