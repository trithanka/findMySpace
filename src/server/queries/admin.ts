import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { enquiries, properties } from "@/db/schema";

export async function listAllProperties() {
  return db.query.properties.findMany({
    orderBy: desc(properties.createdAt),
    with: { locality: true },
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

export async function listEnquiries() {
  return db.query.enquiries.findMany({
    orderBy: desc(enquiries.createdAt),
    with: { property: { with: { locality: true } } },
  });
}

export type AdminProperty = Awaited<
  ReturnType<typeof listAllProperties>
>[number];
export type AdminEnquiry = Awaited<ReturnType<typeof listEnquiries>>[number];
