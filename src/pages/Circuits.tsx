import { useState } from "react";
import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import { trpc } from "@/providers/trpc";
import SEO from "@/components/SEO";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { optimizedImageUrl } from "@/lib/images";
import { useSsrData } from "@/providers/ssr-data";
import { localizeTourDuration } from "@/lib/tour-display";

const typeFilters = [
  { key: "all", label: "All", labelFr: "Tous" },
  { key: "private", label: "Private", labelFr: "Privé" },
  { key: "small_group", label: "Small Group", labelFr: "Petit groupe" },
  { key: "corporate", label: "Corporate", labelFr: "Corporate" },
  { key: "desert", label: "Desert", labelFr: "Désert" },
  { key: "family", label: "Family", labelFr: "Famille" },
  { key: "luxury", label: "Luxury", labelFr: "Luxe" },
  { key: "cultural", label: "Cultural", labelFr: "Culturel" },
  { key: "adventure", label: "Adventure", labelFr: "Aventure" },
  { key: "short_break", label: "Short Break", labelFr: "Court séjour" },
  { key: "coast", label: "Coast", labelFr: "Côte" },
  { key: "sports", label: "Sports", labelFr: "Sports" },
  { key: "wellness", label: "Wellness", labelFr: "Bien-être" },
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

const frenchTypeLabels: Record<string, string> = {
  private: "Privé",
  small_group: "Petit groupe",
  corporate: "Entreprise",
  desert: "Désert",
  family: "Famille",
  luxury: "Luxe et bien-être",
  cultural: "Culture et histoire",
  adventure: "Aventure et nature",
  short_break: "Ville et nature",
  coast: "Côte",
  sports: "Sports",
  wellness: "Bien-être",
  romantic: "Romantique et luxe",
};

function getTypeLabel(type: string, locale: "en" | "fr") {
  return (locale === "fr" ? frenchTypeLabels[type] : typeLabels[type]) ?? type.replace(/_/g, " ");
}

export default function Circuits() {
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const ssrData = useSsrData();
  const [filter, setFilter] = useState("all");
  const matchingSsrCatalog = ssrData.routeData.kind === "tour-catalog"
    && ssrData.routeData.locale === locale
      ? ssrData.routeData
      : undefined;
  const initialTours = matchingSsrCatalog?.state === "found" || matchingSsrCatalog?.state === "empty"
    ? matchingSsrCatalog.data ?? []
    : undefined;
  const { data: tours = [], isLoading, error: queryError } = trpc.public.listTours.useQuery(
    { locale },
    {
      enabled: matchingSsrCatalog?.state !== "unavailable",
      initialData: initialTours,
      staleTime: initialTours !== undefined ? 5 * 60 * 1000 : 0,
    },
  );
  const error = queryError || matchingSsrCatalog?.state === "unavailable";

  const filtered = filter === "all" ? tours : tours.filter((tour) => tour.type === filter);
  const hasTours = tours.length > 0;
  return (
    <>
      <SEO />

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <nav className="mb-5 text-sm text-[#6B7280]" aria-label="Breadcrumb">
              <Link to={isFr ? "/fr" : "/"} className="hover:text-[#A91D2D]">{isFr ? "Accueil" : "Home"}</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span aria-current="page">{isFr ? "Circuits au Maroc" : "Morocco circuits"}</span>
            </nav>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">
              {isFr ? "Circuits au Maroc pour agences de voyage" : "Morocco Circuits and Group Tours for Travel Agencies"}
            </h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Découvrez les programmes disposant d'une traduction française complète dans notre catalogue pour agences, tour-opérateurs et groupes."
                : "Discover tailor-made Morocco circuits for travel agencies and tour operators, including private FIT programs, agency groups and series departures across the imperial cities, Sahara and Atlantic coast."}
            </p>
            <p className="mt-3 text-sm text-[#6B7280] max-w-3xl mx-auto">
              {isFr
                ? "Chaque itinéraire peut être adapté avec guides, transport, hôtels, prestations locales et proposition en tarifs nets pour l'agence."
                : "Use this catalogue to discover program ideas; every route can be adapted with licensed guides, private transport or coaches, hotels, local operations and a net-rate quotation."}
            </p>
            <p className="mt-3 text-sm text-[#6B7280] max-w-3xl mx-auto">
              {isFr ? (
                <>
                  Consultez nos <Link to="/fr/services" className="text-[#A91D2D] font-medium hover:underline">services réceptifs</Link> ou notre page <Link to="/fr/morocco-tours-for-travel-agencies" className="text-[#A91D2D] font-medium hover:underline">circuits pour agences</Link> pour préparer un programme adapté.
                </>
              ) : (
                <>
                  For operating support, review our <Link to="/morocco-group-tours" className="text-[#A91D2D] font-medium hover:underline">Morocco group tours for agencies</Link>, <Link to="/morocco-tours-for-travel-agencies" className="text-[#A91D2D] font-medium hover:underline">tour programs for travel agencies</Link>, <Link to="/dmc-morocco" className="text-[#A91D2D] font-medium hover:underline">DMC Morocco services</Link> and <Link to="/incoming-agency-morocco" className="text-[#A91D2D] font-medium hover:underline">incoming agency support</Link>.
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
                {isFr ? f.labelFr : f.label}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center text-sm text-[#6B7280]">{isFr ? "Chargement des circuits…" : "Loading tours..."}</div>
          )}

          {error && (
            <div className="bg-white rounded-2xl border border-red-100 p-8 text-center text-sm text-red-700 shadow-sm">
              {isFr ? "Le catalogue est temporairement indisponible." : "Unable to load tours right now."}
            </div>
          )}

          {!isLoading && !error && !hasTours && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-[#4B5563] shadow-sm">
              {isFr ? "Aucun circuit traduit en français n'est disponible pour le moment." : "No tours available yet. Please add tours from the admin dashboard."}
            </div>
          )}

          {!isLoading && !error && hasTours && filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-[#4B5563] shadow-sm">
              {isFr ? "Aucun circuit ne correspond à ce filtre." : "No tours found for this filter."}
            </div>
          )}

          {!isLoading && !error && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((tour) => {
                const localizedDuration = localizeTourDuration(tour.duration, locale);
                return (
                <div key={tour.slug} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  <div className="relative h-56 overflow-hidden">
                    {tour.mainImage ? (
                      <img src={optimizedImageUrl(tour.mainImage, 800)} alt={tour.title ?? tour.slug} width={800} height={533} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-[#F3EDE8] flex items-center justify-center px-6 text-center text-sm text-[#6B7280]">
                        {tour.title ?? tour.slug}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeColors[tour.type] ?? "bg-gray-100 text-gray-700"}`}>
                        {getTypeLabel(tour.type, locale)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg text-[#1F2937]">{tour.title ?? tour.slug}</h3>
                    {localizedDuration && (
                      <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {localizedDuration}</span>
                      </div>
                    )}
                    {tour.description && <p className="text-sm text-[#4B5563] line-clamp-2">{tour.description}</p>}
                    <Button asChild variant="ghost" className="text-[#A91D2D] hover:text-[#8a1824] p-0 h-auto text-sm font-medium">
                      <Link to={`${isFr ? "/fr" : ""}/circuits/${tour.slug}`}>
                        {isFr ? "Voir le programme" : "View Details"} <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-gray-100 bg-[#F3EDE8] p-7 md:p-8">
            <h2 className="font-serif text-2xl font-bold text-[#1F2937]">
              {isFr ? "Un catalogue fondé sur les traductions disponibles" : "Build a route around the right Morocco destinations"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
              {isFr ? (
                <>Cette page affiche uniquement les circuits actifs associés à une fiche française complète. Pour un itinéraire différent, consultez nos <Link to="/fr/morocco-tours-for-travel-agencies" className="text-[#A91D2D] font-medium hover:underline">services de conception de circuits</Link> ou envoyez votre brief via le <Link to="/fr/quote" className="text-[#A91D2D] font-medium hover:underline">formulaire de devis</Link>.</>
              ) : (
                <>Compare our <Link to="/destinations/marrakech" className="text-[#A91D2D] font-medium hover:underline">Marrakech programs</Link>, <Link to="/destinations/fes" className="text-[#A91D2D] font-medium hover:underline">Fes and imperial city routes</Link>, <Link to="/destinations/merzouga" className="text-[#A91D2D] font-medium hover:underline">Merzouga Sahara extensions</Link>, <Link to="/destinations/essaouira" className="text-[#A91D2D] font-medium hover:underline">Essaouira coastal stays</Link> or the complete <Link to="/destinations" className="text-[#A91D2D] font-medium hover:underline">Morocco destinations guide</Link>. Share the preferred route through our <Link to="/quote" className="text-[#A91D2D] font-medium hover:underline">B2B quote form</Link> for an adapted proposal.</>
              )}
            </p>
          </div>

          <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8 md:p-10 text-center shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">
              {isFr ? "Besoin d'un programme Maroc sur mesure ?" : "Need a custom Morocco program?"}
            </h2>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Partagez vos dates, la taille du groupe et le budget cible afin de préparer un itinéraire adapté à votre agence ou entreprise."
                : "Share your dates, group size and target budget. We will prepare a tailor-made itinerary for your agency or company."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                <Link to={isFr ? "/fr/quote" : "/quote"}>
                  {isFr ? "Demander un devis sur mesure" : "Request a Custom Quote"}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                <Link to={isFr ? "/fr/incoming-agency-morocco" : "/b2b"}>
                  {isFr ? "Découvrir notre accompagnement B2B" : "Become a B2B Partner"}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                <Link to={isFr ? "/fr/morocco-tours-for-travel-agencies" : "/morocco-tours-for-travel-agencies"}>
                  {isFr ? "Voir les services pour agences" : "View Agency Tour Services"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
