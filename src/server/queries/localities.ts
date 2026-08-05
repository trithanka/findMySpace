import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { localities, properties } from "@/db/schema";

export async function getLocalities() {
  return db.query.localities.findMany({ orderBy: asc(localities.name) });
}

export async function getLocalityBySlug(slug: string) {
  return db.query.localities.findFirst({ where: eq(localities.slug, slug) });
}

/** Localities with their count of publicly visible properties. */
export async function getLocalitiesWithCounts() {
  return db
    .select({
      id: localities.id,
      name: localities.name,
      slug: localities.slug,
      propertyCount: sql<number>`count(${properties.id}) filter (where ${properties.status} = 'available' and ${properties.submissionStatus} = 'approved')`,
    })
    .from(localities)
    .leftJoin(properties, eq(properties.localityId, localities.id))
    .groupBy(localities.id)
    .orderBy(asc(localities.name));
}

/**
 * Localities that actually have listings, each with a representative photo and
 * the cheapest price in that area — used for the homepage locality tiles.
 */
export async function getLocalityTiles(limit = 6) {
  const rows = await db.query.properties.findMany({
    where: and(
      eq(properties.status, "available"),
      eq(properties.submissionStatus, "approved"),
    ),
    with: {
      locality: true,
      images: { orderBy: (images, { asc }) => asc(images.sortOrder), limit: 1 },
    },
  });

  const byLocality = new Map<
    number,
    {
      id: number;
      name: string;
      slug: string;
      count: number;
      fromPrice: number;
      // Tracked with the price — monthly and nightly rates are not comparable,
      // so the tile must show which one it is quoting.
      fromPriceUnit: "month" | "night";
      image: string | null;
    }
  >();

  for (const property of rows) {
    const existing = byLocality.get(property.localityId);
    if (!existing) {
      byLocality.set(property.localityId, {
        id: property.locality.id,
        name: property.locality.name,
        slug: property.locality.slug,
        count: 1,
        fromPrice: property.price,
        fromPriceUnit: property.priceUnit,
        image: property.images[0]?.url ?? null,
      });
      continue;
    }
    existing.count += 1;
    if (property.price < existing.fromPrice) {
      existing.fromPrice = property.price;
      existing.fromPriceUnit = property.priceUnit;
    }
    existing.image ??= property.images[0]?.url ?? null;
  }

  return [...byLocality.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export type LocalityTile = Awaited<ReturnType<typeof getLocalityTiles>>[number];
export type Locality = Awaited<ReturnType<typeof getLocalities>>[number];
