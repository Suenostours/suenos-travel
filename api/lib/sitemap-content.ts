import { isKnownStaticContentPath } from "./seo-html";

export function shouldPublishDatabaseDestination(slug: string) {
  return isKnownStaticContentPath(`/destinations/${slug}`);
}
