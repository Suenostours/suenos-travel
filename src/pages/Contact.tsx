import { useState } from "react";
import { useI18n } from "@/providers/i18n";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { trpc } from "@/providers/trpc";
import { Helmet } from "react-helmet-async";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const { locale, t } = useI18n();
  const isFr = locale === "fr";
  const { email, phone, addressAgadir, addressCasablanca, license, iata } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const createContact = trpc.forms.createContact.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message),
  });

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F8F7F4] pt-24 pb-16 flex items-center justify-center">
        <Helmet>
          <title>{isFr ? "Message envoyé" : "Message Sent"} | Suenos Travel</title>
        </Helmet>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">
            {isFr ? "Message envoyé !" : "Message Sent!"}
          </h1>
          <p className="text-[#6B7280] mb-8">
            {isFr
              ? "Merci de nous avoir contactés. Notre équipe DMC vous répondra dans les plus brefs délais."
              : "Thank you for contacting us. Our DMC team will reply as soon as possible."}
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
        <title>{isFr ? "Contact" : "Contact"} | Suenos Travel DMC</title>
        <meta name="description" content={isFr ? "Contactez Suenos Travel DMC Maroc." : "Contact Suenos Travel DMC Morocco."} />
      </Helmet>

      <section className="bg-gradient-to-br from-[#A91D2D] to-[#1F2937] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            {isFr ? "Contactez-nous" : "Contact Us"}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {isFr
              ? "Notre équipe DMC est à votre disposition pour toute demande."
              : "Our DMC team is at your disposal for any request."}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#A91D2D] mt-0.5" />
                  <div>
                    <p className="font-medium text-[#1F2937] text-sm">{isFr ? "Agadir" : "Agadir"}</p>
                    <p className="text-sm text-[#6B7280]">{addressAgadir}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#A91D2D] mt-0.5" />
                  <div>
                    <p className="font-medium text-[#1F2937] text-sm">{isFr ? "Casablanca" : "Casablanca"}</p>
                    <p className="text-sm text-[#6B7280]">{addressCasablanca}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#A91D2D]" />
                  <p className="text-sm text-[#6B7280]">{phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#A91D2D]" />
                  <p className="text-sm text-[#6B7280]">{email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-[#A91D2D]" />
                  <p className="text-sm text-[#6B7280]">License: {license} | IATA: {iata}</p>
                </div>
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
                  if (!name.trim()) { setError(isFr ? "Le nom est requis" : "Name is required"); return; }
                  if (!formEmail.trim()) { setError(isFr ? "L'email est requis" : "Email is required"); return; }
                  if (!message.trim()) { setError(isFr ? "Le message est requis" : "Message is required"); return; }
                  createContact.mutate({ name, email: formEmail, phone: formPhone, subject, message });
                }} className="space-y-5">
                  <h2 className="font-serif text-xl font-bold text-[#1F2937] mb-4">
                    {isFr ? "Envoyez-nous un message" : "Send us a message"}
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{t("form.name")} *</Label>
                      <Input required className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <Label>{t("form.email")} *</Label>
                      <Input type="email" required className="mt-1" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label>{t("form.phone")}</Label>
                    <Input className="mt-1" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                  </div>

                  <div>
                    <Label>{isFr ? "Sujet" : "Subject"}</Label>
                    <Input className="mt-1" value={subject} onChange={(e) => setSubject(e.target.value)} />
                  </div>

                  <div>
                    <Label>{t("form.message")} *</Label>
                    <Textarea required className="mt-1" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>

                  <Button type="submit" disabled={createContact.isPending} className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full disabled:opacity-50">
                    <Send className="mr-2 h-4 w-4" />
                    {createContact.isPending
                      ? (isFr ? "Envoi en cours..." : "Sending...")
                      : t("form.submit")
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
