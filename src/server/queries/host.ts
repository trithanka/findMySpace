import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { properties } from "@/db/schema";

/** Every listing this host has started, newest first. */
export async function listHostListings(userId: string) {
  return db.query.properties.findMany({
    where: eq(properties.ownerUserId, userId),
    orderBy: desc(properties.updatedAt),
    with: {
      locality: true,
      images: { orderBy: (images, { asc }) => asc(images.sortOrder), limit: 1 },
    },
  });
}

/**
 * One listing, scoped to its owner. Always look listings up through this — an
 * id in the URL is user input, so a host must never be able to read or edit
 * someone else's draft by guessing a number.
 */
export async function getHostListing(id: number, userId: string) {
  return db.query.properties.findFirst({
    where: and(eq(properties.id, id), eq(properties.ownerUserId, userId)),
    with: {
      locality: true,
      images: { orderBy: (images, { asc }) => asc(images.sortOrder) },
    },
  });
}

export type HostListing = NonNullable<
  Awaited<ReturnType<typeof getHostListing>>
>;
export type HostListingCard = Awaited<
  ReturnType<typeof listHostListings>
>[number];
