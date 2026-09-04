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

function trackFormSubmission(eventName: string, formType: string) {
  const params = { form_type: formType };
  trackLeadEvent(eventName, params);
  sendGtag("event", "generate_lead", params);
}

export function trackContactFormSubmit() {
  trackFormSubmission("contact_form_submit", "contact");
}

export function trackQuoteFormSubmit() {
  trackFormSubmission("quote_form_submit", "quote");
}

export function trackPartnerFormSubmit() {
  trackFormSubmission("partner_form_submit", "partner");
}
