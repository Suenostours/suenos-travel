import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { Building2, Users, Calendar, Mic, PartyPopper, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

const miceServices = [
  { icon: Building2, title: "Venue Sourcing", titleFr: "Recherche de Lieux", desc: "From palace riads to modern convention centers, we find the perfect venue for your event size and style.", descFr: "De riads-palais aux centres de convention modernes, nous trouvons le lieu parfait." },
  { icon: Users, title: "Delegate Management", titleFr: "Gestion des Délégués", desc: "Registration, accommodation, travel arrangements, and on-site coordination for all attendees.", descFr: "Inscription, hébergement, arrangements de voyage et coordination sur place." },
  { icon: Calendar, title: "Event Planning", titleFr: "Planification d'Événements", desc: "Full-service planning from concept to execution - theme design, scheduling, and logistics.", descFr: "Planification complète du concept à l'exécution - design thématique, planning et logistique." },
  { icon: Mic, title: "AV & Staging", titleFr: "Sonorisation & Scénographie", desc: "Professional audio-visual equipment, lighting, staging, and technical support.", descFr: "Équipement audiovisuel professionnel, éclairage, scénographie et support technique." },
  { icon: PartyPopper, title: "Gala & Entertainment", titleFr: "Gala & Divertissement", desc: "Themed gala dinners, live entertainment, DJs, and cultural performances.", descFr: "Dîners de gala thématiques, animations live, DJs et performances culturelles." },
  { icon: Bus, title: "Transport Logistics", titleFr: "Logistique Transport", desc: "Seamless airport transfers, shuttle services, and VIP transport for delegates.", descFr: "Transferts aéroport fluides, navettes et transport VIP pour les délégués." },
];

export default function MICE() {
  const { locale } = useI18n();
  const isFr = locale === "fr";

  return (
    <>
      <SEO
        title="MICE Morocco | Incentive Travel & Corporate Events DMC"
        description="Plan meetings, incentives, conferences, team building and corporate events in Morocco with a local DMC for agencies and companies."
        canonical="/mice"
        image="/images/circuit-luxury.jpg"
      />

      <section className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              {isFr ? "MICE & Voyage Corporate" : "MICE & Corporate Travel"}
            </h1>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              {isFr
                ? "Planification professionnelle d'événements corporate au Maroc : réunions, incentives, conférences et team building."
                : "Professional corporate event planning in Morocco: meetings, incentives, conferences, and team building."}
            </p>
            <p className="mt-3 text-sm text-gray-400 max-w-3xl mx-auto">
              {isFr ? (
                <>
                  Pour une operation complete, combinez notre support <Link to="/services" className="text-[#E8A0A0] font-medium hover:underline">DMC Maroc</Link> avec des <Link to="/circuits" className="text-[#E8A0A0] font-medium hover:underline">programmes groupes Maroc</Link> et conditions <Link to="/b2b" className="text-[#E8A0A0] font-medium hover:underline">partenaire B2B</Link>.
                </>
              ) : (
                <>
                  For complete operations, combine our <Link to="/mice-morocco" className="text-[#E8A0A0] font-medium hover:underline">MICE Morocco DMC</Link> support with <Link to="/morocco-group-tours" className="text-[#E8A0A0] font-medium hover:underline">Morocco group travel programs</Link>, <Link to="/dmc-morocco" className="text-[#E8A0A0] font-medium hover:underline">Morocco DMC services</Link> and <Link to="/b2b" className="text-[#E8A0A0] font-medium hover:underline">B2B partner</Link> conditions.
                </>
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {miceServices.map((s) => (
              <div key={s.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/20 flex items-center justify-center mb-4">
                  <s.icon className="h-5 w-5 text-[#E8A0A0]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{isFr ? s.titleFr : s.title}</h3>
                <p className="text-sm text-gray-400">{isFr ? s.descFr : s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#A91D2D]/10 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              {isFr ? "Organisez Votre Événement Corporate au Maroc" : "Plan Your Corporate Event in Morocco"}
            </h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              {isFr
                ? "De la première consultation à l'exécution sur place, nous gérons chaque aspect de votre événement corporate."
                : "From initial consultation to on-site execution, we handle every aspect of your corporate event."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/quote">
                <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-8">
                  {isFr ? "Demander un Devis" : "Request a Quote"}
                </Button>
              </Link>
              <a href="https://wa.me/212661925611" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">
                  WhatsApp
                </Button>
              </a>
              <Link to="/b2b">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">
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
