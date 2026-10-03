import { describe, expect, it } from "vitest";
import {
  formatPreferredCircuit,
  getRequestedTourSlug,
  getValidatedTourContext,
} from "./quote-tour-context";

describe("quote tour context", () => {
  it("accepts a single valid tour slug from the quote URL", () => {
    expect(getRequestedTourSlug("?tour=imperial-cities-morocco")).toBe(
      "imperial-cities-morocco",
    );
  });

  it("ignores missing and invalid tour parameters", () => {
    expect(getRequestedTourSlug("?source=nav")).toBeNull();
    expect(getRequestedTourSlug("?tour=../../admin")).toBeNull();
    expect(getRequestedTourSlug("?tour=Imperial%20Cities")).toBeNull();
  });

  it("keeps the validated title and slug within the backend field limit", () => {
    const value = formatPreferredCircuit("A".repeat(300), "imperial-cities-morocco");
    expect(value).toHaveLength(255);
    expect(value.endsWith(" [imperial-cities-morocco]")).toBe(true);
  });

  it("builds visible and submitted context only for the requested validated tour", () => {
    expect(
      getValidatedTourContext("imperial-cities-morocco", {
        slug: "imperial-cities-morocco",
        title: "Imperial Cities of Morocco",
      }),
    ).toEqual({
      title: "Imperial Cities of Morocco",
      preferredCircuit: "Imperial Cities of Morocco [imperial-cities-morocco]",
    });
    expect(
      getValidatedTourContext("imperial-cities-morocco", {
        slug: "sahara-discovery",
        title: "Sahara Discovery",
      }),
    ).toBeNull();
  });
});
