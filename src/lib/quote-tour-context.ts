const TOUR_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TOUR_SLUG_LENGTH = 160;
const MAX_PREFERRED_CIRCUIT_LENGTH = 255;

export function getRequestedTourSlug(search: string) {
  const value = new URLSearchParams(search).get("tour")?.trim() ?? "";
  if (!value || value.length > MAX_TOUR_SLUG_LENGTH || !TOUR_SLUG_PATTERN.test(value)) {
    return null;
  }
  return value;
}

export function formatPreferredCircuit(title: string, slug: string) {
  const cleanTitle = title.replace(/\s+/g, " ").trim();
  const suffix = ` [${slug}]`;
  const availableTitleLength = Math.max(0, MAX_PREFERRED_CIRCUIT_LENGTH - suffix.length);
  return `${cleanTitle.slice(0, availableTitleLength).trim()}${suffix}`;
}

export function getValidatedTourContext(
  requestedSlug: string | null,
  tour: { slug: string; title?: string | null } | null | undefined,
) {
  if (!requestedSlug || !tour || tour.slug !== requestedSlug) return null;

  const title = tour.title?.replace(/\s+/g, " ").trim()
    || tour.slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  return {
    title,
    preferredCircuit: formatPreferredCircuit(title, tour.slug),
  };
}
