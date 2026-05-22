import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import SEO from "@/components/SEO";
import { ArrowRight, Calendar, Tag } from "lucide-react";

const blogPosts = [
  {
    slug: "morocco-travel-guide-2026",
    title: "Morocco Travel Guide 2026",
    titleFr: "Guide de Voyage Maroc 2026",
    image: "/images/hero-desert.jpg",
    date: "2026-01-15",
    category: "Travel Guide",
    excerpt: "Discover the best time to visit, must-see destinations, and essential travel tips for Morocco.",
    excerptFr: "Découvrez la meilleure période pour visiter, les destinations incontournables et les conseils essentiels.",
  },
  {
    slug: "sahara-desert-camps",
    title: "Best Sahara Desert Camps in Morocco",
    titleFr: "Meilleurs Camps Désert au Sahara",
    image: "/images/circuit-sahara.jpg",
    date: "2026-02-01",
    category: "Accommodation",
    excerpt: "Sleeping under the stars in the Sahara is one of Morocco's most magical experiences. Here's our guide.",
    excerptFr: "Dormir sous les étoiles dans le Sahara est l'une des expériences les plus magiques du Maroc.",
  },
  {
    slug: "marrakech-hidden-gems",
    title: "Hidden Gems of Marrakech",
    titleFr: "Trésors Cachés de Marrakech",
    image: "/images/circuit-imperial.jpg",
    date: "2026-02-20",
    category: "City Guide",
    excerpt: "Beyond the famous Jemaa el-Fnaa and Majorelle Garden, Marrakech hides countless secret spots.",
    excerptFr: "Au-delà de la célèbre Jemaa el-Fnaa et du Jardin Majorelle, Marrakech cache d'innombrables endroits secrets.",
  },
];

export default function Blog() {
  const { locale } = useI18n();
  const isFr = locale === "fr";

  return (
    <>
      <SEO
        title="Morocco Travel Blog for Agencies & Tour Operators"
        description="Morocco travel insights, destination guides and DMC advice for agencies, tour operators, groups and corporate travel planners."
        canonical="/blog"
        image="/images/hero-desert.jpg"
      />

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1F2937]">Blog</h1>
            <p className="mt-4 text-[#4B5563] max-w-2xl mx-auto">
              {isFr
                ? "Guides de voyage, conseils et insights sur le Maroc par Suenos Travel."
                : "Travel guides, tips, and insights about Morocco from Suenos Travel."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-xs font-medium text-[#1F2937]">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                      <Tag className="h-3.5 w-3.5 ml-2" />
                      {post.category}
                    </div>
                    <h3 className="font-semibold text-lg text-[#1F2937]">{isFr ? post.titleFr : post.title}</h3>
                    <p className="text-sm text-[#4B5563] line-clamp-2">{isFr ? post.excerptFr : post.excerpt}</p>
                    <span className="inline-flex items-center text-sm text-[#A91D2D] font-medium">
                      {isFr ? "Lire la suite" : "Read more"} <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
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
