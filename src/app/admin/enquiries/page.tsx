import Link from "next/link";
import { propertyCode } from "@/lib/utils";
import { requireAdmin } from "@/server/auth-guard";
import { listEnquiries } from "@/server/queries/admin";

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const enquiries = await listEnquiries();

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-zinc-900">Enquiries</h1>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="hover:bg-zinc-50">
                <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                  {enquiry.createdAt.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {enquiry.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="text-emerald-700 hover:underline"
                  >
                    {enquiry.phone}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/property/${enquiry.property.slug}`}
                    className="text-zinc-600 hover:text-emerald-700"
                  >
                    {propertyCode(enquiry.property.id)} ·{" "}
                    {enquiry.property.locality.name}
                  </Link>
                </td>
                <td className="max-w-64 truncate px-4 py-3 text-zinc-500">
                  {enquiry.message ?? "—"}
                </td>
              </tr>
            ))}
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                  No enquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
