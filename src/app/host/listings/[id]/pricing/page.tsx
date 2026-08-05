import {
  HostStepShell,
  loadStepListing,
} from "@/components/host/host-step-shell";
import { StepForm } from "@/components/host/step-form";
import { Input, Label } from "@/components/ui/form";
import { hostStepHref } from "@/lib/host-steps";
import { saveListingPricing } from "@/server/actions/host";

export default async function PricingStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await loadStepListing(id);
  const save = saveListingPricing.bind(null, listing.id);
  const unit = listing.priceUnit === "night" ? "night" : "month";

  return (
    <HostStepShell
      listing={listing}
      step="pricing"
      title="Set your price"
      subtitle="You can change this any time — just resubmit the listing."
    >
      <StepForm action={save} backHref={hostStepHref(listing.id, "photos")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="price">Rent (₹ per {unit})</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={1}
              required
              defaultValue={listing.price || ""}
            />
          </div>
          <div>
            <Label htmlFor="deposit">Security deposit (₹, optional)</Label>
            <Input
              id="deposit"
              name="deposit"
              type="number"
              min={0}
              defaultValue={listing.deposit ?? ""}
            />
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-5">
          <h2 className="text-sm font-medium text-zinc-700">
            How we reach you
          </h2>
          <p className="mb-3 mt-1 text-xs text-zinc-500">
            Private. Enquiries come to us first — your number never appears on
            the public listing.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ownerName">Your name</Label>
              <Input
                id="ownerName"
                name="ownerName"
                defaultValue={listing.ownerName ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="ownerPhone">Phone number</Label>
              <Input
                id="ownerPhone"
                name="ownerPhone"
                type="tel"
                required
                defaultValue={listing.ownerPhone ?? ""}
                placeholder="10-digit mobile"
              />
            </div>
          </div>
        </div>
      </StepForm>
    </HostStepShell>
  );
}
