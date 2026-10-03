import { describe, expect, it } from "vitest";
import { localizeTourDuration, localizeTourType } from "./tour-display";

describe("localized tour display values", () => {
  it("translates every known tour type used by the schema", () => {
    expect(localizeTourType("small_group", "fr")).toBe("Petit groupe");
    expect(localizeTourType("cultural", "fr")).toBe("Culturel");
    expect(localizeTourType("private", "en")).toBe("Private");
  });

  it("localizes safe duration shapes and hides unknown French free text", () => {
    expect(localizeTourDuration("8", "fr")).toBe("8 jours");
    expect(localizeTourDuration("1 day", "fr")).toBe("1 jour");
    expect(localizeTourDuration("8 days", "fr")).toBe("8 jours");
    expect(localizeTourDuration("8 jours", "fr")).toBe("8 jours");
    expect(localizeTourDuration("one week with optional extension", "fr")).toBeNull();
    expect(localizeTourType("unreviewed_type", "fr")).toBeNull();
  });
});
