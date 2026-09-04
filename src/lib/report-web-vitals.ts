import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function sendToGoogleAnalytics(metric: Metric) {
  if (typeof window.gtag !== "function") return;

  window.gtag("event", metric.name, {
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    event_category: "Web Vitals",
    event_label: metric.id,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    non_interaction: true,
  });
}

export function reportWebVitals() {
  onCLS(sendToGoogleAnalytics);
  onFCP(sendToGoogleAnalytics);
  onINP(sendToGoogleAnalytics);
  onLCP(sendToGoogleAnalytics);
  onTTFB(sendToGoogleAnalytics);
}
