import type { Locale } from "@/providers/i18n";

export const PUBLIC_DESTINATIONS = [
  { slug: "marrakech", name: "Marrakech", nameFr: "Marrakech", image: "/images/circuit-imperial.jpg", desc: "The red city for culture, incentives, Agafay events, Atlas excursions and agency programs.", descFr: "La ville rouge pour culture, incentives, événements à Agafay, excursions Atlas et programmes agences." },
  { slug: "fes", name: "Fes", nameFr: "Fès", image: "/images/circuit-grand.jpg", desc: "Morocco's spiritual and cultural heart for medina tours, heritage routes and group programs.", descFr: "Le cœur spirituel et culturel du Maroc pour médina, patrimoine et programmes groupes." },
  { slug: "casablanca", name: "Casablanca", nameFr: "Casablanca", image: "/images/about-riad.jpg", desc: "Morocco's business and airport gateway for corporate travel, arrivals and short extensions.", descFr: "La porte business et aérienne du Maroc pour corporate, arrivées et extensions courtes." },
  { slug: "agadir", name: "Agadir", nameFr: "Agadir", image: "/images/circuit-honeymoon.jpg", desc: "Atlantic resort base for leisure groups, golf, retreats and Souss Massa excursions.", descFr: "Base balnéaire Atlantique pour groupes loisirs, golf, retraites et excursions Souss Massa." },
  { slug: "essaouira", name: "Essaouira", nameFr: "Essaouira", image: "/images/circuit-luxury.jpg", desc: "A coastal extension with medina heritage, art, Atlantic activities and relaxed pacing.", descFr: "Une extension côtière avec médina, art, activités Atlantique et rythme détendu." },
  { slug: "chefchaouen", name: "Chefchaouen", nameFr: "Chefchaouen", image: "/images/circuit-grand.jpg", desc: "The blue Rif Mountain city for photography, northern routes and private cultural programs.", descFr: "La ville bleue du Rif pour photographie, routes nord et programmes culturels privés." },
  { slug: "merzouga", name: "Merzouga", nameFr: "Merzouga", image: "/images/circuit-sahara.jpg", desc: "Gateway to Erg Chebbi for Sahara camps, camel trekking and premium desert experiences.", descFr: "Porte d'Erg Chebbi pour camps Sahara, dromadaires et expériences désert premium." },
  { slug: "ouarzazate", name: "Ouarzazate", nameFr: "Ouarzazate", image: "/images/circuit-sahara.jpg", desc: "Kasbah country and film heritage gateway between Marrakech, valleys and the Sahara.", descFr: "Pays des kasbahs et cinéma entre Marrakech, vallées et Sahara." },
  { slug: "rabat", name: "Rabat", nameFr: "Rabat", image: "/images/about-riad.jpg", desc: "Morocco's capital for royal heritage, diplomatic visits, coastal culture and imperial routes.", descFr: "Capitale du Maroc pour patrimoine royal, visites diplomatiques, côte et routes impériales." },
  { slug: "tangier", name: "Tangier", nameFr: "Tanger", image: "/images/circuit-grand.jpg", desc: "Northern Morocco gateway for Spain-linked programs, Chefchaouen, Tetouan and coastal extensions.", descFr: "Porte nord du Maroc pour programmes liés à l'Espagne, Chefchaouen, Tétouan et extensions côtières." },
] as const;

const DESTINATION_BY_SLUG: ReadonlyMap<string, (typeof PUBLIC_DESTINATIONS)[number]> = new Map(
  PUBLIC_DESTINATIONS.map((destination) => [destination.slug, destination]),
);

export function getRequestedDestinationSlug(search: string) {
  const value = new URLSearchParams(search).get("destination")?.trim() ?? "";
  return DESTINATION_BY_SLUG.has(value) ? value : null;
}

export function getValidatedDestinationContext(search: string, locale: Locale) {
  const slug = getRequestedDestinationSlug(search);
  if (!slug) return null;

  const destination = DESTINATION_BY_SLUG.get(slug);
  if (!destination) return null;
  const title = locale === "fr" ? destination.nameFr : destination.name;
  return {
    slug,
    title,
    preferredDestinations: `${title} [${slug}]`,
  };
}
