import { Link } from "react-router";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildQuoteWhatsAppUrl } from "@/lib/quote-request";
import { WHATSAPP_URL } from "@/lib/contact-details";
import { trackLeadEvent } from "@/lib/tracking";

export default function QuoteConfirmation({ locale, reference }: { locale: "en" | "fr"; reference?: string }) {
  const isFr = locale === "fr";
  return (
    <div className="mx-auto max-w-lg px-4 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h1 tabIndex={-1} ref={(node) => node?.focus()} className="mb-4 font-serif text-2xl font-bold text-[#1F2937]">
        {isFr ? "Votre demande est enregistrée !" : "Your request is saved!"}
      </h1>
      {reference && <p className="mb-4 text-sm font-semibold text-[#A91D2D]">{isFr ? "Référence" : "Reference"} : {reference}</p>}
      <p className="mb-6 text-[#6B7280]">
        {isFr ? "Merci. Notre équipe DMC examinera votre projet et vous contactera sous 24–48h pour préparer votre proposition. Vous n’avez pas besoin de renvoyer le formulaire." : "Thank you. Our DMC team will review your project and contact you within 24–48 hours to prepare your proposal. You do not need to submit the form again."}
      </p>
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-[#1F2937]">{isFr ? "Vous préférez continuer sur WhatsApp ?" : "Prefer to continue on WhatsApp?"}</h2>
        <Button type="button" onClick={() => {
          // Keep the request reference out of automatic outbound-link analytics.
          window.open(buildQuoteWhatsAppUrl(reference, locale), "_blank", "noopener,noreferrer");
          trackLeadEvent("whatsapp_click", { link_url: WHATSAPP_URL, page_path: locale === "fr" ? "/fr/quote" : "/quote" });
        }} className="h-auto min-h-11 w-full whitespace-normal rounded-full bg-[#166534] px-4 py-3 text-white hover:bg-[#14532d]">
          <MessageCircle className="mr-2 h-4 w-4 shrink-0" />
          {isFr ? "Continuer sur WhatsApp" : "Continue on WhatsApp"}
        </Button>
        <p className="mt-3 text-xs leading-relaxed text-[#6B7280]">{isFr ? "Facultatif : ouvre WhatsApp avec un court message que vous pouvez modifier. Seule la référence est préremplie, pas vos coordonnées ni votre brief. Vous choisissez ensuite de l’envoyer." : "Optional: opens WhatsApp with a short message you can edit. Only the reference is prefilled, not your contact details or private brief. You choose whether to send it."}</p>
      </div>
      <Link to={isFr ? "/fr" : "/"} className="mt-6 inline-block text-sm font-medium text-[#A91D2D] underline underline-offset-4">{isFr ? "Retour à l’accueil" : "Back to Home"}</Link>
    </div>
  );
}
