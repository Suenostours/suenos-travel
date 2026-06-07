import { useParams, Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE_URL = "https://www.morocco-incoming.com";

type Excursion = {
  title: string;
  type: string;
  duration: string;
  description: string;
  bestFor: string;
};

type RelatedCircuit = {
  title: string;
  type: string;
  description: string;
};

type Destination = {
  name: string;
  nameFr: string;
  image: string;
  about: string;
  aboutFr: string;
  why: string;
  whyFr: string;
  bestTime: string;
  bestTimeFr: string;
  excursions: Excursion[];
  relatedCircuits: RelatedCircuit[];
};

const defaultRelatedCircuits: RelatedCircuit[] = [
  {
    title: "Morocco Imperial Cities & Sahara",
    type: "Cultural group circuit",
    description: "A classic agency program combining heritage cities, scenic routes and desert experiences.",
  },
  {
    title: "Tailor-Made Morocco Private Tour",
    type: "Private B2B program",
    description: "Flexible routing for agencies needing private clients, premium hotels and adapted pacing.",
  },
  {
    title: "Morocco Incentive & MICE Extension",
    type: "Corporate add-on",
    description: "Short extensions for groups, incentives and corporate clients before or after meetings.",
  },
];

const destinationDetails: Record<string, Destination> = {
  marrakech: {
    name: "Marrakech",
    nameFr: "Marrakech",
    image: "/images/circuit-imperial.jpg",
    about: "Marrakech is Morocco's most famous city - a vibrant blend of ancient medina, palaces, gardens, riads, restaurants and incentive-ready experiences.",
    aboutFr: "Marrakech est la ville la plus célèbre du Maroc - un mélange vibrant de médina, palais, jardins, riads, restaurants et expériences adaptées aux incentives.",
    why: "For agencies and MICE planners, Marrakech works as a strong hub for cultural tours, luxury private travel, short breaks, Agafay desert events and Atlas Mountains excursions.",
    whyFr: "Pour les agences et planners MICE, Marrakech est une base idéale pour circuits culturels, voyages privés premium, courts séjours, événements à Agafay et excursions dans l'Atlas.",
    bestTime: "March to May and September to November offer the most comfortable weather for groups, incentives and guided city programs.",
    bestTimeFr: "De mars à mai et de septembre à novembre offrent les meilleures conditions pour groupes, incentives et visites guidées.",
    excursions: [
      { title: "Marrakech Guided City Tour", type: "Cultural visit", duration: "Half-day or full-day", description: "Medina, souks, Bahia Palace, Koutoubia area and curated artisan stops with licensed guides.", bestFor: "Culture groups, first-time clients, private tours" },
      { title: "Agafay Desert Dinner Experience", type: "MICE / incentive", duration: "Evening", description: "Desert-style dinner, sunset setup and entertainment outside Marrakech without a long Sahara drive.", bestFor: "Incentives, corporate groups, luxury clients" },
      { title: "Ourika Valley Day Trip", type: "Nature excursion", duration: "Full-day", description: "Atlas foothills, Berber villages and light walking adapted to the group's mobility level.", bestFor: "Leisure groups, families, soft adventure" },
      { title: "Atlas Mountains & Imlil Excursion", type: "Mountain experience", duration: "Full-day", description: "Scenic mountain routing with local lunch options and gentle trekking possibilities.", bestFor: "Active groups, FIT clients, incentive add-ons" },
      { title: "Essaouira Day Trip", type: "Coastal excursion", duration: "Full-day", description: "A relaxed Atlantic coast program with medina, port, ramparts and seafood lunch options.", bestFor: "Cultural groups, premium private clients" },
      { title: "Ait Ben Haddou & Ouarzazate Day Trip", type: "Heritage excursion", duration: "Long full-day", description: "High Atlas crossing to kasbah landscapes and film heritage for clients with limited time.", bestFor: "Culture-focused agencies, photography groups" },
      { title: "Moroccan Cooking Class", type: "Hands-on experience", duration: "Half-day", description: "Interactive culinary activity in a riad or local kitchen with market context when appropriate.", bestFor: "Private clients, incentives, small groups" },
      { title: "Hot Air Balloon Experience", type: "Premium activity", duration: "Morning", description: "Early morning ballooning near Marrakech with transfers and optional breakfast setup.", bestFor: "Luxury travelers, honeymooners, VIP groups" },
    ],
    relatedCircuits: [
      { title: "Marrakech, Agafay & Atlas Incentive", type: "MICE program", description: "A compact incentive route with city venues, desert dinner and Atlas activities." },
      { title: "Imperial Cities & Sahara from Marrakech", type: "Group circuit", description: "A strong B2B route linking Marrakech, Dades, Merzouga, Fes and Casablanca." },
      { title: "Marrakech & Essaouira Private Program", type: "Private tour", description: "A slower-paced option for premium clients combining city, coast and riad stays." },
    ],
  },
  fes: {
    name: "Fes",
    nameFr: "Fès",
    image: "/images/circuit-grand.jpg",
    about: "Fes is Morocco's spiritual and craft capital, known for its UNESCO medina, artisan heritage, religious schools and deep cultural value.",
    aboutFr: "Fès est la capitale spirituelle et artisanale du Maroc, connue pour sa médina UNESCO, son patrimoine artisanal et sa valeur culturelle profonde.",
    why: "Fes is excellent for agencies selling heritage, education, culture and slower immersive programs. It also works well as a northern or imperial cities anchor.",
    whyFr: "Fès est idéale pour les agences vendant patrimoine, culture et programmes immersifs. Elle fonctionne aussi comme ancrage nord ou villes impériales.",
    bestTime: "Spring and autumn are best for medina visits and day trips to Meknes, Volubilis and Chefchaouen.",
    bestTimeFr: "Le printemps et l'automne sont les meilleures périodes pour la médina et les excursions vers Meknès, Volubilis et Chefchaouen.",
    excursions: [
      { title: "Fes Guided Medina Tour", type: "Cultural visit", duration: "Half-day or full-day", description: "Structured medina discovery with licensed guides, artisan quarters and historic monuments.", bestFor: "Culture groups, students, private clients" },
      { title: "Volubilis & Meknes Day Trip", type: "Heritage excursion", duration: "Full-day", description: "Roman ruins, imperial Meknes and holy town context with practical routing from Fes.", bestFor: "Cultural circuits, education groups" },
      { title: "Chefchaouen Day Trip", type: "Scenic city excursion", duration: "Long full-day", description: "The blue city of the Rif Mountains for clients who want photography and lighter exploration.", bestFor: "Private clients, small groups" },
      { title: "Middle Atlas & Ifrane Excursion", type: "Nature excursion", duration: "Full-day", description: "Forest landscapes, Ifrane, Azrou and cedar areas for a softer nature day.", bestFor: "Families, leisure groups, repeat clients" },
      { title: "Sefrou & Bhalil Experience", type: "Local culture", duration: "Half-day or full-day", description: "Smaller towns, cave houses and local heritage for agencies seeking less standard programs.", bestFor: "Special-interest groups, private tours" },
    ],
    relatedCircuits: [
      { title: "Fes, Chefchaouen & Northern Morocco", type: "Cultural route", description: "A northern circuit for agencies combining medina heritage with Rif Mountain scenery." },
      { title: "Imperial Cities of Morocco", type: "Classic group tour", description: "Rabat, Meknes, Fes and Marrakech with guided heritage programming." },
      { title: "Fes to Sahara Extension", type: "Desert circuit", description: "A strong route from Fes through the Middle Atlas to Merzouga dunes." },
    ],
  },
  casablanca: {
    name: "Casablanca",
    nameFr: "Casablanca",
    image: "/images/about-riad.jpg",
    about: "Casablanca is Morocco's economic gateway, airport hub and business city, useful for arrivals, departures, corporate travel and short extensions.",
    aboutFr: "Casablanca est la porte économique du Maroc, un hub aérien et une ville d'affaires utile pour arrivées, départs, voyages corporate et extensions courtes.",
    why: "For B2B programs, Casablanca is ideal for airport logistics, business travel, mosque visits, Rabat extensions and first or last nights on wider Morocco circuits.",
    whyFr: "Pour les programmes B2B, Casablanca est idéale pour la logistique aéroport, business travel, visites de mosquée, extensions Rabat et premières ou dernières nuits.",
    bestTime: "Casablanca is operational year-round, with spring and autumn especially comfortable for city visits and business groups.",
    bestTimeFr: "Casablanca est opérationnelle toute l'année, avec le printemps et l'automne particulièrement confortables pour visites et groupes business.",
    excursions: [
      { title: "Casablanca City Tour", type: "City visit", duration: "Half-day", description: "Hassan II Mosque, Corniche, Habous quarter and business district context.", bestFor: "Transit groups, business travelers, first arrivals" },
      { title: "Rabat Day Trip", type: "Capital excursion", duration: "Full-day", description: "Royal city, Hassan Tower, Kasbah des Oudayas and Mohammed V Mausoleum.", bestFor: "Cultural groups, corporate pre/post programs" },
      { title: "Marrakech Day Trip from Casablanca", type: "Long full-day", duration: "Full-day", description: "Express Marrakech visit for business travelers with limited time in Morocco.", bestFor: "Corporate guests, cruise-style programs" },
      { title: "El Jadida & Azemmour Excursion", type: "Coastal heritage", duration: "Full-day", description: "Portuguese heritage, Atlantic views and relaxed coastal programming.", bestFor: "Repeat clients, culture groups" },
      { title: "Business Travel & Airport Transfers", type: "Logistics", duration: "Flexible", description: "VIP transfers, meet-and-greet and corporate movement coordination.", bestFor: "MICE planners, executives, delegations" },
    ],
    relatedCircuits: [
      { title: "Casablanca to Imperial Cities", type: "Classic arrival route", description: "A practical circuit starting from Casablanca airport and moving to Rabat, Fes and Marrakech." },
      { title: "Corporate Morocco Gateway Program", type: "Business travel", description: "Short business-focused programs with airport, hotel and meeting logistics." },
      { title: "Casablanca, Rabat & Marrakech Extension", type: "Pre/post tour", description: "A compact extension for MICE or business travelers." },
    ],
  },
  agadir: {
    name: "Agadir",
    nameFr: "Agadir",
    image: "/images/circuit-honeymoon.jpg",
    about: "Agadir is a modern Atlantic resort base with beach hotels, golf, mild climate and access to Souss Massa, Taroudant and Anti-Atlas landscapes.",
    aboutFr: "Agadir est une base balnéaire moderne avec hôtels plage, golf, climat doux et accès au Souss Massa, Taroudant et Anti-Atlas.",
    why: "Agadir works well for leisure groups, corporate retreats, family programs, golf stays and softer Morocco itineraries with coastal comfort.",
    whyFr: "Agadir fonctionne bien pour groupes loisirs, retraites corporate, familles, séjours golf et itinéraires Maroc plus doux avec confort côtier.",
    bestTime: "Agadir is strong year-round, especially for winter sun, groups needing mild weather and relaxed coastal stays.",
    bestTimeFr: "Agadir est forte toute l'année, surtout pour soleil d'hiver, groupes recherchant climat doux et séjours côtiers.",
    excursions: [
      { title: "Agadir City Tour", type: "City visit", duration: "Half-day", description: "Kasbah viewpoint, marina, souk and city highlights adapted for group timing.", bestFor: "Leisure groups, families, first arrivals" },
      { title: "Paradise Valley Excursion", type: "Nature excursion", duration: "Half-day or full-day", description: "Palm valleys, mountain scenery and light walking outside Agadir.", bestFor: "Families, soft adventure, small groups" },
      { title: "Taroudant Day Trip", type: "Heritage excursion", duration: "Full-day", description: "Walled town, souks and Anti-Atlas atmosphere with lunch options.", bestFor: "Cultural groups, repeat visitors" },
      { title: "Tafraoute & Anti-Atlas Excursion", type: "Mountain route", duration: "Full-day or overnight", description: "Granite landscapes, villages and scenic roads for specialist programs.", bestFor: "Photography, adventure, small groups" },
      { title: "Massa Desert & Tiznit Excursion", type: "Nature and culture", duration: "Full-day", description: "Coastal desert landscapes, birdlife areas and silver town heritage.", bestFor: "Families, leisure groups, nature clients" },
      { title: "Essaouira Day Trip from Agadir", type: "Coastal excursion", duration: "Full-day", description: "Atlantic routing to Essaouira with medina, port and ramparts.", bestFor: "Private clients, coastal programs" },
    ],
    relatedCircuits: [
      { title: "Agadir Beach & Souss Discovery", type: "Leisure group program", description: "A relaxed coastal itinerary with excursions to Taroudant and Paradise Valley." },
      { title: "Agadir Golf & Incentive Stay", type: "Corporate retreat", description: "Golf, beach hotels and light activities for company groups." },
      { title: "South Morocco Soft Adventure", type: "Nature circuit", description: "Agadir, Anti-Atlas, Tafraoute and coastal landscapes for active small groups." },
    ],
  },
  essaouira: {
    name: "Essaouira",
    nameFr: "Essaouira",
    image: "/images/circuit-luxury.jpg",
    about: "Essaouira is a relaxed Atlantic medina destination with coastal heritage, art, wind sports and a softer rhythm than Marrakech.",
    aboutFr: "Essaouira est une destination médina Atlantique décontractée avec patrimoine côtier, art, sports de vent et rythme plus doux que Marrakech.",
    why: "For agencies, Essaouira is a valuable coastal extension from Marrakech and works well for private clients, incentives, families and creative groups.",
    whyFr: "Pour les agences, Essaouira est une extension côtière précieuse depuis Marrakech, adaptée aux clients privés, incentives, familles et groupes créatifs.",
    bestTime: "Spring and autumn are comfortable; summer is breezy and useful for coastal programs.",
    bestTimeFr: "Le printemps et l'automne sont confortables ; l'été est venteux et utile pour les programmes côtiers.",
    excursions: [
      { title: "Essaouira Guided Tour", type: "Cultural visit", duration: "Half-day", description: "Medina, port, ramparts, artisan streets and coastal history with a local guide.", bestFor: "Cultural groups, private clients" },
      { title: "Argan Cooperative Visit", type: "Local experience", duration: "Short visit", description: "Women-led cooperative visit en route or near Essaouira with product context.", bestFor: "Groups, CSR themes, families" },
      { title: "Horse Riding / Camel Ride", type: "Soft adventure", duration: "1-2 hours", description: "Beach or dunes-style riding experiences adapted to ability level.", bestFor: "Families, incentives, private clients" },
      { title: "Kitesurfing Experience", type: "Sport activity", duration: "Half-day", description: "Introductory or advanced wind sport session with local instructors.", bestFor: "Active groups, incentive teams" },
      { title: "Sidi Kaouki Excursion", type: "Coastal escape", duration: "Half-day", description: "Quiet beach village south of Essaouira for relaxed coastal programming.", bestFor: "Private clients, small groups" },
    ],
    relatedCircuits: [
      { title: "Marrakech & Essaouira Coastal Extension", type: "Private tour", description: "A popular city-and-coast pairing for agencies." },
      { title: "Atlantic Morocco Group Program", type: "Group circuit", description: "Casablanca, El Jadida, Essaouira and Agadir for coastal heritage." },
      { title: "Creative Incentive in Essaouira", type: "MICE add-on", description: "Art, music, coastal dinners and soft activities for corporate groups." },
    ],
  },
  chefchaouen: {
    name: "Chefchaouen",
    nameFr: "Chefchaouen",
    image: "/images/circuit-grand.jpg",
    about: "Chefchaouen is the blue city of the Rif Mountains, valued for photography, gentle walking, mountain scenery and northern Morocco extensions.",
    aboutFr: "Chefchaouen est la ville bleue du Rif, appréciée pour la photographie, les balades douces, les paysages montagneux et les extensions nord Maroc.",
    why: "Chefchaouen works well for agencies building Fes, Tangier or northern Morocco programs, especially for small groups and private clients.",
    whyFr: "Chefchaouen convient aux agences créant des programmes Fès, Tanger ou nord Maroc, surtout pour petits groupes et clients privés.",
    bestTime: "April to October is best for walking and mountain scenery, while spring is especially attractive.",
    bestTimeFr: "D'avril à octobre est idéal pour les balades et paysages de montagne, avec un printemps particulièrement attractif.",
    excursions: [
      { title: "Chefchaouen Walking Tour", type: "Cultural visit", duration: "Half-day", description: "Blue medina lanes, viewpoints and local context with gentle pacing.", bestFor: "Private clients, photography groups" },
      { title: "Akchour Waterfalls", type: "Nature excursion", duration: "Half-day or full-day", description: "Mountain walk and waterfall area adapted to fitness level and season.", bestFor: "Active clients, soft adventure" },
      { title: "Tetouan Day Trip", type: "Northern heritage", duration: "Full-day", description: "UNESCO medina and Andalusian heritage near the Mediterranean.", bestFor: "Cultural groups, repeat travelers" },
      { title: "Tangier Extension", type: "City extension", duration: "Full-day or overnight", description: "Add Tangier's port city atmosphere, Cape Spartel and international heritage.", bestFor: "Northern circuits, cruise-style programs" },
      { title: "Rif Mountains Experience", type: "Mountain program", duration: "Half-day or full-day", description: "Scenic roads, viewpoints and village context around Chefchaouen.", bestFor: "Small groups, nature clients" },
    ],
    relatedCircuits: [
      { title: "Fes, Chefchaouen & Tangier", type: "Northern Morocco", description: "A strong route for agencies combining medinas, mountains and coast." },
      { title: "Blue City Photography Extension", type: "Special-interest travel", description: "Chefchaouen as an add-on for photography and culture-focused clients." },
      { title: "Northern Morocco Private Tour", type: "Private B2B program", description: "A flexible route linking Rabat, Fes, Chefchaouen and Tangier." },
    ],
  },
  merzouga: {
    name: "Merzouga",
    nameFr: "Merzouga",
    image: "/images/circuit-sahara.jpg",
    about: "Merzouga is the gateway to Erg Chebbi, Morocco's iconic Sahara dune landscape for desert camps, camel trekking and luxury desert experiences.",
    aboutFr: "Merzouga est la porte d'Erg Chebbi, paysage dunaire iconique du Sahara marocain pour camps, chameaux et expériences désert premium.",
    why: "For agencies, Merzouga is a powerful highlight, but it needs realistic routing, camp matching and clear expectation management.",
    whyFr: "Pour les agences, Merzouga est un temps fort puissant, mais demande routing réaliste, bon choix de camp et gestion claire des attentes.",
    bestTime: "October to April is best for desert comfort. Summer needs careful planning because of heat.",
    bestTimeFr: "D'octobre à avril est idéal pour le confort désert. L'été demande une planification prudente à cause de la chaleur.",
    excursions: [
      { title: "Camel Trekking", type: "Desert activity", duration: "Sunset or overnight", description: "Classic camel ride experience with timing adapted to group size and season.", bestFor: "Groups, families, private clients" },
      { title: "Luxury Desert Camp Experience", type: "Premium overnight", duration: "Overnight", description: "Camp stay with dinner, music, private tents and optional VIP setup.", bestFor: "Luxury clients, incentives, honeymooners" },
      { title: "4x4 Dunes Excursion", type: "Adventure", duration: "Half-day", description: "Dune and desert surroundings by 4x4 with controlled routing and local stops.", bestFor: "Active groups, incentives" },
      { title: "Nomad Family Visit", type: "Local encounter", duration: "Short visit", description: "Carefully arranged local visit with cultural respect and suitable group size.", bestFor: "Cultural travelers, small groups" },
      { title: "Khamlia Village", type: "Music and culture", duration: "Short visit", description: "Gnawa music village experience near Merzouga with local context.", bestFor: "Culture groups, private clients" },
      { title: "Sunset & Sunrise Desert Experience", type: "Scenic moment", duration: "Flexible", description: "Photographic and quiet desert moments planned around camp logistics.", bestFor: "Photography groups, premium clients" },
    ],
    relatedCircuits: [
      { title: "Fes to Merzouga Desert Circuit", type: "Desert route", description: "Middle Atlas, Ziz Valley and Erg Chebbi for agencies starting from Fes." },
      { title: "Marrakech to Sahara Program", type: "Classic B2B circuit", description: "Ait Ben Haddou, Dades, Merzouga and return or onward to Fes." },
      { title: "Luxury Sahara Extension", type: "Premium add-on", description: "A curated desert extension for private clients and VIP groups." },
    ],
  },
  ouarzazate: {
    name: "Ouarzazate",
    nameFr: "Ouarzazate",
    image: "/images/circuit-sahara.jpg",
    about: "Ouarzazate is the gateway between Marrakech, kasbah country and the Sahara, known for film studios, Ait Ben Haddou and desert-route logistics.",
    aboutFr: "Ouarzazate est la porte entre Marrakech, pays des kasbahs et Sahara, connue pour studios de cinéma, Ait Ben Haddou et logistique des routes désert.",
    why: "For agencies, Ouarzazate is a practical overnight, heritage stop and filming-themed destination within Morocco desert circuits.",
    whyFr: "Pour les agences, Ouarzazate est une étape pratique, patrimoniale et cinématographique dans les circuits désert Maroc.",
    bestTime: "Spring and autumn are ideal for kasbah visits, valleys and desert-route programs.",
    bestTimeFr: "Le printemps et l'automne sont idéaux pour kasbahs, vallées et programmes route désert.",
    excursions: [
      { title: "Ait Ben Haddou Visit", type: "UNESCO heritage", duration: "Half-day", description: "Guided visit of the famous ksar with route planning from Marrakech or Ouarzazate.", bestFor: "Culture groups, photographers, private clients" },
      { title: "Film Studios Tour", type: "Film heritage", duration: "Short visit", description: "Studio visit for cinema context and light entertainment programming.", bestFor: "Groups, families, special interest" },
      { title: "Skoura Palm Grove", type: "Kasbah excursion", duration: "Half-day", description: "Palm grove and kasbah landscapes with garden and architecture context.", bestFor: "Culture clients, soft touring" },
      { title: "Dades Valley", type: "Scenic route", duration: "Full-day or overnight", description: "Valley landscapes and kasbah roads en route to desert programs.", bestFor: "Desert circuits, photography groups" },
      { title: "Todra Gorges", type: "Nature route", duration: "Full-day or overnight", description: "Dramatic gorge scenery for active or scenic itineraries.", bestFor: "Adventure groups, private tours" },
      { title: "Draa Valley Extension", type: "Desert gateway", duration: "Full-day or overnight", description: "Palm groves and kasbah landscapes toward Zagora and the southern routes.", bestFor: "Cultural circuits, repeat travelers" },
    ],
    relatedCircuits: [
      { title: "Marrakech, Ouarzazate & Merzouga", type: "Desert circuit", description: "A core Sahara route for agencies with kasbah and valley highlights." },
      { title: "Kasbahs & Valleys of South Morocco", type: "Cultural route", description: "Ait Ben Haddou, Skoura, Dades and Todra for heritage-focused groups." },
      { title: "Film Heritage Morocco Program", type: "Special-interest travel", description: "Ouarzazate and surrounding film landscapes for themed groups." },
    ],
  },
  rabat: {
    name: "Rabat",
    nameFr: "Rabat",
    image: "/images/about-riad.jpg",
    about: "Rabat is Morocco's capital, offering royal heritage, coastal views, elegant boulevards and a calmer rhythm than larger tourism hubs.",
    aboutFr: "Rabat est la capitale du Maroc, avec patrimoine royal, vues côtières, boulevards élégants et rythme plus calme que les grands hubs touristiques.",
    why: "Rabat is useful for agencies building imperial city circuits, diplomatic visits, educational travel and pre/post Casablanca programs.",
    whyFr: "Rabat est utile pour agences créant circuits villes impériales, visites diplomatiques, voyages éducatifs et pré/post Casablanca.",
    bestTime: "Rabat is comfortable most of the year, with spring and autumn particularly pleasant for cultural visits.",
    bestTimeFr: "Rabat est agréable presque toute l'année, avec printemps et automne particulièrement adaptés aux visites culturelles.",
    excursions: [
      { title: "Rabat City Tour", type: "Capital visit", duration: "Half-day", description: "Hassan Tower, Mohammed V Mausoleum, Kasbah des Oudayas and royal city context.", bestFor: "Cultural groups, diplomatic delegations" },
      { title: "Casablanca Day Trip", type: "Business and culture", duration: "Full-day", description: "Hassan II Mosque, Habous quarter and business city highlights.", bestFor: "Business groups, pre/post programs" },
      { title: "Meknes & Volubilis Extension", type: "Heritage excursion", duration: "Full-day", description: "Imperial Meknes and Roman Volubilis as a cultural extension from Rabat.", bestFor: "Education groups, culture-focused agencies" },
      { title: "Coastal Heritage Excursion", type: "Coastal visit", duration: "Half-day or full-day", description: "Coastal viewpoints, heritage sites and relaxed Atlantic programming.", bestFor: "Private clients, soft touring" },
    ],
    relatedCircuits: [
      { title: "Rabat & Imperial Cities", type: "Cultural circuit", description: "A classic program linking Rabat, Meknes, Fes and Marrakech." },
      { title: "Casablanca & Rabat Business Extension", type: "Corporate add-on", description: "Short extension for business and MICE travelers." },
      { title: "Northern Morocco Heritage Route", type: "Group program", description: "Rabat, Fes, Chefchaouen and Tangier for cultural agencies." },
    ],
  },
  tangier: {
    name: "Tangier",
    nameFr: "Tanger",
    image: "/images/circuit-grand.jpg",
    about: "Tangier is Morocco's northern gateway, combining port-city atmosphere, Mediterranean access, international heritage and links to Chefchaouen and Tetouan.",
    aboutFr: "Tanger est la porte nord du Maroc, combinant atmosphère portuaire, Méditerranée, patrimoine international et liens vers Chefchaouen et Tétouan.",
    why: "Tangier is valuable for agencies working with Spain, cruise-style programs, northern Morocco circuits and short cultural extensions.",
    whyFr: "Tanger est précieuse pour agences travaillant avec l'Espagne, programmes type croisière, circuits nord Maroc et extensions culturelles courtes.",
    bestTime: "Spring, summer and autumn are strong for northern Morocco, with good conditions for coastal and city programs.",
    bestTimeFr: "Printemps, été et automne sont forts pour le nord Maroc, avec de bonnes conditions pour programmes côtiers et urbains.",
    excursions: [
      { title: "Tangier City Tour", type: "City visit", duration: "Half-day", description: "Kasbah, medina, Grand Socco and international city heritage with local guide.", bestFor: "Cruise guests, private clients, groups" },
      { title: "Cape Spartel & Hercules Caves", type: "Scenic excursion", duration: "Half-day", description: "Atlantic-Mediterranean viewpoints and classic northern Morocco landmarks.", bestFor: "Families, groups, short-stay clients" },
      { title: "Chefchaouen Day Trip", type: "Blue city excursion", duration: "Full-day", description: "Day trip to the Rif Mountains and Chefchaouen's photogenic medina.", bestFor: "Private clients, photography groups" },
      { title: "Tetouan Excursion", type: "Cultural visit", duration: "Full-day", description: "Andalusian-influenced UNESCO medina and northern heritage.", bestFor: "Culture groups, repeat travelers" },
      { title: "Asilah Day Trip", type: "Coastal art town", duration: "Half-day or full-day", description: "Whitewashed coastal town with art, walls and relaxed Atlantic rhythm.", bestFor: "Private clients, creative groups" },
    ],
    relatedCircuits: [
      { title: "Tangier, Chefchaouen & Fes", type: "Northern route", description: "A strong route for Spain-connected agencies and cultural groups." },
      { title: "Northern Morocco Private Tour", type: "Private program", description: "Tangier, Tetouan, Chefchaouen and Fes with flexible pacing." },
      { title: "Tangier Pre/Post Spain Extension", type: "Cross-border add-on", description: "Short Morocco extension for agencies combining Spain and Morocco." },
    ],
  },
};

function getQuotePath(slug?: string) {
  return `/quote${slug ? `?destination=${encodeURIComponent(slug)}` : ""}`;
}

export default function DestinationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useI18n();
  const isFr = locale === "fr";

  const dest = slug ? destinationDetails[slug] : null;
  if (!dest) return <div className="py-24 text-center">Destination not found</div>;

  const title = isFr ? dest.nameFr : dest.name;
  const description = isFr ? dest.aboutFr : dest.about;
  const quotePath = getQuotePath(slug);
  const relatedCircuits = dest.relatedCircuits.length > 0 ? dest.relatedCircuits : defaultRelatedCircuits;
  const faqItems = [
    {
      question: isFr ? `Ces excursions à ${title} sont-elles adaptées aux groupes ?` : `Are these ${title} excursions suitable for groups?`,
      answer: isFr
        ? "Oui. Les horaires, guides, véhicules, repas et niveaux d'activité peuvent être adaptés selon la taille du groupe et le profil client."
        : "Yes. Timings, guides, vehicles, meals and activity levels can be adapted according to group size and client profile.",
    },
    {
      question: isFr ? "Peut-on intégrer ces expériences dans un programme MICE ?" : "Can these experiences be integrated into a MICE program?",
      answer: isFr
        ? "Oui. Certaines expériences peuvent devenir activités incentives, extensions pré/post événement ou moments premium selon le timing et le budget."
        : "Yes. Selected experiences can become incentive activities, pre/post-event extensions or premium moments depending on timing and budget.",
    },
    {
      question: isFr ? "Comment demander les tarifs nets B2B ?" : "How can agencies request B2B net rates?",
      answer: isFr
        ? "Envoyez vos dates, taille de groupe, marché, budget cible et niveau d'hôtels via notre formulaire de devis."
        : "Send your dates, group size, market, target budget and hotel level through our quote request form.",
    },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/destinations/${slug}#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <SEO
        title={`${title} Morocco B2B Excursions & Programs | Suenos Travel DMC`}
        description={`Plan ${title} excursions, day trips and Morocco programs for travel agencies, groups and MICE planners with Suenos Travel DMC.`}
        canonical={`/destinations/${slug}`}
        image={dest.image}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <section className="bg-[#F9F7F4]">
        <div className="relative h-[350px] md:h-[450px]">
          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Link to="/destinations" className="inline-flex items-center gap-1 text-white/80 text-sm mb-4 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> {isFr ? "Retour aux destinations" : "Back to destinations"}
              </Link>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">{title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "À propos" : "About"}</h2>
                <p className="text-[#4B5563] leading-relaxed">{description}</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "Pourquoi visiter" : "Why Visit"}</h2>
                <p className="text-[#4B5563] leading-relaxed">{isFr ? dest.whyFr : dest.why}</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "Meilleure période" : "Best Time to Visit"}</h2>
                <p className="text-[#4B5563] leading-relaxed">{isFr ? dest.bestTimeFr : dest.bestTime}</p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-3">
                  {isFr ? "Excursions et expériences possibles" : "Possible Excursions & Experiences"}
                </h2>
                <p className="text-[#4B5563] leading-relaxed mb-6">
                  {isFr
                    ? "Toutes ces expériences peuvent être adaptées pour agences de voyage, groupes privés, séries, incentives, MICE et clients premium. Les durées et contenus sont ajustés selon le profil client, la saison et le budget cible."
                    : "All these experiences can be adapted for travel agencies, private groups, series departures, incentives, MICE and premium clients. Duration and content are adjusted to the client profile, season and target budget."}
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {dest.excursions.map((excursion) => (
                    <div key={excursion.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#A91D2D]/10 flex items-center justify-center shrink-0">
                          <Sparkles className="h-5 w-5 text-[#A91D2D]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1F2937]">{excursion.title}</h3>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#6B7280]">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F9F7F4] px-2 py-1">
                              <Clock className="h-3 w-3" /> {excursion.duration}
                            </span>
                            <span className="rounded-full bg-[#F9F7F4] px-2 py-1">{excursion.type}</span>
                          </div>
                          <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">{excursion.description}</p>
                          <p className="mt-3 text-xs text-[#6B7280]">
                            <span className="font-semibold text-[#1F2937]">{isFr ? "Idéal pour : " : "Best for: "}</span>
                            {excursion.bestFor}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-3">
                  {isFr ? "Circuits Maroc liés" : "Related Morocco Circuits"}
                </h2>
                <p className="text-[#4B5563] leading-relaxed mb-6">
                  {isFr
                    ? `Ces idées peuvent intégrer ${title} dans un programme complet avec transport, guides, hébergements, expériences locales et support sur place.`
                    : `These ideas can include ${title} inside a complete Morocco program with transport, guides, accommodation, local experiences and on-site support.`}
                </p>
                <div className="grid sm:grid-cols-3 gap-5">
                  {relatedCircuits.map((circuit) => (
                    <Link key={circuit.title} to="/circuits" className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-[#A91D2D]/40 hover:shadow-md transition-all">
                      <p className="text-xs font-medium text-[#A91D2D] mb-2">{circuit.type}</p>
                      <h3 className="font-semibold text-[#1F2937]">{circuit.title}</h3>
                      <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{circuit.description}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-3">
                  {isFr ? "FAQ B2B" : "B2B FAQ"}
                </h2>
                <div className="space-y-5">
                  {faqItems.map((item, index) => (
                    <div key={item.question}>
                      <h3 className="font-semibold text-[#1F2937]">{item.question}</h3>
                      <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">
                        {index === 2 ? (
                          isFr ? (
                            <>
                              Envoyez vos dates, taille de groupe, marché, budget cible et niveau d'hôtels via notre <Link to={quotePath} className="text-[#A91D2D] font-medium hover:underline">formulaire de devis</Link>.
                            </>
                          ) : (
                            <>
                              Send your dates, group size, market, target budget and hotel level through our <Link to={quotePath} className="text-[#A91D2D] font-medium hover:underline">quote request form</Link>.
                            </>
                          )
                        ) : (
                          item.answer
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-semibold text-[#1F2937] mb-4">{isFr ? "Planifier un programme" : "Plan a Program"}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-5">
                  {isFr
                    ? `Créez un programme ${title} pour agences, groupes, MICE ou clients privés avec conditions B2B.`
                    : `Create a ${title} program for agencies, groups, MICE or private clients with B2B conditions.`}
                </p>
                <Link to={quotePath} className="block">
                  <Button className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
                    {isFr ? "Demander les tarifs nets B2B" : "Request B2B Net Rates"}
                  </Button>
                </Link>
                <Link to="/quote" className="mt-3 block">
                  <Button variant="outline" className="w-full rounded-full">
                    {isFr ? "Programme sur mesure" : "Request a Tailor-Made Program"}
                  </Button>
                </Link>
                <Link to="/circuits" className="mt-3 block">
                  <Button variant="outline" className="w-full rounded-full">
                    {isFr ? "Voir les circuits Maroc" : "View Morocco Circuits"}
                  </Button>
                </Link>
                <Link to="/mice" className="mt-3 block">
                  <Button variant="outline" className="w-full rounded-full">
                    {isFr ? "Support MICE" : "MICE Support"}
                  </Button>
                </Link>
                <Link to="/b2b" className="mt-3 block">
                  <Button variant="outline" className="w-full rounded-full">
                    {isFr ? "Partenariat B2B" : "B2B Partnership"}
                  </Button>
                </Link>
                <a href="https://wa.me/212661925611" target="_blank" rel="noopener noreferrer" className="mt-3 block">
                  <Button variant="outline" className="w-full rounded-full">WhatsApp</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
