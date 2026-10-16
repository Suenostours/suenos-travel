export type ReviewedTourLocale = "en" | "fr";

export const REVIEWED_TOUR_CONTENT_LAST_MODIFIED = "2026-10-13";
const REVIEWED_TOUR_CONTENT_LAST_MODIFIED_ISO = `${REVIEWED_TOUR_CONTENT_LAST_MODIFIED}T00:00:00.000Z`;

const REVIEWED_TOUR_META_DESCRIPTIONS: Readonly<
  Record<string, Partial<Record<ReviewedTourLocale, string>>>
> = {
  "sahara-desert-experience": {
    en: "Morocco Sahara circuit from Marrakech through the High Atlas, Ait Ben Haddou and Todra Gorges to Merzouga, with a desert camp and camel or 4x4 transfer.",
    fr: "Circuit Sahara au départ de Marrakech via le Haut Atlas, Ait Ben Haddou et Todra jusqu’à Merzouga, avec camp désert et transfert chameau ou 4x4.",
  },
  "marrakech-atlas-mountains": {
    en: "Short Morocco program combining Marrakech medina and gardens with an Ourika Valley or Imlil excursion, Atlas views and an optional Agafay sunset.",
    fr: "Programme court combinant médina et jardins de Marrakech avec excursion dans l’Ourika ou à Imlil, vues sur l’Atlas et coucher de soleil optionnel à Agafay.",
  },
  "morocco-luxury-escape": {
    en: "Private luxury Morocco journey with selected riads, professional drivers, guided visits and optional Atlas or Agafay experiences for agencies and groups.",
    fr: "Voyage privé haut de gamme au Maroc avec riads sélectionnés, chauffeurs, visites guidées et expériences Atlas ou Agafay pour agences et groupes.",
  },
  "morocco-honeymoon-tour": {
    en: "Private Morocco honeymoon itinerary with romantic riads, Marrakech, an Atlas or Agafay experience and an optional Sahara camp, adaptable for couples.",
    fr: "Itinéraire privé de lune de miel au Maroc avec riads de charme, Marrakech, expérience Atlas ou Agafay et camp du Sahara optionnel, adaptable aux couples.",
  },
  "grand-morocco-tour": {
    en: "Fourteen-day Morocco tour through Casablanca, Rabat, Fes, Merzouga, Todra, Dades, Ait Ben Haddou and Marrakech, adaptable for agencies and private groups.",
    fr: "Grand circuit de 14 jours via Casablanca, Rabat, Fès, Merzouga, Todra, Dadès, Ait Ben Haddou et Marrakech, adaptable aux agences et groupes privés.",
  },
  "north-morocco-tour": {
    en: "Northern Morocco tour linking Tangier, Tetouan, Chefchaouen and Fes, with medinas, Rif landscapes and Andalusian heritage for agencies and groups.",
    fr: "Circuit dans le nord du Maroc reliant Tanger, Tétouan, Chefchaouen et Fès, entre médinas, Rif et héritage andalou, pour agences et groupes.",
  },
  "morocco-highlights-8-days": {
    en: "Eight-day Morocco itinerary with Marrakech, the High Atlas, Ait Ben Haddou, Ouarzazate and a Sahara experience, adaptable for agencies and groups.",
    fr: "Circuit Maroc de 8 jours avec Marrakech, Haut Atlas, Ait Ben Haddou, Ouarzazate et expérience Sahara, adaptable aux agences et groupes.",
  },
  "agadir-south-morocco-discovery": {
    en: "Seven-day South Morocco tour from Agadir with Paradise Valley, Taroudant, Tafraoute, the Anti-Atlas and Taghazout, for cultural and soft-adventure groups.",
    fr: "Circuit de 7 jours au Sud marocain depuis Agadir avec Paradise Valley, Taroudant, Tafraoute, Anti-Atlas et Taghazout, pour groupes culture et nature.",
  },
};

export const REVIEWED_AGADIR_FRENCH_HIGHLIGHTS = [
  "Plage d’Agadir et ambiance atlantique",
  "Souk El Had et marchés locaux",
  "Point de vue de la Kasbah sur Agadir",
  "Paysages de Paradise Valley",
  "Remparts de Taroudant et souks traditionnels",
  "Tafraoute et montagnes de l’Anti-Atlas",
  "Villages berbères et culture locale authentique",
  "Expérience côtière à Taghazout",
  "Idéal pour groupes culturels et aventure douce",
].join("\n");

export function getReviewedTourMetaDescription(
  slug: string,
  locale: ReviewedTourLocale,
) {
  return REVIEWED_TOUR_META_DESCRIPTIONS[slug]?.[locale] ?? null;
}

export function getTourContentDateModified(
  slug: string,
  databaseUpdatedAt?: Date | string | null,
) {
  const databaseDate = databaseUpdatedAt ? new Date(databaseUpdatedAt) : null;
  const databaseIso = databaseDate && !Number.isNaN(databaseDate.getTime())
    ? databaseDate.toISOString()
    : undefined;

  if (!(slug in REVIEWED_TOUR_META_DESCRIPTIONS)) return databaseIso;
  if (!databaseDate || databaseDate < new Date(REVIEWED_TOUR_CONTENT_LAST_MODIFIED_ISO)) {
    return REVIEWED_TOUR_CONTENT_LAST_MODIFIED_ISO;
  }

  return databaseIso;
}

function normalizedList(value?: string | null) {
  return value
    ?.split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\n") ?? "";
}

export function applyReviewedTourDisplayCorrections<
  T extends { highlights?: string | null; inclusions?: string | null },
>(slug: string, locale: ReviewedTourLocale, translation: T): T {
  const duplicateAgadirSections = slug === "agadir-south-morocco-discovery"
    && locale === "fr"
    && normalizedList(translation.highlights) !== ""
    && normalizedList(translation.highlights) === normalizedList(translation.inclusions);

  if (!duplicateAgadirSections) return translation;

  return {
    ...translation,
    highlights: REVIEWED_AGADIR_FRENCH_HIGHLIGHTS,
  };
}

export function reviewedTourMetaEntries() {
  return Object.entries(REVIEWED_TOUR_META_DESCRIPTIONS).flatMap(([slug, descriptions]) =>
    (["en", "fr"] as const).flatMap((locale) => {
      const description = descriptions[locale];
      return description ? [{ slug, locale, description }] : [];
    }),
  );
}
