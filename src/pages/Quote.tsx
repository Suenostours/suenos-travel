import { useState } from "react";
import { useI18n } from "@/providers/i18n";
import { Helmet } from "react-helmet-async";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Quote() {
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Helmet>
        <title>Request a Quote | Suenos Travel DMC Morocco</title>
        <meta name="description" content="Request a customized quote for your Morocco tour, MICE event, or B2B partnership with Suenos Travel DMC." />
      </Helmet>

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">
              {isFr ? "Demander un Devis" : "Request a Quote"}
            </h1>
            <p className="mt-4 text-[#4B5563]">
              {isFr
                ? "Remplissez le formulaire ci-dessous et nous vous enverrons un devis personnalisé sous 24-48 heures."
                : "Fill out the form below and we'll send you a customized quote within 24-48 hours."}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg text-[#1F2937] mb-2">
                  {isFr ? "Demande envoyée !" : "Quote Request Sent!"}
                </h3>
                <p className="text-[#4B5563]">
                  {isFr ? "Nous vous contacterons sous 24-48 heures avec un devis détaillé." : "We will contact you within 24-48 hours with a detailed quote."}
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                <h2 className="font-serif text-xl font-bold text-[#1F2937] mb-4">
                  {isFr ? "Informations" : "Information"}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{isFr ? "Nom de l'agence" : "Agency Name"}</Label>
                    <Input className="mt-1" />
                  </div>
                  <div>
                    <Label>{isFr ? "Personne de contact" : "Contact Person"} *</Label>
                    <Input required className="mt-1" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" required className="mt-1" />
                  </div>
                  <div>
                    <Label>WhatsApp</Label>
                    <Input className="mt-1" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{isFr ? "Pays" : "Country"}</Label>
                    <Input className="mt-1" />
                  </div>
                  <div>
                    <Label>{isFr ? "Type de voyage" : "Travel Type"}</Label>
                    <Input className="mt-1" placeholder={isFr ? "Tour privé, groupe, MICE..." : "Private tour, group, MICE..."} />
                  </div>
                </div>

                <h2 className="font-serif text-xl font-bold text-[#1F2937] pt-4">
                  {isFr ? "Détails du voyage" : "Trip Details"}
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{isFr ? "Dates prévues" : "Travel Dates"}</Label>
                    <Input className="mt-1" placeholder={isFr ? "Ex: 15-22 Mars 2026" : "Ex: March 15-22, 2026"} />
                  </div>
                  <div>
                    <Label>{isFr ? "Durée" : "Duration"}</Label>
                    <Input className="mt-1" placeholder={isFr ? "Ex: 7 jours" : "Ex: 7 days"} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label>{isFr ? "Adultes" : "Adults"}</Label>
                    <Input type="number" className="mt-1" />
                  </div>
                  <div>
                    <Label>{isFr ? "Enfants" : "Children"}</Label>
                    <Input type="number" className="mt-1" />
                  </div>
                  <div>
                    <Label>{isFr ? "Budget" : "Budget"}</Label>
                    <Input className="mt-1" placeholder={isFr ? "Par personne" : "Per person"} />
                  </div>
                </div>

                <div>
                  <Label>{isFr ? "Destinations souhaitées" : "Preferred Destinations"}</Label>
                  <Input className="mt-1" placeholder={isFr ? "Ex: Marrakech, Fès, Sahara" : "Ex: Marrakech, Fes, Sahara"} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{isFr ? "Catégorie hôtel" : "Hotel Category"}</Label>
                    <Input className="mt-1" placeholder={isFr ? "3*, 4*, 5*, riad..." : "3*, 4*, 5*, riad..."} />
                  </div>
                  <div>
                    <Label>{isFr ? "Langue guide" : "Guide Language"}</Label>
                    <Input className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label>{isFr ? "Demandes spéciales" : "Special Requests"}</Label>
                  <Textarea className="mt-1" rows={4} placeholder={isFr ? "Activités spécifiques, restrictions alimentaires, accessibilité..." : "Specific activities, dietary restrictions, accessibility..."} />
                </div>

                <Button type="submit" className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full py-3 h-auto">
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
