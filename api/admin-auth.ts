import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { env } from "./lib/env";
import { getDb } from "./queries/connection";
import { admins } from "@db/schema";
import { eq } from "drizzle-orm";

const secret = new TextEncoder().encode(env.jwtSecret);
const COOKIE_NAME = "admin_token";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export type AdminTokenPayload = {
  adminId: number;
  email: string;
  role: string;
  name: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminToken(admin: { id: number; email: string; role: string; name: string }): Promise<string> {
  return new SignJWT({ adminId: admin.id, email: admin.email, role: admin.role, name: admin.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 60 });
    return {
      adminId: payload.adminId as number,
      email: payload.email as string,
      role: payload.role as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function getAdminFromToken(token: string) {
  const payload = await verifyAdminToken(token);
  if (!payload) return null;
  const db = getDb();
  const rows = await db.select().from(admins).where(eq(admins.id, payload.adminId)).limit(1);
  if (rows.length === 0) return null;
  const admin = rows[0];
  if (admin.email !== payload.email) return null;
  return admin;
}

export function getAdminTokenFromCookie(req: Request): string | undefined {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function serializeAdminCookie(token: string, maxAge = MAX_AGE): string {
  const secure = env.isProduction;
  const sameSite = "lax";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export function clearAdminCookie(): string {
  const secure = env.isProduction;
  const sameSite = "lax";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=0${secure ? "; Secure" : ""}`;
}

export { COOKIE_NAME };
