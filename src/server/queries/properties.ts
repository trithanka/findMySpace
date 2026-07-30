import "server-only";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { properties } from "@/db/schema";
import type { PropertyType } from "@/lib/constants";

export async function getFeaturedProperties(limit = 6) {
  return db.query.properties.findMany({
    where: eq(properties.status, "available"),
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
  const conditions = [eq(properties.status, "available")];
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
    where: and(eq(properties.slug, slug), eq(properties.status, "available")),
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
    .where(eq(properties.status, "available"))
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
