import { describe, expect, it } from "vitest";
import { buildFrenchCommercialSchemas, frenchCommercialPages } from "./french-commercial-content";

describe("French commercial content", () => {
  it("provides complete primary content and authored FAQ schema for every reviewed landing", () => {
    for (const page of Object.values(frenchCommercialPages)) {
      expect(page.h1.length).toBeGreaterThan(20);
      expect(page.intro.length).toBeGreaterThan(80);
      expect(page.services.length).toBeGreaterThanOrEqual(6);
      expect(page.groups.length).toBeGreaterThanOrEqual(2);
      expect(page.faq.length).toBeGreaterThanOrEqual(4);

      const schemas = buildFrenchCommercialSchemas(page);
      const faq = schemas.find((schema) => schema.id === "landing-faq-schema")?.value;
      expect(JSON.stringify(faq)).toContain('"inLanguage":"fr"');
      expect(JSON.stringify(faq)).toContain('"@type":"FAQPage"');
    }
  });
});
