import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  tinyint,
  bigint,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

// ─── Users (required by api/kimi/auth.ts framework) ───
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Admins ───
export const admins = mysqlTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["super_admin", "admin", "editor"]).default("editor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

// ─── Site Settings ───
export const siteSettings = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  group: varchar("group", { length: 50 }).default("general").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

// ─── Cities ───
export const cities = mysqlTable("cities", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  mainImage: text("main_image"),
  gallery: json("gallery").$type<string[]>().default([]),
  active: tinyint("active", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;

export const cityTranslations = mysqlTable("city_translations", {
  id: serial("id").primaryKey(),
  cityId: bigint("city_id", { mode: "number", unsigned: true }).notNull(),
  locale: mysqlEnum("locale", ["fr", "en"]).default("en").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
});

export type CityTranslation = typeof cityTranslations.$inferSelect;
export type InsertCityTranslation = typeof cityTranslations.$inferInsert;

// ─── Tours / Circuits ───
export const tours = mysqlTable("tours", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  mainImage: text("main_image"),
  gallery: json("gallery").$type<string[]>().default([]),
  duration: varchar("duration", { length: 50 }),
  type: mysqlEnum("type", [
    "private",
    "small_group",
    "corporate",
    "desert",
    "family",
    "luxury",
    "cultural",
    "adventure",
    "short_break",
    "coast",
    "sports",
    "wellness",
    "romantic",
  ]).default("private").notNull(),
  featured: tinyint("featured", { unsigned: true }).default(0).notNull(),
  active: tinyint("active", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Tour = typeof tours.$inferSelect;
export type InsertTour = typeof tours.$inferInsert;

export const tourTranslations = mysqlTable("tour_translations", {
  id: serial("id").primaryKey(),
  tourId: bigint("tour_id", { mode: "number", unsigned: true }).notNull(),
  locale: mysqlEnum("locale", ["fr", "en"]).default("en").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  program: text("program"),
  highlights: text("highlights"),
  inclusions: text("inclusions"),
  exclusions: text("exclusions"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
});

export type TourTranslation = typeof tourTranslations.$inferSelect;
export type InsertTourTranslation = typeof tourTranslations.$inferInsert;

// ─── Tours <-> Cities relation ───
export const tourCities = mysqlTable("tour_cities", {
  id: serial("id").primaryKey(),
  tourId: bigint("tour_id", { mode: "number", unsigned: true }).notNull(),
  cityId: bigint("city_id", { mode: "number", unsigned: true }).notNull(),
});

export type TourCity = typeof tourCities.$inferSelect;
export type InsertTourCity = typeof tourCities.$inferInsert;

// ─── Excursions ───
export const excursions = mysqlTable("excursions", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  cityId: bigint("city_id", { mode: "number", unsigned: true }),
  mainImage: text("main_image"),
  gallery: json("gallery").$type<string[]>().default([]),
  duration: varchar("duration", { length: 50 }),
  active: tinyint("active", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Excursion = typeof excursions.$inferSelect;
export type InsertExcursion = typeof excursions.$inferInsert;

export const excursionTranslations = mysqlTable("excursion_translations", {
  id: serial("id").primaryKey(),
  excursionId: bigint("excursion_id", { mode: "number", unsigned: true }).notNull(),
  locale: mysqlEnum("locale", ["fr", "en"]).default("en").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  highlights: text("highlights"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
});

export type ExcursionTranslation = typeof excursionTranslations.$inferSelect;
export type InsertExcursionTranslation = typeof excursionTranslations.$inferInsert;

// ─── Blog Posts ───
export const blogPosts = mysqlTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  mainImage: text("main_image"),
  category: varchar("category", { length: 100 }),
  tags: json("tags").$type<string[]>().default([]),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  active: tinyint("active", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export const blogTranslations = mysqlTable("blog_translations", {
  id: serial("id").primaryKey(),
  postId: bigint("post_id", { mode: "number", unsigned: true }).notNull(),
  locale: mysqlEnum("locale", ["fr", "en"]).default("en").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
});

export type BlogTranslation = typeof blogTranslations.$inferSelect;
export type InsertBlogTranslation = typeof blogTranslations.$inferInsert;

// ─── Media ───
export const media = mysqlTable("media", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  path: text("path").notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: int("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

// ─── Contact Requests ───
export const contactRequests = mysqlTable("contact_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "treated", "archived"]).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = typeof contactRequests.$inferInsert;

// ─── Quote Requests ───
export const quoteRequests = mysqlTable("quote_requests", {
  id: serial("id").primaryKey(),
  agencyName: varchar("agency_name", { length: 255 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 50 }),
  country: varchar("country", { length: 100 }),
  travelType: varchar("travel_type", { length: 50 }),
  dates: varchar("dates", { length: 100 }),
  duration: varchar("duration", { length: 50 }),
  adults: int("adults"),
  children: int("children"),
  preferredDestinations: text("preferred_destinations"),
  preferredCircuit: varchar("preferred_circuit", { length: 255 }),
  hotelCategory: varchar("hotel_category", { length: 50 }),
  transportType: varchar("transport_type", { length: 50 }),
  guideLanguage: varchar("guide_language", { length: 50 }),
  budgetRange: varchar("budget_range", { length: 100 }),
  specialRequests: text("special_requests"),
  status: mysqlEnum("status", ["new", "treated", "archived"]).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;

// ─── B2B Partner Requests ───
export const partnerRequests = mysqlTable("partner_requests", {
  id: serial("id").primaryKey(),
  agencyName: varchar("agency_name", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }),
  website: varchar("website", { length: 255 }),
  contactPerson: varchar("contact_person", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 50 }),
  businessType: varchar("business_type", { length: 100 }),
  expectedVolume: varchar("expected_volume", { length: 100 }),
  status: mysqlEnum("status", ["new", "treated", "archived"]).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PartnerRequest = typeof partnerRequests.$inferSelect;
export type InsertPartnerRequest = typeof partnerRequests.$inferInsert;

// ─── SEO Settings ───
export const seoSettings = mysqlTable("seo_settings", {
  id: serial("id").primaryKey(),
  path: varchar("path", { length: 255 }).notNull().unique(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  ogImage: text("og_image"),
  canonical: text("canonical"),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SeoSetting = typeof seoSettings.$inferSelect;
export type InsertSeoSetting = typeof seoSettings.$inferInsert;
