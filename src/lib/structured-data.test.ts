import { describe, expect, it } from "vitest";
import { buildSeoGraph } from "./structured-data";

describe("localized structured data", () => {
  it("uses a French home breadcrumb and French page language without a synthetic /fr crumb", () => {
    const graph = buildSeoGraph({
      pathname: "/fr/mice-morocco",
      title: "DMC MICE au Maroc | Incentives et groupes corporate",
      description: "Organisation MICE au Maroc.",
      canonical: "https://www.morocco-incoming.com/fr/mice-morocco",
      locale: "fr",
    });
    const serialized = JSON.stringify(graph);

    expect(serialized).toContain('"inLanguage":"fr"');
    expect(serialized).toContain('"name":"Accueil","item":"https://www.morocco-incoming.com/fr"');
    expect(serialized).not.toContain('"name":"Fr"');
    expect(serialized).toContain("DMC et agence réceptive au Maroc");
  });

  it("publishes supplied dates on the WebPage node", () => {
    const graph = buildSeoGraph({
      pathname: "/circuits/marrakech-atlas-mountains",
      title: "Marrakech & Atlas Mountains",
      description: "A reviewed Morocco programme.",
      canonical: "https://www.morocco-incoming.com/circuits/marrakech-atlas-mountains",
      datePublished: "2026-05-22",
      dateModified: "2026-10-13",
    });
    const serialized = JSON.stringify(graph);

    expect(serialized).toContain('"@type":"WebPage"');
    expect(serialized).toContain('"datePublished":"2026-05-22"');
    expect(serialized).toContain('"dateModified":"2026-10-13"');
  });

  it("omits page dates when route metadata does not supply them", () => {
    const graph = buildSeoGraph({
      pathname: "/contact",
      title: "Contact",
      description: "Contact Morocco Incoming.",
      canonical: "https://www.morocco-incoming.com/contact",
    });
    const serialized = JSON.stringify(graph);

    expect(serialized).not.toContain('"datePublished"');
    expect(serialized).not.toContain('"dateModified"');
  });
});
