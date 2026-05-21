import type { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { existsSync, mkdirSync } from "fs";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { eq, sql } from "drizzle-orm";
import { getDb } from "./queries/connection";
import { media } from "@db/schema";

const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export function registerUploadRoutes(app: Hono<any>) {
  app.use("/uploads/*", serveStatic({ root: "./public" }));

  app.post("/api/upload", async (c) => {
    const auth = c.req.header("cookie");
    if (!auth || !auth.includes("admin_token=")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const contentType = c.req.header("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return c.json({ error: "Expected multipart/form-data" }, 400);
    }

    const body = await c.req.parseBody({ all: true });
    const files = body.files;
    if (!files) {
      return c.json({ error: "No files" }, 400);
    }

    const fileArray = Array.isArray(files) ? files : [files];
    const results: { id: number; url: string; filename: string }[] = [];

    for (const file of fileArray) {
      if (!(file instanceof File)) continue;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const ext = path.extname(file.name) || ".jpg";
      const filename = `${timestamp}-${Math.random().toString(36).slice(2)}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      await writeFile(filepath, buffer);

      const db = getDb();
      const result = await db.insert(media).values({
        filename,
        originalName: file.name,
        path: `/uploads/${filename}`,
        mimeType: file.type,
        size: buffer.length,
      });
      const id = Number(result[0].insertId);
      results.push({ id, url: `/uploads/${filename}`, filename });
    }

    return c.json({ files: results });
  });

  app.delete("/api/upload/:id", async (c) => {
    const auth = c.req.header("cookie");
    if (!auth || !auth.includes("admin_token=")) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const id = Number(c.req.param("id"));
    const db = getDb();
    const rows = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (rows.length === 0) return c.json({ error: "Not found" }, 404);
    const item = rows[0];
    const filepath = path.join(UPLOAD_DIR, path.basename(item.path));
    try {
      if (existsSync(filepath)) await unlink(filepath);
    } catch { /* ignore */ }
    await db.delete(media).where(eq(media.id, id));
    return c.json({ success: true });
  });

  app.get("/api/media", async (c) => {
    const auth = c.req.header("cookie");
    if (!auth || !auth.includes("admin_token=")) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const db = getDb();
    const rows = await db.select().from(media).orderBy(sql`${media.createdAt} DESC`);
    return c.json({ media: rows });
  });
}
