import { and, eq } from "drizzle-orm";
import { cities, cityTranslations, tourCities, tours, tourTranslations } from "@db/schema";
import { getDb } from "./connection";
import { assessFrenchTourEligibility } from "../../src/lib/tour-translation-eligibility";

export type PublicLocale = "en" | "fr";

export async function getPublicTour(slug: string, locale: PublicLocale) {
  const db = getDb();
  const rows = await db
    .select()
    .from(tours)
    .leftJoin(
      tourTranslations,
      and(eq(tourTranslations.tourId, tours.id), eq(tourTranslations.locale, locale)),
    )
    .where(and(eq(tours.slug, slug), eq(tours.active, 1)))
    .limit(1);
  const row = rows[0];
  if (!row || !row.tour_translations) return null;

  const counterpartLocale = locale === "fr" ? "en" : "fr";
  const counterpart = (await db
    .select()
    .from(tourTranslations)
    .where(and(
      eq(tourTranslations.tourId, row.tours.id),
      eq(tourTranslations.locale, counterpartLocale),
    ))
    .limit(1))[0];
  const englishTranslation = locale === "en" ? row.tour_translations : counterpart;
  const frenchTranslation = locale === "fr" ? row.tour_translations : counterpart;
  const frenchEligibility = assessFrenchTourEligibility(
    englishTranslation,
    frenchTranslation,
  );

  if (locale === "fr" && !frenchEligibility.eligible) return null;

  const linkedCities = await db
    .select({ name: cityTranslations.name, slug: cities.slug })
    .from(tourCities)
    .leftJoin(cities, eq(cities.id, tourCities.cityId))
    .leftJoin(
      cityTranslations,
      and(eq(cityTranslations.cityId, cities.id), eq(cityTranslations.locale, locale)),
    )
    .where(eq(tourCities.tourId, row.tours.id));

  return {
    ...row,
    cities: linkedCities,
    hasFrenchTranslation: frenchEligibility.eligible,
  };
}
