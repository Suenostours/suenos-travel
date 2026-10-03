import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { PUBLIC_DESTINATIONS } from "@/lib/public-destinations";

export default function Destinations() {
  const { locale } = useI18n();
  const isFr = locale === "fr";

  return (
    <>
      <SEO />

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
            {PUBLIC_DESTINATIONS.map((d) => (
              <Link key={d.slug} to={`/destinations/${d.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={d.image} alt={`${d.name} Morocco destination`} width={1184} height={864} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
              <Button asChild variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                <Link to="/circuits">
                  {isFr ? "Voir les circuits" : "View Circuits"}
                </Link>
              </Button>
              <Button asChild className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                <Link to="/quote">
                  {isFr ? "Demander un devis" : "Request a Quote"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
