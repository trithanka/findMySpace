import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LocalityFilter } from "@/components/property/locality-filter";
import { PropertyGrid } from "@/components/property/property-grid";
import { ListingsSkeleton } from "@/components/ui/page-skeletons";
import { siteConfig } from "@/config/site";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";
import { getLocalities } from "@/server/queries/localities";
import { getPublicProperties } from "@/server/queries/properties";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `All listings in ${siteConfig.city}`,
  description: `Every PG, rental home and homestay currently available in ${siteConfig.city} on ${siteConfig.name}.`,
};

/**
 * Every type in one place.
 *
 * The homepage's "Latest listings" mixes all three types, so its "View all"
 * needs a destination that does the same — pointing it at a single category
 * page showed an empty grid whenever that one type happened to have nothing.
 */
export default function AllListingsPage() {
  return (
    <Suspense fallback={<ListingsSkeleton withFilter />}>
      <AllListingsContent />
    </Suspense>
  );
}

async function AllListingsContent() {
  const [properties, localities] = await Promise.all([
    getPublicProperties({}),
    getLocalities(),
  ]);

  const counts = PROPERTY_TYPES.map((type) => ({
    type,
    count: properties.filter((property) => property.type === type).length,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            All listings in {siteConfig.city}
          </h1>
          <p className="mt-1 text-zinc-500">
            {properties.length} listing{properties.length === 1 ? "" : "s"}{" "}
            available
          </p>
        </div>
        {/* Clearing the filter stays here; choosing a locality hands over to
            /guwahati/<locality>, which already lists every type in one area. */}
        <LocalityFilter
          localities={localities}
          basePath="/listings"
          localityBasePath="/guwahati"
        />
      </div>

      <nav className="mb-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-zinc-900 px-3.5 py-1.5 text-sm font-semibold text-white">
          All ({properties.length})
        </span>
        {counts.map(({ type, count }) => (
          <Link
            key={type}
            href={`/${PROPERTY_TYPE_CONFIG[type].categorySlug}`}
            className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            {PROPERTY_TYPE_CONFIG[type].plural} ({count})
          </Link>
        ))}
      </nav>

      <PropertyGrid properties={properties} />
    </div>
  );
}
