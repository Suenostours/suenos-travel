import { describe, expect, it } from "vitest";
import { renderApp } from "./entry-server";
import type { PublicTourData, SsrData } from "@/providers/ssr-data";

function syntheticTour(locale: "en" | "fr"): PublicTourData {
  return {
    tours: {
      id: 1,
      slug: "imperial-cities-morocco",
      mainImage: "/images/circuit-imperial.jpg",
      gallery: [],
      duration: locale === "fr" ? "8 jours" : "8 days",
      type: "cultural",
      featured: 1,
      active: 1,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-10-03T08:45:00.000Z"),
    },
    tour_translations: {
      id: 1,
      tourId: 1,
      locale,
      title: locale === "fr" ? "Villes impériales du Maroc" : "Imperial Cities Morocco",
      description: locale === "fr" ? "Un circuit culturel au Maroc." : "A cultural circuit in Morocco.",
      program: null,
      highlights: null,
      inclusions: null,
      exclusions: null,
      metaTitle: null,
      metaDescription: null,
    },
    cities: [{ name: locale === "fr" ? "Fès" : "Fes", slug: "fes" }],
    hasFrenchTranslation: true,
  };
}

function tourSsrData(locale: "en" | "fr", state: "found" | "missing" | "unavailable"): SsrData {
  const prefix = locale === "fr" ? "/fr" : "";
  return {
    pathname: `${prefix}/circuits/imperial-cities-morocco`,
    locale,
    routeData: {
      kind: "tour",
      slug: "imperial-cities-morocco",
      locale,
      state,
      data: state === "found" ? syntheticTour(locale) : undefined,
    },
  };
}


describe("programme quote context and early CTA", () => {
  for (const locale of ["en", "fr"] as const) {
    const prefix = locale === "fr" ? "/fr" : "";
    const pathname = `${prefix}/quote`;
    const contextLabel = locale === "fr" ? "Demander un devis pour ce programme" : "Get a quote for this programme";
    const genericLabel = locale === "fr" ? "Demandez un devis pour votre programme" : "Get a quote for your itinerary";
    it(`shows validated ${locale} programme before choices with contextual wording`, () => {
      const html = renderApp(`${pathname}?tour=imperial-cities-morocco`, {
        pathname, locale,
        routeData: { kind: "quote-tour", slug: "imperial-cities-morocco", locale, state: "found", data: syntheticTour(locale) },
      });
      expect(html).toContain(contextLabel);
      expect(html).not.toContain(genericLabel);
      expect(html.indexOf('id="selected-programme"')).toBeLessThan(html.indexOf('name="request-kind"'));
      expect(html).toContain(locale === "fr" ? "Devis pour le programme sélectionné" : "Quote for the selected programme");
      expect(html).toMatch(/<textarea[^>]*id="quote-brief"(?![^>]*required)/);
      expect(html).toMatch(/<input[^>]*id="contact-person"[^>]*required/);
      expect(html).toMatch(/<input[^>]*id="quote-email"[^>]*required/);
    });
    for (const state of ["missing", "unavailable"] as const) {
      it(`keeps ${locale} generic flow for ${state} programme`, () => {
        const html = renderApp(`${pathname}?tour=imperial-cities-morocco`, {
          pathname, locale,
          routeData: { kind: "quote-tour", slug: "imperial-cities-morocco", locale, state },
        });
        expect(html).toContain(genericLabel);
        expect(html).not.toContain(contextLabel);
        expect(html).not.toContain('id="selected-programme"');
        expect(html).toMatch(/<textarea[^>]*id="quote-brief"[^>]*required/);
      });
    }
    it(`preserves generic ${locale} enquiry without tour context`, () => {
      const html = renderApp(pathname, { pathname, locale, routeData: { kind: "none" } });
      expect(html).toContain(genericLabel);
      expect(html).not.toContain(contextLabel);
    });
    it(`keeps ${locale} generic copy for an invalid tour parameter`, () => {
      const html = renderApp(`${pathname}?tour=..%2Fprivate`, { pathname, locale, routeData: { kind: "none" } });
      expect(html).toContain(genericLabel);
      expect(html).not.toContain(contextLabel);
      expect(html).not.toContain('id="selected-programme"');
      expect(html).toMatch(/<textarea[^>]*id="quote-brief"[^>]*required/);
    });
    it(`adds ${locale} context CTA before programme content and retains sidebar link`, () => {
      const data = tourSsrData(locale, "found");
      if (data.routeData.kind === "tour" && data.routeData.data?.tour_translations) {
        data.routeData.data.tour_translations.highlights = "Test highlight";
      }
      const html = renderApp(data.pathname, data);
      const label = locale === "fr" ? "Demander ce programme" : "Request this programme";
      const href = `${prefix}/quote?tour=imperial-cities-morocco`;
      expect(html).toContain(`href="${href}"`);
      expect(html.indexOf(`>${label}</a>`)).toBeGreaterThan(-1);
      expect(html.indexOf(`>${label}</a>`)).toBeLessThan(html.indexOf("Test highlight"));
      expect(html.split(`href="${href}"`).length - 1).toBe(2);
    });
  }
});
