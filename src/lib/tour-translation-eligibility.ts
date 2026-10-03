export type TourTranslationContent = {
  title?: string | null;
  description?: string | null;
  program?: string | null;
  highlights?: string | null;
  inclusions?: string | null;
  exclusions?: string | null;
};

export type FrenchTourEligibilityReason =
  | "missing-english-translation"
  | "missing-french-translation"
  | "missing-french-title"
  | "missing-french-description"
  | "missing-french-program"
  | "missing-french-highlights"
  | "missing-french-inclusions"
  | "missing-french-exclusions";

const DISPLAYED_OPTIONAL_FIELDS = [
  "program",
  "highlights",
  "inclusions",
  "exclusions",
] as const;

function hasText(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

export function assessFrenchTourEligibility(
  english: TourTranslationContent | null | undefined,
  french: TourTranslationContent | null | undefined,
) {
  const reasons: FrenchTourEligibilityReason[] = [];

  if (!english) reasons.push("missing-english-translation");
  if (!french) reasons.push("missing-french-translation");

  if (french) {
    if (!hasText(french.title)) reasons.push("missing-french-title");
    if (!hasText(french.description)) reasons.push("missing-french-description");

    if (english) {
      for (const field of DISPLAYED_OPTIONAL_FIELDS) {
        if (hasText(english[field]) && !hasText(french[field])) {
          reasons.push(`missing-french-${field}` as FrenchTourEligibilityReason);
        }
      }
    }
  }

  return { eligible: reasons.length === 0, reasons };
}

export function summarizeFrenchTourEligibility(
  pairs: Array<{
    english?: TourTranslationContent | null;
    french?: TourTranslationContent | null;
  }>,
) {
  const byReason = {} as Partial<Record<FrenchTourEligibilityReason, number>>;
  let eligible = 0;

  for (const pair of pairs) {
    const result = assessFrenchTourEligibility(pair.english, pair.french);
    if (result.eligible) {
      eligible += 1;
      continue;
    }
    for (const reason of result.reasons) {
      byReason[reason] = (byReason[reason] ?? 0) + 1;
    }
  }

  return {
    total: pairs.length,
    eligible,
    excluded: pairs.length - eligible,
    byReason,
  };
}
