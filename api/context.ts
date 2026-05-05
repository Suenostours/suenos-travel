import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Admin, User } from "@db/schema";
import { getAdminFromToken, getAdminTokenFromCookie } from "./admin-auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  admin?: Admin | null;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  const token = getAdminTokenFromCookie(opts.req);
  if (token) {
    try {
      ctx.admin = await getAdminFromToken(token);
    } catch {
      // ignore invalid token
    }
  }
  return ctx;
}
