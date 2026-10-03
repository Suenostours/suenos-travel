import { useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { trpc } from "@/providers/trpc";
import { buildSeoGraph, safeJsonLd } from "@/lib/structured-data";
import { normalizeSeoPath, resolveClientSeoMeta, type SeoOverrides } from "@/lib/seo-meta";

interface SEOProps extends SeoOverrides {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  datePublished?: string;
  dateModified?: string;
}

export default function SEO({
  title,
  description,
  canonical,
  image,
  noindex,
  type,
  datePublished,
  dateModified,
  alternates,
}: SEOProps) {
  const location = useLocation();
  const { data: savedMeta, isLoading: isSavedMetaLoading } = trpc.seo.getByPath.useQuery(
    { path: location.pathname },
    { staleTime: 5 * 60 * 1000, retry: 1 },
  );
  const hasExplicitPageMeta = Boolean(title && description && canonical);
  const resolved = resolveClientSeoMeta(location.pathname, {
    title,
    description,
    canonical,
    image,
    noindex: noindex ?? (hasExplicitPageMeta ? false : undefined),
    type,
    datePublished,
    dateModified,
    alternates,
  }, savedMeta);
  const structuredData = !resolved.noindex
    ? buildSeoGraph({
        pathname: location.pathname,
        title: resolved.title,
        description: resolved.description,
        canonical: resolved.canonical,
        image: resolved.image,
        type: resolved.type,
        datePublished: resolved.datePublished,
        dateModified: resolved.dateModified,
        locale: resolved.locale,
      })
    : null;
  const structuredDataJson = structuredData ? safeJsonLd(structuredData) : null;
  const {
    title: resolvedTitle,
    description: resolvedDescription,
    canonical: resolvedCanonical,
    image: resolvedImage,
    noindex: resolvedNoindex,
    type: resolvedType,
    locale: resolvedLocale,
    alternates: resolvedAlternates,
  } = resolved;
  const alternateEn = resolvedAlternates?.en;
  const alternateFr = resolvedAlternates?.fr;
  const alternateDefault = resolvedAlternates?.xDefault;

  useLayoutEffect(() => {
    const serverCanonical = document.head.querySelector<HTMLLinkElement>(
      'link[data-seo-path][rel="canonical"]',
    );
    if (
      isSavedMetaLoading &&
      serverCanonical?.dataset.seoPath === normalizeSeoPath(location.pathname)
    ) {
      return;
    }

    const selectors = [
      "title",
      'meta[name="description"]',
      'meta[name="robots"]',
      'link[rel="canonical"]',
      'meta[property="og:site_name"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:type"]',
      'meta[property="og:url"]',
      'meta[property="og:locale"]',
      'meta[property="og:image"]',
      'meta[property="og:image:width"]',
      'meta[property="og:image:height"]',
      'meta[name="twitter:card"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[name="twitter:image"]',
      'link[rel="alternate"][hreflang]',
      "script#route-seo-graph",
    ];
    document.querySelectorAll(selectors.join(",")).forEach((element) => element.remove());

    const addMeta = (attribute: "name" | "property", key: string, content: string) => {
      const element = document.createElement("meta");
      element.setAttribute(attribute, key);
      element.content = content;
      element.dataset.routeSeo = "true";
      document.head.append(element);
    };

    const titleElement = document.createElement("title");
    titleElement.textContent = resolvedTitle;
    titleElement.dataset.routeSeo = "true";
    document.head.append(titleElement);

    addMeta("name", "description", resolvedDescription);
    addMeta("name", "robots", resolvedNoindex ? "noindex, nofollow" : "index, follow");

    const canonicalElement = document.createElement("link");
    canonicalElement.rel = "canonical";
    canonicalElement.href = resolvedCanonical;
    canonicalElement.dataset.routeSeo = "true";
    document.head.append(canonicalElement);

    addMeta("property", "og:site_name", "Morocco Incoming by Suenos Travel");
    addMeta("property", "og:title", resolvedTitle);
    addMeta("property", "og:description", resolvedDescription);
    addMeta("property", "og:type", resolvedType ?? "website");
    addMeta("property", "og:url", resolvedCanonical);
    addMeta("property", "og:locale", resolvedLocale === "fr" ? "fr_FR" : "en_US");
    if (resolvedImage) {
      addMeta("property", "og:image", resolvedImage);
      addMeta("property", "og:image:width", "1344");
      addMeta("property", "og:image:height", "768");
    }
    addMeta("name", "twitter:card", "summary_large_image");
    addMeta("name", "twitter:title", resolvedTitle);
    addMeta("name", "twitter:description", resolvedDescription);
    if (resolvedImage) addMeta("name", "twitter:image", resolvedImage);

    if (structuredDataJson) {
      const script = document.createElement("script");
      script.id = "route-seo-graph";
      script.type = "application/ld+json";
      script.textContent = structuredDataJson;
      script.dataset.routeSeo = "true";
      document.head.append(script);
    }
    if (alternateEn && alternateFr && alternateDefault) {
      ([
        ["en", alternateEn],
        ["fr", alternateFr],
        ["x-default", alternateDefault],
      ] as const).forEach(([hreflang, href]) => {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = hreflang;
        link.href = href;
        link.dataset.routeSeo = "true";
        document.head.append(link);
      });
    }
  }, [
    alternateDefault,
    alternateEn,
    alternateFr,
    isSavedMetaLoading,
    location.pathname,
    resolvedCanonical,
    resolvedDescription,
    resolvedImage,
    resolvedLocale,
    resolvedNoindex,
    resolvedTitle,
    resolvedType,
    structuredDataJson,
  ]);

  return null;
}
