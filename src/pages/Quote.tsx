import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useI18n } from "@/providers/i18n";
import { trpc } from "@/providers/trpc";
import SEO from "@/components/SEO";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackQuoteFormSubmit } from "@/lib/tracking";
import { getRequestedTourSlug, getValidatedTourContext } from "@/lib/quote-tour-context";
import { useSsrData } from "@/providers/ssr-data";

export default function Quote() {
  const { locale } = useI18n();
  const location = useLocation();
  const ssrData = useSsrData();
  const isFr = locale === "fr";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [agency, setAgency] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dates, setDates] = useState("");
  const [pax, setPax] = useState("");
  const [brief, setBrief] = useState("");
  const requestedTourSlug = getRequestedTourSlug(location.search);
  const hasTourParameter = new URLSearchParams(location.search).has("tour");
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
  const isInvalidTourContext = hasTourParameter && (
    !requestedTourSlug
    || matchingSsrTour?.state === "unavailable"
    || (!isTourLoading && (isTourError || !selectedTour))
  );
  const isTourContextPending = Boolean(requestedTourSlug) && isTourLoading;

  const createQuote = trpc.forms.createQuote.useMutation({
    onSuccess: () => {
      trackQuoteFormSubmit();
      setSubmitted(true);
    },
    onError: (err) => setError(isFr
      ? "La demande n'a pas pu être envoyée. Veuillez réessayer ou nous contacter directement."
      : err.message),
  });

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F8F7F4] pt-24 pb-16 flex items-center justify-center">
        <SEO />
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">
            {isFr ? "Demande de devis envoyée !" : "Quote Request Sent!"}
          </h1>
          <p className="text-[#6B7280] mb-8">
            {isFr
              ? "Merci. Notre équipe DMC vous contactera dans les 24 à 48 heures avec un programme sur mesure."
              : "Thank you. Our DMC team will contact you within 24-48 hours with a tailor-made program."}
          </p>
          <Button asChild className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
            <Link to={isFr ? "/fr" : "/"}>{isFr ? "Retour à l'accueil" : "Back to Home"}</Link>
          </Button>
        </div>
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
            <div className="md:col-span-1 space-y-6">
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

            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 md:p-8">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4" role="alert" aria-live="polite">{error}</div>
                )}
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
                  if (!brief.trim()) { setError(isFr ? "La description de la demande est requise" : "Request / brief is required"); return; }
                  createQuote.mutate({
                    email,
                    agencyName: agency,
                    contactPerson: name,
                    whatsapp,
                    dates,
                    numberOfPax: pax ? Number.parseInt(pax, 10) : undefined,
                    preferredCircuit: tourContext?.preferredCircuit,
                    specialRequests: brief,
                  });
                }} className="space-y-5">
                  <h2 className="font-serif text-xl font-bold text-[#1F2937] mb-4">
                    {isFr ? "Votre projet" : "Your project"}
                  </h2>

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

                  {isInvalidTourContext && (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="status">
                      {isFr
                        ? "Le programme sélectionné n'est pas disponible. Vous pouvez toujours envoyer une demande sur mesure."
                        : "The selected programme is unavailable. You can still send a custom request."}
                    </p>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agency-name">{isFr ? "Nom de l'agence" : "Agency Name"}</Label>
                      <Input id="agency-name" name="agencyName" autoComplete="organization" className="mt-1" value={agency} onChange={(e) => setAgency(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="contact-person">{isFr ? "Personne à contacter" : "Contact Person"} *</Label>
                      <Input id="contact-person" name="contactPerson" autoComplete="name" required className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quote-email">Email *</Label>
                      <Input id="quote-email" name="email" autoComplete="email" type="email" required className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="quote-whatsapp">WhatsApp</Label>
                      <Input id="quote-whatsapp" name="whatsapp" autoComplete="tel" inputMode="tel" className="mt-1" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferred-dates">{isFr ? "Dates souhaitées" : "Preferred Dates"}</Label>
                      <Input id="preferred-dates" name="dates" className="mt-1" value={dates} onChange={(e) => setDates(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="number-of-pax">{isFr ? "Nombre de voyageurs" : "Number of Pax"}</Label>
                      <Input id="number-of-pax" name="numberOfPax" type="number" min={1} className="mt-1" value={pax} onChange={(e) => setPax(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quote-brief">{isFr ? "Parlez-nous de votre demande" : "Tell us about your request"} *</Label>
                    <Textarea
                      id="quote-brief"
                      name="brief"
                      required
                      className="mt-1"
                      rows={6}
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      placeholder={isFr
                        ? "Dates, destinations, nombre de voyageurs, niveau d'hôtel, budget, services souhaités ou tout détail utile..."
                        : "Dates, destinations, number of travelers, hotel level, budget, services needed, or any useful details..."}
                    />
                  </div>

                  <Button type="submit" disabled={createQuote.isPending || isTourContextPending} className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full disabled:opacity-50">
                    <Send className="mr-2 h-4 w-4" />
                    {isTourContextPending
                      ? (isFr ? "Vérification du programme..." : "Checking programme...")
                      : createQuote.isPending
                      ? (isFr ? "Envoi en cours..." : "Sending...")
                      : (isFr ? "Envoyer la demande" : "Send Request")
                    }
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
