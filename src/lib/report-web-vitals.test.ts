import { afterEach, describe, expect, it, vi } from "vitest";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type LCPMetric, type CLSMetric } from "web-vitals";
import { reportWebVitals } from "./report-web-vitals";

vi.mock("web-vitals", () => ({
  onCLS: vi.fn(), onFCP: vi.fn(), onINP: vi.fn(), onLCP: vi.fn(), onTTFB: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("web vitals destination", () => {
  it("sends performance metrics only to the existing GA4 property, not Ads", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    reportWebVitals();
    for (const register of [onCLS, onFCP, onINP, onLCP, onTTFB]) {
      expect(register).toHaveBeenCalledTimes(1);
    }
    const report = vi.mocked(onLCP).mock.calls[0][0];
    report({ name: "LCP", value: 1234.5, id: "test", rating: "good", delta: 1234.5 } as LCPMetric);
    expect(gtag).toHaveBeenCalledWith("event", "LCP", expect.objectContaining({
      send_to: "G-BHGBSCVJ1Y", value: 1235, event_category: "Web Vitals",
    }));
    expect(gtag).toHaveBeenCalledTimes(1);
  });

  it("does not fail when analytics is unavailable", () => {
    vi.stubGlobal("window", {});
    reportWebVitals();
    expect(() => vi.mocked(onCLS).mock.calls[0][0]({ name: "CLS", value: 0.1 } as CLSMetric)).not.toThrow();
  });
});
