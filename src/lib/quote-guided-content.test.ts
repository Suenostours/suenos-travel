import { Children, createElement, isValidElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "../entry-server";
import QuotePreferences from "../components/QuotePreferences";
import QuoteConfirmation from "../components/QuoteConfirmation";

describe("guided quote content", () => {
  afterEach(() => vi.unstubAllGlobals());
  it.each(["en", "fr"] as const)("renders both request paths in %s without a new indexing URL", (locale) => {
    const pathname = locale === "fr" ? "/fr/quote" : "/quote";
    const html = renderApp(pathname, { pathname, locale, routeData: { kind: "none" } });
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain(locale === "fr" ? "Proposez-nous un package au Maroc" : "Recommend a Morocco package");
    expect(html).toContain(locale === "fr" ? "Demandez un devis pour votre programme" : "Get a quote for your itinerary");
    expect(html).toContain(locale === "fr" ? "Collez votre itinéraire ici" : "Paste your itinerary here");
    expect(html).not.toContain(locale === "fr" ? "Je veux un package à vendre" : "I need a package to sell");
    expect(html).toContain(locale === "fr" ? "Résumé de votre demande" : "Your request at a glance");
    expect(html).not.toContain("Your request is saved!");
  });

  it("makes all preferences optional for first-time sellers and hides the details initially", () => {
    const html = renderToStaticMarkup(createElement(QuotePreferences, {
      locale: "en", value: { requestKind: "package", helpMeChoose: true, market: "", clientProfile: "", services: [], activities: [] },
      onChange: () => {}, destinations: [], onDestinationsChange: () => {},
    }));
    expect(html).toContain("No need to know the cities, dates or group size yet.");
    expect(html).not.toContain("required=");
    expect(html).not.toMatch(/<details[^>]*\bopen/);
    expect(html).toContain("preferences, not bookings");
  });

  it.each(["en", "fr"] as const)("renders an optional WhatsApp button without leaking its message to outbound-link analytics, in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(MemoryRouter, {}, createElement(QuoteConfirmation, { locale, reference: "MI-Q-321" })));
    expect(html).toContain("MI-Q-321");
    expect(html).toContain('<button');
    expect(html).not.toContain('href="https://wa.me/');
    expect(html).not.toContain('?text=');
    expect(html).toContain(locale === "fr" ? "Vous choisissez ensuite de l’envoyer." : "You choose whether to send it.");
  });

  it("opens WhatsApp only on a click and tracks no reference, message or duplicate conversion", () => {
    const open = vi.fn();
    const gtag = vi.fn();
    vi.stubGlobal("window", { open, gtag });
    const tree = QuoteConfirmation({ locale: "en", reference: "MI-Q-321" });
    expect(open).not.toHaveBeenCalled();
    function findClick(node: ReactNode): (() => void) | undefined {
      for (const child of Children.toArray(node)) {
        if (!isValidElement<{ children?: ReactNode; onClick?: () => void }>(child)) continue;
        const click = child.props.onClick ?? findClick(child.props.children);
        if (click) return click;
      }
    }
    const onClick = findClick(tree);
    expect(onClick).toBeTypeOf("function");
    onClick?.();
    expect(open).toHaveBeenCalledWith(expect.stringContaining("MI-Q-321"), "_blank", "noopener,noreferrer");
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_click", { link_url: "https://wa.me/212637206493", page_path: "/quote" });
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("MI-Q-321");
  });
});
