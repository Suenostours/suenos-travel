// Curated against the published programme itineraries on 2026-11-12.
// Optional stops/extensions are described explicitly, never as guaranteed inclusions.
const PROGRAMMES = {
  atlas: { title: "Marrakech & Atlas Mountains", type: "5-day short break", description: "Marrakech visits with an Ourika Valley or Imlil excursion and an optional Agafay experience.", path: "/circuits/marrakech-atlas-mountains" },
  imperial: { title: "Imperial Cities of Morocco", type: "8-day cultural circuit", description: "Follow the published Casablanca, Rabat, Meknes, Volubilis and Fes itinerary.", path: "/circuits/imperial-cities-morocco" },
  north: { title: "North Morocco Tour", type: "7-day cultural circuit", description: "Travel from Tangier through Tetouan and Chefchaouen to Fes.", path: "/circuits/north-morocco-tour" },
  south: { title: "Agadir & South Morocco Discovery", type: "7-day southern circuit", description: "Agadir, Paradise Valley, Taroudant and Tafraoute, with a Taghazout coastal day or free time in Agadir.", path: "/circuits/agadir-south-morocco-discovery" },
  sahara: { title: "Sahara Desert Experience", type: "6-day desert circuit", description: "From Marrakech through the High Atlas and Ait Ben Haddou towards Todra and Merzouga, returning to Marrakech or continuing by arrangement.", path: "/circuits/sahara-desert-experience" },
  grand: { title: "Grand Morocco Tour", type: "14-day itinerary", description: "Casablanca, Rabat, Fes, Merzouga, Ouarzazate and Marrakech, with a coastal extension adapted to the final route.", path: "/circuits/grand-morocco-tour" },
  fesCustom: { title: "Tailor-Made Fes to Sahara Extension", type: "Custom itinerary request", description: "Ask for a Fes and Merzouga route adapted to your available nights, arrival city and departure plans.", path: "/quote?destination=fes" },
  luxuryCoast: { title: "Morocco Luxury Escape", type: "7-day private itinerary", description: "A Marrakech-based programme with an optional Essaouira extension. Confirm the final route and services in the proposal.", path: "/circuits/morocco-luxury-escape" },
} as const;

const DESTINATION_PROGRAMMES: Readonly<Record<string, readonly (keyof typeof PROGRAMMES)[]>> = {
  marrakech: ["atlas", "sahara", "grand"],
  fes: ["north", "imperial", "fesCustom"],
  casablanca: ["imperial", "grand"],
  agadir: ["south", "grand"],
  essaouira: ["luxuryCoast", "grand"],
  chefchaouen: ["north"],
  merzouga: ["sahara", "grand"],
  ouarzazate: ["sahara", "grand"],
  rabat: ["imperial", "grand"],
  tangier: ["north"],
};

export function getDestinationProgrammes(slug: string) {
  return (DESTINATION_PROGRAMMES[slug] ?? []).map((key) => PROGRAMMES[key]);
}
