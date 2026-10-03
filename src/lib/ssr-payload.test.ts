import { describe, expect, it } from "vitest";
import { deserializeSsrData, serializeSsrData, setHtmlDocumentLocale } from "./ssr-payload";

describe("SSR payload serialization", () => {
  it("updates the document language without duplicating the closing bracket", () => {
    expect(setHtmlDocumentLocale('<html lang="en" dir="ltr">', "fr")).toBe(
      '<html lang="fr" dir="ltr">',
    );
  });

  it("round-trips dates and escapes markup-breaking characters", () => {
    const updatedAt = new Date("2026-10-03T08:45:00.000Z");
    const payload = {
      pathname: "/circuits/example",
      locale: "en" as const,
      routeData: {
        kind: "tour" as const,
        slug: "example",
        locale: "en" as const,
        state: "found" as const,
        data: {
          tours: { updatedAt, slug: "example" },
          tour_translations: { title: "</script><script>alert('x')</script>" },
          cities: [],
        },
      },
    };

    const serialized = serializeSsrData(payload as never);
    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<script>");
    expect(serialized).not.toMatch(/password|sessionToken|adminEmail|jwt/i);
    expect(deserializeSsrData(serialized).routeData.kind).toBe("tour");
    const parsed = deserializeSsrData(serialized);
    if (parsed.routeData.kind !== "tour" || !parsed.routeData.data) throw new Error("tour data missing");
    expect(parsed.routeData.data.tours.updatedAt).toEqual(updatedAt);
  });
});
