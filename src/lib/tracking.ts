const GOOGLE_ADS_ID = "AW-18188447838";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sendGtag(command: string, eventName: string, params?: EventParams) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag(command, eventName, params);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([command, eventName, params]);
}

function sendGoogleAdsConversion() {
  sendGtag("event", "conversion", { send_to: GOOGLE_ADS_ID });
}

export function trackPageView(params: EventParams) {
  sendGtag("event", "page_view", params);
}

export function trackLeadEvent(eventName: string, params?: EventParams) {
  sendGtag("event", eventName, params);
  sendGoogleAdsConversion();
}

export function trackContactFormSubmit() {
  trackLeadEvent("contact_form_submit");
}

export function trackQuoteFormSubmit() {
  trackLeadEvent("quote_form_submit");
}
