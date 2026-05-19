import { useState } from "react";
import { useI18n } from "@/providers/i18n";
import { trpc } from "@/providers/trpc";
import { Helmet } from "react-helmet-async";
import { Check, Globe, Handshake, DollarSign, Clock, Headphones, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function B2B() {
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [country, setCountry] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [expectedVolume, setExpectedVolume] = useState("");

  const createPartner = trpc.forms.createPartner.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message),
  });

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F8F7F4] pt-24 pb-16 flex items-center justify-center">
        <Helmet>
          <title>{isFr ? "Demande envoyée" : "Request Sent"} | Suenos Travel</title>
        </Helmet>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">
            {isFr ? "Demande de partenariat envoyée !" : "Partnership Request Sent!"}
          </h1>
          <p className="text-[#6B7280] mb-8">
            {isFr
              ? "Merci. Notre équipe DMC examinera votre demande et vous contactera rapidement."
              : "Thank you. Our DMC team will review your request and contact you shortly."}
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
      <Helmet>
        <title>{isFr ? "Devenir partenaire B2B" : "Become a B2B Partner"} | Suenos Travel DMC</title>
        <meta name="description" content={isFr ? "Devenez partenaire B2B avec Suenos Travel DMC Maroc." : "Become a B2B partner with Suenos Travel DMC Morocco."} />
      </Helmet>

      <section className="bg-gradient-to-br from-[#1F2937] to-[#A91D2D] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            {isFr ? "Devenir partenaire B2B" : "Become a B2B Partner"}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {isFr
              ? "Rejoignez notre réseau d'agences partenaires et bénéficiez de nos services DMC au Maroc."
              : "Join our partner agency network and benefit from our DMC services in Morocco."}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                <h3 className="font-serif text-lg font-bold text-[#1F2937] mb-4">{isFr ? "Avantages" : "Benefits"}</h3>
                <ul className="space-y-3 text-sm text-[#6B7280]">
                  <li className="flex items-center gap-2"><Globe className="h-4 w-4 text-[#A91D2D]" /> {isFr ? "Tarifs nets agences" : "Net agency rates"}</li>
                  <li className="flex items-center gap-2"><Handshake className="h-4 w-4 text-[#A91D2D]" /> {isFr ? "Support dédié" : "Dedicated support"}</li>
                  <li className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-[#A91D2D]" /> {isFr ? "Devis rapides" : "Fast quotations"}</li>
                  <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#A91D2D]" /> {isFr ? "Réponse 24-48h" : "24-48h response"}</li>
                  <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-[#A91D2D]" /> {isFr ? "Assistance 24/7" : "24/7 assistance"}</li>
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
                  if (!agencyName.trim()) { setError(isFr ? "Le nom de l'agence est requis" : "Agency name is required"); return; }
                  createPartner.mutate({ agencyName, country, contactPerson, email, whatsapp, businessType, expectedVolume });
                }} className="space-y-5">
                  <h2 className="font-serif text-xl font-bold text-[#1F2937] mb-4">
                    {isFr ? "Formulaire de partenariat" : "Partnership Form"}
                  </h2>

                  <div>
                    <Label>{isFr ? "Nom de l'agence" : "Agency Name"} *</Label>
                    <Input required className="mt-1" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
                  </div>

                  <div>
                    <Label>{isFr ? "Pays" : "Country"}</Label>
                    <Input className="mt-1" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>

                  <div>
                    <Label>{isFr ? "Personne à contacter" : "Contact Person"}</Label>
                    <Input className="mt-1" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
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

                  <div>
                    <Label>{isFr ? "Type d'activité" : "Business Type"}</Label>
                    <Input className="mt-1" value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
                  </div>

                  <div>
                    <Label>{isFr ? "Volume attendu" : "Expected Volume"}</Label>
                    <Input className="mt-1" value={expectedVolume} onChange={(e) => setExpectedVolume(e.target.value)} />
                  </div>

                  <Button type="submit" disabled={createPartner.isPending} className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full disabled:opacity-50">
                    <Send className="mr-2 h-4 w-4" />
                    {createPartner.isPending
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
