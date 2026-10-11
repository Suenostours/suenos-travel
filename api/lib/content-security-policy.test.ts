import { describe, expect, it } from "vitest";
import { CONTENT_SECURITY_POLICY } from "./content-security-policy";

const directives = Object.fromEntries(CONTENT_SECURITY_POLICY.split("; ").map((value) => {
  const [name, ...sources] = value.split(" ");
  return [name, sources];
}));

describe("Google tag CSP compatibility", () => {
  it.each([
    "https://analytics.google.com/g/collect",
    "https://www.google.com/g/collect",
    "https://stats.g.doubleclick.net/g/collect",
    "https://ad.doubleclick.net/ccm/s/collect",
    "https://www.google.com/ccm/collect",
    "https://www.google.com/ccm/collect?en=conversion",
    "https://www.google.co.ma/pagead/1p-conversion/18188447838/",
  ])("allows the existing collection endpoint %s", (url) => {
    expect(directives["connect-src"]).toContain(new URL(url).origin);
    expect(directives["img-src"]).toContain(new URL(url).origin);
  });

  it("allows the observed regional Ads endpoint only for images", () => {
    const origin = new URL("https://www.google.nl/pagead/1p-user-list/18188447838/").origin;
    expect(directives["img-src"]).toContain(origin);
    for (const [name, sources] of Object.entries(directives)) {
      if (name !== "img-src") expect(sources).not.toContain(origin);
    }
  });

  it("allows the observed Google Ads script without allowing arbitrary scripts", () => {
    expect(directives["script-src"]).toContain("https://googleads.g.doubleclick.net");
    expect(directives["script-src"]).toContain("https://www.googletagmanager.com");
    expect(directives["script-src"]).not.toContain("'unsafe-eval'");
    for (const sources of Object.values(directives)) {
      expect(sources).not.toContain("*");
      expect(sources).not.toContain("https:");
      expect(sources).not.toContain("https://untrusted.example");
    }
  });

  it("preserves the existing non-tracking restrictions and image hosting", () => {
    expect(directives["default-src"]).toEqual(["'self'"]);
    expect(directives["base-uri"]).toEqual(["'self'"]);
    expect(directives["form-action"]).toEqual(["'self'"]);
    expect(directives["object-src"]).toEqual(["'none'"]);
    expect(directives["frame-ancestors"]).toEqual(["'none'"]);
    expect(directives["img-src"]).toContain("https://res.cloudinary.com");
  });
});
