export const siteConfig = {
  name: "FindMySpace",
  tagline: "PGs, rentals & homestays in Guwahati",
  description:
    "Find verified PGs, rental homes and homestays across Guwahati. Browse by locality, compare prices and enquire directly — no brokerage surprises.",
  city: "Guwahati",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;
