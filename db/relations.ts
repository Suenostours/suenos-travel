import { relations } from "drizzle-orm";
import {
  cities,
  cityTranslations,
  tours,
  tourTranslations,
  tourCities,
  excursions,
  excursionTranslations,
  blogPosts,
  blogTranslations,
} from "./schema";

export const citiesRelations = relations(cities, ({ many }) => ({
  translations: many(cityTranslations),
}));

export const cityTranslationsRelations = relations(cityTranslations, ({ one }) => ({
  city: one(cities, {
    fields: [cityTranslations.cityId],
    references: [cities.id],
  }),
}));

export const toursRelations = relations(tours, ({ many }) => ({
  translations: many(tourTranslations),
  cities: many(tourCities),
}));

export const tourTranslationsRelations = relations(tourTranslations, ({ one }) => ({
  tour: one(tours, {
    fields: [tourTranslations.tourId],
    references: [tours.id],
  }),
}));

export const tourCitiesRelations = relations(tourCities, ({ one }) => ({
  tour: one(tours, {
    fields: [tourCities.tourId],
    references: [tours.id],
  }),
  city: one(cities, {
    fields: [tourCities.cityId],
    references: [cities.id],
  }),
}));

export const excursionsRelations = relations(excursions, ({ one, many }) => ({
  city: one(cities, {
    fields: [excursions.cityId],
    references: [cities.id],
  }),
  translations: many(excursionTranslations),
}));

export const excursionTranslationsRelations = relations(excursionTranslations, ({ one }) => ({
  excursion: one(excursions, {
    fields: [excursionTranslations.excursionId],
    references: [excursions.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ many }) => ({
  translations: many(blogTranslations),
}));

export const blogTranslationsRelations = relations(blogTranslations, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogTranslations.postId],
    references: [blogPosts.id],
  }),
}));
