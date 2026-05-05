import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { registerUploadRoutes } from "./upload-handler";
import { registerSeedRoute } from "./route-seed";
import { getDb } from "./queries/connection";
import { tours, cities, blogPosts } from "@db/schema";
import { eq, and } from "drizzle-orm";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
registerSeedRoute(app);
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
  return c.text(`User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`, 200, { "Content-Type": "text/plain" });
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
