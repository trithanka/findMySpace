import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";
import { getLocalitiesWithCounts } from "@/server/queries/localities";
import { getPublicProperties } from "@/server/queries/properties";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [localities, properties] = await Promise.all([
    getLocalitiesWithCounts(),
    getPublicProperties({}),
  ]);

  const categoryUrls = PROPERTY_TYPES.map((type) => ({
    url: `${siteConfig.url}/${PROPERTY_TYPE_CONFIG[type].categorySlug}`,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const localityUrls = localities
    .filter((locality) => locality.propertyCount > 0)
    .flatMap((locality) => [
      {
        url: `${siteConfig.url}/guwahati/${locality.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      ...PROPERTY_TYPES.map((type) => ({
        url: `${siteConfig.url}/${PROPERTY_TYPE_CONFIG[type].categorySlug}/${locality.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ]);

  const propertyUrls = properties.map((property) => ({
    url: `${siteConfig.url}/property/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const legalUrls = ["/privacy", "/terms"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    ...categoryUrls,
    ...legalUrls,
    ...localityUrls,
    ...propertyUrls,
  ];
}
