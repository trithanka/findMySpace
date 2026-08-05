import type { PropertyType } from "@/lib/constants";

/**
 * How much of a listing's private detail may be shown publicly, decided by what
 * kind of listing it is.
 *
 * Homestays are a short-stay booking: a guest needs to find the door, and the
 * host's name is part of what they are choosing. PGs and rentals are long-term
 * arrangements we broker — the exact address and the owner's identity stay with
 * us until an enquiry is genuine, which is what keeps the introduction ours.
 *
 * Every public surface must ask this module rather than test the type inline,
 * so the rule cannot drift between the map, the page copy and the policy.
 */
export function disclosureFor(type: PropertyType) {
  const isHomestay = type === "homestay";
  return {
    /** Show a precise marker and the street address instead of a rough circle. */
    exactLocation: isHomestay,
    /** Show who hosts the place. */
    ownerName: isHomestay,
  };
}

/** Wording for the host, so they know what will be public before they pin. */
export function locationPrivacyNote(type: PropertyType): string {
  return disclosureFor(type).exactLocation
    ? "Guests need to find a homestay, so the pin and address you give here are shown on the public listing."
    : "Only we see this. Public pages show the locality and a rough map circle, never your exact address.";
}
