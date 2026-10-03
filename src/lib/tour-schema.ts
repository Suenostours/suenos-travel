import type { TouristTrip, WithContext } from "schema-dts";

const BASE_URL = "https://www.morocco-incoming.com";

export function buildTouristTripSchema(input: {
  title: string;
  description: string;
  image?: string;
  canonical: string;
  locale: "en" | "fr";
}): WithContext<TouristTrip> {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: input.title,
    description: input.description,
    image: input.image,
    provider: {
      "@type": "Organization",
      name: "Suenos Travel",
      url: BASE_URL,
    },
    touristType: input.locale === "fr"
      ? "Agences de voyages, tour-opérateurs, groupes privés et entreprises"
      : "Travel agencies, tour operators, private groups and corporate travelers",
    url: input.canonical,
  };
}
