import { useState } from "react";
import { useI18n } from "@/providers/i18n";
import { Helmet } from "react-helmet-async";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const { locale, t } = useI18n();
  const isFr = locale === "fr";
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Helmet>
        <title>Contact Us | Suenos Travel DMC Morocco</title>
        <meta name="description" content="Contact Suenos Travel for Morocco DMC services, B2B partnerships, quotes, and inquiries." />
      </Helmet>

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">{t("nav.contact")}</h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Contactez-nous pour toute question sur nos services, partenariats ou demandes de devis."
                : "Reach out to us for any questions about our services, partnerships, or quote requests."}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#1F2937]">
                  {isFr ? "Nos Coordonnées" : "Contact Information"}
                </h2>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#A91D2D]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">Casablanca Office</p>
                      <p className="text-sm text-[#6B7280]">Philips Business Center 304 Bd Mohamed 5, 6e Etg Bur 602</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#A91D2D]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">Agadir Office</p>
                      <p className="text-sm text-[#6B7280]">Hay Salam Imm Elbssita, Av Ahaj Messoud El Wafkaoui & Av Abdellah Guenon, Bur n13 2eme Etg</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-[#A91D2D]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">+212 661 925 611</p>
                      <p className="text-sm text-[#6B7280]">Phone & WhatsApp</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-[#A91D2D]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">resa@suenos-travel.com</p>
                      <p className="text-sm text-[#6B7280]">Reservations & Sales</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/10 flex items-center justify-center shrink-0">
                      <Shield className="h-5 w-5 text-[#A91D2D]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">Licensed Agency ODV-0564</p>
                      <p className="text-sm text-[#6B7280]">IATA Member 54273844</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-[#A91D2D]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">Mon - Sat: 9:00 - 18:00</p>
                      <p className="text-sm text-[#6B7280]">Office Hours (GMT+1)</p>
                    </div>
                  </div>

                <a
                  href="https://wa.me/212661925611"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#A91D2D] hover:text-[#8a1824] font-medium"
                >
                  <MessageCircle className="h-4 w-4" />
                  {isFr ? "Chat WhatsApp" : "Chat on WhatsApp"}
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#1F2937] mb-2">{t("form.success")}</h3>
                  <p className="text-[#4B5563]">{isFr ? "Nous vous répondrons sous 24 heures." : "We will reply within 24 hours."}</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                  <h2 className="font-serif text-xl font-bold text-[#1F2937] mb-4">
                    {isFr ? "Envoyez-nous un message" : "Send us a message"}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{t("form.name")} *</Label>
                      <Input required className="mt-1" />
                    </div>
                    <div>
                      <Label>{t("form.email")} *</Label>
                      <Input type="email" required className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>{t("form.phone")}</Label>
                    <Input className="mt-1" />
                  </div>
                  <div>
                    <Label>{isFr ? "Sujet" : "Subject"}</Label>
                    <Input className="mt-1" />
                  </div>
                  <div>
                    <Label>{t("form.message")} *</Label>
                    <Textarea required className="mt-1" rows={5} />
                  </div>
                  <Button type="submit" className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
                    <Send className="mr-2 h-4 w-4" />
                    {t("form.submit")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
