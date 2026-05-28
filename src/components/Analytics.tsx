import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { trackLeadEvent, trackPageView } from "@/lib/tracking";

function getTrackedLinkEvent(href: string) {
  const value = href.toLowerCase();

  if (value.startsWith("tel:")) return "phone_click";
  if (value.startsWith("mailto:")) return "email_click";
  if (value.includes("wa.me") || value.includes("whatsapp") || value.includes("api.whatsapp.com")) {
    return "whatsapp_click";
  }

  return null;
}

export default function Analytics() {
  const location = useLocation();
  const hasTrackedInitialPageView = useRef(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname.startsWith("/admin")) return;

    const pagePath = `${location.pathname}${location.search}`;

    if (!hasTrackedInitialPageView.current) {
      hasTrackedInitialPageView.current = true;
      lastTrackedPath.current = pagePath;
      return;
    }

    if (lastTrackedPath.current === pagePath) return;
    lastTrackedPath.current = pagePath;

    const timeoutId = window.setTimeout(() => {
      trackPageView({
        page_path: pagePath,
        page_title: document.title,
        page_location: window.location.href,
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleClick = (event: MouseEvent) => {
      if (location.pathname.startsWith("/admin")) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const eventName = getTrackedLinkEvent(link.href);
      if (!eventName) return;

      trackLeadEvent(eventName, {
        link_url: link.href,
        page_path: `${location.pathname}${location.search}`,
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [location.pathname, location.search]);

  return null;
}
