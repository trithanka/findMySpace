import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PROPERTY_TYPE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { PropertyCard as PropertyCardData } from "@/server/queries/properties";

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const cover = property.images[0]?.url;

  return (
    <Link
      href={`/property/${property.slug}`}
      className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] bg-zinc-100">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No photo yet
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge variant="accent">
            {PROPERTY_TYPE_CONFIG[property.type].label}
          </Badge>
        </div>
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="line-clamp-1 font-semibold text-zinc-900">
          {property.title}
        </h3>
        <p className="text-sm text-zinc-500">
          {property.locality.name}, {property.locality.city}
          {property.landmark ? ` · ${property.landmark}` : ""}
        </p>
        <p className="pt-1 font-semibold text-emerald-700">
          {formatPrice(property.price, property.priceUnit)}
        </p>
      </div>
    </Link>
  );
}
