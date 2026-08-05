import {
  HostStepShell,
  loadStepListing,
} from "@/components/host/host-step-shell";
import { PhotoStepForm } from "@/components/host/photo-step-form";
import { hostStepHref } from "@/lib/host-steps";
import { saveListingPhotos } from "@/server/actions/host";

export default async function PhotosStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await loadStepListing(id);
  const save = saveListingPhotos.bind(null, listing.id);

  return (
    <HostStepShell
      listing={listing}
      step="photos"
      title="Add some photos"
      subtitle="Bright, uncluttered rooms get far more enquiries than staged ones."
    >
      <PhotoStepForm
        action={save}
        backHref={hostStepHref(listing.id, "basics")}
        existingUrls={listing.images.map((image) => image.url)}
      />
    </HostStepShell>
  );
}
