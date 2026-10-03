import { describe, expect, it } from "vitest";
import { shouldPublishDatabaseDestination } from "./sitemap-content";

describe("database-backed sitemap compatibility", () => {
  it("keeps database rows only when the existing client has a matching detail page", () => {
    expect(shouldPublishDatabaseDestination("marrakech")).toBe(true);
    expect(shouldPublishDatabaseDestination("synthetic-active-db-city")).toBe(false);
  });
});
