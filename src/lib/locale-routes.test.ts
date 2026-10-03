import { describe, expect, it } from "vitest";
import {
  alternateLocalePath,
  hasReviewedFrenchEquivalent,
  localeSwitchUrl,
  localizedPath,
  splitLocalePath,
} from "./locale-routes";

describe("reviewed locale routes", () => {
  it("only exposes reviewed French equivalents", () => {
    expect(hasReviewedFrenchEquivalent("/services")).toBe(true);
    expect(hasReviewedFrenchEquivalent("/circuits/imperial-cities-morocco")).toBe(true);
    expect(hasReviewedFrenchEquivalent("/circuits")).toBe(true);
    expect(hasReviewedFrenchEquivalent("/quote")).toBe(true);
    expect(hasReviewedFrenchEquivalent("/")).toBe(true);
    expect(hasReviewedFrenchEquivalent("/incoming-agency-morocco")).toBe(true);
    expect(hasReviewedFrenchEquivalent("/morocco-tours-for-travel-agencies")).toBe(true);
    expect(hasReviewedFrenchEquivalent("/mice-morocco")).toBe(true);
    expect(hasReviewedFrenchEquivalent("/about")).toBe(true);
    expect(localizedPath("/about", "fr")).toBe("/fr/about");
  });

  it("maps reciprocal language paths without changing the English URL", () => {
    expect(localizedPath("/services", "fr")).toBe("/fr/services");
    expect(localizedPath("/circuits", "fr")).toBe("/fr/circuits");
    expect(localizedPath("/quote", "fr")).toBe("/fr/quote");
    expect(localizedPath("/", "fr")).toBe("/fr");
    expect(alternateLocalePath("/fr", "fr")).toBe("/");
    expect(alternateLocalePath("/fr/services", "fr")).toBe("/services");
    expect(alternateLocalePath("/services", "en")).toBe("/fr/services");
    expect(splitLocalePath("/fr/circuits/atlas-route")).toEqual({
      locale: "fr",
      basePath: "/circuits/atlas-route",
    });
    expect(splitLocalePath("/fr/services/")).toEqual({ locale: "fr", basePath: "/services" });
  });

  it("preserves a selected quote and fragment across reciprocal language navigation", () => {
    const english = localeSwitchUrl({
      pathname: "/fr/quote",
      search: "?tour=imperial-cities-morocco",
      hash: "#request",
    }, "en");
    expect(english).toBe("/quote?tour=imperial-cities-morocco#request");

    const french = localeSwitchUrl({
      pathname: "/quote",
      search: "?tour=imperial-cities-morocco",
      hash: "#request",
    }, "fr");
    expect(french).toBe("/fr/quote?tour=imperial-cities-morocco#request");

    expect(localeSwitchUrl({
      pathname: "/fr/quote",
      search: "?tour=imperial-cities-morocco",
      hash: "#request",
    }, "fr")).toBe("/fr/quote?tour=imperial-cities-morocco#request");
  });

  it("fails closed on a French tour switch when the programme is not eligible", () => {
    const location = {
      pathname: "/circuits/english-only-programme",
      search: "?source=catalogue",
      hash: "#overview",
    };

    expect(localeSwitchUrl(location, "fr", { hasFrenchTourEquivalent: false })).toBeNull();
    expect(localeSwitchUrl(location, "fr", { hasFrenchTourEquivalent: true })).toBe(
      "/fr/circuits/english-only-programme?source=catalogue#overview",
    );
  });
});
