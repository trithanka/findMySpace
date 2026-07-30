import Image from "next/image";
import Link from "next/link";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
import { StatusSelect } from "@/components/admin/status-select";
import { PROPERTY_TYPE_CONFIG, STATUS_LABELS } from "@/lib/constants";
import { cn, formatPrice, propertyCode } from "@/lib/utils";
import { requireAdmin } from "@/server/auth-guard";
import { listAllProperties } from "@/server/queries/admin";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "hidden", label: "Hidden" },
] as const;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const active = FILTERS.some((filter) => filter.value === status)
    ? status
    : "all";

  const all = await listAllProperties();
  const properties =
    active === "all" ? all : all.filter((item) => item.status === active);

  const countFor = (value: string) =>
    value === "all"
      ? all.length
      : all.filter((item) => item.status === value).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Properties
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {all.length} listing{all.length === 1 ? "" : "s"} total
          </p>
        </div>
      </div>

      {/* Status filter */}
      <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "all"
                ? "/admin/properties"
                : `/admin/properties?status=${filter.value}`
            }
            className={cn(
              "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition",
              active === filter.value
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100",
            )}
          >
            {filter.label}
            <span
              className={cn(
                "ml-1.5 text-xs",
                active === filter.value ? "text-white/60" : "text-zinc-400",
              )}
            >
              {countFor(filter.value)}
            </span>
          </Link>
        ))}
      </div>

      <ul className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {properties.map((property) => (
          <li
            key={property.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3 transition hover:bg-zinc-50 sm:flex-nowrap"
          >
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
              {property.images[0] ? (
                <Image
                  src={property.images[0].url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-[10px] font-medium text-amber-600">
                  No photo
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/admin/properties/${property.id}/edit`}
                className="block truncate font-semibold text-zinc-900 hover:text-brand-700"
              >
                {property.title}
              </Link>
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                <span className="font-mono">{propertyCode(property.id)}</span> ·{" "}
                {PROPERTY_TYPE_CONFIG[property.type].label} ·{" "}
                {property.locality.name}
              </p>
            </div>

            <p className="shrink-0 text-sm font-semibold text-zinc-900">
              {formatPrice(property.price, property.priceUnit)}
            </p>

            <div className="flex shrink-0 items-center gap-3">
              <StatusSelect propertyId={property.id} status={property.status} />
              <Link
                href={`/admin/properties/${property.id}/edit`}
                className="inline-flex min-h-9 items-center rounded-lg px-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
              >
                Edit
              </Link>
              <Link
                href={`/property/${property.slug}`}
                target="_blank"
                className="inline-flex min-h-9 items-center rounded-lg px-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              >
                View
              </Link>
              <DeletePropertyButton propertyId={property.id} />
            </div>
          </li>
        ))}

        {properties.length === 0 && (
          <li className="px-4 py-14 text-center">
            <p className="text-sm text-zinc-400">
              {all.length === 0
                ? "No properties yet."
                : `No ${STATUS_LABELS[active as string]?.toLowerCase() ?? ""} listings.`}
            </p>
            {all.length === 0 && (
              <Link
                href="/admin/properties/new"
                className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                Add your first listing →
              </Link>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
