import type {
  BlogPosting,
  BreadcrumbList,
  Graph,
  Organization,
  TravelAgency,
  WebPage,
  WebSite,
} from "schema-dts";
import { PRIMARY_PHONE_E164 } from "@/lib/contact-details";

export const SITE_ORIGIN = "https://www.morocco-incoming.com";

type StructuredDataInput = {
  pathname: string;
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: string;
  datePublished?: string;
  dateModified?: string;
  locale?: "en" | "fr";
};

const routeLabels: Record<string, string> = {
  about: "About",
  b2b: "B2B",
  blog: "Blog",
  circuits: "Morocco Circuits",
  contact: "Contact",
  destinations: "Morocco Destinations",
  mice: "MICE Morocco",
  quote: "Request a Quote",
  services: "Services",
};

const frenchRouteLabels: Record<string, string> = {
  circuits: "Circuits au Maroc",
  services: "Services",
  "incoming-agency-morocco": "Agence réceptive au Maroc",
  "morocco-tours-for-travel-agencies": "Circuits pour agences de voyage",
  "mice-morocco": "MICE au Maroc",
};

function labelFromSegment(segment: string, locale: "en" | "fr") {
  return (locale === "fr" ? frenchRouteLabels[segment] : routeLabels[segment]) ?? segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildBreadcrumbs(
  pathname: string,
  canonical: string,
  title: string,
  locale: "en" | "fr",
): BreadcrumbList | null {
  const segments = pathname.split("/").filter(Boolean);
  if (locale === "fr" && segments[0] === "fr") segments.shift();
  if (segments.length === 0) return null;

  const items = [
    {
      "@type": "ListItem" as const,
      position: 1,
      name: locale === "fr" ? "Accueil" : "Home",
      item: locale === "fr" ? `${SITE_ORIGIN}/fr` : `${SITE_ORIGIN}/`,
    },
  ];

  let currentPath = locale === "fr" ? "/fr" : "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: isLast ? title.replace(/\s*\|.*$/, "") : labelFromSegment(segment, locale),
      item: isLast ? canonical : `${SITE_ORIGIN}${currentPath}`,
    });
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: items,
  };
}

export function buildSeoGraph({
  pathname,
  title,
  description,
  canonical,
  image,
  type,
  datePublished,
  dateModified,
  locale = "en",
}: StructuredDataInput): Graph {
  const organization: Organization = {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: "Suenos Travel",
    alternateName: "Morocco Incoming by Suenos Travel",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/favicon.svg`,
    email: "resa@suenos-travel.com",
    telephone: PRIMARY_PHONE_E164,
    sameAs: [
      "https://www.facebook.com/suenos.travel1",
      "https://www.instagram.com/suenos.travel1",
    ],
  };

  const travelAgency: TravelAgency = {
    "@type": "TravelAgency",
    "@id": `${SITE_ORIGIN}/#travel-agency`,
    name: "Morocco Incoming by Suenos Travel",
    legalName: "Suenos Travel",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/favicon.svg`,
    description: locale === "fr"
      ? "DMC et agence réceptive au Maroc pour agences de voyage, tour-opérateurs, groupes et MICE."
      : "Licensed Morocco DMC and incoming travel agency for travel agencies, tour operators, groups and MICE.",
    areaServed: { "@type": "Country", name: locale === "fr" ? "Maroc" : "Morocco" },
    email: "resa@suenos-travel.com",
    telephone: PRIMARY_PHONE_E164,
    address: [
      { "@type": "PostalAddress", addressCountry: "MA", addressLocality: "Agadir" },
      { "@type": "PostalAddress", addressCountry: "MA", addressLocality: "Casablanca" },
    ],
    parentOrganization: { "@id": `${SITE_ORIGIN}/#organization` },
  };

  const website: WebSite = {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: "Morocco Incoming by Suenos Travel",
    url: SITE_ORIGIN,
    inLanguage: ["en", "fr"],
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  };

  const pageBase = {
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    about: { "@id": `${SITE_ORIGIN}/#travel-agency` },
    primaryImageOfPage: image ? { "@type": "ImageObject" as const, url: image } : undefined,
    breadcrumb: pathname === "/" || pathname === "/fr" ? undefined : { "@id": `${canonical}#breadcrumb` },
    inLanguage: locale,
  };

  const page: WebPage = { ...pageBase, "@type": "WebPage" };
  const article: BlogPosting | null = type === "article"
    ? {
        "@type": "BlogPosting",
        "@id": `${canonical}#article`,
        headline: title,
        description,
        image,
        datePublished,
        dateModified: dateModified ?? datePublished,
        author: { "@id": `${SITE_ORIGIN}/#organization` },
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        mainEntityOfPage: { "@id": `${canonical}#webpage` },
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      }
    : null;

  const breadcrumbs = buildBreadcrumbs(pathname, canonical, title, locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      travelAgency,
      website,
      page,
      ...(article ? [article] : []),
      ...(breadcrumbs ? [breadcrumbs] : []),
    ],
  };
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026")
    .replace(/'/g, "\\u0027");
}
