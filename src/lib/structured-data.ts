import type {
  BlogPosting,
  BreadcrumbList,
  Graph,
  Organization,
  TravelAgency,
  WebPage,
  WebSite,
} from "schema-dts";

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

function labelFromSegment(segment: string) {
  return routeLabels[segment] ?? segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildBreadcrumbs(pathname: string, canonical: string, title: string): BreadcrumbList | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const items = [
    {
      "@type": "ListItem" as const,
      position: 1,
      name: "Home",
      item: `${SITE_ORIGIN}/`,
    },
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: isLast ? title.replace(/\s*\|.*$/, "") : labelFromSegment(segment),
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
}: StructuredDataInput): Graph {
  const organization: Organization = {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: "Suenos Travel",
    alternateName: "Morocco Incoming by Suenos Travel",
    url: SITE_ORIGIN,
    email: "resa@suenos-travel.com",
    telephone: "+212661925611",
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
    description:
      "Licensed Morocco DMC and incoming travel agency for travel agencies, tour operators, groups and MICE.",
    areaServed: { "@type": "Country", name: "Morocco" },
    email: "resa@suenos-travel.com",
    telephone: "+212661925611",
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
    breadcrumb: pathname === "/" ? undefined : { "@id": `${canonical}#breadcrumb` },
    inLanguage: "en",
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

  const breadcrumbs = buildBreadcrumbs(pathname, canonical, title);
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
