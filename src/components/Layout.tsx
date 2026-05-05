import { Outlet } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider } from "@/providers/i18n";
import { MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Layout() {
  return (
    <HelmetProvider>
      <I18nProvider>
        <div className="min-h-screen flex flex-col bg-[#F9F7F4]">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          {/* Floating WhatsApp */}
          <a
            href="https://wa.me/212661925611"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-lg transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-7 w-7 text-white" />
          </a>
        </div>
      </I18nProvider>
    </HelmetProvider>
  );
}
