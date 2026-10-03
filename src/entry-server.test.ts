import { describe, expect, it } from "vitest";
import { renderApp } from "./entry-server";
import type { PublicTourData, PublicTourListData, SsrData } from "@/providers/ssr-data";

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

const frenchCatalog: PublicTourListData = [{
  id: 1,
  slug: "imperial-cities-morocco",
  mainImage: "/images/circuit-imperial.jpg",
  duration: "8 jours",
  type: "cultural",
  featured: 1,
  title: "Villes impériales du Maroc",
  description: "Un circuit culturel au Maroc.",
  metaTitle: null,
  metaDescription: null,
}];

const englishCatalog: PublicTourListData = [{
  ...frenchCatalog[0],
  duration: "8 days",
  title: "Imperial Cities Morocco",
  description: "A cultural circuit in Morocco.",
}];

describe("incremental SSR", () => {
  it("renders useful English and French services content without JavaScript", () => {
    const en = renderApp("/services", {
      pathname: "/services",
      locale: "en",
      routeData: { kind: "none" },
    });
    const fr = renderApp("/fr/services", {
      pathname: "/fr/services",
      locale: "fr",
      routeData: { kind: "none" },
    });

    expect(en).toContain("Our Services");
    expect(fr).toContain("Nos services réceptifs au Maroc");
    expect(fr).toContain('href="/fr/services"');
    expect(fr).toMatch(/href="\/fr\/quote"[^>]*>Nous contacter/);
    expect(fr).toMatch(/href="\/fr\/incoming-agency-morocco"[^>]*>Services partenaires B2B/);
  });

  it("renders the English homepage and complete reviewed French commercial pages", () => {
    const enHome = renderApp("/", {
      pathname: "/",
      locale: "en",
      routeData: { kind: "none" },
    });
    const routes = [
      ["/fr", "Votre", "Commencez par votre besoin au Maroc"],
      ["/fr/incoming-agency-morocco", "Agence réceptive au Maroc", "Informations utiles pour préparer un devis"],
      ["/fr/morocco-tours-for-travel-agencies", "Circuits au Maroc pour agences", "Idées de circuits au Maroc"],
      ["/fr/mice-morocco", "DMC MICE au Maroc", "Formats MICE accompagnés"],
    ] as const;

    expect(enHome).toContain("Your Local");
    for (const path of [
      "/dmc-morocco",
      "/incoming-agency-morocco",
      "/morocco-tours-for-travel-agencies",
      "/morocco-group-tours",
      "/mice-morocco",
      "/destinations",
      "/destinations/marrakech",
      "/destinations/merzouga",
    ]) {
      expect(enHome).toContain(`href="${path}"`);
    }
    for (const [pathname, heading, section] of routes) {
      const html = renderApp(pathname, {
        pathname,
        locale: "fr",
        routeData: { kind: "none" },
      });
      expect(html).toContain(heading);
      expect(html).toContain(section);
      expect((html.match(/<h2/g) ?? []).length).toBeGreaterThanOrEqual(3);
      expect(html).not.toContain("Request B2B Net Rates");
    }

    const about = renderApp("/fr/about", {
      pathname: "/fr/about",
      locale: "fr",
      routeData: { kind: "none" },
    });
    expect(about).toContain("À Propos de Suenos Travel");
    expect(about).toContain("Connaissance opérationnelle");
    expect(about).not.toContain("Since 2015");
    expect(about).not.toContain("proven track record");

    const quote = renderApp("/fr/quote", {
      pathname: "/fr/quote",
      locale: "fr",
      routeData: { kind: "none" },
    });
    expect(quote).toContain("Demander un devis");
    expect(quote).toContain("Personne à contacter");
    expect(quote).toContain("Envoyer la demande");
    expect(quote).not.toContain("Request a Quote");

    const selectedQuote = renderApp("/fr/quote?tour=imperial-cities-morocco", {
      pathname: "/fr/quote",
      locale: "fr",
      routeData: {
        kind: "quote-tour",
        slug: "imperial-cities-morocco",
        locale: "fr",
        state: "found",
        data: syntheticTour("fr"),
      },
    });
    expect(selectedQuote).toContain("Programme sélectionné");
    expect(selectedQuote).toContain('value="Villes impériales du Maroc"');

    const selectedDestinationQuote = renderApp(
      "/fr/quote?tour=imperial-cities-morocco&destination=fes",
      {
        pathname: "/fr/quote",
        locale: "fr",
        routeData: {
          kind: "quote-tour",
          slug: "imperial-cities-morocco",
          locale: "fr",
          state: "found",
          data: syntheticTour("fr"),
        },
      },
    );
    expect(selectedDestinationQuote).toContain("Programme sélectionné");
    expect(selectedDestinationQuote).toContain("Destination sélectionnée");
    expect(selectedDestinationQuote).toContain('value="Fès"');

    const invalidDestinationQuote = renderApp("/quote?destination=../../admin", {
      pathname: "/quote",
      locale: "en",
      routeData: { kind: "none" },
    });
    expect(invalidDestinationQuote).toContain("The selected destination is unavailable");
    expect(invalidDestinationQuote).not.toContain("Selected destination</label>");

    const unavailableQuote = renderApp("/fr/quote?tour=imperial-cities-morocco", {
      pathname: "/fr/quote",
      locale: "fr",
      routeData: {
        kind: "quote-tour",
        slug: "imperial-cities-morocco",
        locale: "fr",
        state: "unavailable",
      },
    });
    expect(unavailableQuote).toContain("Le programme sélectionné n&#x27;est pas disponible");
    expect(unavailableQuote).not.toContain("Vérification du programme...");
  });

  it("keeps simultaneous English and French renders request-scoped", async () => {
    const [en, fr] = await Promise.all([
      Promise.resolve(renderApp("/services", {
        pathname: "/services",
        locale: "en",
        routeData: { kind: "none" },
      })),
      Promise.resolve(renderApp("/fr/services", {
        pathname: "/fr/services",
        locale: "fr",
        routeData: { kind: "none" },
      })),
    ]);

    expect(en).toContain("Our Services");
    expect(en).not.toContain("Nos services réceptifs au Maroc");
    expect(fr).toContain("Nos services réceptifs au Maroc");
    expect(fr).not.toContain("Comprehensive services for travel agencies");
  });

  it("renders a synthetic localized programme from request-scoped data", () => {
    const html = renderApp("/fr/circuits/imperial-cities-morocco", tourSsrData("fr", "found"));

    expect(html).toContain("Villes impériales du Maroc");
    expect(html).toContain("Un circuit culturel au Maroc.");
    expect(html).toContain("8 jours");
    expect(html).toContain("Culturel");
    expect(html).toContain('href="/fr/quote?tour=imperial-cities-morocco"');
    expect(html).toMatch(/href="\/fr\/incoming-agency-morocco"[^>]*>Services pour partenaires B2B/);
    expect(html).not.toContain("Loading tour");
  });

  it("renders French catalogue data, empty state, and unavailable state without an English fallback", () => {
    const found = renderApp("/fr/circuits", {
      pathname: "/fr/circuits",
      locale: "fr",
      routeData: { kind: "tour-catalog", locale: "fr", state: "found", data: frenchCatalog },
    });
    const empty = renderApp("/fr/circuits", {
      pathname: "/fr/circuits",
      locale: "fr",
      routeData: { kind: "tour-catalog", locale: "fr", state: "empty", data: [] },
    });
    const unavailable = renderApp("/fr/circuits", {
      pathname: "/fr/circuits",
      locale: "fr",
      routeData: { kind: "tour-catalog", locale: "fr", state: "unavailable" },
    });

    expect(found).toContain("Villes impériales du Maroc");
    expect(found).toContain('href="/fr/circuits/imperial-cities-morocco"');
    expect(found).not.toContain("Loading tours");
    expect(empty).toContain("Aucun circuit traduit en français");
    expect(unavailable).toContain("Le catalogue est temporairement indisponible");
  });

  it("keeps the English catalogue route and links unchanged", () => {
    const html = renderApp("/circuits", {
      pathname: "/circuits",
      locale: "en",
      routeData: { kind: "tour-catalog", locale: "en", state: "found", data: englishCatalog },
    });

    expect(html).toContain("Morocco Circuits and Group Tours for Travel Agencies");
    expect(html).toContain("Imperial Cities Morocco");
    expect(html).toContain('href="/circuits/imperial-cities-morocco"');
    expect(html).not.toContain('href="/fr/circuits/imperial-cities-morocco"');
  });

  it("renders distinct missing and unavailable programme states", () => {
    expect(renderApp(
      "/circuits/imperial-cities-morocco",
      tourSsrData("en", "missing"),
    )).toContain("Tour not found");
    expect(renderApp(
      "/circuits/imperial-cities-morocco",
      tourSsrData("en", "unavailable"),
    )).toContain("Tour temporarily unavailable");
  });
});
