import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import {
  verifyPassword,
  hashPassword,
  createAdminToken,
  serializeAdminCookie,
  clearAdminCookie,
} from "./admin-auth";
import { getDb } from "./queries/connection";
import { admins } from "@db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const adminAuthRouter = createRouter({
  login: publicQuery
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const rows = await db.select().from(admins).where(eq(admins.email, input.email)).limit(1);
      if (rows.length === 0) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      const admin = rows[0];
      const valid = await verifyPassword(input.password, admin.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      const token = await createAdminToken(admin);
      ctx.resHeaders.append("Set-Cookie", serializeAdminCookie(token));
      return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
    }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    ctx.resHeaders.append("Set-Cookie", clearAdminCookie());
    return { success: true };
  }),

  me: authedQuery.query(({ ctx }) => {
    const a = ctx.admin;
    return { id: a.id, email: a.email, name: a.name, role: a.role };
  }),

  changePassword: authedQuery
    .input(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const rows = await db.select().from(admins).where(eq(admins.id, ctx.admin.id)).limit(1);
      if (rows.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "Admin not found" });
      const valid = await verifyPassword(input.currentPassword, rows[0].passwordHash);
      if (!valid) throw new TRPCError({ code: "FORBIDDEN", message: "Current password is incorrect" });
      const newHash = await hashPassword(input.newPassword);
      await db.update(admins).set({ passwordHash: newHash, updatedAt: new Date() }).where(eq(admins.id, ctx.admin.id));
      return { success: true };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select({ id: admins.id, email: admins.email, name: admins.name, role: admins.role, createdAt: admins.createdAt }).from(admins);
  }),

  create: adminQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1).max(255),
        role: z.enum(["super_admin", "admin", "editor"]),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const hash = await hashPassword(input.password);
      try {
        await db.insert(admins).values({
          email: input.email,
          passwordHash: hash,
          name: input.name,
          role: input.role,
        });
        return { success: true };
      } catch (e: any) {
        if (e.message?.includes("Duplicate")) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already exists" });
        }
        throw e;
      }
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        email: z.string().email().optional(),
        name: z.string().min(1).max(255).optional(),
        role: z.enum(["super_admin", "admin", "editor"]).optional(),
        password: z.string().min(6).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      if (input.id === ctx.admin.id && input.role && input.role !== ctx.admin.role) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot change your own role" });
      }
      const updateData: Record<string, unknown> = {};
      if (input.email) updateData.email = input.email;
      if (input.name) updateData.name = input.name;
      if (input.role) updateData.role = input.role;
      if (input.password) updateData.passwordHash = await hashPassword(input.password);
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        await db.update(admins).set(updateData).where(eq(admins.id, input.id));
      }
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(admins).where(eq(admins.id, input.id)).limit(1);
      if (rows.length === 0) throw new TRPCError({ code: "NOT_FOUND", message: "Admin not found" });
      if (rows[0].role === "super_admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete super admin" });
      }
      await db.delete(admins).where(eq(admins.id, input.id));
      return { success: true };
    }),
});
