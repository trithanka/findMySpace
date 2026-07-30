import "server-only";
import { count, desc, eq, gte, isNull } from "drizzle-orm";
import { db } from "@/db";
import { enquiries, properties, propertyImages } from "@/db/schema";
import type { PropertyType } from "@/lib/constants";

export async function listAllProperties() {
  return db.query.properties.findMany({
    orderBy: desc(properties.createdAt),
    with: {
      locality: true,
      images: { orderBy: (images, { asc }) => asc(images.sortOrder), limit: 1 },
    },
  });
}

export async function getPropertyById(id: number) {
  return db.query.properties.findFirst({
    where: eq(properties.id, id),
    with: {
      images: { orderBy: (images, { asc }) => asc(images.sortOrder) },
    },
  });
}

export async function listEnquiries(limit?: number) {
  return db.query.enquiries.findMany({
    orderBy: desc(enquiries.createdAt),
    limit,
    with: { property: { with: { locality: true } } },
  });
}

/** Enquiries received in the last `days` days. */
export async function countRecentEnquiries(days = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [row] = await db
    .select({ total: count() })
    .from(enquiries)
    .where(gte(enquiries.createdAt, since));
  return Number(row?.total ?? 0);
}

export async function listRecentProperties(limit = 5) {
  return db.query.properties.findMany({
    orderBy: desc(properties.createdAt),
    limit,
    with: { locality: true },
  });
}

/** Everything the overview page needs, in one round trip per aggregate. */
export async function getAdminStats() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [byStatus, byType, enquiryTotal, enquiryRecent, withoutPhotos] =
    await Promise.all([
      db
        .select({ status: properties.status, total: count() })
        .from(properties)
        .groupBy(properties.status),
      db
        .select({ type: properties.type, total: count() })
        .from(properties)
        .where(eq(properties.status, "available"))
        .groupBy(properties.type),
      db.select({ total: count() }).from(enquiries),
      db
        .select({ total: count() })
        .from(enquiries)
        .where(gte(enquiries.createdAt, weekAgo)),
      db
        .select({ total: count() })
        .from(properties)
        .leftJoin(
          propertyImages,
          eq(propertyImages.propertyId, properties.id),
        )
        .where(isNull(propertyImages.id)),
    ]);

  const status = { available: 0, occupied: 0, hidden: 0 };
  for (const row of byStatus) status[row.status] = Number(row.total);

  const type: Record<PropertyType, number> = { pg: 0, rent: 0, homestay: 0 };
  for (const row of byType) type[row.type] = Number(row.total);

  return {
    status,
    type,
    totalProperties: status.available + status.occupied + status.hidden,
    enquiries: {
      total: Number(enquiryTotal[0]?.total ?? 0),
      lastWeek: Number(enquiryRecent[0]?.total ?? 0),
    },
    missingPhotos: Number(withoutPhotos[0]?.total ?? 0),
  };
}

export type AdminStats = Awaited<ReturnType<typeof getAdminStats>>;
export type AdminProperty = Awaited<
  ReturnType<typeof listAllProperties>
>[number];
export type AdminEnquiry = Awaited<ReturnType<typeof listEnquiries>>[number];
