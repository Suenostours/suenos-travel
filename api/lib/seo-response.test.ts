import { describe, expect, it } from "vitest";
import { getSeoResponseStatus } from "./seo-response";

describe("SEO route response status", () => {
  it("serves valid dynamic content with 200", () => {
    expect(getSeoResponseStatus({
      isKnownStaticPath: false,
      isClientStaticDetail: false,
      dynamicContentState: "found",
    })).toBe(200);
  });

  it("serves a confirmed missing dynamic route with 404", () => {
    expect(getSeoResponseStatus({
      isKnownStaticPath: false,
      isClientStaticDetail: false,
      dynamicContentState: "missing",
    })).toBe(404);
  });

  it("serves a transient dynamic dependency failure with 503", () => {
    expect(getSeoResponseStatus({
      isKnownStaticPath: false,
      isClientStaticDetail: false,
      dynamicContentState: "unavailable",
    })).toBe(503);
  });

  it("does not require the database to identify unsupported client-static details", () => {
    expect(getSeoResponseStatus({
      isKnownStaticPath: false,
      isClientStaticDetail: true,
      dynamicContentState: "not-required",
    })).toBe(404);
  });
});
