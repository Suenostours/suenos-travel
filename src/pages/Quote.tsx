import { useState } from "react";
import { useLocation } from "react-router";
import { useI18n } from "@/providers/i18n";
import { trpc } from "@/providers/trpc";
import SEO from "@/components/SEO";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackQuoteFormSubmit } from "@/lib/tracking";
import { getRequestedTourSlug, getValidatedTourContext } from "@/lib/quote-tour-context";
import { PUBLIC_DESTINATIONS, getRequestedDestinationSlug, getValidatedDestinationContext } from "@/lib/public-destinations";
import { QUOTE_ACTIVITIES, QUOTE_SERVICES, buildQuoteRequestInput, selectedOptionLabels, type QuoteAssistance } from "@/lib/quote-request";
import { useSsrData } from "@/providers/ssr-data";
import QuotePreferences from "@/components/QuotePreferences";
import QuoteConfirmation from "@/components/QuoteConfirmation";

export default function Quote() {
  const { locale } = useI18n();
  const location = useLocation();
  const ssrData = useSsrData();
  const isFr = locale === "fr";
  const [receipt, setReceipt] = useState<{ reference?: string } | null>(null);
  const [error, setError] = useState("");
  const [agency, setAgency] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dates, setDates] = useState("");
  const [pax, setPax] = useState("");
  const [brief, setBrief] = useState("");
  const [assistance, setAssistance] = useState<QuoteAssistance>({ requestKind: "specific", helpMeChoose: false, market: "", clientProfile: "", services: [], activities: [] });
  const [chosenDestinations, setChosenDestinations] = useState<string[]>([]);
  const requestedTourSlug = getRequestedTourSlug(location.search);
  const hasTourParameter = new URLSearchParams(location.search).has("tour");
  const hasDestinationParameter = new URLSearchParams(location.search).has("destination");
  const destinationContext = getValidatedDestinationContext(location.search, locale);
  const destinationSlugs = [...new Set([...(destinationContext ? [destinationContext.slug] : []), ...chosenDestinations])];
  const selectedDestinations = PUBLIC_DESTINATIONS.filter((destination) => destinationSlugs.includes(destination.slug));
  const matchingSsrTour = ssrData.routeData.kind === "quote-tour"
    && ssrData.routeData.slug === requestedTourSlug
    && ssrData.routeData.locale === locale
      ? ssrData.routeData
      : undefined;
  const initialTour = matchingSsrTour?.state === "found" || matchingSsrTour?.state === "missing"
    ? matchingSsrTour.data ?? null
    : undefined;
  const {
    data: selectedTour,
    isLoading: isTourLoading,
    isError: isTourError,
  } = trpc.public.getTour.useQuery(
    { slug: requestedTourSlug ?? "", locale },
    {
      enabled: Boolean(requestedTourSlug) && matchingSsrTour?.state !== "unavailable",
      initialData: initialTour,
      staleTime: initialTour !== undefined ? 5 * 60 * 1000 : 0,
      retry: 1,
    },
  );
  const tourContext = getValidatedTourContext(
    requestedTourSlug,
    selectedTour
      ? {
          slug: selectedTour.tours.slug,
          title: selectedTour.tour_translations?.title,
        }
      : null,
  );
  const needsBrief = assistance.requestKind === "specific" && !tourContext;
  const isInvalidTourContext = hasTourParameter && (
    !requestedTourSlug
    || matchingSsrTour?.state === "unavailable"
    || (!isTourLoading && (isTourError || !selectedTour))
  );
  const isInvalidDestinationContext = hasDestinationParameter
    && !getRequestedDestinationSlug(location.search);
  const isTourContextPending = Boolean(requestedTourSlug) && isTourLoading;

  const createQuote = trpc.forms.createQuote.useMutation({
    onSuccess: (result) => {
      setReceipt({ reference: result.reference });
      trackQuoteFormSubmit();
    },
    onError: (err) => setError(isFr
      ? "La demande n'a pas pu être envoyée. Veuillez réessayer ou nous contacter directement."
      : err.message),
  });

  const summaryRows = [
    [isFr ? "Demande" : "Request", assistance.requestKind === "package" ? (isFr ? "Recevoir votre proposition de package" : "Receive your Morocco package proposal") : (isFr ? "Recevoir un devis pour notre programme" : "Get a quote for our existing itinerary")],
    ...(assistance.requestKind === "package" ? [
      [isFr ? "Marché" : "Source market", assistance.market],
      [isFr ? "Clients" : "Clients", assistance.clientProfile],
    ] : []),
    [isFr ? "Programme" : "Programme", tourContext?.title],
    [isFr ? "Destinations" : "Destinations", selectedDestinations.map((d) => isFr ? d.nameFr : d.name).join(", ")],
    [isFr ? "Services" : "Services", selectedOptionLabels(QUOTE_SERVICES, assistance.services, locale).join(", ")],
    [isFr ? "Activités" : "Activities", selectedOptionLabels(QUOTE_ACTIVITIES, assistance.activities, locale).join(", ")],
    [isFr ? "Dates" : "Dates", dates],
    [isFr ? "Voyageurs" : "Travelers", pax],
    [isFr ? "Accompagnement" : "Planning support", assistance.helpMeChoose ? (assistance.requestKind === "package" ? (isFr ? "Aidez-nous à choisir" : "Help us choose") : (isFr ? "Ajustements bienvenus" : "Suggestions welcome")) : ""],
    [isFr ? "Vos notes" : "Your notes", brief],
  ].filter((row) => row[1]?.trim());

  if (receipt) {
    return (
      <main className="min-h-screen bg-[#F8F7F4] pt-24 pb-16 flex items-center justify-center">
        <SEO />
        <QuoteConfirmation locale={locale} reference={receipt.reference} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <SEO />

      <section className="bg-gradient-to-br from-[#A91D2D] to-[#1F2937] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            {isFr ? "Demander un devis" : "Request a Quote"}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {isFr ? "Décrivez votre projet et notre équipe DMC locale vous répondra sous 24-48h." : "Describe your project and our local Morocco DMC team will respond within 24-48 hours."}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="order-2 md:order-1 md:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                <h3 className="font-serif text-lg font-bold text-[#1F2937] mb-4">{isFr ? "Pour agences et MICE" : "For agencies and MICE"}</h3>
                <ul className="space-y-3 text-sm text-[#6B7280]">
                  <li>{isFr ? "Réponse sous 24-48h, sans engagement" : "24-48h response, no commitment"}</li>
                  <li>{isFr ? "Pour agences, tour-opérateurs et planners MICE" : "For agencies, tour operators and MICE planners"}</li>
                  <li>{isFr ? "Tarifs nets agences et programmes sur mesure" : "Net agency rates and tailor-made programs"}</li>
                  <li>{isFr ? "Suivi par une équipe DMC locale au Maroc" : "Handled by a local Morocco DMC team"}</li>
                  <li>{isFr ? "Assistance sur place pour les groupes" : "On-site support for groups"}</li>
                </ul>
              </div>
            </div>

            <div className="order-1 md:order-2 md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 md:p-8">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setError("");
                  if (isTourContextPending) {
                    setError(isFr
                      ? "Veuillez patienter pendant la vérification du programme sélectionné."
                      : "Please wait while we verify the selected programme.");
                    return;
                  }
                  if (!name.trim()) { setError(isFr ? "La personne à contacter est requise" : "Contact person is required"); return; }
                  if (!email.trim()) { setError(isFr ? "L'email est requis" : "Email is required"); return; }
                  if (createQuote.isPending) return;
                  if (needsBrief && !brief.trim()) { setError(isFr ? "Partagez votre programme ou choisissez « Proposez-nous un package au Maroc »." : "Share your itinerary or choose “Recommend a Morocco package”."); return; }
                  if (pax && (!Number.isInteger(Number(pax)) || Number(pax) < 1 || Number(pax) > 10000)) { setError(isFr ? "Indiquez un nombre entier entre 1 et 10 000, ou laissez ce champ vide." : "Enter a whole number from 1 to 10,000, or leave this field blank."); return; }
                  createQuote.mutate(buildQuoteRequestInput({
                    email,
                    agencyName: agency,
                    contactPerson: name,
                    whatsapp,
                    dates,
                    numberOfPax: pax ? Number(pax) : undefined,
                    specialRequests: brief,
                  }, {
                    preferredDestinations: selectedDestinations.length ? selectedDestinations.map((d) => `${isFr ? d.nameFr : d.name} [${d.slug}]`).join(", ") : undefined,
                    preferredCircuit: tourContext?.preferredCircuit,
                  }, assistance));
                }}>
                  <fieldset disabled={createQuote.isPending} className="min-w-0 space-y-5">
                  <h2 className="font-serif text-xl font-bold text-[#1F2937] mb-4">
                    {isFr ? "Votre projet" : "Your project"}
                  </h2>

                  <QuotePreferences locale={locale} value={assistance} onChange={setAssistance} destinations={destinationSlugs} contextDestination={destinationContext?.slug} onDestinationsChange={setChosenDestinations} />

                  {tourContext && (
                    <div className="rounded-xl border border-[#A91D2D]/20 bg-[#A91D2D]/5 p-4">
                      <Label htmlFor="selected-programme">
                        {isFr ? "Programme sélectionné" : "Selected programme"}
                      </Label>
                      <Input
                        id="selected-programme"
                        className="mt-1 bg-white"
                        value={tourContext.title}
                        readOnly
                      />
                      <p className="mt-2 text-xs text-[#6B7280]">
                        {isFr
                          ? "Ce programme sera joint à votre demande de devis."
                          : "This programme will be included with your quote request."}
                      </p>
                    </div>
                  )}

                  {destinationContext && (
                    <div className="rounded-xl border border-[#A91D2D]/20 bg-[#A91D2D]/5 p-4">
                      <Label htmlFor="selected-destination">
                        {isFr ? "Destination sélectionnée" : "Selected destination"}
                      </Label>
                      <Input
                        id="selected-destination"
                        className="mt-1 bg-white"
                        value={destinationContext.title}
                        readOnly
                      />
                      <p className="mt-2 text-xs text-[#6B7280]">
                        {isFr
                          ? "Cette destination sera jointe à votre demande de devis."
                          : "This destination will be included with your quote request."}
                      </p>
                    </div>
                  )}

                  {isInvalidTourContext && (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="status">
                      {isFr
                        ? "Le programme sélectionné n'est pas disponible. Vous pouvez toujours envoyer une demande sur mesure."
                        : "The selected programme is unavailable. You can still send a custom request."}
                    </p>
                  )}

                  {isInvalidDestinationContext && (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="status">
                      {isFr
                        ? "La destination sélectionnée n'est pas disponible. Vous pouvez toujours envoyer une demande sur mesure."
                        : "The selected destination is unavailable. You can still send a custom request."}
                    </p>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agency-name">{isFr ? "Nom de l'agence" : "Agency Name"}</Label>
                      <Input id="agency-name" name="agencyName" autoComplete="organization" maxLength={255} className="mt-1" value={agency} onChange={(e) => setAgency(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="contact-person">{isFr ? "Personne à contacter" : "Contact Person"} *</Label>
                      <Input id="contact-person" name="contactPerson" autoComplete="name" maxLength={255} required className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quote-email">Email *</Label>
                      <Input id="quote-email" name="email" autoComplete="email" maxLength={255} type="email" required className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="quote-whatsapp">WhatsApp</Label>
                      <Input id="quote-whatsapp" name="whatsapp" autoComplete="tel" maxLength={50} inputMode="tel" className="mt-1" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferred-dates">{isFr ? "Dates souhaitées" : "Preferred Dates"}</Label>
                      <Input id="preferred-dates" name="dates" maxLength={100} placeholder={isFr ? "À définir / période souhaitée" : "To be decided / preferred season"} className="mt-1" value={dates} onChange={(e) => setDates(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="number-of-pax">{isFr ? "Nombre de voyageurs" : "Number of Pax"}</Label>
                      <Input id="number-of-pax" name="numberOfPax" type="number" min={1} max={10000} step={1} placeholder={isFr ? "Si connu" : "If known"} className="mt-1" value={pax} onChange={(e) => setPax(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quote-brief">{assistance.requestKind === "package" ? (isFr ? "Vos attentes ou préférences" : "Your expectations or preferences") : (isFr ? "Votre programme et les prestations souhaitées" : "Your itinerary and services needed")}{needsBrief ? " *" : (isFr ? " (facultatif)" : " (optional)")}</Label>
                    <Textarea
                      id="quote-brief"
                      name="brief"
                      required={needsBrief}
                      maxLength={4000}
                      className="mt-1"
                      rows={4}
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      placeholder={assistance.requestKind === "package"
                        ? (isFr ? "Dites-nous ce que vous savez de vos clients, leur budget ou leurs centres d’intérêt. Vous pouvez aussi laisser notre équipe vous conseiller." : "Share anything you know about your clients, their budget or interests. You can also leave the recommendations to our team.")
                        : (isFr ? "Collez votre itinéraire ici (villes, étapes ou programme jour par jour) et indiquez les prestations à chiffrer : hôtels, transport, guides, repas…" : "Paste your itinerary here (cities, stops or day-by-day programme) and list the services to quote: hotels, transport, guides, meals…")}
                    />
                  </div>

                  <section aria-labelledby="quote-summary" className="rounded-xl bg-[#F8F7F4] p-4">
                    <h3 id="quote-summary" className="mb-3 text-sm font-semibold text-[#1F2937]">{isFr ? "Résumé de votre demande" : "Your request at a glance"}</h3>
                    <dl className="space-y-2 text-sm">
                      {summaryRows.map(([label, value]) => <div key={label} className="break-words"><dt className="font-medium text-[#4B5563]">{label}</dt><dd className="whitespace-pre-wrap text-[#6B7280]">{value}</dd></div>)}
                    </dl>
                    <p className="mt-3 text-xs text-[#6B7280]">{isFr ? "Vous pouvez modifier vos choix ci-dessus. Les éléments non renseignés seront définis avec notre équipe. L’envoi n’est pas une réservation." : "You can edit your choices above. Our team will help define any missing details. Submitting is not a booking."}</p>
                  </section>

                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert" aria-live="polite">{error}</div>
                  )}

                  <Button type="submit" disabled={createQuote.isPending || isTourContextPending} className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full disabled:opacity-50">
                    <Send className="mr-2 h-4 w-4" />
                    {isTourContextPending
                      ? (isFr ? "Vérification du programme..." : "Checking programme...")
                      : createQuote.isPending
                      ? (isFr ? "Envoi en cours..." : "Sending...")
                      : (isFr ? "Envoyer la demande" : "Send Request")
                    }
                  </Button>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
