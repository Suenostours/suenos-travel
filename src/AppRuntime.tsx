import { useLocation } from "react-router";
import type { ReactNode } from "react";
import { TRPCProvider } from "@/providers/trpc";
import { I18nProvider } from "@/providers/i18n";
import { SsrDataProvider, type SsrData } from "@/providers/ssr-data";
import { splitLocalePath } from "@/lib/locale-routes";

export default function AppRuntime({ children, ssrData }: { children: ReactNode; ssrData: SsrData }) {
  const location = useLocation();
  const { locale } = splitLocalePath(location.pathname);

  return (
    <TRPCProvider>
      <SsrDataProvider data={ssrData}>
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </SsrDataProvider>
    </TRPCProvider>
  );
}
