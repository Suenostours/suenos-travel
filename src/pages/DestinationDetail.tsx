import { useParams, Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const destinationDetails: Record<string, {
  name: string; nameFr: string; image: string;
  about: string; aboutFr: string;
  why: string; whyFr: string;
  bestTime: string; bestTimeFr: string;
}> = {
  marrakech: {
    name: "Marrakech", nameFr: "Marrakech",
    image: "/images/circuit-imperial.jpg",
    about: "Marrakech is Morocco's most famous city - a vibrant blend of ancient medina, stunning palaces, lush gardens, and modern luxury. The Jemaa el-Fnaa square comes alive every evening with storytellers, musicians, and food stalls.",
    aboutFr: "Marrakech est la ville la plus célèbre du Maroc - un mélange vibrant de médina ancienne, palais magnifiques, jardins luxuriants et luxe moderne.",
    why: "Marrakech offers the perfect introduction to Morocco. From the intricate souks to the serene Majorelle Garden, every corner tells a story. It's the ideal base for day trips to the Atlas Mountains or the Agafay Desert.",
    whyFr: "Marrakech offre l'introduction parfaite au Maroc. Des souks complexes au serein Jardin Majorelle, chaque coin raconte une histoire.",
    bestTime: "March to May and September to November offer the most pleasant weather for exploring.",
    bestTimeFr: "De mars à mai et de septembre à novembre offrent le temps le plus agréable pour explorer.",
  },
  fes: {
    name: "Fes", nameFr: "Fès",
    image: "/images/circuit-grand.jpg",
    about: "Fes is Morocco's spiritual and intellectual capital. Its medina, Fes el-Bali, is the world's largest car-free urban area and a UNESCO World Heritage site.",
    aboutFr: "Fès est la capitale spirituelle et intellectuelle du Maroc. Sa médina, Fès el-Bali, est la plus grande zone urbaine sans voiture du monde et un site du patrimoine mondial de l'UNESCO.",
    why: "For travelers seeking authentic Morocco, Fes delivers. The ancient tanneries, the world's oldest university Al-Qarawiyyin, and master artisans practicing centuries-old crafts.",
    whyFr: "Pour les voyageurs cherchant le Maroc authentique, Fès livre. Les tanneries anciennes, la plus ancienne université du monde Al-Qarawiyyin et les artisans maîtres pratiquant des métiers séculaires.",
    bestTime: "Spring (March-May) and autumn (September-November) are ideal for comfortable temperatures.",
    bestTimeFr: "Le printemps (mars-mai) et l'automne (septembre-novembre) sont idéaux pour des températures confortables.",
  },
  casablanca: {
    name: "Casablanca", nameFr: "Casablanca",
    image: "/images/about-riad.jpg",
    about: "Morocco's largest city and economic heart. Casablanca blends French colonial architecture with modern Moroccan development.",
    aboutFr: "La plus grande ville du Maroc et cœur économique. Casablanca mélange architecture coloniale française et développement marocain moderne.",
    why: "The iconic Hassan II Mosque - one of the world's largest mosques with a minaret towering over the Atlantic. Casablanca is also Morocco's main business hub.",
    whyFr: "La mosquée iconique Hassan II - l'une des plus grandes mosquées du monde avec un minaret dominant l'Atlantique. Casablanca est aussi le principal centre d'affaires du Maroc.",
    bestTime: "Casablanca enjoys mild weather year-round, but April-June and September-October are particularly pleasant.",
    bestTimeFr: "Casablanca profite d'un temps doux toute l'année, mais avril-juin et septembre-octobre sont particulièrement agréables.",
  },
  agadir: {
    name: "Agadir", nameFr: "Agadir",
    image: "/images/circuit-honeymoon.jpg",
    about: "A modern beach resort city rebuilt after the 1960 earthquake. Agadir offers 10km of sandy beach, world-class golf, and a year-round mild climate.",
    aboutFr: "Une ville balnéaire moderne reconstruite après le tremblement de terre de 1960. Agadir offre 10 km de plage de sable, du golf de classe mondiale et un climat doux toute l'année.",
    why: "Perfect for beach holidays, family vacations, and winter sun escapes. Agadir is also Suenos Travel's home base.",
    whyFr: "Parfait pour les vacances de plage, les séjours en famille et les escapades au soleil d'hiver. Agadir est aussi le siège de Suenos Travel.",
    bestTime: "With over 300 days of sunshine, Agadir is great year-round. Summer (June-September) is perfect for beach lovers.",
    bestTimeFr: "Avec plus de 300 jours de soleil, Agadir est excellent toute l'année. L'été (juin-septembre) est parfait pour les amateurs de plage.",
  },
  essaouira: {
    name: "Essaouira", nameFr: "Essaouira",
    image: "/images/circuit-luxury.jpg",
    about: "A charming fortified coastal town with a rich history as a trading port. Known for its windsurfing, art scene, and laid-back atmosphere.",
    aboutFr: "Une charmante ville côtière fortifiée avec une riche histoire en tant que port de commerce. Connue pour le windsurf, la scène artistique et l'atmosphère décontractée.",
    why: "Essaouira's medina is a UNESCO site with narrow alleyways, blue-shuttered houses, and ramparts facing the Atlantic. Perfect for a relaxing coastal break.",
    whyFr: "La médina d'Essaouira est un site UNESCO avec des ruelles étroites, des maisons aux volets bleus et des remparts face à l'Atlantique. Parfait pour une pause côtière relaxante.",
    bestTime: "Essaouira is windy year-round, making it ideal for watersports. Visit in spring or autumn for the most comfortable weather.",
    bestTimeFr: "Essaouira est venteuse toute l'année, ce qui la rend idéale pour les sports nautiques. Visitez au printemps ou en automne pour le temps le plus confortable.",
  },
  chefchaouen: {
    name: "Chefchaouen", nameFr: "Chefchaouen",
    image: "/images/circuit-grand.jpg",
    about: "The famous blue city in the Rif Mountains. Every wall, door, and staircase is painted in shades of blue, creating a surreal and photogenic landscape.",
    aboutFr: "La célèbre ville bleue dans les montagnes du Rif. Chaque mur, porte et escalier est peint dans des tons de bleu, créant un paysage surréaliste et photogénique.",
    why: "A must-visit for photographers and those seeking tranquility. The surrounding Rif Mountains offer excellent hiking opportunities.",
    whyFr: "Incontournable pour les photographes et ceux cherchant la tranquillité. Les montagnes du Rif environnantes offrent d'excellentes opportunités de randonnée.",
    bestTime: "April to October offers the best weather for exploring the town and hiking the Rif Mountains.",
    bestTimeFr: "D'avril à octobre offre le meilleur temps pour explorer la ville et randonner dans les montagnes du Rif.",
  },
  merzouga: {
    name: "Merzouga", nameFr: "Merzouga",
    image: "/images/circuit-sahara.jpg",
    about: "The gateway to the Erg Chebbi dunes - Morocco's most iconic Saharan landscape. Towering golden dunes, desert camps, and unforgettable sunrises.",
    aboutFr: "La porte des dunes d'Erg Chebbi - le paysage saharien le plus iconique du Maroc. Dunes dorées imposantes, camps désert et lever du soleil inoubliable.",
    why: "For the ultimate desert experience. Camel treks at sunset, luxury camps under the stars, and the silence of the Sahara.",
    whyFr: "Pour l'expérience désert ultime. Promenades à dos de chameau au coucher du soleil, camps de luxe sous les étoiles et le silence du Sahara.",
    bestTime: "October to April offers the most comfortable desert temperatures. Avoid June-August due to extreme heat.",
    bestTimeFr: "D'octobre à avril offre les températures désertiques les plus confortables. Évitez juin-août à cause de la chaleur extrême.",
  },
  ouarzazate: {
    name: "Ouarzazate", nameFr: "Ouarzazate",
    image: "/images/circuit-sahara.jpg",
    about: "Known as the 'Door of the Desert' and the 'Hollywood of Africa'. Home to Atlas Film Studios where blockbusters like Gladiator and Game of Thrones were filmed.",
    aboutFr: "Connue comme la 'Porte du Désert' et le 'Hollywood de l'Afrique'. Abrite les Atlas Film Studios où des blockbusters comme Gladiator ont été filmés.",
    why: "Perfect for film enthusiasts and as a stopover between Marrakech and the Sahara. The nearby Ait Ben Haddou kasbah is a UNESCO masterpiece.",
    whyFr: "Parfait pour les passionnés de cinéma et comme escale entre Marrakech et le Sahara. La kasbah d'Ait Ben Haddou à proximité est un chef-d'œuvre UNESCO.",
    bestTime: "Spring and autumn are ideal. Summers can be very hot, while winters are mild and pleasant.",
    bestTimeFr: "Le printemps et l'automne sont idéaux. Les étés peuvent être très chauds, tandis que les hivers sont doux et agréables.",
  },
};

export default function DestinationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useI18n();
  const isFr = locale === "fr";

  const dest = slug ? destinationDetails[slug] : null;
  if (!dest) return <div className="py-24 text-center">Destination not found</div>;

  const title = isFr ? dest.nameFr : dest.name;
  const description = isFr ? dest.aboutFr : dest.about;

  return (
    <>
      <SEO
        title={`${title} Morocco Programs | Suenos Travel DMC`}
        description={`Plan ${title} in Morocco programs for agencies, groups and tour operators with Suenos Travel DMC.`}
        canonical={`/destinations/${slug}`}
        image={dest.image}
      />

      <section className="bg-[#F9F7F4]">
        <div className="relative h-[350px] md:h-[450px]">
          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Link to="/destinations" className="inline-flex items-center gap-1 text-white/80 text-sm mb-4 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> {isFr ? "Retour aux destinations" : "Back to destinations"}
              </Link>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">{title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "À propos" : "About"}</h2>
                <p className="text-[#4B5563] leading-relaxed">{description}</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "Pourquoi visiter" : "Why Visit"}</h2>
                <p className="text-[#4B5563] leading-relaxed">{isFr ? dest.whyFr : dest.why}</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1F2937] mb-4">{isFr ? "Meilleure période" : "Best Time to Visit"}</h2>
                <p className="text-[#4B5563] leading-relaxed">{isFr ? dest.bestTimeFr : dest.bestTime}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-semibold text-[#1F2937] mb-4">{isFr ? "Planifier une visite" : "Plan a Visit"}</h3>
                <Link to="/quote" className="block">
                  <Button className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full">
                    {isFr ? "Demander un devis" : "Request a Quote"}
                  </Button>
                </Link>
                <Link to="/circuits" className="mt-3 block">
                  <Button variant="outline" className="w-full rounded-full">
                    {isFr ? "Voir les circuits liés" : "View Related Circuits"}
                  </Button>
                </Link>
                <a href="https://wa.me/212661925611" target="_blank" rel="noopener noreferrer" className="mt-3 block">
                  <Button variant="outline" className="w-full rounded-full">WhatsApp</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
