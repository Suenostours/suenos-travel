import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import { trpc } from "@/providers/trpc";
import SEO from "@/components/SEO";
import {
  ArrowRight,
  Shield,
  MapPin,
  Users,
  Sparkles,
  Network,
  Compass,
  Landmark,
  Tent,
  Briefcase,
  Crown,
  Baby,
  Car,
  BedDouble,
  UserCheck,
  Mountain,
  Gift,
  Star,
  Check,
  Clock,
  Phone,
  MessageCircle,
  Send,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const servicesData = [
  { icon: Compass, title: "Tailor-Made Morocco Tours", desc: "Custom-designed itineraries crafted to match your clients' preferences, pace, and interests." },
  { icon: Network, title: "B2B Incoming Services", desc: "Complete ground handling with competitive net rates and dedicated support for travel partners." },
  { icon: Landmark, title: "Cultural & Imperial Cities", desc: "Expert-led guided circuits through Morocco's historic imperial cities and UNESCO sites." },
  { icon: Tent, title: "Sahara Desert Experiences", desc: "Authentic desert camps, camel treks, and starlit nights in the Merzouga dunes." },
  { icon: Briefcase, title: "MICE & Corporate Travel", desc: "Professional planning for meetings, incentives, conferences, and corporate events." },
  { icon: Crown, title: "Luxury & Premium Travel", desc: "VIP experiences, luxury riads, private guides, and exclusive access for discerning travelers." },
  { icon: Baby, title: "Family & Group Travel", desc: "Safe, engaging, and well-paced programs designed for families and groups of all sizes." },
  { icon: Car, title: "Transport & Transfers", desc: "Airport pickups, private vehicles, and reliable transport across all Moroccan destinations." },
  { icon: BedDouble, title: "Hotels & Riads", desc: "Curated accommodation booking from boutique riads to international hotel chains." },
  { icon: UserCheck, title: "Guides & Local Experiences", desc: "Multilingual, licensed guides with deep cultural knowledge and storytelling expertise." },
  { icon: Mountain, title: "Sahara & Adventure", desc: "Trekking, mountain expeditions, and outdoor adventures for thrill-seeking travelers." },
  { icon: Gift, title: "Incentive Travel", desc: "Reward programs and motivational trips that create lasting memories for teams and clients." },
];

const testimonials = [
  { name: "Sarah Mitchell", role: "Tour Operator, UK", text: "Suenos Travel has been our Morocco DMC for 3 years. Their attention to detail and local knowledge is unmatched. Every group comes back delighted." },
  { name: "Jean-Pierre Dubois", role: "Travel Agency Director, France", text: "A reliable partner who understands the B2B relationship. Competitive rates, excellent guides, and seamless logistics every time." },
  { name: "Maria Gonzalez", role: "MICE Planner, Spain", text: "We organized a 200-person corporate event in Marrakech. Suenos handled everything flawlessly from venue to transport to activities." },
];

const typeLabels: Record<string, string> = {
  private: "Comprehensive & Adventure",
  small_group: "Small Group",
  corporate: "Corporate",
  desert: "Desert",
  family: "Family",
  luxury: "Luxury & Wellness",
  cultural: "Cultural & Historical",
  adventure: "Adventure & Nature",
  short_break: "City & Nature",
  coast: "Coast",
  sports: "Sports",
  wellness: "Wellness",
  romantic: "Romantic & Luxury",
};

const typeColors: Record<string, string> = {
  private: "bg-teal-100 text-teal-800",
  small_group: "bg-indigo-100 text-indigo-800",
  corporate: "bg-slate-100 text-slate-800",
  desert: "bg-orange-100 text-orange-800",
  family: "bg-lime-100 text-lime-800",
  luxury: "bg-purple-100 text-purple-800",
  cultural: "bg-amber-100 text-amber-800",
  adventure: "bg-emerald-100 text-emerald-800",
  short_break: "bg-sky-100 text-sky-800",
  coast: "bg-cyan-100 text-cyan-800",
  sports: "bg-blue-100 text-blue-800",
  wellness: "bg-green-100 text-green-800",
  romantic: "bg-rose-100 text-rose-800",
};

function getTypeLabel(type: string) {
  return typeLabels[type] ?? type.replace(/_/g, " ");
}

export default function Home() {
  const { t, locale } = useI18n();
  const { data: featuredTours = [], isLoading: featuredToursLoading } = trpc.public.listTours.useQuery({ locale, featured: true });

  return (
    <>
      <SEO
        title="DMC Morocco | Morocco Incoming Agency for Travel Professionals"
        description="Suenos Travel is a Morocco DMC and incoming agency for tour operators, travel agencies and companies. Tailor-made tours, groups, MICE and incentives."
        canonical="/"
        image="/images/hero-desert.jpg"
      />

      {/* ─── HERO ─── */}
      <section className="relative bg-[#F9F7F4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B7280]">
                SUENOS TRAVEL INCOMING MOROCCO
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-[1.15]">
                Your Trusted{" "}
                <span className="text-[#A91D2D]">DMC</span> Partner in Morocco
              </h1>
              <p className="text-lg text-[#4B5563] max-w-lg leading-relaxed">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/quote">
                  <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white px-6 py-3 rounded-full text-sm font-medium h-auto">
                    {t("hero.cta.quote")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/circuits">
                  <Button variant="outline" className="border-[#1F2937] text-[#1F2937] hover:bg-[#1F2937] hover:text-white px-6 py-3 rounded-full text-sm font-medium h-auto">
                    {t("hero.cta.explore")}
                  </Button>
                </Link>
              </div>
              <a
                href="https://wa.me/212661925611"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#A91D2D] hover:text-[#8a1824] transition-colors"
              >
                <Phone className="h-4 w-4" />
                {t("hero.whatsapp")} +212 661 925 611
              </a>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-desert.jpg"
                  alt="Morocco Desert Camel Caravan"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
                <Shield className="h-5 w-5 text-[#A91D2D]" />
                <div>
                  <p className="text-xs text-[#6B7280]">Licensed Agency</p>
                  <p className="text-sm font-semibold text-[#1F2937]">ODV-0564</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center md:justify-between gap-6 md:gap-4">
            {[
              { icon: Shield, label: t("trust.licensed"), sub: "ODV-0564" },
              { icon: MapPin, label: t("trust.locations") },
              { icon: Users, label: t("trust.b2b") },
              { icon: Sparkles, label: t("trust.tailor") },
              { icon: Network, label: t("trust.network") },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-[#4B5563]">
                <item.icon className="h-5 w-5 text-[#A91D2D]" />
                <span className="font-medium">{item.label}</span>
                {item.sub && <span className="text-[#A91D2D] font-semibold">{item.sub}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/about-riad.jpg"
                alt="Traditional Moroccan Riad"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">
                {t("about.title")}
              </h2>
              <p className="text-[#4B5563] leading-relaxed">
                Based in Agadir and Casablanca, Suenos Travel is a fully licensed Moroccan DMC specializing in incoming tourism. We combine deep local expertise with international service standards to deliver seamless travel experiences for B2B partners worldwide.
              </p>
              <p className="text-[#4B5563] leading-relaxed">
                From tailor-made circuits to corporate events, desert expeditions to luxury escapes — we handle every detail on the ground so your clients enjoy Morocco to the fullest.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Tailor-Made", "MICE", "B2B", "Sahara", "Luxury", "Family"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#F9F7F4] text-xs font-medium text-[#4B5563] border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
              <Link to="/about">
                <Button variant="outline" className="mt-4 border-[#A91D2D] text-[#A91D2D] hover:bg-[#A91D2D] hover:text-white rounded-full px-6">
                  {t("about.cta")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="bg-[#F9F7F4] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">{t("services.title")}</h2>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              Comprehensive ground services for travel agencies, tour operators, and corporate clients visiting Morocco.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {servicesData.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-[#A91D2D]/10 flex items-center justify-center mb-4">
                  <s.icon className="h-5 w-5 text-[#A91D2D]" />
                </div>
                <h3 className="font-semibold text-[#1F2937] text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED CIRCUITS ─── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">{t("circuits.title")}</h2>
            <Link to="/circuits" className="hidden md:flex items-center gap-1 text-sm text-[#A91D2D] hover:text-[#8a1824] font-medium">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {featuredToursLoading && (
            <div className="text-center text-sm text-[#6B7280]">Loading featured tours...</div>
          )}

          {!featuredToursLoading && featuredTours.length === 0 && (
            <div className="bg-[#F9F7F4] rounded-2xl border border-gray-100 p-8 text-center text-[#4B5563] shadow-sm">
              No featured tours available yet.
            </div>
          )}

          {!featuredToursLoading && featuredTours.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map((tour) => (
                <div key={tour.slug} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                  <div className="relative h-56 overflow-hidden">
                    {tour.mainImage ? (
                      <img src={tour.mainImage} alt={tour.title ?? tour.slug} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-[#F3EDE8] flex items-center justify-center px-6 text-center text-sm text-[#6B7280]">
                        {tour.title ?? tour.slug}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeColors[tour.type] ?? "bg-gray-100 text-gray-700"}`}>
                        {getTypeLabel(tour.type)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg text-[#1F2937]">{tour.title ?? tour.slug}</h3>
                    {tour.duration && (
                      <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {tour.duration}</span>
                      </div>
                    )}
                    {tour.description && <p className="text-sm text-[#4B5563] line-clamp-2">{tour.description}</p>}
                    <Link to={`/circuits/${tour.slug}`}>
                      <Button variant="ghost" className="text-[#A91D2D] hover:text-[#8a1824] p-0 h-auto text-sm font-medium">
                        {t("circuits.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── MICE ─── */}
      <section className="bg-[#0F172A] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">{t("mice.title")}</h2>
              <p className="text-gray-400 leading-relaxed">
                From board meetings in Marrakech palaces to team-building in the Sahara, we deliver world-class corporate events tailored to your objectives.
              </p>
              <ul className="space-y-3">
                {["Venue sourcing & negotiation", "AV equipment & staging", "Team-building activities", "Gala dinners & entertainment", "Delegate management", "Transport logistics"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="h-4 w-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/mice">
                <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6 mt-4">
                  Explore MICE Services
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src="/images/circuit-luxury.jpg" alt="MICE Morocco" className="w-full h-[400px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── B2B PARTNERS ─── */}
      <section className="bg-[#F9F7F4] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
              <img src="/images/hero-desert.jpg" alt="B2B Partnership" className="w-full h-[400px] object-cover" />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">{t("b2b.title")}</h2>
              <p className="text-[#4B5563] leading-relaxed">
                We partner with travel agencies, tour operators, and DMCs worldwide to deliver exceptional Morocco experiences for their clients. Net rates, instant quotes, and dedicated account management.
              </p>
              <ul className="space-y-3">
                {["Competitive net rates", "Dedicated B2B support", "Instant quotations", "Flexible payment terms", "White-label options"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#4B5563]">
                    <Check className="h-4 w-4 text-[#A91D2D] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/b2b">
                  <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                    {t("b2b.cta")}
                  </Button>
                </Link>
                <Link to="/quote">
                  <Button variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                    Request a Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">{t("process.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: t("process.step1"), desc: "Share your client's needs, dates, group size, and preferences." },
              { step: "02", title: t("process.step2"), desc: "Our team designs a custom program with detailed day-by-day itinerary." },
              { step: "03", title: t("process.step3"), desc: "Review, adjust, and confirm with a simple booking process." },
              { step: "04", title: t("process.step4"), desc: "We execute on the ground with our professional local network." },
            ].map((p) => (
              <div key={p.step} className="relative">
                <div className="bg-[#F9F7F4] rounded-2xl p-8 h-full">
                  <span className="text-4xl font-serif font-bold text-[#A91D2D]/30">{p.step}</span>
                  <h3 className="mt-4 font-semibold text-[#1F2937]">{p.title}</h3>
                  <p className="mt-2 text-sm text-[#6B7280]">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-[#F9F7F4] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">{t("testimonials.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm text-[#1F2937]">{t.name}</p>
                  <p className="text-xs text-[#6B7280]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2937]">{t("cta.title")}</h2>
          <p className="text-[#4B5563]">{t("cta.subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/quote">
              <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-8 py-3 h-auto">
                <Send className="mr-2 h-4 w-4" />
                {t("nav.quote")}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-8 py-3 h-auto">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t("nav.contact")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
