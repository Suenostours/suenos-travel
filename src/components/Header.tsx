import { Link, useLocation } from "react-router";
import { useI18n } from "@/providers/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Menu, X, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { admin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.circuits"), path: "/circuits" },
    { label: t("nav.destinations"), path: "/destinations" },
    { label: t("nav.services"), path: "/services" },
    { label: t("nav.mice"), path: "/mice" },
    { label: t("nav.b2b"), path: "/b2b" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
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
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl md:text-2xl font-serif font-semibold text-[#1F2937]">
              Suenos Travel
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
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
                <Button variant="ghost" size="sm" className="gap-1 text-[#4B5563]">
                  <Globe className="h-4 w-4" />
                  <span className="uppercase text-xs font-semibold">{locale}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocale("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("fr")}>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Phone */}
            <a
              href="https://wa.me/212661925611"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#A91D2D] hover:text-[#8a1824] transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">+212 661 925 611</span>
            </a>

            {/* CTA Quote */}
            <Link to="/quote">
              <Button className="bg-[#A91D2D] hover:bg-[#8a1824] text-white text-sm px-4 py-2 rounded-full">
                {t("nav.quote")}
              </Button>
            </Link>

            {/* Admin */}
            {admin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="text-xs">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[#4B5563]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
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
            <button
              onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#4B5563]"
            >
              <Globe className="h-4 w-4" />
              {locale === "fr" ? "Switch to English" : "Passer en Français"}
            </button>
            <a
              href="https://wa.me/212661925611"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#A91D2D]"
            >
              <Phone className="h-4 w-4" />
              WhatsApp +212 661 925 611
            </a>
            <Link
              to="/quote"
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
