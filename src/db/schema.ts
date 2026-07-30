import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ---------- App tables ----------

export const propertyType = pgEnum("property_type", ["pg", "rent", "homestay"]);
export const priceUnit = pgEnum("price_unit", ["month", "night"]);
export const propertyStatus = pgEnum("property_status", [
  "available",
  "occupied",
  "hidden",
]);
export const genderPreference = pgEnum("gender_preference", [
  "any",
  "male",
  "female",
]);
export const furnishing = pgEnum("furnishing", [
  "unfurnished",
  "semi_furnished",
  "fully_furnished",
]);

export const localities = pgTable("localities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  city: text("city").notNull().default("Guwahati"),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  type: propertyType("type").notNull(),
  price: integer("price").notNull(),
  priceUnit: priceUnit("price_unit").notNull().default("month"),
  deposit: integer("deposit"),
  localityId: integer("locality_id")
    .notNull()
    .references(() => localities.id),
  landmark: text("landmark"),
  bedrooms: integer("bedrooms"),
  furnishing: furnishing("furnishing"),
  genderPreference: genderPreference("gender_preference").default("any"),
  amenities: text("amenities").array().notNull().default([]),
  description: text("description").notNull(),
  // Instagram reel/post shortcode (not the full URL) — embedded on the detail page.
  instagramShortcode: text("instagram_shortcode"),
  // Owner contact — never rendered on public pages, admin only.
  ownerName: text("owner_name"),
  ownerPhone: text("owner_phone"),
  status: propertyStatus("status").notNull().default("available"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  moveInDate: text("move_in_date"),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const localitiesRelations = relations(localities, ({ many }) => ({
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  locality: one(localities, {
    fields: [properties.localityId],
    references: [localities.id],
  }),
  images: many(propertyImages),
  enquiries: many(enquiries),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));

export const enquiriesRelations = relations(enquiries, ({ one }) => ({
  property: one(properties, {
    fields: [enquiries.propertyId],
    references: [properties.id],
  }),
}));

// ---------- Better-Auth tables ----------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
