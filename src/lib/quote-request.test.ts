import { describe, expect, it } from "vitest";
import { buildQuoteRequestInput } from "./quote-request";

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
});
