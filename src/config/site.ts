export const siteConfig = {
  name: "FindMySpace",
  tagline: "PGs, rentals & homestays in Guwahati",
  description:
    "Find verified PGs, rental homes and homestays across Guwahati. Browse by locality, compare prices and enquire directly — no brokerage surprises.",
  city: "Guwahati",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;

/**
 * Everything the privacy policy and terms pages need to name a real business.
 *
 * These are placeholders — fill them in before the site goes live. India's DPDP
 * Act and the IT Rules both require a reachable grievance contact, so the
 * `grievance` block in particular is not optional decoration.
 */
export const legalConfig = {
  /** Registered legal name, if it differs from the brand. */
  entityName: "FindMySpace",
  /** Registered / correspondence address, shown on both legal pages. */
  address: "Guwahati, Assam, India",
  /**
   * General contact for privacy and support questions. One inbox handles
   * everything for now, so the grievance address below points at it too.
   */
  contactEmail: "thefindmyspace@gmail.com",
  /** Named grievance officer, as required of intermediaries in India. */
  grievance: {
    name: "Grievance Officer",
    email: "thefindmyspace@gmail.com",
  },
  /** Courts with exclusive jurisdiction. */
  jurisdiction: "Guwahati, Assam",
  /** Bump when either document changes materially. */
  lastUpdated: "5 August 2026",
} as const;
