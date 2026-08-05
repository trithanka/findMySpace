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
import { getLocalities } from "@/server/queries/localities";
import { getPublicProperties } from "@/server/queries/properties";

export const dynamic = "force-dynamic";

type Params = { category: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const type = CATEGORY_TO_TYPE[category];
  if (!type) return {};
  const config = PROPERTY_TYPE_CONFIG[type];
  return {
    title: `${config.plural} in ${siteConfig.city}`,
    description: `Browse verified ${config.plural.toLowerCase()} in ${siteConfig.city} with photos, prices and locality details. Enquire directly on ${siteConfig.name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const type = CATEGORY_TO_TYPE[category];
  // Resolved before any markup is streamed, so unknown slugs get a real 404.
  if (!type) notFound();

  return (
    <Suspense fallback={<ListingsSkeleton withFilter />}>
      <CategoryContent category={category} type={type} />
    </Suspense>
  );
}

async function CategoryContent({
  category,
  type,
}: {
  category: string;
  type: PropertyType;
}) {
  const [properties, localities] = await Promise.all([
    getPublicProperties({ type }),
    getLocalities(),
  ]);
  const config = PROPERTY_TYPE_CONFIG[type];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {config.plural} in {siteConfig.city}
          </h1>
          <p className="mt-1 text-zinc-500">
            {properties.length} listing{properties.length === 1 ? "" : "s"}{" "}
            available
          </p>
        </div>
        <LocalityFilter localities={localities} basePath={`/${category}`} />
      </div>
      <PropertyGrid properties={properties} />
    </div>
  );
}
