import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const destinations = [
  { slug: "marrakech", name: "Marrakech", nameFr: "Marrakech", image: "/images/circuit-imperial.jpg", desc: "The red city for culture, incentives, Agafay events, Atlas excursions and agency programs.", descFr: "La ville rouge pour culture, incentives, événements à Agafay, excursions Atlas et programmes agences." },
  { slug: "fes", name: "Fes", nameFr: "Fès", image: "/images/circuit-grand.jpg", desc: "Morocco's spiritual and cultural heart for medina tours, heritage routes and group programs.", descFr: "Le cœur spirituel et culturel du Maroc pour médina, patrimoine et programmes groupes." },
  { slug: "casablanca", name: "Casablanca", nameFr: "Casablanca", image: "/images/about-riad.jpg", desc: "Morocco's business and airport gateway for corporate travel, arrivals and short extensions.", descFr: "La porte business et aérienne du Maroc pour corporate, arrivées et extensions courtes." },
  { slug: "agadir", name: "Agadir", nameFr: "Agadir", image: "/images/circuit-honeymoon.jpg", desc: "Atlantic resort base for leisure groups, golf, retreats and Souss Massa excursions.", descFr: "Base balnéaire Atlantique pour groupes loisirs, golf, retraites et excursions Souss Massa." },
  { slug: "essaouira", name: "Essaouira", nameFr: "Essaouira", image: "/images/circuit-luxury.jpg", desc: "A coastal extension with medina heritage, art, Atlantic activities and relaxed pacing.", descFr: "Une extension côtière avec médina, art, activités Atlantique et rythme détendu." },
  { slug: "chefchaouen", name: "Chefchaouen", nameFr: "Chefchaouen", image: "/images/circuit-grand.jpg", desc: "The blue Rif Mountain city for photography, northern routes and private cultural programs.", descFr: "La ville bleue du Rif pour photographie, routes nord et programmes culturels privés." },
  { slug: "merzouga", name: "Merzouga", nameFr: "Merzouga", image: "/images/circuit-sahara.jpg", desc: "Gateway to Erg Chebbi for Sahara camps, camel trekking and premium desert experiences.", descFr: "Porte d'Erg Chebbi pour camps Sahara, dromadaires et expériences désert premium." },
  { slug: "ouarzazate", name: "Ouarzazate", nameFr: "Ouarzazate", image: "/images/circuit-sahara.jpg", desc: "Kasbah country and film heritage gateway between Marrakech, valleys and the Sahara.", descFr: "Pays des kasbahs et cinéma entre Marrakech, vallées et Sahara." },
  { slug: "rabat", name: "Rabat", nameFr: "Rabat", image: "/images/about-riad.jpg", desc: "Morocco's capital for royal heritage, diplomatic visits, coastal culture and imperial routes.", descFr: "Capitale du Maroc pour patrimoine royal, visites diplomatiques, côte et routes impériales." },
  { slug: "tangier", name: "Tangier", nameFr: "Tanger", image: "/images/circuit-grand.jpg", desc: "Northern Morocco gateway for Spain-linked programs, Chefchaouen, Tetouan and coastal extensions.", descFr: "Porte nord du Maroc pour programmes liés à l'Espagne, Chefchaouen, Tétouan et extensions côtières." },
];

export default function Destinations() {
  const { locale } = useI18n();
  const isFr = locale === "fr";

  return (
    <>
      <SEO
        title="Morocco Destinations for B2B Tours | Suenos Travel DMC"
        description="Plan Morocco programs for agencies and groups across Marrakech, Fes, Casablanca, Rabat, Tangier, Agadir, Essaouira, the Atlas Mountains and Sahara."
        canonical="/destinations"
        image="/images/circuit-imperial.jpg"
      />

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">Destinations</h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Découvrez les destinations clés du Maroc pour circuits, groupes, incentives et programmes B2B."
                : "Discover Morocco's key destinations for circuits, groups, incentives and B2B programs."}
            </p>
            <p className="mt-3 text-sm text-[#6B7280] max-w-3xl mx-auto">
              {isFr ? (
                <>
                  Pour la planification de groupes, combinez ces destinations avec nos <Link to="/circuits" className="text-[#A91D2D] font-medium hover:underline">circuits Maroc B2B</Link> et nos <Link to="/services" className="text-[#A91D2D] font-medium hover:underline">services incoming Maroc</Link>.
                </>
              ) : (
                <>
                  For group tour planning, combine these destinations with our <Link to="/morocco-tours-for-travel-agencies" className="text-[#A91D2D] font-medium hover:underline">Morocco tours for travel agencies</Link>, <Link to="/morocco-group-tours" className="text-[#A91D2D] font-medium hover:underline">Morocco group tours</Link> and <Link to="/incoming-agency-morocco" className="text-[#A91D2D] font-medium hover:underline">Morocco incoming agency services</Link>.
                </>
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d) => (
              <Link key={d.slug} to={`/destinations/${d.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-[#1F2937]">{isFr ? d.nameFr : d.name}</h3>
                    <p className="text-sm text-[#4B5563] mt-2 line-clamp-2">{isFr ? d.descFr : d.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#1F2937]">
              {isFr ? "Besoin d'un programme Maroc par destination ?" : "Need a destination-based Morocco program?"}
            </h2>
            <p className="mt-3 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Combinez Marrakech, Fès, le Sahara, la côte Atlantique ou les montagnes dans un itinéraire adapté à votre agence ou groupe."
                : "Combine Marrakech, Fes, the Sahara, the Atlantic coast or the mountains in an itinerary adapted for your agency or group."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/circuits">
                <Button variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                  {isFr ? "Voir les circuits" : "View Circuits"}
                </Button>
              </Link>
              <Link to="/quote">
                <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                  {isFr ? "Demander un devis" : "Request a Quote"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
