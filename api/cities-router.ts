import { z } from "zod";
import { createRouter, editorQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cities, cityTranslations, excursions, excursionTranslations } from "@db/schema";
import { eq } from "drizzle-orm";

export const citiesRouter = createRouter({
  list: editorQuery.query(async () => {
    const db = getDb();
    return db.select().from(cities).orderBy(cities.id);
  }),

  getById: editorQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const c = await db.select().from(cities).where(eq(cities.id, input.id)).limit(1);
    if (c.length === 0) return null;
    const translations = await db.select().from(cityTranslations).where(eq(cityTranslations.cityId, input.id));
    return { ...c[0], translations };
  }),

  create: editorQuery
    .input(
      z.object({
        slug: z.string().min(1),
        mainImage: z.string().optional(),
        gallery: z.array(z.string()).default([]),
        active: z.boolean().default(true),
        translations: z.array(
          z.object({
            locale: z.enum(["fr", "en"]),
            name: z.string().min(1),
            description: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(cities).values({
        slug: input.slug,
        mainImage: input.mainImage,
        gallery: input.gallery,
        active: input.active ? 1 : 0,
      });
      const cityId = Number(result[0].insertId);
      for (const tr of input.translations) {
        await db.insert(cityTranslations).values({ cityId, ...tr });
      }
      return { id: cityId };
    }),

  update: editorQuery
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).optional(),
        mainImage: z.string().optional(),
        gallery: z.array(z.string()).optional(),
        active: z.boolean().optional(),
        translations: z.array(
          z.object({
            locale: z.enum(["fr", "en"]),
            name: z.string().min(1),
            description: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
          }),
        ).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, translations, ...data } = input;
      const updateData: Record<string, unknown> = {};
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.mainImage !== undefined) updateData.mainImage = data.mainImage;
      if (data.gallery !== undefined) updateData.gallery = data.gallery;
      if (data.active !== undefined) updateData.active = data.active ? 1 : 0;
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        await db.update(cities).set(updateData).where(eq(cities.id, id));
      }
      if (translations) {
        await db.delete(cityTranslations).where(eq(cityTranslations.cityId, id));
        for (const tr of translations) {
          await db.insert(cityTranslations).values({ cityId: id, ...tr });
        }
      }
      return { success: true };
    }),

  delete: editorQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(cityTranslations).where(eq(cityTranslations.cityId, input.id));
    await db.delete(excursionTranslations).where(eq(excursionTranslations.excursionId, input.id));
    await db.delete(cities).where(eq(cities.id, input.id));
    return { success: true };
  }),
});

export const excursionsRouter = createRouter({
  list: editorQuery.query(async () => {
    const db = getDb();
    return db.select().from(excursions).orderBy(excursions.id);
  }),

  getById: editorQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const e = await db.select().from(excursions).where(eq(excursions.id, input.id)).limit(1);
    if (e.length === 0) return null;
    const translations = await db.select().from(excursionTranslations).where(eq(excursionTranslations.excursionId, input.id));
    return { ...e[0], translations };
  }),

  create: editorQuery
    .input(
      z.object({
        slug: z.string().min(1),
        cityId: z.number().optional(),
        mainImage: z.string().optional(),
        gallery: z.array(z.string()).default([]),
        duration: z.string().optional(),
        active: z.boolean().default(true),
        translations: z.array(
          z.object({
            locale: z.enum(["fr", "en"]),
            title: z.string().min(1),
            description: z.string().optional(),
            highlights: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(excursions).values({
        slug: input.slug,
        cityId: input.cityId,
        mainImage: input.mainImage,
        gallery: input.gallery,
        duration: input.duration,
        active: input.active ? 1 : 0,
      });
      const exId = Number(result[0].insertId);
      for (const tr of input.translations) {
        await db.insert(excursionTranslations).values({ excursionId: exId, ...tr });
      }
      return { id: exId };
    }),

  update: editorQuery
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).optional(),
        cityId: z.number().optional(),
        mainImage: z.string().optional(),
        gallery: z.array(z.string()).optional(),
        duration: z.string().optional(),
        active: z.boolean().optional(),
        translations: z.array(
          z.object({
            locale: z.enum(["fr", "en"]),
            title: z.string().min(1),
            description: z.string().optional(),
            highlights: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
          }),
        ).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, translations, ...data } = input;
      const updateData: Record<string, unknown> = {};
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.cityId !== undefined) updateData.cityId = data.cityId;
      if (data.mainImage !== undefined) updateData.mainImage = data.mainImage;
      if (data.gallery !== undefined) updateData.gallery = data.gallery;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.active !== undefined) updateData.active = data.active ? 1 : 0;
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        await db.update(excursions).set(updateData).where(eq(excursions.id, id));
      }
      if (translations) {
        await db.delete(excursionTranslations).where(eq(excursionTranslations.excursionId, id));
        for (const tr of translations) {
          await db.insert(excursionTranslations).values({ excursionId: id, ...tr });
        }
      }
      return { success: true };
    }),

  delete: editorQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(excursionTranslations).where(eq(excursionTranslations.excursionId, input.id));
    await db.delete(excursions).where(eq(excursions.id, input.id));
    return { success: true };
  }),
});
