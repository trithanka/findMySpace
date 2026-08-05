import Link from "next/link";
import { HostShell } from "@/components/host/host-shell";
import { Badge } from "@/components/ui/badge";
import { PROPERTY_TYPE_CONFIG } from "@/lib/constants";
import { hostStepHref, SUBMISSION_STATUS_LABELS } from "@/lib/host-steps";
import { validateForSubmission } from "@/lib/listing-validation";
import { formatPrice } from "@/lib/utils";
import { requireUser } from "@/server/auth-guard";
import { listHostListings } from "@/server/queries/host";

const STATUS_VARIANT = {
  draft: "outline",
  submitted: "warning",
  approved: "accent",
  rejected: "danger",
} as const;

export default async function HostListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const session = await requireUser();
  const [{ submitted }, listings] = await Promise.all([
    searchParams,
    listHostListings(session.user.id),
  ]);

  return (
    <HostShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          My listings
        </h1>
        <Link
          href="/host/listings/new"
          className="inline-flex min-h-11 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          + New listing
        </Link>
      </div>

      {submitted && (
        <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Thanks — your listing is with our team. We usually review within a day
          and will call you on the number you gave us.
        </p>
      )}

      {listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="font-medium text-zinc-800">No listings yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
            Adding your first one takes about five minutes — the place, some
            photos and a price.
          </p>
          <Link
            href="/host/listings/new"
            className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Start a listing
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {listings.map((listing) => {
            const missing = validateForSubmission({
              ...listing,
              images: listing.images,
            });
            // Draft and rejected listings resume where the work is; anything
            // already with us opens on the review summary.
            const href =
              listing.submissionStatus === "draft" ||
              listing.submissionStatus === "rejected"
                ? hostStepHref(listing.id, missing.length > 0 ? "basics" : "review")
                : hostStepHref(listing.id, "review");

            return (
              <li key={listing.id}>
                <Link
                  href={href}
                  className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-3 transition hover:border-zinc-300 hover:shadow-sm"
                >
                  {listing.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.images[0].url}
                      alt=""
                      className="h-20 w-24 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-xs text-zinc-400">
                      No photo
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold text-zinc-900">
                        {listing.title || "Untitled listing"}
                      </span>
                      <Badge
                        variant={STATUS_VARIANT[listing.submissionStatus]}
                      >
                        {SUBMISSION_STATUS_LABELS[listing.submissionStatus]}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-zinc-500">
                      {PROPERTY_TYPE_CONFIG[listing.type].label} ·{" "}
                      {listing.locality.name}
                      {listing.price > 0 &&
                        ` · ${formatPrice(listing.price, listing.priceUnit)}`}
                    </p>
                    {listing.submissionStatus === "rejected" &&
                      listing.reviewNote && (
                        <p className="mt-1 line-clamp-2 text-xs text-amber-700">
                          {listing.reviewNote}
                        </p>
                      )}
                    {missing.length > 0 &&
                      listing.submissionStatus === "draft" && (
                        <p className="mt-1 text-xs text-zinc-400">
                          Still needs {missing.join(", ")}
                        </p>
                      )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </HostShell>
  );
}
