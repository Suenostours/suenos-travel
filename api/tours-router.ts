import { z } from "zod";
import { createRouter, editorQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { tours, tourTranslations, tourCities } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export const toursRouter = createRouter({
  list: editorQuery.query(async () => {
    const db = getDb();
    return db.select().from(tours).orderBy(sql`${tours.createdAt} DESC`);
  }),

  getById: editorQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const t = await db.select().from(tours).where(eq(tours.id, input.id)).limit(1);
    if (t.length === 0) return null;
    const translations = await db.select().from(tourTranslations).where(eq(tourTranslations.tourId, input.id));
    const cityLinks = await db.select().from(tourCities).where(eq(tourCities.tourId, input.id));
    return { ...t[0], translations, cityIds: cityLinks.map((c) => c.cityId) };
  }),

  create: editorQuery
    .input(
      z.object({
        slug: z.string().min(1),
        mainImage: z.string().optional(),
        gallery: z.array(z.string()).default([]),
        duration: z.string().optional(),
        type: z.enum(["private", "small_group", "corporate", "desert", "family", "luxury", "cultural", "adventure", "short_break", "coast", "sports", "wellness", "romantic"]),
        featured: z.boolean().default(false),
        active: z.boolean().default(true),
        cityIds: z.array(z.number()).default([]),
        translations: z.array(
          z.object({
            locale: z.enum(["fr", "en"]),
            title: z.string().min(1),
            description: z.string().optional(),
            program: z.string().optional(),
            highlights: z.string().optional(),
            inclusions: z.string().optional(),
            exclusions: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(tours).values({
        slug: input.slug,
        mainImage: input.mainImage,
        gallery: input.gallery,
        duration: input.duration,
        type: input.type,
        featured: input.featured ? 1 : 0,
        active: input.active ? 1 : 0,
      });
      const tourId = Number(result[0].insertId);
      for (const tr of input.translations) {
        await db.insert(tourTranslations).values({ tourId, ...tr });
      }
      for (const cityId of input.cityIds) {
        await db.insert(tourCities).values({ tourId, cityId });
      }
      return { id: tourId };
    }),

  update: editorQuery
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).optional(),
        mainImage: z.string().optional(),
        gallery: z.array(z.string()).optional(),
        duration: z.string().optional(),
        type: z.enum(["private", "small_group", "corporate", "desert", "family", "luxury", "cultural", "adventure", "short_break", "coast", "sports", "wellness", "romantic"]).optional(),
        featured: z.boolean().optional(),
        active: z.boolean().optional(),
        cityIds: z.array(z.number()).optional(),
        translations: z.array(
          z.object({
            locale: z.enum(["fr", "en"]),
            title: z.string().min(1),
            description: z.string().optional(),
            program: z.string().optional(),
            highlights: z.string().optional(),
            inclusions: z.string().optional(),
            exclusions: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
          }),
        ).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, translations, cityIds, ...data } = input;
      const updateData: Record<string, unknown> = {};
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.mainImage !== undefined) updateData.mainImage = data.mainImage;
      if (data.gallery !== undefined) updateData.gallery = data.gallery;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.featured !== undefined) updateData.featured = data.featured ? 1 : 0;
      if (data.active !== undefined) updateData.active = data.active ? 1 : 0;
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        await db.update(tours).set(updateData).where(eq(tours.id, id));
      }
      if (translations) {
        await db.delete(tourTranslations).where(eq(tourTranslations.tourId, id));
        for (const tr of translations) {
          await db.insert(tourTranslations).values({ tourId: id, ...tr });
        }
      }
      if (cityIds) {
        await db.delete(tourCities).where(eq(tourCities.tourId, id));
        for (const cityId of cityIds) {
          await db.insert(tourCities).values({ tourId: id, cityId });
        }
      }
      return { success: true };
    }),

  delete: editorQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(tourTranslations).where(eq(tourTranslations.tourId, input.id));
    await db.delete(tourCities).where(eq(tourCities.tourId, input.id));
    await db.delete(tours).where(eq(tours.id, input.id));
    return { success: true };
  }),
});
