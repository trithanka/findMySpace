import Link from "next/link";
import { propertyCode } from "@/lib/utils";
import { requireAdmin } from "@/server/auth-guard";
import { countRecentEnquiries, listEnquiries } from "@/server/queries/admin";

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const [enquiries, thisWeek] = await Promise.all([
    listEnquiries(),
    countRecentEnquiries(7),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Enquiries
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {enquiries.length} total · {thisWeek} in the last 7 days
        </p>
      </div>

      <ul className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {enquiries.map((enquiry) => (
          <li key={enquiry.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-zinc-900">{enquiry.name}</p>
                  {enquiry.moveInDate && (
                    <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/20">
                      Stay from: {enquiry.moveInDate}
                    </span>
                  )}
                </div>
                <Link
                  href={`/property/${enquiry.property.slug}`}
                  target="_blank"
                  className="mt-0.5 block truncate text-xs text-zinc-500 hover:text-brand-700"
                >
                  <span className="font-mono">
                    {propertyCode(enquiry.property.id)}
                  </span>{" "}
                  · {enquiry.property.title} · {enquiry.property.locality.name}
                </Link>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-zinc-400">
                  {enquiry.createdAt.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <a
                  href={`tel:${enquiry.phone}`}
                  className="inline-flex min-h-9 items-center rounded-lg bg-brand-50 px-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
                >
                  {enquiry.phone}
                </a>
              </div>
            </div>
            {enquiry.message && (
              <p className="mt-2.5 rounded-xl bg-zinc-50 px-3 py-2 text-sm leading-relaxed text-zinc-600">
                {enquiry.message}
              </p>
            )}
          </li>
        ))}

        {enquiries.length === 0 && (
          <li className="px-4 py-14 text-center text-sm text-zinc-400">
            No enquiries yet — they will appear here as soon as someone requests
            a callback.
          </li>
        )}
      </ul>
    </div>
  );
}
