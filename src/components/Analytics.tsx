import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function Analytics() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname.startsWith("/admin")) return;

    const pagePath = `${location.pathname}${location.search}`;
    if (lastTrackedPath.current === pagePath) return;
    lastTrackedPath.current = pagePath;

    const timeoutId = window.setTimeout(() => {
      window.gtag?.("event", "page_view", {
        page_path: pagePath,
        page_title: document.title,
        page_location: window.location.href,
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  return null;
}
