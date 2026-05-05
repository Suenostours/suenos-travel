import { useI18n } from "@/providers/i18n";
import { Helmet } from "react-helmet-async";
import { Compass, Network, Landmark, Tent, Briefcase, Crown, Baby, Car, BedDouble, UserCheck, Mountain, Gift } from "lucide-react";

const services = [
  { icon: Compass, title: "Tailor-Made Morocco Tours", titleFr: "Circuits Sur Mesure", desc: "Custom-designed itineraries crafted to match your clients' preferences, pace, and interests. Every detail personalized.", descFr: "Itinéraires conçus sur mesure pour correspondre aux préférences, au rythme et aux intérêts de vos clients." },
  { icon: Network, title: "B2B Incoming Services", titleFr: "Services B2B", desc: "Complete ground handling with competitive net rates and dedicated support for travel partners worldwide.", descFr: "Prestation au sol complète avec tarifs nets compétitifs et support dédié pour les partenaires." },
  { icon: Landmark, title: "Cultural & Imperial Cities", titleFr: "Villes Culturelles", desc: "Expert-led guided circuits through Morocco's historic imperial cities and UNESCO World Heritage sites.", descFr: "Circuits guidés par des experts à travers les villes impériales historiques et les sites UNESCO." },
  { icon: Tent, title: "Sahara Desert Experiences", titleFr: "Expériences Sahara", desc: "Authentic desert camps, camel treks, and starlit nights in the Merzouga dunes. Unforgettable memories guaranteed.", descFr: "Camps désert authentiques, treks chameau et nuits étoilées dans les dunes de Merzouga." },
  { icon: Briefcase, title: "MICE & Corporate Travel", titleFr: "MICE & Corporate", desc: "Professional planning for meetings, incentives, conferences, and corporate events across Morocco.", descFr: "Planification professionnelle pour réunions, incentives, conférences et événements corporate." },
  { icon: Crown, title: "Luxury & Premium Travel", titleFr: "Voyages de Luxe", desc: "VIP experiences, luxury riads, private guides, and exclusive access for discerning travelers.", descFr: "Expériences VIP, riads de luxe, guides privés et accès exclusif pour voyageurs exigeants." },
  { icon: Baby, title: "Family & Group Travel", titleFr: "Voyages Famille & Groupes", desc: "Safe, engaging, and well-paced programs designed for families and groups of all sizes.", descFr: "Programmes sûrs, captivants et bien rythmés conçus pour familles et groupes de toutes tailles." },
  { icon: Car, title: "Transport & Transfers", titleFr: "Transport & Transferts", desc: "Airport pickups, private vehicles, and reliable transport across all Moroccan destinations.", descFr: "Prise en charge aéroport, véhicules privés et transport fiable dans toutes les destinations." },
  { icon: BedDouble, title: "Hotels & Riads", titleFr: "Hôtels & Riads", desc: "Curated accommodation booking from boutique riads to international hotel chains at all categories.", descFr: "Réservation d'hébergements sélectionnés de riads boutique aux chaînes hôtelières internationales." },
  { icon: UserCheck, title: "Guides & Local Experiences", titleFr: "Guides & Expériences", desc: "Multilingual, licensed guides with deep cultural knowledge and storytelling expertise.", descFr: "Guides multilingues agréés avec une connaissance culturelle profonde et expertise narrative." },
  { icon: Mountain, title: "Sahara & Adventure", titleFr: "Aventure & Sahara", desc: "Trekking, mountain expeditions, and outdoor adventures for thrill-seeking travelers.", descFr: "Trekking, expéditions en montagne et aventures outdoor pour voyageurs en quête de sensations." },
  { icon: Gift, title: "Incentive Travel", titleFr: "Voyages d'Incentive", desc: "Reward programs and motivational trips that create lasting memories for teams and clients.", descFr: "Programmes de récompense et voyages motivationnels créant des souvenirs durables." },
];

export default function Services() {
  const { locale } = useI18n();
  const isFr = locale === "fr";

  return (
    <>
      <Helmet>
        <title>Our Services | Suenos Travel DMC Morocco</title>
        <meta name="description" content="Comprehensive DMC services in Morocco: tailor-made tours, B2B services, MICE, luxury travel, desert experiences, and more." />
      </Helmet>

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">Our Services</h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Services complets pour les agences de voyage, tour-opérateurs et clients corporate visitant le Maroc."
                : "Comprehensive services for travel agencies, tour operators, and corporate clients visiting Morocco."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#A91D2D]/10 flex items-center justify-center mb-5">
                  <s.icon className="h-6 w-6 text-[#A91D2D]" />
                </div>
                <h3 className="font-semibold text-lg text-[#1F2937] mb-3">{isFr ? s.titleFr : s.title}</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{isFr ? s.descFr : s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
