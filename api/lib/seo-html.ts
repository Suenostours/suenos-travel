export const PUBLIC_ORIGIN = "https://www.morocco-incoming.com";

export type SeoMeta = {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
};

const DEFAULT_IMAGE = "/images/hero-desert.jpg";

const STATIC_META: Record<string, Omit<SeoMeta, "canonical">> = {
  "/": {
    title: "Morocco Incoming Agency & DMC | Suenos Travel",
    description:
      "Licensed Morocco incoming agency and DMC for travel agencies and tour operators: tailor-made circuits, groups, MICE, net rates and local support.",
    image: DEFAULT_IMAGE,
  },
  "/circuits": {
    title: "Morocco Circuits for Travel Agencies | B2B Group Tours",
    description:
      "Explore tailor-made Morocco circuits for travel agencies, tour operators and groups: imperial cities, Sahara routes, coastal stays and private programs.",
  },
  "/destinations": {
    title: "Morocco Destinations for B2B Tours | Suenos Travel DMC",
    description:
      "Plan Morocco programs for agencies and groups across Marrakech, Fes, Casablanca, Rabat, Tangier, Agadir, Essaouira, the Atlas Mountains and Sahara.",
  },
  "/services": {
    title: "Morocco Ground Services for Agencies & Groups",
    description:
      "Explore local Morocco ground services for agencies and groups, including hotels, guides, transport, tailor-made tours, activities, MICE and incentives.",
  },
  "/about": {
    title: "About Suenos Travel | Licensed Morocco DMC",
    description:
      "Learn about Suenos Travel, a licensed Morocco DMC based in Agadir and Casablanca serving agencies, tour operators, companies and B2B travel partners.",
  },
  "/mice": {
    title: "Corporate Events & Incentive Travel Services | Morocco",
    description:
      "Explore venue sourcing, delegate management, event planning, staging, transport and gala support for corporate events and incentive travel in Morocco.",
  },
  "/b2b": {
    title: "Morocco B2B Travel Agency Partner | Incoming DMC Morocco",
    description:
      "Partner with Suenos Travel for Morocco B2B travel services, net agency rates, tailor-made tours, group programs, MICE and incoming support.",
  },
  "/blog": {
    title: "Morocco Travel Blog for Agencies & Tour Operators",
    description:
      "Morocco travel insights, destination guides and DMC advice for agencies, tour operators, groups and corporate travel planners.",
  },
  "/contact": {
    title: "Contact Suenos Travel | DMC Morocco for Agencies",
    description:
      "Contact Suenos Travel, a Morocco DMC for agencies, tour operators, companies, MICE and group travel requests.",
  },
  "/quote": {
    title: "Request a Morocco DMC Quote | B2B Tours, Groups & MICE",
    description:
      "Request a custom Morocco travel quote for agencies, groups, private tours, MICE and incentives with Suenos Travel DMC.",
  },
  "/dmc-morocco": {
    title: "DMC Morocco for Travel Agencies | Local B2B Partner",
    description:
      "Work with a licensed local DMC in Morocco for tailor-made circuits, groups, MICE, hotels, guides, transport, net agency rates and on-site support.",
  },
  "/incoming-agency-morocco": {
    title: "Incoming Agency Morocco | B2B Travel Partner for Groups",
    description:
      "Morocco incoming agency for foreign travel agencies, groups and tour operators. Hotels, guides, transport, circuits and tailor-made B2B services.",
  },
  "/morocco-tours-for-travel-agencies": {
    title: "Morocco Tours for Travel Agencies | B2B DMC Programs",
    description:
      "Morocco tours for travel agencies and tour operators. Imperial cities, Sahara, Atlas, coast, MICE and tailor-made group programs with net agency rates.",
  },
  "/morocco-group-tours": {
    title: "Morocco Group Tours for Agencies | B2B Programs",
    description:
      "Morocco group tours for agencies, tour operators and MICE planners. Custom circuits, hotels, transport, guides and local support.",
  },
  "/mice-morocco": {
    title: "MICE Morocco | Incentive Travel & Corporate Groups DMC",
    description:
      "MICE Morocco DMC for incentive travel, corporate groups, meetings, gala dinners, team building and delegate logistics.",
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

const BLOG_META: Record<string, Omit<SeoMeta, "canonical">> = {
  "/blog/what-does-a-dmc-in-morocco-do-for-travel-agencies": {
    title: "What Does a DMC in Morocco Do for Travel Agencies?",
    description:
      "Learn how a Morocco DMC supports agencies with itinerary design, hotels, transport, guides, MICE logistics, net rates and local operations.",
    type: "article",
  },
  "/blog/how-to-choose-a-morocco-incoming-agency": {
    title: "How to Choose a Morocco Incoming Agency | B2B Guide",
    description:
      "A practical guide for agencies choosing a Morocco incoming partner: licensing, net rates, communication, group logistics and local support.",
    type: "article",
  },
  "/blog/mice-morocco-best-destinations-for-incentive-groups": {
    title: "MICE Morocco: Best Destinations for Incentive Groups",
    description:
      "Compare Marrakech, Agadir, Casablanca, Fes, Essaouira and the Sahara for meetings, incentives and corporate groups in Morocco.",
    type: "article",
  },
};

function normalizePath(pathname: string) {
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

export function getSeoMeta(pathname: string): SeoMeta {
  const path = normalizePath(pathname);
  const staticMeta = STATIC_META[path] ?? BLOG_META[path];
  if (staticMeta) {
    return { ...staticMeta, canonical: `${PUBLIC_ORIGIN}${path === "/" ? "/" : path}` };
  }

  if (path.startsWith("/circuits/")) {
    const name = titleFromSlug(path.slice("/circuits/".length));
    return {
      title: `${name} | Morocco Circuit | Suenos Travel`,
      description: `Explore the ${name} itinerary with Suenos Travel, a local Morocco DMC for agencies, groups and tailor-made travel programs.`,
      canonical: `${PUBLIC_ORIGIN}${path}`,
    };
  }

  if (path.startsWith("/destinations/")) {
    const name = titleFromSlug(path.slice("/destinations/".length));
    return {
      title: `${name} Morocco Programs & Excursions | Local DMC`,
      description: `Plan ${name} programs, excursions and B2B Morocco itineraries for agencies and groups with Suenos Travel DMC.`,
      canonical: `${PUBLIC_ORIGIN}${path}`,
    };
  }

  if (path.startsWith("/blog/")) {
    const name = titleFromSlug(path.slice("/blog/".length));
    return {
      title: `${name} | Suenos Travel Morocco Blog`,
      description:
        "Practical Morocco destination and DMC guidance for travel agencies, tour operators, groups and corporate travel planners.",
      canonical: `${PUBLIC_ORIGIN}${path}`,
      type: "article",
    };
  }

  if (path === "/admin" || path.startsWith("/admin/")) {
    return {
      title: "Suenos Travel Administration",
      description: "Secure administration area for Suenos Travel.",
      canonical: `${PUBLIC_ORIGIN}${path}`,
      noindex: true,
    };
  }

  return {
    title: "Page Not Found | Suenos Travel DMC Morocco",
    description: "The requested page could not be found.",
    canonical: `${PUBLIC_ORIGIN}${path}`,
    noindex: true,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

type SeoOverrides = {
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  image?: string | null;
};

export function renderSeoHtml(template: string, pathname: string, overrides?: SeoOverrides) {
  const fallback = getSeoMeta(pathname);
  const meta: SeoMeta = {
    ...fallback,
    title: overrides?.title?.trim() || fallback.title,
    description: overrides?.description?.trim() || fallback.description,
    canonical: overrides?.canonical?.trim() || fallback.canonical,
    image: overrides?.image?.trim() || fallback.image,
  };
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const canonical = escapeHtml(meta.canonical);
  const image = escapeHtml(
    meta.image?.startsWith("http")
      ? meta.image
      : `${PUBLIC_ORIGIN}${meta.image ?? DEFAULT_IMAGE}`,
  );
  const robots = meta.noindex ? "noindex, nofollow" : "index, follow";
  const preload = normalizePath(pathname) === "/"
    ? '<link rel="preload" as="image" href="/images/hero-desert.jpg" fetchpriority="high" />'
    : "";
  const tags = `<!-- SEO_META_START -->
    <title data-rh="true">${title}</title>
    <meta data-rh="true" name="description" content="${description}" />
    <meta data-rh="true" name="robots" content="${robots}" />
    <link data-rh="true" rel="canonical" href="${canonical}" />
    <meta data-rh="true" property="og:site_name" content="Morocco Incoming by Suenos Travel" />
    <meta data-rh="true" property="og:title" content="${title}" />
    <meta data-rh="true" property="og:description" content="${description}" />
    <meta data-rh="true" property="og:type" content="${meta.type ?? "website"}" />
    <meta data-rh="true" property="og:url" content="${canonical}" />
    <meta data-rh="true" property="og:image" content="${image}" />
    <meta data-rh="true" property="og:image:width" content="1344" />
    <meta data-rh="true" property="og:image:height" content="768" />
    <meta data-rh="true" property="og:locale" content="en_US" />
    <meta data-rh="true" name="twitter:card" content="summary_large_image" />
    <meta data-rh="true" name="twitter:title" content="${title}" />
    <meta data-rh="true" name="twitter:description" content="${description}" />
    <meta data-rh="true" name="twitter:image" content="${image}" />
    ${preload}
    <!-- SEO_META_END -->`;

  const blockPattern = /<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/;
  if (blockPattern.test(template)) return template.replace(blockPattern, tags);

  return template.replace(/<title>[\s\S]*?<\/title>/i, "").replace("</head>", `${tags}\n  </head>`);
}
