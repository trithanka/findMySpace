import { PropertyCard } from "@/components/property/property-card";
import type { PropertyCard as PropertyCardData } from "@/server/queries/properties";

export function PropertyGrid({
  properties,
  emptyMessage = "No properties listed here yet — check back soon.",
}: {
  properties: PropertyCardData[];
  emptyMessage?: string;
}) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
