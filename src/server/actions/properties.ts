"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { properties, propertyImages } from "@/db/schema";
import { PROPERTY_TYPES, type PropertyType } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/server/auth-guard";

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parsePropertyForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "") as PropertyType;
  const price = parseOptionalInt(formData.get("price"));
  const localityId = parseOptionalInt(formData.get("localityId"));
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !description || !price || !localityId) {
    throw new Error("Title, price, locality and description are required.");
  }
  if (!PROPERTY_TYPES.includes(type)) {
    throw new Error("Invalid property type.");
  }

  const furnishing = String(formData.get("furnishing") ?? "");
  const genderPreference = String(formData.get("genderPreference") ?? "any");
  const status = String(formData.get("status") ?? "available");

  return {
    title,
    type,
    price,
    priceUnit: type === "homestay" ? ("night" as const) : ("month" as const),
    deposit: parseOptionalInt(formData.get("deposit")),
    localityId,
    landmark: String(formData.get("landmark") ?? "").trim() || null,
    bedrooms: parseOptionalInt(formData.get("bedrooms")),
    furnishing: (furnishing || null) as
      | "unfurnished"
      | "semi_furnished"
      | "fully_furnished"
      | null,
    genderPreference: genderPreference as "any" | "male" | "female",
    amenities: formData.getAll("amenities").map(String),
    description,
    ownerName: String(formData.get("ownerName") ?? "").trim() || null,
    ownerPhone: String(formData.get("ownerPhone") ?? "").trim() || null,
    status: status as "available" | "occupied" | "hidden",
  };
}

function parseImageUrls(formData: FormData): string[] {
  return String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.startsWith("http"));
}

async function replaceImages(propertyId: number, urls: string[]) {
  await db
    .delete(propertyImages)
    .where(eq(propertyImages.propertyId, propertyId));
  if (urls.length > 0) {
    await db.insert(propertyImages).values(
      urls.map((url, index) => ({ propertyId, url, sortOrder: index })),
    );
  }
}

function revalidatePublicPages() {
  revalidatePath("/", "layout");
}

export async function createProperty(formData: FormData) {
  await requireAdmin();
  const values = parsePropertyForm(formData);
  const slug = `${slugify(values.title)}-${Date.now().toString(36)}`;

  const [created] = await db
    .insert(properties)
    .values({ ...values, slug })
    .returning({ id: properties.id });

  await replaceImages(created.id, parseImageUrls(formData));
  revalidatePublicPages();
  redirect("/admin");
}

export async function updateProperty(id: number, formData: FormData) {
  await requireAdmin();
  const values = parsePropertyForm(formData);

  await db
    .update(properties)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(properties.id, id));

  await replaceImages(id, parseImageUrls(formData));
  revalidatePublicPages();
  redirect("/admin");
}

export async function setPropertyStatus(
  id: number,
  status: "available" | "occupied" | "hidden",
) {
  await requireAdmin();
  await db
    .update(properties)
    .set({ status, updatedAt: new Date() })
    .where(eq(properties.id, id));
  revalidatePublicPages();
}

export async function deleteProperty(id: number) {
  await requireAdmin();
  await db.delete(properties).where(eq(properties.id, id));
  revalidatePublicPages();
}
