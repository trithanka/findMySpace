import {
  HostStepShell,
  loadStepListing,
} from "@/components/host/host-step-shell";
import { StepForm } from "@/components/host/step-form";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import {
  AMENITIES,
  FURNISHING_LABELS,
  GENDER_PREFERENCE_LABELS,
} from "@/lib/constants";
import { hostStepHref } from "@/lib/host-steps";
import { saveListingBasics } from "@/server/actions/host";

export default async function BasicsStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await loadStepListing(id);
  const save = saveListingBasics.bind(null, listing.id);

  return (
    <HostStepShell
      listing={listing}
      step="basics"
      title="Tell us about the place"
      subtitle="Write it the way you would describe it to someone on the phone."
    >
      <StepForm action={save} backHref={hostStepHref(listing.id, "location")}>
        <div>
          <Label htmlFor="title">Listing title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={listing.title}
            placeholder={`e.g. Spacious ${listing.type === "pg" ? "boys PG" : "2BHK"} near ${listing.locality.name}`}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            required
            defaultValue={listing.description}
            placeholder="Rooms, who it suits, what is nearby, house rules…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min={0}
              defaultValue={listing.bedrooms ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="furnishing">Furnishing</Label>
            <Select
              id="furnishing"
              name="furnishing"
              defaultValue={listing.furnishing ?? ""}
            >
              <option value="">Not specified</option>
              {Object.entries(FURNISHING_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="genderPreference">Who can stay</Label>
            <Select
              id="genderPreference"
              name="genderPreference"
              defaultValue={listing.genderPreference ?? "any"}
            >
              {Object.entries(GENDER_PREFERENCE_LABELS).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </Select>
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-zinc-700">
            What does it come with?
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 text-sm text-zinc-600"
              >
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity}
                  defaultChecked={listing.amenities.includes(amenity)}
                  className="h-4 w-4 rounded border-zinc-300 accent-brand-600"
                />
                {amenity}
              </label>
            ))}
          </div>
        </fieldset>
      </StepForm>
    </HostStepShell>
  );
}
