import { describe, expect, it } from "vitest";
import {
  applyReviewedTourDisplayCorrections,
  getReviewedTourMetaDescription,
  REVIEWED_AGADIR_FRENCH_HIGHLIGHTS,
  reviewedTourMetaEntries,
} from "./reviewed-tour-content";

describe("reviewed programme content corrections", () => {
  it("provides 16 distinct, complete EN/FR meta descriptions without changing Imperial Cities", () => {
    const entries = reviewedTourMetaEntries();

    expect(entries).toHaveLength(16);
    expect(new Set(entries.map((entry) => entry.description)).size).toBe(16);
    expect(new Set(entries.map((entry) => entry.slug)).size).toBe(8);
    for (const entry of entries) {
      expect(entry.description.length).toBeGreaterThanOrEqual(110);
      expect(entry.description.length).toBeLessThanOrEqual(155);
      expect(entry.description.endsWith(".")).toBe(true);
      expect(entry.description).not.toContain("...");
    }
    expect(getReviewedTourMetaDescription("imperial-cities-morocco", "en")).toBeNull();
    expect(getReviewedTourMetaDescription("imperial-cities-morocco", "fr")).toBeNull();
  });

  it("replaces only the duplicated French Agadir highlights with itinerary-backed facts", () => {
    const duplicated = "Hébergement\nPetit-déjeuner\nTransport privé";
    const corrected = applyReviewedTourDisplayCorrections(
      "agadir-south-morocco-discovery",
      "fr",
      { highlights: duplicated, inclusions: duplicated },
    );

    expect(corrected.highlights).toBe(REVIEWED_AGADIR_FRENCH_HIGHLIGHTS);
    expect(corrected.highlights).toContain("Paradise Valley");
    expect(corrected.highlights).toContain("Taroudant");
    expect(corrected.highlights).toContain("Tafraoute");
    expect(corrected.highlights).toContain("Taghazout");
    expect(corrected.highlights).not.toBe(corrected.inclusions);
  });

  it("preserves corrected database content and every unrelated programme", () => {
    const reviewed = { highlights: "Agadir et Anti-Atlas", inclusions: "Hébergement" };
    const english = { highlights: "Agadir beach", inclusions: "Accommodation" };

    expect(applyReviewedTourDisplayCorrections("agadir-south-morocco-discovery", "fr", reviewed)).toBe(reviewed);
    expect(applyReviewedTourDisplayCorrections("agadir-south-morocco-discovery", "en", english)).toBe(english);
    expect(applyReviewedTourDisplayCorrections("grand-morocco-tour", "fr", reviewed)).toBe(reviewed);
  });
});
