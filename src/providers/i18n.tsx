import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "fr" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.circuits": "Circuits",
    "nav.destinations": "Destinations",
    "nav.mice": "MICE",
    "nav.b2b": "B2B",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.quote": "Request a Quote",
    "nav.admin": "Admin",
    "hero.subtitle": "Tailor-made Morocco travel experiences for international agencies, tour operators, corporate groups, and private travelers.",
    "hero.cta.quote": "Request a Quote",
    "hero.cta.explore": "Explore Circuits",
    "hero.whatsapp": "WhatsApp",
    "trust.licensed": "Licensed Agency",
    "trust.locations": "Agadir & Casablanca",
    "trust.b2b": "B2B Specialist",
    "trust.tailor": "Tailor-Made",
    "trust.network": "Local Network",
    "about.title": "A Local Moroccan DMC with Global Standards",
    "about.cta": "Learn More",
    "services.title": "Our Services",
    "circuits.title": "Morocco Circuits",
    "circuits.cta": "View Details",
    "circuits.duration": "Duration",
    "circuits.days": "days",
    "circuits.cities": "Cities",
    "mice.title": "Corporate Events & Incentive Travel in Morocco",
    "b2b.title": "Your Incoming Partner in Morocco",
    "b2b.cta": "Become a Partner",
    "process.title": "How We Work",
    "process.step1": "Tell us your needs",
    "process.step2": "We design your program",
    "process.step3": "You confirm & book",
    "process.step4": "We deliver on the ground",
    "testimonials.title": "What Our Partners Say",
    "cta.title": "Let's Build Your Morocco Program Together",
    "cta.subtitle": "From initial inquiry to final departure, we handle every detail.",
    "footer.explore": "Explore",
    "footer.company": "Company",
    "footer.getstarted": "Get Started",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms & Conditions",
    "footer.rights": "All rights reserved.",
    "form.name": "Name",
    "form.email": "Email",
    "form.phone": "Phone",
    "form.message": "Message",
    "form.submit": "Send",
    "form.sending": "Sending...",
    "form.success": "Message sent successfully!",
    "form.error": "An error occurred. Please try again.",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.circuits": "Circuits",
    "nav.destinations": "Destinations",
    "nav.mice": "MICE",
    "nav.b2b": "B2B",
    "nav.services": "Services",
    "nav.about": "À Propos",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.quote": "Demander un Devis",
    "nav.admin": "Admin",
    "hero.subtitle": "Expériences de voyage sur mesure au Maroc pour agences internationales, tour-opérateurs, groupes corporate et voyageurs privés.",
    "hero.cta.quote": "Demander un Devis",
    "hero.cta.explore": "Explorer les Circuits",
    "hero.whatsapp": "WhatsApp",
    "trust.licensed": "Agence Agréée",
    "trust.locations": "Agadir & Casablanca",
    "trust.b2b": "Spécialiste B2B",
    "trust.tailor": "Sur Mesure",
    "trust.network": "Réseau Local",
    "about.title": "Une DMC Marocaine Locale aux Standards Internationaux",
    "about.cta": "En Savoir Plus",
    "services.title": "Nos Services",
    "circuits.title": "Circuits au Maroc",
    "circuits.cta": "Voir Détails",
    "circuits.duration": "Durée",
    "circuits.days": "jours",
    "circuits.cities": "Villes",
    "mice.title": "Événements Corporate & Voyages d'Incentive au Maroc",
    "b2b.title": "Votre Partenaire Incoming au Maroc",
    "b2b.cta": "Devenir Partenaire",
    "process.title": "Comment Nous Travaillons",
    "process.step1": "Dites-nous vos besoins",
    "process.step2": "Nous concevons votre programme",
    "process.step3": "Vous confirmez & réservez",
    "process.step4": "Nous assurons sur place",
    "testimonials.title": "Ce Que Disent Nos Partenaires",
    "cta.title": "Construisons Votre Programme Maroc Ensemble",
    "cta.subtitle": "De la première demande au départ final, nous gérons chaque détail.",
    "footer.explore": "Explorer",
    "footer.company": "Entreprise",
    "footer.getstarted": "Commencer",
    "footer.privacy": "Politique de Confidentialité",
    "footer.terms": "Conditions Générales",
    "footer.rights": "Tous droits réservés.",
    "form.name": "Nom",
    "form.email": "Email",
    "form.phone": "Téléphone",
    "form.message": "Message",
    "form.submit": "Envoyer",
    "form.sending": "Envoi en cours...",
    "form.success": "Message envoyé avec succès !",
    "form.error": "Une erreur s'est produite. Veuillez réessayer.",
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      return translations[locale][key] ?? fallback ?? key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
