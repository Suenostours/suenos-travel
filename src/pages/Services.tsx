import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { Link } from "react-router";
import { Compass, Network, Landmark, Tent, Briefcase, Crown, Baby, Car, BedDouble, UserCheck, Mountain, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <SEO
        title="Morocco DMC Services for Agencies, Groups & MICE"
        description="Full-service Morocco DMC support for agencies and tour operators: ground handling, tailor-made tours, hotels, guides, transport, MICE and incentives."
        canonical="/services"
        image="/images/about-riad.jpg"
      />

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">Our Services</h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Services complets pour les agences de voyage, tour-opérateurs et clients corporate visitant le Maroc."
                : "Comprehensive services for travel agencies, tour operators, and corporate clients visiting Morocco."}
            </p>
            <p className="mt-3 text-sm text-[#6B7280] max-w-3xl mx-auto">
              {isFr ? (
                <>
                  Pour vos demandes B2B, consultez nos <Link to="/circuits" className="text-[#A91D2D] font-medium hover:underline">circuits Maroc pour agences</Link>, notre support <Link to="/mice" className="text-[#A91D2D] font-medium hover:underline">MICE au Maroc</Link> ou nos conditions <Link to="/b2b" className="text-[#A91D2D] font-medium hover:underline">partenaire B2B Maroc</Link>.
                </>
              ) : (
                <>
                  For B2B requests, explore our <Link to="/circuits" className="text-[#A91D2D] font-medium hover:underline">Morocco tours for agencies</Link>, <Link to="/mice" className="text-[#A91D2D] font-medium hover:underline">Morocco MICE planning</Link> and <Link to="/b2b" className="text-[#A91D2D] font-medium hover:underline">Morocco B2B partner</Link> conditions.
                </>
              )}
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

          <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8 md:p-10 text-center shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F2937]">
              {isFr ? "Besoin d'un support DMC fiable au Maroc ?" : "Need reliable DMC support in Morocco?"}
            </h2>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Envoyez-nous votre demande groupe et notre équipe locale préparera une proposition sur mesure avec des conditions adaptées aux agences."
                : "Send us your group request and our local team will prepare a tailor-made proposal with agency-friendly conditions."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/quote">
                <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                  {isFr ? "Demander un devis" : "Request a Quote"}
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                  {isFr ? "Nous contacter" : "Contact Us"}
                </Button>
              </Link>
              <Link to="/b2b">
                <Button variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                  {isFr ? "Partenariat B2B" : "B2B Partnership"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
