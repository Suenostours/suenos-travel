import { describe, expect, it } from "vitest";
import { localizeTourDuration, localizeTourType } from "./tour-display";

describe("localized tour display values", () => {
  it("translates every known tour type used by the schema", () => {
    expect(localizeTourType("small_group", "fr")).toBe("Petit groupe");
    expect(localizeTourType("cultural", "fr")).toBe("Culturel");
    expect(localizeTourType("private", "en")).toBe("Private");
  });

  it("labels safe numeric durations consistently in English and French", () => {
    expect(localizeTourDuration("8", "en")).toBe("8 days");
    expect(localizeTourDuration("1", "en")).toBe("1 day");
    expect(localizeTourDuration("8 days", "en")).toBe("8 days");
    expect(localizeTourDuration("8 jours", "en")).toBe("8 days");
    expect(localizeTourDuration("8", "fr")).toBe("8 jours");
    expect(localizeTourDuration("1 day", "fr")).toBe("1 jour");
    expect(localizeTourDuration("8 days", "fr")).toBe("8 jours");
    expect(localizeTourDuration("8 jours", "fr")).toBe("8 jours");
  });

  it("preserves English free text and hides unreviewed French display values", () => {
    expect(localizeTourDuration("one week with optional extension", "en")).toBe("one week with optional extension");
    expect(localizeTourDuration("one week with optional extension", "fr")).toBeNull();
    expect(localizeTourType("unreviewed_type", "fr")).toBeNull();
  });
});
