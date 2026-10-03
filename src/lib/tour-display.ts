import type { Locale } from "@/providers/i18n";

const TOUR_TYPE_LABELS: Record<string, Record<Locale, string>> = {
  private: { en: "Private", fr: "Privé" },
  small_group: { en: "Small group", fr: "Petit groupe" },
  corporate: { en: "Corporate", fr: "Entreprise" },
  desert: { en: "Desert", fr: "Désert" },
  family: { en: "Family", fr: "Famille" },
  luxury: { en: "Luxury", fr: "Luxe" },
  cultural: { en: "Cultural", fr: "Culturel" },
  adventure: { en: "Adventure", fr: "Aventure" },
  short_break: { en: "Short break", fr: "Court séjour" },
  coast: { en: "Coast", fr: "Côte" },
  sports: { en: "Sports", fr: "Sports" },
  wellness: { en: "Wellness", fr: "Bien-être" },
  romantic: { en: "Romantic", fr: "Romantique" },
};

export function localizeTourType(type: string | null | undefined, locale: Locale) {
  if (!type) return null;
  const known = TOUR_TYPE_LABELS[type];
  if (known) return known[locale];
  return locale === "en" ? type.replace(/_/g, " ") : null;
}

export function localizeTourDuration(duration: string | null | undefined, locale: Locale) {
  const value = duration?.trim();
  if (!value) return null;
  if (locale === "en") return value;

  const numberOnly = value.match(/^(\d+)$/);
  if (numberOnly) {
    const count = Number(numberOnly[1]);
    return `${count} ${count === 1 ? "jour" : "jours"}`;
  }

  const englishDays = value.match(/^(\d+)\s*days?$/i);
  if (englishDays) {
    const count = Number(englishDays[1]);
    return `${count} ${count === 1 ? "jour" : "jours"}`;
  }

  if (/^\d+\s*(jours?|nuits?)$/i.test(value)) return value;
  return null;
}
