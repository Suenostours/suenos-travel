import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.morocco-incoming.com";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  noindex?: boolean;
  type?: string;
}

function toAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
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
}: SEOProps) {
  const canonicalUrl = toAbsoluteUrl(canonical);
  const imageUrl = image ? toAbsoluteUrl(image) : undefined;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
