export type FrenchCommercialPageKey = "incomingAgency" | "toursForAgencies" | "miceMorocco";

type ContentGroup = {
  title: string;
  intro: string;
  items: Array<{ title: string; description: string }>;
};

export type FrenchCommercialPage = {
  path: string;
  eyebrow: string;
  h1: string;
  intro: string;
  whyTitle: string;
  whyText: string;
  servicesTitle: string;
  services: string[];
  groups: ContentGroup[];
  processTitle: string;
  processSteps: string[];
  faq: Array<{ question: string; answer: string }>;
};

export const frenchCommercialPages: Record<FrenchCommercialPageKey, FrenchCommercialPage> = {
  incomingAgency: {
    path: "/fr/incoming-agency-morocco",
    eyebrow: "Agence réceptive et opérations locales au Maroc",
    h1: "Agence réceptive au Maroc pour agences de voyage et tour-opérateurs",
    intro:
      "Morocco Incoming by Suenos Travel accompagne les agences étrangères, tour-opérateurs et organisateurs de groupes avec la conception de programmes, la réservation des prestations et le suivi opérationnel au Maroc.",
    whyTitle: "Un interlocuteur local pour coordonner votre programme",
    whyText:
      "Une agence réceptive relie votre cahier des charges aux réalités du terrain : distances, saison, disponibilité des hôtels, choix des véhicules, langues des guides et rythme du groupe. Notre équipe prépare une proposition réalisable et coordonne les fournisseurs retenus.",
    servicesTitle: "Services réceptifs proposés",
    services: [
      "Conception d'itinéraires sur mesure et chiffrage en tarifs nets pour les agences.",
      "Réservation d'hôtels et de riads selon la catégorie, la localisation et le profil du groupe.",
      "Transport privé, transferts aéroport, autocars et coordination des mouvements.",
      "Guides agréés, visites, activités, restauration et expériences locales.",
      "Suivi des fournisseurs et assistance locale pendant l'opération.",
      "Programmes loisirs, groupes privés, séries, extensions et demandes MICE.",
    ],
    groups: [
      {
        title: "Informations utiles pour préparer un devis",
        intro: "Un premier brief précis permet de proposer un itinéraire et des prestations cohérents.",
        items: [
          { title: "Dates et participants", description: "Dates prévues, nombre de voyageurs, marché d'origine, langue et composition du groupe." },
          { title: "Parcours souhaité", description: "Villes ou régions prioritaires, durée disponible, rythme et éventuelles extensions." },
          { title: "Niveau de service", description: "Catégorie d'hôtels, type de véhicule, repas, guide, activités et exigences particulières." },
          { title: "Cadre budgétaire", description: "Un budget indicatif aide à sélectionner des prestations réalistes et à comparer les options." },
        ],
      },
      {
        title: "Formats de voyage pris en charge",
        intro: "Le programme est adapté au profil des voyageurs et aux modalités de vente de l'agence partenaire.",
        items: [
          { title: "Circuits culturels", description: "Villes impériales, médinas, patrimoine, artisanat et étapes rurales." },
          { title: "Désert et Atlas", description: "Routes du Sud, camps, vallées, montagnes et itinéraires combinés." },
          { title: "Séjours et extensions", description: "Marrakech, Agadir, Essaouira, Casablanca et extensions avant ou après circuit." },
          { title: "Groupes et entreprises", description: "Voyages de loisirs, groupes corporate, incentives et déplacements coordonnés." },
        ],
      },
    ],
    processTitle: "De votre brief à l'opération au Maroc",
    processSteps: ["Analyse du brief", "Proposition d'itinéraire", "Chiffrage et ajustements", "Confirmation des prestations", "Préparation opérationnelle", "Suivi sur place"],
    faq: [
      { question: "Travaillez-vous avec des agences étrangères ?", answer: "Oui. Nous accompagnons les agences de voyage et tour-opérateurs étrangers qui recherchent un partenaire local pour leurs programmes au Maroc." },
      { question: "Pouvez-vous fournir des tarifs nets B2B ?", answer: "Oui. Les propositions destinées aux partenaires professionnels peuvent être préparées avec des conditions nettes adaptées au brief et aux prestations demandées." },
      { question: "Le programme peut-il être entièrement personnalisé ?", answer: "Oui. L'itinéraire, le rythme, les hôtels, le transport, les guides, les repas et les activités peuvent être adaptés au profil du groupe." },
      { question: "Assurez-vous un suivi pendant le voyage ?", answer: "Oui. Les dossiers confirmés bénéficient d'une coordination locale des prestations et d'un suivi opérationnel pendant le séjour." },
    ],
  },
  toursForAgencies: {
    path: "/fr/morocco-tours-for-travel-agencies",
    eyebrow: "Programmes B2B et circuits sur mesure",
    h1: "Circuits au Maroc pour agences de voyage et tour-opérateurs",
    intro:
      "Nous concevons des circuits au Maroc pour les agences de voyage, avec itinéraires adaptables, hôtels, transport, guides et prestations locales réunis dans une proposition opérationnelle.",
    whyTitle: "Des programmes conçus pour votre marché",
    whyText:
      "Un bon circuit tient compte de la durée, des distances, de la saison, du profil des voyageurs et du niveau de confort attendu. Nous adaptons les étapes et les inclusions pour fournir à l'agence un programme clair, réaliste et commercialisable.",
    servicesTitle: "Ce que peut inclure un circuit",
    services: [
      "Itinéraire détaillé avec étapes, visites et temps de trajet réalistes.",
      "Hôtels et riads selon la catégorie, le budget et la configuration des chambres.",
      "Véhicule privé, autocar, chauffeur et transferts aéroport.",
      "Guides agréés, accompagnement, activités et expériences locales.",
      "Repas, demi-pension ou autres formules définies dans le devis.",
      "Assistance locale et coordination des prestations confirmées.",
    ],
    groups: [
      {
        title: "Idées de circuits au Maroc",
        intro: "Ces formats servent de point de départ et peuvent être adaptés à la durée et au public de l'agence.",
        items: [
          { title: "Villes impériales", description: "Rabat, Meknès, Fès et Marrakech avec patrimoine, médinas et étapes culturelles." },
          { title: "Marrakech et désert", description: "Atlas, kasbahs, vallées du Sud et dunes avec un rythme adapté au nombre de jours." },
          { title: "Nord du Maroc", description: "Tanger, Chefchaouen, Tétouan et Fès pour un programme culturel et paysager." },
          { title: "Atlantique et culture", description: "Casablanca, Rabat, Essaouira, Agadir ou Marrakech selon les vols et la durée." },
        ],
      },
      {
        title: "Éléments à préciser dans votre demande",
        intro: "Même si le parcours reste ouvert, quelques informations permettent de proposer une première base pertinente.",
        items: [
          { title: "Durée et dates", description: "Nombre de nuits, période de voyage et éventuelle flexibilité." },
          { title: "Profil du groupe", description: "Taille, âge, langue, centres d'intérêt, mobilité et marché d'origine." },
          { title: "Hébergement", description: "Catégorie, type de chambres, pension et préférences de localisation." },
          { title: "Prestations", description: "Transport, guide, visites, activités, repas, extensions et besoins particuliers." },
        ],
      },
    ],
    processTitle: "Comment nous préparons votre circuit",
    processSteps: ["Réception du brief", "Sélection du parcours", "Proposition chiffrée", "Révisions avec l'agence", "Confirmation", "Coordination locale"],
    faq: [
      { question: "Proposez-vous des circuits en marque blanche ?", answer: "Oui. Nous pouvons fournir les éléments du programme et les prestations locales afin que l'agence les présente sous sa propre marque." },
      { question: "Les circuits sont-ils personnalisables ?", answer: "Oui. Les étapes, la durée, les hôtels, le rythme, les visites et les inclusions sont adaptés au brief de l'agence." },
      { question: "Pouvez-vous organiser des départs en série ?", answer: "Oui, sous réserve des dates et disponibilités. La planification doit préciser le calendrier, les volumes et les prestations à reproduire." },
      { question: "Quels services locaux peuvent être inclus ?", answer: "Le devis peut inclure hôtels, transport, transferts, guides, visites, activités, repas et assistance locale selon le programme." },
    ],
  },
  miceMorocco: {
    path: "/fr/mice-morocco",
    eyebrow: "Événements d'entreprise et voyages incentive",
    h1: "DMC MICE au Maroc pour incentives et groupes corporate",
    intro:
      "Morocco Incoming by Suenos Travel accompagne les agences MICE, entreprises et organisateurs avec la recherche de lieux, l'hébergement, le transport des participants, les activités, les dîners et la coordination locale.",
    whyTitle: "Pourquoi organiser un programme MICE au Maroc",
    whyText:
      "Marrakech, Agadir, Casablanca, Rabat, Fès, l'Atlas et le désert offrent des formats différents pour réunions, incentives et extensions. Le choix dépend des vols, du nombre de participants, du programme de travail, du niveau d'exclusivité et du temps disponible.",
    servicesTitle: "Services MICE coordonnés sur place",
    services: [
      "Recherche d'hôtels, de salles, de lieux de réception et d'espaces pour dîners.",
      "Transferts aéroport, navettes, autocars, véhicules privés et mouvements des participants.",
      "Activités incentive, team building, expériences culturelles et extensions de séjour.",
      "Dîners de gala, restauration, animations et coordination des fournisseurs retenus.",
      "Guides, accueil, assistance locale et suivi du déroulé opérationnel.",
      "Programmes combinant réunions, temps libres et découverte de la destination.",
    ],
    groups: [
      {
        title: "Formats MICE accompagnés",
        intro: "Chaque opération est structurée selon l'objectif de l'événement et le profil des participants.",
        items: [
          { title: "Réunions et séminaires", description: "Hôtels, salles, repas, transferts et activités autour des sessions de travail." },
          { title: "Voyages incentive", description: "Expériences, dîners et moments collectifs conçus comme programme de récompense." },
          { title: "Retraites de direction", description: "Formats plus restreints avec transport privé, espaces de réunion et rythme flexible." },
          { title: "Événements et célébrations", description: "Lieux, hospitalité, déplacements, dîner et coordination du programme local." },
        ],
      },
      {
        title: "Contenu d'un brief MICE utile",
        intro: "Un cadre initial aide à sélectionner la destination, les lieux et les solutions logistiques appropriées.",
        items: [
          { title: "Participants", description: "Nombre estimé, pays d'origine, langues, profils et besoins d'accessibilité." },
          { title: "Dates et vols", description: "Fenêtre de voyage, arrivées, départs, vagues de transferts et éventuelle flexibilité." },
          { title: "Objectifs", description: "Réunions, incentive, team building, gala, loisirs et niveau d'exclusivité recherché." },
          { title: "Contraintes opérationnelles", description: "Hôtels, salles, audiovisuel, restauration, identité visuelle, sécurité et budget." },
        ],
      },
    ],
    processTitle: "Du brief MICE à la coordination sur place",
    processSteps: ["Objectifs et participants", "Concept et destination", "Proposition chiffrée", "Validation des fournisseurs", "Plan opérationnel", "Coordination sur place"],
    faq: [
      { question: "Quelles destinations conviennent au MICE au Maroc ?", answer: "Marrakech, Agadir, Casablanca, Rabat et Fès peuvent convenir, avec des extensions dans l'Atlas, à Agafay ou dans le désert selon le groupe et la durée." },
      { question: "Pouvez-vous gérer les transferts des participants ?", answer: "Oui. Le dispositif peut inclure transferts aéroport, navettes, véhicules privés, autocars et coordination des mouvements entre hôtels, lieux et activités." },
      { question: "Organisez-vous des voyages incentive ?", answer: "Oui. Nous pouvons coordonner hébergement, transport, expériences, activités d'équipe, dîners et assistance locale pour un programme incentive." },
      { question: "Pouvez-vous combiner réunions et découverte du Maroc ?", answer: "Oui. Le programme peut alterner sessions de travail, activités, dîners et extensions avant ou après l'événement." },
    ],
  },
};

export function buildFrenchCommercialSchemas(page: FrenchCommercialPage) {
  const absoluteUrl = `https://www.morocco-incoming.com${page.path}`;
  return [
    {
      id: "landing-faq-schema",
      value: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${absoluteUrl}#faq`,
        inLanguage: "fr",
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
        description: page.intro,
        url: absoluteUrl,
        inLanguage: "fr",
        areaServed: { "@type": "Country", name: "Maroc" },
        provider: { "@id": "https://www.morocco-incoming.com/#travel-agency" },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Agences de voyage, tour-opérateurs, organisateurs MICE et entreprises",
        },
      },
    },
  ];
}
