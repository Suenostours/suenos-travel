import { useState } from "react";
import { useI18n } from "@/providers/i18n";
import { Helmet } from "react-helmet-async";
import { Check, Globe, Handshake, DollarSign, Clock, Headphones, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function B2B() {
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Helmet>
        <title>B2B Partnership | Suenos Travel DMC Morocco</title>
        <meta name="description" content="Become a B2B partner with Suenos Travel. Net rates, dedicated support, and seamless Morocco ground services for travel agencies and tour operators." />
      </Helmet>

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">
              {isFr ? "Votre Partenaire Incoming au Maroc" : "Your Incoming Partner in Morocco"}
            </h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Rejoignez notre réseau de partenaires B2B et bénéficiez de tarifs nets compétitifs, d'un support dédié et d'une prestation au sol sans faille."
                : "Join our B2B partner network and benefit from competitive net rates, dedicated support, and seamless ground services."}
            </p>
          </div>

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              { icon: DollarSign, title: "Net Rates", titleFr: "Tarifs Nets", desc: "Competitive B2B pricing with transparent cost breakdowns.", descFr: "Tarifs B2B compétitifs avec répartition transparente des coûts." },
              { icon: Headphones, title: "Dedicated Support", titleFr: "Support Dédié", desc: "Personal account manager available throughout the planning process.", descFr: "Gestionnaire de compte personnel disponible tout au long du processus." },
              { icon: Clock, title: "Fast Quotes", titleFr: "Devis Rapides", desc: "Detailed quotations within 24-48 hours for any itinerary.", descFr: "Devis détaillés sous 24-48 heures pour tout itinéraire." },
              { icon: Globe, title: "Nationwide Coverage", titleFr: "Couverture Nationale", desc: "Full coverage from Tangier to Agadir, Sahara to the Atlantic.", descFr: "Couverture complète de Tanger à Agadir, du Sahara à l'Atlantique." },
              { icon: Handshake, title: "Flexible Terms", titleFr: "Conditions Flexibles", desc: "Flexible payment terms and cancellation policies for partners.", descFr: "Conditions de paiement flexibles et politiques d'annulation pour partenaires." },
              { icon: Check, title: "Quality Guarantee", titleFr: "Garantie Qualité", desc: "We stand behind every service we provide. Issues resolved immediately.", descFr: "Nous soutenons chaque service fourni. Problèmes résolus immédiatement." },
            ].map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/10 flex items-center justify-center mb-4">
                  <b.icon className="h-5 w-5 text-[#A91D2D]" />
                </div>
                <h3 className="font-semibold text-[#1F2937] mb-2">{isFr ? b.titleFr : b.title}</h3>
                <p className="text-sm text-[#4B5563]">{isFr ? b.descFr : b.desc}</p>
              </div>
            ))}
          </div>

          {/* Partner Form */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-6 text-center">
              {isFr ? "Devenir Partenaire" : "Become a Partner"}
            </h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg text-[#1F2937] mb-2">
                  {isFr ? "Demande envoyée !" : "Request Sent!"}
                </h3>
                <p className="text-[#4B5563]">
                  {isFr ? "Nous vous contacterons sous 24 heures." : "We will contact you within 24 hours."}
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{isFr ? "Nom de l'agence" : "Agency Name"} *</Label>
                    <Input required className="mt-1" />
                  </div>
                  <div>
                    <Label>{isFr ? "Pays" : "Country"}</Label>
                    <Input className="mt-1" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{isFr ? "Personne de contact" : "Contact Person"} *</Label>
                    <Input required className="mt-1" />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" required className="mt-1" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>WhatsApp</Label>
                    <Input className="mt-1" />
                  </div>
                  <div>
                    <Label>{isFr ? "Type d'activité" : "Business Type"}</Label>
                    <Input className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>{isFr ? "Volume attendu" : "Expected Volume"}</Label>
                  <Input className="mt-1" placeholder={isFr ? "Nombre de voyageurs/an estimé" : "Estimated travelers/year"} />
                </div>
                <div>
                  <Label>{isFr ? "Message" : "Message"}</Label>
                  <Textarea className="mt-1" rows={4} />
                </div>
                <Button type="submit" className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
                  <Send className="mr-2 h-4 w-4" />
                  {isFr ? "Envoyer la demande" : "Send Request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
