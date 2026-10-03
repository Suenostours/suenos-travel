import { hasReviewedFrenchEquivalent, localizedPath } from "../../src/lib/locale-routes";

export type SitemapAlternates = { en: string; fr: string; xDefault: string };

const BASE_URL = "https://www.morocco-incoming.com";

export function getStaticSitemapAlternates(pathname: string): SitemapAlternates | undefined {
  if (!hasReviewedFrenchEquivalent(pathname)) return undefined;
  const en = `${BASE_URL}${localizedPath(pathname, "en")}`;
  const fr = `${BASE_URL}${localizedPath(pathname, "fr")}`;
  return { en, fr, xDefault: en };
}

export function getTourSitemapAlternates(slug: string, hasFrenchTranslation: boolean) {
  if (!hasFrenchTranslation) return undefined;
  const en = `${BASE_URL}/circuits/${slug}`;
  const fr = `${BASE_URL}/fr/circuits/${slug}`;
  return { en, fr, xDefault: en };
}
