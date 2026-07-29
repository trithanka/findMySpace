import Link from "next/link";
import { PropertyGrid } from "@/components/property/property-grid";
import { siteConfig } from "@/config/site";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";
import { getLocalitiesWithCounts } from "@/server/queries/localities";
import { getFeaturedProperties } from "@/server/queries/properties";

export const dynamic = "force-dynamic";

const TYPE_BLURBS: Record<string, string> = {
  pg: "Shared and single rooms with food, for students & professionals",
  rent: "Independent flats and houses for families & couples",
  homestay: "Short stays with local hosts, perfect for visitors",
};

export default async function HomePage() {
  const [featured, localities] = await Promise.all([
    getFeaturedProperties(6),
    getLocalitiesWithCounts(),
  ]);
  const activeLocalities = localities.filter((l) => l.propertyCount > 0);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="py-14 text-center sm:py-20">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Find your next space in{" "}
          <span className="text-emerald-600">{siteConfig.city}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">
          PGs, rentals and homestays across the city — verified by us, listed
          with honest prices, matched to your locality.
        </p>
      </section>

      {/* Type cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        {PROPERTY_TYPES.map((type) => (
          <Link
            key={type}
            href={`/${PROPERTY_TYPE_CONFIG[type].categorySlug}`}
            className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-zinc-900">
              {PROPERTY_TYPE_CONFIG[type].plural}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">{TYPE_BLURBS[type]}</p>
            <span className="mt-3 inline-block text-sm font-medium text-emerald-700">
              Browse {PROPERTY_TYPE_CONFIG[type].plural} →
            </span>
          </Link>
        ))}
      </section>

      {/* Localities */}
      {activeLocalities.length > 0 && (
        <section className="py-12">
          <h2 className="text-xl font-semibold text-zinc-900">
            Browse by locality
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeLocalities.map((locality) => (
              <Link
                key={locality.id}
                href={`/guwahati/${locality.slug}`}
                className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-700 transition hover:border-emerald-400 hover:text-emerald-700"
              >
                {locality.name}
                <span className="ml-1.5 text-xs text-zinc-400">
                  {locality.propertyCount}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="pb-16">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">
            Latest listings
          </h2>
        </div>
        <PropertyGrid properties={featured} />
      </section>
    </div>
  );
}
