import { useParams, Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

const blogPosts: Record<string, {
  title: string; titleFr: string;
  image: string; date: string;
  category: string; tags: string[];
  content: string; contentFr: string;
}> = {
  "morocco-travel-guide-2026": {
    title: "Morocco Travel Guide 2026",
    titleFr: "Guide de Voyage Maroc 2026",
    image: "/images/hero-desert.jpg",
    date: "2026-01-15",
    category: "Travel Guide",
    tags: ["Morocco", "Travel Tips", "Guide"],
    content: `Morocco is one of the most diverse travel destinations in the world. From the Sahara Desert to the Atlas Mountains, from ancient medinas to modern coastal resorts, the kingdom offers something for every traveler.

## Best Time to Visit

The best time to visit Morocco depends on your itinerary. Spring (March to May) and autumn (September to November) offer the most pleasant temperatures nationwide. Summer can be very hot inland, while the coast remains mild.

## Must-See Destinations

- **Marrakech**: The red city with its vibrant souks and stunning palaces
- **Fes**: The spiritual capital with the world's oldest university
- **Sahara Desert**: Merzouga and Zagora for desert experiences
- **Chefchaouen**: The famous blue city in the Rif Mountains
- **Essaouira**: A charming coastal town with fortified walls

## Travel Tips

1. Respect local customs and dress modestly
2. Learn a few Arabic or French phrases
3. Always negotiate in souks
4. Stay hydrated, especially in summer
5. Book accommodations in advance during peak seasons`,
    contentFr: `Le Maroc est l'une des destinations les plus diversifiées au monde. Du désert du Sahara aux montagnes de l'Atlas, des médinas anciennes aux stations balnéaires modernes, le royaume offre quelque chose pour chaque voyageur.

## Meilleure période pour visiter

La meilleure période dépend de votre itinéraire. Le printemps (mars à mai) et l'automne (septembre à novembre) offrent les températures les plus agréables. L'été peut être très chaud à l'intérieur des terres.

## Destinations incontournables

- **Marrakech**: La ville rouge avec ses souks vibrants
- **Fès**: La capitale spirituelle avec la plus ancienne université
- **Désert du Sahara**: Merzouga pour les expériences désert
- **Chefchaouen**: La célèbre ville bleue
- **Essaouira**: Une charmante ville côtière fortifiée

## Conseils de voyage

1. Respectez les coutumes locales
2. Apprenez quelques phrases en arabe ou français
3. Négociez toujours dans les souks
4. Restez hydraté, surtout en été
5. Réservez à l'avance pendant les hautes saisons`,
  },
  "sahara-desert-camps": {
    title: "Best Sahara Desert Camps in Morocco",
    titleFr: "Meilleurs Camps Désert au Sahara",
    image: "/images/circuit-sahara.jpg",
    date: "2026-02-01",
    category: "Accommodation",
    tags: ["Sahara", "Luxury Camp", "Desert"],
    content: `Sleeping under the stars in the Sahara is one of Morocco's most magical experiences. Here's our guide to the best desert camps in Merzouga.

## Luxury Camps

Luxury desert camps offer en-suite tents with proper beds, hot showers, and gourmet dining. Perfect for honeymooners and luxury travelers.

## Standard Camps

Standard camps provide comfortable beds in traditional Berber tents with shared facilities. A great balance of authenticity and comfort.

## Activities

- Camel treks at sunset and sunrise
- Sandboarding on the dunes
- Stargazing with professional guides
- Traditional Berber music around the campfire

## What to Pack

- Warm layers for cold nights
- Sunglasses and sunscreen
- Comfortable closed-toe shoes
- Camera with extra batteries`,
    contentFr: `Dormir sous les étoiles dans le Sahara est l'une des expériences les plus magiques du Maroc. Voici notre guide des meilleurs camps désert à Merzouga.

## Camps de luxe

Les camps de luxe offrent des tentes avec salle de bain, vrais lits, douches chaudes et restauration gastronomique. Parfait pour les lunes de miel.

## Camps standard

Les camps standard offrent des lits confortables dans des tentes berbères traditionnelles avec installations partagées.

## Activités

- Promenades chameau au coucher et lever du soleil
- Sandboard sur les dunes
- Observation des étoiles
- Musique berbère traditionnelle autour du feu

## À emporter

- Couches chaudes pour les nuits fraîches
- Lunettes de soleil et crème solaire
- Chaussures fermées confortables
- Appareil photo avec batteries de rechange`,
  },
  "marrakech-hidden-gems": {
    title: "Hidden Gems of Marrakech",
    titleFr: "Trésors Cachés de Marrakech",
    image: "/images/circuit-imperial.jpg",
    date: "2026-02-20",
    category: "City Guide",
    tags: ["Marrakech", "Hidden Gems", "City"],
    content: `Beyond the famous Jemaa el-Fnaa and Majorelle Garden, Marrakech hides countless secret spots waiting to be discovered.

## Secret Gardens

- **Le Jardin Secret**: A restored 19th-century riad garden in the medina
- **Dar el-Bacha**: Beautiful palace with a traditional coffee house
- **Anima Garden**: André Heller's artistic garden 30 minutes from the city

## Hidden Riads

Some of the most beautiful riads are tucked away in quiet medina alleys, offering peaceful courtyards away from the bustling souks.

## Local Eats

- **Café Clock**: Great for camel burgers and live music
- **Terrasse La Medersa**: Rooftop views over the Ben Youssef Medersa
- **Amal Women's Training Center**: Non-profit restaurant supporting local women

## Tips

Visit the tanneries early morning, explore the Mellah (Jewish quarter), and get lost in the souks - that's where the real discoveries happen.`,
    contentFr: `Au-delà de la célèbre Jemaa el-Fnaa et du Jardin Majorelle, Marrakech cache d'innombrables endroits secrets.

## Jardins secrets

- **Le Jardin Secret**: Un jardin de riad restauré du 19ème siècle
- **Dar el-Bacha**: Beau palais avec café traditionnel
- **Anima Garden**: Le jardin artistique d'André Heller

## Riads cachés

Certains des plus beaux riads sont nichés dans des ruelles tranquilles de la médina.

## Adresses locales

- **Café Clock**: Burgers de chameau et musique live
- **Terrasse La Medersa**: Vues sur la Medersa Ben Youssef
- **Amal Women's Training Center**: Restaurant à but non lucratif

## Conseils

Visitez les tanneries tôt le matin, explorez le Mellah (quartier juif) et perdez-vous dans les souks.`,
  },
};

function toMetaDescription(value: string) {
  return value
    .replace(/[#*_`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useI18n();
  const isFr = locale === "fr";

  const post = slug ? blogPosts[slug] : null;
  if (!post) return <div className="py-24 text-center">Article not found</div>;

  const title = isFr ? post.titleFr : post.title;
  const content = isFr ? post.contentFr : post.content;

  return (
    <>
      <SEO
        title={`${title} | Suenos Travel Blog`}
        description={toMetaDescription(content)}
        canonical={`/blog/${slug}`}
        image={post.image}
        type="article"
      />

      <section className="bg-[#F9F7F4]">
        <div className="relative h-[300px] md:h-[400px]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <Link to="/blog" className="inline-flex items-center gap-1 text-white/80 text-sm mb-4 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> {isFr ? "Retour au blog" : "Back to blog"}
              </Link>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-3">
                {post.category}
              </span>
              <h1 className="font-serif text-2xl md:text-4xl font-bold text-white">{title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 text-sm text-[#6B7280] mb-8">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.date}</span>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs">
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>
          </div>

          <article className="prose prose-lg max-w-none text-[#4B5563]">
            {content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return <h2 key={i} className="text-2xl font-serif font-bold text-[#1F2937] mt-8 mb-4">{paragraph.replace("## ", "")}</h2>;
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 my-4">
                    {paragraph.split("\n").map((item, j) => (
                      <li key={j} className="text-[#4B5563]" dangerouslySetInnerHTML={{ __html: item.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                    ))}
                  </ul>
                );
              }
              if (/^\d+\./.test(paragraph)) {
                return (
                  <ol key={i} className="list-decimal pl-6 space-y-2 my-4">
                    {paragraph.split("\n").map((item, j) => (
                      <li key={j} className="text-[#4B5563]">{item.replace(/^\d+\.\s*/, "")}</li>
                    ))}
                  </ol>
                );
              }
              return <p key={i} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
            })}
          </article>

          <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <h2 className="font-serif text-2xl font-bold text-[#1F2937]">
              {isFr ? "Besoin d'un programme Maroc pour votre agence ?" : "Need a Morocco program for your agency?"}
            </h2>
            <p className="mt-3 text-[#4B5563]">
              {isFr
                ? "Demandez une proposition sur mesure ou devenez partenaire B2B Suenos Travel."
                : "Request a tailor-made proposal or become a Suenos Travel B2B partner."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/quote">
                <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white rounded-full px-6">
                  {isFr ? "Demander un devis" : "Request a Quote"}
                </Button>
              </Link>
              <Link to="/b2b">
                <Button variant="outline" className="border-[#1F2937] text-[#1F2937] rounded-full px-6">
                  {isFr ? "Devenir partenaire B2B" : "Become a B2B Partner"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
