import { z } from "zod";
import { createRouter, publicQuery, editorQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { siteSettings } from "@db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  getAll: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(siteSettings);
  }),

  getByKey: publicQuery.input(z.object({ key: z.string() })).query(async ({ input }) => {
    const db = getDb();
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, input.key)).limit(1);
    return rows[0] ?? null;
  }),

  getByGroup: publicQuery.input(z.object({ group: z.string() })).query(async ({ input }) => {
    const db = getDb();
    return db.select().from(siteSettings).where(eq(siteSettings.group, input.group));
  }),

  getPublicSettings: publicQuery.query(async () => {
    const db = getDb();
    const rows = await db.select().from(siteSettings);
    const result: Record<string, string> = {};
    for (const r of rows) result[r.key] = r.value;
    return result;
  }),

  set: editorQuery
    .input(z.object({ key: z.string(), value: z.string(), group: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, input.key)).limit(1);
      if (existing.length > 0) {
        await db
          .update(siteSettings)
          .set({ value: input.value, group: input.group ?? existing[0].group, updatedAt: new Date() })
          .where(eq(siteSettings.id, existing[0].id));
      } else {
        await db.insert(siteSettings).values({ key: input.key, value: input.value, group: input.group ?? "general" });
      }
      return { success: true };
    }),

  setMany: editorQuery
    .input(z.array(z.object({ key: z.string(), value: z.string(), group: z.string().optional() })))
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const item of input) {
        const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, item.key)).limit(1);
        if (existing.length > 0) {
          await db
            .update(siteSettings)
            .set({ value: item.value, group: item.group ?? existing[0].group, updatedAt: new Date() })
            .where(eq(siteSettings.id, existing[0].id));
        } else {
          await db.insert(siteSettings).values({ key: item.key, value: item.value, group: item.group ?? "general" });
        }
      }
      return { success: true };
    }),
});
