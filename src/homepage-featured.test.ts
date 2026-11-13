import { describe, expect, it } from "vitest";
import { renderApp } from "./entry-server";
import { deserializeSsrData, serializeSsrData } from "./lib/ssr-payload";
import type { PublicTourListData, SsrData } from "./providers/ssr-data";

const tours: PublicTourListData = [{
  id: 1, slug: "imperial-cities-morocco", mainImage: "/images/circuit-imperial.jpg",
  duration: "8 days", type: "cultural", featured: 1, title: "Imperial Cities Morocco",
  description: "A cultural circuit in Morocco.", metaTitle: null, metaDescription: null,
}];

function snapshot(locale: "en" | "fr", state: "found" | "empty" | "unavailable"): SsrData {
  return { pathname: locale === "fr" ? "/fr" : "/", locale, routeData: {
    kind: "featured-tours", locale, state,
    ...(state === "unavailable" ? {} : { data: state === "empty" ? [] : tours.map(tour => ({
      ...tour, title: locale === "fr" ? "Villes impériales du Maroc" : tour.title,
      duration: locale === "fr" ? "8 jours" : tour.duration,
    })) }),
  } };
}

describe("homepage featured programmes initial HTML", () => {
  it("preserves the separate French homepage without adding a catalogue dependency", () => {
    const data: SsrData = { pathname: "/fr", locale: "fr", routeData: { kind: "none" } };
    const html = renderApp("/fr", data);
    expect(html).toContain("partenaire réceptif B2B");
    expect(html).toContain('href="/fr/quote"');
    expect(html).not.toContain("Loading featured tours");
  });
  for (const locale of ["en"] as ("en" | "fr")[]) {
    it(`renders published titles and language-correct links for ${locale}`, () => {
      const data = snapshot(locale, "found");
      const html = renderApp(data.pathname, data);
      expect(html).toContain(locale === "fr" ? "Villes impériales du Maroc" : "Imperial Cities Morocco");
      expect(html).toContain(`href="${locale === "fr" ? "/fr" : ""}/circuits/imperial-cities-morocco"`);
      expect(html).not.toContain("Loading featured tours");
      expect(html).not.toContain("Chargement des circuits");
      expect(html).not.toContain("temporarily unavailable");
      // Browser hydration receives precisely the same snapshot, not a second source.
      expect(renderApp(data.pathname, deserializeSsrData(serializeSsrData(data)))).toBe(html);
    });
    it(`handles empty and unavailable catalogues distinctly in ${locale}`, () => {
      const empty = snapshot(locale, "empty");
      const unavailable = snapshot(locale, "unavailable");
      const emptyHtml = renderApp(empty.pathname, empty);
      const unavailableHtml = renderApp(unavailable.pathname, unavailable);
      expect(emptyHtml).toContain(locale === "fr" ? "Aucun circuit à la une" : "No featured tours available yet");
      expect(unavailableHtml).toContain(locale === "fr" ? "temporairement indisponibles" : "temporarily unavailable");
      expect(unavailableHtml).not.toContain(locale === "fr" ? "Aucun circuit à la une" : "No featured tours available yet");
      expect(unavailableHtml).toContain(`href="${locale === "fr" ? "/fr" : ""}/circuits"`);
      expect(unavailableHtml).not.toContain("Loading featured tours");
    });
  }
  it("does not seed the featured query with another locale or the full catalogue", () => {
    const wrongLocale = snapshot("fr", "found");
    const html = renderApp("/", { ...wrongLocale, pathname: "/", locale: "en" });
    expect(html).not.toContain("Villes impériales du Maroc");
    expect(html).toContain("Loading featured tours");
    const catalogue: SsrData = { pathname: "/", locale: "en", routeData: {
      kind: "tour-catalog", locale: "en", state: "found", data: tours,
    } };
    expect(renderApp("/", catalogue)).not.toContain('href="/circuits/imperial-cities-morocco"');
  });
});
