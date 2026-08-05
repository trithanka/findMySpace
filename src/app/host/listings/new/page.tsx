import Link from "next/link";
import { PlaceStepForm } from "@/components/host/place-step-form";
import { createDraftListing } from "@/server/actions/host";
import { requireUser } from "@/server/auth-guard";
import { getLocalities } from "@/server/queries/localities";

export default async function NewListingPage() {
  await requireUser();
  const localities = await getLocalities();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link
        href="/host/listings"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-800"
      >
        ← My listings
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Where is your place?
        </h1>
        {/* No listing id yet — the draft row is only created when this step is
            saved, so the progress bar is rendered flat rather than linkable. */}
        <ol className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Step 1 of 5
        </ol>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7">
        <PlaceStepForm
          action={createDraftListing}
          localities={localities}
          submitLabel="Continue"
        />
      </div>
    </div>
  );
}
