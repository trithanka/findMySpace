import "server-only";
import { asc, eq, sql } from "drizzle-orm";
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
      propertyCount: sql<number>`count(${properties.id}) filter (where ${properties.status} = 'available')`,
    })
    .from(localities)
    .leftJoin(properties, eq(properties.localityId, localities.id))
    .groupBy(localities.id)
    .orderBy(asc(localities.name));
}

export type Locality = Awaited<ReturnType<typeof getLocalities>>[number];
