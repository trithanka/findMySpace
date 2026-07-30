import Image from "next/image";
import Link from "next/link";
import { PinIcon } from "@/components/ui/icons";
import { PROPERTY_TYPE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { PropertyCard as PropertyCardData } from "@/server/queries/properties";

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const cover = property.images[0]?.url;
  const [amount, unit] = formatPrice(property.price, property.priceUnit).split(
    "/",
  );

  return (
    <Link
      href={`/property/${property.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-900/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No photo yet
          </div>
        )}

        {/* Scrim keeps the badges and price legible on any photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/25" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur">
            {PROPERTY_TYPE_CONFIG[property.type].label}
          </span>
          {property.instagramShortcode && (
            <span className="rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              ▶ Reel
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="inline-flex items-baseline gap-0.5 rounded-full bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur">
            <span className="text-sm font-bold text-zinc-900">{amount}</span>
            <span className="text-xs font-medium text-zinc-500">/{unit}</span>
          </span>
          {property.bedrooms ? (
            <span className="rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              {property.bedrooms} BHK
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug text-zinc-900 transition group-hover:text-brand-700">
          {property.title}
        </h3>
        <p className="flex items-start gap-1.5 text-sm text-zinc-500">
          <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
          <span className="line-clamp-1">
            {property.locality.name}
            {property.landmark ? ` · ${property.landmark}` : ""}
          </span>
        </p>
        {property.amenities.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-lg bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="rounded-lg px-1 py-1 text-[11px] font-medium text-zinc-400">
                +{property.amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
