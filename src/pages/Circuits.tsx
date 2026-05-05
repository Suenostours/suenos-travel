import { useState } from "react";
import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import { Helmet } from "react-helmet-async";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const allCircuits = [
  {
    slug: "imperial-cities-morocco",
    title: "Imperial Cities of Morocco",
    titleFr: "Villes Impériales du Maroc",
    duration: "7-9 days",
    type: "cultural",
    image: "/images/circuit-imperial.jpg",
    desc: "A deep journey through Morocco's four imperial capitals — from Casablanca's modern elegance to Fes's ancient medina.",
    descFr: "Un voyage approfondi à travers les quatre capitales impériales du Maroc — de l'élégance moderne de Casablanca à la médina ancienne de Fès.",
    cities: "Casablanca, Rabat, Meknes, Volubilis, Fes",
  },
  {
    slug: "sahara-desert-experience",
    title: "Sahara Desert Experience",
    titleFr: "Expérience Désert du Sahara",
    duration: "4-6 days",
    type: "adventure",
    image: "/images/circuit-sahara.jpg",
    desc: "Cross the High Atlas, visit Ait Ben Haddou, and sleep under a million stars in a luxury desert camp.",
    descFr: "Traversez le Haut Atlas, visitez Ait Ben Haddou et dormez sous un million d'étoiles dans un camp de luxe.",
    cities: "Marrakech, High Atlas, Ait Ben Haddou, Ouarzazate, Merzouga",
  },
  {
    slug: "marrakech-atlas-mountains",
    title: "Marrakech & Atlas Mountains",
    titleFr: "Marrakech & Montagnes de l'Atlas",
    duration: "4-5 days",
    type: "short_break",
    image: "/images/circuit-atlas.jpg",
    desc: "Explore the red city and escape to the Atlas Mountains for Berber villages and breathtaking panoramas.",
    descFr: "Explorez la ville rouge et échappez-vous dans les montagnes de l'Atlas pour les villages berbères.",
    cities: "Marrakech, Ourika Valley, Imlil, Agafay Desert",
  },
  {
    slug: "morocco-luxury-escape",
    title: "Morocco Luxury Escape",
    titleFr: "Escapade Luxe au Maroc",
    duration: "6-10 days",
    type: "luxury",
    image: "/images/circuit-luxury.jpg",
    desc: "A refined journey blending luxury riads, spa retreats, private dining, and helicopter transfers.",
    descFr: "Un voyage raffiné mêlant riads de luxe, retraites spa, dîners privés et transferts en hélicoptère.",
    cities: "Marrakech, Atlas Mountains, Agafay, Essaouira",
  },
  {
    slug: "morocco-honeymoon-tour",
    title: "Morocco Honeymoon Tour",
    titleFr: "Circuit Lune de Miel au Maroc",
    duration: "7-10 days",
    type: "romantic",
    image: "/images/circuit-honeymoon.jpg",
    desc: "Romantic escapes with candlelit dinners, sunset camel rides, and private suites with stunning views.",
    descFr: "Escapades romantiques avec dîners aux chandelles, promenades à dos de chameau au coucher du soleil.",
    cities: "Marrakech, Atlas Mountains, Sahara Desert, Essaouira",
  },
  {
    slug: "grand-morocco-tour",
    title: "Grand Morocco Tour",
    titleFr: "Grand Circuit du Maroc",
    duration: "10-14 days",
    type: "private",
    image: "/images/circuit-grand.jpg",
    desc: "The ultimate comprehensive circuit covering coast, mountains, desert, and all imperial cities.",
    descFr: "Le circuit complet ultime couvrant la côte, les montagnes, le désert et toutes les villes impériales.",
    cities: "Casablanca, Rabat, Chefchaouen, Fes, Marrakech, Sahara",
  },
];

const typeFilters = [
  { key: "all", label: "All", labelFr: "Tous" },
  { key: "cultural", label: "Cultural", labelFr: "Culturel" },
  { key: "adventure", label: "Adventure", labelFr: "Aventure" },
  { key: "luxury", label: "Luxury", labelFr: "Luxe" },
  { key: "romantic", label: "Romantic", labelFr: "Romantique" },
  { key: "short_break", label: "Short Break", labelFr: "Court Séjour" },
  { key: "private", label: "Private", labelFr: "Privé" },
];

const typeLabels: Record<string, string> = {
  cultural: "Cultural & Historical",
  adventure: "Adventure & Nature",
  short_break: "City & Nature",
  luxury: "Luxury & Wellness",
  romantic: "Romantic & Luxury",
  private: "Comprehensive",
};

const typeColors: Record<string, string> = {
  cultural: "bg-amber-100 text-amber-800",
  adventure: "bg-emerald-100 text-emerald-800",
  short_break: "bg-sky-100 text-sky-800",
  luxury: "bg-purple-100 text-purple-800",
  romantic: "bg-rose-100 text-rose-800",
  private: "bg-teal-100 text-teal-800",
};

export default function Circuits() {
  const { locale } = useI18n();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? allCircuits : allCircuits.filter((c) => c.type === filter);

  return (
    <>
      <Helmet>
        <title>Morocco Circuits | Suenos Travel DMC</title>
        <meta name="description" content="Discover our curated Morocco circuits: Imperial Cities, Sahara Desert, Atlas Mountains, Luxury Tours, and more." />
      </Helmet>

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">Morocco Circuits</h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {locale === "fr"
                ? "Circuits soigneusement conçus pour les agences de voyage, tour-opérateurs et groupes corporate."
                : "Carefully crafted itineraries for travel agencies, tour operators, and corporate groups."}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {typeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-[#A91D2D] text-white"
                    : "bg-white text-[#4B5563] hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {locale === "fr" ? f.labelFr : f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((c) => (
              <div key={c.slug} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-56 overflow-hidden">
                  <img src={c.image} alt={locale === "fr" ? c.titleFr : c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeColors[c.type]}`}>
                      {typeLabels[c.type]}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-semibold text-lg text-[#1F2937]">{locale === "fr" ? c.titleFr : c.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.duration}</span>
                  </div>
                  <p className="text-sm text-[#4B5563] line-clamp-2">{locale === "fr" ? c.descFr : c.desc}</p>
                  <p className="text-xs text-[#6B7280]"><span className="font-medium">Cities:</span> {c.cities}</p>
                  <Link to={`/circuits/${c.slug}`}>
                    <Button variant="ghost" className="text-[#A91D2D] hover:text-[#8a1824] p-0 h-auto text-sm font-medium">
                      View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
