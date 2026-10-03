import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import {
  buildFrenchCommercialSchemas,
  frenchCommercialPages,
  type FrenchCommercialPageKey,
} from "@/lib/french-commercial-content";

export default function FrenchCommercialLanding({ pageKey }: { pageKey: FrenchCommercialPageKey }) {
  const page = frenchCommercialPages[pageKey];
  const schemas = buildFrenchCommercialSchemas(page);

  return (
    <>
      <SEO />
      {schemas.map((schema) => <StructuredData key={schema.id} id={schema.id} value={schema.value} />)}

      <section className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold tracking-wide uppercase text-[#E8A0A0]">{page.eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl font-bold leading-tight">{page.h1}</h1>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl leading-relaxed">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                <Link to="/fr/quote">Demander des tarifs nets B2B</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 rounded-full px-6">
                <Link to="/fr/services">Voir nos services au Maroc</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F9F7F4] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                <p className="text-sm font-semibold text-[#A91D2D]">Morocco Incoming by Suenos Travel</p>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">
                  Partenaire local agréé pour vos programmes au Maroc
                </h2>
                <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-[#374151]">
                  {["Agence de voyages agréée ODV-0564", "IATA 54273844", "Équipe à Agadir et Casablanca", "Services réceptifs B2B et MICE"].map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-xl bg-[#F9F7F4] px-4 py-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A91D2D]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">{page.whyTitle}</h2>
                <p className="mt-4 text-[#4B5563] leading-relaxed">{page.whyText}</p>
              </div>

              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">{page.servicesTitle}</h2>
                <div className="mt-6 grid sm:grid-cols-2 gap-5">
                  {page.services.map((service) => (
                    <div key={service} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-[#A91D2D]" />
                      <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">{service}</p>
                    </div>
                  ))}
                </div>
              </div>

              {page.groups.map((group) => (
                <div key={group.title} className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">{group.title}</h2>
                  <p className="mt-4 text-[#4B5563] leading-relaxed">{group.intro}</p>
                  <div className="mt-6 grid sm:grid-cols-2 gap-5">
                    {group.items.map((item) => (
                      <div key={item.title} className="rounded-2xl border border-gray-100 bg-[#F9F7F4] p-5">
                        <h3 className="font-semibold text-[#1F2937]">{item.title}</h3>
                        <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">{page.processTitle}</h2>
                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  {page.processSteps.map((step, index) => (
                    <div key={step} className="rounded-2xl border border-gray-100 bg-[#F9F7F4] p-5">
                      <p className="text-xs font-semibold text-[#A91D2D]">Étape {index + 1}</p>
                      <h3 className="mt-2 font-semibold text-[#1F2937]">{step}</h3>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-7 md:p-8 border border-gray-100 shadow-sm">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">Questions fréquentes</h2>
                <div className="mt-6 space-y-5">
                  {page.faq.map((item) => (
                    <div key={item.question}>
                      <h3 className="font-semibold text-[#1F2937]">{item.question}</h3>
                      <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:sticky lg:top-24">
                <h2 className="font-serif text-2xl font-bold text-[#1F2937]">Préparons votre demande</h2>
                <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">
                  Indiquez les dates, le nombre de participants, le parcours souhaité et le niveau de service recherché.
                </p>
                <Button asChild className="mt-6 w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
                  <Link to="/fr/quote">Demander une proposition</Link>
                </Button>
                <Link to="/fr" className="mt-4 block text-center text-sm text-[#A91D2D] hover:underline">
                  Retour à l'accueil
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
