import type { Hono } from "hono";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "@db/schema";

export function registerSeedRoute(app: Hono<any>) {
  app.get("/api/seed", async (c) => {
    try {
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) return c.json({ error: "DATABASE_URL not set" }, 500);

      const db = drizzle(dbUrl, { mode: "planetscale" });

      const existing = await db.select().from(schema.admins)
        .where(sql`${schema.admins.email} = "admin@morocco-incoming.com"`).limit(1);

      if (existing.length > 0) {
        return c.json({ message: "Already seeded", adminExists: true });
      }

      const hash = await bcrypt.hash("Admin@12345", 12);
      await db.insert(schema.admins).values({
        email: "admin@morocco-incoming.com",
        passwordHash: hash,
        name: "Super Admin",
        role: "super_admin",
      });

      const settings = [
        { key: "agency_name", value: "Suenos Travel", group: "general" },
        { key: "email", value: "resa@suenos-travel.com", group: "general" },
        { key: "phone", value: "+212 661 925 611", group: "general" },
        { key: "whatsapp", value: "+212 661 925 611", group: "general" },
        { key: "address_agadir", value: "Hay Salam Imm Elbssita Av Ahaj Messoud El Wafkaoui & Av Abdellah Guenon Bur n13 2eme Etg.", group: "general" },
        { key: "address_casablanca", value: "CASABLANCA, PHILIPS BUSINESS CENTER 304 BOULEVARD MOHAMED 5, 6EME ETG BUR 602", group: "general" },
        { key: "license", value: "ODV-0564", group: "general" },
        { key: "iata", value: "54273844", group: "general" },
      ];

      for (const s of settings) {
        try { await db.insert(schema.siteSettings).values(s); } catch {}
      }

      return c.json({ success: true, admin: { email: "admin@morocco-incoming.com", password: "Admin@12345" } });
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });
}
