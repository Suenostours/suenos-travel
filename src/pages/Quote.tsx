import { useState } from "react";
import { useI18n } from "@/providers/i18n";
import { trpc } from "@/providers/trpc";
import SEO from "@/components/SEO";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Quote() {
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [agency, setAgency] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [travelType, setTravelType] = useState("");
  const [dates, setDates] = useState("");
  const [duration, setDuration] = useState("");
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  const [destinations, setDestinations] = useState("");
  const [circuit, setCircuit] = useState("");
  const [hotel, setHotel] = useState("");
  const [transport, setTransport] = useState("");
  const [guide, setGuide] = useState("");
  const [budget, setBudget] = useState("");
  const [requests, setRequests] = useState("");

  const createQuote = trpc.forms.createQuote.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message),
  });

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F8F7F4] pt-24 pb-16 flex items-center justify-center">
        <SEO
          title="Request a Morocco DMC Quote | B2B Tours, Groups & MICE"
          description="Request a custom Morocco travel quote for agencies, groups, private tours, MICE and incentives with Suenos Travel DMC."
          canonical="/quote"
          image="/images/hero-desert.jpg"
        />
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
              : "Thank you. Our DMC team will contact you within 24–48 hours with a tailor-made program."}
          </p>
          <Button onClick={() => window.location.href = "/"} className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
            {isFr ? "Retour à l'accueil" : "Back to Home"}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <SEO
        title="Request a Morocco DMC Quote | B2B Tours, Groups & MICE"
        description="Request a custom Morocco travel quote for agencies, groups, private tours, MICE and incentives with Suenos Travel DMC."
        canonical="/quote"
        image="/images/hero-desert.jpg"
      />

      <section className="bg-gradient-to-br from-[#A91D2D] to-[#1F2937] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            {isFr ? "Demander un devis" : "Request a Quote"}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {isFr ? "Décrivez votre projet et nous vous enverrons un programme personnalisé sous 24h." : "Describe your project and we will send you a tailor-made program within 24 hours."}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                <h3 className="font-serif text-lg font-bold text-[#1F2937] mb-4">{isFr ? "Pourquoi nous ?" : "Why us?"}</h3>
                <ul className="space-y-3 text-sm text-[#6B7280]">
                  <li>{isFr ? "Devis gratuit sous 24h" : "Free quote within 24h"}</li>
                  <li>{isFr ? "Programmes sur mesure" : "Tailor-made programs"}</li>
                  <li>{isFr ? "Tarifs nets pour agences" : "Net rates for agencies"}</li>
                  <li>{isFr ? "Support 24/7 sur place" : "24/7 on-site support"}</li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 md:p-8">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>
                )}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setError("");
                  if (!email.trim()) { setError(isFr ? "L'email est requis" : "Email is required"); return; }
                  createQuote.mutate({
                    email,
                    agencyName: agency,
                    contactPerson: name,
                    whatsapp,
                    country,
                    travelType,
                    dates,
                    duration,
                    adults: adults ? parseInt(adults) : undefined,
                    children: children ? parseInt(children) : undefined,
                    preferredDestinations: destinations,
                    preferredCircuit: circuit,
                    hotelCategory: hotel,
                    transportType: transport,
                    guideLanguage: guide,
                    budgetRange: budget,
                    specialRequests: requests,
                  });
                }} className="space-y-5">
                  <h2 className="font-serif text-xl font-bold text-[#1F2937] mb-4">
                    {isFr ? "Votre projet" : "Your project"}
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{isFr ? "Nom de l'agence" : "Agency Name"}</Label>
                      <Input required className="mt-1" value={agency} onChange={(e) => setAgency(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isFr ? "Personne à contacter" : "Contact Person"} *</Label>
                      <Input required className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Email *</Label>
                      <Input type="email" required className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <Input className="mt-1" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{isFr ? "Pays" : "Country"}</Label>
                      <Input className="mt-1" value={country} onChange={(e) => setCountry(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isFr ? "Type de voyage" : "Travel Type"}</Label>
                      <Input className="mt-1" value={travelType} onChange={(e) => setTravelType(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{isFr ? "Dates souhaitées" : "Preferred Dates"}</Label>
                      <Input className="mt-1" value={dates} onChange={(e) => setDates(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isFr ? "Durée" : "Duration"}</Label>
                      <Input className="mt-1" value={duration} onChange={(e) => setDuration(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{isFr ? "Nombre d'adultes" : "Number of Adults"}</Label>
                      <Input type="number" min={1} className="mt-1" value={adults} onChange={(e) => setAdults(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isFr ? "Nombre d'enfants" : "Number of Children"}</Label>
                      <Input type="number" min={0} className="mt-1" value={children} onChange={(e) => setChildren(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label>{isFr ? "Destinations souhaitées" : "Preferred Destinations"}</Label>
                    <Input className="mt-1" value={destinations} onChange={(e) => setDestinations(e.target.value)} />
                  </div>

                  <div>
                    <Label>{isFr ? "Circuit préféré" : "Preferred Circuit"}</Label>
                    <Input className="mt-1" value={circuit} onChange={(e) => setCircuit(e.target.value)} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{isFr ? "Catégorie d'hôtel" : "Hotel Category"}</Label>
                      <Input className="mt-1" value={hotel} onChange={(e) => setHotel(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isFr ? "Type de transport" : "Transport Type"}</Label>
                      <Input className="mt-1" value={transport} onChange={(e) => setTransport(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{isFr ? "Langue du guide" : "Guide Language"}</Label>
                      <Input className="mt-1" value={guide} onChange={(e) => setGuide(e.target.value)} />
                    </div>
                    <div>
                      <Label>{isFr ? "Budget approximatif" : "Approximate Budget"}</Label>
                      <Input className="mt-1" value={budget} onChange={(e) => setBudget(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label>{isFr ? "Demandes spéciales" : "Special Requests"}</Label>
                    <Textarea className="mt-1" rows={5} value={requests} onChange={(e) => setRequests(e.target.value)} />
                  </div>

                  <Button type="submit" disabled={createQuote.isPending} className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full disabled:opacity-50">
                    <Send className="mr-2 h-4 w-4" />
                    {createQuote.isPending
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
