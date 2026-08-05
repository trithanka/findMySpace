import Link from "next/link";
import { notFound } from "next/navigation";
import { HostProgress } from "@/components/host/host-progress";
import type { HostStepSlug } from "@/lib/host-steps";
import { requireUser } from "@/server/auth-guard";
import { getHostListing, type HostListing } from "@/server/queries/host";

/**
 * Loads the listing for a wizard step, scoped to its owner. Someone else's id
 * in the URL is a 404, not a 403 — there is no reason to confirm the listing
 * exists to a host who does not own it.
 */
export async function loadStepListing(id: string): Promise<HostListing> {
  const session = await requireUser();
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) notFound();

  const listing = await getHostListing(numericId, session.user.id);
  if (!listing) notFound();
  return listing;
}

export function HostStepShell({
  listing,
  step,
  title,
  subtitle,
  children,
}: {
  listing: HostListing;
  step: HostStepSlug;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link
        href="/host/listings"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-800"
      >
        ← My listings
      </Link>

      <div className="mt-4">
        <HostProgress current={step} listingId={listing.id} />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
        {title}
      </h1>
      {subtitle && <p className="mt-1.5 text-sm text-zinc-600">{subtitle}</p>}

      {listing.submissionStatus === "rejected" && listing.reviewNote && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            We sent this back for changes
          </p>
          <p className="mt-1 text-sm text-amber-800">{listing.reviewNote}</p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7">
        {children}
      </div>
    </div>
  );
}
