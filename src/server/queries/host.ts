import "server-only";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { account, properties, user } from "@/db/schema";

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

/**
 * Everything the account page shows. The sign-in methods come from the
 * `account` table — a host may have both a password and a linked Google
 * account, and it is useful for them to see which.
 */
export async function getHostAccount(userId: string) {
  const [profile, methods, listings] = await Promise.all([
    db.query.user.findFirst({ where: eq(user.id, userId) }),
    db
      .select({ providerId: account.providerId })
      .from(account)
      .where(eq(account.userId, userId)),
    db
      .select({
        submissionStatus: properties.submissionStatus,
        total: count(),
      })
      .from(properties)
      .where(eq(properties.ownerUserId, userId))
      .groupBy(properties.submissionStatus),
  ]);

  const counts = { draft: 0, submitted: 0, approved: 0, rejected: 0 };
  for (const row of listings) counts[row.submissionStatus] = Number(row.total);

  return {
    profile,
    providers: [...new Set(methods.map((m) => m.providerId))],
    counts,
    totalListings: Object.values(counts).reduce((a, b) => a + b, 0),
  };
}

export type HostAccount = Awaited<ReturnType<typeof getHostAccount>>;
