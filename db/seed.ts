import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { admins, siteSettings } from "./schema";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const db = drizzle(dbUrl, { mode: "planetscale" });

async function seed() {
  console.log("Seeding database...");

  // ─── Admin de test ───
  const existing = await db.select().from(admins).where(sql`${admins.email} = "admin@morocco-incoming.com"`);
  if (existing.length === 0) {
    const hash = await bcrypt.hash("Admin@12345", 12);
    await db.insert(admins).values({
      email: "admin@morocco-incoming.com",
      passwordHash: hash,
      name: "Super Admin",
      role: "super_admin",
    });
    console.log("Admin de test créé : admin@morocco-incoming.com / Admin@12345");
  }

  // ─── Site Settings ───
  const settings = [
    { key: "agency_name", value: "Suenos Travel", group: "general" },
    { key: "email", value: "resa@suenos-travel.com", group: "general" },
    { key: "phone", value: "+212 661 925 611", group: "general" },
    { key: "whatsapp", value: "+212 661 925 611", group: "general" },
    { key: "address_agadir", value: "Hay Salam Imm Elbssita Av Ahaj Messoud El Wafkaoui & Av Abdellah Guenon Bur n13 2eme Etg.", group: "general" },
    { key: "address_casablanca", value: "CASABLANCA, PHILIPS BUSINESS CENTER 304 BOULEVARD MOHAMED 5, 6EME ETG BUR 602", group: "general" },
    { key: "facebook", value: "", group: "social" },
    { key: "instagram", value: "", group: "social" },
    { key: "linkedin", value: "", group: "social" },
    { key: "tiktok", value: "", group: "social" },
    { key: "license", value: "ODV-0564", group: "general" },
    { key: "iata", value: "54273844", group: "general" },
    { key: "hero_title", value: "Your Trusted DMC Partner in Morocco", group: "home" },
    { key: "hero_subtitle", value: "Tailor-made Morocco travel experiences for international agencies, tour operators, corporate groups, and private travelers.", group: "home" },
    { key: "meta_title", value: "Morocco Incoming by Suenos Travel | DMC Morocco", group: "seo" },
    { key: "meta_description", value: "Your trusted DMC partner in Morocco. Tailor-made tours, MICE, B2B services for travel agencies and tour operators.", group: "seo" },
    { key: "google_analytics", value: "", group: "pixels" },
    { key: "google_tag_manager", value: "", group: "pixels" },
    { key: "meta_pixel", value: "", group: "pixels" },
    { key: "tiktok_pixel", value: "", group: "pixels" },
    { key: "custom_head", value: "", group: "pixels" },
  ];

  for (const s of settings) {
    try {
      await db.insert(siteSettings).values(s);
    } catch {
      // ignore duplicates
    }
  }
  console.log("Site settings seeded");

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
