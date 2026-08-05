import {
  HostStepShell,
  loadStepListing,
} from "@/components/host/host-step-shell";
import { PlaceStepForm } from "@/components/host/place-step-form";
import { updateListingLocation } from "@/server/actions/host";
import { getLocalities } from "@/server/queries/localities";

export default async function LocationStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await loadStepListing(id);
  const localities = await getLocalities();

  const save = updateListingLocation.bind(null, listing.id);

  return (
    <HostStepShell
      listing={listing}
      step="location"
      title="Where is your place?"
      subtitle="The pin stays private — visitors only see the locality and a rough circle."
    >
      <PlaceStepForm
        action={save}
        localities={localities}
        defaults={{
          type: listing.type,
          localityId: listing.localityId,
          latitude: listing.latitude,
          longitude: listing.longitude,
          addressLine: listing.addressLine,
          landmark: listing.landmark,
        }}
      />
    </HostStepShell>
  );
}
