import { useParams, Link, useLocation } from "react-router";
import { useI18n } from "@/providers/i18n";
import { trpc } from "@/providers/trpc";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ArrowLeft, Clock, MapPin, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { optimizedImageUrl } from "@/lib/images";
import { buildTourSeoMeta } from "@/lib/seo-meta";
import { buildTouristTripSchema } from "@/lib/tour-schema";
import { WHATSAPP_URL } from "@/lib/contact-details";
import { useSsrData } from "@/providers/ssr-data";
import { localizedPath } from "@/lib/locale-routes";
import { localizeTourDuration, localizeTourType } from "@/lib/tour-display";

function splitText(text?: string | null) {
  if (!text) return [];

  return text
    .split(/\r?\n/)
    .map((item) => item.trim().replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);
}

export default function CircuitDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { locale } = useI18n();
  const ssrData = useSsrData();
  const isFr = locale === "fr";
  const matchingSsrTour = ssrData.routeData.kind === "tour"
    && ssrData.routeData.slug === slug
    && ssrData.routeData.locale === locale
      ? ssrData.routeData
      : undefined;
  const initialTour = matchingSsrTour?.state === "found" || matchingSsrTour?.state === "missing"
    ? matchingSsrTour.data ?? null
    : undefined;
  const { data, isLoading, isError: isQueryError } = trpc.public.getTour.useQuery(
    { slug: slug ?? "", locale },
    {
      enabled: Boolean(slug) && matchingSsrTour?.state !== "unavailable",
      initialData: initialTour,
      staleTime: initialTour !== undefined ? 5 * 60 * 1000 : 0,
    },
  );
  const isError = isQueryError || matchingSsrTour?.state === "unavailable";

  const tour = data?.tours;
  const translation = data?.tour_translations;
  const cities = data?.cities ?? [];
  const cityNames = cities
    .map((city) => city.name)
    .filter((name): name is string => Boolean(name));
  const cityText = cityNames.join(", ");
  const cataloguePath = isFr ? "/fr/circuits" : "/circuits";
  const quotePath = `${isFr ? "/fr/quote" : "/quote"}${slug ? `?tour=${encodeURIComponent(slug)}` : ""}`;

  if (isLoading) {
    return (
      <section className="bg-[#F9F7F4] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[#6B7280]">{isFr ? "Chargement du circuit…" : "Loading tour..."}</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <>
        <SEO />
        <section className="bg-[#F9F7F4] py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">
              {isFr ? "Circuit temporairement indisponible" : "Tour temporarily unavailable"}
            </h1>
            <p className="text-[#4B5563]">
              {isFr
                ? "Nous n'avons pas pu charger ce circuit. Veuillez réessayer dans quelques instants."
                : "We could not load this tour. Please try again in a moment."}
            </p>
          </div>
        </section>
      </>
    );
  }

  if (!tour || !translation) {
    return (
      <>
        <SEO
          title="Page Not Found | Suenos Travel DMC Morocco"
          description="The requested tour could not be found."
          canonical={`/circuits/${slug ?? "not-found"}`}
          noindex
        />
        <section className="bg-[#F9F7F4] py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">
              {isFr ? "Circuit introuvable" : "Tour not found"}
            </h1>
            <p className="text-[#4B5563]">
              {isFr
                ? "Ce circuit n'est pas disponible pour le moment."
                : "This tour is not available right now."}
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to={cataloguePath}>
                <ArrowLeft className="h-4 w-4 mr-2" /> {isFr ? "Retour aux circuits" : "Back to circuits"}
              </Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  const programItems = splitText(translation.program);
  const highlightItems = splitText(translation.highlights);
  const includedItems = splitText(translation.inclusions);
  const excludedItems = splitText(translation.exclusions);
  const title = translation.title ?? tour.slug;
  const description = translation.description ?? "";
  const tourSlug = slug ?? tour.slug;
  const localizedDuration = localizeTourDuration(tour.duration, locale);
  const localizedType = localizeTourType(tour.type, locale);
  const canonicalPath = location.pathname || localizedPath(`/circuits/${tourSlug}`, locale);
  const seo = buildTourSeoMeta({
    pathname: canonicalPath,
    title,
    description,
    metaTitle: translation.metaTitle,
    metaDescription: translation.metaDescription,
    image: tour.mainImage,
    dateModified: tour.updatedAt?.toISOString(),
    hasFrenchEquivalent: data.hasFrenchTranslation,
  });
  const tripJsonLd = buildTouristTripSchema({
    title,
    description: seo.description,
    image: seo.image,
    canonical: seo.canonical,
    locale,
  });

  return (
    <>
      <SEO
        {...seo}
      />
      <StructuredData id="tourist-trip-schema" value={tripJsonLd} />

      <section className="bg-[#F9F7F4]">
        <div className="relative h-[400px] md:h-[500px]">
          {tour.mainImage ? (
            <img src={optimizedImageUrl(tour.mainImage, 1600)} alt={title} width={1600} height={1067} fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#D8CEC4]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Link to={cataloguePath} className="inline-flex items-center gap-1 text-white/80 text-sm mb-4 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> {isFr ? "Retour aux circuits" : "Back to circuits"}
              </Link>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">{title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80 text-sm">
                {localizedDuration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {localizedDuration}</span>}
                {cityText && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {cityText}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              {description && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "Aperçu" : "Overview"}</h2>
                  <p className="text-[#4B5563] leading-relaxed">{description}</p>
                </div>
              )}

              {highlightItems.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "Points forts" : "Highlights"}</h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {highlightItems.map((item) => (
                      <li key={item} className="text-sm text-[#4B5563] flex items-start gap-2 bg-white rounded-xl border border-gray-100 p-4">
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {programItems.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "Programme" : "Itinerary"}</h2>
                  <div className="space-y-3">
                    {programItems.map((day, i) => (
                      <div key={`${i}-${day}`} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-[#A91D2D]/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#A91D2D]">{i + 1}</span>
                        </div>
                        <p className="text-sm text-[#4B5563]">{day}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(includedItems.length > 0 || excludedItems.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-8">
                  {includedItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" /> {isFr ? "Inclus" : "Included"}
                      </h3>
                      <ul className="space-y-2">
                        {includedItems.map((item) => (
                          <li key={item} className="text-sm text-[#4B5563] flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {excludedItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                        <X className="h-5 w-5 text-red-400" /> {isFr ? "Non inclus" : "Not Included"}
                      </h3>
                      <ul className="space-y-2">
                        {excludedItems.map((item) => (
                          <li key={item} className="text-sm text-[#4B5563] flex items-start gap-2">
                            <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-3">
                  {isFr ? "Support agence et groupes" : "Agency and Group Support"}
                </h2>
                <p className="text-[#4B5563] leading-relaxed">
                  {isFr ? (
                    <>
                      Ce programme peut être adapté avec nos <Link to="/fr/services" className="text-[#A91D2D] font-medium hover:underline">services DMC au Maroc</Link>, notre accompagnement <Link to="/fr/incoming-agency-morocco" className="text-[#A91D2D] font-medium hover:underline">partenaire B2B</Link> et notre support <Link to="/fr/mice-morocco" className="text-[#A91D2D] font-medium hover:underline">MICE au Maroc</Link> pour les groupes, incentives ou départs en série.
                    </>
                  ) : (
                    <>
                      This program can be adapted with our <Link to="/services" className="text-[#A91D2D] font-medium hover:underline">Morocco DMC services</Link>, <Link to="/b2b" className="text-[#A91D2D] font-medium hover:underline">B2B partner</Link> conditions and <Link to="/mice" className="text-[#A91D2D] font-medium hover:underline">Morocco MICE support</Link> for groups, incentives or series departures.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-semibold text-[#1F2937] mb-4">{isFr ? "Demander ce programme" : "Request this Program"}</h3>
                <div className="space-y-3 text-sm">
                  {localizedDuration && <div className="flex justify-between gap-4"><span className="text-[#6B7280]">{isFr ? "Durée" : "Duration"}</span><span className="font-medium">{localizedDuration}</span></div>}
                  {localizedType && <div className="flex justify-between gap-4"><span className="text-[#6B7280]">Type</span><span className="font-medium">{localizedType}</span></div>}
                  {cityText && <div className="flex justify-between gap-4"><span className="text-[#6B7280]">{isFr ? "Villes" : "Cities"}</span><span className="font-medium text-right">{cityText}</span></div>}
                </div>
                <Button asChild className="mt-6 w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
                  <Link to={quotePath}>
                    {isFr ? "Demander les tarifs nets" : "Request Net Rates"}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="mt-3 w-full rounded-full">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </Button>
                <Button asChild variant="outline" className="mt-3 w-full rounded-full">
                  <Link to={isFr ? "/fr/incoming-agency-morocco" : "/b2b"}>
                    {isFr ? "Services pour partenaires B2B" : "Become a B2B Partner"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
