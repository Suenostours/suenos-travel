import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.admin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }
  return next({ ctx: { ...ctx, admin: ctx.admin } });
});

function requireRole(role: string) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.admin || ctx.admin.role !== role) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }
    return next({ ctx: { ...ctx, admin: ctx.admin } });
  });
}

export const authedQuery = t.procedure.use(requireAuth);
export const adminQuery = authedQuery.use(requireRole("super_admin"));
export const editorQuery = authedQuery.use(t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.admin || (ctx.admin.role !== "super_admin" && ctx.admin.role !== "admin" && ctx.admin.role !== "editor")) {
    throw new TRPCError({ code: "FORBIDDEN", message: ErrorMessages.insufficientRole });
  }
  return next({ ctx });
}));
