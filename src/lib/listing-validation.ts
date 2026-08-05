/**
 * Structural, so this stays a plain lib module — the review page (a server
 * component) and the submit action both need it, and a `"use server"` file may
 * only export async functions.
 */
type SubmittableListing = {
  title: string;
  description: string;
  price: number;
  latitude: number | null;
  longitude: number | null;
  ownerPhone: string | null;
  images: unknown[];
};

/** Human-readable list of what still has to be filled in before submitting. */
export function validateForSubmission(listing: SubmittableListing): string[] {
  const missing: string[] = [];
  if (!listing.title) missing.push("a title");
  if (!listing.description) missing.push("a description");
  if (!listing.price || listing.price <= 0) missing.push("a price");
  if (listing.latitude === null || listing.longitude === null) {
    missing.push("the exact location");
  }
  if (!listing.ownerPhone) missing.push("a contact phone number");
  if (listing.images.length === 0) missing.push("at least one photo");
  return missing;
}
