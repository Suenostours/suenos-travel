import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.morocco-incoming.com";

export default function GlobalStructuredData() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Suenos Travel",
    alternateName: "Morocco Incoming by Suenos Travel",
    url: BASE_URL,
    sameAs: [
      "https://www.facebook.com/suenos.travel1",
      "https://www.instagram.com/suenos.travel1",
    ],
  };

  const travelAgencyJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Suenos Travel",
    url: BASE_URL,
    description:
      "Morocco DMC and incoming travel agency for tour operators, travel agencies, groups, MICE and corporate travel.",
    areaServed: "Morocco",
    telephone: "+212661925611",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
      addressLocality: "Agadir",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Morocco Incoming by Suenos Travel",
    url: BASE_URL,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Suenos Travel",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(travelAgencyJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
    </Helmet>
  );
}
