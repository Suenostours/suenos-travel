import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { Shield, MapPin, Users, Award, Globe, Heart } from "lucide-react";

export default function About() {
  const { locale } = useI18n();
  const isFr = locale === "fr";

  return (
    <>
      <SEO />

      <section className="bg-[#F9F7F4]">
        <div className="relative h-[300px] md:h-[400px]">
          <img src="/images/about-riad.jpg" alt={isFr ? "Intérieur d'un riad marocain" : "Traditional Moroccan riad interior"} width={1184} height={864} fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">
                {isFr ? "À Propos de Suenos Travel" : "About Suenos Travel"}
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-bold text-[#1F2937]">
                {isFr ? "Qui Nous Sommes" : "Who We Are"}
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                {isFr
                  ? "Suenos Travel est une agence de voyages marocaine agréée (ODV-0564), avec des équipes à Agadir et Casablanca. Notre activité réceptive accompagne les agences de voyage, tour-opérateurs, entreprises et organisateurs de groupes dans la préparation de programmes au Maroc."
                  : "Suenos Travel is a fully licensed Moroccan DMC based in Agadir and Casablanca. Since 2015, we have been helping international travel agencies, tour operators, and corporate groups discover authentic Morocco."}
              </p>
              <p className="text-[#4B5563] leading-relaxed">
                {isFr
                  ? "À partir du brief du partenaire, nous pouvons coordonner l'itinéraire, l'hébergement, le transport, les guides, les visites, les activités et les autres prestations retenues dans le devis. Les services proposés dépendent des dates, des disponibilités et des besoins du dossier."
                  : "We combine deep local expertise with international service standards to deliver seamless travel experiences. From the first inquiry to the final departure, we handle every detail."}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {(isFr
                  ? ["Sur mesure", "MICE", "B2B", "Sahara", "Haut de gamme", "Familles"]
                  : ["Tailor-Made", "MICE", "B2B", "Sahara", "Luxury", "Family"]
                ).map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white text-xs font-medium text-[#4B5563] border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src="/images/hero-desert.jpg" alt={isFr ? "Programme de voyage dans le désert marocain" : "Suenos Travel Morocco destination specialists"} width={1344} height={768} loading="lazy" decoding="async" className="w-full h-[350px] object-cover" />
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-[#1F2937]">
              {isFr ? "Nos Valeurs" : "Our Values"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Trust & Reliability", titleFr: "Agence agréée", desc: "Licensed agency (ODV-0564) with a proven track record of delivering on promises.", descFr: "Suenos Travel exerce comme agence de voyages marocaine agréée sous la licence ODV-0564." },
              { icon: Globe, title: "Local Expertise", titleFr: "Connaissance opérationnelle", desc: "Deep knowledge of Morocco's culture, hidden gems, and logistics.", descFr: "Des propositions qui tiennent compte des distances, de la saison, du rythme et du profil des voyageurs." },
              { icon: Heart, title: "Passion for Service", titleFr: "Suivi des prestations", desc: "We genuinely love what we do, and it shows in every trip we organize.", descFr: "Un interlocuteur local pour préparer et suivre les prestations confirmées dans le dossier." },
              { icon: Users, title: "B2B Partnership", titleFr: "Collaboration B2B", desc: "We view our clients as partners. Your success is our success.", descFr: "Des échanges avec l'agence partenaire pour ajuster le programme et ses inclusions." },
              { icon: Award, title: "Quality First", titleFr: "Sélection des prestations", desc: "From guides to hotels to transport, we never compromise on quality.", descFr: "Hôtels, transport, guides et activités proposés selon le cahier des charges et les disponibilités." },
              { icon: MapPin, title: "Nationwide Network", titleFr: "Programmes au Maroc", desc: "Strong local network covering every region of Morocco from north to south.", descFr: "Des itinéraires et prestations préparés selon les régions incluses dans le brief du partenaire." },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/10 flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5 text-[#A91D2D]" />
                </div>
                <h3 className="font-semibold text-[#1F2937] mb-2">{isFr ? v.titleFr : v.title}</h3>
                <p className="text-sm text-[#4B5563]">{isFr ? v.descFr : v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
