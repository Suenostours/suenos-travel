import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { trpc } from "@/providers/trpc";
import { buildSeoGraph, safeJsonLd } from "@/lib/structured-data";

const BASE_URL = "https://www.morocco-incoming.com";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  noindex?: boolean;
  type?: string;
  datePublished?: string;
  dateModified?: string;
}

function toAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (
      url.hostname === "morocco-incoming.com" ||
      url.hostname === "www.morocco-incoming.com"
    ) {
      return `${BASE_URL}${url.pathname}${url.search}${url.hash}`;
    }
    return value;
  }
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${BASE_URL}${path}`;
}

export default function SEO({
  title,
  description,
  canonical,
  image,
  noindex = false,
  type = "website",
  datePublished,
  dateModified,
}: SEOProps) {
  const location = useLocation();
  const { data: savedMeta } = trpc.seo.getByPath.useQuery(
    { path: location.pathname },
    { staleTime: 5 * 60 * 1000, retry: 1 },
  );
  const resolvedTitle = savedMeta?.metaTitle?.trim() || title;
  const resolvedDescription = savedMeta?.metaDescription?.trim() || description;
  const resolvedCanonical = savedMeta?.canonical?.trim() || canonical;
  const resolvedImage = savedMeta?.ogImage?.trim() || image;
  const canonicalUrl = toAbsoluteUrl(resolvedCanonical);
  const imageUrl = resolvedImage ? toAbsoluteUrl(resolvedImage) : undefined;
  const structuredData = !noindex
    ? buildSeoGraph({
        pathname: location.pathname,
        title: resolvedTitle,
        description: resolvedDescription,
        canonical: canonicalUrl,
        image: imageUrl,
        type,
        datePublished,
        dateModified,
      })
    : null;

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:site_name" content="Morocco Incoming by Suenos Travel" />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_US" />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageUrl && <meta property="og:image:width" content="1344" />}
      {imageUrl && <meta property="og:image:height" content="768" />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {structuredData && (
        <script type="application/ld+json">{safeJsonLd(structuredData)}</script>
      )}
    </Helmet>
  );
}
