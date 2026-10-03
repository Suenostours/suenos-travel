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
});
