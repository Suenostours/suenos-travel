import { describe, expect, it, vi, beforeEach } from "vitest";
import { listPublicTours } from "../queries/public-tours";
import { loadFeaturedTours } from "./featured-tours";

vi.mock("../queries/public-tours", () => ({ listPublicTours: vi.fn() }));
beforeEach(() => vi.resetAllMocks());

describe("homepage featured programmes loader", () => {
  for (const locale of ["en", "fr"] as const) {
    it(`uses the existing featured/active/translation query for ${locale}`, async () => {
      const data = [{ id: 1, slug: "published-tour", featured: 1 }] as Awaited<ReturnType<typeof listPublicTours>>;
      vi.mocked(listPublicTours).mockResolvedValue(data);
      expect(await loadFeaturedTours(locale)).toEqual({ kind: "featured-tours", locale, state: "found", data });
      expect(listPublicTours).toHaveBeenCalledExactlyOnceWith({ locale, featured: true });
    });
  }
  it("distinguishes an empty catalogue from an unavailable dependency", async () => {
    vi.mocked(listPublicTours).mockResolvedValue([]);
    expect(await loadFeaturedTours("en")).toEqual({ kind: "featured-tours", locale: "en", state: "empty", data: [] });
    vi.mocked(listPublicTours).mockRejectedValue(new Error("database unavailable"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(await loadFeaturedTours("en")).toEqual({ kind: "featured-tours", locale: "en", state: "unavailable" });
    warn.mockRestore();
  });
});
