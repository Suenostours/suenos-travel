import { useState } from "react";
import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import { trpc } from "@/providers/trpc";
import SEO from "@/components/SEO";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const typeFilters = [
  { key: "all", label: "All", labelFr: "Tous" },
  { key: "private", label: "Private", labelFr: "Prive" },
  { key: "small_group", label: "Small Group", labelFr: "Petit groupe" },
  { key: "corporate", label: "Corporate", labelFr: "Corporate" },
  { key: "desert", label: "Desert", labelFr: "Desert" },
  { key: "family", label: "Family", labelFr: "Famille" },
  { key: "luxury", label: "Luxury", labelFr: "Luxe" },
  { key: "cultural", label: "Cultural", labelFr: "Culturel" },
  { key: "adventure", label: "Adventure", labelFr: "Aventure" },
  { key: "short_break", label: "Short Break", labelFr: "Court sejour" },
  { key: "coast", label: "Coast", labelFr: "Cote" },
  { key: "sports", label: "Sports", labelFr: "Sports" },
  { key: "wellness", label: "Wellness", labelFr: "Bien-etre" },
  { key: "romantic", label: "Romantic", labelFr: "Romantique" },
];

const typeLabels: Record<string, string> = {
  private: "Private",
  small_group: "Small Group",
  corporate: "Corporate",
  desert: "Desert",
  family: "Family",
  luxury: "Luxury & Wellness",
  cultural: "Cultural & Historical",
  adventure: "Adventure & Nature",
  short_break: "City & Nature",
  coast: "Coast",
  sports: "Sports",
  wellness: "Wellness",
  romantic: "Romantic & Luxury",
};

const typeColors: Record<string, string> = {
  private: "bg-teal-100 text-teal-800",
  small_group: "bg-indigo-100 text-indigo-800",
  corporate: "bg-slate-100 text-slate-800",
  desert: "bg-orange-100 text-orange-800",
  family: "bg-lime-100 text-lime-800",
  luxury: "bg-purple-100 text-purple-800",
  cultural: "bg-amber-100 text-amber-800",
  adventure: "bg-emerald-100 text-emerald-800",
  short_break: "bg-sky-100 text-sky-800",
  coast: "bg-cyan-100 text-cyan-800",
  sports: "bg-blue-100 text-blue-800",
  wellness: "bg-green-100 text-green-800",
  romantic: "bg-rose-100 text-rose-800",
};

function getTypeLabel(type: string) {
  return typeLabels[type] ?? type.replace(/_/g, " ");
}

export default function Circuits() {
  const { locale } = useI18n();
  const [filter, setFilter] = useState("all");
  const { data: tours = [], isLoading, error } = trpc.public.listTours.useQuery({ locale });

  const filtered = filter === "all" ? tours : tours.filter((tour) => tour.type === filter);
  const hasTours = tours.length > 0;

  return (
    <>
      <SEO
        title="Morocco Private & Group Tours for Agencies | DMC Morocco"
        description="Explore Morocco circuits for travel agencies and tour operators: private tours, group tours, Sahara, imperial cities, luxury, family and incentive itineraries."
        canonical="/circuits"
        image="/images/circuit-sahara.jpg"
      />

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">Morocco Circuits</h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {locale === "fr"
                ? "Circuits soigneusement concus pour les agences de voyage, tour-operateurs et groupes corporate."
                : "Carefully crafted itineraries for travel agencies, tour operators, and corporate groups."}
            </p>
            <p className="mt-3 text-sm text-[#6B7280] max-w-3xl mx-auto">
              {locale === "fr"
                ? "Tous les programmes peuvent etre adaptes pour groupes prives, departs en serie, incentives et demandes white-label agence."
                : "All programs can be adapted for private groups, series departures, incentives and agency white-label requests."}
            </p>
            <p className="mt-3 text-sm text-[#6B7280] max-w-3xl mx-auto">
              {locale === "fr" ? (
                <>
                  Nos <Link to="/services" className="text-[#A91D2D] font-medium hover:underline">services DMC Maroc</Link> couvrent transport, guides, hotels, desert et <Link to="/mice" className="text-[#A91D2D] font-medium hover:underline">voyages incentive Maroc</Link> pour vos groupes.
                </>
              ) : (
                <>
                  Our <Link to="/dmc-morocco" className="text-[#A91D2D] font-medium hover:underline">DMC Morocco</Link> services cover transport, guides, hotels, desert programs, <Link to="/morocco-group-tours" className="text-[#A91D2D] font-medium hover:underline">Morocco group tours</Link> and <Link to="/mice-morocco" className="text-[#A91D2D] font-medium hover:underline">Morocco incentive travel</Link> for agency groups.
                </>
              )}
            </p>
          </div>

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

          {isLoading && (
            <div className="text-center text-sm text-[#6B7280]">Loading tours...</div>
          )}

          {error && (
            <div className="bg-white rounded-2xl border border-red-100 p-8 text-center text-sm text-red-700 shadow-sm">
              Unable to load tours right now.
            </div>
          )}

          {!isLoading && !error && !hasTours && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-[#4B5563] shadow-sm">
              No tours available yet. Please add tours from the admin dashboard.
            </div>
          )}

          {!isLoading && !error && hasTours && filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-[#4B5563] shadow-sm">
              No tours found for this filter.
            </div>
          )}

          {!isLoading && !error && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((tour) => (
                <div key={tour.slug} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  <div className="relative h-56 overflow-hidden">
                    {tour.mainImage ? (
                      <img src={tour.mainImage} alt={tour.title ?? tour.slug} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-[#F3EDE8] flex items-center justify-center px-6 text-center text-sm text-[#6B7280]">
                        {tour.title ?? tour.slug}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeColors[tour.type] ?? "bg-gray-100 text-gray-700"}`}>
                        {getTypeLabel(tour.type)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg text-[#1F2937]">{tour.title ?? tour.slug}</h3>
                    {tour.duration && (
                      <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {tour.duration}</span>
                      </div>
                    )}
                    {tour.description && <p className="text-sm text-[#4B5563] line-clamp-2">{tour.description}</p>}
                    <Link to={`/circuits/${tour.slug}`}>
                      <Button variant="ghost" className="text-[#A91D2D] hover:text-[#8a1824] p-0 h-auto text-sm font-medium">
                        View Details <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8 md:p-10 text-center shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">
              {locale === "fr" ? "Besoin d'un programme Maroc sur mesure ?" : "Need a custom Morocco program?"}
            </h2>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {locale === "fr"
                ? "Partagez vos dates, la taille du groupe et le budget cible. Nous preparerons un itineraire sur mesure pour votre agence ou entreprise."
                : "Share your dates, group size and target budget. We will prepare a tailor-made itinerary for your agency or company."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/quote">
                <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                  {locale === "fr" ? "Demander un devis sur mesure" : "Request a Custom Quote"}
                </Button>
              </Link>
              <Link to="/b2b">
                <Button variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                  {locale === "fr" ? "Devenir partenaire B2B" : "Become a B2B Partner"}
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                  {locale === "fr" ? "Voir les services DMC" : "View DMC Services"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
