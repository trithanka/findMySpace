import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LocalityFilter } from "@/components/property/locality-filter";
import { PropertyGrid } from "@/components/property/property-grid";
import { ListingsSkeleton } from "@/components/ui/page-skeletons";
import { siteConfig } from "@/config/site";
import {
  CATEGORY_TO_TYPE,
  PROPERTY_TYPE_CONFIG,
  type PropertyType,
} from "@/lib/constants";
import { getLocalities, getLocalityBySlug } from "@/server/queries/localities";
import { getPublicProperties } from "@/server/queries/properties";

export const dynamic = "force-dynamic";

type Params = { category: string; locality: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, locality: localitySlug } = await params;
  const type = CATEGORY_TO_TYPE[category];
  if (!type) return {};
  const locality = await getLocalityBySlug(localitySlug);
  if (!locality) return {};
  const config = PROPERTY_TYPE_CONFIG[type];
  return {
    title: `${config.plural} in ${locality.name}, ${siteConfig.city}`,
    description: `Find ${config.plural.toLowerCase()} in ${locality.name}, ${siteConfig.city} with honest prices and photos. Enquire directly on ${siteConfig.name}.`,
  };
}

export default async function CategoryLocalityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, locality: localitySlug } = await params;
  const type = CATEGORY_TO_TYPE[category];
  if (!type) notFound();

  // Both checks resolve before anything streams, so bad slugs return a real 404.
  const locality = await getLocalityBySlug(localitySlug);
  if (!locality) notFound();

  return (
    <Suspense fallback={<ListingsSkeleton withFilter />}>
      <LocalityListings
        category={category}
        type={type}
        localityId={locality.id}
        localityName={locality.name}
        localitySlug={localitySlug}
      />
    </Suspense>
  );
}

async function LocalityListings({
  category,
  type,
  localityId,
  localityName,
  localitySlug,
}: {
  category: string;
  type: PropertyType;
  localityId: number;
  localityName: string;
  localitySlug: string;
}) {
  const [properties, localities] = await Promise.all([
    getPublicProperties({ type, localityId }),
    getLocalities(),
  ]);
  const config = PROPERTY_TYPE_CONFIG[type];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {config.plural} in {localityName}
          </h1>
          <p className="mt-1 text-zinc-500">
            {properties.length} listing{properties.length === 1 ? "" : "s"} in{" "}
            {localityName}, {siteConfig.city}
          </p>
        </div>
        <LocalityFilter
          localities={localities}
          basePath={`/${category}`}
          currentLocalitySlug={localitySlug}
        />
      </div>
      <PropertyGrid
        properties={properties}
        emptyMessage={`No ${config.plural.toLowerCase()} in ${localityName} yet — try another locality.`}
      />
    </div>
  );
}
