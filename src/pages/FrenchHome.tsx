import { ArrowRight, Briefcase, Bus, CheckCircle2, Compass, Hotel, MapPin, Shield, UserCheck } from "lucide-react";
import { Link } from "react-router";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { PRIMARY_PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/contact-details";

const services = [
  { icon: Compass, title: "Programmes sur mesure", description: "Circuits et séjours construits selon la durée, le marché, le budget et le rythme de vos clients." },
  { icon: Hotel, title: "Hôtels et riads", description: "Sélection d'hébergements selon la catégorie, la localisation, la pension et la configuration du groupe." },
  { icon: Bus, title: "Transport et transferts", description: "Véhicules privés, autocars, chauffeurs et mouvements coordonnés entre les étapes du programme." },
  { icon: UserCheck, title: "Guides et visites", description: "Guides agréés, accompagnement multilingue, visites culturelles et expériences locales." },
  { icon: Briefcase, title: "MICE et incentives", description: "Hôtels, lieux, transport des participants, activités, dîners et coordination locale." },
  { icon: MapPin, title: "Suivi sur place", description: "Coordination des prestations confirmées et interlocuteur local pendant l'opération." },
];

const pathways = [
  {
    title: "Agence réceptive au Maroc",
    description: "Confiez-nous le programme, les réservations et la coordination locale de vos dossiers.",
    path: "/fr/incoming-agency-morocco",
  },
  {
    title: "Circuits pour agences de voyage",
    description: "Découvrez comment nous construisons des itinéraires B2B adaptés à votre marché.",
    path: "/fr/morocco-tours-for-travel-agencies",
  },
  {
    title: "MICE au Maroc",
    description: "Préparez un incentive, un séminaire ou un groupe corporate avec un partenaire local.",
    path: "/fr/mice-morocco",
  },
];

export default function FrenchHome() {
  return (
    <>
      <SEO />

      <section className="relative bg-[#F9F7F4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B7280]">
                Suenos Travel Incoming Morocco
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-[1.15]">
                Votre <span className="text-[#A91D2D]">partenaire réceptif B2B</span> au Maroc
              </h1>
              <p className="text-lg text-[#4B5563] max-w-xl leading-relaxed">
                Programmes sur mesure et services locaux pour agences de voyage, tour-opérateurs, groupes, organisateurs MICE et entreprises.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-[#A91D2D] hover:bg-[#8a1824] text-white px-6 py-3 rounded-full text-sm font-medium h-auto">
                  <Link to="/fr/quote">Demander une proposition <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6 py-3 h-auto">
                  <Link to="/fr/services">Découvrir nos services</Link>
                </Button>
              </div>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#A91D2D] hover:underline">
                WhatsApp {PRIMARY_PHONE_DISPLAY}
              </a>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src="/images/hero-desert.jpg" alt="Circuit dans le désert marocain" width={1344} height={768} fetchPriority="high" decoding="async" className="w-full h-[400px] md:h-[500px] object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-2 md:-left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
                <Shield className="h-5 w-5 text-[#A91D2D]" />
                <div>
                  <p className="text-xs text-[#6B7280]">Agence de voyages agréée</p>
                  <p className="text-sm font-semibold text-[#1F2937]">ODV-0564 · IATA 54273844</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center md:justify-between gap-5 text-sm text-[#4B5563]">
            {["Équipe à Agadir et Casablanca", "Services B2B", "Programmes sur mesure", "Support multilingue"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A91D2D]" />{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F9F7F4] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">Commencez par votre besoin au Maroc</h2>
            <p className="mt-4 text-[#4B5563]">Des pages dédiées présentent nos principaux services pour les partenaires professionnels.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {pathways.map((item) => (
              <Link key={item.path} to={item.path} className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm hover:border-[#A91D2D]/40 transition-colors">
                <h3 className="font-serif text-xl font-bold text-[#1F2937]">{item.title}</h3>
                <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">{item.description}</p>
                <span className="mt-5 inline-flex items-center text-sm font-medium text-[#A91D2D]">En savoir plus <ArrowRight className="ml-2 h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">Services locaux pour vos programmes</h2>
            <p className="mt-4 text-[#4B5563]">Nous réunissons les prestations nécessaires dans une proposition adaptée au brief de votre agence ou entreprise.</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item) => (
              <div key={item.title} className="rounded-2xl bg-[#F9F7F4] p-6 border border-gray-100">
                <item.icon className="h-6 w-6 text-[#A91D2D]" />
                <h3 className="mt-4 font-semibold text-lg text-[#1F2937]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F9F7F4] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">Comment nous préparons votre programme</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {["Vous partagez le brief", "Nous proposons le programme", "Nous ajustons les prestations", "Nous coordonnons l'opération"].map((step, index) => (
              <div key={step} className="rounded-2xl bg-white p-5 border border-gray-100">
                <span className="text-xs font-semibold text-[#A91D2D]">Étape {index + 1}</span>
                <h3 className="mt-2 font-semibold text-[#1F2937]">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0F172A] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Construisons votre programme au Maroc</h2>
          <p className="mt-4 text-gray-300">Partagez les dates, le nombre de voyageurs et les prestations recherchées pour recevoir une proposition adaptée.</p>
          <Button asChild className="mt-7 bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-7">
            <Link to="/fr/quote">Envoyer votre demande</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
