import { buildSeoGraph, safeJsonLd } from "../../src/lib/structured-data";
import {
  DEFAULT_SEO_IMAGE,
  PUBLIC_ORIGIN,
  getSeoMeta,
  isKnownStaticContentPath,
  normalizeSeoPath,
  resolveSeoMeta,
  type SeoOverrides,
} from "../../src/lib/seo-meta";

export { getSeoMeta, isKnownStaticContentPath, PUBLIC_ORIGIN };
export type { SeoMeta, SeoOverrides } from "../../src/lib/seo-meta";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderSeoHtml(
  template: string,
  pathname: string,
  overrides?: SeoOverrides,
  extraStructuredData?: Array<{ id: string; value: unknown }>,
) {
  const meta = resolveSeoMeta(pathname, overrides);
  const normalizedPath = normalizeSeoPath(pathname);
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const canonical = escapeHtml(meta.canonical);
  const image = escapeHtml(meta.image ?? `${PUBLIC_ORIGIN}${DEFAULT_SEO_IMAGE}`);
  const robots = meta.noindex ? "noindex, nofollow" : "index, follow";
  const structuredData = !meta.noindex
    ? safeJsonLd(buildSeoGraph({
        pathname: normalizedPath,
        title: meta.title,
        description: meta.description,
        canonical: meta.canonical,
        image,
        type: meta.type,
        datePublished: meta.datePublished,
        dateModified: meta.dateModified,
        locale: meta.locale,
      }))
    : null;
  const preload = normalizedPath === "/"
    ? '<link rel="preload" as="image" href="/images/hero-desert.jpg" fetchpriority="high" />'
    : "";
  const tags = `<!-- SEO_META_START -->
    <title data-rh="true">${title}</title>
    <meta data-rh="true" name="description" content="${description}" />
    <meta data-rh="true" name="robots" content="${robots}" />
    <link data-rh="true" data-seo-path="${escapeHtml(normalizedPath)}" rel="canonical" href="${canonical}" />
    <meta data-rh="true" property="og:site_name" content="Morocco Incoming by Suenos Travel" />
    <meta data-rh="true" property="og:title" content="${title}" />
    <meta data-rh="true" property="og:description" content="${description}" />
    <meta data-rh="true" property="og:type" content="${meta.type ?? "website"}" />
    <meta data-rh="true" property="og:url" content="${canonical}" />
    <meta data-rh="true" property="og:image" content="${image}" />
    <meta data-rh="true" property="og:image:width" content="1344" />
    <meta data-rh="true" property="og:image:height" content="768" />
    <meta data-rh="true" property="og:locale" content="${meta.locale === "fr" ? "fr_FR" : "en_US"}" />
    <meta data-rh="true" name="twitter:card" content="summary_large_image" />
    <meta data-rh="true" name="twitter:title" content="${title}" />
    <meta data-rh="true" name="twitter:description" content="${description}" />
    <meta data-rh="true" name="twitter:image" content="${image}" />
    ${meta.alternates ? `<link data-rh="true" rel="alternate" hreflang="en" href="${escapeHtml(meta.alternates.en)}" />
    <link data-rh="true" rel="alternate" hreflang="fr" href="${escapeHtml(meta.alternates.fr)}" />
    <link data-rh="true" rel="alternate" hreflang="x-default" href="${escapeHtml(meta.alternates.xDefault)}" />` : ""}
    ${structuredData ? `<script data-rh="true" id="route-seo-graph" type="application/ld+json">${structuredData}</script>` : ""}
    ${extraStructuredData?.map(({ id, value }) => `<script id="${escapeHtml(id)}" type="application/ld+json">${safeJsonLd(value)}</script>`).join("\n    ") ?? ""}
    ${preload}
    <!-- SEO_META_END -->`;

  const blockPattern = /<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/;
  if (blockPattern.test(template)) return template.replace(blockPattern, tags);

  return template.replace(/<title>[\s\S]*?<\/title>/i, "").replace("</head>", `${tags}\n  </head>`);
}
