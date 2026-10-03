import type { Locale } from "@/providers/i18n";
import { hasReviewedFrenchEquivalent, localizedPath, splitLocalePath } from "@/lib/locale-routes";

export const PUBLIC_ORIGIN = "https://www.morocco-incoming.com";
export const DEFAULT_SEO_IMAGE = "/images/hero-desert.jpg";

export type SeoMeta = {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  datePublished?: string;
  dateModified?: string;
  locale?: Locale;
  alternates?: { en: string; fr: string; xDefault: string };
};

export type SeoOverrides = Partial<SeoMeta>;

type SavedSeoMeta = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonical?: string | null;
  ogImage?: string | null;
};

const STATIC_META: Record<string, Omit<SeoMeta, "canonical">> = {
  "/": {
    title: "Morocco Incoming Agency & DMC | Suenos Travel",
    description:
      "Licensed Morocco incoming agency and DMC for travel agencies and tour operators: tailor-made circuits, groups, MICE, net rates and local support.",
    image: DEFAULT_SEO_IMAGE,
  },
  "/circuits": {
    title: "Morocco Circuits for Travel Agencies | B2B Group Tours",
    description:
      "Explore tailor-made Morocco circuits for travel agencies, tour operators and groups: imperial cities, Sahara routes, coastal stays and private programs.",
    image: "/images/circuit-sahara.jpg",
  },
  "/destinations": {
    title: "Morocco Destinations for B2B Tours | Suenos Travel DMC",
    description:
      "Plan Morocco programs for agencies and groups across Marrakech, Fes, Casablanca, Rabat, Tangier, Agadir, Essaouira, the Atlas Mountains and Sahara.",
    image: "/images/circuit-imperial.jpg",
  },
  "/services": {
    title: "Morocco Ground Services for Agencies & Groups",
    description:
      "Explore local Morocco ground services for agencies and groups, including hotels, guides, transport, tailor-made tours, activities, MICE and incentives.",
    image: "/images/about-riad.jpg",
  },
  "/about": {
    title: "About Suenos Travel | Licensed Morocco DMC",
    description:
      "Learn about Suenos Travel, a licensed Morocco DMC based in Agadir and Casablanca serving agencies, tour operators, companies and B2B travel partners.",
    image: "/images/about-riad.jpg",
  },
  "/mice": {
    title: "Corporate Events & Incentive Travel Services | Morocco",
    description:
      "Explore venue sourcing, delegate management, event planning, staging, transport and gala support for corporate events and incentive travel in Morocco.",
    image: "/images/circuit-luxury.jpg",
  },
  "/b2b": {
    title: "Morocco B2B Travel Agency Partner | Incoming DMC Morocco",
    description:
      "Partner with Suenos Travel for Morocco B2B travel services, net agency rates, tailor-made tours, group programs, MICE and incoming support.",
    image: DEFAULT_SEO_IMAGE,
  },
  "/blog": {
    title: "Morocco DMC & Group Travel Insights for Agencies",
    description:
      "Practical Morocco DMC guidance for travel agencies: group operations, MICE planning, destination advice, sample programs and local travel expertise.",
    image: DEFAULT_SEO_IMAGE,
  },
  "/contact": {
    title: "Contact Suenos Travel | DMC Morocco for Agencies",
    description:
      "Contact Suenos Travel, a Morocco DMC for agencies, tour operators, companies, MICE and group travel requests.",
    image: "/images/about-riad.jpg",
  },
  "/quote": {
    title: "Request a Morocco DMC Quote | B2B Tours, Groups & MICE",
    description:
      "Request a custom Morocco travel quote for agencies, groups, private tours, MICE and incentives with Suenos Travel DMC.",
    image: DEFAULT_SEO_IMAGE,
  },
  "/dmc-morocco": {
    title: "DMC in Morocco for Travel Agencies | Licensed Local Partner",
    description:
      "Licensed Morocco DMC for travel agencies and tour operators. Get tailor-made itineraries, net rates, group and MICE operations, and local support.",
    image: DEFAULT_SEO_IMAGE,
  },
  "/incoming-agency-morocco": {
    title: "Incoming Agency Morocco | B2B Travel Partner for Groups",
    description:
      "Morocco incoming agency for foreign travel agencies, groups and tour operators. Hotels, guides, transport, circuits and tailor-made B2B services.",
    image: DEFAULT_SEO_IMAGE,
  },
  "/morocco-tours-for-travel-agencies": {
    title: "Morocco Tours for Travel Agencies | B2B DMC Programs",
    description:
      "Morocco tours for travel agencies and tour operators. Imperial cities, Sahara, Atlas, coast, MICE and tailor-made group programs with net agency rates.",
    image: DEFAULT_SEO_IMAGE,
  },
  "/morocco-group-tours": {
    title: "Morocco Group Tours for Travel Agencies | B2B DMC",
    description:
      "Plan Morocco group tours with a licensed local DMC: custom itineraries, hotels, coaches, guides, net agency rates and on-site support.",
    image: DEFAULT_SEO_IMAGE,
  },
  "/mice-morocco": {
    title: "MICE Morocco DMC | Incentives, Corporate Groups & Events",
    description:
      "Plan MICE and incentive travel in Morocco with a licensed local DMC: venues, hotels, transport, gala dinners, team building and delegate logistics.",
    image: DEFAULT_SEO_IMAGE,
  },
  "/privacy": {
    title: "Privacy Policy | Suenos Travel",
    description: "Privacy policy of Suenos Travel DMC Morocco.",
    noindex: true,
  },
  "/terms": {
    title: "Terms & Conditions | Suenos Travel",
    description: "Terms and conditions of Suenos Travel DMC Morocco.",
    noindex: true,
  },
};

const FRENCH_META: Record<string, Omit<SeoMeta, "canonical">> = {
  "/": {
    title: "Agence réceptive au Maroc & DMC B2B | Suenos Travel",
    description:
      "Agence réceptive et DMC au Maroc pour agences de voyage, tour-opérateurs, groupes et MICE : circuits sur mesure et services locaux.",
    image: DEFAULT_SEO_IMAGE,
    locale: "fr",
  },
  "/about": {
    title: "À propos de Suenos Travel | Agence réceptive au Maroc",
    description:
      "Découvrez Suenos Travel, agence de voyages marocaine agréée avec des équipes à Agadir et Casablanca et des services réceptifs B2B.",
    image: "/images/about-riad.jpg",
    locale: "fr",
  },
  "/circuits": {
    title: "Circuits au Maroc pour agences de voyage | Catalogue B2B",
    description:
      "Catalogue de circuits au Maroc traduits en français pour agences et tour-opérateurs, avec itinéraires adaptables et services locaux.",
    image: "/images/circuit-sahara.jpg",
    locale: "fr",
  },
  "/quote": {
    title: "Demander un devis DMC au Maroc | Circuits, groupes et MICE",
    description:
      "Envoyez votre brief pour recevoir une proposition de programme au Maroc destinée aux agences, groupes, circuits sur mesure et projets MICE.",
    image: DEFAULT_SEO_IMAGE,
    locale: "fr",
  },
  "/services": {
    title: "Services DMC au Maroc pour agences et groupes",
    description:
      "Découvrez nos services réceptifs au Maroc pour agences et groupes : hébergement, guides, transport, circuits sur mesure, activités et MICE.",
    image: "/images/about-riad.jpg",
    locale: "fr",
  },
  "/incoming-agency-morocco": {
    title: "Agence réceptive au Maroc | Partenaire B2B local",
    description:
      "Agence réceptive au Maroc pour agences et tour-opérateurs : itinéraires, hôtels, transport, guides, activités et coordination locale.",
    image: DEFAULT_SEO_IMAGE,
    locale: "fr",
  },
  "/morocco-tours-for-travel-agencies": {
    title: "Circuits au Maroc pour agences de voyage | DMC B2B",
    description:
      "Circuits au Maroc pour agences et tour-opérateurs : itinéraires sur mesure, hôtels, transport, guides et services locaux.",
    image: "/images/circuit-imperial.jpg",
    locale: "fr",
  },
  "/mice-morocco": {
    title: "DMC MICE au Maroc | Incentives et groupes corporate",
    description:
      "Organisation MICE au Maroc : hôtels, lieux, transport des participants, activités, dîners, incentives et coordination locale.",
    image: "/images/circuit-luxury.jpg",
    locale: "fr",
  },
};

const BLOG_META: Record<string, Omit<SeoMeta, "canonical">> = {
  "/blog/what-does-a-dmc-in-morocco-do-for-travel-agencies": {
    title: "Best DMC in Morocco for Travel Agencies | Selection Guide",
    description:
      "A practical guide to choosing the best DMC in Morocco for your travel agency: licensing, B2B rates, group operations, communication and local support.",
    type: "article",
    image: "/images/about-riad.jpg",
    datePublished: "2026-06-19",
    dateModified: "2026-09-10",
  },
  "/blog/how-to-choose-a-morocco-incoming-agency": {
    title: "How to Choose a Morocco Incoming Agency | B2B Guide",
    description:
      "A practical guide for agencies choosing a Morocco incoming partner: licensing, net rates, communication, group logistics and local support.",
    type: "article",
    image: "/images/circuit-imperial.jpg",
    datePublished: "2026-06-19",
    dateModified: "2026-06-19",
  },
  "/blog/mice-morocco-best-destinations-for-incentive-groups": {
    title: "MICE Morocco: Best Destinations for Incentive Groups",
    description:
      "Compare Marrakech, Agadir, Casablanca, Fes, Essaouira and the Sahara for meetings, incentives and corporate groups in Morocco.",
    type: "article",
    image: "/images/circuit-luxury.jpg",
    datePublished: "2026-06-19",
    dateModified: "2026-06-19",
  },
  "/blog/morocco-tours-for-travel-agencies-b2b-programs": {
    title: "Morocco Tours for Travel Agencies: How B2B Programs Work",
    description:
      "Learn how B2B Morocco programs are built for travel agencies, including itinerary design, net rates, white-label support and group logistics.",
    type: "article",
    image: "/images/circuit-imperial.jpg",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
  },
  "/blog/morocco-travel-guide-2026": {
    title: "Morocco Travel Guide 2026 | Best Time, Places & Tips",
    description:
      "Plan Morocco travel in 2026 with practical advice on the best time to visit, key destinations, transport, culture and itinerary ideas.",
    type: "article",
    image: DEFAULT_SEO_IMAGE,
    datePublished: "2026-01-15",
    dateModified: "2026-01-15",
  },
  "/blog/sahara-desert-camps": {
    title: "Best Sahara Desert Camps in Morocco | Practical Guide",
    description:
      "Compare Morocco Sahara desert camp experiences, comfort levels, locations and planning tips for private clients, groups and agencies.",
    type: "article",
    image: "/images/circuit-sahara.jpg",
    datePublished: "2026-02-01",
    dateModified: "2026-02-01",
  },
  "/blog/marrakech-hidden-gems": {
    title: "Hidden Gems of Marrakech | Local Morocco Guide",
    description:
      "Discover lesser-known places and authentic experiences beyond Marrakech's famous landmarks for tailor-made Morocco itineraries.",
    type: "article",
    image: "/images/circuit-imperial.jpg",
    datePublished: "2026-02-20",
    dateModified: "2026-02-20",
  },
};

const DESTINATION_IMAGES: Record<string, string> = {
  marrakech: "/images/circuit-imperial.jpg",
  fes: "/images/circuit-grand.jpg",
  casablanca: "/images/about-riad.jpg",
  agadir: "/images/circuit-honeymoon.jpg",
  essaouira: "/images/circuit-luxury.jpg",
  chefchaouen: "/images/circuit-grand.jpg",
  merzouga: "/images/circuit-sahara.jpg",
  ouarzazate: "/images/circuit-sahara.jpg",
  rabat: "/images/circuit-imperial.jpg",
  tangier: "/images/circuit-grand.jpg",
};

export function normalizeSeoPath(pathname: string) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isKnownStaticContentPath(pathname: string) {
  const path = normalizeSeoPath(pathname);
  const { locale, basePath } = splitLocalePath(path);
  if (locale === "fr") return Boolean(FRENCH_META[basePath]);
  const destinationSlug = basePath.startsWith("/destinations/")
    ? basePath.slice("/destinations/".length)
    : "";
  return Boolean(STATIC_META[basePath] || BLOG_META[basePath] || DESTINATION_IMAGES[destinationSlug]);
}

function buildAlternates(pathname: string) {
  if (!hasReviewedFrenchEquivalent(pathname)) return undefined;
  const en = `${PUBLIC_ORIGIN}${localizedPath(pathname, "en")}`;
  const fr = `${PUBLIC_ORIGIN}${localizedPath(pathname, "fr")}`;
  return { en, fr, xDefault: en };
}

export function getSeoMeta(pathname: string): SeoMeta {
  const path = normalizeSeoPath(pathname);
  const { locale, basePath } = splitLocalePath(path);
  const staticMeta = locale === "fr"
    ? FRENCH_META[basePath]
    : STATIC_META[basePath] ?? BLOG_META[basePath];
  if (staticMeta) {
    return {
      ...staticMeta,
      canonical: `${PUBLIC_ORIGIN}${path === "/" ? "/" : path}`,
      locale,
      alternates: buildAlternates(path),
    };
  }

  if (locale === "en" && basePath.startsWith("/destinations/")) {
    const slug = basePath.slice("/destinations/".length);
    const image = DESTINATION_IMAGES[slug];
    if (image) {
      const name = titleFromSlug(slug);
      return {
        title: `${name} Morocco B2B Excursions & Programs | Suenos Travel DMC`,
        description: `Plan ${name} excursions, day trips and Morocco programs for travel agencies, groups and MICE planners with Suenos Travel DMC.`,
        canonical: `${PUBLIC_ORIGIN}${basePath}`,
        image,
        locale,
      };
    }
  }

  if (basePath.startsWith("/circuits/") && (locale === "en" || hasReviewedFrenchEquivalent(path))) {
    const name = titleFromSlug(basePath.slice("/circuits/".length));
    return {
      title: locale === "fr"
        ? `${name} | Circuit au Maroc pour agences`
        : `${name} | Morocco DMC Tour for Agencies`,
      description: locale === "fr"
        ? "Circuit au Maroc sur mesure pour agences de voyage, tour-opérateurs, groupes et partenaires B2B avec Suenos Travel."
        : "Tailor-made Morocco tour for travel agencies, tour operators, groups and B2B partners with Suenos Travel DMC.",
      canonical: `${PUBLIC_ORIGIN}${path}`,
      image: DEFAULT_SEO_IMAGE,
      locale,
    };
  }

  if (path === "/admin" || path.startsWith("/admin/")) {
    return {
      title: "Suenos Travel Administration",
      description: "Secure administration area for Suenos Travel.",
      canonical: `${PUBLIC_ORIGIN}${path}`,
      noindex: true,
      locale,
    };
  }

  return {
    title: "Page Not Found | Suenos Travel DMC Morocco",
    description: "The requested page could not be found.",
    canonical: `${PUBLIC_ORIGIN}${path}`,
    noindex: true,
    locale,
  };
}

export function toAbsoluteSeoUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (url.hostname === "morocco-incoming.com" || url.hostname === "www.morocco-incoming.com") {
      return `${PUBLIC_ORIGIN}${url.pathname}${url.search}${url.hash}`;
    }
    return value;
  }
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${PUBLIC_ORIGIN}${path}`;
}

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function trimDescription(value?: string | null, maxLength = 155) {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength).trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${(lastSpace > 80 ? trimmed.slice(0, lastSpace) : trimmed).trim()}...`;
}

export function buildTourSeoMeta(input: {
  pathname: string;
  title?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  image?: string | null;
  dateModified?: string;
  hasFrenchEquivalent?: boolean;
}): SeoMeta {
  const path = normalizeSeoPath(input.pathname);
  const { locale, basePath } = splitLocalePath(path);
  const title = cleanText(input.title) || titleFromSlug(basePath.slice("/circuits/".length));
  return {
    title: cleanText(input.metaTitle) || (locale === "fr"
      ? `${title} | Circuit au Maroc pour agences`
      : `${title} | Morocco DMC Tour for Agencies`),
    description:
      trimDescription(input.metaDescription) ||
      trimDescription(input.description) ||
      (locale === "fr"
        ? "Circuit au Maroc sur mesure pour agences de voyage, tour-opérateurs, groupes et partenaires B2B avec Suenos Travel."
        : "Tailor-made Morocco tour for travel agencies, tour operators, groups and B2B partners with Suenos Travel DMC."),
    canonical: `${PUBLIC_ORIGIN}${path}`,
    image: input.image || DEFAULT_SEO_IMAGE,
    dateModified: input.dateModified,
    noindex: false,
    locale,
    alternates: input.hasFrenchEquivalent ? buildAlternates(path) : undefined,
  };
}

export function resolveSeoMeta(pathname: string, overrides?: SeoOverrides): SeoMeta {
  const fallback = getSeoMeta(pathname);
  const canonical = overrides?.canonical?.trim() || fallback.canonical;
  const image = overrides?.image?.trim() || fallback.image;
  const noindex = overrides?.noindex ?? fallback.noindex;
  return {
    ...fallback,
    title: overrides?.title?.trim() || fallback.title,
    description: overrides?.description?.trim() || fallback.description,
    canonical: toAbsoluteSeoUrl(canonical),
    image: image ? toAbsoluteSeoUrl(image) : undefined,
    noindex,
    type: overrides?.type ?? fallback.type,
    datePublished: overrides?.datePublished?.trim() || fallback.datePublished,
    dateModified: overrides?.dateModified?.trim() || fallback.dateModified,
    locale: overrides?.locale ?? fallback.locale,
    alternates: noindex ? undefined : (overrides?.alternates ?? fallback.alternates),
  };
}

export function resolveClientSeoMeta(
  pathname: string,
  pageOverrides: SeoOverrides,
  savedMeta?: SavedSeoMeta | null,
) {
  return resolveSeoMeta(pathname, {
    ...pageOverrides,
    title: savedMeta?.metaTitle?.trim() || pageOverrides.title,
    description: savedMeta?.metaDescription?.trim() || pageOverrides.description,
    canonical: savedMeta?.canonical?.trim() || pageOverrides.canonical,
    image: savedMeta?.ogImage?.trim() || pageOverrides.image,
  });
}
