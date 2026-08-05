import "server-only";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { properties } from "@/db/schema";
import type { PropertyType } from "@/lib/constants";

/**
 * Every public query filters on both axes. `status` is the admin's publication
 * state; `submissionStatus` keeps unreviewed host submissions off the site. It
 * is an allowlist on purpose — adding a new pipeline state can never
 * accidentally publish rows the way an exclusion filter would.
 */
const PUBLIC_CONDITIONS = [
  eq(properties.status, "available"),
  eq(properties.submissionStatus, "approved"),
];

export async function getFeaturedProperties(limit = 6) {
  return db.query.properties.findMany({
    where: and(...PUBLIC_CONDITIONS),
    orderBy: desc(properties.createdAt),
    limit,
    with: {
      locality: true,
      images: { orderBy: (images, { asc }) => asc(images.sortOrder), limit: 1 },
    },
  });
}

export async function getPublicProperties(filter: {
  type?: PropertyType;
  localityId?: number;
}) {
  const conditions = [...PUBLIC_CONDITIONS];
  if (filter.type) conditions.push(eq(properties.type, filter.type));
  if (filter.localityId)
    conditions.push(eq(properties.localityId, filter.localityId));

  return db.query.properties.findMany({
    where: and(...conditions),
    orderBy: desc(properties.createdAt),
    with: {
      locality: true,
      images: { orderBy: (images, { asc }) => asc(images.sortOrder), limit: 1 },
    },
  });
}

export async function getPropertyBySlug(slug: string) {
  return db.query.properties.findFirst({
    where: and(eq(properties.slug, slug), ...PUBLIC_CONDITIONS),
    with: {
      locality: true,
      images: { orderBy: (images, { asc }) => asc(images.sortOrder) },
    },
  });
}

/** Count of publicly visible properties per type, for the homepage stats. */
export async function getPropertyCountsByType(): Promise<
  Record<PropertyType, number>
> {
  const rows = await db
    .select({ type: properties.type, total: count() })
    .from(properties)
    .where(and(...PUBLIC_CONDITIONS))
    .groupBy(properties.type);

  const counts = { pg: 0, rent: 0, homestay: 0 };
  for (const row of rows) counts[row.type] = Number(row.total);
  return counts;
}

export type PropertyCard = Awaited<
  ReturnType<typeof getFeaturedProperties>
>[number];
export type PropertyDetail = NonNullable<
  Awaited<ReturnType<typeof getPropertyBySlug>>
>;
