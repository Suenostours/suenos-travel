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

  const numberOnly = value.match(/^(\d+)$/);
  if (numberOnly) {
    const count = Number(numberOnly[1]);
    return locale === "fr"
      ? `${count} ${count === 1 ? "jour" : "jours"}`
      : `${count} ${count === 1 ? "day" : "days"}`;
  }

  const englishDays = value.match(/^(\d+)\s*days?$/i);
  if (englishDays) {
    const count = Number(englishDays[1]);
    return locale === "fr"
      ? `${count} ${count === 1 ? "jour" : "jours"}`
      : `${count} ${count === 1 ? "day" : "days"}`;
  }

  const frenchDays = value.match(/^(\d+)\s*jours?$/i);
  if (frenchDays) {
    const count = Number(frenchDays[1]);
    return locale === "fr"
      ? `${count} ${count === 1 ? "jour" : "jours"}`
      : `${count} ${count === 1 ? "day" : "days"}`;
  }

  if (locale === "en") return value;
  if (/^\d+\s*nuits?$/i.test(value)) return value;
  return null;
}
