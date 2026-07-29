import Link from "next/link";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
import { StatusSelect } from "@/components/admin/status-select";
import { Badge } from "@/components/ui/badge";
import { PROPERTY_TYPE_CONFIG } from "@/lib/constants";
import { formatPrice, propertyCode } from "@/lib/utils";
import { requireAdmin } from "@/server/auth-guard";
import { listAllProperties } from "@/server/queries/admin";

export default async function AdminPropertiesPage() {
  await requireAdmin();
  const properties = await listAllProperties();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Properties</h1>
        <Link
          href="/admin/properties/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + New property
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Locality</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                  {propertyCode(property.id)}
                </td>
                <td className="max-w-64 truncate px-4 py-3 font-medium text-zinc-900">
                  <Link
                    href={`/property/${property.slug}`}
                    className="hover:text-emerald-700"
                  >
                    {property.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge>{PROPERTY_TYPE_CONFIG[property.type].label}</Badge>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {property.locality.name}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {formatPrice(property.price, property.priceUnit)}
                </td>
                <td className="px-4 py-3">
                  <StatusSelect
                    propertyId={property.id}
                    status={property.status}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="text-xs font-medium text-emerald-700 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeletePropertyButton propertyId={property.id} />
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-zinc-400">
                  No properties yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
