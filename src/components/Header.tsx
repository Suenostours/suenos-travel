import { Link, useLocation } from "react-router";
import { useI18n } from "@/providers/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Menu, X, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRIMARY_PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/contact-details";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeSwitchUrl, localizedPath, splitLocalePath } from "@/lib/locale-routes";
import { trpc } from "@/providers/trpc";
import { useSsrData } from "@/providers/ssr-data";

export default function Header() {
  const { locale, t } = useI18n();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { admin } = useAuth();
  const ssrData = useSsrData();
  const { basePath } = splitLocalePath(location.pathname);
  const tourSlugMatch = basePath.match(/^\/circuits\/([a-z0-9-]+)$/);
  const tourSlug = tourSlugMatch?.[1];
  const matchingSsrTour = ssrData.routeData.kind === "tour"
    && ssrData.routeData.locale === "en"
    && ssrData.routeData.slug === tourSlug
      ? ssrData.routeData
      : undefined;
  const initialEnglishTour = matchingSsrTour?.state === "found" || matchingSsrTour?.state === "missing"
    ? matchingSsrTour.data ?? null
    : undefined;
  const { data: englishTour } = trpc.public.getTour.useQuery(
    { slug: tourSlug ?? "", locale: "en" },
    {
      enabled: locale === "en" && Boolean(tourSlug) && matchingSsrTour?.state !== "unavailable",
      initialData: initialEnglishTour,
      staleTime: initialEnglishTour !== undefined ? 5 * 60 * 1000 : 0,
    },
  );
  const hasFrenchTourEquivalent = !tourSlug || locale === "fr"
    ? undefined
    : englishTour?.hasFrenchTranslation === true;
  const englishPath = localeSwitchUrl(location, "en");
  const frenchPath = localeSwitchUrl(location, "fr", { hasFrenchTourEquivalent });
  const languageSwitchPath = locale === "fr" ? englishPath : frenchPath;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = locale === "fr"
    ? [
        { label: t("nav.home"), path: "/fr" },
        { label: t("nav.circuits"), path: "/fr/circuits" },
        { label: t("nav.services"), path: "/fr/services" },
        { label: t("nav.mice"), path: "/fr/mice-morocco" },
        { label: t("nav.b2b"), path: "/fr/incoming-agency-morocco" },
        { label: t("nav.about"), path: "/fr/about" },
      ]
    : [
        { label: t("nav.home"), path: "/" },
        { label: "DMC Morocco", path: "/dmc-morocco" },
        { label: t("nav.circuits"), path: "/circuits" },
        { label: t("nav.destinations"), path: "/destinations" },
        { label: t("nav.services"), path: "/services" },
        { label: t("nav.mice"), path: "/mice" },
        { label: t("nav.b2b"), path: "/b2b" },
      ];

  const isActive = (path: string) => {
    if (path === "/" || path === "/fr") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-[#F9F7F4]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to={localizedPath("/", locale)}
            className="flex items-center shrink-0"
            aria-label={locale === "fr" ? "Accueil Suenos Travel" : "Suenos Travel — DMC Morocco home"}
          >
            <img
              src="/images/suenos-travel-logo.webp"
              alt={locale === "fr" ? "Suenos Travel — DMC au Maroc" : "Suenos Travel — DMC Morocco"}
              width={300}
              height={188}
              className="h-11 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-[#A91D2D]"
                    : "text-[#4B5563] hover:text-[#A91D2D]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-[#4B5563]" aria-label={locale === "fr" ? "Choisir la langue" : "Choose language"}>
                  <Globe className="h-4 w-4" />
                  <span className="uppercase text-xs font-semibold">{locale}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {englishPath ? (
                  <DropdownMenuItem asChild><a href={englishPath}>English</a></DropdownMenuItem>
                ) : (
                  <DropdownMenuItem disabled>English</DropdownMenuItem>
                )}
                {frenchPath ? (
                  <DropdownMenuItem asChild><a href={frenchPath}>Français</a></DropdownMenuItem>
                ) : (
                  <DropdownMenuItem disabled>Français</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Phone */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#A91D2D] hover:text-[#8a1824] transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">{PRIMARY_PHONE_DISPLAY}</span>
            </a>

            {/* CTA Quote */}
            <Button asChild className="bg-[#A91D2D] hover:bg-[#8a1824] text-white text-sm px-4 py-2 rounded-full">
                <Link to={localizedPath("/quote", locale)}>
                {t("nav.quote")}
              </Link>
            </Button>

            {/* Admin */}
            {admin && (
              <Button asChild variant="outline" size="sm" className="text-xs">
                <Link to="/admin">
                  Dashboard
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[#4B5563]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen
              ? (locale === "fr" ? "Fermer le menu de navigation" : "Close navigation menu")
              : (locale === "fr" ? "Ouvrir le menu de navigation" : "Open navigation menu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-navigation" className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive(item.path) ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.path)
                  ? "text-[#A91D2D] bg-red-50"
                  : "text-[#4B5563]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {languageSwitchPath && (
              <a
                href={languageSwitchPath}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#4B5563]"
              >
                <Globe className="h-4 w-4" />
                {locale === "fr" ? "Passer en anglais" : "Passer en français"}
              </a>
            )}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#A91D2D]"
            >
              <Phone className="h-4 w-4" />
              WhatsApp {PRIMARY_PHONE_DISPLAY}
            </a>
            <Link
              to={localizedPath("/quote", locale)}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#A91D2D]"
            >
              {t("nav.quote")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
