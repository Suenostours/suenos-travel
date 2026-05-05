import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import { Helmet } from "react-helmet-async";

const destinations = [
  { slug: "marrakech", name: "Marrakech", nameFr: "Marrakech", image: "/images/circuit-imperial.jpg", desc: "The red city — vibrant souks, stunning palaces, and the famous Jemaa el-Fnaa square.", descFr: "La ville rouge — souks vibrants, palais magnifiques et la célèbre place Jemaa el-Fnaa." },
  { slug: "fes", name: "Fes", nameFr: "Fès", image: "/images/circuit-grand.jpg", desc: "Morocco's spiritual and cultural heart, home to the world's oldest university.", descFr: "Le cœur spirituel et culturel du Maroc, abritant la plus ancienne université du monde." },
  { slug: "casablanca", name: "Casablanca", nameFr: "Casablanca", image: "/images/about-riad.jpg", desc: "Morocco's economic capital — modern, cosmopolitan, with the iconic Hassan II Mosque.", descFr: "Capitale économique du Maroc — moderne, cosmopolite, avec la mosquée iconique Hassan II." },
  { slug: "agadir", name: "Agadir", nameFr: "Agadir", image: "/images/circuit-honeymoon.jpg", desc: "Beautiful beaches, modern resorts, and year-round sunshine on the Atlantic coast.", descFr: "Belles plages, stations balnéaires modernes et soleil toute l'année sur la côte atlantique." },
  { slug: "essaouira", name: "Essaouira", nameFr: "Essaouira", image: "/images/circuit-luxury.jpg", desc: "A charming coastal town with fortified walls, art galleries, and fresh seafood.", descFr: "Une charmante ville côtière avec des remparts, des galeries d'art et des fruits de mer frais." },
  { slug: "chefchaouen", name: "Chefchaouen", nameFr: "Chefchaouen", image: "/images/circuit-grand.jpg", desc: "The famous blue city nestled in the Rif Mountains — a photographer's dream.", descFr: "La célèbre ville bleue nichée dans les montagnes du Rif — le rêve d'un photographe." },
  { slug: "merzouga", name: "Merzouga", nameFr: "Merzouga", image: "/images/circuit-sahara.jpg", desc: "Gateway to the Sahara — golden dunes, desert camps, and starlit nights.", descFr: "Porte du Sahara — dunes dorées, camps désert et nuits étoilées." },
  { slug: "ouarzazate", name: "Ouarzazate", nameFr: "Ouarzazate", image: "/images/circuit-sahara.jpg", desc: "The Hollywood of Africa — film studios and the gateway to the desert.", descFr: "Le Hollywood de l'Afrique — studios de cinéma et porte du désert." },
];

export default function Destinations() {
  const { locale } = useI18n();
  const isFr = locale === "fr";

  return (
    <>
      <Helmet>
        <title>Morocco Destinations | Suenos Travel DMC</title>
        <meta name="description" content="Explore Morocco's top destinations: Marrakech, Fes, Casablanca, Agadir, Essaouira, Sahara and more." />
      </Helmet>

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">Destinations</h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Découvrez les plus belles destinations du Maroc, de la médina de Marrakech aux dunes du Sahara."
                : "Discover Morocco's most beautiful destinations, from Marrakech's medina to the Sahara dunes."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d) => (
              <Link key={d.slug} to={`/destinations/${d.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-[#1F2937]">{isFr ? d.nameFr : d.name}</h3>
                    <p className="text-sm text-[#4B5563] mt-2 line-clamp-2">{isFr ? d.descFr : d.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
