import { useParams, Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import { trpc } from "@/providers/trpc";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import { ArrowLeft, Clock, MapPin, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE_URL = "https://www.morocco-incoming.com";
const DEFAULT_TOUR_IMAGE = "/images/hero-desert.jpg";
const DEFAULT_TOUR_DESCRIPTION =
  "Tailor-made Morocco tour for travel agencies, tour operators, groups and B2B partners with Suenos Travel DMC.";

function splitText(text?: string | null) {
  if (!text) return [];

  return text
    .split(/\r?\n/)
    .map((item) => item.trim().replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);
}

function formatType(type?: string) {
  return type ? type.replace(/_/g, " ") : "-";
}

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function trimDescription(value?: string | null, maxLength = 155) {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength).trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${(lastSpace > 80 ? trimmed.slice(0, lastSpace) : trimmed).trim()}...`;
}

function toAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${BASE_URL}${path}`;
}

export default function CircuitDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const { data, isLoading } = trpc.public.getTour.useQuery(
    { slug: slug ?? "", locale },
    { enabled: Boolean(slug) },
  );

  const tourData = data as any;
  const tour = tourData?.tours;
  const translation = tourData?.tour_translations;
  const cities = Array.isArray(tourData?.cities) ? tourData.cities : [];
  const cityNames = cities.map((city: any) => city?.name).filter(Boolean);
  const cityText = cityNames.join(", ");
  const quotePath = `/quote${slug ? `?tour=${encodeURIComponent(slug)}` : ""}`;

  if (isLoading) {
    return (
      <section className="bg-[#F9F7F4] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[#6B7280]">Loading tour...</p>
        </div>
      </section>
    );
  }

  if (!tour || !translation) {
    return (
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
          <Link to="/circuits">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" /> {isFr ? "Retour aux circuits" : "Back to circuits"}
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const programItems = splitText(translation.program);
  const highlightItems = splitText(translation.highlights);
  const includedItems = splitText(translation.inclusions);
  const excludedItems = splitText(translation.exclusions);
  const title = translation.title ?? tour.slug;
  const description = translation.description ?? "";
  const tourSlug = slug ?? tour.slug;
  const canonicalPath = `/circuits/${tourSlug}`;
  const seoTitle =
    cleanText(translation.metaTitle ?? translation.meta_title) ||
    `${title} | Morocco DMC Tour for Agencies`;
  const seoDescription =
    trimDescription(translation.metaDescription ?? translation.meta_description) ||
    trimDescription(description) ||
    DEFAULT_TOUR_DESCRIPTION;
  const seoImage = tour.mainImage || DEFAULT_TOUR_IMAGE;
  const absoluteUrl = toAbsoluteUrl(canonicalPath);
  const absoluteImage = toAbsoluteUrl(seoImage);
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
        name: "Circuits",
        item: `${BASE_URL}/circuits`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: absoluteUrl,
      },
    ],
  };
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: seoDescription,
    image: absoluteImage,
    brand: {
      "@type": "Organization",
      name: "Suenos Travel",
      url: BASE_URL,
    },
    category: "Morocco Tour / DMC Program",
    url: absoluteUrl,
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalPath}
        image={seoImage}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>

      <section className="bg-[#F9F7F4]">
        <div className="relative h-[400px] md:h-[500px]">
          {tour.mainImage ? (
            <img src={tour.mainImage} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#D8CEC4]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Link to="/circuits" className="inline-flex items-center gap-1 text-white/80 text-sm mb-4 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> {isFr ? "Retour aux circuits" : "Back to circuits"}
              </Link>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">{title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80 text-sm">
                {tour.duration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {tour.duration}</span>}
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
                      Ce programme peut etre adapte avec nos <Link to="/services" className="text-[#A91D2D] font-medium hover:underline">services DMC Maroc</Link>, conditions <Link to="/b2b" className="text-[#A91D2D] font-medium hover:underline">partenaire B2B</Link> et support <Link to="/mice" className="text-[#A91D2D] font-medium hover:underline">MICE Maroc</Link> pour groupes, incentives ou departs en serie.
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
                  {tour.duration && <div className="flex justify-between gap-4"><span className="text-[#6B7280]">{isFr ? "Durée" : "Duration"}</span><span className="font-medium">{tour.duration}</span></div>}
                  <div className="flex justify-between gap-4"><span className="text-[#6B7280]">{isFr ? "Type" : "Type"}</span><span className="font-medium capitalize">{formatType(tour.type)}</span></div>
                  {cityText && <div className="flex justify-between gap-4"><span className="text-[#6B7280]">{isFr ? "Villes" : "Cities"}</span><span className="font-medium text-right">{cityText}</span></div>}
                </div>
                <Link to={quotePath} className="mt-6 block">
                  <Button className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
                    {isFr ? "Demander les tarifs nets" : "Request Net Rates"}
                  </Button>
                </Link>
                <a href="https://wa.me/212661925611" target="_blank" rel="noopener noreferrer" className="mt-3 block">
                  <Button variant="outline" className="w-full rounded-full">WhatsApp</Button>
                </a>
                <Link to="/b2b" className="mt-3 block">
                  <Button variant="outline" className="w-full rounded-full">
                    {isFr ? "Devenir partenaire B2B" : "Become a B2B Partner"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
