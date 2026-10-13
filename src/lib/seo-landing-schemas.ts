const BASE_URL = "https://www.morocco-incoming.com";

export type LandingSchemaSource = {
  path: string;
  targetKeyword: string;
  metaDescription: string;
  h1: string;
  faq: Array<{ question: string; answer: string }>;
};

export function buildLandingSchemas(page: LandingSchemaSource) {
  const absoluteUrl = `${BASE_URL}${page.path}`;

  return [
    {
      id: "landing-faq-schema",
      value: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${absoluteUrl}#faq`,
        inLanguage: "en",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    },
    {
      id: "landing-service-schema",
      value: {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${absoluteUrl}#service`,
        name: page.h1,
        serviceType: page.targetKeyword,
        description: page.metaDescription,
        url: absoluteUrl,
        inLanguage: "en",
        areaServed: { "@type": "Country", name: "Morocco" },
        provider: {
          "@type": "TravelAgency",
          "@id": `${BASE_URL}/#travel-agency`,
          name: "Morocco Incoming by Suenos Travel",
          url: BASE_URL,
        },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Travel agencies, tour operators, MICE planners and corporate travel buyers",
        },
      },
    },
  ];
}
