import { listPublicTours } from "../queries/public-tours";
import type { Locale } from "../../src/providers/i18n";
import type { SsrRouteData } from "../../src/providers/ssr-data";

// Use the same active/featured/translation rules as the public API. Never
// substitute hard-coded programmes or expose drafts when the database fails.
export async function loadFeaturedTours(locale: Locale): Promise<SsrRouteData> {
  try {
    const data = await listPublicTours({ locale, featured: true });
    return { kind: "featured-tours", locale, state: data.length ? "found" : "empty", data };
  } catch {
    console.warn("[seo] Featured tours unavailable; preserving the homepage and client retry.");
    return { kind: "featured-tours", locale, state: "unavailable" };
  }
}
