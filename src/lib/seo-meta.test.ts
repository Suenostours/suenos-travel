import { describe, expect, it } from "vitest";
import { buildTourSeoMeta, getSeoMeta, resolveClientSeoMeta, resolveSeoMeta } from "./seo-meta";

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

  it("keeps known destination metadata canonical and marks missing routes noindex", () => {
    expect(getSeoMeta("/destinations/fes/").title).toBe(
      "Fes Morocco B2B Excursions & Programs | Suenos Travel DMC",
    );
    expect(getSeoMeta("/destinations/not-real").noindex).toBe(true);
    expect(getSeoMeta("/blog/not-real").noindex).toBe(true);
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
