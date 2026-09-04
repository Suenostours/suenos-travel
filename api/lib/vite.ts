import type { Context, Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { renderSeoHtml } from "./seo-html";

type App = Hono<{ Bindings: HttpBindings }>;

function serveIndexHtml(
  c: Context<{ Bindings: HttpBindings }>,
  distPath: string,
  status: 200 | 404,
) {
  const indexPath = path.resolve(distPath, "index.html");
  const template = fs.readFileSync(indexPath, "utf-8");
  const pathname = new URL(c.req.url).pathname;
  const content = renderSeoHtml(template, pathname);
  return c.html(content, status);
}

function shouldServeSpaFallback(pathname: string, method: string) {
  if (method !== "GET" && method !== "HEAD") return false;
  if (pathname.startsWith("/api/")) return false;
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") return false;

  // Static files مثل .js .css .png ماخاصهمش يرجعو index.html
  const lastSegment = pathname.split("/").pop() || "";
  const hasFileExtension = /\.[a-zA-Z0-9]{2,8}$/.test(lastSegment);

  return !hasFileExtension;
}

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");

  app.use("*", serveStatic({ root: "./dist/public" }));

  // SEO fix:
  // React/Vite public routes خاصهم يرجعو HTTP 200 ملي كيتفتحو مباشرة
  // بحال /circuits /services /destinations
  app.get("*", (c) => {
    const url = new URL(c.req.url);

    if (shouldServeSpaFallback(url.pathname, c.req.method)) {
      return serveIndexHtml(c, distPath, 404);
    }

    return c.json({ error: "Not Found" }, 404);
  });

  app.notFound((c) => {
    const url = new URL(c.req.url);

    if (shouldServeSpaFallback(url.pathname, c.req.method)) {
      return serveIndexHtml(c, distPath, 404);
    }

    return c.json({ error: "Not Found" }, 404);
  });
}
