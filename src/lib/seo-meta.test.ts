import { describe, expect, it } from "vitest";
import { buildTourSeoMeta, getSeoMeta, resolveClientSeoMeta, resolveSeoMeta } from "./seo-meta";
import { reviewedTourMetaEntries } from "./reviewed-tour-content";

describe("shared SEO metadata", () => {
  it("uses the same Imperial Cities metadata builder for server and client", () => {
    const meta = buildTourSeoMeta({
      pathname: "/circuits/imperial-cities-morocco",
      title: "Imperial Cities Morocco",
      description: "A classic route through Morocco's imperial cities.",
      image: "/images/circuit-imperial.jpg",
      hasFrenchEquivalent: true,
    });

    expect(meta.title).toBe("Imperial Cities Morocco | Morocco DMC Tour for Agencies");
    expect(meta.canonical).toBe(
      "https://www.morocco-incoming.com/circuits/imperial-cities-morocco",
    );
    expect(meta.noindex).toBe(false);
    expect(meta.alternates?.fr).toBe(
      "https://www.morocco-incoming.com/fr/circuits/imperial-cities-morocco",
    );
  });

  it("uses reviewed complete metadata for the 16 long programme descriptions", () => {
    const english = buildTourSeoMeta({
      pathname: "/circuits/sahara-desert-experience",
      title: "Sahara Desert Experience",
      description: "A deliberately long database description that would otherwise be truncated. ".repeat(4),
    });
    const french = buildTourSeoMeta({
      pathname: "/fr/circuits/agadir-south-morocco-discovery",
      title: "Découverte d’Agadir & du Sud Marocain",
      description: "Une description de base volontairement longue qui serait autrement tronquée. ".repeat(4),
    });

    expect(english.description).toContain("Ait Ben Haddou");
    expect(english.description).not.toContain("...");
    expect(french.description).toContain("Paradise Valley");
    expect(french.description).not.toContain("...");
  });

  it("resolves every reviewed programme description with canonical reciprocal alternates", () => {
    for (const entry of reviewedTourMetaEntries()) {
      const prefix = entry.locale === "fr" ? "/fr" : "";
      const pathname = `${prefix}/circuits/${entry.slug}`;
      const meta = buildTourSeoMeta({
        pathname,
        description: "Long fallback description. ".repeat(10),
        hasFrenchEquivalent: true,
      });

      expect(meta.description).toBe(entry.description);
      expect(meta.canonical).toBe(`https://www.morocco-incoming.com${pathname}`);
      expect(meta.alternates).toEqual({
        en: `https://www.morocco-incoming.com/circuits/${entry.slug}`,
        fr: `https://www.morocco-incoming.com/fr/circuits/${entry.slug}`,
        xDefault: `https://www.morocco-incoming.com/circuits/${entry.slug}`,
      });
    }
  });

  it("still prefers a future explicit database meta description", () => {
    const meta = buildTourSeoMeta({
      pathname: "/circuits/sahara-desert-experience",
      title: "Sahara Desert Experience",
      description: "Long page description. ".repeat(10),
      metaDescription: "Explicit reviewed database description.",
    });

    expect(meta.description).toBe("Explicit reviewed database description.");
  });

  it("keeps known destination metadata canonical and marks missing routes noindex", () => {
    expect(getSeoMeta("/destinations/fes/").title).toBe(
      "Fes DMC Services & Tours for Travel Agencies",
    );
    expect(getSeoMeta("/destinations/not-real").noindex).toBe(true);
    expect(getSeoMeta("/blog/not-real").noindex).toBe(true);
  });

  it("keeps Fes metadata identical on the server and client without changing its URL", () => {
    const path = "/destinations/fes";
    const meta = getSeoMeta(path);
    const serverMeta = resolveSeoMeta(path);
    expect(resolveClientSeoMeta(path, {}, undefined)).toEqual(serverMeta);
    expect(serverMeta).toMatchObject({ title: meta.title, description: meta.description, canonical: meta.canonical });
    expect(meta.canonical).toBe("https://www.morocco-incoming.com/destinations/fes");
    expect(meta.description).toContain("Morocco DMC");
    expect(meta.noindex).not.toBe(true);
    expect(meta.alternates).toBeUndefined();
    expect(getSeoMeta("/destinations/marrakech").title).toBe(
      "Marrakech Morocco B2B Excursions & Programs | Suenos Travel DMC",
    );
  });

  it("keeps the B2B guide informational and preserves its publication date", () => {
    const meta = getSeoMeta("/blog/morocco-tours-for-travel-agencies-b2b-programs");
    expect(meta.title).toBe("Morocco Tours for Travel Agencies: How B2B Programs Work");
    expect(meta.datePublished).toBe("2026-05-28");
    expect(meta.dateModified).toBe("2026-10-11");
    expect(meta.canonical).toBe("https://www.morocco-incoming.com/blog/morocco-tours-for-travel-agencies-b2b-programs");
  });

  it("normalizes saved relative canonicals to the public origin", () => {
    expect(resolveSeoMeta("/services", { canonical: "/services" }).canonical).toBe(
      "https://www.morocco-incoming.com/services",
    );
  });

  it("does not erase fallback indexing and article values with undefined overrides", () => {
    expect(resolveSeoMeta("/blog/not-real", { noindex: undefined }).noindex).toBe(true);
    expect(
      resolveSeoMeta("/blog/marrakech-hidden-gems", { type: undefined }).type,
    ).toBe("article");
  });

  it("emits reciprocal alternates only for reviewed French routes", () => {
    expect(getSeoMeta("/services").alternates).toEqual({
      en: "https://www.morocco-incoming.com/services",
      fr: "https://www.morocco-incoming.com/fr/services",
      xDefault: "https://www.morocco-incoming.com/services",
    });
    expect(getSeoMeta("/fr/services").locale).toBe("fr");
    expect(getSeoMeta("/fr/services").alternates).toEqual(getSeoMeta("/services").alternates);
    expect(getSeoMeta("/fr").canonical).toBe("https://www.morocco-incoming.com/fr");
    expect(getSeoMeta("/fr/incoming-agency-morocco").locale).toBe("fr");
    expect(getSeoMeta("/fr/circuits").canonical).toBe(
      "https://www.morocco-incoming.com/fr/circuits",
    );
    expect(getSeoMeta("/fr/quote").canonical).toBe(
      "https://www.morocco-incoming.com/fr/quote",
    );
    expect(getSeoMeta("/quote").alternates?.fr).toBe(
      "https://www.morocco-incoming.com/fr/quote",
    );
    expect(getSeoMeta("/fr/morocco-tours-for-travel-agencies").noindex).toBeFalsy();
    expect(getSeoMeta("/fr/mice-morocco").alternates?.en).toBe(
      "https://www.morocco-incoming.com/mice-morocco",
    );
    expect(getSeoMeta("/about").alternates?.fr).toBe(
      "https://www.morocco-incoming.com/fr/about",
    );
    expect(getSeoMeta("/fr/about").canonical).toBe(
      "https://www.morocco-incoming.com/fr/about",
    );
    expect(getSeoMeta("/fr/about").noindex).toBeFalsy();
  });

  it("keeps dynamic reciprocal hreflang in the client hydration resolver", () => {
    const serverMeta = buildTourSeoMeta({
      pathname: "/fr/circuits/imperial-cities-morocco",
      title: "Villes impériales du Maroc",
      description: "Un circuit culturel au Maroc.",
      hasFrenchEquivalent: true,
    });
    const hydratedMeta = resolveClientSeoMeta(
      "/fr/circuits/imperial-cities-morocco",
      serverMeta,
      { metaTitle: "Villes impériales du Maroc | Circuit B2B" },
    );

    expect(hydratedMeta.alternates).toEqual(serverMeta.alternates);
    expect(hydratedMeta.alternates).toEqual({
      en: "https://www.morocco-incoming.com/circuits/imperial-cities-morocco",
      fr: "https://www.morocco-incoming.com/fr/circuits/imperial-cities-morocco",
      xDefault: "https://www.morocco-incoming.com/circuits/imperial-cities-morocco",
    });
  });
});
