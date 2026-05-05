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
import fs from "fs";
import path from "path";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// Auto-create tables on first boot (Railway-safe)
async function ensureTables() {
  try {
    const db = getDb();
    const initSqlPath = path.resolve(import.meta.dirname, "../db/init.sql");
    if (!fs.existsSync(initSqlPath)) {
      console.log("[ensureTables] init.sql not found, skipping auto-migration");
      return;
    }
    const initSql = fs.readFileSync(initSqlPath, "utf-8");
    const statements = initSql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 10);
    for (const stmt of statements) {
      try {
        await db.execute(sql.raw(stmt + ";"));
      } catch (err: any) {
        if (err?.message?.includes("already exists")) {
          // ignore
        } else {
          console.log("[ensureTables] Statement skipped:", err.message);
        }
      }
    }
    console.log("[ensureTables] All tables ensured");
  } catch (err: any) {
    console.log("[ensureTables] Error:", err.message);
  }
}

// Seed route - creates admin account and default settings
app.get("/api/seed", async (c) => {
  try {
    const db = getDb();

    let existing: any[] = [];
    try {
      existing = await db
        .select()
        .from(admins)
        .where(sql`${admins.email} = "admin@morocco-incoming.com"`)
        .limit(1);
    } catch (tableErr: any) {
      if (tableErr?.message?.includes("doesn't exist") || tableErr?.message?.includes("does not exist") || tableErr?.code === "ER_NO_SUCH_TABLE") {
        return c.json({
          error: "Database tables do not exist yet.",
          hint: "The server will auto-create tables on its first startup. Wait 30 seconds and retry, or redeploy.",
          detail: tableErr.message,
        }, 500);
      }
      throw tableErr;
    }

    if (existing.length > 0) {
      return c.json({ message: "Already seeded", adminExists: true });
    }

    const hash = await bcrypt.hash("Admin@12345", 12);
    await db.insert(admins).values({
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
        email: "admin@morocco-incoming.com",
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

  // Ensure tables exist before starting
  await ensureTables();

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
