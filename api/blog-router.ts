import { z } from "zod";
import { createRouter, publicQuery, editorQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { blogPosts, blogTranslations, contactRequests, quoteRequests, partnerRequests, media } from "@db/schema";
import { eq, sql } from "drizzle-orm";
import { sendSubmissionNotification } from "./lib/notification-email";
import { TRPCError } from "@trpc/server";

const SUBMISSION_WINDOW_MS = 15 * 60 * 1000;
const SUBMISSION_MAX_ATTEMPTS = 8;
const submissionAttempts = new Map<string, number[]>();

function enforceSubmissionRateLimit(req: Request) {
  const client = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const cutoff = Date.now() - SUBMISSION_WINDOW_MS;
  const recent = (submissionAttempts.get(client) ?? []).filter((timestamp) => timestamp > cutoff);
  if (recent.length >= SUBMISSION_MAX_ATTEMPTS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests. Please try again in 15 minutes.",
    });
  }
  submissionAttempts.set(client, [...recent, Date.now()]);
}

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
        name: z.string().trim().min(1).max(255),
        email: z.string().email(),
        phone: z.string().max(50).optional(),
        subject: z.string().max(255).optional(),
        message: z.string().trim().min(1).max(5000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      enforceSubmissionRateLimit(ctx.req);
      const db = getDb();
      await db.insert(contactRequests).values(input);
      await sendSubmissionNotification({
        type: "Contact Request",
        replyTo: input.email,
        fields: [
          { label: "Name", value: input.name },
          { label: "Email", value: input.email },
          { label: "Phone", value: input.phone },
          { label: "Subject / Request Type", value: input.subject },
          { label: "Message / Notes", value: input.message },
          { label: "Created At", value: new Date().toISOString() },
        ],
      });
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
        agencyName: z.string().max(255).optional(),
        contactPerson: z.string().max(255).optional(),
        email: z.string().email(),
        whatsapp: z.string().max(50).optional(),
        country: z.string().max(100).optional(),
        travelType: z.string().max(50).optional(),
        dates: z.string().max(100).optional(),
        numberOfPax: z.number().int().positive().max(10000).optional(),
        duration: z.string().max(50).optional(),
        adults: z.number().int().nonnegative().max(10000).optional(),
        children: z.number().int().nonnegative().max(10000).optional(),
        preferredDestinations: z.string().max(2000).optional(),
        preferredCircuit: z.string().max(255).optional(),
        hotelCategory: z.string().max(50).optional(),
        transportType: z.string().max(50).optional(),
        guideLanguage: z.string().max(50).optional(),
        budgetRange: z.string().max(100).optional(),
        specialRequests: z.string().trim().max(5000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      enforceSubmissionRateLimit(ctx.req);
      const db = getDb();
      const { numberOfPax, ...storedInput } = input;
      const storedBrief = [
        input.specialRequests?.trim(),
        numberOfPax ? `Number of Pax: ${numberOfPax}` : "",
      ].filter(Boolean).join("\n");
      await db.insert(quoteRequests).values({
        ...storedInput,
        specialRequests: storedBrief || undefined,
      });
      const legacyPax = (input.adults ?? 0) + (input.children ?? 0);
      const totalPax = numberOfPax ?? (legacyPax || undefined);
      await sendSubmissionNotification({
        type: "Quote Request",
        replyTo: input.email,
        fields: [
          { label: "Agency Name", value: input.agencyName },
          { label: "Contact Person", value: input.contactPerson },
          { label: "Email", value: input.email },
          { label: "Phone / WhatsApp", value: input.whatsapp },
          { label: "Country", value: input.country },
          { label: "Request Type", value: input.travelType },
          { label: "Travel Dates", value: input.dates },
          { label: "Duration", value: input.duration },
          { label: "Number of Pax", value: totalPax || undefined },
          { label: "Adults", value: input.adults },
          { label: "Children", value: input.children },
          { label: "Destinations", value: input.preferredDestinations },
          { label: "Preferred Circuit", value: input.preferredCircuit },
          { label: "Hotel Category", value: input.hotelCategory },
          { label: "Transport Type", value: input.transportType },
          { label: "Guide Language", value: input.guideLanguage },
          { label: "Budget", value: input.budgetRange },
          { label: "Request / Brief", value: input.specialRequests },
          { label: "Created At", value: new Date().toISOString() },
        ],
      });
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
        agencyName: z.string().trim().min(1).max(255),
        country: z.string().trim().min(1).max(100),
        website: z.string().max(255).optional(),
        contactPerson: z.string().trim().min(1).max(255),
        email: z.string().email(),
        whatsapp: z.string().max(50).optional(),
        businessType: z.string().trim().min(1).max(100),
        expectedVolume: z.string().max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      enforceSubmissionRateLimit(ctx.req);
      const db = getDb();
      await db.insert(partnerRequests).values(input);
      await sendSubmissionNotification({
        type: "B2B Partner Request",
        replyTo: input.email,
        fields: [
          { label: "Agency Name", value: input.agencyName },
          { label: "Contact Person", value: input.contactPerson },
          { label: "Email", value: input.email },
          { label: "Phone / WhatsApp", value: input.whatsapp },
          { label: "Country", value: input.country },
          { label: "Website", value: input.website },
          { label: "Request Type / Business Type", value: input.businessType },
          { label: "Expected Volume", value: input.expectedVolume },
          { label: "Created At", value: new Date().toISOString() },
        ],
      });
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
