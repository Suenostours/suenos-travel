import { z } from "zod";
import { createRouter, publicQuery, editorQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { blogPosts, blogTranslations, contactRequests, quoteRequests, partnerRequests, media } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export const blogRouter = createRouter({
  list: editorQuery.query(async () => {
    const db = getDb();
    return db.select().from(blogPosts).orderBy(sql`${blogPosts.createdAt} DESC`);
  }),

  getById: editorQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const p = await db.select().from(blogPosts).where(eq(blogPosts.id, input.id)).limit(1);
    if (p.length === 0) return null;
    const translations = await db.select().from(blogTranslations).where(eq(blogTranslations.postId, input.id));
    return { ...p[0], translations };
  }),

  create: editorQuery
    .input(
      z.object({
        slug: z.string().min(1),
        mainImage: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).default([]),
        status: z.enum(["draft", "published"]).default("draft"),
        publishedAt: z.string().optional(),
        active: z.boolean().default(true),
        translations: z.array(
          z.object({
            locale: z.enum(["fr", "en"]),
            title: z.string().min(1),
            content: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(blogPosts).values({
        slug: input.slug,
        mainImage: input.mainImage,
        category: input.category,
        tags: input.tags,
        status: input.status,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        active: input.active ? 1 : 0,
      });
      const postId = Number(result[0].insertId);
      for (const tr of input.translations) {
        await db.insert(blogTranslations).values({ postId, ...tr });
      }
      return { id: postId };
    }),

  update: editorQuery
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).optional(),
        mainImage: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: z.enum(["draft", "published"]).optional(),
        publishedAt: z.string().optional(),
        active: z.boolean().optional(),
        translations: z.array(
          z.object({
            locale: z.enum(["fr", "en"]),
            title: z.string().min(1),
            content: z.string().optional(),
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
      if (data.category !== undefined) updateData.category = data.category;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
      if (data.active !== undefined) updateData.active = data.active ? 1 : 0;
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
      }
      if (translations) {
        await db.delete(blogTranslations).where(eq(blogTranslations.postId, id));
        for (const tr of translations) {
          await db.insert(blogTranslations).values({ postId: id, ...tr });
        }
      }
      return { success: true };
    }),

  delete: editorQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(blogTranslations).where(eq(blogTranslations.postId, input.id));
    await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
    return { success: true };
  }),
});

export const formsRouter = createRouter({
  // Contact
  createContact: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().optional(),
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contactRequests).values(input);
      return { success: true };
    }),

  listContacts: editorQuery.query(async () => {
    const db = getDb();
    return db.select().from(contactRequests).orderBy(sql`${contactRequests.createdAt} DESC`);
  }),

  updateContactStatus: editorQuery
    .input(z.object({ id: z.number(), status: z.enum(["new", "treated", "archived"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(contactRequests).set({ status: input.status }).where(eq(contactRequests.id, input.id));
      return { success: true };
    }),

  // Quotes
  createQuote: publicQuery
    .input(
      z.object({
        agencyName: z.string().optional(),
        contactPerson: z.string().optional(),
        email: z.string().email(),
        whatsapp: z.string().optional(),
        country: z.string().optional(),
        travelType: z.string().optional(),
        dates: z.string().optional(),
        duration: z.string().optional(),
        adults: z.number().optional(),
        children: z.number().optional(),
        preferredDestinations: z.string().optional(),
        preferredCircuit: z.string().optional(),
        hotelCategory: z.string().optional(),
        transportType: z.string().optional(),
        guideLanguage: z.string().optional(),
        budgetRange: z.string().optional(),
        specialRequests: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(quoteRequests).values(input);
      return { success: true };
    }),

  listQuotes: editorQuery.query(async () => {
    const db = getDb();
    return db.select().from(quoteRequests).orderBy(sql`${quoteRequests.createdAt} DESC`);
  }),

  updateQuoteStatus: editorQuery
    .input(z.object({ id: z.number(), status: z.enum(["new", "treated", "archived"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(quoteRequests).set({ status: input.status }).where(eq(quoteRequests.id, input.id));
      return { success: true };
    }),

  // Partners
  createPartner: publicQuery
    .input(
      z.object({
        agencyName: z.string().min(1),
        country: z.string().optional(),
        website: z.string().optional(),
        contactPerson: z.string().min(1),
        email: z.string().email(),
        whatsapp: z.string().optional(),
        businessType: z.string().optional(),
        expectedVolume: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(partnerRequests).values(input);
      return { success: true };
    }),

  listPartners: editorQuery.query(async () => {
    const db = getDb();
    return db.select().from(partnerRequests).orderBy(sql`${partnerRequests.createdAt} DESC`);
  }),

  updatePartnerStatus: editorQuery
    .input(z.object({ id: z.number(), status: z.enum(["new", "treated", "archived"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(partnerRequests).set({ status: input.status }).where(eq(partnerRequests.id, input.id));
      return { success: true };
    }),
});

export const mediaRouter = createRouter({
  list: editorQuery.query(async () => {
    const db = getDb();
    return db.select().from(media).orderBy(sql`${media.createdAt} DESC`);
  }),

  delete: editorQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(media).where(eq(media.id, input.id));
    return { success: true };
  }),
});
