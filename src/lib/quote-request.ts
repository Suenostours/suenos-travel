import { WHATSAPP_URL } from "./contact-details";

export const QUOTE_SERVICES = [
  { id: "hotels", en: "Hotels & riads", fr: "Hôtels et riads" },
  { id: "transport", en: "Private transport", fr: "Transport privé" },
  { id: "guides", en: "Local guides", fr: "Guides locaux" },
  { id: "transfers", en: "Airport transfers", fr: "Transferts aéroport" },
  { id: "meals", en: "Meals & dinners", fr: "Repas et dîners" },
] as const;

export const QUOTE_ACTIVITIES = [
  { id: "culture", en: "Cultural visits", fr: "Visites culturelles" },
  { id: "atlas", en: "Atlas excursions", fr: "Excursions dans l’Atlas" },
  { id: "desert", en: "Desert experiences", fr: "Expériences dans le désert" },
  { id: "cooking", en: "Cooking classes", fr: "Cours de cuisine" },
  { id: "coast", en: "Coastal excursions", fr: "Excursions sur la côte" },
  { id: "team", en: "Team building", fr: "Team building" },
] as const;

export type QuoteAssistance = {
  requestKind: "specific" | "package";
  helpMeChoose: boolean;
  market: string;
  clientProfile: string;
  services: string[];
  activities: string[];
};

export function selectedOptionLabels(options: readonly { id: string; en: string; fr: string }[], ids: string[], locale: "en" | "fr") {
  return options.filter((option) => ids.includes(option.id)).map((option) => option[locale]);
}

type QuoteFormValues = {
  agencyName: string;
  contactPerson: string;
  email: string;
  whatsapp: string;
  dates: string;
  numberOfPax?: number;
  specialRequests: string;
};

type QuoteContexts = {
  preferredCircuit?: string;
  preferredDestinations?: string;
};

export function buildQuoteRequestInput(values: QuoteFormValues, contexts: QuoteContexts, assistance?: QuoteAssistance) {
  const extra = assistance ? [
    assistance.requestKind === "package" ? "Request goal: A Morocco package for our agency to market and sell. Please propose a suitable itinerary and a net-rate quotation. Any missing dates or group sizes can be discussed." : "",
    assistance.helpMeChoose ? (assistance.requestKind === "package" ? "Planning support: Please help us choose the route and suitable experiences." : "Planning support: Suggestions to refine our itinerary are welcome.") : "",
    assistance.requestKind === "package" && assistance.market.trim() ? `Source market: ${assistance.market.trim()}` : "",
    assistance.requestKind === "package" && assistance.clientProfile.trim() ? `Target clients: ${assistance.clientProfile.trim()}` : "",
    assistance.services.length ? `Services requested: ${selectedOptionLabels(QUOTE_SERVICES, assistance.services, "en").join(", ")}` : "",
    assistance.activities.length ? `Activities of interest (subject to feasibility and availability): ${selectedOptionLabels(QUOTE_ACTIVITIES, assistance.activities, "en").join(", ")}` : "",
  ].filter(Boolean) : [];
  return {
    ...values,
    ...(assistance ? { travelType: assistance.requestKind === "package" ? "Morocco package proposal" : "Existing itinerary quote" } : {}),
    specialRequests: extra.length ? [values.specialRequests, ...extra].filter(Boolean).join("\n\n") : values.specialRequests,
    preferredDestinations: contexts.preferredDestinations,
    preferredCircuit: contexts.preferredCircuit,
  };
}

// Only a saved request reference is shared with WhatsApp, never the private brief or contact fields.
export function buildQuoteWhatsAppUrl(reference: string | undefined, locale: "en" | "fr") {
  const safeReference = reference && /^MI-Q-[1-9]\d*$/.test(reference) ? reference : undefined;
  const message = locale === "fr"
    ? `Bonjour Suenos Travel, je viens d’envoyer une demande sur votre site${safeReference ? ` (réf. ${safeReference})` : ""}. Pouvons-nous en discuter ?`
    : `Hello Suenos Travel, I have just submitted a request on your website${safeReference ? ` (ref. ${safeReference})` : ""}. Could we discuss it?`;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
