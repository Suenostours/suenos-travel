import { describe, expect, it } from "vitest";
import {
  PUBLIC_DESTINATIONS,
  getRequestedDestinationSlug,
  getValidatedDestinationContext,
} from "./public-destinations";

describe("quote destination context", () => {
  it("uses the same allowlist as the public destination catalogue", () => {
    expect(PUBLIC_DESTINATIONS.map(({ slug }) => slug)).toEqual([
      "marrakech",
      "fes",
      "casablanca",
      "agadir",
      "essaouira",
      "chefchaouen",
      "merzouga",
      "ouarzazate",
      "rabat",
      "tangier",
    ]);
  });

  it("accepts only a destination published in that catalogue", () => {
    expect(getRequestedDestinationSlug("?destination=agadir")).toBe("agadir");
    expect(getRequestedDestinationSlug("?destination=../../admin")).toBeNull();
    expect(getRequestedDestinationSlug("?destination=taghazout")).toBeNull();
    expect(getRequestedDestinationSlug("?source=nav")).toBeNull();
  });

  it("builds a separately labelled backend value in the route locale", () => {
    expect(getValidatedDestinationContext("?destination=fes", "en")).toEqual({
      slug: "fes",
      title: "Fes",
      preferredDestinations: "Fes [fes]",
    });
    expect(getValidatedDestinationContext("?destination=fes", "fr")).toEqual({
      slug: "fes",
      title: "Fès",
      preferredDestinations: "Fès [fes]",
    });
  });

  it("keeps destination and tour parameters independent", () => {
    expect(getValidatedDestinationContext(
      "?tour=imperial-cities-morocco&destination=marrakech",
      "en",
    )?.preferredDestinations).toBe("Marrakech [marrakech]");
  });
});
