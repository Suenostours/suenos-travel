import { describe, expect, it } from "vitest";
import { buildQuoteRequestInput, buildQuoteWhatsAppUrl, QUOTE_ACTIVITIES, QUOTE_SERVICES, type QuoteAssistance } from "./quote-request";

const emptyForm = { agencyName: "", contactPerson: "Example", email: "example@example.test", whatsapp: "", dates: "", specialRequests: "" };
const assistance: QuoteAssistance = { requestKind: "package", helpMeChoose: false, market: "France", clientProfile: "Families", services: [], activities: [] };

describe("quote request payload", () => {
  it("keeps tour, destination and the user's brief in separate backend fields", () => {
    const input = buildQuoteRequestInput({
      agencyName: "Example Agency",
      contactPerson: "Test Contact",
      email: "test@example.com",
      whatsapp: "",
      dates: "October",
      numberOfPax: 12,
      specialRequests: "Keep this exact user-authored brief.",
    }, {
      preferredCircuit: "Imperial Cities Morocco [imperial-cities-morocco]",
      preferredDestinations: "Marrakech [marrakech]",
    });

    expect(input.preferredCircuit).toBe("Imperial Cities Morocco [imperial-cities-morocco]");
    expect(input.preferredDestinations).toBe("Marrakech [marrakech]");
    expect(input.specialRequests).toBe("Keep this exact user-authored brief.");
  });

  it("does not invent context for a generic quote", () => {
    const input = buildQuoteRequestInput({
      agencyName: "",
      contactPerson: "Test Contact",
      email: "test@example.com",
      whatsapp: "",
      dates: "",
      specialRequests: "A custom request.",
    }, {});

    expect(input.preferredCircuit).toBeUndefined();
    expect(input.preferredDestinations).toBeUndefined();
    expect(input.specialRequests).toBe("A custom request.");
  });

  it("lets a first-time Morocco seller ask for a package without dates, cities or a group size", () => {
    const input = buildQuoteRequestInput(emptyForm, {}, assistance);
    expect(input.travelType).toBe("Morocco package proposal");
    expect(input.specialRequests).toContain("Source market: France");
    expect(input.specialRequests).toContain("Target clients: Families");
    expect(input.specialRequests).toContain("Please propose a suitable itinerary");
    expect(input.dates).toBe("");
    expect(input.preferredDestinations).toBeUndefined();
    expect(input).not.toHaveProperty("numberOfPax");
  });

  it("preserves notes and validated tour/destination context with the selected experiences", () => {
    const input = buildQuoteRequestInput({ ...emptyForm, specialRequests: "Please allow relaxed walking." }, {
      preferredDestinations: "Marrakech [marrakech], Fès [fes]",
      preferredCircuit: "Imperial cities [imperial-cities-morocco]",
    }, { ...assistance, services: ["hotels", "hotels", "guides"], activities: ["cooking", "culture"] });
    expect(input.specialRequests).toContain("Please allow relaxed walking.");
    expect(input.specialRequests).toContain("Services requested: Hotels & riads, Local guides");
    expect(input.specialRequests).toContain("Cultural visits, Cooking classes");
    expect(input.specialRequests).toContain("subject to feasibility and availability");
    expect(input.preferredDestinations).toBe("Marrakech [marrakech], Fès [fes]");
    expect(input.preferredCircuit).toBe("Imperial cities [imperial-cities-morocco]");
  });

  it("does not include hidden package-only fields after switching back to a specific trip", () => {
    const input = buildQuoteRequestInput(emptyForm, {}, { ...assistance, requestKind: "specific", helpMeChoose: true });
    expect(input.travelType).toBe("Existing itinerary quote");
    expect(input.specialRequests).toBe("Planning support: Suggestions to refine our itinerary are welcome.");
  });

  it("fits the existing 5000-character backend limit even with every guided option", () => {
    const input = buildQuoteRequestInput({ ...emptyForm, specialRequests: "x".repeat(4000) }, {}, {
      ...assistance, helpMeChoose: true, market: "x".repeat(100), clientProfile: "x".repeat(100),
      services: QUOTE_SERVICES.map((item) => item.id), activities: QUOTE_ACTIVITIES.map((item) => item.id),
    });
    expect(input.specialRequests.length).toBeLessThanOrEqual(5000);
  });
});

describe("optional WhatsApp handoff", () => {
  it.each(["en", "fr"] as const)("uses only the saved reference in %s", (locale) => {
    const url = new URL(buildQuoteWhatsAppUrl("MI-Q-321", locale));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/212637206493");
    expect(url.searchParams.get("text")).toContain("MI-Q-321");
    expect(url.searchParams.get("text")).not.toContain("example@example.test");
    expect(url.searchParams.get("text")).not.toContain("Families");
  });
  it.each([undefined, "bad&email=private@example.test", "MI-Q-0"])("falls back safely for an absent or invalid reference", (reference) => {
    const message = new URL(buildQuoteWhatsAppUrl(reference, "en")).searchParams.get("text");
    expect(message).toContain("submitted a request");
    expect(message).not.toContain("private@");
    expect(message).not.toContain("MI-Q-");
  });
});
