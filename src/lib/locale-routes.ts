import type { Locale } from "@/providers/i18n";

export const REVIEWED_FRENCH_STATIC_PATHS = new Set([
  "/",
  "/about",
  "/circuits",
  "/quote",
  "/services",
  "/incoming-agency-morocco",
  "/morocco-tours-for-travel-agencies",
  "/mice-morocco",
]);
const REVIEWED_FRENCH_DYNAMIC_PATTERNS = [/^\/circuits\/[a-z0-9-]+$/];

export function splitLocalePath(pathname: string): { locale: Locale; basePath: string } {
  const path = pathname === "/" ? pathname : pathname.replace(/\/+$/, "") || "/";
  if (path === "/fr") return { locale: "fr", basePath: "/" };
  if (path.startsWith("/fr/")) {
    return { locale: "fr", basePath: path.slice(3) || "/" };
  }
  return { locale: "en", basePath: path };
}

export function hasReviewedFrenchEquivalent(pathname: string) {
  const { basePath } = splitLocalePath(pathname);
  return REVIEWED_FRENCH_STATIC_PATHS.has(basePath)
    || REVIEWED_FRENCH_DYNAMIC_PATTERNS.some((pattern) => pattern.test(basePath));
}

export function localizedPath(pathname: string, locale: Locale) {
  const { basePath } = splitLocalePath(pathname);
  if (locale === "fr" && hasReviewedFrenchEquivalent(basePath)) {
    return basePath === "/" ? "/fr" : `/fr${basePath}`;
  }
  return basePath;
}

export function alternateLocalePath(pathname: string, locale: Locale) {
  if (!hasReviewedFrenchEquivalent(pathname)) return null;
  return localizedPath(pathname, locale === "fr" ? "en" : "fr");
}

export function localeSwitchUrl(
  location: { pathname: string; search?: string; hash?: string },
  targetLocale: Locale,
  options?: { hasFrenchTourEquivalent?: boolean },
) {
  const { locale } = splitLocalePath(location.pathname);
  const { basePath } = splitLocalePath(location.pathname);
  if (
    targetLocale === "fr"
    && REVIEWED_FRENCH_DYNAMIC_PATTERNS.some((pattern) => pattern.test(basePath))
    && options?.hasFrenchTourEquivalent === false
  ) return null;
  const pathname = locale === targetLocale
    ? location.pathname
    : alternateLocalePath(location.pathname, locale);
  if (!pathname) return null;

  return `${pathname}${location.search ?? ""}${location.hash ?? ""}`;
}

export function isReviewedFrenchPath(pathname: string) {
  const parsed = splitLocalePath(pathname);
  return parsed.locale === "fr" && hasReviewedFrenchEquivalent(parsed.basePath);
}
