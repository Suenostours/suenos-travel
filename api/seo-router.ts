import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { seoSettings, tours, cities, blogPosts } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const seoRouter = createRouter({
  getByPath: publicQuery.input(z.object({ path: z.string() })).query(async ({ input }) => {
    const db = getDb();
    const rows = await db.select().from(seoSettings).where(eq(seoSettings.path, input.path)).limit(1);
    return rows[0] ?? null;
  }),

  set: adminQuery
    .input(
      z.object({
        path: z.string(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().optional(),
        canonical: z.string().optional(),
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

    const pages = [
      { url: `${baseUrl}/`, changefreq: "weekly", priority: 1.0 },
      { url: `${baseUrl}/circuits`, changefreq: "weekly", priority: 0.9 },
      { url: `${baseUrl}/destinations`, changefreq: "weekly", priority: 0.9 },
      { url: `${baseUrl}/services`, changefreq: "monthly", priority: 0.8 },
      { url: `${baseUrl}/about`, changefreq: "monthly", priority: 0.8 },
      { url: `${baseUrl}/mice`, changefreq: "monthly", priority: 0.8 },
      { url: `${baseUrl}/b2b`, changefreq: "monthly", priority: 0.8 },
      { url: `${baseUrl}/blog`, changefreq: "weekly", priority: 0.8 },
      { url: `${baseUrl}/contact`, changefreq: "monthly", priority: 0.7 },
      { url: `${baseUrl}/quote`, changefreq: "monthly", priority: 0.7 },
    ];

    const tourRows = await db.select({ slug: tours.slug, updatedAt: tours.updatedAt }).from(tours).where(eq(tours.active, 1));
    for (const t of tourRows) {
      pages.push({ url: `${baseUrl}/circuits/${t.slug}`, changefreq: "monthly", priority: 0.8 });
    }

    const cityRows = await db.select({ slug: cities.slug }).from(cities).where(eq(cities.active, 1));
    for (const c of cityRows) {
      pages.push({ url: `${baseUrl}/destinations/${c.slug}`, changefreq: "monthly", priority: 0.7 });
    }

    const blogRows = await db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), eq(blogPosts.active, 1)));
    for (const b of blogRows) {
      pages.push({ url: `${baseUrl}/blog/${b.slug}`, changefreq: "monthly", priority: 0.6 });
    }

    return pages;
  }),
});
