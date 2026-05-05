import { adminAuthRouter } from "./admin-auth-router";
import { settingsRouter } from "./settings-router";
import { publicRouter } from "./public-router";
import { toursRouter } from "./tours-router";
import { citiesRouter, excursionsRouter } from "./cities-router";
import { blogRouter, formsRouter, mediaRouter } from "./blog-router";
import { seoRouter } from "./seo-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  adminAuth: adminAuthRouter,
  settings: settingsRouter,
  public: publicRouter,
  tours: toursRouter,
  cities: citiesRouter,
  excursions: excursionsRouter,
  blog: blogRouter,
  forms: formsRouter,
  media: mediaRouter,
  seo: seoRouter,
});

export type AppRouter = typeof appRouter;
