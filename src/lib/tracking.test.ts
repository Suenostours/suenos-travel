import { afterEach, describe, expect, it, vi } from "vitest";
import {
  trackContactFormSubmit,
  trackLeadEvent,
  trackPartnerFormSubmit,
  trackQuoteFormSubmit,
} from "./tracking";

describe("form conversion tracking", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    [trackContactFormSubmit, "contact_form_submit", "contact"],
    [trackQuoteFormSubmit, "quote_form_submit", "quote"],
    [trackPartnerFormSubmit, "partner_form_submit", "partner"],
  ])("tracks the specific form event and a GA4 lead", (track, eventName, formType) => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    track();

    expect(gtag).toHaveBeenCalledWith("event", eventName, { form_type: formType });
    expect(gtag).toHaveBeenCalledWith("event", "conversion", {
      send_to: "AW-18188447838/MmohCIvmoe4cEN7g9uBD",
    });
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", { form_type: formType });
  });

  it("keeps contact-link clicks separate from submitted lead conversions", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    trackLeadEvent("whatsapp_click", { page_path: "/contact" });

    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_click", { page_path: "/contact" });
    expect(gtag).not.toHaveBeenCalledWith("event", "conversion", expect.anything());
    expect(gtag).not.toHaveBeenCalledWith("event", "generate_lead", expect.anything());
  });
});
