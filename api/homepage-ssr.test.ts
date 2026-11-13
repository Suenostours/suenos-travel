import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { listPublicTours } from "./queries/public-tours";
import app from "./boot";

vi.mock("./queries/public-tours", () => ({ listPublicTours: vi.fn() }));
vi.mock("./queries/connection", () => ({ getDb: () => { throw new Error("No real DB in this test"); } }));
vi.mock("fs", async (original) => {
  const actual = await original<typeof import("fs")>();
  return { ...actual, default: { ...actual, readFileSync: (file: string) => {
    if (file.endsWith("index.html")) return '<!doctype html><html lang="en"><head></head><body><div id="root"></div></body></html>';
    return actual.readFileSync(file);
  } } };
});

beforeEach(() => {
  vi.mocked(listPublicTours).mockReset();
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterEach(() => vi.restoreAllMocks());

describe("homepage HTTP server wiring", () => {
  it("returns featured programmes and hydration data in the first HTTP response", async () => {
    vi.mocked(listPublicTours).mockResolvedValue([{
      id: 1, slug: "imperial-cities-morocco", mainImage: null, duration: "8 days", type: "cultural",
      featured: 1, title: "Imperial Cities Morocco", description: "A cultural circuit.", metaTitle: null, metaDescription: null,
    }]);
    const response = await app.request("https://www.morocco-incoming.com/");
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('href="/circuits/imperial-cities-morocco"');
    expect(html).toContain('id="ssr-data"');
    expect(html).toContain('"kind":"featured-tours"');
    expect(html).not.toContain("Loading featured tours");
    expect(listPublicTours).toHaveBeenCalledExactlyOnceWith({ locale: "en", featured: true });
  });
  it("preserves the homepage on a featured lookup failure without claiming an empty catalogue", async () => {
    vi.mocked(listPublicTours).mockRejectedValue(new Error("Unavailable"));
    const response = await app.request("https://www.morocco-incoming.com/");
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Featured tours are temporarily unavailable");
    expect(html).not.toContain("No featured tours available yet");
  });
  it("does not add a database dependency to the distinct French homepage", async () => {
    const response = await app.request("https://www.morocco-incoming.com/fr");
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("partenaire réceptif B2B");
    expect(listPublicTours).not.toHaveBeenCalled();
  });
});
