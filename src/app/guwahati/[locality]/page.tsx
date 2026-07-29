import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/property-grid";
import { siteConfig } from "@/config/site";
import { getLocalityBySlug } from "@/server/queries/localities";
import { getPublicProperties } from "@/server/queries/properties";

export const dynamic = "force-dynamic";

type Params = { locality: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locality: localitySlug } = await params;
  const locality = await getLocalityBySlug(localitySlug);
  if (!locality) return {};
  return {
    title: `PGs, rentals & homestays in ${locality.name}, ${siteConfig.city}`,
    description: `All available properties in ${locality.name}, ${siteConfig.city} — PGs, rental flats and homestays with honest prices.`,
  };
}

export default async function LocalityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locality: localitySlug } = await params;
  const locality = await getLocalityBySlug(localitySlug);
  if (!locality) notFound();

  const properties = await getPublicProperties({ localityId: locality.id });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        Properties in {locality.name}
      </h1>
      <p className="mb-6 mt-1 text-zinc-500">
        {properties.length} listing{properties.length === 1 ? "" : "s"} in{" "}
        {locality.name}, {siteConfig.city}
      </p>
      <PropertyGrid
        properties={properties}
        emptyMessage={`Nothing listed in ${locality.name} yet — check back soon.`}
      />
    </div>
  );
}
