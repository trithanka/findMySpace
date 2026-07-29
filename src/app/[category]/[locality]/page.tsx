import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalityFilter } from "@/components/property/locality-filter";
import { PropertyGrid } from "@/components/property/property-grid";
import { siteConfig } from "@/config/site";
import { CATEGORY_TO_TYPE, PROPERTY_TYPE_CONFIG } from "@/lib/constants";
import {
  getLocalities,
  getLocalityBySlug,
} from "@/server/queries/localities";
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

  const locality = await getLocalityBySlug(localitySlug);
  if (!locality) notFound();

  const [properties, localities] = await Promise.all([
    getPublicProperties({ type, localityId: locality.id }),
    getLocalities(),
  ]);
  const config = PROPERTY_TYPE_CONFIG[type];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {config.plural} in {locality.name}
          </h1>
          <p className="mt-1 text-zinc-500">
            {properties.length} listing{properties.length === 1 ? "" : "s"} in{" "}
            {locality.name}, {siteConfig.city}
          </p>
        </div>
        <LocalityFilter
          localities={localities}
          categorySlug={category}
          currentLocalitySlug={localitySlug}
        />
      </div>
      <PropertyGrid
        properties={properties}
        emptyMessage={`No ${config.plural.toLowerCase()} in ${locality.name} yet — try another locality.`}
      />
    </div>
  );
}
