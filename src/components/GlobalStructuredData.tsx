import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.morocco-incoming.com";

export default function GlobalStructuredData() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
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
    "@id": `${BASE_URL}/#travel-agency`,
    name: "Morocco Incoming by Suenos Travel",
    legalName: "Suenos Travel",
    url: BASE_URL,
    description:
      "Morocco DMC and incoming travel agency for tour operators, travel agencies, groups, MICE and corporate travel.",
    areaServed: "Morocco",
    telephone: "+212661925611",
    email: "resa@suenos-travel.com",
    identifier: [
      { "@type": "PropertyValue", name: "Moroccan travel agency licence", value: "ODV-0564" },
      { "@type": "PropertyValue", name: "IATA numeric code", value: "54273844" },
    ],
    address: [
      {
        "@type": "PostalAddress",
        addressCountry: "MA",
        addressLocality: "Agadir",
      },
      {
        "@type": "PostalAddress",
        addressCountry: "MA",
        addressLocality: "Casablanca",
      },
    ],
    parentOrganization: { "@id": `${BASE_URL}/#organization` },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Morocco Incoming by Suenos Travel",
    url: BASE_URL,
    inLanguage: "en",
    publisher: {
      "@id": `${BASE_URL}/#organization`,
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
