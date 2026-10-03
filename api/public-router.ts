import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cities, cityTranslations, excursions, excursionTranslations, blogPosts, blogTranslations } from "@db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getPublicTour } from "./queries/public-tour";
import { listPublicTours } from "./queries/public-tours";

function withLocale(locale: string) {
  return locale === "fr" ? "fr" : "en";
}

export const publicRouter = createRouter({
  // ─── Tours ───
  listTours: publicQuery
    .input(z.object({ locale: z.string().optional(), type: z.string().optional(), featured: z.boolean().optional() }))
    .query(async ({ input }) => {
      const locale = withLocale(input.locale ?? "en");
      return listPublicTours({ ...input, locale });
    }),

  getTour: publicQuery
    .input(
      z.object({
        slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9-]+$/),
        locale: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const locale = withLocale(input.locale ?? "en");
      return getPublicTour(input.slug, locale);
    }),

  // ─── Cities ───
  listCities: publicQuery
    .input(z.object({ locale: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const locale = withLocale(input.locale ?? "en");
      return db
        .select({ id: cities.id, slug: cities.slug, mainImage: cities.mainImage, name: cityTranslations.name, description: cityTranslations.description })
        .from(cities)
        .leftJoin(cityTranslations, and(eq(cityTranslations.cityId, cities.id), eq(cityTranslations.locale, locale)))
        .where(eq(cities.active, 1));
    }),

  getCity: publicQuery
    .input(z.object({ slug: z.string(), locale: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const locale = withLocale(input.locale ?? "en");
      const rows = await db
        .select()
        .from(cities)
        .leftJoin(cityTranslations, and(eq(cityTranslations.cityId, cities.id), eq(cityTranslations.locale, locale)))
        .where(eq(cities.slug, input.slug))
        .limit(1);
      return rows[0] ?? null;
    }),

  // ─── Excursions ───
  listExcursions: publicQuery
    .input(z.object({ locale: z.string().optional(), citySlug: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const locale = withLocale(input.locale ?? "en");
      const conditions = [eq(excursions.active, 1)];
      const query = db
        .select({
          id: excursions.id,
          slug: excursions.slug,
          mainImage: excursions.mainImage,
          duration: excursions.duration,
          title: excursionTranslations.title,
          description: excursionTranslations.description,
          cityName: cityTranslations.name,
        })
        .from(excursions)
        .leftJoin(excursionTranslations, and(eq(excursionTranslations.excursionId, excursions.id), eq(excursionTranslations.locale, locale)))
        .leftJoin(cities, eq(cities.id, excursions.cityId))
        .leftJoin(cityTranslations, and(eq(cityTranslations.cityId, cities.id), eq(cityTranslations.locale, locale)))
        .where(and(...conditions));
      return query;
    }),

  getExcursion: publicQuery
    .input(z.object({ slug: z.string(), locale: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const locale = withLocale(input.locale ?? "en");
      const rows = await db
        .select()
        .from(excursions)
        .leftJoin(excursionTranslations, and(eq(excursionTranslations.excursionId, excursions.id), eq(excursionTranslations.locale, locale)))
        .where(eq(excursions.slug, input.slug))
        .limit(1);
      return rows[0] ?? null;
    }),

  // ─── Blog ───
  listBlogPosts: publicQuery
    .input(z.object({ locale: z.string().optional(), category: z.string().optional(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const locale = withLocale(input.locale ?? "en");
      const conditions = [eq(blogPosts.status, "published"), eq(blogPosts.active, 1)];
      if (input.category) conditions.push(sql`${blogPosts.category} = ${input.category}`);
      const rows = await db
        .select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          mainImage: blogPosts.mainImage,
          category: blogPosts.category,
          tags: blogPosts.tags,
          publishedAt: blogPosts.publishedAt,
          title: blogTranslations.title,
          content: sql<string>`SUBSTRING(${blogTranslations.content}, 1, 300)`,
        })
        .from(blogPosts)
        .leftJoin(blogTranslations, and(eq(blogTranslations.postId, blogPosts.id), eq(blogTranslations.locale, locale)))
        .where(and(...conditions))
        .orderBy(sql`${blogPosts.publishedAt} DESC`)
        .limit(input.limit ?? 100);
      return rows;
    }),

  getBlogPost: publicQuery
    .input(z.object({ slug: z.string(), locale: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const locale = withLocale(input.locale ?? "en");
      const rows = await db
        .select()
        .from(blogPosts)
        .leftJoin(blogTranslations, and(eq(blogTranslations.postId, blogPosts.id), eq(blogTranslations.locale, locale)))
        .where(and(eq(blogPosts.slug, input.slug), eq(blogPosts.status, "published"), eq(blogPosts.active, 1)))
        .limit(1);
      return rows[0] ?? null;
    }),
});
