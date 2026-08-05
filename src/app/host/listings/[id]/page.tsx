import { redirect } from "next/navigation";
import { loadStepListing } from "@/components/host/host-step-shell";
import { hostStepHref } from "@/lib/host-steps";

/** Bare `/host/listings/12` — send them to the summary for that listing. */
export default async function ListingIndexPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await loadStepListing(id);
  redirect(hostStepHref(listing.id, "review"));
}
