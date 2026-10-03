import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { Link } from "react-router";
import { Compass, Network, Landmark, Tent, Briefcase, Crown, Baby, Car, BedDouble, UserCheck, Mountain, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizedPath } from "@/lib/locale-routes";

const services = [
  { icon: Compass, title: "Tailor-Made Morocco Tours", titleFr: "Circuits au Maroc sur mesure", desc: "Custom-designed itineraries crafted to match your clients' preferences, pace, and interests. Every detail personalized.", descFr: "Des itinéraires conçus selon le profil de vos clients, leur rythme, leurs centres d'intérêt et le niveau de service recherché." },
  { icon: Network, title: "B2B Incoming Services", titleFr: "Services réceptifs B2B", desc: "Complete ground handling with competitive net rates and dedicated support for travel partners worldwide.", descFr: "Une prise en charge locale complète, des tarifs nets pour les agences et un interlocuteur dédié pour le suivi du programme." },
  { icon: Landmark, title: "Cultural & Imperial Cities", titleFr: "Culture et villes impériales", desc: "Expert-led guided circuits through Morocco's historic imperial cities and UNESCO World Heritage sites.", descFr: "Des circuits accompagnés dans les villes impériales, les médinas historiques et les principaux sites patrimoniaux du Maroc." },
  { icon: Tent, title: "Sahara Desert Experiences", titleFr: "Expériences dans le Sahara", desc: "Authentic desert camps, camel treks, and starlit nights in the Merzouga dunes.", descFr: "Des séjours en camp, des balades à dos de dromadaire et des étapes dans les dunes de Merzouga intégrées à un itinéraire réaliste." },
  { icon: Briefcase, title: "MICE & Corporate Travel", titleFr: "MICE et voyages d'entreprise", desc: "Professional planning for meetings, incentives, conferences, and corporate events across Morocco.", descFr: "Organisation de réunions, incentives, conférences, événements d'entreprise et déplacements de participants au Maroc." },
  { icon: Crown, title: "Luxury & Premium Travel", titleFr: "Voyages haut de gamme", desc: "VIP experiences, luxury riads, private guides, and exclusive access for discerning travelers.", descFr: "Riads et hôtels haut de gamme, transport privé, guides dédiés et expériences adaptées aux voyageurs exigeants." },
  { icon: Baby, title: "Family & Group Travel", titleFr: "Voyages en famille et en groupe", desc: "Safe, engaging, and well-paced programs designed for families and groups of all sizes.", descFr: "Des programmes équilibrés pour les familles et les groupes, adaptés à leur taille, à leur mobilité et au rythme souhaité." },
  { icon: Car, title: "Transport & Transfers", titleFr: "Transport et transferts", desc: "Airport pickups, private vehicles, and reliable transport across all Moroccan destinations.", descFr: "Accueil à l'aéroport, véhicules privés, autocars et transferts coordonnés entre les différentes étapes du voyage." },
  { icon: BedDouble, title: "Hotels & Riads", titleFr: "Hôtels et riads", desc: "Curated accommodation booking from boutique riads to international hotel chains at all categories.", descFr: "Sélection et réservation d'hébergements, des riads de charme aux hôtels de chaînes internationales, selon le cahier des charges." },
  { icon: UserCheck, title: "Guides & Local Experiences", titleFr: "Guides et expériences locales", desc: "Multilingual, licensed guides with deep cultural knowledge and storytelling expertise.", descFr: "Guides agréés et multilingues, visites culturelles et expériences locales choisies selon le public et les objectifs du séjour." },
  { icon: Mountain, title: "Sahara & Adventure", titleFr: "Sahara et aventure", desc: "Trekking, mountain expeditions, and outdoor adventures for thrill-seeking travelers.", descFr: "Randonnées, étapes en montagne et activités de plein air organisées selon le niveau et les attentes des participants." },
  { icon: Gift, title: "Incentive Travel", titleFr: "Voyages incentive", desc: "Reward programs and motivational trips that create lasting memories for teams and clients.", descFr: "Programmes de motivation associant hébergement, activités, restauration, transport et temps forts pour les équipes." },
];

export default function Services() {
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const pathFor = (path: string) => localizedPath(path, locale);

  return (
    <>
      <SEO />

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">
              {isFr ? "Nos services réceptifs au Maroc" : "Our Services"}
            </h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Services complets pour les agences de voyage, tour-opérateurs et clients corporate visitant le Maroc."
                : "Comprehensive services for travel agencies, tour operators, and corporate clients visiting Morocco."}
            </p>
            <p className="mt-3 text-sm text-[#6B7280] max-w-3xl mx-auto">
              {isFr ? (
                <>
                  Pour vos demandes B2B, consultez nos <Link to={pathFor("/circuits")} className="text-[#A91D2D] font-medium hover:underline">circuits au Maroc pour les agences</Link>, notre accompagnement <Link to={pathFor("/mice-morocco")} className="text-[#A91D2D] font-medium hover:underline">MICE au Maroc</Link> ou nos <Link to={pathFor("/incoming-agency-morocco")} className="text-[#A91D2D] font-medium hover:underline">services d'agence réceptive</Link>.
                </>
              ) : (
                <>
                  For B2B requests, explore our <Link to="/dmc-morocco" className="text-[#A91D2D] font-medium hover:underline">DMC Morocco</Link> support, <Link to="/incoming-agency-morocco" className="text-[#A91D2D] font-medium hover:underline">incoming agency Morocco</Link> services, <Link to="/morocco-tours-for-travel-agencies" className="text-[#A91D2D] font-medium hover:underline">Morocco tours for agencies</Link>, <Link to="/mice-morocco" className="text-[#A91D2D] font-medium hover:underline">MICE Morocco</Link> planning and <Link to="/b2b" className="text-[#A91D2D] font-medium hover:underline">Morocco B2B partner</Link> conditions.
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
              <Button asChild className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                <Link to={pathFor("/quote")}>
                  {isFr ? "Demander un devis" : "Request a Quote"}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                <Link to={isFr ? "/fr/quote" : "/contact"}>
                  {isFr ? "Nous contacter" : "Contact Us"}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                <Link to={isFr ? "/fr/incoming-agency-morocco" : "/b2b"}>
                  {isFr ? "Services partenaires B2B" : "B2B Partnership"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
