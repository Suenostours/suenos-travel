import { and, eq, inArray, sql } from "drizzle-orm";
import { tours, tourTranslations } from "@db/schema";
import { getDb } from "./connection";
import type { PublicLocale } from "./public-tour";
import { assessFrenchTourEligibility } from "../../src/lib/tour-translation-eligibility";

export async function listPublicTours(input: {
  locale: PublicLocale;
  type?: string;
  featured?: boolean;
}) {
  const db = getDb();
  const conditions = [eq(tours.active, 1)];
  if (input.type) conditions.push(sql`${tours.type} = ${input.type}`);
  if (input.featured) conditions.push(eq(tours.featured, 1));

  const rows = await db
    .select({
      id: tours.id,
      slug: tours.slug,
      mainImage: tours.mainImage,
      duration: tours.duration,
      type: tours.type,
      featured: tours.featured,
      title: tourTranslations.title,
      description: tourTranslations.description,
      metaTitle: tourTranslations.metaTitle,
      metaDescription: tourTranslations.metaDescription,
      translationId: tourTranslations.id,
      program: tourTranslations.program,
      highlights: tourTranslations.highlights,
      inclusions: tourTranslations.inclusions,
      exclusions: tourTranslations.exclusions,
    })
    .from(tours)
    .leftJoin(
      tourTranslations,
      and(eq(tourTranslations.tourId, tours.id), eq(tourTranslations.locale, input.locale)),
    )
    .where(and(...conditions));

  let eligibleTourIds: Set<number> | undefined;
  if (input.locale === "fr" && rows.length > 0) {
    const englishTranslations = await db
      .select({
        tourId: tourTranslations.tourId,
        title: tourTranslations.title,
        description: tourTranslations.description,
        program: tourTranslations.program,
        highlights: tourTranslations.highlights,
        inclusions: tourTranslations.inclusions,
        exclusions: tourTranslations.exclusions,
      })
      .from(tourTranslations)
      .where(and(
        eq(tourTranslations.locale, "en"),
        inArray(tourTranslations.tourId, rows.map((row) => row.id)),
      ));
    const englishByTourId = new Map(
      englishTranslations.map((translation) => [translation.tourId, translation]),
    );
    eligibleTourIds = new Set(rows
      .filter((row) => assessFrenchTourEligibility(
        englishByTourId.get(row.id),
        row.translationId ? row : null,
      ).eligible)
      .map((row) => row.id));
  }

  return rows
    .filter((row) => Boolean(row.translationId) && (!eligibleTourIds || eligibleTourIds.has(row.id)))
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      mainImage: row.mainImage,
      duration: row.duration,
      type: row.type,
      featured: row.featured,
      title: row.title,
      description: row.description,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
    }));
}
