import Link from "next/link";
import {
  HostStepShell,
  loadStepListing,
} from "@/components/host/host-step-shell";
import { DeleteListingButton } from "@/components/host/delete-listing-button";
import { SubmitListingButton } from "@/components/host/submit-listing-button";
import { PROPERTY_TYPE_CONFIG } from "@/lib/constants";
import { formatCoord } from "@/lib/map";
import { hostStepHref } from "@/lib/host-steps";
import { validateForSubmission } from "@/lib/listing-validation";
import { formatPrice } from "@/lib/utils";
import { deleteListing, submitListing } from "@/server/actions/host";

function Row({
  label,
  value,
  editHref,
}: {
  label: string;
  value: React.ReactNode;
  editHref: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-zinc-800">{value}</div>
      </div>
      <Link
        href={editHref}
        className="shrink-0 text-sm font-semibold text-brand-700 hover:underline"
      >
        Edit
      </Link>
    </div>
  );
}

export default async function ReviewStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await loadStepListing(id);
  const missing = validateForSubmission(listing);
  const submit = submitListing.bind(null, listing.id);
  const remove = deleteListing.bind(null, listing.id);

  const pinned =
    listing.latitude !== null && listing.longitude !== null
      ? `${formatCoord(listing.latitude)}, ${formatCoord(listing.longitude)}`
      : null;

  return (
    <HostStepShell
      listing={listing}
      step="review"
      title="Check it over"
      subtitle="We look at every listing before it goes live — usually within a day."
    >
      <div className="space-y-1">
        <Row
          label="Type & locality"
          editHref={hostStepHref(listing.id, "location")}
          value={`${PROPERTY_TYPE_CONFIG[listing.type].label} in ${listing.locality.name}`}
        />
        <Row
          label="Exact location (private)"
          editHref={hostStepHref(listing.id, "location")}
          value={
            <>
              {listing.addressLine ?? "No address given"}
              {pinned && (
                <span className="mt-0.5 block text-xs text-zinc-500">
                  Pinned at {pinned}
                </span>
              )}
            </>
          }
        />
        <Row
          label="Title"
          editHref={hostStepHref(listing.id, "basics")}
          value={listing.title || <em className="text-zinc-400">Not set</em>}
        />
        <Row
          label="Description"
          editHref={hostStepHref(listing.id, "basics")}
          value={
            listing.description ? (
              <span className="line-clamp-3">{listing.description}</span>
            ) : (
              <em className="text-zinc-400">Not set</em>
            )
          }
        />
        <Row
          label="Amenities"
          editHref={hostStepHref(listing.id, "basics")}
          value={
            listing.amenities.length > 0
              ? listing.amenities.join(", ")
              : "None listed"
          }
        />
        <Row
          label="Photos"
          editHref={hostStepHref(listing.id, "photos")}
          value={
            listing.images.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {listing.images.slice(0, 6).map((image) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={image.id}
                    src={image.url}
                    alt=""
                    className="h-14 w-14 rounded-md border border-zinc-200 object-cover"
                  />
                ))}
              </div>
            ) : (
              <em className="text-zinc-400">No photos yet</em>
            )
          }
        />
        <Row
          label="Price"
          editHref={hostStepHref(listing.id, "pricing")}
          value={
            listing.price > 0 ? (
              <>
                {formatPrice(listing.price, listing.priceUnit)}
                {listing.deposit ? ` · ₹${listing.deposit} deposit` : ""}
              </>
            ) : (
              <em className="text-zinc-400">Not set</em>
            )
          }
        />
        <Row
          label="Contact (private)"
          editHref={hostStepHref(listing.id, "pricing")}
          value={
            listing.ownerPhone ? (
              `${listing.ownerName ?? "You"} · ${listing.ownerPhone}`
            ) : (
              <em className="text-zinc-400">Not set</em>
            )
          }
        />
      </div>

      {missing.length > 0 && (
        <p className="mt-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Before you can submit, add: {missing.join(", ")}.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={hostStepHref(listing.id, "pricing")}
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
        >
          Back
        </Link>
        <SubmitListingButton
          action={submit}
          disabled={missing.length > 0}
          label={
            listing.submissionStatus === "approved"
              ? "Resubmit for review"
              : "Submit for review"
          }
        />
      </div>

      {listing.submissionStatus === "approved" && (
        <p className="mt-3 text-xs text-zinc-500">
          This listing is live. Resubmitting takes it back into review until we
          approve the changes.
        </p>
      )}

      {/* Only before it is live — pulling a published listing is a conversation
          with us, not a button. */}
      {listing.submissionStatus !== "approved" && (
        <div className="mt-8 border-t border-zinc-100 pt-4">
          <DeleteListingButton action={remove} />
        </div>
      )}
    </HostStepShell>
  );
}
