import { useParams, Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, MapPin, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const circuitDetails: Record<string, {
  title: string; titleFr: string; duration: string; type: string;
  image: string; overview: string; overviewFr: string;
  route: string[]; routeFr: string[];
  included: string[]; excluded: string[];
  cities: string;
}> = {
  "imperial-cities-morocco": {
    title: "Imperial Cities of Morocco",
    titleFr: "Villes Impériales du Maroc",
    duration: "7-9 days",
    type: "cultural",
    image: "/images/circuit-imperial.jpg",
    overview: "Travel through Morocco's four imperial capitals — Casablanca, Rabat, Meknes, and Fes. Visit the Roman ruins of Volubilis, explore ancient medinas, and discover the rich history of the kingdom.",
    overviewFr: "Voyagez à travers les quatre capitales impériales du Maroc — Casablanca, Rabat, Meknès et Fès. Visitez les ruines romaines de Volubilis, explorez les médinas anciennes et découvrez la riche histoire du royaume.",
    route: ["Day 1: Arrival Casablanca", "Day 2: Casablanca → Rabat", "Day 3: Rabat → Volubilis → Meknes", "Day 4: Meknes → Fes", "Day 5: Fes exploration", "Day 6: Fes → Casablanca", "Day 7: Departure"],
    routeFr: ["Jour 1: Arrivée Casablanca", "Jour 2: Casablanca → Rabat", "Jour 3: Rabat → Volubilis → Meknès", "Jour 4: Meknès → Fès", "Jour 5: Exploration de Fès", "Jour 6: Fès → Casablanca", "Jour 7: Départ"],
    included: ["Licensed English-speaking guide", "Private AC vehicle", "6 nights accommodation", "Daily breakfast", "Entrance fees to monuments"],
    excluded: ["International flights", "Travel insurance", "Lunch & dinner (except where specified)", "Personal expenses", "Tips & gratuities"],
    cities: "Casablanca, Rabat, Meknes, Volubilis, Fes",
  },
  "sahara-desert-experience": {
    title: "Sahara Desert Experience",
    titleFr: "Expérience Désert du Sahara",
    duration: "4-6 days",
    type: "adventure",
    image: "/images/circuit-sahara.jpg",
    overview: "An unforgettable journey from Marrakech through the High Atlas Mountains, across the Draa Valley, to the golden dunes of Merzouga. Sleep in a luxury desert camp and ride camels at sunset.",
    overviewFr: "Un voyage inoubliable de Marrakech à travers le Haut Atlas, la vallée du Draa, jusqu'aux dunes dorées de Merzouga. Dormez dans un camp de luxe et faites une promenade à dos de chameau au coucher du soleil.",
    route: ["Day 1: Marrakech → High Atlas → Ait Ben Haddou", "Day 2: Ouarzazate → Draa Valley", "Day 3: Merzouga Desert Camp", "Day 4: Camel trek & sunrise", "Day 5: Return via Dades Valley", "Day 6: Arrival Marrakech"],
    routeFr: ["Jour 1: Marrakech → Haut Atlas → Ait Ben Haddou", "Jour 2: Ouarzazate → Vallée du Draa", "Jour 3: Camp désert Merzouga", "Jour 4: Trek chameau & lever du soleil", "Jour 5: Retour via Vallée du Dades", "Jour 6: Arrivée Marrakech"],
    included: ["Private 4x4 vehicle", "Desert camp accommodation", "Camel trek experience", "Sunset & sunrise activities", "Breakfast & dinner"],
    excluded: ["Flights to/from Marrakech", "Lunches (except camp)", "Travel insurance", "Drinks & personal expenses"],
    cities: "Marrakech, High Atlas, Ait Ben Haddou, Ouarzazate, Merzouga",
  },
  "marrakech-atlas-mountains": {
    title: "Marrakech & Atlas Mountains",
    titleFr: "Marrakech & Montagnes de l'Atlas",
    duration: "4-5 days",
    type: "short_break",
    image: "/images/circuit-atlas.jpg",
    overview: "Discover the red city of Marrakech and escape to the Atlas Mountains. Visit Berber villages, hike in the Ourika Valley, and experience the Agafay Desert just outside the city.",
    overviewFr: "Découvrez la ville rouge de Marrakech et échappez-vous dans les montagnes de l'Atlas. Visitez des villages berbères, randonnez dans la vallée de l'Ourika et découvrez le désert d'Agafay.",
    route: ["Day 1: Arrival Marrakech", "Day 2: Marrakech city tour", "Day 3: Ourika Valley day trip", "Day 4: Imlil & Toubkal views", "Day 5: Agafay Desert evening → Departure"],
    routeFr: ["Jour 1: Arrivée Marrakech", "Jour 2: Visite de Marrakech", "Jour 3: Excursion Vallée de l'Ourika", "Jour 4: Imlil & vues du Toubkal", "Jour 5: Soirée désert Agafay → Départ"],
    included: ["Private vehicle & driver", "Local mountain guide", "Accommodation in riad/hotel", "Daily breakfast", "Marrakech guided tour"],
    excluded: ["International flights", "Meals not specified", "Travel insurance", "Personal expenses"],
    cities: "Marrakech, Ourika Valley, Imlil, Agafay Desert",
  },
  "morocco-luxury-escape": {
    title: "Morocco Luxury Escape",
    titleFr: "Escapade Luxe au Maroc",
    duration: "6-10 days",
    type: "luxury",
    image: "/images/circuit-luxury.jpg",
    overview: "A refined journey for discerning travelers. Stay in palace riads, enjoy private spa treatments, dine in exclusive venues, and travel in style with private transfers and helicopter options.",
    overviewFr: "Un voyage raffiné pour voyageurs exigeants. Séjournez dans des riads-palais, profitez de soins spa privés, dînez dans des lieux exclusifs et voyagez avec style.",
    route: ["Day 1: VIP Arrival Marrakech", "Day 2: Private medina tour & spa", "Day 3: Atlas Mountains luxury lodge", "Day 4: Agafay Desert luxury camp", "Day 5: Helicopter Essaouira", "Day 6-10: Extended relaxation & exploration"],
    routeFr: ["Jour 1: Arrivée VIP Marrakech", "Jour 2: Visite privée médina & spa", "Jour 3: Lodge luxe montagnes Atlas", "Jour 4: Camp luxe désert Agafay", "Jour 5: Hélicoptère Essaouira", "Jour 6-10: Détente & exploration"],
    included: ["5-star riads & luxury lodges", "Private guide & driver", "Spa treatments", "Fine dining experiences", "Helicopter transfer option"],
    excluded: ["International flights", "Premium wines & spirits", "Personal shopping", "Travel insurance"],
    cities: "Marrakech, Atlas Mountains, Agafay, Essaouira",
  },
  "morocco-honeymoon-tour": {
    title: "Morocco Honeymoon Tour",
    titleFr: "Circuit Lune de Miel au Maroc",
    duration: "7-10 days",
    type: "romantic",
    image: "/images/circuit-honeymoon.jpg",
    overview: "The perfect romantic escape. Candlelit dinners on rooftop terraces, private camel rides at sunset, luxury suites with panoramic views, and intimate moments in Morocco's most beautiful settings.",
    overviewFr: "L'escapade romantique parfaite. Dîners aux chandelles sur les terrasses, promenades privées à dos de chameau au coucher du soleil, suites luxueuses avec vues panoramiques.",
    route: ["Day 1: Romantic arrival Marrakech", "Day 2: Private medina & gardens", "Day 3: Atlas Mountains romantic lodge", "Day 4-5: Sahara luxury camp experience", "Day 6: Essaouira coastal retreat", "Day 7-10: Relaxation & departure"],
    routeFr: ["Jour 1: Arrivée romantique Marrakech", "Jour 2: Médina & jardins privés", "Jour 3: Lodge romantique montagnes Atlas", "Jour 4-5: Expérience camp luxe Sahara", "Jour 6: Retraite côtière Essaouira", "Jour 7-10: Détente & départ"],
    included: ["Romantic suite upgrades", "Private candlelit dinners", "Couples spa treatments", "Sunset camel ride", "Champagne welcome"],
    excluded: ["International flights", "Alcohol beyond welcome champagne", "Personal expenses", "Optional activities"],
    cities: "Marrakech, Atlas Mountains, Sahara Desert, Essaouira",
  },
  "grand-morocco-tour": {
    title: "Grand Morocco Tour",
    titleFr: "Grand Circuit du Maroc",
    duration: "10-14 days",
    type: "private",
    image: "/images/circuit-grand.jpg",
    overview: "The ultimate Morocco experience. From the blue streets of Chefchaouen to the golden dunes of Merzouga, this comprehensive tour covers every region, landscape, and cultural highlight of the kingdom.",
    overviewFr: "L'expérience Maroc ultime. Des rues bleues de Chefchaouen aux dunes dorées de Merzouga, ce circuit complet couvre chaque région et paysage du royaume.",
    route: ["Day 1: Casablanca arrival", "Day 2: Casablanca → Rabat", "Day 3: Rabat → Chefchaouen", "Day 4: Chefchaouen → Fes", "Day 5: Fes exploration", "Day 6: Fes → Merzouga", "Day 7: Sahara experience", "Day 8: Merzouga → Dades", "Day 9: Dades → Marrakech", "Day 10: Marrakech", "Day 11: Marrakech → Essaouira", "Day 12: Essaouira → Agadir", "Day 13: Agadir relaxation", "Day 14: Departure"],
    routeFr: ["Jour 1: Arrivée Casablanca", "Jour 2: Casablanca → Rabat", "Jour 3: Rabat → Chefchaouen", "Jour 4: Chefchaouen → Fès", "Jour 5: Exploration de Fès", "Jour 6: Fès → Merzouga", "Jour 7: Expérience Sahara", "Jour 8: Merzouga → Dades", "Jour 9: Dades → Marrakech", "Jour 10: Marrakech", "Jour 11: Marrakech → Essaouira", "Jour 12: Essaouira → Agadir", "Jour 13: Détente Agadir", "Jour 14: Départ"],
    included: ["Complete private transport", "All accommodations", "Licensed guides in each city", "Daily breakfast", "Sahara camp experience"],
    excluded: ["International flights", "Most lunches & dinners", "Travel insurance", "Personal expenses", "Optional activities"],
    cities: "Casablanca, Rabat, Chefchaouen, Fes, Merzouga, Marrakech, Essaouira, Agadir",
  },
};

export default function CircuitDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useI18n();

  const circuit = slug ? circuitDetails[slug] : null;
  if (!circuit) return <div className="py-24 text-center">Circuit not found</div>;

  const isFr = locale === "fr";

  return (
    <>
      <Helmet>
        <title>{circuit.title} | Suenos Travel</title>
        <meta name="description" content={circuit.overview} />
      </Helmet>

      <section className="bg-[#F9F7F4]">
        {/* Hero */}
        <div className="relative h-[400px] md:h-[500px]">
          <img src={circuit.image} alt={circuit.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Link to="/circuits" className="inline-flex items-center gap-1 text-white/80 text-sm mb-4 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> {isFr ? "Retour aux circuits" : "Back to circuits"}
              </Link>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">{isFr ? circuit.titleFr : circuit.title}</h1>
              <div className="flex items-center gap-4 mt-4 text-white/80 text-sm">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {circuit.duration}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {circuit.cities}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "Aperçu" : "Overview"}</h2>
                <p className="text-[#4B5563] leading-relaxed">{isFr ? circuit.overviewFr : circuit.overview}</p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "Programme" : "Itinerary"}</h2>
                <div className="space-y-3">
                  {(isFr ? circuit.routeFr : circuit.route).map((day, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-[#A91D2D]/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#A91D2D]">{i + 1}</span>
                      </div>
                      <p className="text-sm text-[#4B5563]">{day}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" /> {isFr ? "Inclus" : "Included"}
                  </h3>
                  <ul className="space-y-2">
                    {circuit.included.map((item) => (
                      <li key={item} className="text-sm text-[#4B5563] flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                    <X className="h-5 w-5 text-red-400" /> {isFr ? "Non inclus" : "Not Included"}
                  </h3>
                  <ul className="space-y-2">
                    {circuit.excluded.map((item) => (
                      <li key={item} className="text-sm text-[#4B5563] flex items-start gap-2">
                        <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-semibold text-[#1F2937] mb-4">{isFr ? "Réserver ce circuit" : "Book This Tour"}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-[#6B7280]">{isFr ? "Durée" : "Duration"}</span><span className="font-medium">{circuit.duration}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">{isFr ? "Type" : "Type"}</span><span className="font-medium capitalize">{circuit.type}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">{isFr ? "Villes" : "Cities"}</span><span className="font-medium text-right">{circuit.cities}</span></div>
                </div>
                <Link to="/quote" className="mt-6 block">
                  <Button className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
                    {isFr ? "Demander un devis" : "Request a Quote"}
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
