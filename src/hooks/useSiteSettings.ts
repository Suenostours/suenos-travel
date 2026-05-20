import { trpc } from "@/providers/trpc";
import { useMemo } from "react";

const FALLBACKS: Record<string, string> = {
  agency_name: "Suenos Travel",
  email: "resa@suenos-travel.com",
  phone: "+212 661 925 611",
  whatsapp: "+212 661 925 611",
  address_agadir: "Hay Salam Imm Elbssita Av Ahaj Messoud El Wafkaoui & Av Abdellah Guenon Bur n13 2eme Etg.",
  address_casablanca: "CASABLANCA, PHILIPS BUSINESS CENTER 304 BOULEVARD MOHAMED 5, 6EME ETG BUR 602",
  license: "ODV-0564",
  iata: "54273844",
  facebook: "",
  instagram: "",
  linkedin: "",
  tiktok: "",
  hero_title: "Your Trusted DMC Partner in Morocco",
  hero_subtitle:
    "Tailor-made Morocco travel experiences for international agencies, tour operators, corporate groups, and private travelers.",
  meta_title: "Morocco Incoming by Suenos Travel | DMC Morocco",
  meta_description:
    "Your trusted DMC partner in Morocco. Tailor-made tours, MICE, B2B services for travel agencies and tour operators.",
};

export function useSiteSettings() {
  const { data: settings, isLoading } = trpc.settings.getPublicSettings.useQuery(
    undefined,
    { staleTime: 1000 * 60 * 2, retry: 1 }
  );

  const get = (key: string): string => {
    const val = settings?.[key];
    if (val && val.trim().length > 0) return val;
    return FALLBACKS[key] ?? "";
  };

  return useMemo(
    () => ({
      email: get("email"),
      phone: get("phone"),
      whatsapp: get("whatsapp"),
      addressAgadir: get("address_agadir"),
      addressCasablanca: get("address_casablanca"),
      agencyName: get("agency_name"),
      license: get("license"),
      iata: get("iata"),
      facebook: get("facebook"),
      instagram: get("instagram"),
      linkedin: get("linkedin"),
      tiktok: get("tiktok"),
      heroTitle: get("hero_title"),
      heroSubtitle: get("hero_subtitle"),
      metaTitle: get("meta_title"),
      metaDescription: get("meta_description"),
      isLoading,
    }),
    [settings, isLoading]
  );
}
