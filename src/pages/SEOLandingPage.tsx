import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const BASE_URL = "https://www.morocco-incoming.com";

type LandingPageKey =
  | "dmcMorocco"
  | "incomingAgencyMorocco"
  | "moroccoToursForTravelAgencies"
  | "moroccoGroupTours"
  | "miceMorocco";

type LandingPageData = {
  path: string;
  targetKeyword: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string;
  whyTitle: string;
  whyText: string;
  providesTitle: string;
  provides: string[];
  useCasesTitle: string;
  useCases: string[];
  localDmcTitle: string;
  localDmcText: string;
  trustItems?: string[];
  contentSections?: {
    title: string;
    intro?: string;
    items?: { title: string; description: string; path?: string }[];
    text?: string;
  }[];
  processSteps?: string[];
  faq: { question: string; answer: string }[];
};

const landingPages: Record<LandingPageKey, LandingPageData> = {
  dmcMorocco: {
    path: "/dmc-morocco",
    targetKeyword: "DMC Morocco",
    seoTitle: "DMC Morocco | Local Destination Management Company for Agencies",
    metaDescription: "Local Morocco DMC for travel agencies, tour operators, groups and MICE. Tailor-made programs, net agency rates and on-site support.",
    h1: "DMC Morocco for Travel Agencies and Tour Operators",
    eyebrow: "Local Morocco destination management company",
    intro: "Morocco Incoming by Suenos Travel supports foreign travel agencies, tour operators and MICE planners with Morocco programs built for B2B needs: realistic routing, reliable suppliers, net agency rates and local operational support from a local DMC in Morocco.",
    whyTitle: "Why a Morocco DMC matters for agencies",
    whyText: "Morocco is easy to sell, but the operation can become complex: long driving distances, seasonal hotel demand, multilingual guiding, desert logistics, incentive venues and supplier coordination. A local DMC helps your agency protect quality, timing and client expectations from first quote to final departure.",
    providesTitle: "What Morocco Incoming by Suenos Travel provides",
    provides: [
      "Tailor-made Morocco circuits for groups, private clients and series departures.",
      "Hotel, riad, camp, guide, transport and activity coordination through one local team.",
      "MICE and incentive support for corporate groups, gala dinners, team building and delegate logistics.",
      "Net agency rates, white-label program support and on-site assistance during operations.",
    ],
    useCasesTitle: "Example DMC programs",
    useCases: [
      "Imperial cities and Sahara programs for cultural groups.",
      "Marrakech, Agafay and Atlas incentive programs for companies.",
      "Luxury private Morocco tours with premium riads, guides and curated experiences.",
      "Pre/post MICE extensions from Casablanca, Marrakech, Agadir or Tangier.",
    ],
    localDmcTitle: "Why work with a local Moroccan DMC",
    localDmcText: "A Morocco-based team understands local timing, supplier reliability, regional differences and client expectations on the ground. That helps agencies quote faster, avoid weak routing, and deliver programs with stronger operational control.",
    trustItems: [
      "Licensed Moroccan Travel Agency & DMC",
      "Licence ODV-0564",
      "IATA 54273844",
      "Agadir & Casablanca",
      "Dedicated B2B incoming division",
      "Net agency rates",
      "White-label programs",
      "24-48h quote response",
      "On-site support",
    ],
    contentSections: [
      {
        title: "What does a DMC in Morocco handle for agencies?",
        intro: "A Destination Management Company in Morocco connects the full local operation for foreign travel agencies, tour operators, groups and MICE planners.",
        items: [
          { title: "Hotels & riads", description: "Sourcing and coordination for hotels, riads, resorts and desert camps according to the agency brief." },
          { title: "Licensed guides", description: "Multilingual licensed guides for city visits, cultural tours, group circuits and specialist programs." },
          { title: "Private transport", description: "Airport transfers, private vehicles, coaches, VIP transfers and multi-city routing across Morocco." },
          { title: "Group logistics", description: "Timing, luggage flow, meal planning, check-in coordination and supplier follow-up for agency groups." },
          { title: "Sahara camps", description: "Operational planning for Merzouga or desert-style extensions with realistic routing and camp matching." },
          { title: "MICE & incentives", description: "Support for meetings, incentives, gala dinners, team building, delegate movement and corporate extensions.", path: "/mice-morocco" },
          { title: "Restaurants & meals", description: "Group meals, special dinners, dietary coordination and local restaurant planning." },
          { title: "Excursions & experiences", description: "Guided visits, Atlas excursions, Agafay events, cooking classes, coastal trips and local experiences." },
          { title: "On-site assistance", description: "Local support during operations so agencies have one Morocco DMC contact responsible for delivery." },
        ],
      },
      {
        title: "DMC Morocco services by destination",
        intro: "Our Morocco DMC services adapt by city and region, from cultural circuits to desert programs, coastal stays and MICE operations.",
        items: [
          { title: "Marrakech DMC services", description: "Incentives, Agafay dinners, Atlas excursions, riads, events and private city programs.", path: "/destinations/marrakech" },
          { title: "Fes cultural programs", description: "Medina visits, heritage routing, Meknes, Volubilis and northern Morocco extensions.", path: "/destinations/fes" },
          { title: "Casablanca business travel", description: "Airport logistics, business groups, Rabat extensions and first or last nights.", path: "/destinations/casablanca" },
          { title: "Agadir groups & retreats", description: "Beach resorts, golf, corporate retreats, Souss Massa and Anti-Atlas excursions.", path: "/destinations/agadir" },
          { title: "Tangier northern routes", description: "Spain-linked programs, Chefchaouen, Tetouan, Asilah and Mediterranean extensions.", path: "/destinations/tangier" },
          { title: "Merzouga Sahara programs", description: "Desert camps, camel trekking, 4x4 dunes and premium Sahara extensions.", path: "/destinations/merzouga" },
          { title: "Ouarzazate kasbah routes", description: "Ait Ben Haddou, film studios, Skoura, Dades, Todra and desert-route logistics.", path: "/destinations/ouarzazate" },
        ],
      },
    ],
    faq: [
      { question: "What does a DMC in Morocco do for travel agencies?", answer: "A Morocco DMC coordinates local services such as hotels, riads, licensed guides, private transport, excursions, restaurants, Sahara camps, MICE logistics and on-site assistance for agencies and tour operators." },
      { question: "Can Suenos Travel work with agency net rates?", answer: "Yes. We prepare B2B proposals with agency-friendly conditions and net rates according to the program, season, hotels and group profile." },
      { question: "Is Morocco Incoming a local DMC in Morocco?", answer: "Yes. Morocco Incoming by Suenos Travel is the B2B incoming division of a licensed Moroccan travel agency with operations in Agadir and Casablanca." },
      { question: "Do you support Morocco DMC programs for groups and MICE?", answer: "Yes. We support meetings, incentives, corporate groups, gala dinners, team building, transfers, delegate logistics and group circuits in Morocco." },
    ],
  },
  incomingAgencyMorocco: {
    path: "/incoming-agency-morocco",
    targetKeyword: "Incoming agency Morocco",
    seoTitle: "Incoming Agency Morocco | B2B Travel Partner for Groups",
    metaDescription: "Morocco incoming agency for foreign travel agencies, groups and tour operators. Hotels, guides, transport, circuits and tailor-made B2B services.",
    h1: "Incoming Agency in Morocco for B2B Travel Partners",
    eyebrow: "Morocco incoming services for agencies",
    intro: "Morocco Incoming by Suenos Travel acts as a local incoming agency Morocco partner for foreign agencies that need dependable ground handling, tailor-made circuits, group logistics and fast quotation support inside Morocco.",
    whyTitle: "Why Incoming Morocco support matters",
    whyText: "Foreign agencies need more than isolated supplier contacts. A strong Incoming Morocco partner connects the full operation: arrival logistics, hotel allocations, transport timing, guides, visits, meals, local experiences and emergency support.",
    providesTitle: "Incoming services we coordinate",
    provides: [
      "Ground handling for groups, private clients, series departures and corporate travel.",
      "Hotels, riads, desert camps, restaurants, guides, transfers and excursions.",
      "Tailor-made B2B itineraries across Marrakech, Fes, Casablanca, Rabat, Agadir, Tangier, the Atlas and Sahara.",
      "Operational follow-up before arrival and assistance while clients are in Morocco.",
    ],
    useCasesTitle: "Typical incoming requests",
    useCases: [
      "A European tour operator needs a Morocco partner for a new group series.",
      "An agency needs a private Sahara program with premium hotels and local experiences.",
      "A company needs airport transfers, hotel blocks and activities for an incentive group.",
      "A travel designer needs white-label Morocco routing for high-value clients.",
    ],
    localDmcTitle: "Why choose a local incoming agency",
    localDmcText: "Local presence helps control supplier communication, quality checks and last-minute adjustments. For agencies, that means fewer operational surprises and a clearer local partner responsible for delivery.",
    trustItems: [
      "Licensed Moroccan Travel Agency",
      "Licence ODV-0564",
      "IATA 54273844",
      "Agadir & Casablanca",
      "B2B incoming division",
      "Net agency rates",
      "24-48h quote response",
      "On-site group support",
    ],
    contentSections: [
      {
        title: "Incoming agency vs DMC in Morocco",
        text: "An incoming agency manages local services inside Morocco for foreign agencies and tour operators. A DMC usually also handles destination design, MICE, incentives and full local operations. Morocco Incoming combines both roles for B2B partners: incoming services, destination management, net-rate proposals and on-site support.",
      },
      {
        title: "Incoming services by request type",
        intro: "Every brief is different, so our incoming agency Morocco support adapts the routing, hotel level, guide language and logistics to the client profile.",
        items: [
          { title: "Series groups", description: "Repeat departures with consistent routing, hotel planning, guide coordination and supplier follow-up." },
          { title: "Private FIT clients", description: "Tailor-made Morocco programs for private clients, families and premium travel designers." },
          { title: "MICE and incentive groups", description: "Corporate extensions, incentive activities, delegate movement and event logistics.", path: "/mice-morocco" },
          { title: "Luxury travel", description: "Premium riads, private guides, VIP transport, curated experiences and slower pacing." },
          { title: "Student and cultural groups", description: "Educational routing, heritage visits, cultural guides and group-friendly logistics." },
          { title: "Desert programs", description: "Merzouga, Ouarzazate, valleys, Sahara camps and realistic desert-route planning.", path: "/destinations/merzouga" },
          { title: "Coastal extensions", description: "Essaouira, Agadir, Tangier and Atlantic coast add-ons for groups and private clients.", path: "/destinations/essaouira" },
        ],
      },
    ],
    processSteps: ["Brief", "Routing", "Net Quote", "Confirmation", "Operation", "Follow-up"],
    faq: [
      { question: "What is an incoming agency in Morocco?", answer: "An incoming agency Morocco partner manages travel services inside Morocco for foreign agencies, tour operators, companies and groups." },
      { question: "What is the difference between Incoming Morocco and a DMC?", answer: "Incoming Morocco services focus on local ground handling and travel operations. A DMC also designs destination programs, MICE, incentives and full local experiences. Morocco Incoming combines both roles for B2B partners." },
      { question: "Can you handle both groups and private clients?", answer: "Yes. We prepare programs for private clients, leisure groups, MICE groups, family groups, cultural groups and agency series." },
      { question: "How do agencies request a B2B incoming proposal?", answer: "Agencies can send dates, group size, routing, hotel level, budget range and client profile through the quote or B2B form." },
    ],
  },
  moroccoToursForTravelAgencies: {
    path: "/morocco-tours-for-travel-agencies",
    targetKeyword: "Morocco tours for travel agencies",
    seoTitle: "Morocco Tours for Travel Agencies | B2B DMC Programs",
    metaDescription: "Morocco tours for travel agencies and tour operators. Imperial cities, Sahara, Atlas, coast, MICE and tailor-made group programs with net agency rates.",
    h1: "Morocco Tours for Travel Agencies",
    eyebrow: "B2B Morocco circuits and tailor-made programs",
    intro: "We design Morocco tours for travel agencies that need sellable routes, realistic pacing, local supplier coordination and B2B conditions for private clients, groups, series departures and MICE extensions.",
    whyTitle: "Why agency Morocco tours need local planning",
    whyText: "A Morocco program must balance highlights with operational reality: driving time, hotel categories, guide availability, desert camp standards, meal planning and seasonal demand. Local planning makes the program easier to sell and safer to operate.",
    providesTitle: "What our agency tour programs include",
    provides: [
      "Imperial cities, Sahara, Atlas, Atlantic coast, luxury, family, incentive and cultural routes.",
      "Routing suggestions based on your client market, travel dates, group size and budget.",
      "Local guides, transport, hotels, riads, camps, experiences and assistance.",
      "Program adaptation for private tours, fixed groups, white-label agency requests and corporate groups.",
    ],
    useCasesTitle: "Example Morocco tour programs",
    useCases: [
      "8 to 10 day imperial cities and Sahara circuits.",
      "Marrakech, Atlas and Agafay short programs for incentive groups.",
      "Fes, Chefchaouen and Tangier northern Morocco routes.",
      "Agadir, Essaouira and Atlantic coast leisure group programs.",
    ],
    localDmcTitle: "Why agencies work with Suenos Travel",
    localDmcText: "Our local team helps agencies turn a sales idea into a workable Morocco operation, with clear inclusions, adapted routing and support from quotation to on-site delivery.",
    faq: [
      { question: "Do you create white-label Morocco tours for agencies?", answer: "Yes. We can prepare tailor-made programs that agencies sell under their own brand, depending on the request and operating conditions." },
      { question: "Can programs include Sahara and coastal destinations?", answer: "Yes. We build routes across the imperial cities, Sahara, Atlas Mountains, Atlantic coast and northern Morocco." },
      { question: "Can we request net agency rates?", answer: "Yes. Agencies can request B2B net rates by sharing travel dates, group size, hotel level, routing and client profile." },
    ],
  },
  moroccoGroupTours: {
    path: "/morocco-group-tours",
    targetKeyword: "Morocco group tours",
    seoTitle: "Morocco Group Tours for Agencies | B2B Programs",
    metaDescription: "Morocco group tours for agencies, tour operators and MICE planners. Custom circuits, hotels, transport, guides and local support.",
    h1: "Morocco Group Tours for Agencies and Tour Operators",
    eyebrow: "Group travel operations across Morocco",
    intro: "Suenos Travel creates Morocco group tours for agencies, tour operators and corporate planners who need organized logistics, reliable local suppliers, group-friendly pacing and destination expertise.",
    whyTitle: "Why group tours need careful Morocco operations",
    whyText: "Groups require stronger timing discipline than FIT travel: coach routing, luggage handling, guide coordination, meal planning, check-in flow, activity timing and support if plans change. A local DMC keeps these details connected.",
    providesTitle: "What we manage for Morocco groups",
    provides: [
      "Custom circuits for leisure groups, cultural groups, corporate groups and incentive travel.",
      "Transport planning, licensed guides, hotel allocations, restaurants, excursions and visits.",
      "Group-friendly routing across Marrakech, Fes, Casablanca, Rabat, Agadir, Merzouga and beyond.",
      "On-site assistance and supplier coordination for smoother group delivery.",
    ],
    useCasesTitle: "Group tour use cases",
    useCases: [
      "Classic Morocco circuits for 15 to 45 passengers.",
      "Small premium groups with upgraded accommodation and private experiences.",
      "Corporate groups combining meetings, incentives and leisure extensions.",
      "Special-interest groups focused on culture, food, photography, wellness or desert travel.",
    ],
    localDmcTitle: "Why work with a Moroccan group travel partner",
    localDmcText: "A local partner helps adapt the program to the group profile, anticipate bottlenecks and coordinate suppliers in real time while the group is travelling.",
    faq: [
      { question: "What group sizes can you support in Morocco?", answer: "We support small private groups, leisure groups, corporate groups and larger series depending on route, hotels and season." },
      { question: "Can group tours be customized by market?", answer: "Yes. We adapt pacing, hotel category, guide language, meals and experiences according to the client market and agency brief." },
      { question: "Do group programs include guides and transport?", answer: "Yes. Group programs can include licensed guides, private transport, airport transfers, visits, hotels, meals and local experiences." },
    ],
  },
  miceMorocco: {
    path: "/mice-morocco",
    targetKeyword: "MICE Morocco",
    seoTitle: "MICE Morocco | Incentive Travel & Corporate Groups DMC",
    metaDescription: "MICE Morocco DMC for incentive travel, corporate groups, meetings, gala dinners, team building and delegate logistics.",
    h1: "MICE Morocco DMC for Incentives and Corporate Groups",
    eyebrow: "Corporate events and incentive travel in Morocco",
    intro: "Morocco Incoming by Suenos Travel supports MICE planners, companies and agencies with incentive travel, corporate groups, meetings, gala dinners, team building and local logistics across Morocco.",
    whyTitle: "Why Morocco works for MICE",
    whyText: "Morocco offers strong MICE variety in short distances: Marrakech venues, Agafay desert dinners, Atlas activities, Atlantic resorts, Sahara extensions and business gateways like Casablanca. The key is matching the experience to the group profile and operating it reliably.",
    providesTitle: "MICE services we provide",
    provides: [
      "Incentive programs, team-building activities, gala dinners and pre/post extensions.",
      "Venue sourcing, hotels, transport logistics, guides, airport transfers and delegate movement.",
      "Corporate-friendly programs in Marrakech, Agadir, Casablanca, Rabat, Fes and the desert regions.",
      "Local supplier coordination and on-site assistance for event and group operations.",
    ],
    useCasesTitle: "MICE and incentive use cases",
    useCases: [
      "Marrakech and Agafay incentive program with dinner, activities and transfers.",
      "Agadir beach resort retreat with excursions and team-building moments.",
      "Casablanca business group with airport logistics and cultural extension.",
      "Sahara or Atlas incentive extension for high-impact reward travel.",
    ],
    localDmcTitle: "Why use a local DMC for MICE Morocco",
    localDmcText: "MICE programs need reliable local timing, supplier control and quick problem solving. A Morocco-based DMC supports agencies and planners with practical routing, trusted local partners and on-site follow-up.",
    trustItems: [
      "Licensed Moroccan Travel Agency & DMC",
      "Licence ODV-0564",
      "IATA 54273844",
      "Agadir & Casablanca",
      "B2B incoming and MICE support",
      "Supplier coordination",
      "24-48h quote response",
      "On-site assistance",
    ],
    contentSections: [
      {
        title: "MICE Morocco destination examples",
        intro: "Morocco offers different MICE moods by destination. We help agencies and planners match the location to the group objective, budget and timing.",
        items: [
          { title: "Marrakech incentives", description: "Riads, venues, city experiences, Atlas activities, gala dinners and premium incentive moments.", path: "/destinations/marrakech" },
          { title: "Agafay desert dinners", description: "Sunset setups, desert-style dinners, entertainment and short transfers from Marrakech." },
          { title: "Agadir corporate retreats", description: "Beach resorts, golf, relaxed excursions and retreat-friendly pacing on the Atlantic coast.", path: "/destinations/agadir" },
          { title: "Casablanca business groups", description: "Airport logistics, business travel, meeting support and Rabat cultural extensions.", path: "/destinations/casablanca" },
          { title: "Fes cultural extensions", description: "Medina heritage, artisan visits and imperial city content for pre/post event programs.", path: "/destinations/fes" },
          { title: "Sahara or Atlas incentive extensions", description: "High-impact reward travel with desert camps, mountain scenery and adapted routing.", path: "/destinations/merzouga" },
        ],
      },
      {
        title: "MICE logistics handled by a local Morocco DMC",
        intro: "Behind every smooth MICE program is a careful operations plan. Our local team coordinates the moving parts that agencies and planners need on the ground.",
        items: [
          { title: "Airport transfers", description: "Arrival and departure planning, VIP transfers, shuttles and group movement timing." },
          { title: "Hotels and venues", description: "Hotel sourcing, venue suggestions, rooming coordination and event space matching." },
          { title: "Delegate movement", description: "Coach planning, timing sheets, guide support and movement between venues, hotels and activities." },
          { title: "Gala dinners", description: "Dinner venues, cultural touches, entertainment coordination and supplier follow-up." },
          { title: "Team building", description: "Activities adapted to the group profile, timing, weather, mobility and program objective." },
          { title: "Local assistance", description: "On-site coordination during the operation so the planner has local support when it matters." },
          { title: "Supplier coordination", description: "Communication with transport, venues, guides, restaurants, hotels and activity providers." },
        ],
      },
    ],
    faq: [
      { question: "Can you support incentive travel in Morocco?", answer: "Yes. We design and operate incentive programs with hotels, transport, experiences, dinners, team-building activities and local assistance." },
      { question: "Which Moroccan destinations work well for MICE Morocco programs?", answer: "Marrakech, Agadir, Casablanca, Rabat, Fes, the Atlas Mountains, Agafay and selected Sahara extensions can work well depending on group needs." },
      { question: "What MICE logistics can a Morocco DMC handle?", answer: "A Morocco DMC can coordinate airport transfers, hotels, venues, delegate movement, gala dinners, team building, local assistance and supplier coordination." },
      { question: "Do you work with foreign MICE agencies?", answer: "Yes. We support foreign MICE agencies, corporate planners and travel companies with local Morocco DMC services." },
    ],
  },
};

function LandingPage({ pageKey }: { pageKey: LandingPageKey }) {
  const page = landingPages[pageKey];
  const absoluteUrl = `${BASE_URL}${page.path}`;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl}#faq`,
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.h1,
        item: absoluteUrl,
      },
    ],
  };

  return (
    <>
      <SEO
        title={page.seoTitle}
        description={page.metaDescription}
        canonical={page.path}
        image="/images/hero-desert.jpg"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <section className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold tracking-wide uppercase text-[#E8A0A0]">{page.eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl font-bold leading-tight">{page.h1}</h1>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl leading-relaxed">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/quote">
                <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                  Request B2B Net Rates
                </Button>
              </Link>
              <Link to="/quote">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-6">
                  Request a Morocco Program
                </Button>
              </Link>
              <Link to="/b2b">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-6">
                  Become a B2B Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F9F7F4] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {page.trustItems && (
                <div className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                  <p className="text-sm font-semibold text-[#A91D2D]">Morocco Incoming by Suenos Travel</p>
                  <h2 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">
                    Licensed local partner for B2B Morocco programs
                  </h2>
                  <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {page.trustItems.map((item) => (
                      <div key={item} className="flex items-start gap-2 rounded-xl bg-[#F9F7F4] px-4 py-3 text-sm text-[#374151]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A91D2D]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                <p className="text-sm font-semibold text-[#A91D2D]">{page.targetKeyword}</p>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">{page.whyTitle}</h2>
                <p className="mt-4 text-[#4B5563] leading-relaxed">{page.whyText}</p>
              </div>

              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">{page.providesTitle}</h2>
                <div className="mt-6 grid sm:grid-cols-2 gap-5">
                  {page.provides.map((item) => (
                    <div key={item} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-[#A91D2D]" />
                      <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">{page.useCasesTitle}</h2>
                <div className="mt-6 grid sm:grid-cols-2 gap-5">
                  {page.useCases.map((item) => (
                    <div key={item} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <p className="text-sm text-[#4B5563] leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {page.contentSections?.map((section) => (
                <div key={section.title} className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">{section.title}</h2>
                  {section.intro && <p className="mt-4 text-[#4B5563] leading-relaxed">{section.intro}</p>}
                  {section.text && <p className="mt-4 text-[#4B5563] leading-relaxed">{section.text}</p>}
                  {section.items && (
                    <div className="mt-6 grid sm:grid-cols-2 gap-5">
                      {section.items.map((item) => (
                        item.path ? (
                          <Link key={item.title} to={item.path} className="block rounded-2xl border border-gray-100 bg-[#F9F7F4] p-5 transition-all hover:border-[#A91D2D]/40 hover:shadow-sm">
                            <h3 className="font-semibold text-[#1F2937]">{item.title}</h3>
                            <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{item.description}</p>
                          </Link>
                        ) : (
                          <div key={item.title} className="rounded-2xl border border-gray-100 bg-[#F9F7F4] p-5">
                            <h3 className="font-semibold text-[#1F2937]">{item.title}</h3>
                            <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{item.description}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {page.processSteps && (
                <div className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">How the B2B incoming process works</h2>
                  <div className="mt-6 grid sm:grid-cols-3 gap-4">
                    {page.processSteps.map((step, index) => (
                      <div key={step} className="rounded-2xl border border-gray-100 bg-[#F9F7F4] p-5">
                        <p className="text-xs font-semibold text-[#A91D2D]">Step {index + 1}</p>
                        <h3 className="mt-2 font-semibold text-[#1F2937]">{step}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">{page.localDmcTitle}</h2>
                <p className="mt-4 text-[#4B5563] leading-relaxed">{page.localDmcText}</p>
                <p className="mt-4 text-sm text-[#6B7280] leading-relaxed">
                  Explore our <Link to="/services" className="text-[#A91D2D] font-medium hover:underline">Morocco DMC services</Link>, browse <Link to="/circuits" className="text-[#A91D2D] font-medium hover:underline">Morocco circuits for agencies</Link>, review <Link to="/destinations" className="text-[#A91D2D] font-medium hover:underline">key Morocco destinations</Link>, see our <Link to="/mice" className="text-[#A91D2D] font-medium hover:underline">MICE services</Link> or request <Link to="/quote" className="text-[#A91D2D] font-medium hover:underline">B2B net rates</Link>.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm" id="faq">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">FAQ</h2>
                <div className="mt-6 space-y-5">
                  {page.faq.map((item) => (
                    <div key={item.question}>
                      <h3 className="font-semibold text-[#1F2937]">{item.question}</h3>
                      <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
                <h2 className="font-serif text-xl font-bold text-[#1F2937]">Plan with a local Morocco DMC</h2>
                <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
                  Send your dates, group size, hotel level, target budget and client profile. Our local team will prepare a B2B proposal without adding public prices.
                </p>
                <div className="mt-5 space-y-3">
                  <Link to="/quote" className="block">
                    <Button className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
                      Request B2B Net Rates
                    </Button>
                  </Link>
                  <Link to="/quote" className="block">
                    <Button variant="outline" className="w-full rounded-full">
                      Request a Morocco Program
                    </Button>
                  </Link>
                  <Link to="/b2b" className="block">
                    <Button variant="outline" className="w-full rounded-full">
                      Become a B2B Partner
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-semibold text-[#1F2937]">Useful links</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    { label: "Morocco DMC services", path: "/services" },
                    { label: "Morocco tours for agencies", path: "/circuits" },
                    { label: "Morocco destinations", path: "/destinations" },
                    { label: "MICE Morocco support", path: "/mice" },
                    { label: "B2B partnership", path: "/b2b" },
                  ].map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} className="inline-flex items-center gap-1 text-[#A91D2D] font-medium hover:underline">
                        {item.label} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className="mt-12 bg-[#1F2937] text-white rounded-2xl p-8 md:p-10 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold">Ready to prepare a Morocco B2B proposal?</h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Share your brief and our local Morocco team will help you shape a tailor-made program for your agency, group or corporate client.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/quote">
                <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                  Request B2B Net Rates
                </Button>
              </Link>
              <Link to="/b2b">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-6">
                  Become a B2B Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function DmcMoroccoLanding() {
  return <LandingPage pageKey="dmcMorocco" />;
}

export function IncomingAgencyMoroccoLanding() {
  return <LandingPage pageKey="incomingAgencyMorocco" />;
}

export function MoroccoToursForTravelAgenciesLanding() {
  return <LandingPage pageKey="moroccoToursForTravelAgencies" />;
}

export function MoroccoGroupToursLanding() {
  return <LandingPage pageKey="moroccoGroupTours" />;
}

export function MiceMoroccoLanding() {
  return <LandingPage pageKey="miceMorocco" />;
}
