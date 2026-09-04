import type { Context, Hono, Next } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { existsSync, mkdirSync } from "fs";
import { writeFile, unlink } from "fs/promises";
import { randomUUID } from "node:crypto";
import path from "path";
import { eq, sql } from "drizzle-orm";
import { getDb } from "./queries/connection";
import { media } from "@db/schema";
import { getAdminFromToken, getAdminTokenFromCookie } from "./admin-auth";

const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );
}

function uploadToCloudinary(buffer: Buffer) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "morocco-incoming",
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result);
      },
    );

    stream.end(buffer);
  });
}

async function requireAdmin(c: Context, next: Next) {
  const token = getAdminTokenFromCookie(c.req.raw);
  if (!token || !(await getAdminFromToken(token))) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
}

export function registerUploadRoutes(app: Hono<{ Bindings: HttpBindings }>) {
  app.use("/uploads/*", serveStatic({ root: "./public" }));
  app.use("/api/upload", requireAdmin);
  app.use("/api/upload/*", requireAdmin);
  app.use("/api/media", requireAdmin);

  app.post("/api/upload", async (c) => {
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
      const extension = IMAGE_EXTENSIONS[file.type];
      if (!extension) {
        return c.json({ error: "Only JPEG, PNG, GIF and WebP images are allowed" }, 415);
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return c.json({ error: "Each image must be 15 MB or smaller" }, 413);
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const filename = `${timestamp}-${randomUUID()}${extension}`;
      let storedFilename = filename;
      let fileUrl = `/uploads/${filename}`;

      if (hasCloudinaryConfig()) {
        const uploaded = await uploadToCloudinary(buffer);
        storedFilename = uploaded.public_id;
        fileUrl = uploaded.secure_url;
      } else {
        const filepath = path.join(UPLOAD_DIR, filename);
        await writeFile(filepath, buffer);
      }

      const db = getDb();
      const result = await db.insert(media).values({
        filename: storedFilename,
        originalName: file.name,
        path: fileUrl,
        mimeType: file.type,
        size: buffer.length,
      });
      const id = Number(result[0].insertId);
      results.push({ id, url: fileUrl, filename: storedFilename });
    }

    return c.json({ files: results });
  });

  app.delete("/api/upload/:id", async (c) => {
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
    const db = getDb();
    const rows = await db.select().from(media).orderBy(sql`${media.createdAt} DESC`);
    return c.json({ media: rows });
  });
}
