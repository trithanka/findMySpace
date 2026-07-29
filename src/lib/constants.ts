export const PROPERTY_TYPE_CONFIG = {
  pg: {
    label: "PG",
    plural: "PGs",
    categorySlug: "pg-in-guwahati",
    defaultPriceUnit: "month",
  },
  rent: {
    label: "Rental",
    plural: "Rentals",
    categorySlug: "rent-in-guwahati",
    defaultPriceUnit: "month",
  },
  homestay: {
    label: "Homestay",
    plural: "Homestays",
    categorySlug: "homestays-in-guwahati",
    defaultPriceUnit: "night",
  },
} as const;

export type PropertyType = keyof typeof PROPERTY_TYPE_CONFIG;

export const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_CONFIG) as PropertyType[];

export const CATEGORY_TO_TYPE: Record<string, PropertyType> = Object.fromEntries(
  PROPERTY_TYPES.map((type) => [PROPERTY_TYPE_CONFIG[type].categorySlug, type]),
);

export const AMENITIES = [
  "WiFi",
  "Food / Mess",
  "AC",
  "Parking",
  "Attached Bathroom",
  "Power Backup",
  "Washing Machine",
  "Housekeeping",
  "CCTV",
  "Geyser",
  "Kitchen Access",
  "Balcony",
] as const;

export const FURNISHING_LABELS: Record<string, string> = {
  unfurnished: "Unfurnished",
  semi_furnished: "Semi-furnished",
  fully_furnished: "Fully furnished",
};

export const GENDER_PREFERENCE_LABELS: Record<string, string> = {
  any: "Anyone",
  male: "Male only",
  female: "Female only",
};

export const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  occupied: "Occupied",
  hidden: "Hidden",
};
