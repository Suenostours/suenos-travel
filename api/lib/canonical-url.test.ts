import { describe, expect, it } from "vitest";
import { getCanonicalRedirect } from "./canonical-url";

describe("getCanonicalRedirect", () => {
  it("redirects the apex domain to the preferred www HTTPS origin", () => {
    expect(
      getCanonicalRedirect({
        requestUrl: "http://morocco-incoming.com/dmc-morocco?source=test",
        method: "GET",
        forwardedHost: "morocco-incoming.com",
        forwardedProto: "https",
      }),
    ).toBe("https://www.morocco-incoming.com/dmc-morocco?source=test");
  });

  it("redirects HTTP on the www domain to HTTPS", () => {
    expect(
      getCanonicalRedirect({
        requestUrl: "http://www.morocco-incoming.com/circuits",
        method: "GET",
        forwardedProto: "http",
      }),
    ).toBe("https://www.morocco-incoming.com/circuits");
  });

  it("redirects the reversed legacy domain when it is connected", () => {
    expect(
      getCanonicalRedirect({
        requestUrl: "https://incoming-morocco.com/services?source=legacy",
        method: "GET",
        forwardedHost: "incoming-morocco.com",
        forwardedProto: "https",
      }),
    ).toBe("https://www.morocco-incoming.com/services?source=legacy");
  });

  it("removes a public trailing slash on the canonical origin", () => {
    expect(
      getCanonicalRedirect({
        requestUrl: "https://www.morocco-incoming.com/circuits/",
        method: "GET",
        forwardedProto: "https",
      }),
    ).toBe("https://www.morocco-incoming.com/circuits");
  });

  it("permanently consolidates the duplicate legacy DMC article URL", () => {
    expect(
      getCanonicalRedirect({
        requestUrl:
          "https://www.morocco-incoming.com/blog/what-does-a-morocco-dmc-do-for-travel-agencies",
        method: "GET",
        forwardedProto: "https",
      }),
    ).toBe(
      "https://www.morocco-incoming.com/blog/what-does-a-dmc-in-morocco-do-for-travel-agencies",
    );
  });

  it("leaves the canonical URL and local development hosts unchanged", () => {
    expect(
      getCanonicalRedirect({
        requestUrl: "https://www.morocco-incoming.com/dmc-morocco",
        method: "GET",
        forwardedProto: "https",
      }),
    ).toBeNull();
    expect(
      getCanonicalRedirect({
        requestUrl: "http://localhost:3000/dmc-morocco/",
        method: "GET",
      }),
    ).toBeNull();
  });

  it("does not change canonical admin or API route shapes", () => {
    expect(
      getCanonicalRedirect({
        requestUrl: "https://www.morocco-incoming.com/admin/",
        method: "GET",
        forwardedProto: "https",
      }),
    ).toBeNull();
    expect(
      getCanonicalRedirect({
        requestUrl: "https://www.morocco-incoming.com/api/trpc/",
        method: "GET",
        forwardedProto: "https",
      }),
    ).toBeNull();
  });
});
