import Link from "next/link";
import { SubmissionActions } from "@/components/admin/submission-actions";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { PROPERTY_TYPE_CONFIG } from "@/lib/constants";
import { formatCoord } from "@/lib/map";
import { formatPrice, propertyCode } from "@/lib/utils";
import {
  approveSubmission,
  rejectSubmission,
} from "@/server/actions/submissions";
import { requireAdmin } from "@/server/auth-guard";
import {
  listRejectedSubmissions,
  listSubmissions,
  type AdminSubmission,
} from "@/server/queries/admin";

function SubmissionCard({ listing }: { listing: AdminSubmission }) {
  const approve = approveSubmission.bind(null, listing.id);
  const reject = rejectSubmission.bind(null, listing.id);

  const pin =
    listing.latitude !== null && listing.longitude !== null
      ? { lat: listing.latitude, lng: listing.longitude }
      : null;

  return (
    <li className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-zinc-900">
              {listing.title || "Untitled"}
            </h3>
            <Badge variant="outline">{propertyCode(listing.id)}</Badge>
            <Badge>{PROPERTY_TYPE_CONFIG[listing.type].label}</Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {listing.locality.name} · {formatPrice(listing.price, listing.priceUnit)}
            {listing.deposit ? ` · ₹${listing.deposit} deposit` : ""}
          </p>
        </div>
        <p className="text-xs text-zinc-400">
          {listing.submittedAt?.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </div>

      {listing.images.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {listing.images.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={image.id}
              src={image.url}
              alt=""
              className="h-24 w-32 shrink-0 rounded-lg border border-zinc-200 object-cover"
            />
          ))}
        </div>
      )}

      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-700">
        {listing.description}
      </p>

      {listing.amenities.length > 0 && (
        <p className="mt-3 text-xs text-zinc-500">
          {listing.amenities.join(" · ")}
        </p>
      )}

      <dl className="mt-4 grid gap-3 rounded-xl bg-zinc-50 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Host
          </dt>
          <dd className="text-zinc-800">
            {listing.owner?.name ?? listing.ownerName ?? "—"}
            <span className="block text-zinc-500">
              {listing.ownerPhone ?? "no phone"} · {listing.owner?.email ?? "—"}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Exact location (private)
          </dt>
          <dd className="text-zinc-800">
            {listing.addressLine ?? "No address given"}
            {pin && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block text-xs font-medium text-brand-700 hover:underline"
              >
                {formatCoord(pin.lat)}, {formatCoord(pin.lng)} — open in Maps ↗
              </a>
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
        <SubmissionActions approve={approve} reject={reject} />
        <Link
          href={`/admin/properties/${listing.id}/edit`}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-800"
        >
          Edit before publishing
        </Link>
      </div>
    </li>
  );
}

export default async function AdminSubmissionsPage() {
  await requireAdmin();
  const [pending, rejected] = await Promise.all([
    listSubmissions(),
    listRejectedSubmissions(),
  ]);

  return (
    <div>
      <SectionHeading
        eyebrow="Host submissions"
        title={
          pending.length === 0
            ? "Nothing waiting"
            : `${pending.length} listing${pending.length === 1 ? "" : "s"} to review`
        }
        subtitle="Approving publishes the listing on the public site."
      />

      {pending.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
          Host submissions land here. Nothing to look at right now.
        </p>
      ) : (
        <ul className="space-y-4">
          {pending.map((listing) => (
            <SubmissionCard key={listing.id} listing={listing} />
          ))}
        </ul>
      )}

      {rejected.length > 0 && (
        <div className="mt-12">
          <SectionHeading
            title="Sent back"
            subtitle="Waiting on the host to make changes and resubmit."
          />
          <ul className="space-y-2">
            {rejected.map((listing) => (
              <li
                key={listing.id}
                className="rounded-xl border border-zinc-200 bg-white p-4"
              >
                <p className="font-medium text-zinc-800">
                  {listing.title || "Untitled"}{" "}
                  <span className="font-normal text-zinc-500">
                    · {listing.locality.name} · {listing.owner?.email ?? "—"}
                  </span>
                </p>
                {listing.reviewNote && (
                  <p className="mt-1 text-sm text-amber-700">
                    {listing.reviewNote}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
