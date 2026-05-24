import { useEffect } from "react";
import { useLocation } from "react-router";

const GA_MEASUREMENT_ID = "G-BHGSCVJ1Y";
const GTAG_SCRIPT_ID = "ga4-gtag";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadGtag() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (document.getElementById(GTAG_SCRIPT_ID)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  const script = document.createElement("script");
  script.id = GTAG_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    loadGtag();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname.startsWith("/admin")) return;

    const timeoutId = window.setTimeout(() => {
      window.gtag?.("event", "page_view", {
        page_path: `${location.pathname}${location.search}`,
        page_title: document.title,
        page_location: window.location.href,
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  return null;
}
