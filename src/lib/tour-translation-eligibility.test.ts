import { describe, expect, it } from "vitest";
import {
  assessFrenchTourEligibility,
  summarizeFrenchTourEligibility,
  type TourTranslationContent,
} from "./tour-translation-eligibility";

const completeEnglish: TourTranslationContent = {
  title: "Imperial Cities",
  description: "English overview",
  program: "Day 1",
  highlights: "Fes medina",
  inclusions: "Hotel",
  exclusions: "Flights",
};

const completeFrench: TourTranslationContent = {
  title: "Villes impériales",
  description: "Aperçu français",
  program: "Jour 1",
  highlights: "Médina de Fès",
  inclusions: "Hôtel",
  exclusions: "Vols",
};

describe("French tour publication eligibility", () => {
  it("accepts complete French content and optional sections absent in both languages", () => {
    expect(assessFrenchTourEligibility(completeEnglish, completeFrench)).toEqual({
      eligible: true,
      reasons: [],
    });
    expect(assessFrenchTourEligibility(
      { title: "Short tour", description: "English overview" },
      { title: "Circuit court", description: "Aperçu français" },
    ).eligible).toBe(true);
  });

  it("rejects a present but empty French translation row", () => {
    expect(assessFrenchTourEligibility(completeEnglish, {
      title: "  ",
      description: "",
      program: null,
      highlights: null,
      inclusions: null,
      exclusions: null,
    }).reasons).toEqual([
      "missing-french-title",
      "missing-french-description",
      "missing-french-program",
      "missing-french-highlights",
      "missing-french-inclusions",
      "missing-french-exclusions",
    ]);
  });

  it("rejects French content missing any section that is displayed in English", () => {
    expect(assessFrenchTourEligibility(completeEnglish, {
      ...completeFrench,
      program: "",
      inclusions: null,
      exclusions: " ",
    }).reasons).toEqual([
      "missing-french-program",
      "missing-french-inclusions",
      "missing-french-exclusions",
    ]);
  });

  it("fails closed when the French row or comparable English source row is absent", () => {
    expect(assessFrenchTourEligibility(completeEnglish, null).reasons).toEqual([
      "missing-french-translation",
    ]);
    expect(assessFrenchTourEligibility(null, completeFrench).reasons).toEqual([
      "missing-english-translation",
    ]);
  });

  it("reports deterministic counts for synthetic catalogue fixtures", () => {
    const summary = summarizeFrenchTourEligibility([
      { english: completeEnglish, french: completeFrench },
      {
        english: { title: "Short tour", description: "English overview" },
        french: { title: "Circuit court", description: "Aperçu français" },
      },
      { english: completeEnglish, french: { title: "", description: "" } },
      { english: completeEnglish, french: { ...completeFrench, program: null } },
      { english: completeEnglish, french: null },
    ]);

    expect(summary.total).toBe(5);
    expect(summary.eligible).toBe(2);
    expect(summary.excluded).toBe(3);
    expect(summary.byReason["missing-french-translation"]).toBe(1);
    expect(summary.byReason["missing-french-program"]).toBe(2);
  });
});
