"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { properties, propertyImages } from "@/db/schema";
import { PROPERTY_TYPES, type PropertyType } from "@/lib/constants";
import { hostStepHref } from "@/lib/host-steps";
import { validateForSubmission } from "@/lib/listing-validation";
import { slugify } from "@/lib/utils";
import { requireUser } from "@/server/auth-guard";
import { getHostListing, type HostListing } from "@/server/queries/host";

/**
 * Validation comes back as a value rather than a thrown error: Next.js replaces
 * server-action exception messages with a generic string in production, so a
 * thrown "Enter a price above zero" would reach the host as "something went
 * wrong". Genuinely exceptional cases (a listing that is not yours) still throw.
 */
export type ActionResult = { error: string } | undefined;

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseOptionalFloat(value: FormDataEntryValue | null): number | null {
  const parsed = Number.parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/**
 * Loads a listing the current user owns, or throws. Every host action starts
 * here: the guard proves *someone* is signed in, this proves it is their row.
 * An id in a URL is user input — without this, one host could edit another's.
 */
async function requireOwnedListing(id: number): Promise<HostListing> {
  const session = await requireUser();
  const listing = await getHostListing(id, session.user.id);
  if (!listing) throw new Error("Listing not found.");
  return listing;
}

/**
 * Once a listing is approved it is live and indexed, so its slug is a real URL
 * that must not move under visitors. Before that, the slug tracks the title.
 */
function slugFor(listing: HostListing, title: string): string | undefined {
  if (listing.submissionStatus === "approved") return undefined;
  return `${slugify(title) || "listing"}-${listing.id.toString(36)}`;
}

async function touch(
  id: number,
  values: Partial<typeof properties.$inferInsert>,
) {
  await db
    .update(properties)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(properties.id, id));
  revalidatePath(`/host/listings/${id}`, "layout");
}

type LocationValues = {
  localityId: number;
  latitude: number;
  longitude: number;
  addressLine: string | null;
  landmark: string | null;
};

/** Shared by the create and edit location steps. */
function parseLocation(
  formData: FormData,
): { error: string } | { values: LocationValues } {
  const localityId = parseOptionalInt(formData.get("localityId"));
  const latitude = parseOptionalFloat(formData.get("latitude"));
  const longitude = parseOptionalFloat(formData.get("longitude"));

  if (!localityId) return { error: "Pick the locality." };
  if (latitude === null || longitude === null) {
    return { error: "Drop the pin on your exact location first." };
  }
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return { error: "Those coordinates are not on the map." };
  }

  return {
    values: {
      localityId,
      latitude,
      longitude,
      addressLine: text(formData, "addressLine") || null,
      landmark: text(formData, "landmark") || null,
    },
  };
}

// ---------- Step 1: the place ----------

/**
 * The draft row is created once the host has picked a type, a locality and a
 * point on the map — everything `properties` requires that cannot sensibly be
 * defaulted. Title/price/description start empty and are filled in by later
 * steps; `validateForSubmission` enforces them at the end, and
 * `submissionStatus: "draft"` keeps the half-built row off the public site
 * throughout.
 */
export async function createDraftListing(
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireUser();

  const type = text(formData, "type") as PropertyType;
  if (!PROPERTY_TYPES.includes(type)) {
    return { error: "Pick what you are listing." };
  }

  const location = parseLocation(formData);
  if ("error" in location) return { error: location.error };

  const [created] = await db
    .insert(properties)
    .values({
      ...location.values,
      slug: `draft-${Date.now().toString(36)}`,
      title: "",
      type,
      price: 0,
      priceUnit: type === "homestay" ? "night" : "month",
      description: "",
      ownerUserId: session.user.id,
      submissionStatus: "draft",
      // Not public until approved, but keep the admin-facing publication state
      // at its normal default so approving is a one-field change.
      status: "available",
    })
    .returning({ id: properties.id });

  redirect(hostStepHref(created.id, "basics"));
}

/** Revisiting step 1 on an existing listing. */
export async function updateListingLocation(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireOwnedListing(id);

  const type = text(formData, "type") as PropertyType;
  if (!PROPERTY_TYPES.includes(type)) {
    return { error: "Pick what you are listing." };
  }

  const location = parseLocation(formData);
  if ("error" in location) return { error: location.error };

  await touch(id, {
    ...location.values,
    type,
    // A homestay is priced per night and the others per month; switching type
    // has to carry the unit with it or the price would silently change meaning.
    priceUnit: type === "homestay" ? "night" : "month",
  });
  redirect(hostStepHref(id, "basics"));
}

// ---------- Step 2: details ----------

export async function saveListingBasics(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  const listing = await requireOwnedListing(id);

  const title = text(formData, "title");
  const description = text(formData, "description");
  if (!title) return { error: "Give your listing a title." };
  if (!description) return { error: "Add a short description." };

  const furnishing = text(formData, "furnishing");

  await touch(id, {
    title,
    slug: slugFor(listing, title),
    description,
    bedrooms: parseOptionalInt(formData.get("bedrooms")),
    furnishing: (furnishing || null) as HostListing["furnishing"],
    genderPreference: (text(formData, "genderPreference") ||
      "any") as HostListing["genderPreference"],
    amenities: formData.getAll("amenities").map(String),
  });

  redirect(hostStepHref(id, "photos"));
}

// ---------- Step 3: photos ----------

/**
 * The photos are already in Cloudinary by the time this runs — the browser
 * uploads them directly with a signed request, so only URLs arrive here and the
 * POST body stays well under Vercel's 4.5MB cap.
 */
export async function saveListingPhotos(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireOwnedListing(id);

  const urls = String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.startsWith("http"));

  if (urls.length === 0) {
    return { error: "Add at least one photo — listings without one get skipped." };
  }

  await db.delete(propertyImages).where(eq(propertyImages.propertyId, id));
  await db
    .insert(propertyImages)
    .values(
      urls.map((url, index) => ({ propertyId: id, url, sortOrder: index })),
    );
  await touch(id, {});

  redirect(hostStepHref(id, "pricing"));
}

// ---------- Step 4: price & contact ----------

export async function saveListingPricing(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireOwnedListing(id);

  const price = parseOptionalInt(formData.get("price"));
  if (!price || price <= 0) return { error: "Enter a price above zero." };

  const ownerPhone = text(formData, "ownerPhone");
  if (!ownerPhone) return { error: "We need a phone number to reach you on." };

  await touch(id, {
    price,
    deposit: parseOptionalInt(formData.get("deposit")),
    ownerName: text(formData, "ownerName") || null,
    ownerPhone,
  });

  redirect(hostStepHref(id, "review"));
}

// ---------- Step 5: submit for review ----------

export async function submitListing(id: number): Promise<ActionResult> {
  const listing = await requireOwnedListing(id);

  const missing = validateForSubmission(listing);
  if (missing.length > 0) {
    return { error: `Still missing: ${missing.join(", ")}.` };
  }

  // An already-approved listing drops back into review when its host resubmits,
  // so edits to something already live get a second look rather than going out
  // unseen.
  await touch(id, {
    submissionStatus: "submitted",
    submittedAt: new Date(),
    reviewNote: null,
  });

  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
  redirect("/host/listings?submitted=1");
}

export async function deleteListing(id: number) {
  const session = await requireUser();
  await db
    .delete(properties)
    .where(
      and(eq(properties.id, id), eq(properties.ownerUserId, session.user.id)),
    );
  revalidatePath("/host/listings");
  revalidatePath("/", "layout");
  redirect("/host/listings");
}
