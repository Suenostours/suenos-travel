import { describe, expect, it } from "vitest";
import { renderApp } from "../entry-server";
import { getSeoMeta } from "./seo-meta";

const render = (pathname = "/dmc-morocco") => renderApp(pathname, {
  pathname, locale: "en", routeData: { kind: "none" },
});

describe("evidence-grounded DMC programme planning", () => {
  it("renders useful itinerary choices and a quote link without client JavaScript", () => {
    const html = render();
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Choose a starting itinerary for your agency");
    for (const slug of ["marrakech-atlas-mountains", "imperial-cities-morocco", "sahara-desert-experience"]) {
      expect(html).toContain(`href="/circuits/${slug}"`);
    }
    expect(html).toContain("What to include in your Morocco DMC brief");
    expect(html).toContain("Request a tailored B2B programme");
    expect(html).toContain('href="/quote"');
  });
  it("keeps optional routes and services conditional", () => {
    const html = render();
    expect(html).toContain("Ourika or Imlil");
    expect(html).toContain("Agafay as an optional experience");
    expect(html).toContain("camel ride or 4x4 transfer");
    expect(html).toContain("distinguish the selected services from extras");
    expect(html).toContain("Casablanca, Rabat, Meknes, Volubilis and Fes");
  });
  it("preserves the canonical, indexability and existing title", () => {
    const meta = getSeoMeta("/dmc-morocco");
    expect(meta.canonical).toBe("https://www.morocco-incoming.com/dmc-morocco");
    expect(meta.title).toBe("DMC in Morocco for Travel Agencies | Licensed Local Partner");
    expect(meta.noindex).not.toBe(true);
  });
  it("does not duplicate the DMC additions onto different landing-page intents", () => {
    for (const path of ["/incoming-agency-morocco", "/morocco-group-tours", "/mice-morocco", "/morocco-tours-for-travel-agencies"]) {
      expect(render(path)).not.toContain("Choose a starting itinerary for your agency");
    }
  });
});
