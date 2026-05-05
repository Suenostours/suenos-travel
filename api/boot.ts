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

// SEED ROUTE - creates admin and default settings
app.get("/api/seed", async (c) => {
  try {
    const db = getDb();
    const existing = await db.select().from(admins).where(sql`${admins.email} = "admin@morocco-incoming.com"`).limit(1);

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
      { key: "license", value: "ODV-0564", group: "general" },
      { key: "iata", value: "54273844", group: "general" },
    ];

    for (const s of settings) {
      try { await db.insert(siteSettings).values(s); } catch {}
    }

    return c.json({
      success: true,
      admin: { email: "admin@morocco-incoming.com", password: "Admin@12345" },
    });
  } catch (err: any) {
    return c.json({ error: err.message || "Seed failed" }, 500);
  }
});

registerUploadRoutes(app);

// Sitemap
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
