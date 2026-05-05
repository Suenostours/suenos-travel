import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { registerUploadRoutes } from "./upload-handler";
import { getDb } from "./queries/connection";
import { tours, cities, blogPosts, admins, siteSettings } from "@db/schema";
import { eq, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// ─── Auto-create all tables on first /api/seed call ───
const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS admins (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email varchar(320) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  role enum('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'editor',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  \`key\` varchar(100) NOT NULL UNIQUE,
  \`value\` text NOT NULL,
  \`group\` varchar(50) NOT NULL DEFAULT 'general',
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  unionId varchar(255) NOT NULL UNIQUE,
  name varchar(255),
  email varchar(320),
  avatar text,
  role enum('user', 'admin') NOT NULL DEFAULT 'user',
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignInAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug varchar(100) NOT NULL UNIQUE,
  main_image text,
  gallery json,
  active tinyint unsigned NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS city_translations (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  city_id bigint unsigned NOT NULL,
  locale enum('fr', 'en') NOT NULL DEFAULT 'en',
  name varchar(255) NOT NULL,
  description text,
  meta_title varchar(255),
  meta_description text
);

CREATE TABLE IF NOT EXISTS tours (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug varchar(100) NOT NULL UNIQUE,
  main_image text,
  gallery json,
  duration varchar(50),
  \`type\` enum('private', 'small_group', 'corporate', 'desert', 'family', 'luxury', 'cultural', 'adventure', 'short_break', 'coast', 'sports', 'wellness', 'romantic') NOT NULL DEFAULT 'private',
  featured tinyint unsigned NOT NULL DEFAULT 0,
  active tinyint unsigned NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tour_translations (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tour_id bigint unsigned NOT NULL,
  locale enum('fr', 'en') NOT NULL DEFAULT 'en',
  title varchar(255) NOT NULL,
  description text,
  program text,
  highlights text,
  inclusions text,
  exclusions text,
  meta_title varchar(255),
  meta_description text
);

CREATE TABLE IF NOT EXISTS tour_cities (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tour_id bigint unsigned NOT NULL,
  city_id bigint unsigned NOT NULL
);

CREATE TABLE IF NOT EXISTS excursions (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug varchar(100) NOT NULL UNIQUE,
  city_id bigint unsigned,
  main_image text,
  gallery json,
  duration varchar(50),
  active tinyint unsigned NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS excursion_translations (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  excursion_id bigint unsigned NOT NULL,
  locale enum('fr', 'en') NOT NULL DEFAULT 'en',
  title varchar(255) NOT NULL,
  description text,
  highlights text,
  meta_title varchar(255),
  meta_description text
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug varchar(100) NOT NULL UNIQUE,
  main_image text,
  category varchar(100),
  tags json,
  \`status\` enum('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at timestamp NULL,
  active tinyint unsigned NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_translations (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id bigint unsigned NOT NULL,
  locale enum('fr', 'en') NOT NULL DEFAULT 'en',
  title varchar(255) NOT NULL,
  content text,
  meta_title varchar(255),
  meta_description text
);

CREATE TABLE IF NOT EXISTS media (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  filename varchar(255) NOT NULL,
  original_name varchar(255) NOT NULL,
  \`path\` text NOT NULL,
  mime_type varchar(100),
  \`size\` int,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(320) NOT NULL,
  phone varchar(50),
  subject varchar(255),
  message text NOT NULL,
  \`status\` enum('new', 'treated', 'archived') NOT NULL DEFAULT 'new',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  agency_name varchar(255),
  contact_person varchar(255),
  email varchar(320) NOT NULL,
  whatsapp varchar(50),
  country varchar(100),
  travel_type varchar(50),
  dates varchar(100),
  duration varchar(50),
  adults int,
  children int,
  preferred_destinations text,
  preferred_circuit varchar(255),
  hotel_category varchar(50),
  transport_type varchar(50),
  guide_language varchar(50),
  budget_range varchar(100),
  special_requests text,
  \`status\` enum('new', 'treated', 'archived') NOT NULL DEFAULT 'new',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_requests (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  agency_name varchar(255) NOT NULL,
  country varchar(100),
  website varchar(255),
  contact_person varchar(255) NOT NULL,
  email varchar(320) NOT NULL,
  whatsapp varchar(50),
  business_type varchar(100),
  expected_volume varchar(100),
  \`status\` enum('new', 'treated', 'archived') NOT NULL DEFAULT 'new',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seo_settings (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  \`path\` varchar(255) NOT NULL UNIQUE,
  meta_title varchar(255),
  meta_description text,
  og_image text,
  canonical text,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

async function initTables() {
  try {
    const db = getDb();
    const statements = CREATE_TABLES_SQL.split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 20);
    for (const stmt of statements) {
      try {
        await db.execute(sql.raw(stmt + ";"));
      } catch (err: any) {
        if (err?.message?.includes("already exists")) {
          // ignore
        } else {
          console.log("[initTables] Skipped:", err.message);
        }
      }
    }
    console.log("[initTables] All tables ensured");
    return true;
  } catch (err: any) {
    console.log("[initTables] Error:", err.message);
    return false;
  }
}

// Seed route - creates admin account and default settings
app.get("/api/seed", async (c) => {
  try {
    const db = getDb();

    // Create tables first if they don't exist
    await initTables();

    // Check if admin already exists
    let existing: any[] = [];
    try {
      existing = await db
        .select()
        .from(admins)
        .where(sql`${admins.email} = "admin@suenos-travel.com"`)
        .limit(1);
    } catch (tableErr: any) {
      return c.json({
        error: "Database query failed after table creation.",
        detail: tableErr.message,
      }, 500);
    }

    if (existing.length > 0) {
      return c.json({ message: "Already seeded", adminExists: true });
    }

    // Create admin
    const hash = await bcrypt.hash("Admin@12345", 12);
    await db.insert(admins).values({
      email: "admin@suenos-travel.com",
      passwordHash: hash,
      name: "Super Admin",
      role: "super_admin",
    });

    // Create site settings
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
      try { await db.insert(siteSettings).values(s); } catch {}
    }

    return c.json({
      success: true,
      message: "Database seeded successfully",
      admin: {
        email: "admin@suenos-travel.com",
        password: "Admin@12345",
      },
      settingsCreated: settings.length,
    });
  } catch (err: any) {
    return c.json({ error: err.message || "Seed failed" }, 500);
  }
});

// Upload routes
registerUploadRoutes(app);

// Sitemap.xml
app.get("/sitemap.xml", async (c) => {
  const baseUrl = "https://www.morocco-incoming.com";
  const db = getDb();
  let urls = [
    `<url><loc>${baseUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${baseUrl}/circuits</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${baseUrl}/destinations</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${baseUrl}/services</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${baseUrl}/mice</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${baseUrl}/b2b</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${baseUrl}/blog</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${baseUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${baseUrl}/quote</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
  ];

  const tourRows = await db.select({ slug: tours.slug }).from(tours).where(eq(tours.active, 1));
  for (const t of tourRows) {
    urls.push(`<url><loc>${baseUrl}/circuits/${t.slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
  }
  const cityRows = await db.select({ slug: cities.slug }).from(cities).where(eq(cities.active, 1));
  for (const c of cityRows) {
    urls.push(`<url><loc>${baseUrl}/destinations/${c.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
  }
  const blogRows = await db.select({ slug: blogPosts.slug }).from(blogPosts).where(and(eq(blogPosts.status, "published"), eq(blogPosts.active, 1)));
  for (const b of blogRows) {
    urls.push(`<url><loc>${baseUrl}/blog/${b.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  return c.text(xml, 200, { "Content-Type": "application/xml" });
});

// robots.txt
app.get("/robots.txt", (c) => {
  const baseUrl = "https://www.morocco-incoming.com";
  return c.text(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`, 200, { "Content-Type": "text/plain" });
});

// tRPC endpoint
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
