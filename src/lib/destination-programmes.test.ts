import { describe, expect, it } from "vitest";
import { renderApp } from "../entry-server";
import { PUBLIC_DESTINATIONS } from "./public-destinations";
import { getDestinationProgrammes } from "./destination-programmes";

const publishedSlugs = new Set([
  "marrakech-atlas-mountains", "imperial-cities-morocco", "north-morocco-tour",
  "agadir-south-morocco-discovery", "sahara-desert-experience", "grand-morocco-tour", "morocco-luxury-escape",
]);

describe("published destination programme links", () => {
  for (const { slug } of PUBLIC_DESTINATIONS) {
    it(`renders direct, unique published programme links for ${slug}`, () => {
      const programmes = getDestinationProgrammes(slug);
      expect(programmes.length).toBeGreaterThan(0);
      expect(new Set(programmes.map(({ path }) => path)).size).toBe(programmes.length);
      const pathname = `/destinations/${slug}`;
      const html = renderApp(pathname, { pathname, locale: "en", routeData: { kind: "none" } });
      for (const programme of programmes) {
        expect(programme.path === "/quote?destination=fes" || publishedSlugs.has(programme.path.split("/").pop()!)).toBe(true);
        expect(html).toContain(`href="${programme.path}"`);
      }
    });
  }
  it("does not claim Marrakech is included in the published Imperial Cities route", () => {
    expect(getDestinationProgrammes("marrakech").some(({ path }) => path.endsWith("imperial-cities-morocco"))).toBe(false);
  });
  it("labels Essaouira as an optional extension", () => {
    expect(getDestinationProgrammes("essaouira")[0].description).toContain("optional Essaouira extension");
  });
  it("does not invent recommendations for unknown destinations", () => {
    expect(getDestinationProgrammes("unknown")).toEqual([]);
  });
});

describe("French footer policy access", () => {
  it("links to the existing English policies without creating untranslated French routes", () => {
    const html = renderApp("/fr/services", { pathname: "/fr/services", locale: "fr", routeData: { kind: "none" } });
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('href="/terms"');
    expect(html).toContain("Confidentialité (en anglais)");
    expect(html).not.toContain('href="/fr/privacy"');
    expect(html).not.toContain('href="/fr/terms"');
  });
});
