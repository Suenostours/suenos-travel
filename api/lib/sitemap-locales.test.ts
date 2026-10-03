import { describe, expect, it } from "vitest";
import { getStaticSitemapAlternates, getTourSitemapAlternates } from "./sitemap-locales";

describe("localized sitemap coverage", () => {
  it("matches the reviewed static route allowlist", () => {
    expect(getStaticSitemapAlternates("/")?.fr).toBe("https://www.morocco-incoming.com/fr");
    expect(getStaticSitemapAlternates("/circuits")?.fr).toBe(
      "https://www.morocco-incoming.com/fr/circuits",
    );
    expect(getStaticSitemapAlternates("/quote")?.fr).toBe(
      "https://www.morocco-incoming.com/fr/quote",
    );
    expect(getStaticSitemapAlternates("/incoming-agency-morocco")?.fr).toBe(
      "https://www.morocco-incoming.com/fr/incoming-agency-morocco",
    );
    expect(getStaticSitemapAlternates("/morocco-tours-for-travel-agencies")?.fr).toBe(
      "https://www.morocco-incoming.com/fr/morocco-tours-for-travel-agencies",
    );
    expect(getStaticSitemapAlternates("/mice-morocco")?.fr).toBe(
      "https://www.morocco-incoming.com/fr/mice-morocco",
    );
    expect(getStaticSitemapAlternates("/about")?.fr).toBe(
      "https://www.morocco-incoming.com/fr/about",
    );
  });

  it("only emits programme alternates when a French translation exists", () => {
    expect(getTourSitemapAlternates("atlas-route", false)).toBeUndefined();
    expect(getTourSitemapAlternates("atlas-route", true)).toEqual({
      en: "https://www.morocco-incoming.com/circuits/atlas-route",
      fr: "https://www.morocco-incoming.com/fr/circuits/atlas-route",
      xDefault: "https://www.morocco-incoming.com/circuits/atlas-route",
    });
  });
});
