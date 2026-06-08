import { Link } from "react-router";
import { useI18n } from "@/providers/i18n";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  const { t } = useI18n();
  const {
    email,
    phone,
    whatsapp,
    addressAgadir,
    addressCasablanca,
    license,
    iata,
  } = useSiteSettings();

  return (
    <footer className="bg-[#0F172A] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-white">
              Suenos Travel
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted DMC partner in Morocco. Licensed agency and IATA
              member. Tailor-made travel experiences for international agencies,
              tour operators, and corporate groups.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#A91D2D]/20 text-[#E8A0A0] text-xs font-medium">
                Licensed Agency {license}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-medium">
                IATA {iata}
              </span>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("footer.explore")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t("nav.circuits"), path: "/circuits" },
                { label: t("nav.destinations"), path: "/destinations" },
                { label: t("nav.services"), path: "/services" },
                { label: t("nav.mice"), path: "/mice" },
                { label: t("nav.b2b"), path: "/b2b" },
                { label: t("nav.blog"), path: "/blog" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: B2B SEO Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              B2B Morocco Services
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "DMC Morocco", path: "/dmc-morocco" },
                { label: "Incoming Agency Morocco", path: "/incoming-agency-morocco" },
                { label: "Tours for Travel Agencies", path: "/morocco-tours-for-travel-agencies" },
                { label: "Morocco Group Tours", path: "/morocco-group-tours" },
                { label: "MICE Morocco", path: "/mice-morocco" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("footer.company")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t("nav.about"), path: "/about" },
                { label: t("nav.contact"), path: "/contact" },
                { label: t("footer.privacy"), path: "/privacy" },
                { label: t("footer.terms"), path: "/terms" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Get Started */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("footer.getstarted")}
            </h4>
            <div className="space-y-3">
              <Link to="/quote">
                <button className="w-full bg-[#A91D2D] hover:bg-[#8a1824] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                  {t("nav.quote")}
                </button>
              </Link>
              <Link to="/b2b">
                <button className="w-full border border-white/20 hover:bg-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                  Become a B2B Partner
                </button>
              </Link>
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  WhatsApp {whatsapp}
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {email}
                </a>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Casablanca &amp; Agadir, Morocco</span>
                </div>
                <div className="text-xs text-gray-500 pl-6 space-y-0.5">
                  <p>{addressCasablanca}</p>
                  <p>{addressAgadir}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 pt-1">
                  <span className="text-xs">Phone: {phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Suenos Travel. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">
              {t("footer.terms")}
            </Link>
            <Link to="/admin/login" className="hover:text-gray-300 transition-colors">
              {t("nav.admin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
